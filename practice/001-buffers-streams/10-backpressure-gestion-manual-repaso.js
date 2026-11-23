const fs = require('node:fs');
const { Writable } = require('node:stream')

function main() {
  console.log('Arranca el programa');

  const source = fs.createReadStream('mi-archivo.txt', { highWaterMark: 2 * 1024 });

  const output = fs.createWriteStream('salida-de-prueba.txt');

  const destiny = new Writable({
    highWaterMark: 1 * 1024, // Establecemos un umbral de memoria de 1KB para la escritur
    write(chunk, encoding, callback) {
      // Escribimos con un ligero retado, para crear la situación de 'backpressure'
      setTimeout(() => {
        
        // Si hacemos esto
        //output.write(chunk);
        //callback();
        // puede que se llame callback antes de escrbir.

        // en cambio si hacemos, nos aseguramos de que se llame a callback, es decir
        // se pida el otro trozo cuando realmente se haya escrito el archivo
        output.write(chunk,callback);

      }, 1000);
    },
    final(cb) {
      output.end(cb);
    },
  });

  const t = setInterval(() => {
    const usage = process.memoryUsage();
    console.log('Memoria usage', usage)

    console.log(`Memoria: - tamaño de la cola en el destiny ${destiny.writableLength / 1024} KB\n`);


  }, 1000) 

  destiny.on('drain', () => {
    console.log('se vacía el stream de escritura y se reanuda la lectura');
    source.resume();
  });

  destiny.on('finish', () => {
    clearInterval(t);
  })

  source.on('end', () => {
    destiny.end();
  });



  source.on('data', (chunk) => {
    //console.log('se lee del source stream', chunk)
    const enabled = destiny.write(chunk);
    console.log('enabled', enabled);

    if (!enabled) {
      console.log('debemos pausar el source para evitar el backpressure..');
      source.pause()
    }
  });



}


main();
