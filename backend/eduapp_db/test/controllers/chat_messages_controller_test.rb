require "test_helper"

class ChatMessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat_message = chat_messages(:one)
  end

  test "should get index" do
    get chat_messages_url, as: :json
    assert_response :success
  end

  test "should create chat_message" do
    assert_difference('ChatMessage.count') do
      post chat_messages_url, params: { chat_message: { chat_base_id: @chat_message.chat_base_id, message: @chat_message.message, send_date: @chat_message.send_date, user_id: @chat_message.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show chat_message" do
    get chat_message_url(@chat_message), as: :json
    assert_response :success
  end

  test "should update chat_message" do
    patch chat_message_url(@chat_message), params: { chat_message: { chat_base_id: @chat_message.chat_base_id, message: @chat_message.message, send_date: @chat_message.send_date, user_id: @chat_message.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy chat_message" do
    assert_difference('ChatMessage.count', -1) do
      delete chat_message_url(@chat_message), as: :json
    end

    assert_response 204
  end
end
