import { toRaw } from "vue";
import localforage from "localforage";

localforage
  .setDriver([
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    localforage.WEBSQL,
  ])
  .then(() => {
    console.debug(
      "[PiniaPersistPlugin] LocalForage drivers set: IndexedDB prioritized.",
    );
  })
  .catch((err) => {
    console.error(
      "[PiniaPersistPlugin] Failed to set LocalForage drivers:",
      err,
    );
  });

/**
 * A simple debounce function to limit how often a function is called.
 * It ensures the function is executed only after a specified delay without further calls.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds after which the function will be executed.
 * @returns {Function} The debounced version of the function.
 */
function debounce(func, delay) {
  let timeout;
  return function executed(...args) {
    const context = this;
    const later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

/**
 * Creates a Pinia plugin for persisting store states to LocalForage (IndexDB).
 *
 * This plugin allows stores to define a `persist` option to control
 * which parts of their state are saved and how.
 *
 * @param {object} [globalOptions={}] - Global options for the plugin instance.
 * @param {string} [globalOptions.baseKey='pinia'] - The base key prefix for IndexDB entries.
 * E.g., 'my-app' would result in keys like 'my-app-hero-data'.
 * @param {string} [globalOptions.keySeparator='-'] - The separator used between key segments.
 * @param {string} [globalOptions.suffix='data'] - The suffix added to the end of the IndexDB key.
 * @param {number} [globalOptions.defaultDebounceDelay=300] - The default debounce delay in milliseconds
 * for saving store state to IndexDB.
 * @param {string[]} [globalOptions.excludePathsOnAutoPersist=['loaded']] - A list of state paths (top-level properties)
 * to automatically exclude from persistence if a store does not explicitly define its `paths` option.
 * Useful for transient states like `loaded`, `loading`, `error`.
 * @returns {function} The Pinia plugin function to be used with `pinia.use()`.
 */
export function createPiniaPersistPlugin(globalOptions = {}) {
  const {
    baseKey: globalBaseKey = "pinia",
    keySeparator: globalKeySeparator = "-",
    suffix: globalSuffix = "data",
    defaultDebounceDelay = 300,
    excludePathsOnAutoPersist = ["loaded"],
  } = globalOptions;

  // The actual Pinia plugin function
  return async ({ store, options }) => {
    // Check if the store has a 'persist' option configured
    const persistOptions = options?.persist;

    // If no persist option, this store should not be persisted.
    if (!persistOptions) {
      return;
    }

    // Destructure store-specific persistence options, applying global defaults if not specified.
    const {
      key: storeSpecificKey, // Specific key segment for this store, can be string or function
      paths: storeSpecificPaths, // Array of paths (top-level state properties) to persist
      serializer = (state) => JSON.stringify(state), // Function to serialize state before saving
      deserializer = (data) => JSON.parse(data), // Function to deserialize data after loading
      debounce: debounceDelay = defaultDebounceDelay, // Debounce delay for this specific store
      customKeyBuilder, // Optional: a function to completely customize the storage key
    } = typeof persistOptions === "object" ? persistOptions : {}; // If 'persist: true', options will be an empty object.

    // Determine the effective paths to persist for this store.
    let effectivePaths;
    if (storeSpecificPaths !== undefined) {
      // If 'paths' is explicitly defined in the store's persist option, use it.
      effectivePaths = storeSpecificPaths;
    } else {
      // If 'paths' is NOT explicitly defined (i.e., 'persist: true' or 'persist: {}'),
      // take all top-level state keys and filter out globally excluded paths.
      effectivePaths = Object.keys(store.$state).filter(
        (path) => !excludePathsOnAutoPersist.includes(path),
      );
    }

    /**
     * Generates the unique storage key for the current store in IndexDB.
     * Prioritizes customKeyBuilder, then store-specific key logic, then global key structure.
     * @returns {string} The generated storage key.
     */
    const generateStoreKey = () => {
      if (customKeyBuilder) {
        // If a custom key builder is provided, use it for full control.
        return customKeyBuilder({
          baseKey: globalBaseKey,
          storeId: store.$id,
          separator: globalKeySeparator,
          suffix: globalSuffix,
          storeSpecificKey: storeSpecificKey,
        });
      }
      // Determine the effective ID part for the key.
      // If storeSpecificKey is a function, call it with store ID.
      const idPart =
        typeof storeSpecificKey === "function"
          ? storeSpecificKey(store.$id)
          : storeSpecificKey || store.$id; // Fallback to store.$id if no specific key.

      // Construct the full key using global baseKey, separator, idPart, and suffix.
      return `${globalBaseKey}${globalKeySeparator}${idPart}${globalKeySeparator}${globalSuffix}`;
    };

    const storageKey = generateStoreKey();

    // --- Initial State Loading (Hydration) ---
    // Attempt to load the stored state from LocalForage (IndexDB).
    try {
      const storedData = await localforage.getItem(storageKey);
      if (storedData) {
        // Deserialize the loaded data.
        const deserializedData = deserializer(storedData);
        const patchData = {};

        // Prepare the patch data, only including the effective paths and ensuring they exist in deserialized data.
        effectivePaths.forEach((path) => {
          if (
            deserializedData &&
            typeof deserializedData === "object" &&
            Object.prototype.hasOwnProperty.call(deserializedData, path)
          ) {
            patchData[path] = deserializedData[path];
          }
        });
        // Apply the loaded data to the store's state using $patch for efficient updates.
        store.$patch(patchData);
      }
    } catch (error) {
      // Log any errors during the loading process.
      console.error(
        `[PiniaPersistPlugin] Error loading store '${store.$id}' (Key: ${storageKey}) from IndexDB:`,
        error,
      );
    } finally {
      // Set the 'loaded' flag on the store, if it exists.
      // This indicates that the initial hydration attempt (successful or not) has completed.
      // The 'loaded' property should not be part of the persisted state itself.
      if (Object.prototype.hasOwnProperty.call(store, "loaded")) {
        store.loaded = true;
      }
    }

    // --- State Persisting on Changes ---
    // Create a debounced version of the save function to limit IndexDB write operations.
    const debouncedSave = debounce((stateToPersist) => {
      try {
        // Serialize the data before saving.
        const serializedData = serializer(stateToPersist);
        localforage.setItem(storageKey, serializedData);
      } catch (error) {
        // Log any errors during the saving process.
        console.error(
          `[PiniaPersistPlugin] Error saving store '${store.$id}' (Key: ${storageKey}) to IndexDB:`,
          error,
        );
      }
    }, debounceDelay);

    // Subscribe to store changes. This callback is executed whenever the store's state mutates.
    store.$subscribe((mutation, state) => {
      const dataToPersist = {};
      // Collect only the data from the effectivePaths to be saved.
      effectivePaths.forEach((path) => {
        // Ensure the path actually exists in the current state before attempting to persist it.
        if (Object.prototype.hasOwnProperty.call(state, path)) {
          dataToPersist[path] = toRaw(state[path]); // Use toRaw to get a plain JavaScript object/array.
        } else {
          console.warn(
            `[PiniaPersistPlugin] Path '${path}' in store '${store.$id}' not found. Will not be persisted.`,
          );
        }
      });
      // Trigger the debounced save function.
      debouncedSave(dataToPersist);
    });
  };
}
