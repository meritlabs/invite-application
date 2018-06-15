export function sendToConnection() {}

export function compileInitMessage(message: string, connectionID: string) {
  let inviteRequestMessage: string = `Hey All!\nNew user from the site \`${connectionID}\` is looking for invite!\nIf you want to send this invite please DM current bot with init message: \`send invite to: ${connectionID}@\`.\n\n *USER'S MESSAGE:* \n\n\`\`\`\n${message}\`\`\`\n`;
  return inviteRequestMessage;
}
