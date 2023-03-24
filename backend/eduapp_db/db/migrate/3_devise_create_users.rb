class DeviseCreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name
      t.string :surname
      ## Database authenticatable
      t.string :email, null: false, default: "", index: { unique: true }
      t.string :username, null:true,index:{unique:true}
      t.string :encrypted_password, null: false, default: ""
      t.string :encrypted_googleid, null:true, index: { unique: true }

      ## Recoverable
      t.string :reset_password_token, index: { unique: true }
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      t.string :confirmation_code #confirmation code
      t.datetime :confirmation_code_exp_time #confirmation code expiry time

      ## Trackable
      t.integer :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip

      ## Confirmable
      # t.string   :confirmation_token
      # t.datetime :confirmed_at
      # t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      # t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      # t.string   :unlock_token # Only if unlock strategy is :email or :both
      # t.datetime :locked_at

      # JTI Matcher
      # t.string :jti, null: false

      t.timestamps null: false
    end
    
    # add_column :users, :confirmation_code, :string
    # :users, :confirmation_code_exp_time, :string
    # add_index :users, :jti, unique: true
    # add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end
end
