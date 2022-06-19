import { IncomingMessage, ServerResponse } from 'http';
import { userRouter } from './userRouter';

export const userController = (req: IncomingMessage, res: ServerResponse) => {
  const existingPath = req.url?.startsWith('/api/users');

  if (req.method === 'GET' && existingPath) {
    userRouter.get(req, res);
  } else if (req.method === 'PUT' && existingPath) {
    userRouter.put(req, res);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    userRouter.post(req, res);
  } else if (req.method === 'DELETE' && existingPath) {
    userRouter.delete(req, res);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify('Non-existent endpoints'));
  }
};
