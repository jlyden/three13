// index.js

/**
 * Required External Modules
 */
import express from "express";
import path from "path";

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("Three 13");
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});