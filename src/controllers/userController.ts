import http from 'http';

export const userController = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ mes: 'sdsd' }));
      break;
    default:
      break;
  }
};
