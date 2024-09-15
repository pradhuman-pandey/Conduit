import mongoose from 'mongoose';
import {read} from 'read';

import {accountsValidator} from '@/validators';
import {MONGODB_URI} from '@/settings';
import User from '@/models';

/**
 * Changes the password for a given user.
 *
 * This function prompts the user to input a new password and confirms it.
 * It then validates the inputs, connects to the MongoDB database, and updates
 * the user's password if the provided email exists in the system.
 *
 * @async
 * @function changepassword
 * @param {string} email
 * @throws
 * @throws
 *
 * @example
 * const email = 'example@domain.com';
 * changepassword(email);
 */
export default async function changepassword(email) {
  // Prompt the user for the new password and its confirmation
  const password = await read({prompt: 'Password:'});
  const passwordAgain = await read({prompt: 'Password (again):'});

  try {
  // Validate email, password, and password confirmation
    const validatedData = await accountsValidator.changepassword.validateAsync({
      email,
      password,
      passwordAgain,
    });

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    // Find user by email
    const user = await User.findOne({email: validatedData.email});
    if (!user) {
      console.log(`Error: User '${email}' does not exist.`);
      process.exit(2); // Exit with error code if user does not exist
    }

    // Update the user's password
    user.password = validatedData.password;
    await user.save();
  } catch (err) {
    // Handle errors (e.g., validation, database connection issues)
    console.error(err);
    process.exit(2); // Exit with error code on failure
  }

  console.info(`Password changed successfully for user '${email}'.`);
  process.exit(0); // Exit the process on success
}
