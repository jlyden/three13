import * as express from "express";

export const register = ( app: express.Application ) => {

  app.get("/", (req: any, res) => {
    res.status(200).send("Three 13");
  });
  
  app.get("/game", (req: any, res) => {
    res.status(200).send("Game");
  });
  
}