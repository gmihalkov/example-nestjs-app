import type { ExecutionContext } from '@nestjs/common';

/**
 * Describes an execution context custom metadata.
 */
type Meta = Map<string, unknown>;

/**
 * The helper that contains the methods to work with the Nest.js execution context. Mostly, it's
 * focused on attaching custom metadata to the context.
 */
export class ExecutionContextHelper {
  /**
   * The key by which we store the custom metadata in the execution context.
   */
  private static CUSTOM_METADATA = Symbol('custom_metadata');

  /**
   * Returns a custom value stored in the passed execution context.
   *
   * @param context
   * The execution context.
   *
   * @param name
   * The key under which the value is stored.
   *
   * @returns
   * A value or `undefined` if the value is not set.
   */
  public static getMeta<T>(context: ExecutionContext, name: string): T | undefined {
    const meta = this.getMetaMap(context);

    return meta.get(name) as T | undefined;
  }

  /**
   * Stores the given value in the passed execution context.
   *
   * @param context
   * The execution context.
   *
   * @param name
   * The key under which we want to store the value.
   *
   * @param value
   * The value to be stored.
   */
  public static setMeta<T>(context: ExecutionContext, name: string, value: T): void {
    const meta = this.getMetaMap(context);

    meta.set(name, value);
  }

  /**
   * Returns a custom metadata collection of the given execution context.
   *
   * @param context
   * The execution context.
   *
   * @returns
   * A custom metadata collection.
   */
  private static getMetaMap(context: ExecutionContext): Meta {
    let meta: Meta | undefined = Reflect.getMetadata(this.CUSTOM_METADATA, context);

    if (!meta) {
      meta = new Map();
      Reflect.defineMetadata(this.CUSTOM_METADATA, meta, context);
    }

    return meta;
  }
}
