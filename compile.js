/* 
    Iako Node nudi svoje funkcionalnosti s require, require bi u ovom
    slućaju probao svaki put izvršiti taj kod, a taj kod nije neki javascript kod
*/

const path = require('path');
const fs = require('fs');
//solidity compiler
const solc = require('solc');

//__dirname je konsatanta puta do root direktorija
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
//dohvaćamo izvorni kod
const source = fs.readFileSync(inboxPath, "utf8");

//kompajliramo 1 Samart Contract
module.exports = solc.compile(source, 1).contracts[':Inbox'];
