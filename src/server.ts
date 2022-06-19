import dotenv from 'dotenv';
import http from 'http';
import { userController } from './user/user-controller';

dotenv.config();

const PORT = process.env.PORT || 5000;

export const server = http.createServer((req, res) => {
  userController(req, res);
});

server.listen(+PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
