// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import SolnSquareVerifierArtifact from '../../eth-contracts/build/contracts/SolnSquareVerifier.json'

// SolnSquareVerifier is our usable abstraction, which we'll use through the code below.
const SolnSquareVerifier = contract(SolnSquareVerifierArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let instance;
let proofInput = 2;
// let proof = require('../../eth-contracts/test/proof.json');
let proof = {
  "proof": {
    "a": ["0x0c28510360a96a46b5513da76bb689023b2b30b21bca1eb4c5848f163190422f", "0x030d061e57547158a928938628f9541e2f0ee1894ca4e6575ef76fb810fbe188"],
    "b": [["0x1293e47aa0cf701755acd61567b335bfd3bb6df624c393676913c7b24ff0e959", "0x14c24330e91f487f40e5a06429857ca98459be66d40a72b646b8c5ebcb2dff99"], ["0x03d2b0055e0ffb83cebddcebefe3e4431b3fb24510c5e40adb394d52a6104257", "0x183c9970fdb6278b3f6874543d599bc2579540880fb3f7ad6497738c726448a6"]],
    "c": ["0x23535e05e23383317b936ea430f0c825166c3f5515f41e4a213f6cecd4efb1d6", "0x0132eea2326c4acff8588484a9fc20ac42cc291567fa29b2a48d9996758b2b1b"]
  },
  "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000031", "0x0000000000000000000000000000000000000000000000000000000000000001"]
};

const start = async () => {
  // Bootstrap the MetaCoin abstraction for Use.
  SolnSquareVerifier.setProvider(web3.currentProvider)

  const accs = await web3.eth.getAccounts();
  accounts = accs
  account = accounts[0]
  console.log(accounts);

  console.log('web3.currentProvider...')
  console.log(web3.currentProvider);

  instance = await SolnSquareVerifier.deployed();
  let owner = await instance.owner.call();
  console.log('Contract owner: ' + JSON.stringify(owner));
  console.log(instance);
  // SolnSquareVerifier.deployed().then((err, ins) => {
  //   if (err) {
  //     console.log('deployed() error: ');
  //     console.log(err);
  //   }
  //   else {
  //     console.log('deployed() success ');
  //     console.log(ins);
  //     instance = ins;
  //   }
  // });
  //let contract_address = '0x318727Af2b07E3cCe71797e9f6429679eb213F9a';
  //instance = await SolnSquareVerifier.at(contract_address);
}
const mintToken = async () => {
  const id = document.getElementById("propertyid").value;
  const { proof: { a, b, c }, inputs: inputs } = proof;

  await instance.mintToken(account, id, a, b, c, [proofInput * proofInput, proofInput], { from: account, gas: 4500000 });
  proofInput++;
  App.setStatus(`New Property #${id} Owner is: ${account}`);
}

const tokenURI = async () => {
  const id = document.getElementById("propertyid").value;
  
  let uri = await instance.tokenURI.call(id, { from: account, gas: 4500000 });
  App.setStatus("tokenURI: " + uri + ".");
}

const isSolutionExist = async (input) => {
  const { proof: { a, b, c }, inputs: inputs } = proof;
  let key = await instance.getVerifierKey.call(a,b,c,[input*input, input], { from: account, gas: 4500000 });
  let owner = await instance.uniqueSolutions.call(key, { from: account, gas: 4500000 });
  App.setStatus("solution owner: " + owner + ".");
}


const App = {
  start: function () {
    start();
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  mintToken: function () {
    mintToken();
  },

  tokenURI: function () {
    tokenURI();
  },
  proofInput: proofInput,
  isSolutionExist: function(input){
    isSolutionExist(input);
  }
}

window.App = App

window.addEventListener('load', function () {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //
    // window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/a68c117be6e344c89ead078b58269e79'))
  }

  App.start()
})
