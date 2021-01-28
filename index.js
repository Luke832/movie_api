const express = require('express');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

  bodyParser = require('body-parser');
  morgan = require('morgan');
  uuid = require('uuid');

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops something broke!');
});

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Gets a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

// Gets data about a movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title})
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

//Gets data about a genre by name/title
app.get('/movies/genres/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title})
    .then((movies) => {
      res.status(201).json({Genre: movies.Genre});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

// Get data about a director by name
app.get('/movies/directors/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name})
    .then((director) => {
      res.status(201).json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

// Get a list of users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

// Get data about a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username})
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + error);
    });
});

// Allow a new user to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists.');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow users to update their username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},
  { $set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
    }
  },
  { new: true}, //this line makes sure the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to add movies to their favorites list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID}
  },
    { new: true}, //this line makes sure the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + error);
    } else {
      res.json({updatedUser});
    }
  });
});

// Allow users to remove a movie from their favorites list
app.post('/users/:Username/movies/:MovieID/Remove', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID}
  },
    { new: true}, //this line makes sure the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow existing users to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
