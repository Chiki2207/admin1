const { encrypt } = require('./encryption');

// Contraseña a encriptar
const password = 'chiki12345';

// Encriptar la contraseña
const encryptedPassword = encrypt(password);

console.log('Contraseña encriptada:');
console.log(encryptedPassword);
console.log('\nReemplaza la línea DB_PASSWORD en tu archivo .env con:');
console.log(`DB_PASSWORD=${encryptedPassword}`); 