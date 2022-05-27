class ResourceSerializer < ActiveModel::Serializer
  attributes :id, :subject_id, :name, :description, :resource_files,:resource_files_json, :createdBy, :created_at , :updated_at 
  has_one :subject
end