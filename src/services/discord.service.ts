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

// function for postion messages in the poblic channel(s) of the selected guild
export function sendToChannels(client: any, channels: any, message: string) {
  client.guilds.forEach((guild: any) => {
    //for each guild the bot is in
    let sendToChannels: any = channels.split(',');

    if (sendToChannels.length > 0) {
      sendToChannels.forEach((channelName: any) => {
        let channel = guild.channels.find(
          (channel: any) =>
            channel.type == 'text' &&
            channel.name == channelName &&
            channel.permissionsFor(guild.me).has('SEND_MESSAGES')
        );
        if (channel) channel.send(message);
      });
    } else {
      console.error('PLEASE SETUP CHANNELS');
    }
  });
}
