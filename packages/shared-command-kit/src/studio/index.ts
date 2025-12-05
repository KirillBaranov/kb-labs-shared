/**
 * @module @kb-labs/shared-command-kit/studio
 * Studio widget helpers (FUTURE IMPLEMENTATION)
 *
 * TODO: Implement Studio widget helpers
 * - defineWidget() - Type-safe widget definition
 * - usePluginApi() - Hook for API calls with loading/error state
 * - Pre-built components: Card, Input, Button, Select, etc.
 * - Layout helpers: Grid, Stack, Flex
 *
 * Priority: #6 (Lower priority - niche use case)
 * Effort: High (React dependencies, component library)
 * Impact: Medium (only Studio widgets)
 *
 * @example Future API:
 * ```typescript
 * import { defineWidget, usePluginApi, Card, Input, Button } from '@kb-labs/shared-command-kit/studio';
 *
 * export const QueryWidget = defineWidget({
 *   name: 'mind:query',
 *   component: () => {
 *     const { loading, result, error } = usePluginApi({
 *       endpoint: '/v1/plugins/mind/query',
 *       method: 'POST',
 *     });
 *
 *     return (
 *       <Card title="Mind Query">
 *         <Input label="Query" placeholder="Enter your query" />
 *         <Button onClick={submit} loading={loading}>Search</Button>
 *         {error && <ErrorDisplay error={error} />}
 *         {result && <ResultDisplay data={result} />}
 *       </Card>
 *     );
 *   },
 * });
 * ```
 */

/**
 * Widget definition (stub)
 * @future This will be implemented when Studio widget support is added
 */
export interface WidgetDefinition {
  name: string;
  component: () => any; // React.ComponentType in future
}

/**
 * Define a Studio widget (stub)
 *
 * @future This will be implemented when Studio widget support is added
 * @throws Error indicating this feature is not yet implemented
 */
export function defineWidget(_definition: WidgetDefinition): never {
  throw new Error(
    'defineWidget is not yet implemented. ' +
    'This is a planned feature for future releases. ' +
    'See: kb-labs-shared/packages/shared-command-kit/src/studio/index.ts'
  );
}

/**
 * Export stub for future implementation
 */
export const studio = {
  defineWidget,
};
