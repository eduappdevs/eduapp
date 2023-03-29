require "test_helper"

class ChatParticipantsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat_participant = chat_participants(:one)
  end

  test "should get index" do
    get chat_participants_url, as: :json
    assert_response :success
  end

  test "should create chat_participant" do
    assert_difference('ChatParticipant.count') do
      post chat_participants_url, params: { chat_participant: { chat_base_id: @chat_participant.chat_base_id, isChatAdmin: @chat_participant.isChatAdmin, user_id: @chat_participant.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show chat_participant" do
    get chat_participant_url(@chat_participant), as: :json
    assert_response :success
  end

  test "should update chat_participant" do
    patch chat_participant_url(@chat_participant), params: { chat_participant: { chat_base_id: @chat_participant.chat_base_id, isChatAdmin: @chat_participant.isChatAdmin, user_id: @chat_participant.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy chat_participant" do
    assert_difference('ChatParticipant.count', -1) do
      delete chat_participant_url(@chat_participant), as: :json
    end

    assert_response 204
  end
end
