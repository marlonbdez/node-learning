const fs = require('node:fs');

function main () {
  let chunkCounter = 0;
  let bytesCounter = 0;

  const sourceStream = fs.createReadStream('./prueba-23bytes.txt', {
    highWaterMark: 3
  });

  sourceStream.on('data', (chunk) => {
    console.log('chunk', chunk);
    console.log('chunk.length', chunk.length);
    if (chunk) {
      chunkCounter++;
      bytesCounter += chunk.length;
    }
  })

  sourceStream.on('error', (e) => {
    console.log('e', e);
  })

  sourceStream.on('end', () => {
    console.log('Chunk counter:', chunkCounter);
    console.log('Bytes counter:', bytesCounter);
  })

}

main()