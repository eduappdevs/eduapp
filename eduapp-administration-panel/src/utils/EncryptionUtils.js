import { Crypt } from "hybrid-crypto-js";
import { Buffer } from "buffer";

/**
 * Singleton class used to encrypt or decrypt information.
 */
export default class EncryptionUtils {
  /**
   * Returns a new EncryptionUtils instance.
   * @returns {EncryptionUtils} instance
   */
  static instance() {
    return new Crypt();
  }

  /**
   * Differs the time a text is loaded to prevent timed attacks.
   * @param {String} text Message
   * @returns {Buffer} bufferedText
   */
  static untime(text) {
    return Buffer.from(text);
  }

  /**
   * Encrypts a message.
   *
   * @param {String} text Message to encrypt.
   * @param {String} publicKey The public key to encrypt with.
   * @returns {String} encryptedString
   */
  static encrypt(text, publicKey) {
    return EncryptionUtils.instance()
      .encrypt(publicKey, EncryptionUtils.untime(text))
      .toString();
  }

  /**
   * Decrypts a message.
   *
   * @param {String} text Message to decrypt.
   * @param {String} privateKey The private key to decrypt with.
   * @returns {String} decryptedString
   */
  static decrypt(encrypted, privateKey) {
    return EncryptionUtils.instance().decrypt(
      privateKey,
      EncryptionUtils.untime(encrypted)
    );
  }
}
