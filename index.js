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

let movies = [
  {
    title: 'The Godfather',
    description: 'Follows the Corleone crime family in 1940s and 50s New York. It chronicles the transfer of power from patriarch Vito Corleone to his son Michael Corleone',
    genre: 'Crime',
    director: 'Francis Ford Coppola',
    image: 'godfather.png'
  },
  {
    title: 'The Godfather Part II',
    description: 'Both a sequel and prequel to "The Godfather." The sequel picks up in 1958 and covers Michael Corleone as the head of the family, protecting his family and business after an attempt on his life. The prequel covers the journey of Vito Corleone as a boy in Sicily, to starting his crime family in New York.',
    genre: 'Crime',
    director: 'Francis Ford Coppola',
    image: 'godfatherPartII.png'
  },
  {
    title: 'Inglorious Basterds',
    description: 'The film tells an alternate history of two seperate plots to kill Nazi Germany"s leadership. One by a young Jewish woman running a cinema in France. The other by a team of Jewish American soldiers.',
    genre: 'Drama',
    director: 'Quentin Tarantino',
    image: 'ingloriousBasterds.png'
  },
  {
    title: 'Saving Private Ryan',
    description: 'The film is set in World War II follows United States Army Rangers Captain John H Miller and his squad as they search for Private James Ryan, who is the last surviving Ryan brother out of four in the war.',
    genre: 'War',
    director: 'Steven Spielberg',
    image: 'savingPrivateRyan.png'
  },
  {
    title: 'Forrest Gump',
    description: 'The story depicts several decades of the life of Forrest Gump. A slow-witted but kind-hearted man from Alabama. Throughout his journey, Forrest encounters and influences several defining historical moments of the twentieth century.',
    genre: 'Drama',
    director: 'Robert Zemeckis',
    image: 'forrestGump.png'
  },
  {
    title: 'Goodfellas',
    description: 'Follows mobster Henry Hill and his relationship with his wife Karen, as well as fellow mobsters Jimmy Conway and Tommy Devito.',
    genre: 'Crime',
    director: 'Martin Scorsese',
    image: 'goodfellas.png'
  },
  {
    title: 'Wedding Crashers',
    description: 'Friends John Beckwith and Jeremy Grey sneak into weddings to meet and hook up with women. The two find themselves at odds when John meets and falls in love with Claire Cleary.',
    genre: 'Comedy',
    director: 'David Dobkin',
    image: 'weddingCrashers.png'
  },
  {
    title: 'Old School',
    description: 'Three friends try to recapture their college glory days by starting a new fraternity near their alma mater.',
    genre: 'Comedy',
    director: 'Todd Phillips',
    image: 'oldSchool.png'
  },
  {
    title: 'Training Day',
    description: 'A rookie LAPD officer spends his first day with a narcotics officer who is not who he appears to be.',
    genre: 'Crime',
    director: 'Antoine Fuqua',
    image: 'trainingDay.png'
  },
  {
    title: 'Lincoln',
    description: 'Focuses on the American President"s struggle to pass the 13th amendment to the Constitution and abolish slavery in the United States, while still dealing with the Civil War.',
    genre: 'Drama',
    director: 'Steven Spielberg',
    image: 'lincoln.png'
  },
];

let genres = [
  {
    title: 'Crime',
    description: 'Crime films involve various aspects of crime and it"s detection. Crime films often overlap with other genres as well, including but not limited to: drama, comedy, mystery, suspense, etc.'
  },
  {
    title: 'Drama',
    description: 'Drama films are a category of fictional or semi-fictional narratives intended to be more serious than humorous in tone.'
  },
  {
    title: 'War',
    description: 'War films focus on warfare using combat scenes to depict the drama. Examples include: naval, air, or land battles.'
  },
  {
    title: 'Comedy',
    description: 'Comdedy films are designed to make the audience laugh mainly through jokes and exaggerating characteristics.'
  }
];

