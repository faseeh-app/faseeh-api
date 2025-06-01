/**
 * Core types for Faseeh plugins
 */

import { EventEmitterWrapper, PluginEvents, VaultEvents, WorkspaceEvents } from './events'

/**
 * Represents a plugin's manifest.json information
 */
export interface PluginManifest {
  // Required
  id: string
  name: string
  version: string
  minAppVersion: string
  main: string // Relative path to entry point JS

  // Optional dependency on other plugins
  pluginDependencies?: string[] // Array of required plugin IDs

  // Recommended
  description: string
  author?: string
  authorUrl?: string
  fundingUrl?: string
}

/**
 * Information about a plugin including its runtime status
 */
export interface PluginInfo {
  manifest: PluginManifest
  isEnabled: boolean
  isLoaded: boolean
  hasFailed: boolean
  error?: string
}

/**
 * Storage API interface for plugin data access
 * This is a reduced version of the complete IStorageAPI that only includes
 * methods relevant to plugins
 */
export interface IPluginStorageAPI {
  // Plugin Data (Database)
  getPluginDataEntries: (
    pluginId: string,
    key?: string,
    libraryItemId?: string | null
  ) => Promise<PluginData[]>
  getPluginDataEntryById: (id: number) => Promise<PluginData | undefined>
  createPluginDataEntry: (data: NewPluginData) => Promise<PluginData | undefined>
  updatePluginDataEntry: (
    id: number,
    dataUpdate: PluginDataUpdate
  ) => Promise<PluginData | undefined>
  deletePluginDataEntry: (id: number) => Promise<boolean>
  deletePluginDataEntriesByKey: (
    pluginId: string,
    key: string,
    libraryItemId?: string | null
  ) => Promise<number>

  // Plugin File Data (Filesystem)
  readPluginDataFile: (pluginId: string, relativePath: string) => Promise<string | undefined>
  writePluginDataFile: (pluginId: string, relativePath: string, content: string) => Promise<boolean>
  deletePluginDataFile: (pluginId: string, relativePath: string) => Promise<boolean>
  listPluginDataFiles: (pluginId: string, subDirectory?: string) => Promise<string[]>

  // App Settings
  getAppSetting: (key: string) => Promise<AppSettings | undefined>
  getAllAppSettings: () => Promise<AppSettings[]>
  setAppSetting: (setting: NewAppSettings | AppSettingsUpdate) => Promise<AppSettings | undefined>
  deleteAppSetting: (key: string) => Promise<boolean>
}

/**
 * The FaseehApp object provides plugins with access to application functionality
 */
export interface FaseehApp {
  /** Basic application information */
  appInfo: {
    readonly version: string
    readonly platform: 'win' | 'mac' | 'linux'
  }

  /** Storage API for plugin data persistence */
  storage: IPluginStorageAPI

  /** Access to other plugins */
  plugins: {
    getPlugin(id: string): BasePlugin | null
  } | null

  // Shared event emitters
  workspaceEvents: EventEmitterWrapper<WorkspaceEvents>
  vaultEvents: EventEmitterWrapper<VaultEvents>
  pluginEvents: EventEmitterWrapper<PluginEvents>

  /** Methods for displaying notifications to users (future implementation) */
  notifications?: {
    info(msg: string): void
    warn(msg: string): void
    error(msg: string): void
  }
}

// Database Types
export interface PluginData {
  id: number
  pluginId: string
  key: string
  jsonData: string
  libraryItemId: string | null
  createdAt: string
  updatedAt: string
}

export interface NewPluginData {
  pluginId: string
  key: string
  jsonData: string
  libraryItemId?: string | null
}

export interface PluginDataUpdate {
  jsonData?: string
}

export interface AppSettings {
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export interface NewAppSettings {
  key: string
  value: string
}

export interface AppSettingsUpdate {
  key: string
  value: string
}
