const fs = require('node:fs');
const { Writable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

async function main() {
  const origen = fs.createReadStream('diez.bin', { highWaterMark: 16 * 1024 });
  const archivo = fs.createWriteStream('salida-pipe.bin');

  const destino = new Writable({
    highWaterMark: 16 * 1024,
    write(chunk, _enc, cb) {
      setTimeout(() => archivo.write(chunk, cb), 20); // destino lento
    },
    final(cb) {
      archivo.end(cb);
    },
    destroy(err, cb) {
      archivo.destroy(err);
      cb(err);
    },
  });

  archivo.on('error', (err) => destino.destroy(err));

  const t = setInterval(() => {
    const m = process.memoryUsage();
    console.log(
      `cola=${destino.writableLength / 1024}KB arrayBuffers=${(m.arrayBuffers / 1024 / 1024).toFixed(1)}MB`
    );
  }, 200);

  try {
    await pipeline(origen, destino);
    console.log('Copia terminada');
  } catch (err) {
    console.error('Error:', err.message);
    fs.rmSync('salida-pipe.bin', { force: true });
  } finally {
    clearInterval(t);
  }
}

main();