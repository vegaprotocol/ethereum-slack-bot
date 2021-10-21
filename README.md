# ethereum-slack-bot

create `.env` file with Alchemy or Infura RPC connection URL to be used to setup ethereum web3 instance and a Slack webhook URL. e.g., 

    ALCHEMY_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/M217iz......

    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/....

Then replace `process.env.ALCHEMY_RPC_URL` in `src/index.js` with your RPC URL variable.


    npm i
    node run src/index.js
