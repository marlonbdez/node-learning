const fs = require('node:fs')
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');


async function main() {

  const source = fs.createReadStream('./mi-archivo.txt', {
    encoding: 'utf8',
    highWaterMark: 2
  })

  const output = fs.createWriteStream('./mi-archivo-mayusculas.txt')

  const transform = new Transform({
    decodeStrings: false,
    transform(chunk, encoding, callback) {
      console.log('chunk', chunk);
      this.push(chunk.toUpperCase());
      callback()
    }
  })

  try {
    await pipeline(source, transform, output)
  } catch (error) {
    console.log('error', error)
    fs.rm('mi-archivo-mayusculas.txt')
  }
}

main()