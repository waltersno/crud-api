import http from 'http';
import { userController } from './controllers/userController';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer((req, res) => {
  if (req.url === '/users') {
    userController(req, res);
  } else {
    res.end({ message: '404' });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
