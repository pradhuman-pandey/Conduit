import mongoose from 'mongoose';
import {read} from 'read';

import {User} from '@/models';
import {accountsValidator} from '@/validators';
import {MONGODB_URI} from '@/settings';

/**
 * Creates a new superuser in the system.
 *
 * This function prompts the user for input, validates and then creates
 * a superuser in the MongoDB database. It ensures that the email is not already
 * in use before proceeding.
 *
 * @async
 * @function createSuperUser
 * @throws Will throw an error if email already exists or if validation fails.
 * @throws Will terminate the process with status 2 if an error occurs.
 *
 * @example
 * createSuperUser();
 */
export default async function createSuperUser() {
  // Prompt user for superuser details
  const email = await read({prompt: 'Email:'});
  const firstName = await read({prompt: 'First name: '});
  const lastName = await read({prompt: 'Last name:'});
  const password = await read({prompt: 'Password:'});
  const passwordAgain = await read({prompt: 'Password (again):'});

  try {
    // Validate the user input
    const validatedData = await accountsValidator.createUser.validateAsync({
      email,
      firstName,
      lastName,
      password,
      passwordAgain,
    });

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    // Check if the email is already in use
    const user = await User.findOne({email});
    if (user) {
      console.error('Error: That email is already taken.');
      process.exit(2); // Exit if the email is taken
    }

    // Create the superuser account with admin privileges
    await User.create({...validatedData, isAdmin: true});
  } catch (err) {
    // Handle any validation or database errors
    console.error(err);
    process.exit(2); // Exit on failure
  }

  console.info('Superuser created successfully.');
  process.exit(0); // Exit the process after successful creation
}
