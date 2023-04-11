require "test_helper"

class ChatBasesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat_basis = chat_bases(:one)
  end

  test "should get index" do
    get chat_bases_url, as: :json
    assert_response :success
  end

  test "should create chat_basis" do
    assert_difference('ChatBase.count') do
      post chat_bases_url, params: { chat_basis: { chat_name: @chat_basis.chat_name, isGroup: @chat_basis.isGroup } }, as: :json
    end

    assert_response 201
  end

  test "should show chat_basis" do
    get chat_basis_url(@chat_basis), as: :json
    assert_response :success
  end

  test "should update chat_basis" do
    patch chat_basis_url(@chat_basis), params: { chat_basis: { chat_name: @chat_basis.chat_name, isGroup: @chat_basis.isGroup } }, as: :json
    assert_response 200
  end

  test "should destroy chat_basis" do
    assert_difference('ChatBase.count', -1) do
      delete chat_basis_url(@chat_basis), as: :json
    end

    assert_response 204
  end
end
