import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { FIREBASE_CFG } from "../config";

export default class FirebaseStorage {
  static instance = null;

  static init() {
    if (this.instance === null)
      return (this.instance = initializeApp(FIREBASE_CFG));
    return this.instance;
  }

  static getInstance() {
    if (this.instance === null) return this.init();
    return this.instance;
  }

  static getStorage() {
    if (this.instance === null) return getStorage(this.getInstance());
    return getStorage(this.instance);
  }

  static getRef(path) {
    if (path) return ref(this.getStorage(), path);
    return ref(this.getStorage());
  }
}
