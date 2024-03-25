# Elimoo NodeJS + Express Backend

The Elimoo backend is a NodeJS application that serves as the server-side component for the Elimoo React Native app. It is built using the Express framework and connects to a MongoDB database for data storage and retrieval.

## Features

- Provides API endpoints for the Elimoo app to fetch deals, discounts, and wellness tips
- Handles user authentication and authorization
- Implements an admin dashboard for verifying new user student credentials
- Supports pagination for efficient data retrieval
- Integrates with MongoDB for data persistence
- Uses Mailjet (mailjet.com) for sending verification and reset emails

## Getting Started

To run the NodeJS backend locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/mnm967/ElimooBackend
   ```

2. Navigate to the project directory:
   ```
   cd ElimooBackend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up the MongoDB database:
   - Make sure you have MongoDB installed and running on your machine.
   - Create a new database named `elimoo` in MongoDB.

5. Configure the environment variables:
   - Create a `.env` file in the project root directory.
   - Add the following variables to the `.env` file:
  ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/elimoo
     FROM_EMAIL_MAILJET=your-email
     MAILJET_APIKEY_PUBLIC=your-mailjet-key
	 MAILJET_APIKEY_PRIVATE=your-mailjet-key
	 SENTRY_DSN=your-sentry-dsn
```
- Replace the fields with your actual values.
 - You can use Sentry for tracking bugs, view sentry.io for more details


6. Start the server:
   ```
   npm start
   ```

The backend server will start running on `http://localhost:3000`.

## App Repository

The Elimoo React Native app code can be found in the following repository:

https://github.com/mnm967/ElimooApp

## License

```
Copyright 2023 Mothuso Malunga

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
