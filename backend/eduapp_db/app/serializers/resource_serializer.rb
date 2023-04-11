class ResourceSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :resource_files, :resource_files_json, :created_at, :updated_at
  has_one :subject
  has_one :user
end
