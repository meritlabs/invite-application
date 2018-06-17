declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import { sendToChannels } from './discord/send';
import { getGuildInfo } from './discord/guild';
import { getConnection, checkPair } from './ws-schat/check-connection';
import { compileInitMessage } from './ws-schat/send';
import { chatPair } from './models/pair';
import { wsMessage } from './models/ws-message';

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
  console.log(`Server started on port ${server}`);
});

let time: number = 0,
  fakeId: number = 0,
  connectionID: string,
  chatPairs = [];

wss.on('connection', (ws: WebSocket) => {
  time = Date.now();
  connectionID = `#${fakeId++}-${time}`;
  (ws as any).id = connectionID;

  ws.on('message', (message: string) => {
    // sendToChannels(discordClient, CHANNELS, compileInitMessage(message, connectionID));
    console.log(compileInitMessage(message, connectionID));
  });
});

discordClient.on('message', (message: any) => {
  let type: string = message.channel.type,
    _message: string = message.content,
    isValid: any = /^send invite to: #/.test(_message),
    connectionID: any,
    discordUser: any;

  if (type === 'dm' && isValid && checkPair(chatPairs, discordUser) === null) {
    connectionID = _message.toString().split('@')[0];
    connectionID = connectionID.split('send invite to: ')[1];
    discordUser = message.channel.recipient.username;

    let connection = getConnection(wss, connectionID);

    if (connection && connection !== null) {
      connection.discordUser = message.author;
      connection.send(new wsMessage(discordUser, 'Joined!'));
      chatPairs.push(new chatPair(discordUser, connection.id));
    } else {
      message.author.send('OOooops, connection is not exist :(');
    }
  } else if (type === 'dm' && !isValid) {
    let connection = getConnection(wss, checkPair(chatPairs, discordUser));
    if (connection) {
      connection.send(_message);
    } else {
      message.author.send('OOooops, you forgot set `to: #user-id`');
    }
  }
});

getGuildInfo(app, discordClient, GUILD_NAME);

app.use('/get-invite', express.static('./dist/server/chat-form'));
