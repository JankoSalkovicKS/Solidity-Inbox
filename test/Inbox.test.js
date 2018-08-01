//za unit testove
const assert = require('assert');

//okolina ta lokalno testiranje (sam stvara nekoliko accounta)
const ganache = require('ganache-cli');

//portal u Ethereum svijet. ovaj Web3 je kao klasa s kojom možemo stvoriti instancu
const Web3 = require('web3');
/* Koristi se za:
        - deploy vlasitih pametnih ugovora
        - dohvaćanje i korištenje postojećih pametnih ugovora
*/

// lokalni ganache provider
const provider = ganache.provider();
// instanca Web3 klase -> glavni objekt za rad s pametnim ugovorima
const web3 = new Web3(provider);

// kompajlamo izvorni .sol kod
const {interface, bytecode} = require('../compile');

// setup testova
let accounts;
let inbox;
beforeEach(async () => {
    // dohvat dostupnih accounta
    accounts = await web3.eth.getAccounts();

    // JavaScript reprezentacija pametnog ugovora
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode, 
            arguments: ['Hi there!']
        })
        .send({
            from: accounts[0], 
            gas: '1000000'
        });

    /* To fix bug around web3 .26 version */
    inbox.setProvider(provider);
    /**/
});

// unit testovi
describe('Inbox', () => {
    it('deploys a contract', () => {
        
        //assert.ok will pass if the value is truthy
        assert.ok(inbox.options.address);
    });
    
    it('it has a default message', async () => {

        // 1. referenciramo ugovor (inbox)
        // 2. pristupamo metodama
        // 3. u metodama pozivamo metodu 'message()'
        // opaziti: imamo dva seta zagrada. Zagrade kod 'message' su za 
        //      postaviti parametre metode. Druge zagrade kod 'call' su za
        //      postavljanje nekih parametara oko samog ugovora. Gas, price, ...
        const message = await inbox.methods.message().call();

        assert.equal(message, 'Hi there!');
    });

    it('can change the message', async () => {
        const newMessage = 'bye';
        //we are trying to modify our smart contract
            // -> thats why we use 'send(...)'
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0]});
        const message = await inbox.methods.message().call();

        assert.equal(newMessage, message);
    });

});