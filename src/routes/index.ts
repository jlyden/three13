import { Application, Request, Response } from 'express';

export let allGames = (req: Request, res: Response) => {
  res.send('Returns all Games');
};

export const register = (app: Application) => {
  app.get('/', (req: any, res) => {
    res.status(200).send('Three 13');
  });

  app.get('/game', (req: any, res) => {
    res.status(200).send('Game');
  });
};



