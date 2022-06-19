import dotenv from 'dotenv';
import http from 'http';
import { userController } from './user/user-controller';
import cluster from 'cluster';
import os from 'os';

let server: http.Server;

dotenv.config();
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  const cpus = os.cpus();
  for (let index = 0; index < cpus.length; index++) {
    const worker = cluster.fork();
    worker.on('message', function (message) {
      for (const id in cluster.workers) {
        cluster.workers[id]?.send(message);
      }
    });
  }
} else {
  server = http.createServer((req, res) => {
    userController(req, res);
  });

  server.listen(+PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { server };
