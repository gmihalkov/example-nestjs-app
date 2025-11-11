import { Controller, Get, Inject, Response } from '@nestjs/common';
import { ApiExcludeController, type OpenAPIObject } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';

import { SwaggerService as Service } from '../services/swagger.service';

/**
 * The controller that serves requests to the Open API specification and documentation.
 */
@Controller('/docs')
@ApiExcludeController()
export class SwaggerController {
  /**
   * The service that works with Open API specification.
   */
  @Inject(Service)
  private service!: Service;

  /**
   * Returns an Open API specification in JSON.
   */
  @Get('/spec.json')
  public getSpec(): OpenAPIObject {
    return this.service.document;
  }

  /**
   * Returns a ReDoc HTML page.
   */
  @Get('/')
  public getDocs(@Response() response: FastifyReply): void {
    const { basePath, title } = this.service.options;

    const urlPrefix = basePath.replace(/\/$/, '');
    const url = `${urlPrefix}/docs/spec.json`;

    response.header('content-type', 'text/html; charset=utf-8');

    response.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8"/>
          <style>
            body { margin: 0; }
          </style>
        </head>
        <body>
          <redoc spec-url="${url}"></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    `);
  }
}
