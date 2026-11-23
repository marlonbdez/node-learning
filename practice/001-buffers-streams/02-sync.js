const fs  = require('node:fs');

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';

console.log('Inicio, leyendo', mb(process.memoryUsage().rss));

const todo = fs.readFileSync('grande.bin');

console.log('Leído todo, memoria usada:', process.memoryUsage());
console.log('Leído todo, memoria usada:', mb(process.memoryUsage().rss));
