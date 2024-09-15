import {Server} from 'http';
import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routers from '@routers';
import {MONGODB_URI} from '@settings';

/**
 * Sets up the Express application and middleware.
 *
 * @return {express.Application} The configured Express application.
 */
export function getRequestListener() {
  const application = express();
  application.use(helmet());
  application.use(express.urlencoded({extended: true}));
  application.use(express.json());

  // Fix the typo: 'combined' is the correct format for morgan
  application.use(morgan('combined'));

  // Apply all routers with their patterns
  routers.forEach((router, pattern) => {
    application.use(pattern, router);
  });

  return application;
}

/**
 * Starts the HTTP server and connects to the MongoDB database.
 *
 * @param {number} port - The port number to listen on.
 * @param {string} host - The host address for the server.
 * @return {Promise<void>} A promise that resolves when the server is running.
 */
export default async function bootstrap(port, host) {
  const options = {};
  const requestListener = getRequestListener();
  const server = new Server(options, requestListener);

  // Connect to the MongoDB database using the URI from settings
  await mongoose.connect(MONGODB_URI);

  // Start the server and log its address information
  server.listen(port, host, () => {
    console.info(server.address());
  });
}
