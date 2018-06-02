declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import { sendToChannels } from './discord/send';
import { getGuildInfo } from './discord/guild';
import { getConnection } from './ws-schat/check-connection';

const app = express(),
  server = http.createServer(app),
  client = new Discord.Client(),
  CHANNEL_NAME = process.env.CHANNEL_NAME || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '';

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

//Discord bot login
client.login(BOT_TOKEN);

//start server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server}`);
});

var time: number = 0,
  fakeId: number = 0,
  connectionID: any;

wss.on('connection', (ws: WebSocket) => {
  time = Date.now();
  connectionID = `#${fakeId++}-${time}`;
  (ws as any).id = connectionID;

  let inviteRequestMessage = `Hey All!\nNew user from the site \`${connectionID}\` is looking for invite!\nIf you want to send this invite please DM current bot with init message: \`to: ${connectionID}@\`.`;

  sendToChannels(client, inviteRequestMessage);

  ws.on('message', (message: string) => {
    let discordUser = (ws as any).discordUser;
    discordUser.send(`${(ws as any).id}\n ${message}`);
  });
});

client.on('message', (message: any) => {
  let type: string = message.channel.type,
    _message: string = message.content,
    isValid: any = /^to: #/.test(_message),
    connectionID: any,
    discordUser: any;
  console.log(message);

  if (type === 'dm' && isValid) {
    connectionID = _message.toString().split('@')[0];
    connectionID = connectionID.split('to: ')[1];
    discordUser = message.channel.recipient.username;

    let connection = getConnection(wss, connectionID);
    if (connection && connection !== null) {
      connection.discordUser = message.author;
      connection.send(`@${discordUser}: \n${_message.toString().split('@')[1]}`);
    } else {
      message.author.send('OOooops, connection is not exist :(');
    }
  } else if (type === 'dm' && !isValid) {
    message.author.send('OOooops, you forgot set `to: #user-id`');
  }
});

getGuildInfo(app, client, CHANNEL_NAME);
