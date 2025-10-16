# Example Nest.js app

This project is a demonstration of a typical Nest.js application setup, showcasing how to solve common problems encountered in real-world backend development.

It includes a fully functional HTTP API with user registration, authentication, deletion, and listing.

The project also features a Kubernetes-compatible health check, auto-generated API documentation, and integration tests.

# CLI commands

The project includes several CLI commands that can make a developer's life easier.

## Commands to run the project

### npm run start

This command starts the application's web server. The port that the server will listen on can be specified via the PORT environment variable. By default, it is `8080`.

### npm run watch

This command also starts the web server, but additionally automatically restarts it if the source code changes. This command also respects the `PORT` variable.

### npm run dry-run

This command starts the application and immediately stops it using `nestApp.init()` and `nestApp.close()`. It allows to check whether the application works or not.

## Commands to check the source code

### npm run check

This command performs a quick check of the project. It includes:

- TypeScript type checking;
- Running the linter (without fixing code);
- Performing a dry run of the application (see above).

Each of these steps can also be run individually using the following commands:

- `npm run check:types`
- `npm run check:lint`
- `npm run check:dry-run`

## Commands to run tests and check the coverage

### npm run test

This command runs tests.

### npm run test-with-coverage

This command also runs the tests, but in addition, it collects code coverage. The coverage information is saved at `./coverage/lcov.info`. Later, it can be submitted to services like Qodana or SonarQube.

### npm run show-coverage

This command runs the tests, collects coverage, and opens the coverage report page in the default web browser.

### npm run print-coverage

This command runs the tests, collects coverage, and displays it in the console in a human-readable format.
