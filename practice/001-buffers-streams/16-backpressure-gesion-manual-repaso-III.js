const fs = require('node:fs')
const { Writable } = require('node:stream')

function main() {
  const delay = 100;
  
  
  const source = fs.createReadStream('./mini.csv', {
    highWaterMark: 2
  });
  
  const output = fs.createWriteStream('./mini-copia.csv');

  const writable = new Writable({
    highWaterMark: 1,
    write(chunk, encoding, callback) {
      setTimeout(() => {
        output.write(chunk, callback);
      }, delay);
    }
  });

  source.on('data', (chunk) => {
    const canWrite = writable.write(chunk);

    if (!canWrite) {
      console.log('⏸️ Se pausa el stream de lectura')
      source.pause();
    } else {
      console.log("No se pausa")
    }
  });

  source.on('end', () => {
    console.log('🏁 EVENTO END');
    writable.end();
  });

  writable.on('drain', () => {
    console.log('⏯️ Se reanuda el stream de lectura', 'readableEnded:', source.readableEnded);
    source.resume();
  });

  const t = setInterval(() => {
    const memory = process.memoryUsage();
    const parseToMb = (data) => `${data / 1024 / 1024}Mb`


    console.log(`⏳ memoria RSS ${parseToMb(memory.rss)}, tamaño de cola del Stream writable ${writable.writableLength} Bytes`);
  }, 100);

  writable.on('finish', () => {
    output.end();
    clearInterval(t);
  })
}

main();

