declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import { getGuildInfo, sendToChannels } from './services/discord.service';
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
    discordUser: any = message.channel.recipient.username,
    connectionID: any,
    connection: any;

  if (type === 'dm') {
    let pair = checkPair(chatPairs, discordUser);
    if (!pair && isValid) {
      connectionID = _message.toString().split('@')[0];
      connectionID = connectionID.split('send invite to: ')[1];
      connection = getConnection(wss, connectionID);
      if (connection && connection !== null) {
        connection.discordUser = message.author;
        chatPairs.push(new chatPair(discordUser, connection.id));
        connection.send(JSON.stringify(new wsMessage(discordUser, 'Joined!')));
      } else {
        message.author.send('OOooops, connection is not exist, or wrong user ID :(');
      }
    } else if (!isValid && pair) {
      getConnection(wss, pair.get('wsUser')).send(JSON.stringify(new wsMessage(discordUser, _message)));
    }
  }
});

getGuildInfo(app, discordClient, GUILD_NAME);

app.use('/get-invite', express.static('./dist/server/chat-form'));
