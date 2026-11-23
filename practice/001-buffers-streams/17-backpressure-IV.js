const fs = require('node:fs')
const { Writable } = require('node:stream')

function main() {

  let pauses = 0;
  let resumes = 0;

  const sourceStream = new fs.createReadStream('./mini.csv', {
    highWaterMark: 2 // 2 bytes de lectura
  });

  const outputStream = new fs.createWriteStream('./mini-maton.csv');

  const writableStream = new Writable({
    highWaterMark: 1, // 1 Byte de escritura,
    write: function (chunk, encoding, callback ) {
      setTimeout(() => {
        outputStream.write(chunk, callback);
      }, 100); // 100ms delay
    }
  });

  sourceStream.on('data', (chunk) => {
    console.log('🍕. Chunk recibido en lectura', chunk, '\n');
    const canWrite = writableStream.write(chunk);

    if (!canWrite) {
      console.log('⏸️. Se manda a pausar el stream de lectura', ++pauses);
      sourceStream.pause();
    }

  });


  sourceStream.on('end', () => {
    console.log('📢 ¡Se acabo lo que se daba!')
    writableStream.end();
  });

  writableStream.on('drain', () => {
    console.log('⏯️. Se manda a reanudar el stream de lectura', ++resumes);
    sourceStream.resume();
  });

  writableStream.on('finish', () => {
    console.log('🏁. Escritura terminada. Cerrando stream de escritura...');
    outputStream.end();
    console.log(`Pausas: ${pauses}, Reanudaciones: ${resumes}`);
  });
}

main();