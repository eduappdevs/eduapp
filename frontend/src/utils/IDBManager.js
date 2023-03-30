import * as idb from "idb-keyval";

/**
 * Singleton class used to adapt the IndexedDB as asynchronous.
 */
export default class IDBManager {
  constructor() {
    this.storage = null;
    this.store = null;
  }

  /**
   * Used to initialize an instance.
   *
   * @param {String} storage_db DB to access.
   * @param {String} store Store to access.
   * @returns {idb.UseStore} storeInstance
   */
  async initDb(storage_db, store) {
    return idb.createStore(storage_db, store);
  }

  /**
   * Used to get an instance if it exists, if not it initializes it.
   *
   * @param {String} storage_db DB to access.
   * @param {String} store Store to access.
   * @returns {idb.UseStore} storeInstance
   */
  async getStorageInstance(storage_db, store) {
    this.store = await this.initDb(storage_db, store);
    this.storage = storage_db;
    return this.storage;
  }

  /**
   * Get store key.
   *
   * @param {String} key Unique identifier.
   * @returns {Object} keyValue The key's value.
   */
  async get(key) {
    return await idb.get(key, this.store);
  }

  /**
   * Sets store key and value in the store.
   * @param {String} key Unique identifier.
   * @param {Object} value he key's value.
   */
  async set(key, value) {
    return await idb.set(key, value, this.store);
  }

  /**
   * Updates a key-value pair.
   *
   * @param {String} key
   * @param {Object} value
   */
  async update(key, value) {
    try {
      return await idb.update(key, value, this.store);
    } catch (error) {
      console.log("Error updating, trying to do it by ahother way...");
      try {
        await idb.del(key, this.store);
        await idb.set(key, value, this.store);
      } catch (error) {
        console.log(
          "An error ocurring when trying to delete and set the new keyvalue"
        );
      }
    }
  }

  /**
   * Deletes a key from the initialized store.
   *
   * @param {String} key
   */
  async delete(key) {
    return await idb.del(key, this.store);
  }

  /**
   * Gets an array of keys from the store.
   *
   * @param {String[]} keys
   * @returns {Object[]} key-values[]
   */
  async getMany(keys) {
    return await idb.getMany(keys, this.store);
  }

  /**
   * Deletes multiple keys at once.
   *
   * @param {String[]} keys
   */
  async deleteMany(keys) {
    return await idb.delMany(keys, this.store);
  }

  /**
   * Gets all the store's keys.
   *
   * @returns {Object[]}
   */
  async getStoreKeys() {
    return await idb.keys(this.store);
  }

  /**
   * Tests if a key exists in the store.
   * @param {String} key
   * @return {Boolean} exists
   */
  async keyExists(key) {
    await idb.keys(this.store).then((res) => {
      return Array.from(res).includes(key);
    });
  }

  /**
   * Deletes the instantiated store.
   */
  async clear() {
    return await idb.clear(this.store);
  }
}
