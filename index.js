require('dotenv').config();

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

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const app = express();

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect( process.env.CONNECTION_URI , {useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops something broke!');
});

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Gets a list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
// app.get('/users', (req, res) => {
//   Users.find()
//     .then((users) => {
//       res.status(201).json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + error);
//     });
// });
//
// // Get data about a user by username
// app.get('/users/:Username', (req, res) => {
//   Users.findOne({ Username: req.params.Username})
//     .then((user) => {
//       res.status(201).json(user);
//     })
//     .catch((err) => {
//       res.status(500).send('Error: ' + error);
//     });
// });

// Allow a new user to register
app.post('/users', [
  // Validation logic
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json( {errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists.');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
  // Validation logic
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json( {errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username},
  { $set: {
    Username: req.body.Username,
    Password: hashedPassword,
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID/Remove', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
