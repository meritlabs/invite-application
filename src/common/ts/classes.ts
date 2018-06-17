// Class of the chat pair
export class chatPair {
  dicordUser: string;
  wsUser: string;
  constructor(dicordUser: string, wsUser: string) {
    this.dicordUser = dicordUser;
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

// Class for invite response for form messanger
export class inviteResponse {
  status: boolean;
  message: string;
  constructor(status: boolean, message: string) {
    this.status = status;
    this.message = message;
  }
}
