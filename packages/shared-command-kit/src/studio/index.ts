/**
 * @module @kb-labs/shared-command-kit/studio
 * SDK helpers for defining Studio widgets, pages, and layouts.
 *
 * @example
 * ```typescript
 * import { defineStudio, definePage, section, metric, table } from '@kb-labs/shared-command-kit/studio';
 *
 * export const studioConfig = defineStudio({
 *   pages: [
 *     definePage({
 *       id: 'release.dashboard',
 *       title: 'Release Dashboard',
 *       children: [
 *         section({
 *           id: 'overview',
 *           title: 'Overview',
 *           children: [
 *             metric({ id: 'total', source: { rest: 'release/metrics' } }),
 *             table({ id: 'plans', source: { rest: 'release/plans' }, columns: [...] }),
 *           ],
 *         }),
 *       ],
 *     }),
 *   ],
 *   menus: [
 *     { id: 'release', label: 'Release', icon: 'rocket', target: 'release.dashboard' },
 *   ],
 * });
 * ```
 */

import type {
  StudioWidgetDecl,
  StudioLayoutDecl,
  StudioMenuDecl,
  StudioConfig,
  StudioWidgetKind,
  CompositeWidgetKind,
  DataSource,
  WidgetAction,
  WidgetEventConfig,
  LayoutHint,
  VisibilityRule,
  WidgetOptionsMap,
} from '@kb-labs/studio-contracts';

// =============================================================================
// Data Source Shorthand
// =============================================================================

/**
 * Shorthand for data source definition.
 * Allows concise syntax in widget definitions.
 */
export type DataSourceShorthand =
  | { rest: string; method?: 'GET' | 'POST' }
  | { mock: string }
  | { static: unknown }
  | undefined;

/**
 * Convert shorthand to canonical DataSource.
 */
function toDataSource(shorthand: DataSourceShorthand): DataSource {
  if (!shorthand) {
    return { type: 'static' };
  }
  if ('rest' in shorthand) {
    return { type: 'rest', routeId: shorthand.rest, method: shorthand.method };
  }
  if ('mock' in shorthand) {
    return { type: 'mock', fixtureId: shorthand.mock };
  }
  return { type: 'static', value: shorthand.static };
}

// =============================================================================
// Widget Node Types
// =============================================================================

/**
 * Base widget config (shared by all widgets).
 */
interface BaseWidgetConfig {
  id: string;
  title?: string;
  description?: string;
  source?: DataSourceShorthand;
  layout?: LayoutHint;
  actions?: WidgetAction[];
  events?: WidgetEventConfig;
  visibility?: VisibilityRule;
  pollingMs?: number;
  order?: number;
}

/**
 * Leaf widget config (no children).
 */
export interface LeafWidgetConfig<K extends Exclude<StudioWidgetKind, CompositeWidgetKind>>
  extends BaseWidgetConfig {
  kind: K;
  options?: WidgetOptionsMap[K];
}

/**
 * Widget node in tree (leaf, composite, or ID reference).
 */
export type WidgetNode =
  | LeafWidgetConfig<Exclude<StudioWidgetKind, CompositeWidgetKind>>
  | SectionConfig
  | GridConfig
  | StackConfig
  | TabsConfig
  | ModalConfig
  | string; // ID reference

// =============================================================================
// Composite Widget Configs
// =============================================================================

/**
 * Section widget config.
 */
export interface SectionConfig extends BaseWidgetConfig {
  kind: 'section';
  options?: WidgetOptionsMap['section'];
  children: WidgetNode[];
}

/**
 * Grid widget config.
 */
export interface GridConfig extends BaseWidgetConfig {
  kind: 'grid';
  options?: WidgetOptionsMap['grid'];
  children: WidgetNode[];
}

/**
 * Stack widget config.
 */
export interface StackConfig extends BaseWidgetConfig {
  kind: 'stack';
  options?: WidgetOptionsMap['stack'];
  children: WidgetNode[];
}

/**
 * Tab definition for tabs widget.
 */
export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  children: WidgetNode[];
}

/**
 * Tabs widget config.
 */
export interface TabsConfig extends BaseWidgetConfig {
  kind: 'tabs';
  options?: Omit<WidgetOptionsMap['tabs'], 'tabs' | 'tabChildren'>;
  tabs: TabConfig[];
}

/**
 * Modal widget config.
 */
export interface ModalConfig extends BaseWidgetConfig {
  kind: 'modal';
  options?: WidgetOptionsMap['modal'];
  children: WidgetNode[];
}

// =============================================================================
// Recursive Widget Collection
// =============================================================================

interface CollectResult {
  widgets: StudioWidgetDecl[];
  rootIds: string[];
}

