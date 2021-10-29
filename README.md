# ethereum-slack-bot

create `.env` file with Alchemy or Infura RPC connection URL to be used to setup ethereum web3 instance and a Slack webhook URL. e.g., 

    <network_name>_INFURA_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/M217iz......

for example:
    MAINNET_INFURA_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/M217iz......

    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/....


Then script can be ran as follows:

    npm i
    node src/index.js --network=<network_name>


network_name can be mainnet or ropsten. e.g., 
    node src/index.js --network=mainnet

Under /contract_addresses there must be a corresponding file with contract addresses named after the selected network using the `--network` flag above. e.g., mainnet.js or ropsten.js

Update starting block number `fromBlock` variable in `index.js` prior to launching script.