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

// function for position messages in the public channel(s) of the selected guild
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

// Function for defining is is activation message
export function detectCommand(message) {
  let type: string = 'regular';
  if (/^send invite to: #/.test(message)) return (type = 'activate');
  if (/^#stop/.test(message)) return (type = 'deactivate');
  if (/^#help/.test(message)) return (type = 'help');
  if (/^#how-to-use/.test(message)) return (type = 'how-to-use');
  return type;
}

export function detectMessageType(pair: any, command: any, isBot: boolean) {
  let result: string;
  if (!pair && command === 'activate' && !isBot) result = 'join-to-pair';
  if (pair && command === 'regular' && !isBot) result = 'regular-message-to-client';
  if (pair && command === 'activate' && !isBot) result = 'already-in-pair';
  if (command === 'deactivate' && !isBot) result = 'destroy-pair';
  if (command === 'help' && !isBot) result = 'bot-help';
  if (command === 'how-to-use' && !isBot) result = 'how-to-use';
  if (!pair && command === 'regular' && !isBot) result = 'default-exception';
  return result;
}
