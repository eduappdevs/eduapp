module EduAppUtils
  module EncryptUtils
    require "openssl"
    require "securerandom"

    @salt = Base64.decode64(ENV.fetch("ENCRYPTION_SALT"))
    @pattern = ENV.fetch("ENCRYPTION_PATTERN")

    def self.gen_key_pair(chat_id)
      key = OpenSSL::PKey::RSA.generate(2048)

      pri_key = OpenSSL::PKey::RSA.new(key, "#{chat_id}::#{SecureRandom.random_bytes(32)}")
      pub_key = OpenSSL::PKey::RSA.new(key.public_key)

      return Base64.encode64(pri_key.to_s), Base64.encode64(pub_key.to_s)
    end

    def self.encrypt(msg, pub_key)
      return Base64.encode64("#{@salt}#{pattern}#{pub_key.public_encrypt(msg)}")
    end

    def self.decrypt(cipher_text, pri_key)
      begin
        return pri_key.private_decrypt(Base64.decode64(cipher_text).split(pattern)[1])
      rescue OpenSSL::PKey::RSAError => e
        puts "Invalid decryption: #{e}"
        return nil
      rescue TypeError => e
        puts "Message tampered! No salt provided: #{e}"
        return nil
      end
    end
  end
end
