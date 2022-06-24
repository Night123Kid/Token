let Web3 = require('web3');
// let abiDecoder = require('abi-decoder'); // NodeJS
// let BigNumber = require('bignumber.js')

// let web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"));
let web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));

// let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// let EthereumTx = require('ethereumjs-tx');
// let MintFactoryAbi = require('./contracts/MintFactory.json').abi;
// let MintContract = '0x56Aa5128a5d0A174176F6412C9b3204562cd8B48';

// let LockFactoryAbi = require('./contracts/LockFactory.json').abi;
// let LockContract = '0x1B6BbE010a05FC031C81e4DDe9198b05e1448345';

// let caller = '0xe70Ad86C51049DF98B01a010C44Db915DD2DAEab';
// let callAbi = require('./contracts/call.json').abi;

// let tokenABi = require('./contracts/tokenA.json').abi;
// let unlockAbi = require('./contracts/unlock.json').abi;
// let lpAbi = require('./contracts/LpBasePool.json').abi;
// let svlAbi = require('./contracts/SvlBasePool.json').abi;
const privateKey =  Buffer.from('e828c0cba48202a68d995bb883407b84a2e703d82b837041e87abeff0a34437f',"hex")
// const account = web3.eth.accounts.privateKeyToAccount("0x2b3dab354c27c508a51f5eb97b47d133b946376d4182e80b465f9a6164acf0ac");
const account = web3.eth.accounts.privateKeyToAccount("0xe828c0cba48202a68d995bb883407b84a2e703d82b837041e87abeff0a34437f");
const address = account.address
console.log("address: ",address)

const tokenAbi = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenOwner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "burnFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			},
			{
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "approveAndCall",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	}
]

// exports.getData = async function(req, res){
//     abiDecoder.addABI(unlockAbi);
//     let decodedData = abiDecoder.decodeMethod('0x88e1f2520000000000000000000000000000000000000000000003635c9adc5dea000000000000000000000000000000f4b8a3047c9b249fe179772d2c1b63da736f293c');
//     console.log(decodedData)
// }

getRet()

async function getRet(req, res){
    let contract = new web3.eth.Contract(tokenAbi, '0xd3d6C3AE08dAA2170e56919310cAeDDc47d17fD5');
    let sings = await contract.methods.decimals().call();
    console.log(sings)
}

// exports.account = async function(req, res){
//     let amounts = new BigNumber(1).multipliedBy(new BigNumber(2 * Math.pow(2, 256-1))).toString(10)
//     console.log(amounts)
//     // let liquidity = new BigNumber(1000000000000000000000000).dividedBy(new BigNumber(1 * Math.pow(10, 18))).dividedBy(new BigNumber(365*24*60*60)).toString(10)
//     // console.log(liquidity)
//     // let result = new BigNumber(10).dividedBy(new BigNumber(7)).multipliedBy(new BigNumber(1 * Math.pow(10, 18))).toString(10);
//     // console.log(result)
// }
// exports.BalanceOf = async function(req, res){
//     let contract = new web3.eth.Contract(tokenABi, '0x1F4773eE9425dE148c55681cA4f6945270c400EC');
//     let sings = await contract.methods.balanceOf('0xEA6ba91Ae613ad2A30E4A212E4bA318798AC495d').call();
//     console.log(sings)
// }

// exports.BalanceOfs = async function(req, res){
//     let contract = new web3.eth.Contract(lpAbi, '0xd3d6C3AE08dAA2170e56919310cAeDDc47d17fD5');
//     let sings = await contract.methods.balanceOf('0xff4debb853d522d7038197c398385e5dfdbcdd55').call();
//     console.log(sings)
// }

// exports.Allowance = async function(req, res){
//     let contract = new web3.eth.Contract(tokenABi, '0x1F4773eE9425dE148c55681cA4f6945270c400EC');
//     let sings = await contract.methods.allowance('0xDeEa89B207cC8Ff462722bB2c55846ea5a6AdC3F','0x725EcDCcE575eB628841c16a4C1498eBff1E516D').call();
//     console.log(sings)
// }

// exports.GetUnLockReword = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x535517E6d62718E9c4a070BD13d71ea13D2d838E');
//     let sings = await contract.methods.getunLockReword().call({from: '0xFF4dEBb853D522D7038197c398385E5DfdBcdd55'});
//     console.log(sings)
// }

