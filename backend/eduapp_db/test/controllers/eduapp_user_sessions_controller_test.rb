require "test_helper"

class EduappUserSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @eduapp_user_session = eduapp_user_sessions(:one)
  end

  test "should get index" do
    get eduapp_user_sessions_url, as: :json
    assert_response :success
  end

  test "should create eduapp_user_session" do
    assert_difference('EduappUserSession.count') do
      post eduapp_user_sessions_url, params: { eduapp_user_session: { resources_platform: @eduapp_user_session.resources_platform, session_chat_id: @eduapp_user_session.session_chat_id, session_date: @eduapp_user_session.session_date, session_name: @eduapp_user_session.session_name, streaming_platform: @eduapp_user_session.streaming_platform } }, as: :json
    end

    assert_response 201
  end

  test "should show eduapp_user_session" do
    get eduapp_user_session_url(@eduapp_user_session), as: :json
    assert_response :success
  end

  test "should update eduapp_user_session" do
    patch eduapp_user_session_url(@eduapp_user_session), params: { eduapp_user_session: { resources_platform: @eduapp_user_session.resources_platform, session_chat_id: @eduapp_user_session.session_chat_id, session_date: @eduapp_user_session.session_date, session_name: @eduapp_user_session.session_name, streaming_platform: @eduapp_user_session.streaming_platform } }, as: :json
    assert_response 200
  end

  test "should destroy eduapp_user_session" do
    assert_difference('EduappUserSession.count', -1) do
      delete eduapp_user_session_url(@eduapp_user_session), as: :json
    end

    assert_response 204
  end
end
