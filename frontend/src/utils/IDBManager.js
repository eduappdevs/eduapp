import * as idb from "idb-keyval";

export default class IDBManager {
  constructor() {
    this.storage = null;
    this.store = null;
  }

  async initDb(storage_db, store) {
    return idb.createStore(storage_db, store);
  }

  async getStorageInstance(storage_db, store) {
    this.store = await this.initDb(storage_db, store);
    this.storage = storage_db;
    return this.storage;
  }

  async get(key) {
    return await idb.get(key, this.store);
  }

  async set(key, value) {
    return await idb.set(key, value, this.store);
  }

  async update(key, value) {
    return await idb.update(key, value, this.store);
  }

  async delete(key) {
    return await idb.del(key, this.store);
  }

  async getMany(keys) {
    return await idb.getMany(keys, this.store)
  }

  async deleteMany(keys) {
    return await idb.delMany(keys, this.store);
  }

  async getStoreKeys() {
    return await idb.keys(this.store);
  }

  async clear() {
    return await idb.clear(this.store);
  }
}
