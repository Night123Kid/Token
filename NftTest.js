const Web3 = require('web3')

class TransactionChecker {
    web3;
    account;

    constructor(projectId, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infuria.io/v3/' + projectId));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransactions(txHash);
                if (this.account = tx.to.toLowerCase()) {
                    console.log('Transaction found on block: ' + number);
                    console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                }
            }
        }
    }
}

var web3 = new Web3('http://rinkeby.infuria.io/v3/' + '8116e17c869942ceb3cdbe04cf7c7248');
web3.eth.getBlockNumber()
.then(console.log);