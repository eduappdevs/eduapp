class ResourceSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :subject_id, :name, :description, :firstfile, :secondfile, :thirdfile, :created_at, :updated_at
  has_one :user

  def firstfile
    if object.firstfile.attached?
      {
        url: rails_blob_url(object.firstfile),
      }
    end
  end

  def secondfile
    if object.secondfile.attached?
      {
        url: rails_blob_url(object.secondfile),
      }
    end
  end

  def thirdfile
    if object.thirdfile.attached?
      {
        url: rails_blob_url(object.thirdfile),
      }
    end
  end
end
