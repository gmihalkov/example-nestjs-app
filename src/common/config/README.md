# @/common/config

This module provides you the methods to parse and validate environment variables using DTO classes, just like Nest.js does for incoming HTTP requests or WS message bodies.

## Common rules

- Each module must have it's own independent configuration. Don't put everything in one file.
- The configuration file must be placed at the same level as the module file.
- The property names must be in `camelCase` as usual class properties. To cast the naming, use `@Expose({ name: 'NODE_ENV' })`;
- All properties must be required. The default values are in `.env` file.

The good example is [@/modules/auth](../../modules/auth/auth.config.ts). In the section below, we will use this module as the demonstration.

## Getting started

First, you need to define a configuration class:

```typescript
// src/modules/auth/auth.config.ts
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

import { Config } from "@/common/config";

export class AuthConfig extends Config {
  @Expose({ name: "AUTH_TOKEN_SIGNATURE" })
  @IsString()
  @IsNotEmpty()
  public readonly tokenSignature!: string;
}
```

We suggest to use the same folder as the module file does:

```
src/modules/auth/:
	auth.config.ts
	auth.module.ts
```

Next, you need to register this configuration as a provider:

```typescript
// src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";

import { AuthService } from "./services/auth.service";
import { AuthConfig } from "./auth.config";

@Module({
  providers: [AuthConfig, AuthService],
})
export class AuthModule {}
```

And, finally, you can inject the configuration as a provider:

```typescript
// src/modules/auth/services/auth.service.ts
import { Inject, Injectable } from "@nestjs/common";

import { AuthConfig } from "../auth.config";

@Injectable()
export class AuthService {
  @Inject(AuthConfig)
  private readonly config!: AuthConfig;
}
```

### Using without extending the base class

If by some reason you cannot inherit your configuration DTO class from [Config](./entities//config.entity.ts), you can use the workaround:

```typescript
// src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";

import { ConfigModule } from "@/common/config";

import { AuthService } from "./services/auth.service";
import { AuthConfig } from "./auth.config";

@Module({
  imports: [ConfigModule.register([AuthConfig])],
  providers: [AuthService],
})
export class AuthModule {}
```

It also will register your configuration as a provider inside the module.

## Using outside of Nest.js

The good example is here: [typeorm.options.ts](../../typeorm.options.ts).

If your class inherits the base [Config](./entities/config.entity.ts) class, you can simply do:

```typescript
import { TypeOrmConfig } from "@/common/typeorm";

const config = TypeOrmConfig.create();
```

If it doesn't, there is [ConfigHelper](./helpers/config.helper.ts) that does the similar thing:

```typescript
import { ConfigHelper } from "@/common/config";
import { TypeOrmConfig } from "@/common/typeorm";

const config = ConfigHelper.create(TypeOrmConfig);
```
