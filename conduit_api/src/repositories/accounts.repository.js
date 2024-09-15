import {User} from '@/models';
import {generateKey} from '@/utilities/token';

export default {
  /**
     * Logs in a user with the provided email and password.
     *
     * Checks if the user exists and is active. If so, validates the
     * password and generates a new token if needed, updating the last
     * login time.
     *
     * @async
     * @function login
     * @param {Object} payload - User credentials for login.
     * @param {string} payload.email - User's email address.
     * @param {string} payload.password - User's password.
     * @return {Object|null} Token object if login is successful,
     * or `null` if login fails.
     *
     * @example
     * const response =
     * await login({ email: 'user@example.com',password: 'secret'});
     * if (response) {
     *    console.log('Login successful:', response.token);
     * } else {
     *    console.log('Login failed');
     * }
     */
  login: async (payload) => {
    const user = await User.findOne({email: payload.email, isActive: true});
    if (!user) return null;

    const match = await user.validatePassword(payload.password);
    if (!match) return null;

    if (!user.token) {
      user.token = {key: generateKey()};
      user.lastLogin = new Date();
      await user.save();
    }
    return {token: user.token.key};
  },

  /**
     * Retrieves detailed information about the user.
     *
     * Returns an object with user's email, first name, last name, admin
     * status, and join date.
     *
     * @async
     * @function detail
     * @param {Object} user - User object with details.
     * @param {string} user.email - User's email address.
     * @param {string} user.firstName - User's first name.
     * @param {string} user.lastName - User's last name.
     * @param {boolean} user.isAdmin - Whether the user is an admin.
     * @param {Date} user.dateJoined - User's join date.
     * @return {Object} Object with user's detailed information.
     *
     * @example
     * const userDetail = await detail(user);
     * console.log(userDetail);
     */
  detail: async (user) => {
    const detail = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      dateJoined: user.dateJoined,
    };
    return detail;
  },

  /**
     * Logs out the user by removing the token from their record.
     *
     * Sets the user's token to undefined and saves the user data.
     *
     * @async
     * @function logout
     * @param {Object} user - User object to be logged out.
     * @return {void} Removes the token and saves the user data.
     *
     * @example
     * await logout(user);
     * console.log('User logged out successfully');
     */
  logout: async (user) => {
    user.set('token', undefined, {strict: false});
    await user.save();
  },
};
