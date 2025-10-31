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
npm run up
```

It's just an alias for `docker-compose up -d`.

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
npm run down
```

to stop the database, Redis, and everything else. It's just an alias for `docker-compose down`.

**PS.** There’s a neat trick that not only stops the database, but also clears it:

```bash
npm run down -- -v
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

## Working with Docker containers

The project contains several Docker containers:

- The [application itself](https://hub.docker.com/_/node);
- The local [Postgres DB](https://hub.docker.com/_/postgres);
- The local [Redis server](https://hub.docker.com/_/redis);
- The local [SMTP server](https://hub.docker.com/r/rnwood/smtp4dev).

In other words, everything can be divided into two groups: the application itself and its infrastructure.

### Infrastructure

When it comes to infrastructure, it’s described in the [docker-compose.yaml](./docker-compose.yaml) file. We don’t expect it to be used anywhere except on a local machine.

There are a few important details in this file worth paying attention to:

- The services don't have defined `container_name`. This is intentional - it prevents the project’s containers from conflicting with any existing ones. By default, Docker Compose generates container names in the format `<project-folder-name>-<service-name>`, and that behavior works perfectly fine for us.
- Each service includes an `env_file` directive. This ensures that environment variables from `.env` and `.env.local` files are loaded into the containers.
- All volumes in the file are _named volumes_. This allows you to easily reset the database with a single command `docker-compose down -v`.

Accordingly, any new services we add to the infrastructure should follow the same rules.

### Application

While the [docker-compose.yaml](./docker-compose.yaml) file defines the local infrastructure, the [Dockerfile](./Dockerfile) describes the container for the application itself.

This container includes [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/), which runs multiple parallel instances of the application.

PM2 runs in [cluster mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/) and doesn’t impose any limits on the number of active Node.js instances. In other words, if you don’t specify the maximum number of CPU cores available to the container, the application will use all of them. The same applies to memory usage.

We assume that the host machine running the application will handle resource allocation at startup, for example:

```bash
docker run --cpus=MAX_CPU --memory=MAX_MEMORY ...
```

In most cases, the hosting provider allows you to configure these parameters directly through its admin panel. That said, you can still control the number of instances via your `.env.local` file:

```ini
PM2_INSTANCES=2
```

If you include this setting, PM2 will limit itself to just two CPU cores instead of using all available ones.

### Checking the app PM2 cluster

If you want to start the application as a PM2 cluster, simply run:

```bash
npm run start-cluster
```

This is the exact same command executed inside the [Docker container](./Dockerfile), ensuring that the runtime conditions are as close as possible to those on remote servers.

### Checking the app container

Sometimes during development, you may want to test how the application behaves inside a Docker container. To make this easier, we’ve added a lightweight helper — [docker-compose.check-dockerfile.yaml](./docker-compose.check-dockerfile.yaml) — along with a convenience command:

```bash
npm run check-cluster
```

which is essentially just an alias for:

```bash
docker-compose -f ./docker-compose.check-dockerfile.yaml up --build
```

This command rebuilds the application container and runs it while streaming logs directly to the console.

As the filenames and command names suggest, this setup is meant **only for debugging the container**.  
**Do not use it in CI/CD pipelines!**
