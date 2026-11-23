const fs = require('node:fs')
const { pipeline } = require('node:stream/promises');
const { rm } = require('node:fs/promises');

async function main() {

  const entryFile = './datos.csv';
  const outputFile = './copia_datos.csv';
  const source = fs.createReadStream(entryFile);
  const output = fs.createWriteStream(outputFile);

  try {
    await pipeline(source, output);
    console.log('Copia realizada con éxito.');
  } catch (error) {
    console.log('un errorcito', error);
    await rm(outputFile, { force: true });
  }
}

main().catch((error) => {
  console.error('fallo inesperado', error);
});