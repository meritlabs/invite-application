export function getGuildInfo(app: any, client: any, CHANNEL_NAME: string) {
  client.on('ready', () => {
    var guilds = client.guilds.array(),
      membersCount = 0;
    guilds.forEach((item: any) => {
      if (item.name === CHANNEL_NAME) {
        membersCount = item.memberCount;
        app.get('/', function(req: any, res: any) {
          res.jsonp({ channel: CHANNEL_NAME, members: membersCount });
        });
      }
    });
  });
}
