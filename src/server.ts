declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import * as discordService from './services/discord.service';
import * as wsService from './services/websocket.service';
import * as compileMessage from './services/compile-message.service';
import { chatPair, wsMessage } from './common/ts/classes';

const app = express(),
  server = http.createServer(app),
  discordClient = new Discord.Client(),
  GUILD_NAME = process.env.GUILD_NAME || '',
  CHANNELS = process.env.CHANNELS || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '';

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

//Discord bot login
discordClient.login(BOT_TOKEN);

//start server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${(server.address() as any).port}`);
});

let time: number = 0,
  fakeId: number = 0,
  chatPairs = [];

wss.on('connection', (ws: WebSocket) => {
  let connectionID = wsService.screateConnectionID(fakeId++);
  (ws as any).id = connectionID;

  ws.on('message', (message: string) => {
    let compiledMessage = compileMessage.inviteRuquest(message, connectionID);
    discordService.sendToChannels(discordClient, CHANNELS, compiledMessage);
  });
});

discordClient.on('message', (message: any) => {
  let type: string = message.channel.type,
    _message: string = message.content;

  if (type === 'dm') {
    let discordUser: any = message.channel.recipient.username;
    let pair = wsService.checkPair(chatPairs, discordUser);

    switch (discordService.detectMessageType(pair, discordService.detectCommand(_message), message.author.bot)) {
      case 'join-to-pair':
        let connection = wsService.getConnection(wss, wsService.parseConnection(_message));
        let welcomeMessage = JSON.stringify(new wsMessage(discordUser, 'Joined!'));
        if (connection) {
          connection.discordUser = message.author;
          chatPairs.push(new chatPair(discordUser, connection.id));
          connection.send(welcomeMessage);

          message.author.send(`Connected to: \`${connection.id}\`
          \nYou you can send your invite code to current user, sure if his welcome message was valid by Merit mentality!
          \n After invite message sendig, please close session, using \`#stop\` command\n Have questions? type \`#help\``);
          discordService.sendToChannels(discordClient, CHANNELS, `request whit id ${connection.id} taken!`);
        } else {
          message.author.send(`Unable to connect!
          \n 1) Please check that you enter right connction id in format \`send invite to: #0-0000000000000@\`
          \n 2) Somebody from the community already connected to this clien.
          \n 3) Connection expired (closed).`);
        }
        break;
      case 'regular-message-to-client':
        wsService.getConnection(wss, pair.get('wsUser')).send(JSON.stringify(new wsMessage(discordUser, _message)));
        break;
      case 'already-in-pair':
        let inPairMessage = `OOooops, you already connected to site client \`${pair.get(
          'wsUser'
        )}\`\n Please type \`#stop\` if you wanna break previous connection.`;
        message.author.send(inPairMessage);
        break;
      case 'destroy-pair':
        if (pair) {
          let index = chatPairs.indexOf(pair);
          if (index > -1) {
            chatPairs.splice(index, 1);
            message.author.send('Pair destroyed, now you can connect to new clients!');
          }
        } else {
          message.author.send('You dont have active connection');
        }
        break;
      case 'bot-help':
        let helpMessage = `***MERI BOT**\n*Merit bot aims on connect new users between existing community.
        \nYou can share your ivite code via via DM BOT MESSAGES, using next list of the commands:*
        \n1) Connect to user client \`send invite to: #0-0000000000000@\`
        \n2)You cant connext to 2 cliets in one time, for disconnect from existing client please use command \`#stop\``;
        message.author.send(helpMessage);
        break;
      default:
        break;
    }
  }
});

discordService.getGuildInfo(app, discordClient, GUILD_NAME);

app.use('/get-invite', express.static('./dist/server/chat-form'));
