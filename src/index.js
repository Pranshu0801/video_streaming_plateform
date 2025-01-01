import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("server error...", err);
      throw err;
    });
    app.listen(process.env.PORT || 8001, () => {
      console.log(`server started .... ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed...", err);
  });
