const fs = require('node:fs');

const salida = fs.createWriteStream('salida.txt');

salida.on('error', (err) => {
  console.error('Error:', err.message);
});

for (let i = 0; i < 2; i++) {
  salida.write(`Línea ${i}\n`);
}

salida.end(() => {
  console.log('Archivo creado');
});