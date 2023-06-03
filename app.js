require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const credentials = {clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET};

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi(credentials);

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {spotifyApi.setAccessToken(data.body['access_token']);})
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
  
    spotifyApi
        .searchArtists(req.query.searchartist)
        .then(data => {
            console.log('The received data from the API: ', data.body)
            res.render('search', {item: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body)
            res.render('album', {item: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
  });

  app.get('/tracks/:tracksID', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.tracksID)
        .then(data => {
            console.log('The received data from the API: ', data.body)
            res.render('tracks', {item: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));