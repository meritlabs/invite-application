export enum messageTypes {
  joinToPair = 'join-to-pair',
  regularMessage = 'regular-message-to-client',
  inPair = 'already-in-pair',
  destroyPair = 'destroy-pair',
  botHelp = 'bot-help',
  howToUse = 'how-to-use',
  default = 'default-exception',
}

export enum commands {
  activate = 'activate',
  deactivate = 'deactivate',
  regular = 'regular',
  help = 'help',
  howToUse = 'how-to-use',
}

export enum validationStatuses {
  valid = 'valid',
  notExist = 'not exist',
  notValid = 'not valid',
  notBeaconed = 'not beaconed',
  notConfirmed = 'not confirmed',
}

export enum strings {
  channelNotSetup = 'PLEASE SETUP CHANNELS',
  joined = 'joined',
  inviteCode = 'invite code',
}
