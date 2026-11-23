const fs = require('node:fs');
const { Writable } = require('node:stream');

const origen = fs.createReadStream('diez.bin', {
  highWaterMark: 16 * 1024 // 16KB
});

const destino = new Writable({
  highWaterMark: 16 * 1024, // 16KB
  write(chunk, _enc, cb) {
    setTimeout(cb, 20)
  }
});

const t = setInterval(() => {
  const m = process.memoryUsage();

  console.log(
    `cola=${destino.writableLength / 1024 }KB arrayBuffers=${(m.arrayBuffers / 1024 / 1024).toFixed(1)}MB rss=${(m.rss / 1024 / 1024).toFixed(0)}MB`
  );
}, 200);

origen.pipe(destino);

destino.on('finish', () => {
    clearInterval(t);
  console.log('fin');
})