// exports.GetCaller = async function(req, res){
//     let contract = new web3.eth.Contract(lpAbi, '0xc5660Ea4cEac806B98ae2Fe00be2fd8ea45708A1');
//     let sings = await contract.methods.Caller().call();
//     console.log(sings)
// }

// exports.SetCaller = async function(req, res){
//     let contract = new web3.eth.Contract(svlAbi, '0xc5660Ea4cEac806B98ae2Fe00be2fd8ea45708A1');
//     let sings = await contract.methods.setCaller('0x7Cd6a82e321A9245Eaf976267B3c3ab7372E273a').encodeABI();
//     let data = await signTransaction({
//         from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4',
//         to: '0xc5660Ea4cEac806B98ae2Fe00be2fd8ea45708A1',
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)
// }

// exports.UpdateOrder = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x33dC2b645f7a936955d63A10226F18516F3584b1');
//     let sings = await contract.methods.updateOrder(0).encodeABI();
//     let data = await signTransaction({
//         from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4',
//         to: '0x33dC2b645f7a936955d63A10226F18516F3584b1',
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)
// }


// exports.GetLockArr = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x535517E6d62718E9c4a070BD13d71ea13D2d838E');
//     let sings = await contract.methods.getLockArr().call({from: '0xFF4dEBb853D522D7038197c398385E5DfdBcdd55'});
//     console.log(sings)
// }

// exports.GetLockedData = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x33dC2b645f7a936955d63A10226F18516F3584b1');
//     let sings = await contract.methods.getLockedData('2').call({from: '0x851632be3F0911abB5aA5A75b17E7CED304C8f71'});
//     console.log(sings)
//     let index = sings.index;
//     console.log(index);
// }

// exports.GetEarndByShorel = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x535517E6d62718E9c4a070BD13d71ea13D2d838E');
//     let sings = await contract.methods.getEarndByShorel('0x43735852dA0BAC6e28071AE0C6375fFe570A2a23',
//         '0xDeEa89B207cC8Ff462722bB2c55846ea5a6AdC3F').call();
//     console.log(sings)
// }

// exports.GetEarndBySvlPledge = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x33dC2b645f7a936955d63A10226F18516F3584b1');
//     let sings = await contract.methods.getEarndBySvlPledge('0x3eDF9a239Cd6abe4126Bb1cFa64c4F64029f63E2').call({from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4'});
//     console.log(sings)
// }

// exports.Approve = async function(req, res){
//     let contract = new web3.eth.Contract(tokenABi, '0x1F4773eE9425dE148c55681cA4f6945270c400EC');
//     let sings = await contract.methods.approve('0xD0c09aE3A1d783AaD0D4B5E4CD4738834F59f0f4','5000000000000000000000000000').encodeABI();
//     let data = await signTransaction({
//         from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4',
//         to: '0x1F4773eE9425dE148c55681cA4f6945270c400EC',
//         data: sings,
//         value: '0x00',
//     })
//     console.log(data)
// }

// exports.GetRewardBySvlPledge = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0xc5E1a6cbB5D68A999e79C6528840A74d8977C58B');
//     let sings = await contract.methods.getRewardBySvlPledge('500000000000000000000','0x4a0Ccb67Df485aEC2cA1dbF774ED85e60BCbb20B').encodeABI();
//     let data = await signTransaction({
//         from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4',
//         to: '0xc5E1a6cbB5D68A999e79C6528840A74d8977C58B',
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)
// }

// exports.Stake = async function(req, res){
//     let contract = new web3.eth.Contract(unlockAbi, '0x33dC2b645f7a936955d63A10226F18516F3584b1');
//     let sings = await contract.methods.stake('500000000000000000000').encodeABI();
//     let data = await signTransaction({
//         from: '0x93FED44716783fc84A582485Ae5d812Ab95489B4',
//         to: '0x33dC2b645f7a936955d63A10226F18516F3584b1',
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)
// }

// exports.getCaller = async function(req, res){
//     let contract = new web3.eth.Contract(callAbi, caller);
//     let sings = await contract.methods.getCal().encodeABI();
//     console.log(sings);
//     // let data = await signTransaction({
//     //     from: '0xaB110e2f6A412aaC10164997E342256fD1da6FeD',
//     //     to: caller,
//     //     data: sings,
//     //     value:'0x00',
//     // })
//     console.log(data)

