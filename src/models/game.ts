import { User } from '../models';

export class Game {
  // 313 starts at round 3 and goes to round 13
  static startingRound = 3;

  public id: number;
  public players: User[];
  public round: number;

  constructor(id: number, players: User[]) {
    this.id = id; // TODO: Refactor when there's a db to provide this
    if (players.length > 1 && players.length < 7) {
      this.players = players;
    } else {
      throw new RangeError('Players[] must have 2-6 members.');
    }
    this.round = Game.startingRound;
  }

  public goToNextRound() {
    if (this.round !== 13) {
      this.round++;
    }
  }
}
