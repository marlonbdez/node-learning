const fs = require('node:fs');
const { Writable } = require('node:stream');


const origen = fs.createReadStream('grande.bin', { highWaterMark: 10 * 1024 }); // 10 KB
const archivo = fs.createWriteStream('copia-nueva.bin');



const destino = new Writable({
  highWaterMark: 4 * 1024, // 4KB - umbral de la cola de destino
  write(chunk, _enc, cb) {
    setTimeout(() => {
      // El callback se ejecuta cuando el archivo termina de escribir el fragmento.
      archivo.write(chunk, cb);
    }, 15) // destino lento
  },
  final(cb) {
    archivo.end(cb)
  }
})



origen.on('data', (chunk) => {
  //console.log('Chunk recibido:', chunk.length, 'bytes');
  const canWrite = destino.write(chunk);
  //if (!canWrite) {
    //console.log('Buffer lleno, esperando a que se vacíe...');
    //origen.pause();
  //}
});

destino.on('drain', () => {
  //console.log('Buffer vacío, reanudando lectura...');
  origen.resume();
});

origen.on('end', () => {
  console.log('Lectura completada.');
  destino.end();
});

const t = setInterval(() => {
  const m = process.memoryUsage();

  console.log(
    `cola=${destino.writableLength / 1024 }KB arrayBuffers=${(m.arrayBuffers / 1024 / 1024).toFixed(1)}MB rss=${(m.rss / 1024 / 1024).toFixed(0)}MB`
  );
}, 200);

destino.on('finish', () => {
  clearInterval(t);
  console.log('Escritura completada.');
});