let directors = [
  {
    name: 'Francis Ford Coppola',
    bio: 'Francis Ford Coppola is an American film director, producer and screenwriter. He is widely considered one of the best filmmakers of all time for his work on: The Godfather (1972), The Godfather Part II (1974), The Conversation (1974), and Apocalypse Now (1979), among others.',
    birthYear: 'April 7th, 1939',
    deathYear: ' '
  },
  {
    name: 'Quentin Tarantino',
    bio: 'Quentin Tarantino is an American film director, producer, screenwriter, and actor. He is best known for his nonlinear storylines, dark humor, aestheticization of violence, and extended scenes of dialogue.',
    birthYear: 'March 27th, 1963',
    deathYear: ' '
  },
  {
    name: 'Steven Spielberg',
    bio: 'Steven Spielberg is an American film director, producer, and screenwriter. He is one of the most commercially successful filmmakers of all time, with hits like E.T. the Extra Terrestrial (1982), Jurrasic Park (1993), and the Indiana Jones series, to name a few.',
    birthYear: 'December 18th, 1946',
    deathYear: ' '
  },
  {
    name: 'Robert Zemeckis',
    bio: 'Robert Zemeckis is an American film director, producer and screenwriter. He is known as an innovator of special effects in the film industry. His films include the Back to the Future series, Who Framed Roger Rabbit (1988), and Forrest Gump (1994) for which he won an Academy Award.',
    birthYear: 'May 14th, 1952',
    deathYear: ' '
  },
  {
    name: 'Martin Scorsese',
    bio: 'Martin Scorsese is an American film director, producer, screenwriter, and actor. His films focus on themes such as faith, crime, machismo, and violence. He is widely considered one of the best and most influential filmmakers of all time.',
    birthYear: 'November 17th, 1942',
    deathYear: ' '
  },
  {
    name: 'David Dobkin',
    bio: 'David Dobkin is an American film director, producer, and screenwriter. He is known for his commercials, music videos, and comedy films, among other works.',
    birthYear: 'June 23rd, 1969',
    deathYear: ' '
  },
  {
    name: 'Todd Phillips',
    bio: 'Todd Phillips is an American film director, producer, screenwriter, and actor. He is mainly known for his comedy films, until he co-wrote and directed the psychological thriller Joker (2019), which earned him several Academy Award nominations.',
    birthYear: 'December 20th, 1970',
    deathYear: ' '
  },
  {
    name: 'Antoine Fuqua',
    bio: 'Antoine Fuqua is an American film director and producer. He started his career directing music videos, working with artists such as Prince, Stevie Wonder, and Toni Braxton, to name a few. His best known feature film is Training Day (2001), which was nominated for several awards.',
    birthYear: 'January 19th, 1966',
    deathYear: ' '
  },
];

let users = [];

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Gets a list of all movies
app.get('/movies', (req, res) => {
  // res.json(movies);
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
  // res.json(movies.find((movie) =>
  // { return movie.title === req.params.title }));
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
app.get('movies/genres/:Title', (req, res) => {
  // res.json(genres.find((genre) =>
  // { return genre.title === req.params.title }));
  Movies.findOne({ Title: req.params.Title})
    .then((movies) => {
      res.status(201).json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error);
    });
});

// Get data about a director by name
app.get('/movies/directors/:Name', (req, res) => {
  // res.json(directors.find((director) =>
  // { return director.name === req.params.name }));
  Movies.findOne({ 'Director.Name': req.params.Name})
    .then((director) => {
      res.status(201).json(director.Director);
    })
    .catch((err) => {
      console.error(err);
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
  { new: true},
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
app.post('/users/:Username/:FavoriteMovies/:MovieID', (req, res) => {
  // res.send('Successful POST request adding movie title: ' + req.params.title + ' has been added to ' + req.params.username + ' favorite movies list.');
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID}
  },
    { new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to remove a movie from their favorites list
app.delete('/users/:Username/:FavoriteMovies/:MovieID', (req, res) => {
  // res.send('Successful DELETE request removing movie title: ' + req.params.title + ' has been removed from ' + req.params.username + ' favorite movies list.');
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID}
  },
    { new: true},
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
  // res.send('Succesful DELETE request removing user: ' + req.params.username + ' has been removed database.');
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
