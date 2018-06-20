import { validationStatuses } from './../common/ts/const';
const https = require('https');

export function validateInviteCode(invite) {
  return new Promise((resolve, rejected) => {
    https
      .get(`https://mws.merit.me/bws/api/v1/addresses/${invite}/validate`, resp => {
        resp.on('data', chunk => {
          let result = JSON.parse(chunk);
          if (result.isValid && result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: validationStatuses.valid });
          if (!result.isValid && result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: validationStatuses.notValid });
          if (result.isValid && !result.isBeaconed && result.isConfirmed)
            resolve({ address: result.address, status: validationStatuses.notBeaconed });
          if (result.isValid && result.isBeaconed && !result.isConfirmed)
            resolve({ address: result.address, status: validationStatuses.notConfirmed });
          if (!result.isValid && !result.isBeaconed && !result.isConfirmed)
            resolve({ address: result.address, status: validationStatuses.notExist });
        });
      })
      .on('error', err => {
        rejected('Error: ' + err.message);
      });
  });
}
