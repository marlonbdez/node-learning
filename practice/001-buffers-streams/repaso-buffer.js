const texto = 'ñ€😀';
const buffer = Buffer.from(texto);
console.log('Buffer length', buffer.length);  // 9
console.log('[...texto].length', [...texto].length); //3
console.log('texto.length', texto.length); // 4
console.log("buffer.toString('utf8')", buffer.toString('utf8')); 


const bufferAlloc = Buffer.alloc(10);
console.log('bufferAlloc', bufferAlloc);
const bufferAllocUnsafe = Buffer.allocUnsafe(10);
console.log('bufferAllocUnsafe', bufferAllocUnsafe);


