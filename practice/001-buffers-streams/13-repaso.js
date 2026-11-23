// Ejercicio 1.
const texto = 'ñ€😀';
// ñ - 2 bytes
// € - 3 bytes
// 😀 - 4 bytes

console.log('texto.length', texto.length); // 4 caracteres, el emoji cuenta por 2 caracteres.

const buffer = Buffer.from(texto);
console.log('Mostrando buffer', buffer); //Ejemplo: <Buffer ?? ?? ?? ?? ?? ?? ?? ?? ??> 
console.log('Mostando su length', buffer.length); // 9 bytes
console.log('Imprimiendo desde un array [...texto.length]', [...texto].length); // 3 caracteres
console.log('Decodificaco buffer', buffer.toString('utf8')); // Sale: 'ñ€😀'


// Ejercicio 2.
const bufferAlloc = Buffer.alloc(4);
const bufferAllocUnsafe = Buffer.allocUnsafe(4);

console.log('bufferAlloc', bufferAlloc) // <Buffer 00 00 00 00>
console.log('bufferAllocUnsafe', bufferAllocUnsafe) // <Buffer ?? ?? ?? ??>

/**
 * En ambos casos se crea un buffer, se reserva un espacio de memoria para guardar información
 * en el caso de alloc, ese buffer se crea con los bytes a 0
 * mientras que con allocUnsafe, ese buffer puede contener bytes que no estén a cero,
 * que formen parte de un espacio de memoria y se podría decir que el buffer no está limpio
 * 
 * el alloc es más lento.
 * el allowUnsafe es más rápido, pero con el inconveniente que los bytes no están garantizados que estén a 0
 * 
 * 
 * el alloc se utiliza cuando te interesa que los bytes iniciales estén a 0.
 * 
 * el allowUnsafe tiene sentido cuando lo que quieres es escribir información en el buffer antes de leerlo
 */