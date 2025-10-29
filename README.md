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

## Getting started

You need to do several simple steps to work with the project.

### Install the system dependencies

The project requires:

- Node.js v22 (we suggest using [nvm](https://github.com/nvm-sh/nvm));
- Docker;
- Docker Compose;

Once you've installed all these tools, you can proceed with the next steps.

### Install the project dependencies

Simply run:

```bash
npm install
```

and the script will do the rest.

### Start the project's infrastructure

The application depends on Postgres DB, Redis and an SMTP server. So, we need to get them up:

```bash
docker-compose up -d
```

As you see, our infrastructure is a bunch of Docker containers managed by Docker Compose. So, you’ll need to start them again each time you reboot your machine.

### Set up the infrastructure

We started the database, but it's empty. Now, we need to create the project tables and put some initial records into it:

```bash
npm run setup
```

It’s a command that sets up the infrastructure. Currently, it only runs the database migrations, but we may extend it in the future.

Keep in mind that someone may change the database structure in any PR, so it’s a good practice to run `npm run setup` every time you pull the latest changes from the main branch.

### Start the application

There are several options depending on what you want to do. To simply start the app:

```bash
npm run start
```

If you’re a backend developer who wants to write new code, you need to run:

```bash
npm run watch
```

This command runs the app in watch mode - it automatically restarts whenever you change the code.

If you just want to make sure the app works, run:

```bash
npm run start --dry-run
```

It will start the app and then immediately stop it.

### Stop the infrastructure

Once you’re done, you can run:

```bash
docker-compose down
```

to stop the database, Redis, and everything else.

**PS.** There’s a neat trick that not only stops the database, but also clears it:

```bash
docker-compose down -v
```

This command removes all local data, so the next time you run it, you’ll start with a fresh database.

## Working with environment variables

> The complete list of environment variables and their descriptions [you can find here](./.env).

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
