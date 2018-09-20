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
export GUILD_NAME = process.env.GUILD_NAME || config.ENV.GUILD_NAME,
export CHANNELS = CHANNELS || config.ENV.CHANNELS,
export BOT_TOKEN = my-token # discord auth token
export APP_SLUG = process.env.APP_SLUG || config.ENV.APP_SLUG,
export PORT = process.env.PORT || config.ENV.PORT,
export DEBUG = process.env.DEBUG || config.ENV.DEBUG,
export WALLET_APPLICATION = process.env.WALLET_APPLICATION || config.ENV.WALLET_APPLICATION,
export MWS_URL = process.env.MWS_URL || config.ENV.MWS_URL;
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