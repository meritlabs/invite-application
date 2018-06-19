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
  let connectionID = wsService.createConnectionID(fakeId++);
  (ws as any).id = connectionID;

  ws.on('message', (message: string) => {
    discordService.sendToChannels(discordClient, CHANNELS, compileMessage.inviteRequest(message, connectionID));
  });

  ws.on('close', function() {
    let index = chatPairs.indexOf(wsService.checkPair(chatPairs, connectionID));
    if (index > -1) {
      chatPairs.splice(index, 1);
    }
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
        if (connection && connection !== null) {
          connection.discordUser = message.author;
          chatPairs.push(new chatPair(discordUser, connection.id));
          connection.send(JSON.stringify(new wsMessage(discordUser, 'Joined!')));
          message.author.send(compileMessage.connectedToClient(connection.id));
          discordService.sendToChannels(discordClient, CHANNELS, compileMessage.requestTaken(connection.id));
        } else {
          message.author.send(compileMessage.unableToConnect());
        }
        break;
      case 'regular-message-to-client':
        mws.validateInviteCode(_message).then(res => {
          let response = res as any;

          console.log(response);

          if (response.status === 'valid') {
            wsService
              .getConnection(wss, pair.get('wsUser'))
              .send(JSON.stringify(new wsMessage('invite code', response.address)));
          }
          if (response.status === 'not exist') {
            message.author.send('Your code invalid try one more time!');
          }
          if (response.status === 'not valid') {
            message.author.send('Entered invite code not valid or not exist!');
          }
          if (response.status === 'not beaconed') {
            message.author.send('Your code not beaconed!, sorry you cant share invite :(');
          }
          if (response.status === 'not confirmed') {
            message.author.send('Your code not confirmed!, sorry you cant share invite :(');
          }
        });
        break;
      case 'already-in-pair':
        message.author.send(compileMessage.alreadyInPair(pair.get('wsUser')));
        break;
      case 'destroy-pair':
        if (pair) {
          let index = chatPairs.indexOf(pair);
          if (index > -1) {
            chatPairs.splice(index, 1);
            message.author.send(compileMessage.pairDestroyed());
          }
        } else {
          message.author.send(compileMessage.noActiveConnections());
        }
        break;
      case 'bot-help':
        message.author.send(compileMessage.getHelp());
        break;
      case 'how-to-use':
        message.author.send(compileMessage.howToUse());
        break;
      case 'default-exception':
        message.author.send(compileMessage.defaultException());
        break;
      default:
        break;
    }
  }
});

discordService.getGuildInfo(app, discordClient, GUILD_NAME);

app.use('/get-invite', express.static('./dist/server/chat-form'));
