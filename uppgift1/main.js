import mongoose from "mongoose";
import readline from "readline";

await mongoose.connect("mongodb://localhost:27017/Uppgift1");

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const movieSchema = new mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genres: [String],
  ratings: [Number],
  cast: [String],
});

const Movie = mongoose.model("Movie", movieSchema);

function displayMenu() {
  console.log("Movies Menu");
  console.log("1. View all movies");
  console.log("2. Add a new movie");
  console.log("3. Update a movie");
  console.log("4. Delete a movie");
  console.log("5. Exit");
}

async function viewAllMovies() {
    try {
      const movies = await Movie.find({}).exec();
      console.log("All Movies");
      console.log(movies);
      console.log("Number of movies:", movies.length);
      displayMenu();
    } catch (error) {
      console.error("Error fetching movies:", error);
      displayMenu();
    }
  }

  async function addNewMovie() {
    try {
      console.log("Enter details for the new movie:");
      const newMovie = {
        title: await prompt("Title: "),
        director: await prompt("Director: "),
        releaseYear: parseInt(await prompt("Release Year: "), 10),
        genres: (await prompt("Genres : ")).split(","),
        ratings: (await prompt("Ratings : ")).split(",").map(Number),
        cast: (await prompt("Cast : ")).split(","),
      };
  
      const movie = new Movie(newMovie);
      await movie.save();
      
      console.log("New movie added successfully!");
      displayMenu();
    } catch (error) {
      console.error("Error adding new movie:", error);
      displayMenu();
    }
  }
  
  function prompt(question) {
    return new Promise((resolve) => {
      r1.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
  

  async function updateMovie() {
    try {
      const movies = await Movie.find({});
      console.log("Choose a movie to update:");
      movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
      });
  
      const selectedIndex = parseInt(await prompt("Enter the number of the movie to update: "), 10) - 1;
      const selectedMovie = movies[selectedIndex];
  
      if (!selectedMovie) {
        console.log("Invalid selection. Returning to menu.");
        displayMenu();
        return;
      }
  
      console.log("Choose fields to update :");
      console.log("1. Title");
      console.log("2. Director");
      console.log("3. Release Year");
      console.log("4. Genres");
      console.log("5. Ratings");
      console.log("6. Cast");
  
      const fieldsToUpdate = (await prompt("Enter the numbers of the fields to update: ")).split(",").map(Number);
  
      const updates = {};
      if (fieldsToUpdate.includes(1)) updates.title = await prompt("New Title: ");
      if (fieldsToUpdate.includes(2)) updates.director = await prompt("New Director: ");
      if (fieldsToUpdate.includes(3)) updates.releaseYear = parseInt(await prompt("New Release Year: "), 10);
      if (fieldsToUpdate.includes(4)) updates.genres = (await prompt("New Genres : ")).split(",");
      if (fieldsToUpdate.includes(5)) updates.ratings = (await prompt("New Ratings : ")).split(",").map(Number);
      if (fieldsToUpdate.includes(6)) updates.cast = (await prompt("New Cast : ")).split(",");
  
      await Movie.updateOne({ _id: selectedMovie._id }, updates);
      console.log("Movie updated successfully!");
      displayMenu();
    } catch (error) {
      console.error("Error updating movie:", error);
      displayMenu();
    }
  }
  

  async function deleteMovie() {
    try {
      const movies = await Movie.find({});
      console.log("Choose a movie to delete:");
      movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
      });
  
      const selectedIndex = parseInt(await prompt("Enter the number of the movie to delete: "), 10) - 1;
      const selectedMovie = movies[selectedIndex];
  
      if (!selectedMovie) {
        console.log("Invalid selection. Returning to menu.");
        displayMenu();
        return;
      }
  
      await Movie.deleteOne({ _id: selectedMovie._id });
      console.log("Movie deleted successfully!");
      displayMenu();
    } catch (error) {
      console.error("Error deleting movie:", error);
      displayMenu();
    }
  }
  

displayMenu();

r1.on("line", (input) => {
  switch (input) {
    case "1":
      viewAllMovies();
      break;
    case "2":
      addNewMovie();
      break;
    case "3":
      updateMovie();
      break;
    case "4":
      deleteMovie();
      break;
    case "5":
      mongoose.disconnect();
      r1.close();
      break;
    default:
      console.log("Wrong input");
      break;
  }
});

r1.on("close", () => {
  console.log("Ending program");
  process.exit(0);
});
