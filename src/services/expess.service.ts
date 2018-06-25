// Function for getting and checking guild
export function getGuildInfo(app: any, client: any, GUILD_NAME: string) {
  client.on('ready', () => {
    var guilds = client.guilds.array(),
      membersCount = 0;
    guilds.forEach((item: any) => {
      if (item.name === GUILD_NAME) {
        membersCount = item.memberCount;
        app.get('/', function(req: any, res: any) {
          res.jsonp({ channel: GUILD_NAME, members: membersCount });
        });
      }
    });
  });
}

export function formConfig(app: any, params: any) {
  app.get('/application', function(req: any, res: any) {
    res.jsonp({ wallet_app: params.wallet, mws: params.mws });
  });
}
