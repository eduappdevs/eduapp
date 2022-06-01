class ApplicationController < ActionController::API

    def getExtrafields
        tables = ActiveRecord::Base.connection.tables

        # get params[:table] from tables
       table = ActiveRecord::Base.connection.tables.select { |t| t == params[:table] }

        # return tables to json
        render json: table

    end
end
