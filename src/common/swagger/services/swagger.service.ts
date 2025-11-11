import { type INestApplication as App, Inject, Injectable, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  type ApiOperationOptions,
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import type { ApiControllerOptions } from '../entities/api-controller-options.entity';
import type { SwaggerOptions as Options } from '../entities/swagger-options.entity';
import { SwaggerMetadata } from '../enums/swagger-metadata.enum';

/**
 * The service that is responsible for Open API spec generation.
 */
@Injectable()
export class SwaggerService {
  /**
   * The service that allows to find another Nest.js providers.
   */
  @Inject(DiscoveryService)
  private discovery!: DiscoveryService;

  /**
   * The service that allows to read decorators' metadata.
   */
  @Inject(Reflector)
  private reflector!: Reflector;

  /**
   * The service that allows to scan the class members' metadata.
   */
  @Inject(MetadataScanner)
  private metadataScanner!: MetadataScanner;

  /**
   * The nullable property that contains a built Open API spec. It's `undefined` until the `setup()`
   * call.
   */
  private unsafeDocument?: OpenAPIObject;

  /**
   * The OpenAPI specification.
   */
  public get document(): OpenAPIObject {
    if (this.unsafeDocument) {
      return this.unsafeDocument;
    }

    throw new Error('Expect "this.unsafeDocument" to be defined');
  }

  /**
   * The nullable property that contains Swagger module options. It's `undefined` until the
   * `setup()` call.
   */
  private unsafeOptions?: Required<Options>;

  /**
   * The Swagger module options.
   */
  public get options(): Required<Options> {
    if (this.unsafeOptions) {
      return this.unsafeOptions;
    }

    throw new Error('Expect "this.unsafeOptions" to be defined');
  }

  /**
   * Sets up the service for the given parent Nest.js application.
   *
   * @param app
   * The parent Nest.js application.
   *
   * @param options
   * The OpenAPI spec options.
   */
  public setup(app: App, options: Options) {
    this.unsafeOptions = this.setDefaultOptions(options);
    this.unsafeDocument = this.buildDocument(app, this.unsafeOptions);
  }

  /**
   * Adds the default values to the passed Swagger module options.
   *
   * @param options
   * The options with optional properties.
   *
   * @returns
   * The options where the all properties are set.
   */
  private setDefaultOptions(options: Options): Required<Options> {
    const { basePath = '/', version = '1.0', ...requiredProperties } = options;

    return {
      ...requiredProperties,
      basePath,
      version,
    };
  }

  /**
   * Generates an Open API specification of the given application using the passed options.
   *
   * @param app
   * The application to which we're generating the specification.
   *
   * @param options
   * The Swagger module options.
   *
   * @returns
   * An Open API specification object.
   */
  private buildDocument(app: App, options: Required<Options>): OpenAPIObject {
    let builder = new DocumentBuilder();

    builder = this.setTitle(builder, options);
    builder = this.setDescription(builder, options);
    builder = this.setVersion(builder, options);
    builder = this.setTags(builder);

    const document = SwaggerModule.createDocument(app, builder.build());

    this.patchOperationParameters(document);

    return document;
  }

  /**
   * Adds a title from the given options to the passed Open API document.
   *
   * @param document
   * The Open API document to be modified.
   *
   * @param options
   * The Swagger module options.
   *
   * @returns
   * An updated document.
   */
  private setTitle(document: DocumentBuilder, options: Required<Options>): DocumentBuilder {
    return document.setTitle(options.title);
  }

  /**
   * Adds a description from the given options to the passed Open API document.
   *
   * @param document
   * The Open API document to be modified.
   *
   * @param options
   * The Swagger module options.
   *
   * @returns
   * An updated document.
   */
  private setDescription(document: DocumentBuilder, options: Required<Options>): DocumentBuilder {
    return document.setDescription(options.description);
  }

  /**
   * Adds a description from the given options to the passed OpenAPI document.
   *
   * @param document
   * The Open API document to be modified.
   *
   * @param options
   * The Swagger module options.
   *
   * @returns
   * An updated document.
   */
  private setVersion(document: DocumentBuilder, options: Required<Options>): DocumentBuilder {
    return document.setVersion(options.version);
  }

  /**
   * Extracts Open API tags from the controllers' decorators, and adds them into the passed
   * Open API specification.
   *
   * @param document
   * The Open API document to be modified.
   *
   * @returns
   * An updated document.
   */
  private setTags(document: DocumentBuilder): DocumentBuilder {
    const controllers = this.discovery.getControllers();

    const sections = new Map<string, string>();

    for (const controller of controllers) {
      const { instance } = controller;

      if (instance == null) {
        continue;
      }

      const options = this.reflector.get<ApiControllerOptions>(
        SwaggerMetadata.API_CONTROLLER,
        instance.constructor,
      );

      if (options == null) {
        continue;
      }

      const { title, description } = options;
      sections.set(title, description);
    }

    const tags = sections.entries();

    let result = document;

    for (const [title, description] of tags) {
      result = result.addTag(title, description);
    }

    return result;
  }

  /**
   * Finds all API operation parameters defined in the `@ApiParameter()` decorators, and adds them
   * into the given Open API document.
   *
   * We need to patch the operations because `@nestjs/swagger` ignores the
   * passed `@ApiOperation({ parameters })` by some reason.
   *
   * @param document
   * The original document.
   *
   * @returns
   * An updated document.
   */
  private patchOperationParameters(document: OpenAPIObject): void {
    const controllers = this.discovery.getControllers();

    for (const controller of controllers) {
      const { instance } = controller;

      if (instance == null) {
        continue;
      }

      const controllerType = instance.constructor;
      const controllerPath = this.reflector.get<string>(PATH_METADATA, controllerType);

      if (controllerPath == null) {
        continue;
      }

      const prototype = Object.getPrototypeOf(instance);
      const methods = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methods) {
        const controllerMethod = prototype[methodName];

        const operationOptions = this.reflector.get<ApiOperationOptions>(
          'swagger/apiOperation',
          controllerMethod,
        );

        if (operationOptions == null) {
          continue;
        }

        const operationParameters = operationOptions.parameters ?? [];

        if (operationParameters.length === 0) {
          continue;
        }

        const controllerMethodPath = this.reflector.get<string>(PATH_METADATA, controllerMethod);

        if (controllerMethodPath == null) {
          continue;
        }

        const requestMethod = this.reflector.get<RequestMethod>(METHOD_METADATA, controllerMethod);

        if (requestMethod == null) {
          continue;
        }

        const fullPath = SwaggerService.joinPath(
          this.options.basePath,
          controllerPath,
          controllerMethodPath,
        );

        const pathSpec = document.paths[fullPath];

        if (pathSpec == null) {
          continue;
        }

        const operationKey = SwaggerService.convertRequestMethodToString(requestMethod);

        if (operationKey == null) {
          continue;
        }

        const operationSpec = pathSpec[operationKey];

        if (operationSpec == null) {
          continue;
        }

        operationSpec.parameters ??= [];
        operationSpec.parameters.push(...operationParameters);
      }
    }
  }

  /**
   * Joins the given path parts into an absolute path.
   *
   * @param parts
   * The path parts.
   *
   * @returns
   * An absolute path.
   */
  private static joinPath(...parts: string[]): string {
    const trim = this.trimPath.bind(this);

    const trimmedParts = parts.map(trim);
    const nonEmptyParts = trimmedParts.filter(Boolean);
    const absolutePath = nonEmptyParts.join('/');

    return `/${absolutePath}`;
  }

  /**
   * Removes the starting and trailing slashes from the given path.
   *
   * @param path
   * The path with an optional starting or/and trailing slashes.
   *
   * @returns
   * The path without them.
   */
  private static trimPath(path: string): string {
    return path.replace(/^\/|\/$/g, '');
  }

  /**
   * Tries to convert the given request method into an Open API compatible string.
   *
   * @param method
   * The request method to be converted.
   *
   * @returns
   * A string or `undefined` if the passed request method is not an Open API compatible.
   */
  private static convertRequestMethodToString(method: RequestMethod) {
    switch (method) {
      case RequestMethod.DELETE: {
        return 'delete';
      }
      case RequestMethod.OPTIONS: {
        return 'options';
      }
      case RequestMethod.PATCH: {
        return 'patch';
      }
      case RequestMethod.POST: {
        return 'post';
      }
      case RequestMethod.HEAD: {
        return 'head';
      }
      case RequestMethod.GET: {
        return 'get';
      }
      case RequestMethod.PUT: {
        return 'put';
      }
      default: {
        return undefined;
      }
    }
  }
}
