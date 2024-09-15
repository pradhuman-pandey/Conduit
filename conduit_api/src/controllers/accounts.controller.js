import {ValidationError} from 'joi';
import {accountsService} from '@/services';

export default {
  // eslint-disable-next-line valid-jsdoc
  /**
   * Handles user login by verifying credentials
   * and returning authentication data.
   *
   * @param {import('express').Request} request -
   * The Express request object containing login credentials.
   * @param {import('express').Response} response -
   * The Express response object used to send the response.
   *
   * @returns {Promise<void>} -
   * Sends a JSON response with authentication data or error details.
   */
  login: async (request, response) => {
    try {
      const data = await accountsService.login(request.body);
      if (!data) {
        return response.status(401).json({detail: 'Invalid credentials!'});
      }
      return response.status(201).json(data);
    } catch (err) {
      if (err instanceof ValidationError) {
        return response.status(400).json(err.details);
      }
      return response.status(500).json(err);
    }
  },

  // eslint-disable-next-line valid-jsdoc
  /**
   * Retrieves and returns the details of the authenticated
   *  user.
   *
   * @param {import('express').Request} request -
   * The Express request object with authenticated user.
   * @param {import('express').Response} response -
   *  The Express response object used to send the response.
   *
   * @returns {Promise<void>} - Sends a JSON response with user details.
   */
  detail: async (request, response) => {
    const data = await accountsService.detail(request.user);
    return response.status(200).json(data);
  },

  // eslint-disable-next-line valid-jsdoc
  /**
   * Logs out the authenticated user and performs cleanup.
   *
   * @param {import('express').Request} request -
   The Express request object with authenticated user.
   * @param {import('express').Response} response -
    The Express response object used to send the response.
   *
   * @returns {Promise<void>} - Sends a response indicating the logout status.
   */
  logout: async (request, response) => {
    try {
      const data = await accountsService.logout(request.user);
      return response.status(204).json(data);
    } catch (err) {
      return response.status(500).json(err);
    }
  },
};
