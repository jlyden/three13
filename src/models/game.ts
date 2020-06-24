export class Game {
  static INITIAL_ROUND = 3;
  static FINAL_ROUND = 13;
  static PLAYER_COUNT_MIN = 2;
  static PLAYER_COUNT_MAX = 6;

  private userIds: number[];
  private currentRound: number;

  constructor(userIds: number[]) {
    if (userIds.length >= Game.PLAYER_COUNT_MIN && userIds.length <= Game.PLAYER_COUNT_MAX) {
      this.userIds = userIds;
    } else {
      throw new RangeError('A game can only begin with 2-6 users.');
    }
    this.currentRound = Game.INITIAL_ROUND;
  }

  public getRound() {
    return this.currentRound;
  }

  public goToNextRound() {
    if (this.currentRound !== Game.FINAL_ROUND) {
      this.currentRound++;
    } else {
      throw new RangeError('Game ends after round 13');
    }
  }
}
