class PushNotificationsController < ApplicationController
  before_action :authenticate_user!, except: [:key, :subscribe]
  before_action :check_role!, except: [:key, :subscribe]

  def key
   render json: { public_key: Base64.urlsafe_decode64(ENV.fetch("VAPID_PUBLIC_KEY")).bytes }
  end

  def subscribe
    push_notification = PushNotification.find_by(auth: permit_params[:auth])
    if !push_notification
      push_notification = PushNotification.new(permit_params)
    end

    if push_notification.save
      render json: push_notification, status: :created
    else
      render json: push_notification.errors, status: :unprocessable_entity
    end
  end

  # def push
  #   push_notifications = PushNotification.where(user_id: @current_user)
  #   message = {
  #     title: "title",
  #     body: "body",
  #     icon: "http://example.com/icon.pn"
  #   }
  #   push_notifications.each do |push_noficification|
  #     Webpush.payload_send(
  #       endpoint: push_noficification.endpoint,
  #       message: JSON.generate(message),
  #       p256dh: push_noficification.p256dh,
  #       auth: push_noficification.auth,
  #       vapid: {
  #         subject: "mailto:alejandro.vera1988@example.com",
  #         public_key: ENV.fetch('VAPID_PUBLIC_KEY'),
  #         private_key: ENV.fetch('VAPID_PRIVATE_KEY')
  #       }
  #     )
  #   end
  # end

  private

  def permit_params
    params.permit(:endpoint, :user_id, :p256dh, :auth)
  end

end
