import { User } from '../models';

export class Game {
  public id: number;
  public players: User[];
  public round: number;

  constructor(id: number, players: User[]) {
    this.id = id; // TODO: Refactor when there's a db to provide this
    this.players = players;
    this.round = 3;
  }

  public goToNextRound() {
    if(this.round !== 13){
      this.round ++;
    } 
  }
}