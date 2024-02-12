# https://assignment3-sloo.onrender.com

A web application that provides weather information, a translator, and interesting facts about numbers. The application was created using Node.js, Express and integrates with external APIs to get data.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

## Installation

1. Clone the repository:

   ```bash
   git clone `https://github.com/Va11eyard/Weather_site.git`

2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Start the server using `nodemon server.js`.

## Usage
- The server runs on port 3000.


### Structure
```
├── Weather_site/
│   ├── node_modules/
│   ├── client/
│   │   ├── TranslateClient.js
│   ├── models/  [For mongoose schemas]
│   │   ├── NumberModel.js
│   │   ├── Translation.js
│   │   ├── User.js
│   │   ├── WeatherData.js
│   ├── routes/  [Server-side routes for request handling]
│   │   ├── routes.js
│   ├── views/  [Contains client-side files (ejs)]
│   │   ├── admin.ejs
│   │   ├── history.ejs
│   │   ├── login.js
│   │   ├── number.ejs
│   │   ├── register.ejs
│   │   ├── translate.js
│   │   ├── weather.ejs
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
```


## Features
- **Weather Information:**
  - Real-time weather data including temperature, description, icon.
  - Enter any city name to retrieve relevant weather data.
- **Translator:**
  - Allows you to translate a word to another language.
- **Fun Fact about Number:**
  - Provides interesting fact about your chosen number.

## Admin information:
- username: Dinmukhammed
- password: Dinmukhammed2207

## Dependencies
- **Express:** Used for server setup and routing.
- **Body-parser:** Middleware for parsing incoming request bodies.
- **Axios:** Handles HTTP requests.
- **Path:** Helps manage file paths.
- **Nodemon** Monitors for changes and automatically restarts the server.

## APIs Used
- OpenWeatherMap API - For weather data.
- Google Cloud Translate API - to translate text into certain languages.
- Numbersapi - to get interesting facts about the numbers.


### Author
Dinmukhammed Mynzhasar, SE - 2207
