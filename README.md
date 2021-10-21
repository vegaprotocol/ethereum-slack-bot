# ethereum-slack-bot

create `.env` file with Alchemy or Infura RPC connection URL to be used to setup ethereum web3 instance and a Slack webhook URL. e.g., 

    ALCHEMY_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/M217iz......

    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/....

Then replace `process.env.ALCHEMY_RPC_URL` in `src/index.js` with your RPC URL variable.

    npm i
    node src/index.js --network=mainnet


Under /contract_addresses there must be a corresponding file with contract addresses named after the selected network using the `--network` flag above. e.g., mainnet.js or ropsten.js
