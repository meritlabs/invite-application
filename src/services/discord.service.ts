import { messageTypes, commands } from './../common/ts/const';

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
export async function sendToChannels(client: any, channels: any, message: string) {
  return client.guilds.forEach((guild: any) => {
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

// Function for defining BOT commands
export function detectCommand(message) {
  let type: string = commands.regular;
  if (/^send invite to: #/.test(message)) return (type = commands.activate);
  if (/^#stop/.test(message)) return (type = commands.deactivate);
  if (/^#help/.test(message)) return (type = commands.help);
  if (/^#how-to-use/.test(message)) return (type = commands.howToUse);
  return type;
}

// Function for detecting message type
export function detectMessageType(pair: any, command: any, isBot: boolean) {
  let result: string;
  if (!pair && command === commands.activate && !isBot) result = messageTypes.joinToPair;
  if (pair && command === commands.regular && !isBot) result = messageTypes.regularMessage;
  if (pair && command === commands.activate && !isBot) result = messageTypes.inPair;
  if (command === commands.deactivate && !isBot) result = messageTypes.destroyPair;
  if (command === commands.help && !isBot) result = messageTypes.botHelp;
  if (command === commands.howToUse && !isBot) result = messageTypes.howToUse;
  if (!pair && command === commands.regular && !isBot) result = messageTypes.default;
  return result;
}
