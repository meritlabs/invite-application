declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import { sendToChannels } from './discord/send';
import { getGuildInfo } from './discord/guild';

const app = express();

//initialize a simple http server
const server = http.createServer(app),
  client = new Discord.Client(),
  CHANNEL_NAME = process.env.CHANNEL_NAME || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '';

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
client.login(BOT_TOKEN);

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    sendToChannels(client, message);
  });
  getGuildInfo(app, client, CHANNEL_NAME);
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server}`);
});
