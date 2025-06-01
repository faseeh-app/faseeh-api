/**
 * Event system types for Faseeh plugins
 */
export type EventType = string | symbol

export type Handler<T = any> = (event: T) => void

/**
 * Event emitter wrapper interface for type-safe event handling
 */
export interface EventEmitterWrapper<Events extends Record<EventType, any>> {
  /**
   * Register an event handler
   */
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>, owner?: any): () => void

  /**
   * Remove an event handler
   */
  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void

  /**
   * Emit an event with data
   */
  emit<K extends keyof Events>(event: K, data: Events[K]): void
}

/**
 * Core event types for the workspace
 */
export interface WorkspaceEvents {
  'media:opened': { mediaId: string; source: string }
  'view:changed': { viewId: string }
  // Add more workspace events as needed
}

/**
 * Core event types for the vault/storage
 */
export interface VaultEvents {
  'media:saved': { mediaId: string }
  'media:deleted': { mediaId: string }
  // Add more vault events as needed
}

/**
 * Core event types for plugins
 */
export interface PluginEvents {
  'plugin:loaded': { pluginId: string }
  'plugin:unloaded': { pluginId: string }
  'plugin:disabled': { pluginId: string }
  'plugin:listUpdated': any[] // List of plugin info objects
  // Add more plugin events as needed
}
