/**
 * Represents an image with annotated text regions (comics, diagrams)
 * @public
 */
export declare interface AnnotatedImageBlock extends BaseBlock {
    	type: "annotatedImage";
    	baseImageAssetId: string;
    	annotations: ImageAnnotation[];
}

/**
 * @public
 */
export declare interface AppSetting {
    	key: string;
    	value: any;
    	createdAt: Date;
    	updatedAt: Date;
}

/**
 * Represents an audio embed
 * @public
 */
export declare interface AudioBlock extends BaseBlock {
    	type: "audio";
    	assetId?: string;
    	externalSrc?: string;
}

/**
 * Basic properties common to all blocks
 * @public
 */
export declare interface BaseBlock {
    	id: string;
    	order: number;
    	position?: BoundingBox;
}

/**
 * Plugin abstract class that all plugins must implement
 * @public
 */
export declare abstract class BasePlugin implements IPlugin {
    	readonly app: FaseehApp;
    	readonly manifest: PluginManifest;
    	private listenerCleaners;
    	constructor(app: FaseehApp, manifest: PluginManifest);
    	abstract onload(): Promise<void>;
    	abstract onunload(): void | Promise<void>;
    	registerEvent(disposer: () => void): void;
    	loadData(): Promise<any>;
    	saveData(data: any): Promise<void>;
    	loadDataWithContext(libraryItemId: string | null): Promise<any>;
    	saveDataWithContext(data: any, libraryItemId: string | null): Promise<void>;
    	readDataFile(relativePath: string): Promise<string | undefined>;
    	writeDataFile(relativePath: string, content: string): Promise<boolean>;
    	deleteDataFile(relativePath: string): Promise<boolean>;
    	listDataFiles(subDirectory?: string): Promise<string[]>;
    	_cleanupListeners(): void;
}

/**
 * Represents a positional bounding box
 * @public
 */
export declare interface BoundingBox {
    	x: number;
    	y: number;
    	width: number;
    	height: number;
    	unit: "px" | "%" | "relative";
}

/**
 * @public
 */
export declare interface Collection {
    	id: string;
    	name: string;
    	dynamicMetadata: Record<string, any>;
    	createdAt: Date;
    	updatedAt: Date;
}

/**
 * @public
 */
export declare interface CollectionMember {
    	collectionId: string;
    	itemId: string;
    	itemType: string;
    	itemOrder: number;
}

/**
 * Represents a structural container for other blocks
 * @public
 */
export declare interface ContainerBlock extends BaseBlock {
    	type: "container";
    	style?: string;
    	children: ContentBlock[];
}

/**
 * Union type for all possible content blocks
 * @public
 */
export declare type ContentBlock = TextBlock | ImageBlock | VideoBlock | AudioBlock | AnnotatedImageBlock | ContainerBlock;

/**
 * Represents structured, processed content ready for display/interaction
 * @public
 */
export declare interface ContentDocument {
    	version: string;
    	metadata: {
        		title?: string;
        		language?: string;
        	};
    	assets?: {
        		[assetId: string]: {
            			format: string;
            			originalSrc?: string;
            			width?: number;
            			height?: number;
            		};
        	};
    	contentBlocks: ContentBlock[];
}

/**
 * @public
 */
export declare interface ContentGroup {
    	id: string;
    	type: string;
    	name: string;
    	dynamicMetadata: Record<string, any>;
    	createdAt: Date;
    	updatedAt: Date;
}

/**
 * @public
 */
export declare interface CreateAppSettingDTO {
    	key: string;
    	value: string;
}

/**
 * @public
 */
