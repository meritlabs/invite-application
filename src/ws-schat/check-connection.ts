export function isConnectionExist(wss: any, id: any) {
  let result: boolean = false;
  wss.clients.forEach((item: any) => {
    if (item.id === id) {
      result = true;
    }
  });
  return result;
}
