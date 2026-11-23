const fs = require('node:fs');
const { Writable } = require('node:stream')

function main() {
  const entryFile = 'mini.csv';
  const outputFile = 'copia_mini.csv'
  
  let pauseCounter = 0;

  const source = fs.createReadStream(entryFile, { highWaterMark: 1, encoding: 'utf8' }); // Puede leer 2 bytes en el buffrer
  const output = fs.createWriteStream(outputFile);

  const slowWriteStream = new Writable({
    highWaterMark: 4, // Puede escribir 1 Byte a la vez, ese es su umbral
    write(chunk, encoding, callback) {
      output.write(chunk, callback); // Escribe en el stream de escritura, y llama a callback para procesar el siguiente trozo
      /*setTimeout(() => {
      }, 100); // se tarda 100ms en lanzar la petición de escritura al stream de escritura.*/
    }
  });

  source.on('data', (chunk) => {
    console.log('Leemeos en origen el chunk:', chunk);
    const canWrite = slowWriteStream.write(chunk);

    if (!canWrite) {
      pauseCounter++;
      // Si el slowWriteStream está ocupado, mandamos a detener el stream de lectura.
      source.pause();
      console.log('PAUSAMOS ORIGEN')
    }
  });

  const t = setInterval(() => {
    const { rss, arrayBuffers } = process.memoryUsage();
    //console.log('memory', m);
    console.log(`memoria total usada (rss): ${rss / 1024 / 1024} MB`); // RSS está en bytes, convertirmos a KB dividendo por 1024, y luego a MB de nuevo por 1024
    console.log(`tamaño de los buffers en memoria (arrayBuffers):`, (arrayBuffers / 1024),'KB');
    console.log('espacio ocupado en la cola del stream de escritura slowWriteStream', slowWriteStream.writableLength, 'bytes');

  }, 100);

  slowWriteStream.on('drain', () => {
    // Cuando se vacíe la cola del stream slowWriteStream, se reanuda el stream de lectura.
    source.resume();
  });

  slowWriteStream.on('finish', () => {
    output.end(); // Se cierra
  });

  source.on('end', () => {
    clearInterval(t)
    console.log('pausas', pauseCounter);
    slowWriteStream.end()
  });
}

main();