import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { FIREBASE_CFG } from "../config";

/**
 * Singleton class used to manage files in the Firebase cloud.
 */
export default class FirebaseStorage {
  static instance = null;

  /**
   * Initializes the Firebase SDK.
   * @returns {FirebaseApp} FirebaseApp
   */
  static init() {
    if (this.instance === null)
      return (this.instance = initializeApp(FIREBASE_CFG));
    return this.instance;
  }

  /**
   * Gets an existing or creates a new firebaseApp instance.
   * @returns {FirebaseApp} FirebaseApp
   */
  static getInstance() {
    if (this.instance === null) return this.init();
    return this.instance;
  }

  /**
   * Returns the storage bucket from the cloud.
   * @returns {FirebaseStorage}
   */
  static getStorage() {
    if (this.instance === null) return getStorage(this.getInstance());
    return getStorage(this.instance);
  }

  /**
   * Gets a path to a file in the storage bucket.
   * @param {String} path
   * @returns {StorageReference} ref
   */
  static getRef(path) {
    if (path) return ref(this.getStorage(), path);
    return ref(this.getStorage());
  }
}
