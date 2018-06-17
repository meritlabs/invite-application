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
  return chatPairs.find((item: any) => item.get('dicordUser') === discordUser);
}
