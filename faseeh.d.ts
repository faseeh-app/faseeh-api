declare global {
  // ============================================================================
  // CORE TYPES & UTILITIES
  // ============================================================================


  type EventType = string | symbol | number

  type Handler<T = any> = (event: T) => void

  type WildcardHandler<Events extends Record<EventType, unknown>> = (
  type: keyof Events,
  event: Events[keyof Events]
) => void

  // ============================================================================
  // PLUGIN MANIFEST & INFO
  // ============================================================================

  /**
   * Represents a plugin's manifest.json information
   */
  interface PluginManifest {
    id: string
    name: string
    version: string
    minAppVersion: string
    main: string
    pluginDependencies?: string[] | undefined
    description: string
    author?: string | undefined
    authorUrl?: string | undefined
    fundingUrl?: string | undefined
  }

  /**
   * Information about a plugin including its runtime status
   */
  interface PluginInfo {
    manifest: PluginManifest
    isEnabled: boolean
    isLoaded: boolean
    hasFailed: boolean
    error?: string | undefined
  }


  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  interface EventEmitterWrapper<Events extends Record<EventType, unknown>> {
    on<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): () => void
  /**
   * Removes a specific event handler.
   */
    off<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): void
  /**
   * Emits an event with the provided payload.
   */
    emit<Key extends keyof Events>(eventName: Key, payload: Events[Key]): void
    clearAllHandlers(eventName?: keyof Events | undefined): void
  /**
   * Registers a wildcard handler that listens to all events.
   */
    onAny(handler: WildcardHandler<Events>): () => void
  /**
   * Removes a wildcard handler.
   */
    offAny(handler: WildcardHandler<Events>): void
  /**
   * Registers an event handler that will only be called once.
   */
    once<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): () => void
  /**
   * Gets all event names that have registered handlers.
   */
    eventNames(): (keyof Events)[]
  }

  type StorageEvents = {
  'media:saved': { mediaId: string; path?: string }
  'media:deleted': { mediaId: string }
  // ... other storage events
}

  type WorkspaceEvents = {
  'media:opened': { mediaId: string; source: string }
  'layout:changed': { newLayout: string }
  // ... other workspace events
}

  type PluginEvents = {
  'plugin:loaded': { pluginId: string }
  'plugin:unloaded': { pluginId: string }
  'plugin:listUpdated': PluginInfo[]
  'plugin:disabled': { pluginId: string }
}


  // ============================================================================
  // CONTENT DOCUMENT TYPES
  // ============================================================================

  /**
   * Represents a positional bounding box
   */
  interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
    unit: "px" | "%" | "relative"
  }

  /**
   * Basic properties common to all blocks
   */
  interface BaseBlock {
    id: string
    order: number
    position?: BoundingBox | undefined
  }

  /**
   * Represents a block of text
   */
  interface TextBlock {
    type: "text"
    content: string
    style?: string | undefined
    language?: string | undefined
  }

  /**
   * Represents an image
   */
  interface ImageBlock {
    type: "image"
    assetId?: string | undefined
    externalSrc?: string | undefined
    alt?: string | undefined
    caption?: string | undefined
  }

  /**
   * Represents a video embed
   */
  interface VideoBlock {
    type: "video"
    assetId?: string | undefined
    externalSrc?: string | undefined
  }

  /**
   * Represents an audio embed
   */
  interface AudioBlock {
    type: "audio"
    assetId?: string | undefined
    externalSrc?: string | undefined
  }

  /**
   * Represents a single text annotation on an image
   */
  interface ImageAnnotation {
    id: string
    text: string
    boundingBox: BoundingBox
    type: "dialogue" | "sfx" | "narration" | "label" | "caption" | "title" | "other"
    order: number
    language?: string | undefined
  }

  /**
   * Represents an image with annotated text regions (comics, diagrams)
   */
  interface AnnotatedImageBlock {
    type: "annotatedImage"
    baseImageAssetId: string
    annotations: ImageAnnotation[]
  }

  /**
   * Represents a structural container for other blocks
   */
  interface ContainerBlock {
    type: "container"
    style?: string | undefined
    children: ContentBlock[]
  }

  /**
   * Union type for all possible content blocks
   */
  type ContentBlock = | TextBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | AnnotatedImageBlock
  | ContainerBlock

  /**
   * Represents structured, processed content ready for display/interaction
   */
  interface ContentDocument {
    version: string
    metadata: { title?: string; language?: string; }
    assets?: { [assetId: string]: { format: string; originalSrc?: string; width?: number; height?: number; }; } | undefined
    contentBlocks: ContentBlock[]
  }


  // ============================================================================
  // DATABASE ENTITY TYPES
  // ============================================================================

  interface LibraryItem {
    id: string
    type: string
    name: string | null
    language: string | null
    sourceUri: string | null
    storagePath: string | null
    contentDocumentPath: string | null
    contentGroupId: string | null
    groupOrder: number | null
    dynamicMetadata: Record<string, any>
    createdAt: Date
    updatedAt: Date
  }

  interface PluginData {
    id: number
    pluginId: string
    key: string
    jsonData: any
    libraryItemId: string | null
    createdAt: Date
    updatedAt: Date
  }

  interface AppSettings {
    key: string
    value: any
    createdAt: Date
    updatedAt: Date
  }

  interface ContentGroup {
    id: string
    type: string
    name: string
    dynamicMetadata: Record<string, any>
    createdAt: Date
    updatedAt: Date
  }

  interface Collection {
    id: string
    name: string
    dynamicMetadata: Record<string, any>
    createdAt: Date
    updatedAt: Date
  }

  interface CollectionMember {
    collectionId: string
    itemId: string
    itemType: string
    itemOrder: number
  }

  interface VocabularyRegistry {
    id: string
    text: string
    language: string
    createdAt: Date
  }

  interface VocabularySource {
    vocabularyId: string
    libraryItemId: string
    contextSentence: string | null
    startOffset: number | null
    endOffset: number | null
    timestampMs: number | null
  }

  interface EmbeddedAsset {
    id: string
    libraryItemId: string
    storagePath: string
    format: string | null
    originalSrc: string | null
    width: number | null
    height: number | null
    sizeBytes: number | null
    checksum: string | null
    createdAt: Date
  }

  interface SupplementaryFile {
    id: string
    libraryItemId: string
    type: string
    storagePath: string
    format: string | null
    language: string | null
    filename: string | null
    sizeBytes: number | null
    checksum: string | null
    createdAt: Date
  }

  // New entity types for creation
  type NewLibraryItem = Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>

  type NewPluginData = Omit<PluginData, 'id' | 'createdAt' | 'updatedAt'>

  type NewAppSettings = Omit<AppSettings, 'id' | 'createdAt' | 'updatedAt'>

  type NewContentGroup = Omit<ContentGroup, 'id' | 'createdAt' | 'updatedAt'>

  type NewCollection = Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>

  type NewCollectionMember = Omit<CollectionMember, 'id' | 'createdAt' | 'updatedAt'>

  type NewVocabularyRegistry = Omit<VocabularyRegistry, 'id' | 'createdAt' | 'updatedAt'>

  type NewVocabularySource = Omit<VocabularySource, 'id' | 'createdAt' | 'updatedAt'>

  type NewEmbeddedAsset = Omit<EmbeddedAsset, 'id' | 'createdAt' | 'updatedAt'>

  type NewSupplementaryFile = Omit<SupplementaryFile, 'id' | 'createdAt' | 'updatedAt'>

  // Update entity types for partial updates
  type LibraryItemUpdate = Partial<Omit<LibraryItem, 'id' | 'createdAt'>>

  type PluginDataUpdate = Partial<Omit<PluginData, 'id' | 'createdAt'>>

  type AppSettingsUpdate = Partial<Omit<AppSettings, 'id' | 'createdAt'>>

  type ContentGroupUpdate = Partial<Omit<ContentGroup, 'id' | 'createdAt'>>

  type CollectionUpdate = Partial<Omit<Collection, 'id' | 'createdAt'>>

  type CollectionMemberUpdate = Partial<Omit<CollectionMember, 'id' | 'createdAt'>>

  type VocabularyRegistryUpdate = Partial<Omit<VocabularyRegistry, 'id' | 'createdAt'>>

  type VocabularySourceUpdate = Partial<Omit<VocabularySource, 'id' | 'createdAt'>>

  type EmbeddedAssetUpdate = Partial<Omit<EmbeddedAsset, 'id' | 'createdAt'>>

  type SupplementaryFileUpdate = Partial<Omit<SupplementaryFile, 'id' | 'createdAt'>>


  // ============================================================================
  // STORAGE API
  // ============================================================================

  interface StorageAPI {
    getFaseehFolderPath: () => Promise<string>
    getLibraryItemDirectoryPath: (libraryItemId: string) => Promise<string | undefined>
    getEmbeddedAssetAbsolutePath: (assetId: string) => Promise<string | undefined>
    getSupplementaryFileAbsolutePath: (fileId: string) => Promise<string | undefined>
    getPluginDirectoryPath: (pluginId: string) => Promise<string | undefined>
    listPluginDirectories: () => Promise<string[]>
    getConfigDirectoryPath: () => Promise<string | undefined>
    getLibraryItems: (criteria?: Partial<LibraryItem>) => Promise<LibraryItem[]>
    getLibraryItemById: (id: string) => Promise<LibraryItem | undefined>
    createLibraryItem: (item: NewLibraryItem, documentContent?: ContentDocument) => Promise<LibraryItem | undefined>
    updateLibraryItem: (id: string, itemUpdate: LibraryItemUpdate) => Promise<LibraryItem | undefined>
    deleteLibraryItem: (id: string) => Promise<boolean>
    getDocumentJson: (libraryItemId: string) => Promise<ContentDocument | undefined>
    saveDocumentJson: (libraryItemId: string, content: ContentDocument) => Promise<boolean>
    getPluginDataEntries: (pluginId: string, key?: string, libraryItemId?: string | null) => Promise<PluginData[]>
    getPluginDataEntryById: (id: number) => Promise<PluginData | undefined>
    createPluginDataEntry: (data: NewPluginData) => Promise<PluginData | undefined>
    updatePluginDataEntry: (id: number, dataUpdate: PluginDataUpdate) => Promise<PluginData | undefined>
    deletePluginDataEntry: (id: number) => Promise<boolean>
    deletePluginDataEntriesByKey: (pluginId: string, key: string, libraryItemId?: string | null) => Promise<number>
    readPluginManifest: (pluginId: string) => Promise<PluginManifest | undefined>
    readPluginDataFile: (pluginId: string, relativePath: string) => Promise<string | undefined>
    writePluginDataFile: (pluginId: string, relativePath: string, content: string) => Promise<boolean>
    deletePluginDataFile: (pluginId: string, relativePath: string) => Promise<boolean>
    listPluginDataFiles: (pluginId: string, subDirectory?: string) => Promise<string[]>
    getAppSetting: (key: string) => Promise<AppSettings | undefined>
    getAllAppSettings: () => Promise<AppSettings[]>
    setAppSetting: (setting: NewAppSettings | AppSettingsUpdate) => Promise<AppSettings | undefined>
    deleteAppSetting: (key: string) => Promise<boolean>
    getEnabledPluginIds: () => Promise<string[]>
    setEnabledPluginIds: (pluginIds: string[]) => Promise<boolean>
    getContentGroups: () => Promise<ContentGroup[]>
    getContentGroupById: (id: string) => Promise<ContentGroup | undefined>
    createContentGroup: (group: NewContentGroup) => Promise<ContentGroup | undefined>
    updateContentGroup: (id: string, groupUpdate: ContentGroupUpdate) => Promise<ContentGroup | undefined>
    deleteContentGroup: (id: string) => Promise<boolean>
    getCollections: () => Promise<Collection[]>
    getCollectionById: (id: string) => Promise<Collection | undefined>
    createCollection: (collection: NewCollection) => Promise<Collection | undefined>
    updateCollection: (id: string, collectionUpdate: CollectionUpdate) => Promise<Collection | undefined>
    deleteCollection: (id: string) => Promise<boolean>
    getCollectionMembers: (collectionId: string) => Promise<CollectionMember[]>
    getCollectionsForMember: (itemId: string, itemType: string) => Promise<CollectionMember[]>
    addCollectionMember: (member: NewCollectionMember) => Promise<CollectionMember | undefined>
    updateCollectionMemberOrder: (collectionId: string, itemId: string, itemType: string, newOrder: number) => Promise<boolean>
    removeCollectionMember: (collectionId: string, itemId: string, itemType: string) => Promise<boolean>
    getVocabularyEntries: (language?: string, text?: string) => Promise<VocabularyRegistry[]>
    getVocabularyEntryById: (id: string) => Promise<VocabularyRegistry | undefined>
    findOrCreateVocabularyEntry: (entry: Pick<NewVocabularyRegistry, "text" | "language">) => Promise<VocabularyRegistry | undefined>
    updateVocabularyEntry: (id: string, entryUpdate: VocabularyRegistryUpdate) => Promise<VocabularyRegistry | undefined>
    deleteVocabularyEntry: (id: string) => Promise<boolean>
    getVocabularySources: (filters: { vocabularyId?: string; libraryItemId?: string; }) => Promise<VocabularySource[]>
    addVocabularySource: (source: NewVocabularySource) => Promise<VocabularySource | undefined>
    deleteVocabularySources: (criteria: Partial<Pick<VocabularySource, "vocabularyId" | "libraryItemId">>) => Promise<number>
    getEmbeddedAssetsByLibraryItem: (libraryItemId: string) => Promise<EmbeddedAsset[]>
    getEmbeddedAssetById: (id: string) => Promise<EmbeddedAsset | undefined>
    createEmbeddedAsset: (asset: NewEmbeddedAsset) => Promise<EmbeddedAsset | undefined>
    updateEmbeddedAsset: (id: string, assetUpdate: EmbeddedAssetUpdate) => Promise<EmbeddedAsset | undefined>
    deleteEmbeddedAsset: (id: string) => Promise<boolean>
    getSupplementaryFilesByLibraryItem: (libraryItemId: string, type?: string, language?: string) => Promise<SupplementaryFile[]>
    getSupplementaryFileById: (id: string) => Promise<SupplementaryFile | undefined>
    createSupplementaryFile: (file: NewSupplementaryFile) => Promise<SupplementaryFile | undefined>
    updateSupplementaryFile: (id: string, fileUpdate: SupplementaryFileUpdate) => Promise<SupplementaryFile | undefined>
    deleteSupplementaryFile: (id: string) => Promise<boolean>
  }


  // ============================================================================
  // FASEEH APP API
  // ============================================================================

  /**
   * The FaseehApp object provides plugins with access to application functionality
   */
  interface FaseehApp {
  /**
   * Basic application information
   */
    appInfo: { readonly version: string; readonly platform: "win" | "mac" | "linux"; }
  /**
   * Storage API facade for accessing the main process storage service
   */
    storage: StorageAPI
  /**
   * Access to other plugins
   */
    plugins: { getPlugin(id: string): Plugin | null; }
  /**
   * Methods for displaying notifications to users
   */
    workspaceEvents: EventEmitterWrapper<WorkspaceEvents>
    storageEvents: EventEmitterWrapper<StorageEvents>
    pluginEvents: EventEmitterWrapper<PluginEvents>
  }


  // ============================================================================
  // BASE PLUGIN CLASS
  // ============================================================================

  export abstract class BasePlugin {
    readonly app: FaseehApp
    readonly manifest: PluginManifest
    constructor(app: FaseehApp, manifest: PluginManifest)

    abstract onload(): Promise<void>
    abstract onunload(): void | Promise<void>
    registerEvent(disposer: () => void): void
    loadData(): Promise<any>
    saveData(data: any): Promise<void>
    loadDataWithContext(libraryItemId: string | null): Promise<any>
    saveDataWithContext(data: any, libraryItemId: string | null): Promise<void>
    readDataFile(relativePath: string): Promise<string | undefined>
    writeDataFile(relativePath: string, content: string): Promise<boolean>
    deleteDataFile(relativePath: string): Promise<boolean>
    listDataFiles(subDirectory?: string | undefined): Promise<string[]>
    _cleanupListeners(): void
  }
}

export {}