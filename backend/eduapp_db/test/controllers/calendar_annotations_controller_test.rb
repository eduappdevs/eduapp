require "test_helper"

class CalendarAnnotationsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get calendar_annotations_index_url
    assert_response :success
  end
end
