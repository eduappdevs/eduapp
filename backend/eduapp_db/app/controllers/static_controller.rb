class StaticController < ApplicationController
    def home
        render json: {status: 0}
    end
end