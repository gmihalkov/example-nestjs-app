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
