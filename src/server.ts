declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import * as discordService from './services/discord.service';
import * as wsService from './services/websocket.service';
import * as compileMessage from './services/compile-message.service';
import * as mws from './services/mws.service';
import { chatPair, wsMessage } from './common/ts/classes';
import { messageTypes, validationStatuses, strings } from './common/ts/const';

const app = express(),
  server = http.createServer(app),
  discordClient = new Discord.Client(),
  GUILD_NAME = process.env.GUILD_NAME || '',
  CHANNELS = process.env.CHANNELS || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '',
  APP_SLUG = process.env.APP_SLUG || '/get-invite',
  PORT = process.env.PORT || 8999;

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

//Discord bot login
discordClient.login(BOT_TOKEN);

//start server
server.listen(PORT, () => {
  console.log(`Server started on port ${(server.address() as any).port}`);
});

// Get guild info
discordService.getGuildInfo(app, discordClient, GUILD_NAME);

// Serve invite application
app.use(APP_SLUG, express.static('./dist/server/chat-form'));

let time: number = 0,
  fakeId: number = 0,
  chatPairs: any[];
chatPairs = [];

wss.on('connection', (ws: WebSocket) => {
  let connectionID = wsService.createConnectionID(fakeId++);
  (ws as any).id = connectionID;

  ws.on('message', (message: string) => {
    discordService.sendToChannels(discordClient, CHANNELS, compileMessage.inviteRequest(message, connectionID));
  });

  ws.on('close', function() {
    (async () => {
      chatPairs = (await wsService.destroyPair(chatPairs, connectionID)) as any[];
    })();
  });
});

discordClient.on('message', (message: any) => {
  let type: string = message.channel.type;
  let _message: string = message.content;
  let isBot = message.author.bot;

  if (type === 'dm' && !isBot) {
    let discordUser: any = message.channel.recipient.username;
    let pair = wsService.checkPair(chatPairs, discordUser);
    let isCommand = discordService.detectCommand(_message);
    let detectedMessageType = discordService.detectMessageType(pair, isCommand, isBot);

    console.log('START___DEBUG___PAIR___');
    console.log(pair);
    console.log('END___DEBUG___PAIR___');

    switch (detectedMessageType) {
      case messageTypes.joinToPair:
        let connectionID = wsService.parseConnection(_message);
        let connection = wsService.getConnection(wss, connectionID);
        let unableToConnectMessage = compileMessage.unableToConnect();

        if (connection && connection !== null) {
          connection.discordUser = message.author; //attach Discord user to the new connection pair

          let newPair = new chatPair(discordUser, connection.id);
          let discordUserJoinedMessage = JSON.stringify(new wsMessage(discordUser, strings.joined));
          let successfulConnectedToClientMessage = compileMessage.connectedToClient(connection.id);
          let clientTakenMessage = compileMessage.requestTaken(connection.id);

          chatPairs.push(newPair); // Add created pair to WS
          connection.send(discordUserJoinedMessage); // Send connection message to the Application client
          message.author.send(successfulConnectedToClientMessage); // Reply to author that he's successfully connected to the application client
          discordService.sendToChannels(discordClient, CHANNELS, clientTakenMessage); // Notify community that somebody from the community already connected to the existing application client
        } else {
          message.author.send(unableToConnectMessage); // Notify Discord user that He's can't connect to the current Application client
        }
        break;
      case messageTypes.regularMessage:
        mws.validateInviteCode(_message).then(res => {
          let response: any = res;
          let validationStatus = response.status;
          let connection = wsService.getConnection(wss, pair.get('wsUser'));
          let inviteCodeMessage = JSON.stringify(new wsMessage(strings.inviteCode, response.address));
          let invalidInviteCodeMessage = compileMessage.invalidInviteCodeMessage();
          let notExistInviteCodeMessage = compileMessage.notExistInviteCodeMessage();
          let notBeaconedInviteCodeMessage = compileMessage.notBeaconedInviteCodeMessage();
          let notConfirmedInviteCodeMessage = compileMessage.notConfirmedInviteCodeMessage();
          let somethingWentWrongMessage = compileMessage.somethingWentWrongMessage();

          switch (validationStatus) {
            case validationStatuses.valid:
              (async () => {
                connection.send(inviteCodeMessage); // Send invite code to the current application client
                message.author.send(compileMessage.inviteShared(pair.discordUser));
                chatPairs = (await wsService.destroyPair(chatPairs, pair.discordUser)) as any[];
              })();
              break;
            case validationStatuses.notExist:
              message.author.send(invalidInviteCodeMessage); // Notify Discord user that He's entered not exist alias / address
              break;
            case validationStatuses.notValid:
              message.author.send(notExistInviteCodeMessage); // Notify Discord user that He's entered alias / address not valid
              break;
            case validationStatuses.notBeaconed:
              message.author.send(notBeaconedInviteCodeMessage); // Notify Discord user that He's entered alias / address not beaconed
              break;
            case validationStatuses.notConfirmed:
              message.author.send(notConfirmedInviteCodeMessage); // Notify Discord user that He's entered alias / address not confirmed
              break;
            default:
              message.author.send(somethingWentWrongMessage); // Notify Discord user that something went wrong
              break;
          }
        });
        break;
      case messageTypes.inPair:
        message.author.send(compileMessage.alreadyInPair(pair.get('wsUser')));
        break;
      case messageTypes.destroyPair:
        if (pair) {
          (async () => {
            chatPairs = (await wsService.destroyPair(chatPairs, pair.discordUser)) as any[];
            message.author.send(compileMessage.pairDestroyed());
          })();
        } else {
          message.author.send(compileMessage.noActiveConnections());
        }
        break;
      case messageTypes.botHelp:
        message.author.send(compileMessage.getHelp()); // Post to Discord user help message
        break;
      case messageTypes.howToUse:
        message.author.send(compileMessage.howToUse()); // Post to Discord user how to use message
        break;
      case messageTypes.default:
        message.author.send(compileMessage.defaultException()); // Post to Discord user default exception
        break;
      default:
        break;
    }
  }
});
