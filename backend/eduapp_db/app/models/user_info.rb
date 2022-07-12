class UserInfo < ApplicationRecord
  belongs_to :user
  belongs_to :user_role

  # Mainly used for the name searcher when creating a chat in the App.
  def self.search_name(pattern)
    if pattern.blank?
      all
    else
      order(user_name: :asc).where("user_name LIKE ?", "%#{pattern}%")
    end
  end
end
