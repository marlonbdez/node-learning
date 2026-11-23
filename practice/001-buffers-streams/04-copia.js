const fs = require('node:fs');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const aMayusculas = new Transform({
  decodeStrings: false,
  transform(chunk, encoding, callback) {
    console.log('Tipo:', typeof chunk, 'Encoding:', encoding);
    console.log('Tipo de chunk:', typeof chunk);
    console.log('Longitud del chunk:', chunk.length);
    console.log('Contenido del chunk:', chunk);
    this.push(chunk);
    callback();
  }
});


async function copiar() {
  try {
    await pipeline(
      fs.createReadStream('mi-archivo.txt', { 
        encoding: 'utf8',
        highWaterMark: 10
      }),
      aMayusculas,
      fs.createWriteStream('copia2.txt')
    );
    console.log('Copia creada');
  } catch (err) {
    console.error('Error:', err.message);
    fs.rmSync('copia.txt', { force: true });
  }
}

copiar();