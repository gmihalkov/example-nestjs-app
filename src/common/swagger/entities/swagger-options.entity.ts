/**
 * Represents an OpenAPI spec options.
 */
export interface SwaggerOptions {
  /**
   * The API name.
   */
  title: string;

  /**
   * The API description.
   */
  description: string;

  /**
   * The base path to the all application routes.
   *
   * @default '/'
   */
  basePath?: string;

  /**
   * The API version.
   *
   * @default '1.0'
   */
  version?: string;
}
