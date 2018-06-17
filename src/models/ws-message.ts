export class wsMessage {
  author: string;
  message: string;
  constructor(author: string, message: string) {
    this.author = author;
    this.message = message;
  }
}
