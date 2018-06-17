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
