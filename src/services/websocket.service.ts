import * as wsService from './websocket.service';

// function for getting web socket created connection
export function getConnection(wss: any, id: any) {
  let result: any = null;
  wss.forEach((item: any) => {
    if (item.id === id) {
      result = item;
    }
  });
  return result;
}

// function for checking is pair exist
export function checkPair(chatPairs, user) {
  return chatPairs.find((item: any) => item.get('discordUser') === user || item.get('wsUser') === user);
}

// Function for executing connected client ID
export function parseConnection(message: string) {
  let connectionID = message.toString().split('@')[0];
  return connectionID.split('send invite to: ')[1];
}

// Function for creating connected client ID
export function createConnectionID(fakeId: number) {
  return `#${fakeId}-${Date.now()}`;
}

// Function for destroying ws pair
export async function destroyPair(chatPairs: any[], id: any) {
  return new Promise(resolve => {
    let index = chatPairs.indexOf(wsService.checkPair(chatPairs, id));
    if (index > -1) {
      chatPairs.splice(index, 1);
      resolve(chatPairs);
    }
  });
}

// function for detection is connection busy
export function isConnectionBusy(pairs, id) {
  return pairs.find((item: any) => item.wsUser === id);
}
