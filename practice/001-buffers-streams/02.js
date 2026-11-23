const fs  = require('node:fs');

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';

console.log('Inicio, leyendo 007.z64...', mb(process.memoryUsage().rss));

//const todo = fs.readFileSync('007.z64');

//console.log('Leído todo, memoria usada:', mb(process.memoryUsage().rss));

const stream = fs.createReadStream('007.z64');
let total = 0;
let trozos = 0;

stream.on('data', (trozo) => {
  trozos++;
  total += trozo.length;
});

stream.on('end', () => {
  console.log(`Leí ${trozos} trozos, ${mb(total)} MB en total.`);
  console.log('Fin, memoria usada:', mb(process.memoryUsage().rss));
});