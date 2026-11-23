const fs = require('node:fs');

async function ver() {
  for await (const chunk of fs.createReadStream('datos.csv', { encoding: 'utf8', highWaterMark: 8 })) {
    console.log('trozo:', JSON.stringify(chunk));
  }
}

ver();