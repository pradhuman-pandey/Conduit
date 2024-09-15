import {Router} from 'express';

import accountsRouter from '@/routers/api/v1/accounts.router';


const urlPatterns = new Map([
  ['/accounts', accountsRouter],
]);

// eslint-disable-next-line new-cap
const v1Router = Router();
urlPatterns.forEach((router, prefix) => {
  v1Router.use(prefix, router);
});

export default v1Router;
