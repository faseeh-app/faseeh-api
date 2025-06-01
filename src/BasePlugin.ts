import type { FaseehApp, PluginManifest } from './types'

/**
 * The BasePlugin class that all Faseeh plugins must extend.
 * Provides lifecycle methods and helper utilities for plugins.
 */
export abstract class BasePlugin {
  /** Application API object */
  public readonly app: FaseehApp

  /** Plugin manifest information */
  public readonly manifest: PluginManifest

  /** Internal tracking of registered event listeners for automatic cleanup */
  private listenerCleaners: Array<() => void> = []

  /**
   * Creates a new plugin instance
   * @param app The FaseehApp API object
   * @param manifest The plugin's manifest data
   */
  constructor(app: FaseehApp, manifest: PluginManifest) {
    this.app = app
    this.manifest = manifest
  }

  /**
   * Called when the plugin is loaded by the Plugin Manager.
   * Must be implemented by all plugins.
   */
  public abstract onload(): Promise<void>

  /**
   * Called when the plugin is being unloaded by the Plugin Manager.
   * Must be implemented by all plugins for cleanup.
   */
  public abstract onunload(): void | Promise<void>

  /**
   * Registers an event handler with automatic tracking for cleanup.
   * @param disposer A function that cleans up the event handler when called
   */
  public registerEvent(disposer: () => void): void {
    this.listenerCleaners.push(disposer)
  }

  /**
   * Load plugin specific data from database storage (global scope)
   * @returns The loaded data or an empty object if no data exists
   */
  public async loadData(): Promise<any> {
    return this.loadDataWithContext(null)
  }

  /**
   * Save plugin specific data to database storage (global scope)
   * @param data The data to save
   */
  public async saveData(data: any): Promise<void> {
    return this.saveDataWithContext(data, null)
  }

  /**
   * Load plugin specific data from database storage with context
   * @param libraryItemId Optional library item ID to scope the data to
   * @returns The loaded data or an empty object if no data exists
   */
  public async loadDataWithContext(libraryItemId: string | null): Promise<any> {
    try {
      const pluginData = await this.app.storage.getPluginDataEntries(
        this.manifest.id,
        'data.json',
        libraryItemId
      )
      if (pluginData && pluginData.length > 0) {
        return JSON.parse(pluginData[0].jsonData)
      }
      return {}
    } catch (error) {
      console.error(`Failed to load data for plugin ${this.manifest.id}:`, error)
      return {}
    }
  }

  /**
   * Save plugin specific data to database storage with context
   * @param data The data to save
   * @param libraryItemId Optional library item ID to scope the data to
   */
  public async saveDataWithContext(data: any, libraryItemId: string | null): Promise<void> {
    try {
      const existingData = await this.app.storage.getPluginDataEntries(
        this.manifest.id,
        'data.json',
        libraryItemId
      )

      const jsonValue = JSON.stringify(data)

      if (existingData && existingData.length > 0) {
        await this.app.storage.updatePluginDataEntry(existingData[0].id, {
          jsonData: jsonValue
        })
      } else {
        await this.app.storage.createPluginDataEntry({
          pluginId: this.manifest.id,
          key: 'data.json',
          jsonData: jsonValue,
          libraryItemId
        })
      }
    } catch (error) {
      console.error(`Failed to save data for plugin ${this.manifest.id}:`, error)
    }
  }

  /**
   * Read plugin data from file storage
   * @param relativePath Path relative to plugin's data directory
   */
  public async readDataFile(relativePath: string): Promise<string | undefined> {
    try {
      return await this.app.storage.readPluginDataFile(this.manifest.id, relativePath)
    } catch (error) {
      console.error(`Failed to read plugin data file ${relativePath}:`, error)
      return undefined
    }
  }

  /**
   * Write plugin data to file storage
   * @param relativePath Path relative to plugin's data directory
   * @param content Content to write to the file
   */
  public async writeDataFile(relativePath: string, content: string): Promise<boolean> {
    try {
      return await this.app.storage.writePluginDataFile(this.manifest.id, relativePath, content)
    } catch (error) {
      console.error(`Failed to write plugin data file ${relativePath}:`, error)
      return false
    }
  }

  /**
   * Delete plugin data file
   * @param relativePath Path relative to plugin's data directory
   */
  public async deleteDataFile(relativePath: string): Promise<boolean> {
    try {
      return await this.app.storage.deletePluginDataFile(this.manifest.id, relativePath)
    } catch (error) {
      console.error(`Failed to delete plugin data file ${relativePath}:`, error)
      return false
    }
  }

  /**
   * List files in plugin's data directory
   * @param subDirectory Optional subdirectory within plugin's data directory
   */
  public async listDataFiles(subDirectory?: string): Promise<string[]> {
    try {
      return await this.app.storage.listPluginDataFiles(this.manifest.id, subDirectory)
    } catch (error) {
      console.error(`Failed to list plugin data files:`, error)
      return []
    }
  }

  /**
   * Clean up all registered event listeners
   * Called automatically by the Plugin Manager after onunload
   */
  public _cleanupListeners(): void {
    for (const clean of this.listenerCleaners) {
      try {
        clean()
      } catch (error) {
        console.error(`Failed to remove event listener in plugin ${this.manifest.id}:`, error)
      }
    }
    this.listenerCleaners = []
  }
}
