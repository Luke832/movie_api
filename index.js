const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.erro(err.stack);
  res.status(500).send('Oops something broke!');
});

let topMovies = [
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'The Godfather Part II',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese'
  },
  {
    title: 'Inglorious Basterds',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Django Unchained',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Lincoln',
    director: 'Steven Spielberg'
  },
  {
    title: 'Saving Private Ryan',
    director: 'Steven Spielberg'
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis'
  },
  {
    title: 'A League of Their Own',
    director: 'Penny Marshall'
  },
  {
    title: 'No Country for Old Men',
    director: 'Joel and Ethan Coen'
  },
];

//GET requests
app.get('/', (req, res) => {
  res.send('Here is my awesome movie list!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
