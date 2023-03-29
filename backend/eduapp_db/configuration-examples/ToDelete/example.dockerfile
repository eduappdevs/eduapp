FROM ruby:2.6.9

WORKDIR /backend

COPY package*.json ./
COPY Gemfile* ./

RUN gem install bundler
RUN bundle install

COPY . .

RUN rm .env
RUN mv docker-example.env .env

RUN rm -f ./tmp/pids/server.pid
RUN rm ./log/development.log
RUN rm ./log/test.log

EXPOSE 3000

CMD [ "rails", "s", "-b", "0.0.0.0" ]