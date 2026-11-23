const fs = require('node:fs');

// Opción A: esperar a tener todo el archivo en memoria
const todo = fs.readFileSync('007.z64');

console.log(todo.length);


// Opción B: procesar trozo a trozo
const stream = fs.createReadStream('007.z64');
let total = 0;
let trozos = 0;

stream.on('data', (trozo) => {
  trozos++;
  total += trozo.length;
});

stream.on('end', () => {
  console.log(`Leí ${trozos} trozos, ${total} bytes en total.`);
});