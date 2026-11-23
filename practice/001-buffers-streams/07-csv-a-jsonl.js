const fs = require('node:fs');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

function csvAJsonl() {
  let resto = '';
  let cabecera = null;

  function convertir(linea) {
    linea = linea.replace(/\r$/, '');
    if (!linea.trim()) return null;

    const valores = linea.split(',');
    if (!cabecera) {
      cabecera = valores;
      return null;
    }

    const fila = {};
    cabecera.forEach((nombre, i) => {
      fila[nombre] = valores[i];
    });
    return JSON.stringify(fila) + '\n';
  }

  return new Transform({
    decodeStrings: false,
    transform(chunk, encoding, callback) {
      const lineas = (resto + chunk).split('\n');
      resto = lineas.pop(); // la última puede estar incompleta
      for (const linea of lineas) {
        const salida = convertir(linea);
        if (salida) this.push(salida);
      }
      callback();
    },
    flush(callback) {
      const salida = convertir(resto);
      if (salida) this.push(salida);
      callback();
    }
  });
}

async function main() {
  try {
    await pipeline(
      fs.createReadStream('datos.csv', { encoding: 'utf8', highWaterMark: 8 }),
      csvAJsonl(),
      fs.createWriteStream('datos.jsonl')
    );
    console.log('Conversión lista');
  } catch (err) {
    console.error('Error:', err.message);
    fs.rmSync('datos.jsonl', { force: true });
  }
}

main();