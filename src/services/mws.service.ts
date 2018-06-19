const https = require('https');

export function validateInviteCode(invite) {
  return new Promise((resolve, rejected) => {
    https
      .get(`https://mws.merit.me/bws/api/v1/addresses/${invite}/validate`, resp => {
        resp.on('data', chunk => {
          let result = JSON.parse(chunk);
          if (result.isValid && result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: 'valid' });
          if (!result.isValid && result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: 'not valid' });
          if (result.isValid && !result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: 'not beaconed' });
          if (result.isValid && result.isBeaconed && !result.isConfirmed)
            resolve({ address: result.address, status: 'not confirmed' });
        });
      })
      .on('error', err => {
        rejected('Error: ' + err.message);
      });
  });
}
