import {Router} from 'express';

import v1Router from '@/routers/api/v1';

const urlPatterns = new Map([
  ['/v1', v1Router],
]);


// eslint-disable-next-line new-cap
const apiRouter = Router();
urlPatterns.forEach((router, prefix) => {
  apiRouter.use(prefix, router);
});

export default apiRouter;
