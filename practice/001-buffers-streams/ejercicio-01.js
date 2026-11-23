// Convierte datos-ejercicio-01.csv en output.jsonl, una línea JSON por fila.
// Procesa el archivo en trozos pequeños, así que una línea puede llegar partida.
// resto guarda la parte incompleta; flush() procesa lo que quede al final.

const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

const readStream = fs.createReadStream('./datos-ejercicio-01.csv', {
  highWaterMark: 8,
  encoding: 'utf-8'
});

const writeStream = fs.createWriteStream('./output.jsonl');

let cabecera = null;
let resto = '';

function convertir(linea) {
  const values = linea.split(',');
  const objeto = {};

  for (let i = 0; i < cabecera.length; i++) {
    objeto[cabecera[i]] = values[i];
  }

  return JSON.stringify(objeto) + '\n';
}


const transformStream = new Transform({
  decodeStrings: false, // para que los chunks sean strings en lugar de buffers
  transform(chunk, encoding, callback) {

    const text = resto + chunk; // Concatenar el resto del chunk anterior con el nuevo chunk
    const lines = text.split('\n'); // Convertir el texto en un array de líneas divididas por salto de línea

    resto = lines.pop(); // Guardar la última línea incompleta para el siguiente chunk

    if (!cabecera) {
      cabecera = lines.shift()?.split(','); // Guardar la primera línea como cabecera si aún no se ha hecho
    }

    for (const line of lines) {
      const objeto = convertir(line); // Convertir la línea a un objeto JSON
      this.push(objeto); // Agregar el objeto JSON al flujo de salida
    }

    callback();
  },
  flush(callback) {
    if (resto) {
      const objeto = convertir(resto); // Convertir la última línea restante a un objeto JSON
      this.push(objeto); // Agregar el objeto JSON al flujo de salida
    }
    callback();
  }
});

async function parseCsvToJson() {
  try {
    await pipeline(
      readStream,
      transformStream,
      writeStream
    );
  } catch (err) {
    console.error('Error en el pipeline:', err);
  }
}

parseCsvToJson();
