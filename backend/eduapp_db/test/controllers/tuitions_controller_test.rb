require "test_helper"

class TuitionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tuition = tuitions(:one)
  end

  test "should get index" do
    get tuitions_url, as: :json
    assert_response :success
  end

  test "should create tuition" do
    assert_difference('Tuition.count') do
      post tuitions_url, params: { tuition: { course_id: @tuition.course_id, user_id: @tuition.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show tuition" do
    get tuition_url(@tuition), as: :json
    assert_response :success
  end

  test "should update tuition" do
    patch tuition_url(@tuition), params: { tuition: { course_id: @tuition.course_id, user_id: @tuition.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy tuition" do
    assert_difference('Tuition.count', -1) do
      delete tuition_url(@tuition), as: :json
    end

    assert_response 204
  end
end
