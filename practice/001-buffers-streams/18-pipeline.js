const fs = require('node:fs');
const { Writable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { rm } = require('node:fs/promises');

async function main () {

    const source = fs.createReadStream('./no-existe.csv', {
      highWaterMark: 2
    });
    
    const output = fs.createWriteStream('./mini-copia-3.csv');

    try {
      await pipeline(source, output)
    } catch (error) {
      console.log('error', error)
      await rm('./mini-copia-3.csv')
    }

}

main()
