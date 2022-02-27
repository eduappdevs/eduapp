require "test_helper"

class ChatBaseInfosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat_base_info = chat_base_infos(:one)
  end

  test "should get index" do
    get chat_base_infos_url, as: :json
    assert_response :success
  end

  test "should create chat_base_info" do
    assert_difference('ChatBaseInfo.count') do
      post chat_base_infos_url, params: { chat_base_info: { chat_base_id: @chat_base_info.chat_base_id, chat_img: @chat_base_info.chat_img } }, as: :json
    end

    assert_response 201
  end

  test "should show chat_base_info" do
    get chat_base_info_url(@chat_base_info), as: :json
    assert_response :success
  end

  test "should update chat_base_info" do
    patch chat_base_info_url(@chat_base_info), params: { chat_base_info: { chat_base_id: @chat_base_info.chat_base_id, chat_img: @chat_base_info.chat_img } }, as: :json
    assert_response 200
  end

  test "should destroy chat_base_info" do
    assert_difference('ChatBaseInfo.count', -1) do
      delete chat_base_info_url(@chat_base_info), as: :json
    end

    assert_response 204
  end
end
