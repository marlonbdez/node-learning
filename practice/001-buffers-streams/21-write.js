const fs = require('node:fs');

function main() {
  const writable = fs.createWriteStream('./salida.txt');

  writable.write('línea 1\n');
  writable.write('línea 2\n');
  writable.write('línea 3\n');

  writable.end((err) => {
    console.log('callback err:', err);
    console.log('terminado...');
    const resultado = fs.readFileSync('./salida.txt');
    console.log('resultado', resultado);
  });

  writable.write('línea 4\n'); // la llamada inválida, después de end()
}

main()