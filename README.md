# Example Nest.js app

This project is a demonstration of a typical Nest.js application setup, showcasing how to solve common problems encountered in real-world backend development.

It includes a fully functional HTTP API with user registration, authentication, deletion, and listing.

The project also features a Kubernetes-compatible health check, auto-generated API documentation, and integration tests.

## Running TypeScript code

Here we use `ts-node` to run the TypeScript code without a pre-build. It gives [a small overhead](https://github.com/TypeStrong/ts-node/issues/104#issuecomment-250252708) at the application startup, but, even in production, it's usually not so critical.

The main advantages of this approach:

- We make our pipelines faster: there is no additional heavy step in them;
- No source maps required; it's useful for Sentry, for example.
- We can use Node.js [test runner](https://nodejs.org/api/test.html) with TypeScript and still have TS path aliases, decorators, and things like this.
- The same we can say about the TypeORM migrations;
- We can use `tsconfig.json/ts-node/require`. It's a great feature that allows us to execute some code before any TS script is invoked without a necessity to list `--require` flags every time.

There are three usages of `ts-node/require` in our project:

- Make TypeScript path aliases work everywhere;
- Make TypeScript decorators work everywhere;
- Make any script in our project be able to use environment variables listed in `.env` and `.env.local` automatically (even TypeORM migrations or custom tooling scripts).

## Environment variables

As we said previously, we use two service files in our project: `.env` and `.env.local`. It is a source-of-truth of the project's configuration.

The first one contains the default values of **all** environment variables used in our code. Putting new values, we need to keep in mind that "default" means _"the ones that are used on the developer's local machine"_. We should not put there anything related with the development, staging or (for a God's sake) production environments. That's why, for example, the current `POSTGRES_HOST` variable is defined as `localhost`.

The second file, `.env.local` refines the environment variables for your local machine. For example: by default, the application listens the port `3000`, and the Postgres database is running at `3010`. If any of these ports are in use, you can re-defined them in `.env.local`.

As it's said previously, all values listed in `.env` and `.env.local` are visible across all TS scripts in the project. We also added them into the [Docker Compose file](./docker-compose.yaml).

### Q: How can I use environment variables in the code?

We have the `@/common/config` module for it. This module export an interface to use environment variables as injectable Nest.js providers.

For example, you want to use the `AUTH_TOKEN_SIGNATURE` variable in your authorization module. First, you need to define the DTO class in the root module's folder like:

```typescript
// ./src/modules/auth/auth.config.ts
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class AuthConfig {
  @Expose({ name: "AUTH_TOKEN_SIGNATURE" })
  @IsString()
  @IsNotEmpty()
  public readonly tokenSignature!: string;
}
```

Next, you need to register this class as a Nest.js provider in your module using `@/common/config`:

```typescript
// ./src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";

import { ConfigModule } from "@/common/config";

import { AuthConfig } from "./auth.config";

@Module({
  // Here we parse and validate the environment variables. If some of them didn't pass the
  // validation, the application will fail at startup with a comprehensive error message.
  imports: [ConfigModule.register([AuthConfig])],
  // You also can export the configuration if you want to use it in the another modules.
  exports: [AuthConfig],
})
export class AuthModule {}
```

And, finally, you can use `AuthConfig` as a Nest.js provider:

```typescript
// ./src/modules/auth/services/auth.service

export class AuthService {
  @Inject(AuthConfig)
  private readonly config: AuthConfig;

  public createToken() {
    // ...
    return JwtHelper.create(payload, this.config.tokenSignature);
  }
}
```

### Q: I want to add a new environment variable. How can I do it?

The first few words about the naming convention. The variable names must be in `SCREAMING_SNAKE_CASE`. They must start from the module name and explicitly describe their subjects (i.e., no `JWT_SIGNATURE` variables, only `AUTH_TOKEN_SIGNATURE`). The only exception is the `PORT` variable, by a third-party compatibility reasons.

Next, there is no place when we list all environment variables or our project. Even the ["@/app.config"](./src/app.config.ts) file contains just a part of the variables required to define `TypeOrmModule.forRoot()`.

If you're adding a variable needed specifically in your module, define a DTO class inside this module. If you're adding a variable needed across all modules in the project, add a specific module for it, and export its config. Let's be SOLID.

### Q: I need to use the environment variable in my Bash script. How can I do it?

First, we're avoiding to use Bash scripts at all. Almost all, that we want to do in Bash, could be done in NPM scripts. There are a lot of useful CLI utils in NPM registry, try to find the suitable one (for example, take a look to `package.json/scripts/preinstall`). If you found a good CLI command, use [dotenv-cli](https://www.npmjs.com/package/dotenv-cli).

Next, if there is no ready-to-use solution in NPM, we can implement the our one in the `./scripts` folder, and invoke it via NPM like `"<command-name>": "ts-node ./scripts/<your-script>.ts"`. Here is a great library to help you with shell-scripting: [ShellJS](https://github.com/shelljs/shelljs). We suggest wrapping all CLI utilities into TS because:

- It supports `.env` and `.env.local` out of the box;
- It's cross-platform;
- It allows you to use the application Nest.js modules under the hood. For example, you don't need to write SQL queries to add some data in the database in the script, just use the proper TypeORM repository from the application's code, and it will work.

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
