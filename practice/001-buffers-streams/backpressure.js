const fs = require('node:fs');
const path = require('node:path');
const { Writable } = require('node:stream');

// PASO 1: crear el destino lento.
// Cada trozo que recibe tarda 10 ms en procesarse.
// highWaterMark = 16 KiB: es el tamaño máximo de la cola de espera.
const destino = new Writable({
  highWaterMark: 16 * 1024,
  write(trozo, codificacion, siguiente) {
    // Cuando llamamos a "siguiente", le decimos a Node:
    // "ya terminé con este trozo, dame el siguiente".
    // Aquí esperamos 10 ms antes de avisar.
    setTimeout(siguiente, 10);
  }
});

// PASO 2: crear el origen.
// Lee el archivo en trozos de 16 KiB.
// path.join(__dirname, ...) busca el archivo junto a este script.
const origen = fs.createReadStream(path.join(__dirname, 'diez.bin'), {
  highWaterMark: 16 * 1024
});

// Contador de cuántas veces tuvimos que parar el origen
let pausas = 0;

// PASO 3: cada vez que el origen entrega un trozo...
origen.on('data', (trozo) => {
  // ...lo metemos en la cola del destino.
  // write() devuelve true si la cola aún tiene sitio,
  // o false si ya está llena.
  const cabe = destino.write(trozo);

  if (!cabe) {
    // PASO 4: la cola está llena. Paramos el origen.
    // Esto lo hacemos nosotros, con origen.pause().
    pausas++;
    origen.pause();

    // PASO 5: cuando la cola se vacía, el destino emite 'drain'.
    // Ahí volvemos a arrancar el origen con resume().
    destino.once('drain', () => origen.resume());
  }
});

// PASO 6: cuando el origen termina de leer todo el archivo,
// cerramos el destino y mostramos el número de pausas.
origen.on('end', () => {
  destino.end(() => console.log('Pausas:', pausas));
});