export function getConnection(wss: any, id: any) {
  let result: any = null;
  wss.clients.forEach((item: any) => {
    if (item.id === id) {
      result = item;
    }
  });
  return result;
}