/**
 * Recursively collect all widgets from a tree of nodes.
 * Returns flat list of widgets and list of root IDs.
 */
function collectWidgets(nodes: WidgetNode[]): CollectResult {
  const widgets: StudioWidgetDecl[] = [];
  const rootIds: string[] = [];

  for (const node of nodes) {
    // ID reference - just add to rootIds
    if (typeof node === 'string') {
      rootIds.push(node);
      continue;
    }

    rootIds.push(node.id);

    // Check for composite widgets
    if (node.kind === 'tabs') {
      // Tabs - special case with tabChildren mapping
      const tabsNode = node as TabsConfig;
      const allChildWidgets: StudioWidgetDecl[] = [];
      const tabChildIds: Record<string, string[]> = {};

      for (const tab of tabsNode.tabs) {
        const { widgets: tabWidgets, rootIds: tabRootIds } = collectWidgets(tab.children);
        allChildWidgets.push(...tabWidgets);
        tabChildIds[tab.id] = tabRootIds;
      }

      widgets.push(...allChildWidgets);
      widgets.push({
        id: tabsNode.id,
        kind: 'tabs',
        title: tabsNode.title,
        description: tabsNode.description,
        data: { source: toDataSource(tabsNode.source) },
        options: {
          ...tabsNode.options,
          tabs: tabsNode.tabs.map((t) => ({ id: t.id, label: t.label, icon: t.icon })),
          tabChildren: tabChildIds,
        },
        children: Object.values(tabChildIds).flat(),
        layoutHint: tabsNode.layout,
        actions: tabsNode.actions,
        events: tabsNode.events,
        visibility: tabsNode.visibility,
        pollingMs: tabsNode.pollingMs,
        order: tabsNode.order,
      } as StudioWidgetDecl);
    } else if ('children' in node && Array.isArray(node.children)) {
      // Other composite widgets (section, grid, stack, modal)
      const compositeNode = node as SectionConfig | GridConfig | StackConfig | ModalConfig;
      const { widgets: childWidgets, rootIds: childIds } = collectWidgets(compositeNode.children);
      widgets.push(...childWidgets);

      widgets.push({
        id: compositeNode.id,
        kind: compositeNode.kind,
        title: compositeNode.title,
        description: compositeNode.description,
        data: { source: toDataSource(compositeNode.source) },
        options: compositeNode.options,
        children: childIds,
        layoutHint: compositeNode.layout,
        actions: compositeNode.actions,
        events: compositeNode.events,
        visibility: compositeNode.visibility,
        pollingMs: compositeNode.pollingMs,
        order: compositeNode.order,
      } as StudioWidgetDecl);
    } else {
      // Leaf widget
      const leafNode = node as LeafWidgetConfig<Exclude<StudioWidgetKind, CompositeWidgetKind>>;
      widgets.push({
        id: leafNode.id,
        kind: leafNode.kind,
        title: leafNode.title,
        description: leafNode.description,
        data: { source: toDataSource(leafNode.source) },
        options: leafNode.options,
        layoutHint: leafNode.layout,
        actions: leafNode.actions,
        events: leafNode.events,
        visibility: leafNode.visibility,
        pollingMs: leafNode.pollingMs,
        order: leafNode.order,
      } as StudioWidgetDecl);
    }
  }

  return { widgets, rootIds };
}

// =============================================================================
// definePage
// =============================================================================

/**
 * Page configuration.
 */
export interface PageConfig {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  layout?: 'grid' | 'stack';
  children: WidgetNode[];
  actions?: WidgetAction[];
  visibility?: VisibilityRule;
  order?: number;
}

/**
 * Define a Studio page.
 * Collects all widgets recursively and returns layout + widgets.
 */
export function definePage(config: PageConfig): {
  layout: StudioLayoutDecl;
  widgets: StudioWidgetDecl[];
} {
  const { widgets, rootIds } = collectWidgets(config.children);

  return {
    layout: {
      id: config.id,
      kind: config.layout ?? 'grid',
      title: config.title,
      description: config.description,
      icon: config.icon,
      widgets: rootIds,
      actions: config.actions,
      visibility: config.visibility,
      order: config.order,
    },
    widgets,
  };
}

// =============================================================================
// defineMenu
// =============================================================================

/**
 * Menu configuration.
 */
export interface MenuConfig {
  id: string;
  label: string;
  icon?: string;
  target: string;
  order?: number;
  parentId?: string;
  visibility?: VisibilityRule;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'danger';
}

/**
 * Define a menu item.
 */
export function defineMenu(config: MenuConfig): StudioMenuDecl {
  return config;
}

// =============================================================================
// defineStudio
// =============================================================================

