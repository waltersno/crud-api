import dotenv from 'dotenv';
import http from 'http';
import { userController } from './user/user-controller';
import cluster from 'cluster';
import os from 'os';
import { User } from 'user/userRouter.ts';

// let numReqs = 0;
// let worker;
let server: http.Server;

dotenv.config();
const PORT = process.env.PORT || 5000;

let usersDb: User[];

if (cluster.isPrimary) {
  usersDb = [];
  const cpus = os.cpus();
  for (let index = 0; index < cpus.length; index++) {
    const worker = cluster.fork();
    worker.send(JSON.stringify(usersDb));
    worker.on('message', (message) => {
      worker.send(JSON.stringify(message));
    });
  }
} else {
  server = http.createServer((req, res, ) => {
    userController(req, res);
  });

  server.listen(+PORT, () => {
    console.log(process.pid);
    console.log(`Server running on port ${PORT}`);
  });

  process.on('message', (data: string) => {
    usersDb = JSON.parse(data);
  });
}

export { server };
