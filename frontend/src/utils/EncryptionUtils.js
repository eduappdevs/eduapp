import { Crypt } from "hybrid-crypto-js";
import { Buffer } from "buffer";

export default class EncryptionUtils {
  static instance() {
    return new Crypt();
  }

  static untime(text) {
    return Buffer.from(text);
  }

  static encrypt(text, publicKey) {
    return EncryptionUtils.instance()
      .encrypt(publicKey, EncryptionUtils.untime(text))
      .toString();
  }

  static decrypt(encrypted, privateKey) {
    return EncryptionUtils.instance().decrypt(
      privateKey,
      EncryptionUtils.untime(encrypted)
    );
  }
}
