#!/usr/bin/ruby

require "bundler"
require "uri"
Bundler.require

get '/' do
  erb :index
end

# a dumb post route for
post '/submit' do
  content_type :json

  # fancy credit card validation stuff which is not client
  # secure would be sent here

  #always send a success message for this demo
  res = {
    message: "Transaction Succeeded!"
  }
  res.to_json
end