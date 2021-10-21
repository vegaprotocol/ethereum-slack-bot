const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const Web3 = require("web3");
const axios = require("axios");
const erc20ABI = require("../abi/Vega_V2_ABI.json");
require("dotenv").config({ path: ".env" });

const contractAddresses = require(`../contract_addresses/${argv.network}`);

console.log(`starting ethereum watcher on ${argv.network}`);

// VEGA token contract address
const CONTRACT_ADDR = contractAddresses.VEGA;


const web3 = new Web3(new Web3.providers.HttpProvider(process.env[`${(argv.network).toUpperCase()}_ALCHEMY_RPC_URL`].toString()))

const transferAbi = erc20ABI.find(
    (item) => item.type === "event" && item.name === "Transfer"
);

const decodeLog = (inputs, log) => {
    try {
        log.topics.shift();
        const evt = web3.eth.abi.decodeLog(inputs, log.data, log.topics);
        return { ...evt, block: log.blockNumber };
    } catch (error) {
        console.log(error);
        console.log(log);
    }
};

const notifySlack = (tokenAmount, from, to, txHash) => {
    if (argv.network == "mainnet") {
        txHash = `https://etherscan.io/tx/${txHash}`
    } else if (argv.network == "ropsten") {
        txHash = `https://ropsten.etherscan.io/tx/${txHash}`
    } else if (argv.network == "rinkeby") {
        txHash = `https://rinkeby.etherscan.io/tx/${txHash}`
    } else if (argv.network == "goerli") {
        txHash = `https://goerli.etherscan.io/tx/${txHash}`
    } else if (argv.network == "kovan") {
        txHash = `https://kovan.etherscan.io/tx/${txHash}`
    }

    axios
        .post(
            process.env.SLACK_WEBHOOK_URL.toString(),
            { 
                text: `[${(argv.network).toUpperCase()}] NEW VEGA Token Transfer for amount: ${tokenAmount}, from: ${from}, to: ${to}, tx: ${txHash}` 
            }
        )
        .then((res) => console.log(`statusCode: ${res.status}`))
        .catch((err) => console.log(err));
};

let fromBlock = 13460741;

const queryLogs = async () => {
    const latestBlock = await web3.eth.getBlock("latest");
    const toBlock = latestBlock.number;
    console.log(
        `-------- processing block from ${fromBlock} to ${toBlock} ---------`
    );

    const logs = await web3.eth.getPastLogs({
        address: CONTRACT_ADDR,
        fromBlock,
        toBlock,
    });

    if (logs.length > 0) {
        for (let i = 0; i < logs.length; i++) {
            const rawLog = logs[i];
            const log = decodeLog(transferAbi.inputs, rawLog);

            if ((log.from == contractAddresses.LP_Staking_Contract_1) || (log.from == contractAddresses.LP_Staking_Contract_2)) {
                const from = log.from;
                const to = log.to;
                const tokenAmount = log.value / Math.pow(10,18);
                const txHash = rawLog.transactionHash;

                console.log(`token transfered: ${tokenAmount}, from: ${from}, to: ${to}. tx: ${txHash}`);
                notifySlack(tokenAmount, from, to, txHash);
            }
        }
    }

    fromBlock = toBlock + 1;
};


setInterval(async () => {
    try {
        await queryLogs();
    } catch (error) {
        console.log(error);
    }
}, 60000);