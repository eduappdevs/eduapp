class UserInfo < ApplicationRecord
  belongs_to :user
  belongs_to :user_role

  def self.search_name(pattern)
    if pattern.blank?
      all
    else
      order(user_name: :asc).where("user_name LIKE ?", "%#{pattern}%")
    end
  end
end
