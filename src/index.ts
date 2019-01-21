import { startServer } from './app';

async function start() {
  try {
    await startServer();
  } catch (err) {
    console.log('Error here');
    console.log(err);
  }
}

start();