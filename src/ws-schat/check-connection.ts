export function getConnection(wss: any, id: any) {
  let result: any = null;
  wss.clients.forEach((item: any) => {
    if (item.id === id) {
      result = item;
    }
  });
  return result;
}

export function checkPair(chatPairs, discordUser) {
  let result: any = null;
  chatPairs.forEach((item: any) => {
    if (item.discordUser === discordUser) {
      result = item.wsUser;
    }
  });
  return result;
}
