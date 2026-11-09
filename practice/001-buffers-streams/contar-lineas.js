const fs = require('node:fs');

async function contarLineas(ruta) {
  let resto = '';
  let total = 0;

  for await (const chunk of fs.createReadStream(ruta, { encoding: 'utf8', highWaterMark: 8 })) {
    const lineas = (resto + chunk).split('\n');
    resto = lineas.pop();
    total += lineas.length;
  }

  if (resto) total++;

  return total;
}

contarLineas('datos.csv').then((n) => console.log('Líneas:', n));