/**
 * Studio manifest configuration.
 */
export interface StudioManifestConfig {
  pages?: PageConfig[];
  widgets?: WidgetNode[];
  menus?: MenuConfig[];
}

/**
 * Define a complete Studio configuration.
 * Main entry point for plugin authors.
 */
export function defineStudio(config: StudioManifestConfig): StudioConfig {
  const allWidgets: StudioWidgetDecl[] = [];
  const layouts: StudioLayoutDecl[] = [];
  const menus: StudioMenuDecl[] = [];

  // Process pages -> layouts + widgets
  for (const page of config.pages ?? []) {
    const result = definePage(page);
    layouts.push(result.layout);
    allWidgets.push(...result.widgets);
  }

  // Add standalone widgets (also supports nesting)
  if (config.widgets?.length) {
    const { widgets } = collectWidgets(config.widgets);
    allWidgets.push(...widgets);
  }

  // Add menus
  for (const menu of config.menus ?? []) {
    menus.push(defineMenu(menu));
  }

  return { widgets: allWidgets, layouts, menus };
}

// =============================================================================
// Widget Factory Helpers
// =============================================================================

type LeafKind = Exclude<StudioWidgetKind, CompositeWidgetKind>;

/**
 * Create a widget config factory for a specific kind.
 */
function createWidgetFactory<K extends LeafKind>(kind: K) {
  return (
    config: Omit<LeafWidgetConfig<K>, 'kind'> & { options?: WidgetOptionsMap[K] }
  ): LeafWidgetConfig<K> => ({
    ...config,
    kind,
  });
}

// Display widgets (14)
export const metric = createWidgetFactory('metric');
export const metricGroup = createWidgetFactory('metric-group');
export const table = createWidgetFactory('table');
export const card = createWidgetFactory('card');
export const cardlist = createWidgetFactory('cardlist');
export const chartLine = createWidgetFactory('chart-line');
export const chartBar = createWidgetFactory('chart-bar');
export const chartPie = createWidgetFactory('chart-pie');
export const chartArea = createWidgetFactory('chart-area');
export const timeline = createWidgetFactory('timeline');
export const tree = createWidgetFactory('tree');
export const json = createWidgetFactory('json');
export const diff = createWidgetFactory('diff');
export const logs = createWidgetFactory('logs');

// Form widgets (6)
export const form = createWidgetFactory('form');
export const input = createWidgetFactory('input');
export const select = createWidgetFactory('select');
export const checkboxGroup = createWidgetFactory('checkbox-group');
export const switchWidget = createWidgetFactory('switch');
export const datePicker = createWidgetFactory('date-picker');

// Navigation widgets (3)
export const breadcrumb = createWidgetFactory('breadcrumb');
export const stepper = createWidgetFactory('stepper');
export const menu = createWidgetFactory('menu');

// Feedback widgets (2)
export const alert = createWidgetFactory('alert');
export const confirm = createWidgetFactory('confirm');

// =============================================================================
// Composite Widget Factories
// =============================================================================

/**
 * Create a section widget.
 */
export function section(
  config: Omit<SectionConfig, 'kind'> & { options?: WidgetOptionsMap['section'] }
): SectionConfig {
  return { ...config, kind: 'section' };
}

/**
 * Create a grid widget.
 */
export function grid(
  config: Omit<GridConfig, 'kind'> & { options?: WidgetOptionsMap['grid'] }
): GridConfig {
  return { ...config, kind: 'grid' };
}

/**
 * Create a stack widget.
 */
export function stack(
  config: Omit<StackConfig, 'kind'> & { options?: WidgetOptionsMap['stack'] }
): StackConfig {
  return { ...config, kind: 'stack' };
}

/**
 * Create a tabs widget.
 */
export function tabs(
  config: Omit<TabsConfig, 'kind'> & { options?: Omit<WidgetOptionsMap['tabs'], 'tabs' | 'tabChildren'> }
): TabsConfig {
  return { ...config, kind: 'tabs' };
}

/**
 * Create a modal widget.
 */
export function modal(
  config: Omit<ModalConfig, 'kind'> & { options?: WidgetOptionsMap['modal'] }
): ModalConfig {
  return { ...config, kind: 'modal' };
}

// =============================================================================
// Re-exports from studio-contracts
// =============================================================================

export type {
  StudioWidgetDecl,
  StudioLayoutDecl,
  StudioMenuDecl,
  StudioConfig,
  StudioWidgetKind,
  CompositeWidgetKind,
  DataSource,
  WidgetAction,
  WidgetEventConfig,
  LayoutHint,
  VisibilityRule,
  WidgetOptionsMap,
} from '@kb-labs/studio-contracts';
