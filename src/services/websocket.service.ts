// function for getting web socket created connection
export function getConnection(wss: any, id: any) {
  let result: any = null;
  wss.clients.forEach((item: any) => {
    if (item.id === id) {
      result = item;
    }
  });
  return result;
}

// function for checking is pair exist
export function checkPair(chatPairs, user) {
  return chatPairs.find((item: any) => item.get('dicordUser') === user || item.get('wsUser') === user);
}

// Function for executing connected client ID
export function parseConnection(message: string) {
  let connectionID = message.toString().split('@')[0];
  return connectionID.split('send invite to: ')[1];
}

// Function for creating connected client ID
export function screateConnectionID(fakeId: number) {
  return `#${fakeId}-${Date.now()}`;
}
