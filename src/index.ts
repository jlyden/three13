import express = require("express");
const app = express();
const port = "5000";

app.get("/", (req, res) => {
  res.status(200).send("Three 13");
});

app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening to requests on http://localhost:${port}`);
});