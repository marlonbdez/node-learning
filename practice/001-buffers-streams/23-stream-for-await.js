const fs = require('node:fs');

async function main() {
  let counter = 0;
  let rest = ''

  const source = fs.createReadStream('./mini.csv', {
    highWaterMark: 2,
    encoding: 'utf8'
  });

  for await (const chunk of source) {
    console.log('chunk', chunk);

    const text = rest + chunk;
    const lines = text.split('\n');
    console.log('lineas antes del pop', lines)
    rest = lines.pop() //sacamos el último elemento del array, si es un solo elemento sale completo, si son varios, es evidente que sacamos un elemento que viene después de un salto de línea

    for (const line of lines) {
      counter++;
    }

    console.log('lineas después del pop', lines)
    console.log('rest', rest)
  }


  console.log('counter', counter);
}

main()