//     abiDecoder.addABI(callAbi);
//     let decodedData = abiDecoder.decodeMethod(data.logsBloom);
//     console.log(decodedData)

// }
// exports.update = async function(req, res){
//     let contract = new web3.eth.Contract(LockFactoryAbi, LockContract);

//     let index = 1;
//     let state = 2;
//     let sings = await contract.methods.updateState(index, state).encodeABI();

//     let data = await signTransaction({
//         from: '0xF5671b7ea1dE770DDe14e7bBC9D98a547EB63637',
//         to: LockContract,
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)

//     abiDecoder.addABI(LockFactoryAbi);
//     let decodedData = abiDecoder.decodeMethod(data.logsBloom);
//     console.log(decodedData)
// }

// exports.Ver = async function(req,res){
//     let contract = new web3.eth.Contract(MintFactoryAbi, MintContract);

//     let pkx = '0x52217945891e3a11976722c28a7754f575bb5e4d1bd3f324cd8452aa5d6233b4';
//     let message = '0x243f6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89';
//     let sign = '0xdb740ebed238b509e6f3d8763e4770ec860ee3b5888471bb27d9625dc0c39471ab65550eb8c9dff88943f916d0d45b28083cbd8a30d6b630b3ac8cc96f5bc0e8';
//     let erc20 = '0xDeFEBBB9f95411b2fB411911661d69908cB2bB82';
//     let amount = '100000000000000000000';
//     let address = '0xa516A08E1D56dcDA36e66Fe62F7dFa2236E5e31e';

//     let sings = await contract.methods.mint(pkx,message,sign,erc20,amount,address).encodeABI();
//     let data = await signTransaction({
//         from: '0xa3a4C81394190D52CcaDDf4b97621A58492ab8a9',
//         to: MintContract,
//         data: sings,
//         value:'0x00',
//     })
//     console.log(data)

// }

// async function signTransaction(rawTx) {
//     try {
//         let nonce = await web3.eth.getTransactionCount(address);
//         rawTx.gasPrice = await web3.eth.getGasPrice()
//         let gas = await web3.eth.estimateGas(rawTx);
//         // // 1820215604638591079751722400000
//         // let gas = 500;
//         rawTx.gas = gas;
//         rawTx.gasLimit = gas * 2;
//         rawTx.nonce = nonce;
//         console.log(rawTx);
//         let tx = new EthereumTx(rawTx);
//         tx.sign(privateKey);
//         let data = await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
//         return data;
//     } catch (e){
//         console.error(e);
//     }
// }

// exports.cross = async function(req,res){
//     try {
//         // let pubKeyLeft = '0x5d3052dc4f70bf452b2487c35531840ffaf1ba5e18602e704337d71d93fe897a';
//         // let sin = 'd6a1f30f68bbd7aa816cfd5a95ca44fb29a079ca79bde38df94dbb08d3de46b7f82ebffbc8c1c64f98d6cb133dbdc0217cbe10d33204643a42564805ca1e59d7'
//         //
//         let contract = new web3.eth.Contract(MintFactoryAbi, MintContract);
//         // let Pk = await contract.methods.getPubkey(pubKeyLeft).call();
//         // let message = '0x243f6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89';
//         // let r = '0x' + sin.substr(0,64);
//         // let s = '0x' + sin.substr(64);
//         // console.log(Pk)
//         // let data = web3.utils.toHex(Pk[1]).substr(2);
//         // console.log(data)
//         // let pubKey = pubKeyLeft+data;
//         //
//         // console.log('s：'+ s);
//         // console.log('r：'+ r);
//         // console.log('pubKey：'+ pubKey);

//         let sings = await contract.methods.VerifyProof(pubKey,message,s,r).call();
//         console.log(sings);
//         // return
//         if (sings == true){
//             let to = '0x2C7239c1fDc3633a6d153629de821230aDf364bc';
//             let token = '0xcE2B0ed629dFceDA809E63741C66B831F0957F7a';
//             let amount = '1000000000000000000000';
//             let res = await contract.methods.rescue(to,token,amount).encodeABI();
//             console.log(res);
//             let data = await signTransaction({
//                 from: '0x32B59202E6f94432B748F9d2F68141427Eda7D66',
//                 to: MintContract,
//                 data: res,
//                 value:'0x00',
//             })
//             console.log(data)
//         }
//     } catch (e) {
//         console.error(e);
//     }
// }

