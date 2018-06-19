// * Function for Messages compilation

export function inviteRequest(message: string, connectionID: string) {
  return `Hey Invite Gang!
  \nNew user \`${connectionID}\` is looking for invite!
  \nIf you want to send this invite please DM current bot with init message:
  \n \`send invite to: ${connectionID}@\`.
  \n**USER'S MESSAGE:**
   \n\`\`\`\n${message}\`\`\`
  \n*CONFUSED?*
  \ntype DM to the bot \`#how-to-use\`.`;
}

export function connectedToClient(id: string) {
  return `Connected to: \`${id}\`
  \n*Looks like you going to share your invite
  \nIf you dont want share invite, send \`#stop\`
  \nNeed help? send \`#how-to-use\`*
  \n**If everything is OK, type you invite token below**`;
}

export function unableToConnect() {
  return `Unable to connect!
  \n 1) Please check that you enter right connection id in format \`send invite to: #0-0000000000000@\`
  \n 2) Somebody from the community already connected to this client.
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
  return `***MERIT BOT**\n*Merit bot aims on connect new users between existing community.
  \nYou can share your invite code via via DM BOT MESSAGES, using next list of the commands:*
  \n1) Connect to user client \`send invite to: #0-0000000000000@\`
  \n2)You cant connect to 2 clients in one time, for disconnect from existing client please use command \`#stop\``;
}

export function defaultException() {
  return `Ooops! Looks like you dont have active connections:
  \n 1) Connected user was disconnected
  \n 2) You didn't has connection, how to get connection \`#how-to-use\`
  \n 3) You did something wrong, BOT commands here \`#help\``;
}

export function howToUse() {
  return `How to use merit invite bot?
  \nIf you fount message in the INVITE channel and it looks like that http://prntscr.com/jwbl5a
    and you have available invite, you can share your invite with the person who requested it.
    its really easy just do couple quick steps:
  \n 1) Copy client id http://prntscr.com/jwbmz6
  \n 2) Click on the BOT name and paste copied ID into message box than push Enter http://prntscr.com/jwbn9u
  \n 3) After that, if you was first who reacted on request you will connected to the client from the application http://prntscr.com/jwbodk
  \n 4) Please be polite and "Say Hello" after that share your invite code.
  \n 5) When invite code is shared, please type \`#stop\` to finish current session
  \n 6) Remember, you can have just one session in one time.`;
}

export function inviteShared(user) {
  return `Congrats ${user}, your invite successfully shared!
  \nNow you can back to the *#invite channel* and share your invite again!
  \nGood luck!`;
}

export function invalidInviteCodeMessage() {
  return 'Your code invalid try one more time!';
}

export function notExistInviteCodeMessage() {
  return 'Entered invite code not valid or not exist!';
}

export function notBeaconedInviteCodeMessage() {
  return 'Your code not beaconed!, sorry you cant share invite :(';
}

export function notConfirmedInviteCodeMessage() {
  return 'Your code not confirmed!, sorry you cant share invite :(';
}

export function somethingWentWrongMessage() {
  return 'Something went wrong please notify `@coreteam`';
}
