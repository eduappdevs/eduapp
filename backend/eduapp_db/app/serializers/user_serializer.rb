class UserSerializer < ActiveModel::Serializer
  attributes :confirmation_code, :confirmation_code_exp_time, :created_at, :email, :encrypted_googleid, :extra_fields, :id, :name, :surname, :updated_at, :username, :user_info
  has_one :user_info
  has_many :subjects
end