export declare interface CreateCollectionDTO {
    	id?: string;
    	name: string;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface CreateCollectionMemberDTO {
    	collectionId: string;
    	itemId: string;
    	itemType: string;
    	itemOrder?: number;
}

/**
 * @public
 */
export declare interface CreateContentGroupDTO {
    	id?: string;
    	type: string;
    	name: string;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface CreateEmbeddedAssetDTO {
    	id?: string;
    	libraryItemId: string;
    	storagePath: string;
    	format?: string;
    	originalSrc?: string;
    	width?: number;
    	height?: number;
    	sizeBytes?: number;
    	checksum?: string;
}

/**
 * @public
 */
export declare interface CreateLibraryItemDTO {
    	id?: string;
    	type: string;
    	name?: string;
    	language?: string;
    	sourceUri?: string;
    	storagePath?: string;
    	contentDocumentPath?: string;
    	contentGroupId?: string;
    	groupOrder?: number;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface CreatePluginDataDTO {
    	pluginId: string;
    	key: string;
    	jsonData: string;
    	libraryItemId?: string;
}

/**
 * @public
 */
export declare interface CreateSupplementaryFileDTO {
    	id?: string;
    	libraryItemId: string;
    	type: string;
    	storagePath: string;
    	format?: string;
    	language?: string;
    	filename?: string;
    	sizeBytes?: number;
    	checksum?: string;
}

/**
 * @public
 */
export declare interface CreateVocabularyEntryDTO {
    	id?: string;
    	text: string;
    	language: string;
}

/**
 * @public
 */
export declare interface CreateVocabularySourceDTO {
    	vocabularyId: string;
    	libraryItemId: string;
    	contextSentence?: string;
    	startOffset?: number;
    	endOffset?: number;
    	timestampMs?: number;
}

/**
 * @public
 */
export declare interface EmbeddedAsset {
    	id: string;
    	libraryItemId: string;
    	storagePath: string;
    	format?: string;
    	originalSrc?: string;
    	width?: number;
    	height?: number;
    	sizeBytes?: number;
    	checksum?: string;
    	createdAt: Date;
}

/**
 * An event bus for managing events across the application, both in the main process and renderer processes.
 * @public
 */
export declare interface EventBus<Events extends Record<EventType, unknown>> {
    	/**
     	 * Registers an event handler
     	 * @param eventName The name of the event to listen to
     	 * @param handler The function to call when the event is emitted
     	 * @returns A function that when called, removes the registered event handler
     	 */
    	on<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): () => void;
    	/**
     	 * Removes a specific event handler
     	 * @param eventName The name of the event to stop listening to
     	 * @param handler The specific handler function to remove
     	 */
    	off<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): void;
    	/**
     	 * Emits an event with the provided payload
     	 * @param eventName The name of the event to emit
     	 * @param payload The data to send with the event
     	 */
    	emit<Key extends keyof Events>(eventName: Key, payload: Events[Key]): void;
    	/**
     	 * Registers a wildcard handler that listens to all events
     	 * @param handler The function to call when any event is emitted
     	 * @returns A function that when called, removes the wildcard handler
     	 */
    	onAny(handler: WildcardHandler<Events>): () => void;
    	/**
     	 * Removes a wildcard handler
     	 * @param handler The wildcard handler function to remove
     	 */
    	offAny(handler: WildcardHandler<Events>): void;
    	/**
     	 * Registers an event handler that will only be called once
     	 * @param eventName The name of the event to listen to
     	 * @param handler The function to call when the event is emitted
     	 * @returns A function that when called, removes the registered event handler
     	 */
    	once<Key extends keyof Events>(eventName: Key, handler: Handler<Events[Key]>): () => void;
    	/**
     	 * Clears all handlers for a specific event or all events
     	 * @param eventName Optional event name to clear handlers for. If not provided, clears all handlers
     	 */
    	clearAllHandlers(eventName?: keyof Events): void;
    	/**
     	 * Gets all event names that have registered handlers
     	 * @returns An array of event names that have active handlers
     	 */
    	eventNames(): Array<keyof Events>;
}

/**
 * @public
 */
export declare type EventType = string | symbol | number;

/**
 * The FaseehApp object provides plugins with access to application functionality
 * @public
 */
export declare interface FaseehApp {
    	/** Basic application information */
    	appInfo: {
        		readonly version: string;
        		readonly platform: "win" | "mac" | "linux";
        	};
    	/** Storage API facade for accessing the main process storage service */
    	storage: IStorage;
    	plugins: {
        		getPlugin: (pluginId: string) => unknown;
        		enabledPlugins: () => Set<string>;
        	};
}

/**
 * @public
 */
export declare type Handler<T = any> = (event: T) => void;

/**
 * Represents a single text annotation on an image
 * @public
 */
export declare interface ImageAnnotation {
    	id: string;
    	text: string;
    	boundingBox: BoundingBox;
    	type: "dialogue" | "sfx" | "narration" | "label" | "caption" | "title" | "other";
    	order: number;
    	language?: string;
}

/**
 * Represents an image
 * @public
 */
export declare interface ImageBlock extends BaseBlock {
    	type: "image";
    	assetId?: string;
    	externalSrc?: string;
    	alt?: string;
    	caption?: string;
}

/**
 * Plugin abstract class that all plugins must implement
 * @public
 */
export declare interface IPlugin {
    	app: FaseehApp;
    	manifest: PluginManifest;
    	/** Called when the plugin is loaded */
    	onload(): Promise<void>;
    	/** Called when the plugin is unloaded */
    	onunload(): void | Promise<void>;
    	/** Call the event emitter's `on` inside this method to clean up listeners automatically */
    	registerEvent(disposer: () => void): void;
    	/** Load plugin data from database storage */
    	loadData(): Promise<any>;
    	/** Save plugin data to database storage */
    	saveData(data: any): Promise<void>;
    	/**
     	 * Load plugin data from database storage with library item context
     	 * @param libraryItemId Optional library item ID to scope the data to
     	 */
    	loadDataWithContext(libraryItemId: string | null): Promise<any>;
    	/**
     	 * Save plugin data to database storage with library item context
     	 * @param data The data to save
     	 * @param libraryItemId Optional library item ID to scope the data to
     	 */
    	saveDataWithContext(data: any, libraryItemId: string | null): Promise<void>;
    	/**
     	 * Read plugin data from file storage
     	 * @param relativePath Path relative to plugin's data directory
     	 */
    	readDataFile(relativePath: string): Promise<string | undefined>;
    	/**
     	 * Write plugin data to file storage
     	 * @param relativePath Path relative to plugin's data directory
     	 * @param content Content to write to the file
     	 */
    	writeDataFile(relativePath: string, content: string): Promise<boolean>;
    	/**
     	 * Delete plugin data file
     	 * @param relativePath Path relative to plugin's data directory
     	 */
    	deleteDataFile(relativePath: string): Promise<boolean>;
    	/**
     	 * List files in plugin's data directory
     	 * @param subDirectory Optional subdirectory within plugin's data directory
     	 */
    	listDataFiles(subDirectory?: string): Promise<string[]>;
    	/** method to clean up all registered listeners */
    	_cleanupListeners(): void;
}

/**
 * Domain Storage API provides a comprehensive interface for managing all data storage operations
 * in the Faseeh application. This includes database operations and file system management.
 * @public
 */
export declare interface IStorage extends EventBus<StorageEvents> {
    	// == Path Management ==
    	/**
     	 * Gets the absolute path to the main Faseeh application folder.
     	 * This folder contains all user data including library items, plugins, and configuration.
     	 *
     	 * @returns {Promise<string>} The absolute path to the Faseeh folder
     	 */
    	getFaseehFolderPath: () => Promise<string>;
    	/**
     	 * Gets the absolute path to a specific library item's directory.
     	 * Returns undefined if the library item ID is invalid or the directory doesn't exist.
     	 *
     	 * @param {string} libraryItemId - The unique identifier of the library item
     	 * @returns {Promise<string | undefined>} The absolute path to the library item directory, or undefined if not found
     	 */
    	getLibraryItemDirectoryPath: (libraryItemId: string) => Promise<string | undefined>;
    	/**
     	 * Gets the absolute path to an embedded asset file by its ID.
     	 * Queries the database to find the asset's storage path and constructs the full file path.
     	 *
     	 * @param {string} assetId - The unique identifier of the embedded asset
     	 * @returns {Promise<string | undefined>} The absolute path to the asset file, or undefined if not found
     	 */
    	getEmbeddedAssetAbsolutePath: (assetId: string) => Promise<string | undefined>;
    	/**
     	 * Gets the absolute path to a supplementary file by its ID.
     	 * Queries the database to find the file's storage path and constructs the full file path.
     	 *
     	 * @param {string} fileId - The unique identifier of the supplementary file
     	 * @returns {Promise<string | undefined>} The absolute path to the supplementary file, or undefined if not found
     	 */
    	getSupplementaryFileAbsolutePath: (fileId: string) => Promise<string | undefined>;
    	/**
     	 * Gets the absolute path to a plugin's directory.
     	 * Returns undefined if the plugin ID is invalid.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @returns {Promise<string | undefined>} The absolute path to the plugin directory, or undefined if invalid ID
     	 */
    	getPluginDirectoryPath: (pluginId: string) => Promise<string | undefined>;
    	/**
     	 * Lists all plugin directories in the plugins folder.
     	 * Returns an empty array if the plugins directory doesn't exist or can't be read.
     	 *
     	 * @returns {Promise<string[]>} Array of absolute paths to plugin directories
     	 */
    	listPluginDirectories: () => Promise<string[]>;
    	/**
     	 * Gets the absolute path to the configuration directory.
     	 * This directory contains application settings and enabled plugins configuration.
     	 *
     	 * @returns {Promise<string | undefined>} The absolute path to the config directory
     	 */
    	getConfigDirectoryPath: () => Promise<string | undefined>;
    	// == LibraryItems & Document.json ==
    	/**
     	 * Retrieves library items from the database based on optional criteria.
     	 *
     	 * @param {Partial<LibraryItem>} [criteria] - Optional filtering criteria for the query
     	 * @returns {Promise<LibraryItem[]>} Array of library items matching the criteria
     	 */
    	getLibraryItems: (criteria?: Partial<LibraryItem>) => Promise<LibraryItem[]>;
    	/**
     	 * Retrieves a specific library item by its unique identifier.
     	 *
     	 * @param {string} id - The unique identifier of the library item
     	 * @returns {Promise<LibraryItem | undefined>} The library item data, or undefined if not found
     	 */
    	getLibraryItemById: (id: string) => Promise<LibraryItem | undefined>;
    	/**
     	 * Creates a new library item in the database and optionally saves associated document content.
     	 *
     	 * @param {CreateLibraryItemDTO} item - The library item data to create
     	 * @param {ContentDocument} [documentContent] - Optional document content to save alongside the item
     	 * @returns {Promise<LibraryItem | undefined>} The created library item with generated ID and timestamps
     	 */
    	createLibraryItem: (item: CreateLibraryItemDTO, documentContent?: ContentDocument) => Promise<LibraryItem | undefined>;
    	/**
     	 * Updates an existing library item with new data.
     	 *
     	 * @param {string} id - The unique identifier of the library item to update
     	 * @param {UpdateLibraryItemDTO} itemUpdate - The updated data for the library item
     	 * @returns {Promise<LibraryItem | undefined>} The updated library item data
     	 */
    	updateLibraryItem: (id: string, itemUpdate: UpdateLibraryItemDTO) => Promise<LibraryItem | undefined>;
    	/**
     	 * Deletes a library item and all its associated data (assets, files, etc.).
     	 *
     	 * @param {string} id - The unique identifier of the library item to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteLibraryItem: (id: string) => Promise<boolean>;
    	/**
     	 * Retrieves the document.json content for a specific library item.
     	 * This file contains the structured content data for the item.
     	 *
     	 * @param {string} libraryItemId - The unique identifier of the library item
     	 * @returns {Promise<ContentDocument | undefined>} The document content, or undefined if not found
     	 */
    	getDocumentJson: (libraryItemId: string) => Promise<ContentDocument | undefined>;
    	/**
     	 * Saves document content to the document.json file for a library item.
     	 *
     	 * @param {string} libraryItemId - The unique identifier of the library item
     	 * @param {ContentDocument} content - The document content to save
     	 * @returns {Promise<boolean>} True if the save operation was successful, false otherwise
     	 */
    	saveDocumentJson: (libraryItemId: string, content: ContentDocument) => Promise<boolean>;
    	// == PluginData (Database) ==
    	/**
     	 * Retrieves plugin data entries from the database with optional filtering.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} [key] - Optional key to filter entries by
     	 * @param {string | null} [libraryItemId] - Optional library item ID to filter entries by
     	 * @returns {Promise<PluginData[]>} Array of plugin data entries matching the criteria
     	 */
    	getPluginDataEntries: (pluginId: string, key?: string, libraryItemId?: string | null) => Promise<PluginData[]>;
    	/**
     	 * Retrieves a specific plugin data entry by its ID.
     	 *
     	 * @param {number} id - The unique identifier of the plugin data entry
     	 * @returns {Promise<PluginData | undefined>} The plugin data entry, or undefined if not found
     	 */
    	getPluginDataEntryById: (id: number) => Promise<PluginData | undefined>;
    	/**
     	 * Creates a new plugin data entry in the database.
     	 *
     	 * @param {CreatePluginDataDTO} data - The plugin data to store
     	 * @returns {Promise<PluginData | undefined>} The created plugin data entry with generated ID
     	 */
    	createPluginDataEntry: (data: CreatePluginDataDTO) => Promise<PluginData | undefined>;
    	/**
     	 * Updates an existing plugin data entry.
     	 *
     	 * @param {number} id - The unique identifier of the plugin data entry to update
     	 * @param {UpdatePluginDataDTO} dataUpdate - The updated data
     	 * @returns {Promise<PluginData | undefined>} The updated plugin data entry
     	 */
    	updatePluginDataEntry: (id: number, dataUpdate: UpdatePluginDataDTO) => Promise<PluginData | undefined>;
    	/**
     	 * Deletes a specific plugin data entry by its ID.
     	 *
     	 * @param {number} id - The unique identifier of the plugin data entry to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deletePluginDataEntry: (id: number) => Promise<boolean>;
    	/**
     	 * Deletes all plugin data entries matching the specified criteria.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} key - The key to match for deletion
     	 * @param {string | null} [libraryItemId] - Optional library item ID to filter deletions
     	 * @returns {Promise<number>} The number of entries deleted
     	 */
    	deletePluginDataEntriesByKey: (pluginId: string, key: string, libraryItemId?: string | null) => Promise<number>;
    	// == Plugin File Data (Filesystem) ==
    	/**
     	 * Reads and parses a plugin's manifest.json file.
     	 * The manifest contains metadata about the plugin including its capabilities and requirements.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @returns {Promise<PluginManifest | undefined>} The parsed manifest data, or undefined if not found or invalid
     	 */
    	readPluginManifest: (pluginId: string) => Promise<PluginManifest | undefined>;
    	/**
     	 * Reads a plugin data file from the plugin's data directory.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} relativePath - The relative path to the file within the plugin's data directory
     	 * @returns {Promise<string | undefined>} The file content as a string, or undefined if not found
     	 */
    	readPluginDataFile: (pluginId: string, relativePath: string) => Promise<string | undefined>;
    	/**
     	 * Writes content to a plugin data file in the plugin's data directory.
     	 * Creates the file and any necessary parent directories if they don't exist.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} relativePath - The relative path to the file within the plugin's data directory
     	 * @param {string} content - The content to write to the file
     	 * @returns {Promise<boolean>} True if the write operation was successful, false otherwise
     	 */
    	writePluginDataFile: (pluginId: string, relativePath: string, content: string) => Promise<boolean>;
    	/**
     	 * Deletes a plugin data file from the plugin's data directory.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} relativePath - The relative path to the file within the plugin's data directory
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deletePluginDataFile: (pluginId: string, relativePath: string) => Promise<boolean>;
    	/**
     	 * Lists all files in a plugin's data directory or a subdirectory within it.
     	 *
     	 * @param {string} pluginId - The unique identifier of the plugin
     	 * @param {string} [subDirectory] - Optional subdirectory to list files from
     	 * @returns {Promise<string[]>} Array of relative file paths within the plugin's data directory
     	 */
    	listPluginDataFiles: (pluginId: string, subDirectory?: string) => Promise<string[]>;
    	// == AppSettings (Database - for settings.json like data) ==
    	/**
     	 * Retrieves a specific application setting by its key.
     	 *
     	 * @param {string} key - The unique key of the setting to retrieve
     	 * @returns {Promise<AppSetting | undefined>} The setting data, or undefined if not found
     	 */
    	getAppSetting: (key: string) => Promise<AppSetting | undefined>;
    	/**
     	 * Retrieves all application settings from the database.
     	 *
     	 * @returns {Promise<AppSetting[]>} Array of all application settings
     	 */
    	getAllAppSettings: () => Promise<AppSetting[]>;
    	/**
     	 * Sets or updates an application setting in the database.
     	 * Creates a new setting if it doesn't exist, or updates the existing one.
     	 *
     	 * @param {CreateAppSettingDTO | UpdateAppSettingDTO} setting - The setting data to save (must include key and value)
     	 * @returns {Promise<AppSetting | undefined>} The saved setting data
     	 */
    	setAppSetting: (setting: CreateAppSettingDTO | UpdateAppSettingDTO) => Promise<AppSetting | undefined>;
    	/**
     	 * Deletes an application setting by its key.
     	 *
     	 * @param {string} key - The unique key of the setting to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteAppSetting: (key: string) => Promise<boolean>;
    	// == Specific Config Files (Filesystem) ==
    	/**
     	 * Retrieves the list of enabled plugin IDs from the configuration file.
     	 * Returns an empty array if the configuration file doesn't exist or is invalid.
     	 *
     	 * @returns {Promise<string[]>} Array of enabled plugin IDs
     	 */
    	getEnabledPluginIds: () => Promise<string[]>;
    	/**
     	 * Sets the list of enabled plugin IDs in the configuration file.
     	 * This determines which plugins are loaded and active in the application.
     	 *
     	 * @param {string[]} pluginIds - Array of plugin IDs to enable
     	 * @returns {Promise<boolean>} True if the save operation was successful, false otherwise
     	 */
    	setEnabledPluginIds: (pluginIds: string[]) => Promise<boolean>;
    	// == ContentGroups ==
    	/**
     	 * Retrieves all content groups from the database.
     	 * Content groups are used to organize and categorize library items.
     	 *
     	 * @returns {Promise<ContentGroup[]>} Array of all content groups
     	 */
    	getContentGroups: () => Promise<ContentGroup[]>;
    	/**
     	 * Retrieves a specific content group by its ID.
     	 *
     	 * @param {string} id - The unique identifier of the content group
     	 * @returns {Promise<ContentGroup | undefined>} The content group data, or undefined if not found
     	 */
    	getContentGroupById: (id: string) => Promise<ContentGroup | undefined>;
    	/**
     	 * Creates a new content group in the database.
     	 *
     	 * @param {CreateContentGroupDTO} group - The content group data to create
     	 * @returns {Promise<ContentGroup | undefined>} The created content group with generated ID and timestamps
     	 */
    	createContentGroup: (group: CreateContentGroupDTO) => Promise<ContentGroup | undefined>;
    	/**
     	 * Updates an existing content group with new data.
     	 *
     	 * @param {string} id - The unique identifier of the content group to update
     	 * @param {UpdateContentGroupDTO} groupUpdate - The updated data for the content group
     	 * @returns {Promise<ContentGroup | undefined>} The updated content group data
     	 */
    	updateContentGroup: (id: string, groupUpdate: UpdateContentGroupDTO) => Promise<ContentGroup | undefined>;
    	/**
     	 * Deletes a content group by its ID.
     	 * This operation may fail if the group is referenced by library items.
     	 *
     	 * @param {string} id - The unique identifier of the content group to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteContentGroup: (id: string) => Promise<boolean>;
    	// == Collections ==
    	/**
     	 * Retrieves all collections from the database.
     	 * Collections are user-defined groups that can contain multiple library items.
     	 *
     	 * @returns {Promise<Collection[]>} Array of all collections
     	 */
    	getCollections: () => Promise<Collection[]>;
    	/**
     	 * Retrieves a specific collection by its ID.
     	 *
     	 * @param {string} id - The unique identifier of the collection
     	 * @returns {Promise<Collection | undefined>} The collection data, or undefined if not found
     	 */
    	getCollectionById: (id: string) => Promise<Collection | undefined>;
    	/**
     	 * Creates a new collection in the database.
     	 *
     	 * @param {CreateCollectionDTO} collection - The collection data to create
     	 * @returns {Promise<Collection | undefined>} The created collection with generated ID and timestamps
     	 */
    	createCollection: (collection: CreateCollectionDTO) => Promise<Collection | undefined>;
    	/**
     	 * Updates an existing collection with new data.
     	 *
     	 * @param {string} id - The unique identifier of the collection to update
     	 * @param {UpdateCollectionDTO} collectionUpdate - The updated data for the collection
     	 * @returns {Promise<Collection | undefined>} The updated collection data
     	 */
    	updateCollection: (id: string, collectionUpdate: UpdateCollectionDTO) => Promise<Collection | undefined>;
    	/**
     	 * Deletes a collection by its ID.
     	 * This also removes all collection members associated with this collection.
     	 *
     	 * @param {string} id - The unique identifier of the collection to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteCollection: (id: string) => Promise<boolean>;
    	// == CollectionMembers ==
    	/**
     	 * Retrieves all members of a specific collection.
     	 * Collection members can be library items or other entities that belong to the collection.
     	 *
     	 * @param {string} collectionId - The unique identifier of the collection
     	 * @returns {Promise<CollectionMember[]>} Array of collection members with their order and metadata
     	 */
    	getCollectionMembers: (collectionId: string) => Promise<CollectionMember[]>;
    	/**
     	 * Retrieves all collections that contain a specific item as a member.
     	 *
     	 * @param {string} itemId - The unique identifier of the item
     	 * @param {string} itemType - The type of the item (e.g., 'libraryItem', 'vocabularyEntry')
     	 * @returns {Promise<CollectionMember[]>} Array of collections containing this item
     	 */
    	getCollectionsForMember: (itemId: string, itemType: string) => Promise<CollectionMember[]>;
    	/**
     	 * Adds a new member to a collection.
     	 * The member is assigned an order value for positioning within the collection.
     	 *
     	 * @param {CreateCollectionMemberDTO} member - The collection member data (must include collectionId, itemId, itemType)
     	 * @returns {Promise<CollectionMember | undefined>} The created collection member with generated metadata
     	 */
    	addCollectionMember: (member: CreateCollectionMemberDTO) => Promise<CollectionMember | undefined>;
    	/**
     	 * Updates the order of a specific member within a collection.
     	 * This is used for reordering items in the collection.
     	 *
     	 * @param {string} collectionId - The unique identifier of the collection
     	 * @param {string} itemId - The unique identifier of the item
     	 * @param {string} itemType - The type of the item
     	 * @param {number} newOrder - The new order value for the member
     	 * @returns {Promise<boolean>} True if the update was successful, false otherwise
     	 */
    	updateCollectionMemberOrder: (collectionId: string, itemId: string, itemType: string, newOrder: number) => Promise<boolean>;
    	/**
     	 * Removes a member from a collection.
     	 *
     	 * @param {string} collectionId - The unique identifier of the collection
     	 * @param {string} itemId - The unique identifier of the item to remove
     	 * @param {string} itemType - The type of the item
     	 * @returns {Promise<boolean>} True if the removal was successful, false otherwise
     	 */
    	removeCollectionMember: (collectionId: string, itemId: string, itemType: string) => Promise<boolean>;
    	// == VocabularyRegistry ==
    	/**
     	 * Retrieves vocabulary entries from the database with optional filtering.
     	 * The vocabulary registry stores words, phrases, and their associated metadata.
     	 *
     	 * @param {string} [language] - Optional language code to filter entries by
     	 * @param {string} [text] - Optional text to search for in vocabulary entries
     	 * @returns {Promise<VocabularyEntry[]>} Array of vocabulary entries matching the criteria
     	 */
    	getVocabularyEntries: (language?: string, text?: string) => Promise<VocabularyEntry[]>;
    	/**
     	 * Retrieves a specific vocabulary entry by its ID.
     	 *
     	 * @param {string} id - The unique identifier of the vocabulary entry
     	 * @returns {Promise<VocabularyEntry | undefined>} The vocabulary entry data, or undefined if not found
     	 */
    	getVocabularyEntryById: (id: string) => Promise<VocabularyEntry | undefined>;
    	/**
     	 * Finds an existing vocabulary entry or creates a new one if it doesn't exist.
     	 * This is used to avoid duplicate entries for the same word/phrase combination.
     	 *
     	 * @param {Pick<CreateVocabularyEntryDTO, 'text' | 'language'>} entry - The vocabulary entry data to find or create
     	 * @returns {Promise<VocabularyEntry | undefined>} The found or created vocabulary entry
     	 */
    	findOrCreateVocabularyEntry: (entry: Pick<CreateVocabularyEntryDTO, "text" | "language">) => Promise<VocabularyEntry | undefined>;
    	/**
     	 * Updates an existing vocabulary entry with new data.
     	 *
     	 * @param {string} id - The unique identifier of the vocabulary entry to update
     	 * @param {UpdateVocabularyEntryDTO} entryUpdate - The updated data for the vocabulary entry
     	 * @returns {Promise<VocabularyEntry | undefined>} The updated vocabulary entry data
     	 */
    	updateVocabularyEntry: (id: string, entryUpdate: UpdateVocabularyEntryDTO) => Promise<VocabularyEntry | undefined>;
    	/**
     	 * Deletes a vocabulary entry by its ID.
     	 * This also removes all associated vocabulary sources for this entry.
     	 *
     	 * @param {string} id - The unique identifier of the vocabulary entry to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteVocabularyEntry: (id: string) => Promise<boolean>;
    	// == VocabularySources ==
    	/**
     	 * Retrieves vocabulary sources from the database with optional filtering.
     	 * Vocabulary sources track where vocabulary entries were encountered (e.g., specific library items).
     	 *
     	 * @param {object} filters - Filtering criteria for the query
     	 * @param {string} [filters.vocabularyId] - Optional vocabulary entry ID to filter by
     	 * @param {string} [filters.libraryItemId] - Optional library item ID to filter by
     	 * @returns {Promise<VocabularySource[]>} Array of vocabulary sources matching the criteria
     	 */
    	getVocabularySources: (filters: {
        		vocabularyId?: string;
        		libraryItemId?: string;
        	}) => Promise<VocabularySource[]>;
    	/**
     	 * Adds a new vocabulary source to the database.
     	 * This creates a link between a vocabulary entry and its source location.
     	 *
     	 * @param {CreateVocabularySourceDTO} source - The vocabulary source data to create
     	 * @returns {Promise<VocabularySource | undefined>} The created vocabulary source with generated metadata
     	 */
    	addVocabularySource: (source: CreateVocabularySourceDTO) => Promise<VocabularySource | undefined>;
    	/**
     	 * Deletes vocabulary sources based on specified criteria.
     	 * This is useful for cleaning up sources when library items are deleted.
     	 *
     	 * @param {Partial<Pick<VocabularySource, 'vocabularyId' | 'libraryItemId'>>} criteria - The criteria for selecting sources to delete
     	 * @returns {Promise<number>} The number of vocabulary sources deleted
     	 */
    	deleteVocabularySources: (criteria: Partial<Pick<VocabularySource, "vocabularyId" | "libraryItemId">>) => Promise<number>;
    	// == EmbeddedAssets ==
    	/**
     	 * Retrieves all embedded assets associated with a specific library item.
     	 * Embedded assets are media files (images, audio, video) that are part of the content.
     	 *
     	 * @param {string} libraryItemId - The unique identifier of the library item
     	 * @returns {Promise<EmbeddedAsset[]>} Array of embedded assets for the library item
     	 */
    	getEmbeddedAssetsByLibraryItem: (libraryItemId: string) => Promise<EmbeddedAsset[]>;
    	/**
     	 * Retrieves a specific embedded asset by its ID.
     	 *
     	 * @param {string} id - The unique identifier of the embedded asset
     	 * @returns {Promise<EmbeddedAsset | undefined>} The embedded asset data, or undefined if not found
     	 */
    	getEmbeddedAssetById: (id: string) => Promise<EmbeddedAsset | undefined>;
    	/**
     	 * Creates a new embedded asset record in the database.
     	 * The actual file should be saved to the filesystem separately.
     	 *
     	 * @param {CreateEmbeddedAssetDTO} asset - The embedded asset data to create
     	 * @returns {Promise<EmbeddedAsset | undefined>} The created embedded asset with generated ID and metadata
     	 */
    	createEmbeddedAsset: (asset: CreateEmbeddedAssetDTO) => Promise<EmbeddedAsset | undefined>;
    	/**
     	 * Updates an existing embedded asset with new metadata.
     	 *
     	 * @param {string} id - The unique identifier of the embedded asset to update
     	 * @param {UpdateEmbeddedAssetDTO} assetUpdate - The updated data for the embedded asset
     	 * @returns {Promise<EmbeddedAsset | undefined>} The updated embedded asset data
     	 */
    	updateEmbeddedAsset: (id: string, assetUpdate: UpdateEmbeddedAssetDTO) => Promise<EmbeddedAsset | undefined>;
    	/**
     	 * Deletes an embedded asset by its ID.
     	 * This removes the database record but does not delete the actual file.
     	 *
     	 * @param {string} id - The unique identifier of the embedded asset to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteEmbeddedAsset: (id: string) => Promise<boolean>;
    	// == SupplementaryFiles ==
    	/**
     	 * Retrieves supplementary files associated with a specific library item.
     	 * Supplementary files include translations, transcripts, annotations, and other supporting documents.
     	 *
     	 * @param {string} libraryItemId - The unique identifier of the library item
     	 * @param {string} [type] - Optional file type to filter by (e.g., 'translation', 'transcript')
     	 * @param {string} [language] - Optional language code to filter by
     	 * @returns {Promise<SupplementaryFile[]>} Array of supplementary files matching the criteria
     	 */
    	getSupplementaryFilesByLibraryItem: (libraryItemId: string, type?: string, language?: string) => Promise<SupplementaryFile[]>;
    	/**
     	 * Retrieves a specific supplementary file by its ID.
     	 *
     	 * @param {string} id - The unique identifier of the supplementary file
     	 * @returns {Promise<SupplementaryFile | undefined>} The supplementary file data, or undefined if not found
     	 */
    	getSupplementaryFileById: (id: string) => Promise<SupplementaryFile | undefined>;
    	/**
     	 * Creates a new supplementary file record in the database.
     	 * The actual file should be saved to the filesystem separately.
     	 *
     	 * @param {CreateSupplementaryFileDTO} file - The supplementary file data to create
     	 * @returns {Promise<SupplementaryFile | undefined>} The created supplementary file with generated ID and metadata
     	 */
    	createSupplementaryFile: (file: CreateSupplementaryFileDTO) => Promise<SupplementaryFile | undefined>;
    	/**
     	 * Updates an existing supplementary file with new metadata.
     	 *
     	 * @param {string} id - The unique identifier of the supplementary file to update
     	 * @param {UpdateSupplementaryFileDTO} fileUpdate - The updated data for the supplementary file
     	 * @returns {Promise<SupplementaryFile | undefined>} The updated supplementary file data
     	 */
    	updateSupplementaryFile: (id: string, fileUpdate: UpdateSupplementaryFileDTO) => Promise<SupplementaryFile | undefined>;
    	/**
     	 * Deletes a supplementary file by its ID.
     	 * This removes the database record but does not delete the actual file.
     	 *
     	 * @param {string} id - The unique identifier of the supplementary file to delete
     	 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise
     	 */
    	deleteSupplementaryFile: (id: string) => Promise<boolean>;
}

/**
 * @public
 */
export declare interface LibraryItem {
    	id: string;
    	type: string;
    	name?: string;
    	language?: string;
    	sourceUri?: string;
    	storagePath?: string;
    	contentDocumentPath?: string;
    	document?: ContentDocument;
    	contentGroupId?: string;
    	groupOrder?: number;
    	dynamicMetadata: Record<string, any>;
    	createdAt: Date;
    	updatedAt: Date;
}

/**
 * @public
 */
export declare interface PluginData {
    	id: number;
    	pluginId: string;
    	key: string;
    	jsonData: string;
    	libraryItemId?: string;
    	createdAt: Date;
    	updatedAt: Date;
}

/**
 * @public
 */
export declare type PluginEvent = Record<EventType, unknown>;

/**
 * Event types related to plugin lifecycle and management.
 * @public
 */
export declare type PluginEvents = {
    	"plugin:loaded": {
        		pluginId: string;
        	};
    	"plugin:unloaded": {
        		pluginId: string;
        	};
    	"plugin:listUpdated": PluginInfo[];
    	"plugin:disabled": {
        		pluginId: string;
        	};
};

/**
 * Information about a plugin including its runtime status
 * @public
 */
export declare interface PluginInfo {
    	manifest: PluginManifest;
    	isEnabled: boolean;
    	isLoaded: boolean;
    	hasFailed: boolean;
    	error?: string;
}

/**
 * Represents a plugin's manifest.json information
 * @public
 */
export declare interface PluginManifest {
    	id: string;
    	name: string;
    	version: string;
    	minAppVersion: string;
    	main: string;
    	pluginDependencies?: string[];
    	description: string;
    	author?: string;
    	authorUrl?: string;
    	fundingUrl?: string;
}

/**
 * Event types related to database and filesystem storage operations.
 * @public
 */
export declare type StorageEvents = {
    	"media:saved": {
        		mediaId: string;
        		path?: string;
        	};
    	"media:deleted": {
        		mediaId: string;
        	};
};

/**
 * @public
 */
export declare interface SupplementaryFile {
    	id: string;
    	libraryItemId: string;
    	type: string;
    	storagePath: string;
    	format?: string;
    	language?: string;
    	filename?: string;
    	sizeBytes?: number;
    	checksum?: string;
    	createdAt: Date;
}

/**
 * Represents a block of text
 * @public
 */
export declare interface TextBlock extends BaseBlock {
    	type: "text";
    	content: string;
    	style?: string;
    	language?: string;
}

/**
 * @public
 */
export declare interface UpdateAppSettingDTO {
    	value: string;
}

/**
 * @public
 */
export declare interface UpdateCollectionDTO {
    	name?: string;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface UpdateContentGroupDTO {
    	type?: string;
    	name?: string;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface UpdateEmbeddedAssetDTO {
    	storagePath?: string;
    	format?: string;
    	originalSrc?: string;
    	width?: number;
    	height?: number;
    	sizeBytes?: number;
    	checksum?: string;
}

/**
 * @public
 */
export declare interface UpdateLibraryItemDTO {
    	type?: string;
    	name?: string;
    	language?: string;
    	sourceUri?: string;
    	storagePath?: string;
    	contentDocumentPath?: string;
    	contentGroupId?: string;
    	groupOrder?: number;
    	dynamicMetadata?: Record<string, any>;
}

/**
 * @public
 */
export declare interface UpdatePluginDataDTO {
    	key?: string;
    	jsonData?: string;
    	libraryItemId?: string;
}

/**
 * @public
 */
export declare interface UpdateSupplementaryFileDTO {
    	type?: string;
    	storagePath?: string;
    	format?: string;
    	language?: string;
    	filename?: string;
    	sizeBytes?: number;
    	checksum?: string;
}

/**
 * @public
 */
export declare interface UpdateVocabularyEntryDTO {
    	text?: string;
    	language?: string;
}

/**
 * Represents a video embed
 * @public
 */
export declare interface VideoBlock extends BaseBlock {
    	type: "video";
    	assetId?: string;
    	externalSrc?: string;
}

/**
 * @public
 */
export declare interface VocabularyEntry {
    	id: string;
    	text: string;
    	language: string;
    	createdAt: Date;
}

/**
 * @public
 */
export declare interface VocabularySource {
    	vocabularyId: string;
    	libraryItemId: string;
    	contextSentence?: string;
    	startOffset?: number;
    	endOffset?: number;
    	timestampMs?: number;
}

/**
 * @public
 */
export declare type WildcardHandler<Events extends Record<EventType, unknown>> = (type: keyof Events, event: Events[keyof Events]) => void;

/**
 * Event types related to workspace operations and user interactions.
 * @public
 */
export declare type WorkspaceEvents = {
    	"media:opened": {
        		mediaId: string;
        		source: string;
        	};
    	"layout:changed": {
        		newLayout: string;
        	};
    	"tab:reload": {
        		tabId: string;
        		title: string;
        	};
    	"tab:duplicate": {
        		tabId: string;
        		title: string;
        	};
    	"tab:close": {
        		tabId: string;
        		title: string;
        	};
    	"tab:close-others": {
        		exceptTabId: string;
        		closedCount: number;
        	};
    	"tab:close-all": {
        		closedCount: number;
        	};
};

export { }
