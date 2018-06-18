// function for welcome message compilation
export function inviteRuquest(message: string, connectionID: string) {
  return `Hey All!\nNew user from the site \`${connectionID}\` is looking for invite!
  \nIf you want to send this invite please DM current bot with init message: \`send invite to: ${connectionID}@\`.
  \n\n *USER'S MESSAGE:* \n\n\`\`\`\n${message}\`\`\`\n`;
}

export function connectedToClient(id: string) {
  return `Connected to: \`${id}\`
  \nYou you can send your invite code to current user, sure if his welcome message was valid by Merit mentality!
  \n After invite message sendig, please close session, using \`#stop\` command\n Have questions? type \`#help\``;
}

export function unableToConnect() {
  return `Unable to connect!
  \n 1) Please check that you enter right connction id in format \`send invite to: #0-0000000000000@\`
  \n 2) Somebody from the community already connected to this clien.
  \n 3) Connection expired (closed).`;
}

export function requestTaken(id: string) {
  return `request whit id ${id} taken!`;
}

export function alreadyInPair(id: string) {
  return `OOooops, you already connected to site client \`${id}\`\n Please type \`#stop\` if you wanna break previous connection.`;
}

export function pairDestroyed() {
  return 'Pair destroyed, now you can connect to new clients!';
}

export function noActiveConnections() {
  return 'You dont have active connection';
}

export function getHelp() {
  return `***MERI BOT**\n*Merit bot aims on connect new users between existing community.
  \nYou can share your ivite code via via DM BOT MESSAGES, using next list of the commands:*
  \n1) Connect to user client \`send invite to: #0-0000000000000@\`
  \n2)You cant connext to 2 cliets in one time, for disconnect from existing client please use command \`#stop\``;
}

export function defaultException() {
  return `Ooops! Looks like you dont have active connections:
  \n 1) Connected user was dissconnected
  \n 2) You didint has connection, how to get connection \`#how-to-use\`
  \n 3) You did something wrong, BOT commands here \`#help\``;
}
