import Joi from 'joi';

/**
 * Validation schemas for user-related operations.
 */
export default {
  /**
   * Validation schema for user creation.
   */
  createUser: Joi.object({
    email: Joi.string().email().required().label('Email'),
    firstName: Joi.string().min(2).required().label('First name'),
    lastName: Joi.string().min(2).required().label('Last name'),
    password: Joi.string().min(8).max(15).required().label('Password'),
    passwordAgain: Joi
        .any()
        .equal(Joi.ref('password'))
        .required()
        .label('Password (again)')
        .messages({'any.only': 'Error: Your passwords didn\'t match.'}),
  }),

  /**
   * Validation schema for user login.
   */
  login: Joi.object({
    // eslint-disable-next-line max-len
    email: Joi.string().email().required().label('Email'), // Fix: Added missing parentheses
    password: Joi.string().min(8).max(15).required().label('Password'),
  }),

  /**
   * Validation schema for changing a user's password.
   */
  changePassword: Joi.object({
    email: Joi.string().email().required().label('Email'),
    // eslint-disable-next-line max-len
    password: Joi.string().min(8).max(15).required().label('Password'), // Fix: Added missing parentheses
    passwordAgain: Joi
        .any()
        .equal(Joi.ref('password'))
        .required()
        .label('Password (again)')
        .messages({'any.only': 'Error: Your passwords didn\'t match.'}),
  }),
};
