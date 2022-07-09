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
    try {
      return await idb.update(key, value, this.store);
    } catch (error) {
      console.log("Error updating, trying to do it by ahother way...")
      try {
        await idb.del(key, this.store)
        await idb.set(key, value, this.store)
      } catch (error) {
        console.log("An error ocurring when trying to delete and set the new keyvalue")

      }

    }
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

<<<<<<< HEAD
  async keyExists(key){
    let response = false
    await idb.keys(this.store).then((res)=>{
      Array.from(res).map((res)=>{
        if(res===key){response= true}})
      })
    return response
=======
  async keyExists(key) {
    await idb.keys(this.store).then((res) => { return Array.from(res).includes(key) })
  }
  async clear() {
    return await idb.clear(this.store);
>>>>>>> c94b7869afacdf3bcacc7968f8c8c4c12f673740
  }
}
