import _ from 'lodash';
import { Deck, Hand, Game, User } from './index';

export class Round {
  public game: Game;
  public deck: Deck;
  public hands: Hand[];
  public nextUp: User;
  public message: string;

  constructor(game: Game) {
    this.game = game;

    this.deck = new Deck();
    this.deck.shuffle();

    this.hands = [];
    const userCount = this.game.players.length;
    for (let i = 0; i < userCount; i ++){
      this.hands.push(new Hand());
    }
  }

  public startRound() {
    this.deal();
    this.setNextUp()
    this.setMessage(`${this.nextUp.nickname}, time to draw and discard!`)
  }

  public continueRound() {
    // do stuff
  }

  public end() {
    // if(turn), user can go_out() (includes discard action)
    // validate user's hand - if invalid, round continues
    // if valid, update us score & clear user's hand
    // set end_of_round = true: all other users get only one more turn
    // after each discard(), evaluate each of their hands and calculate score
    // after last user has discarded, start next round
  }

  /**
   * In three13, each player is dealt different # of cards per round
   * Round 1 = 3 cards; Round 2 = 4 cards; etc, until Round 10 = 13 cards.
   */
  private deal() {
    const cardCount = this.game.round;
    const userCount = this.game.players.length;

    // loop through cardCount
    for (let i = 0; i < cardCount; i ++) {
      // loop through userCount
      for (let j = 0; j < userCount; j ++) {
        // pull card from deck, add it to hand
        this.hands[j].add(this.deck.dealOneCard());
      }
    }
  }

  /**
   * Rotate first player to draw based on round
   */
  private setNextUp() {
    const userCount = this.game.players.length;
    let nextUp = (this.game.round) % userCount;
    // In 2 player game, we still want User 0 to go first
    if(userCount < 3) {
      nextUp = (this.game.round - 1) % userCount;
    }
    this.nextUp = this.game.players[nextUp];
  }

  private setMessage(message: string) {
    if(this.message) {
      this.clearMessage();
    }
    this.message = message;
  }

  private clearMessage() {
    this.message = '';
  }
}
