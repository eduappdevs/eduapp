require "test_helper"

class CalendarAnnotationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @calendar_annotation = calendar_annotations(:one)
  end

  test "should get index" do
    get calendar_annotations_url, as: :json
    assert_response :success
  end

  test "should create calendar_annotation" do
    assert_difference('CalendarAnnotation.count') do
      post calendar_annotations_url, params: { calendar_annotation: { annotation_date: @calendar_annotation.annotation_date, annotation_description: @calendar_annotation.annotation_description, annotation_name: @calendar_annotation.annotation_name, isGlobal: @calendar_annotation.isGlobal, user_id: @calendar_annotation.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show calendar_annotation" do
    get calendar_annotation_url(@calendar_annotation), as: :json
    assert_response :success
  end

  test "should update calendar_annotation" do
    patch calendar_annotation_url(@calendar_annotation), params: { calendar_annotation: { annotation_date: @calendar_annotation.annotation_date, annotation_description: @calendar_annotation.annotation_description, annotation_name: @calendar_annotation.annotation_name, isGlobal: @calendar_annotation.isGlobal, user_id: @calendar_annotation.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy calendar_annotation" do
    assert_difference('CalendarAnnotation.count', -1) do
      delete calendar_annotation_url(@calendar_annotation), as: :json
    end

    assert_response 204
  end
end
