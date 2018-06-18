// Class of the chat pair
export class chatPair {
  discordUser: string;
  wsUser: string;
  constructor(discordUser: string, wsUser: string) {
    this.discordUser = discordUser;
    this.wsUser = wsUser;
  }
  get(param) {
    return this[param];
  }
}

// Class of the web socket message
export class wsMessage {
  author: string;
  message: string;
  constructor(author: string, message: string) {
    this.author = author;
    this.message = message;
  }
}
