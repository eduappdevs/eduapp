class ResourceSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :files

  def files
    if object.files.attached?
      {
        url: rails_blob_url(object.files)
      }
    end
  end
end
