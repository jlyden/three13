import _ from 'lodash';
import { Deck, Hand, Game, User } from './index';

export class Round {
  public game: Game;
  public userCount: number;
  public deck: Deck;
  public hands: Hand[];
  public nextUp: User;
  public message: string;

  constructor(game: Game) {
    this.game = game;
    this.userCount = game.players.length;

    this.deck = new Deck();
    this.deck.shuffle();

    this.hands = [];
    for (let i = 0; i < this.userCount; i ++){
      this.hands.push(new Hand());
    }
  }

  public startRound(roundCount: number) {
    this.deal(roundCount);

    this.nextUp = this.game.players[0];
    this.setMessage(`${this.nextUp.nickname}, time to draw and discard!`)
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
   * @param roundCount
   */
  private deal(roundCount: number) {
    const cardCount = roundCount + 2;

    // loop through cardCount
    for (let i = 0; i < cardCount; i ++) {
      // loop through userCount
      for (let j = 0; j < this.userCount; j ++) {
        // pull card from deck, add it to hand
        const thisCard = this.deck.dealOneCard();
        this.hands[j].add(thisCard);
      }
    }
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
