require 'sinatra'
require 'sinatra/reloader' if development?
require 'json'
require 'httparty'
require 'dotenv/load'

# Home page
get '/' do
  erb :index
end

post '/weather' do
  content_type :json

  # Parse JSON from request body
  request_payload = JSON.parse(request.body.read) rescue {}
  lat = request_payload["lat"]
  lon = request_payload["lon"]

  api_key = ENV['API_KEY']

  unless lat && lon
    return { error: "Invalid coordinates" }.to_json
  end

  begin
    response = HTTParty.get("https://api.openweathermap.org/data/2.5/weather?lat=#{lat}&lon=#{lon}&units=imperial&appid=#{api_key}")
    data = response.parsed_response

    if data["cod"] == 200
      { 
        city: data["name"],
        temp: data["main"]["temp"],
        feels_like: data["main"]["feels_like"],
        temp_min: data["main"]["temp_min"],
        temp_max: data["main"]["temp_max"],
        description: data["weather"][0]["description"].capitalize,
        icon: data["weather"][0]["icon"],
        humidity: data["main"]["humidity"],
        pressure: data["main"]["pressure"],
        wind_speed: data["wind"]["speed"],
        clouds: data["clouds"]["all"],
        sunrise: data["sys"]["sunrise"],
        sunset: data["sys"]["sunset"]
      }.to_json
      
    else
      { error: data["message"].capitalize }.to_json
    end
  rescue => e
    { error: e.message }.to_json
  end
end

