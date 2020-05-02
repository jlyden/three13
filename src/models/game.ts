import { User } from '../models';

export class Game {
  public id: number;
  public players: User[];

  constructor(id: number, players: User[]) {
    this.id = id; // TODO: Refactor when there's a db to provide this
    this.players = players;
  }
}