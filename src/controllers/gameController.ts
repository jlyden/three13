import { Request, Response } from 'express';

export let allGames = (req: Request, res: Response) => {
  res.send('Returns all Games');
};
