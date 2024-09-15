import {STATUS_CODES} from 'http';

import {User} from '@/models';

// eslint-disable-next-line valid-jsdoc
/**
 * Middleware function to authenticate requests based
 * on token in the Authorization header.
 *
 * @param {import('express').Request} request - The Express request object.
 * @param {import('express').Response} response - The Express response object.
 * @param {import('express').NextFunction} next
 * - The Express next middleware function.
 *
 * @returns {Promise<void>} - Calls the `next` middleware if
 * authenticated, otherwise returns a 401 or 403 error response.
 */
export default async function authenticate(request, response, next) {
  // Get the Authorization header from the request
  const authorization = request.header?.authorization;
  // If the Authorization header is missing,resp. with a 401 Unauthorized status
  if (!authorization) {
    return response.status(401).json({detail: STATUS_CODES[401]});
  }

  // Split the Authorization header into parts
  const values = authorization.split(' ');
  // Ensure the Authorization header has exactly two parts
  if (values?.length !== 2) {
    return response.status(401).json({detail: STATUS_CODES[401]});
  }

  // Check if the scheme is 'Token' (case-insensitive)
  if ('Token'.toLowerCase() !== values[0].toLowerCase()) {
    return response.status(401).json({detail: STATUS_CODES[401]});
  }

  // Find the user based on the token
  const user = await User.findOne({
    'token.key': values[1],
  });

  // If no user is found, respond with a 403 Forbidden status
  if (!user) {
    return response.status(403).json({detail: STATUS_CODES[403]});
  }

  // Attach the user to the request object
  request.user = user;
  // Proceed to the next middleware function
  return next();
}
