import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate } from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

let usersDb: User[] = [];

process.on('message', (message: string) => {
  usersDb = JSON.parse(message);
});

export const userRouter = {
  get: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const uuid = req.url?.match(/\/api\/users\/(.*)/);
      const validUrl = uuid && !uuid?.[1].includes('/');
      if (req.url === '/api/users') {
        sendResponse(usersDb, res, 200);
      } else if (validUrl) {
        const idFromReq = uuid[1];
        const userFromDb = usersDb.find((user) => user.id === idFromReq);
        if (validate(idFromReq)) {
          if (userFromDb) {
            sendResponse(userFromDb, res, 200);
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  post: (req: IncomingMessage, res: ServerResponse) => {
    try {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        const userData = JSON.parse(data);
        const isValidProp = validateUserProp(userData as unknown as User);
        if (isValidProp) {
          const userId = uuidv4();
          const userObj: User = { ...userData, id: userId };
          usersDb.push(userObj);
          process?.send?.(JSON.stringify(usersDb));
          sendResponse(userObj, res, 201);
        } else {
          sendResponse('Body does not contain required fields', res, 400);
        }
      });

      req.on('error', () => {
        sendResponse('Internal Server Error', res, 500);
      });
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  put: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const uuid = req.url?.match(/\/api\/users\/(.*)/);
      const validUrl = uuid && !uuid?.[1].includes('/');

      if (validUrl) {
        const idFromReq = uuid[1];
        const userFromDb = usersDb.find((user) => user.id === idFromReq);

        if (validate(idFromReq)) {
          if (userFromDb) {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              const userData = JSON.parse(data);
              const isValidProp = validateUserProp(userData as unknown as User);
              if (isValidProp) {
                const userObj: User = { ...userData, id: userFromDb.id };
                usersDb = usersDb.map((user) => {
                  if (user.id === idFromReq) {
                    return userObj;
                  }
                  return user;
                });
                process?.send?.(JSON.stringify(usersDb));
                sendResponse(userObj, res, 200);
              } else {
                sendResponse('Body does not contain required fields', res, 400);
              }
            });
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },

  delete: (req: IncomingMessage, res: ServerResponse) => {
    try {
      const uuid = req.url?.match(/\/api\/users\/(.*)/);
      const validUrl = uuid && !uuid?.[1].includes('/');
      if (validUrl) {
        const idFromReq = uuid[1];
        const userFromDb = usersDb.find((user) => user.id === idFromReq);

        if (validate(idFromReq)) {
          if (userFromDb) {
            usersDb = usersDb.filter((user) => user.id !== idFromReq);
            process?.send?.(JSON.stringify(usersDb));
            sendResponse(
              `user with id ${idFromReq} has been deleted`,
              res,
              204,
            );
          } else {
            sendResponse(`User with id ${idFromReq} does not exist`, res, 404);
          }
        } else {
          sendResponse(`User id ${idFromReq} is invalid`, res, 400);
        }
      } else {
        sendResponse('Non-existent endpoints', res, 404);
      }
    } catch {
      sendResponse('Internal Server Error', res, 500);
    }
  },
};

function sendResponse(data: unknown, res: ServerResponse, statusCode: number) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(data));
}

function validateUserProp(user: User) {
  let allCount = 0;
  let isValid = true;
  Object.entries(user).forEach(([key, value]) => {
    switch (key) {
      case 'username':
        if (typeof value !== 'string') {
          return false;
        }
        allCount += 1;
        break;
      case 'age':
        if (typeof value !== 'number') {
          return false;
        }
        allCount += 1;
        break;

      case 'hobbies':
        if (!Array.isArray(value)) {
          return false;
        }
        allCount += 1;
        break;
      default:
        isValid = false;
        return false;
    }
  });

  if (allCount === 3 && isValid) {
    return true;
  }

  return false;
}
