# Example Nest.js App

This is a demo application on Nest.js. Its goal is to show the basic setup of a project, plus a few nice-to-have features. Theoretically, this repository can be used as a basis for any product in the Nest.js ecosystem - so you don't have to start from scratch.

**Functionality of the application**

- The application provides a REST API that:
  - Offers automatically generated documentation.
  - Supports user authorization and registration (with email verification);
  - Provides CRUD operations on the user list.
  - Supports request tracing (compatible with Sentry);
  - Supports health-check;
  - Supports WebSockets.

**Technical stack**

- Web server on Nest.js + Fastify;
- Postgres database;
- Redis for caching and for communication between multiple application instances.
- Local SMTP server that allows "sending" emails (or rather, it displays sent emails through its web interface or Node.js API for integration testing).

## Working with environment variables

> The complete list of environment variables and their descriptions [you can find here](./env).

### Overview

The project keeps all environment variables in `.env` files in the root folder. There are two of them:

- `.env` contains the default values, that means, the values to run the application locally;
- `.env.local` contains the values to override them.

The second file will be created automatically once you call `npm install`; and it's ignored by Git, so, don't be
afraid that your local settings will get into the repository.

However, the both files will be copied into the application Docker container, so, be careful with it. The reasons why it was done in this way, you can find in the sections below.

And, of course, you can set the environment variables using CLI like `PORT=8080 npm run start`.

### Accessing the variables in the code

The environment variables listed in the dot-env files will be accessible in any TS script you launch. It is because we command `ts-node` to pick them up in the [tsconfig.json/ts-node/require](./tsconfig.json).

However, we don't recommend to use them raw. The key to application stability is validating every input, and we have a special instrument for it: the [@/common/config](./src/common/config) module.

Since we already use [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) to validate the incoming HTTP requests and WS messages, why not use them to validate environment variables as well? That's exactly what `@/common/config` does.

The detailed instruction you can find [in the module documentation](./src/common/config).

### Accessing the variables in the tooling scripts

If your script is written in TS, there is the same rules as above. And since we insist that all scripts are written in TypeScript, there shouldn’t be any issues with the variables either.

### Accessing the variables in the bash-scripts

Again, we insist that all scripts must be in TypeScript. There is a very useful library to use shell commands in TS: [Shell.js](https://github.com/shelljs/shelljs).

Why are we so insistent on using TypeScript?

- It's cross-platform. Our goal is making you able to run the application on any OS and CPU architecture.
- Few of us know Bash well enough to account for all its quirks. In that regard, TypeScript is much more convenient and predictable.

### Accessing the variables in docker-compose.yaml

Take a look into [docker-compose.yaml](./docker-compose.yaml). We added `env_file` section to each service definition. It makes Docker Compose load the environment variables from `.env` and `.env.local`.

So, don't forget to add this section too when you add a new service.

### Accessing the variables in Dockerfile

There are two moments that need your attention:

- The current Dockerfile copies `.env` and `.env.local` into the container. Don't remove this behavior because it will break the application;
- Don't use build arguments just for passing the environment variables to the application. The propriate way to pass the variables is just adding them into `.env` or `.env.local`. It frees you from the necessity to change the Dockerfile every time once you added or removed a variable.

Luckily, we have no need to use the environment variables inside Dockerfile (I mean, right in the file's code, at the image building step). But if this need will appear, there are several ways to do it:

- Use Docker Compose to build the images, and let it handle the variables on its own.
- If you cannot use Docker Compose by some reason, the only way is using `--build-arg` + `ENV` docker instruction. Sad but true.

### Overriding the variables in CI/CD

When you need to override some variables in CI/CD pipeline you can just add them into `.env.local` like this:

```bash
echo "NODE_ENV=production" >> .env.local
echo "PORT=80" >> .env.local
```

or, if you already store the overrides in a file:

```bash
cat path_to_file >> .env.local
```

or, using Doppler:

```bash
doppler secrets download --format=env --no-file -p project_name -c config_name >> .env.local
```

It's enough to get things work.
