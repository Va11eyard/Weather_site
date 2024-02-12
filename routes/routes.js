const express = require('express');
const router = express.Router();
const axios = require('axios');

const User = require('../models/User');
const WeatherData = require('../models/WeatherData');
const Number = require('../models/NumberModel');
const Translation = require('../models/Translation');


const TranslateClient = require('../client/TranslateClient');
const apiKey = 'AIzaSyD6tKcmK_8yJW08kVf2GokBU-MktqlwxrQ';

router.get('/', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.render("register.ejs", { errorMessage: "Username already exists" });
            return;
        }
        let isAdmin = false;
        if (username === "Dinmukhammed" && password === "Dinmukhammed2207") {
            isAdmin = true;
        }
        const newUser = new User({ username, password, isAdmin });
        await newUser.save();
        req.session.userId = newUser._id;
        res.redirect(`/weather/${newUser._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.userId = user._id;
            res.redirect(`/weather/${user._id}`);
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/weather/:userId', async( req, res)=>{
    try {
        res.render("weather", {
            userId: req.params.userId,
            weatherData: null
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
})

router.post('/weather/:userId', async (req, res) => {
    try {
        const apiKey = '16d311977fced07064aa910221a6b04c';
        const city = req.body.city;
        const userId = req.params.userId; 
        if (!city) {
            return res.status(400).json({ error: 'Не указан город в запросе' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const weatherData = await fetchWeatherData(city, apiKey);
        const newWeatherData = await saveWeatherData(userId, weatherData); 

        res.render("weather", {
            userId: req.params.userId,
            weatherData: newWeatherData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});

async function fetchWeatherData(city, apiKey) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    return response.data;
}

async function saveWeatherData(userId, weatherData) {
    const retrievalTime = new Date();
    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const weatherIcon = weatherData.weather[0].icon;
    const description = weatherData.weather[0].description;
    const coordinates = `(${weatherData.coord.lat}, ${weatherData.coord.lon})`;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const windSpeed = weatherData.wind.speed;
    const countryCode = weatherData.sys.country;
    const rainVolume = weatherData.rain ? weatherData.rain["1h"] : "N/A";
    const cityName = weatherData.name;
    const country = weatherData.sys.country;

    const newWeatherData = await WeatherData.create({
        user: userId,
        city: cityName,
        temperature,
        feelsLike,
        retrievalTime,
        weatherIcon,
        description,
        coordinates,
        humidity,
        pressure,
        windSpeed,
        countryCode,
        rainVolume,
        country,
    });

    return newWeatherData;
}


router.get('/number/:userId', async (req, res) => {
    try {
        res.render("number", { userId: req.params.userId, fact: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error rendering number view");
    }
});

router.post('/number/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const number = req.body.number;
        const response = await axios.get(`http://numbersapi.com/${number}`);
        
        const newNumber =  await Number.create({
            userId: userId,
            number: number,
            fact: response.data
        });

        res.render('number', { userId: userId, fact: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/translate/:userId', async (req, res) => {
    try {
        res.render("translate", { userId: req.params.userId, translatedText: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error rendering number view");
    }
});

router.post('/translate/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { text, targetLanguage } = req.body;
    try {
        if (!text || !targetLanguage) {
            return res.status(400).send('Missing text or target language');
        }
        const client = new TranslateClient(apiKey);
        const translation = await client.translateText(text, targetLanguage);
        const newTranslation = new Translation({
            userId: userId,
            text: text,
            language: targetLanguage,
            result: translation
        });
        await newTranslation.save();

        res.render('translate', { userId: userId, translatedText: translation }); 
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).send('Error translating text');
    }
});

router.get('/history/:userId', async (req, res) =>{
    try {
        const userId = req.params.userId;

        const WeatherDataHistory = await WeatherData.find({user: userId})
        const NumberHistory = await Number.find({userId: userId})
        const TranslationHistory = await Translation.find({userId: userId})
        const history = {
            WeatherDataHistory,
            NumberHistory,
            TranslationHistory
        };
        const user = await User.findById(userId);
        res.render('history', { userId: userId, user: user,  history: history });
    
      } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).send('Internal Server Error');
      }
})
const isAdmin = async (req, res, next) => {
    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
  
      console.log(user)
      if (user && user.isAdmin) {
        next();
      } else {
        res.status(403).send('Access forbidden. Only administrators can access this page.');
      }
    } catch (error) {
      console.error('Ошибка при поиске пользователя:', error);
      res.status(500).send('Internal Server Error');
    }
  };


router.get('/admin/:userId',isAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await User.find();

        res.render('admin', { userId: userId, users: users });
    } catch (error) {
        console.error('Error rendering admin page:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/admin/add/:userId', isAdmin, async (req, res) => {
    const adminId = req.params.userId;
    const { username, password, isAdmin } = req.body;
    try {
        const adminUser = await User.findById(adminId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).send('Forbidden');
        }
        const newUser = new User({ username, password, isAdmin });
        await newUser.save();
        res.redirect(`/admin/${adminId}`);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/admin/update/:userId', isAdmin, async (req, res) => {
    const adminUserId = req.params.userId; 
    const { updateUserId, username, password, isAdmin } = req.body; 

    if (isAdmin) {
        console.error('Error updating user:');
        res.status(500).send('Error updating user');
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(updateUserId, { 
            username: username, 
            password: password, 
            isAdmin: isAdmin 
        }, { new: true });

        res.redirect('/admin/' + adminUserId); 
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});


router.post('/admin/delete/:deleteUserId/:userId',isAdmin,  async (req, res) => {
    const adminId = req.params.userId;
    const userId = req.params.deleteUserId;
    try {
        const adminUser = await User.findById(adminId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).send('Forbidden');
        }
        await User.findByIdAndDelete(userId);
        res.redirect(`/admin/${adminId}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
