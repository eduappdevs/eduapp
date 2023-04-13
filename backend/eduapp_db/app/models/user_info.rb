class UserInfo < ApplicationRecord
  belongs_to :user
  belongs_to :user_role

  mount_uploader :profile_image, ProfileImageUploader
  # Mainly used for the name searcher when creating a chat in the App.
  def self.search_name(pattern)
    if pattern.blank?
      self
    else
      where("user_name ILIKE :q", q: "%#{pattern}%")
    end
  end
  def self.search_email(pattern)
    if pattern.blank?
      self
    else
      joins(:user).where("users.email LIKE ?", "%#{pattern}%")
    end
  end
end
