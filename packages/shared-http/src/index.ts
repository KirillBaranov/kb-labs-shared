export { registerOpenAPI, type OpenAPIOptions } from './register-openapi.js';
export { resolveSchemaRef, type SchemaRef, type ZodSchemaRef, type JsonSchemaRef } from './resolve-schema-ref.js';
export { ErrorResponseSchema, OkResponseSchema, type ErrorResponse } from './schemas.js';

// Re-export fastify-type-provider-zod utilities so services don't need
// a direct dependency on fastify-type-provider-zod for the common cases.
export {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
