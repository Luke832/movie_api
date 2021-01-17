const express = require('express');
  bodyParser = require('body-parser');
  morgan = require('morgan');
  uuid = require('uuid');

const app = express();

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
    bio: 'Robert Zemeckis is an American film director producer and screenwriter. He is known as an innovator of special effects in the film industry. His films include the Back to the Future series, Who Framed Roger Rabbit (1988), and Forrest Gump (1994) for which he won an Academy Award.',
    birthYear: 'May 14th, 1952',
    deathYear: ' '
  },
];

let users = [];

//GET requests
app.get('/', (req, res) => {
  res.send('Here is my awesome movie list!');
});

// Gets a list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets data about a movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
  { return movie.title === req.params.title }));
});

//Gets data about a genre by name/title
app.get('/movies/genres/:title', (req, res) => {
  res.json(genres.find((genre) =>
  { return genre.title === req.params.title }));
});

// Get data about a director by name
app.get('/movies/directors/:name', (req, res) => {
  res.json(directors.find((director) =>
  { return director.name === req.params.name }));
});

// Allow a new user to register
app.post('/users', (req, res) => {
  let newUser = req.body;
  let user = users.find((user) => { return user.username === newUser.username});
  if (!user) {
    newUser.id = uuid.v4();
    newUser.Favorite_Movies = [];
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('This username already exists.');
  }
});

// Allow users to update their username
app.put('/users/:username', (req, res) => {
  let newUsername = req.body;
  let user = users.find((user) => { return user.username === req.params.username});
  if (!user) {
    res.status(404).send('This username does not exist.');
  } else {
    user.username = newUsername.username;
    user.password = newUsername.password;
    user.email = newUsername.email;
    user.dateOfBirth = newUsername.dateOfBirth;
    res.status(200).json(user);
  }
});

// Allow users to add movies to their favorites list
app.post('/users/:username/:Favorite_Movies/:Movie_ID', (req, res) => {
  res.send('Successful POST request adding movie title: ' + req.params.title + ' has been added to ' + req.params.username + ' favorite movies list.');
});

// Allow users to remove a movie from their favorites list
app.delete('/users/:username/:Favorite_Movies/:Movie_ID', (req, res) => {
  res.send('Successful DELETE request removing movie title: ' + req.params.title + ' has been removed from ' + req.params.username + ' favorite movies list.');
});

// Allow existing users to deregister
app.delete('/users/:username', (req, res) => {
  res.send('Succesful DELETE request removing user: ' + req.params.username + ' has been removed database.');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
