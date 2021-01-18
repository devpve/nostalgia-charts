const Chart = require('../models/chart');
const fetch = require('node-fetch');
let date = new Date();
const today = Math.round(date.getTime()/1000);
let monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
monthStart = Math.round(monthStart.getTime()/1000);

getUserArtistChart = async (username, start_date, end_date) => {
  
  let url_artists = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=" + username + "&from=" + start_date + "&to=" + end_date + "&api_key="+ process.env.LASTFM_KEY + "&format=json";
  return await fetch(url_artists);

}

getUserAlbumChart = async (username, start_date, end_date) => {

  let url_albums = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=" + username + "&from=" + start_date + "&to=" + end_date + "&api_key="+ process.env.LASTFM_KEY + "&format=json";
  return await fetch(url_albums);

}

getUserTrackChart = async (username, start_date, end_date) => {

  let url_tracks = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=" + username + "&from=" + start_date + "&to=" + end_date + "&api_key="+ process.env.LASTFM_KEY + "&format=json";
  return await fetch(url_tracks);
}

getArtistInfo = async(artist_name, token) => {

  const result = await fetch('https://api.spotify.com/v1/search?q=' + artist_name + '&type=artist', {
    method: 'GET', 
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json', 
      'Authorization' : 'Bearer ' + token
    }
  });

  return await result;
}

getAlbumInfo = async (artist_name, album_name) => {

  let url_album = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + process.env.LASTFM_KEY + "&artist="+ artist_name + "&album="+ album_name + "&format=json";
  return await fetch(url_album);

}

getTrackInfo = async (artist_name, track_name, token) => {

  // let url_track = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + process.env.LASTFM_KEY + "&artist=" + artist_name + "&track=" + track_name + "&format=json";
  // return await fetch(url_track);
  const result = await fetch('https://api.spotify.com/v1/search?q=track:"' + track_name + '"%20artist:"' + artist_name + '"&type=track', {
    method: 'GET', 
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json', 
      'Authorization' : 'Bearer ' + token
    }
  });

  return await result;

}

const getSpotifyToken = async () => {

  const bufferString = process.env.SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET;

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST', 
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded', 
      'Authorization' : 'Basic ' + Buffer.from(bufferString).toString('base64')
    }, 
    body: 'grant_type=client_credentials'
  });

  return await result;
}

// get user individual simple charts, top artist, album and song for the current month
// fetch 3 promises
//  then fetch 2 other promises to get album and artist image 
//  done that cause lastfm doesn't send it
const chart_individual_simple = async (req, res) => {
  
  const displayName = req.user.displayName;
  const username = req.user.username;
  const userImg = req.user.image;
  const start_date = monthStart;
  const end_date = today;

  Promise.all([getUserArtistChart(username, start_date, end_date), getUserAlbumChart(username,  start_date, end_date), getUserTrackChart(username, start_date, end_date), getSpotifyToken()]).then(values => {
    return Promise.all(values.map(r => r.json()));
  }).then(([artist, album, track, token]) => {
    
    let topArtist = artist.weeklyartistchart.artist[0];
    let topAlbum = album.weeklyalbumchart.album[0];
    let topTrack = track.weeklytrackchart.track[0];
    let spotifyToken = token.access_token;

    Promise.all([getArtistInfo(topArtist.name, spotifyToken), getAlbumInfo(topAlbum.artist['#text'], topAlbum.name), getTrackInfo(topTrack.artist['#text'], topTrack.name, spotifyToken)]).then(values => {
      return Promise.all(values.map(r => r.json()));
    }).then(([artistInfo, albumInfo, trackInfo]) => {

      let trackImg, artistImg, albumImg;

      try {
        artistImg = artistInfo.artists.items[0].images[0].url;
      } catch {
        artistImg = "notfound.png";
      }
      
      try {
        albumImg = albumInfo.album.image[2]['#text'];
      } catch {
        albumImg = "notfound.png";
      }

      try {
        trackImg = trackInfo.tracks.items[0].album.images[0].url;
      } catch {
        trackImg = "notfound.png";
      }
    
      topArtist.image = artistImg;
      topAlbum.image = albumImg;
      topTrack.image = trackImg;

      res.render('dashboard', {
        title: 'Dashboard', name: displayName, username: username, image: userImg, track: topTrack, album: topAlbum, artist: topArtist
      });
    })
    .catch(err => console.log("Failed second promises " + err));
  })
  .catch(err => console.log("Failed first promises " + err));

}

module.exports = {
  chart_individual_simple
}