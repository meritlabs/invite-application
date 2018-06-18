// function for getting web socket created connection
export function getConnection(wss: any, id: any) {
  let result: any = null;
  wss.clients.forEach((item: any) => {
    if (item.id === id) {
      result = item;
    }
  });
  return result;
}

// function for checking is pair exist
export function checkPair(chatPairs, discordUser) {
  return chatPairs.find((item: any) => item.get('dicordUser') === discordUser);
}

// function for welcome message compilation
export function compileInitMessage(message: string, connectionID: string) {
  let inviteRequestMessage: string = `Hey All!\nNew user from the site \`${connectionID}\` is looking for invite!\nIf you want to send this invite please DM current bot with init message: \`send invite to: ${connectionID}@\`.\n\n *USER'S MESSAGE:* \n\n\`\`\`\n${message}\`\`\`\n`;
  return inviteRequestMessage;
}

// Function for executing connected client ID
export function parseConnection(message: string) {
  let connectionID = message.toString().split('@')[0];
  return connectionID.split('send invite to: ')[1];
}

// Function for creating connected client ID
export function screateConnectionID(fakeId: number) {
  return `#${fakeId}-${Date.now()}`;
}
