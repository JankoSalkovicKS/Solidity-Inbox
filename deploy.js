const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require ('web3');
const { interface, bytecode} = require('./compile');

// Truffle provider (za pristup "pravoj" Rinkbey mreži)
const provider = new HDWalletProvider(
    // as said, this MNEMONIC specifies our Ethereum accounts
    'horror flag gossip knee under travel veteran uphold power that alarm yellow',
    'https://rinkeby.infura.io/v3/54e6c302444d459fa67577dc9c7792bb'
);

// Web3 instance
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: bytecode,
        arguments: ['Hi there!']
    })
    .send({
        gas: '1000000',
        from: accounts[0]
    });

    console.log('Contract deployed to', result.options.address);
}
deploy();
    