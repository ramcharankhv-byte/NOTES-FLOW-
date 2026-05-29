import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/db/index.js";

import app from "./app.js";

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server running at  http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("error occured ", err);
  });
