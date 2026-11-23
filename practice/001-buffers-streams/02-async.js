const fs  = require('node:fs');

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';

console.log('Inicio, leyendo ', mb(process.memoryUsage().rss));

const stream = fs.createReadStream('grande.bin');
let total = 0;
let trozos = 0;

stream.on('data', (trozo) => {
  trozos++;
  total += trozo.length;
});

stream.on('end', () => {
  console.log(`Leí ${trozos} trozos, ${mb(total)} MB en total.`);
  console.log('Fin, memoria usada RSS en MB:', mb(process.memoryUsage().rss));
  console.log('Fin, memoria usada:', process.memoryUsage());
});