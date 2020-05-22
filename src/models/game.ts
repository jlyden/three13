import { User } from '../models';

export class Game {
  // 313 starts at round 3 and goes to round 13
  static STARTING_ROUND = 3;
  static PLAYER_COUNT_MIN = 2;
  static PLAYER_COUNT_MAX = 6;

  public id: number;
  public players: User[];
  public round: number;

  constructor(id: number, players: User[]) {
    this.id = id; // TODO: Refactor when there's a db to provide this
    if (players.length >= Game.PLAYER_COUNT_MIN && players.length <= Game.PLAYER_COUNT_MAX) {
      this.players = players;
    } else {
      throw new RangeError('Players[] must have 2-6 members.');
    }
    this.round = Game.STARTING_ROUND;
  }

  public goToNextRound() {
    if (this.round !== 13) {
      this.round++;
    }
  }
}
