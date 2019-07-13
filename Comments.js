// DEPENDENCIES
// =====================================
// Read and set environment variables
require("dotenv").config();

// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Import the API keys
var keys = require("./keys");

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// FUNCTIONS
// =====================================

// Helper function that gets the artist name
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }
    //KAVAUGHN: spotify search takes two parameters. The first parameter takes an object with two keys. The two keys are used in the second parameter to tell the function what data to retrieve. The second parameter is a function that takes two parameters. the function uses the data it takes in to display messages on the screen.
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;
      //KAVAUGHN: The for loop goes through each index in the array items and displays on the screen the artists featured in the song, the song name, song preview url, and the album name.
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

var getMyBands = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
//KAVAUGHN: Below is a function that retrieves data and displays that data to the screen.
  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        //KAVAUGHN: If the length is zero then it prints out no results found.
        console.log("No results found for " + artist);
        return;
      }

      console.log("Upcoming concerts for " + artist + ":");
//KAVAUGHN: The for loop goes through each index in the array from bandsintown and displays the city,region,venue name, and the date.
      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        // Print data about each concert
        // If a concert doesn't have a region, display the country instead
        // Use moment to format the date
        console.log(
          show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};

// Function for running a Movie Search
//KAVAUGHN: below getMeMovie takes one parameter which is a string. The string contains a movie name. If the movie name is undfined then the variable moiveName is changed to Mr.Nobody. 
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
//KAVAUGHN: Below the get function fires from the axios class and retrieves data. The data is passed on to the Then function that spits out the data onto the screen.
  axios.get(urlHit).then(
    function(response) {
      var jsonData = response.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  );
};

// Function for running a command based on text file
//KAVAUGHN: the function below reads the random.txt file. On the screen it will print out information of the song "I Want It That Way"
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Function for determining which command is executed
//KAVAUGHN: Below is a cool function that takes in a string that contains the name of the desired api. If the string matches one of the cases then the matched case will run the desired function.
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "concert-this":
    getMyBands(functionData);
    break;
  case "spotify-this-song":
    getMeSpotify(functionData);
    break;
  case "movie-this":
    getMeMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

// Function which takes in command line arguments and executes correct function accordingly
var runThis = function(argOne, argTwo) {
    //KAVAUGHN: Picks an api
    pick(argOne, argTwo);
};

// MAIN PROCESS
// =====================================

//KAVAUGHN: Below is a function that takes two parameters. The first parameter selects which api to use. The second takes an artist - song or whatever the api needs.
runThis(process.argv[2], process.argv.slice(3).join(" "));
