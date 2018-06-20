// * Function for Messages compilation

// This is sent to the Discord Channel in the community.
export function inviteRequest(message: string, connectionID: string) {
  return `Hey Merit Community!
  \nA new user, \`${connectionID}\`, is looking for an invite!
  \n**THEIR INVITE APPLICATION IS BELOW:**
  \n\`\`\`\n${message}\`\`\`
  \nIf you want to invite this user please DM me with the following message:
  \n \`send invite to: ${connectionID}@\`
  \n*NEED HELP?*
  \nSend me a DM \`#how-it-works\`.`;
}

//This is sent to the INVITER via DM
export function connectedToClient(id: string) {
  return `You are inviting a new user with ID: \`${id}\`
  \n*I am about to share your invite code with the user
  \nIf you don't want to share your invite, tell me to \`#stop\`
  \nNeed help? Ask me \`#how-it-works\`*
  \n**If you are ready to proceed, type your invite code (alias) now!**`;
}

// Sent to the INVITER if there is an error
export function unableToConnect() {
  return `Sorry!  It seems there was a problem with inviting this new user.  It is most likely for one of the reasons below:
  \n 1) Invalid format.  Please check the connection ID you entered, and be sure it is in this format: \`send invite to: #0-0000000000000@\`
  \n 2) Already-in-progress.  Somebody from the community already invited this user.
  \n 3) The user changed their mind.  They closed the application process window before we could invite them.`;
}

// Sent to the public channel when the APPLICANT has been approved. 
export function requestTaken(id: string) {
  return `Woooh!  User ${id} is now part of the Merit community, and has been invited by one of you!`;
}

// Sent to the INVITER in DM if they are duplicating connections.
export function alreadyInPair(id: string) {
  return `Oops, it looks like you are already-in-progress with inviting a new user (\`${id}\`). \n Please type \`#stop\` if you want to stop that invitation process.`;
}

// Sent to the INVITER once closed.
export function pairDestroyed() {
  return 'Your invitation process has been cancelled.  You are now free to invite someone new!';
}

// If you are not inviting new users right now.
export function noActiveConnections() {
  return 'You are not currently inviting any new users.';
}

// With the inviter, via DM
export function getHelp() {
  return `***MERIT INVITE BOT**\n*The Merit Invite Bot aims to connect new users to existing members of the community.
  \nYou can share your invite code via a direct message (DM) to the BOT. You can use the following list of commands:*
  \n1) Provide the new user with your invite code: \`send invite to: #0-0000000000000@\`
  \n2) You cannot invite 2 new users at the same time. To cancel your existing invitation process please type: \`#stop\`
  \n3) If you are still confused, I can tell you how it works if you type:  \`#how-it-works\``;
}

// Error to the inviter.
export function defaultException() {
  return `Oops! It looks like you are not actively inviting any new users right now.  This could be because:
  \n 1) The new user closed the invite application window.
  \n 2) You sent me a message even though there are no new users applying for invites right now.  Type: \`#how-it-works\`
  \n 3) You sent a message that I do not understand.  To see which commands I respond to, type: \`#help\``;
}

// How to use the bot -- sent to inviter.
export function howToUse() {
  return `Here is how you use the Merit Invite Bot:
  \nIf you see a message from me in the invites channel that looks like this: http://prntscr.com/jwbl5a,
    and you have an available invite token to share, you can invite the new user who requested an invitation. 
    Here is how:
  \n 1) Copy the required message to invite this new user: http://prntscr.com/jwbmz6
  \n 2) Send that message to me via direct message (DM).  Here's how: click on my username and paste the message you copied above and press enter! http://prntscr.com/jwbn9u
  \n 3) If you are the first person who responds to me, you will have the opportunity to invite this new user to the Merit community.  http://prntscr.com/jwbodk
  \n 4) When your invite code is shared with the new user, they will be able to click a button and go directly to the wallet with your code filled out.
  \n 6) Remember, you can only be in the process of inviting one new user at a time.`;
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
