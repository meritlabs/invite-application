# Invite Application

Merit Invite Application Discord bot.

# Getting started

To work on this project, you need:
- node.js
- yarn

Start with installing dependencies:
```
yarn 
```

Configure environment:
```
export GUILD_NAME = my-guild # discord server name
export CHANNELS = my-channels # discord channel name
export BOT_TOKEN = my-token # discord auth token
export PORT = 8080 # port for the bot server
export DEBUG = true # debug flag
export WALLET_APPLICATION = http://testnet.wallet.merit.me # URL to wallet application
export MWS_URL = http://testnet.mws.merit.me # URL to the MWS server
```

Run the server:
```
yarn start # for production
yarn start:dev # for development
```

Deploy it:
```
`./deploy.sh`
```

The application is designed to be deployed to Heroku, but can be used on bare metal or in container.

## Contributing

Please, check out our [Contribution guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](./LICENSE).**

Copyright (C) 2017 - 2018 The Merit Foundation.