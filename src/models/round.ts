import _ from 'lodash';
import { drawMessage, discardMessage } from '../constants/messages';
import { Deck, Hand, Game, User } from './index';
import { Card } from './card';

export class Round {
  public game: Game;
  public deck: Deck;
  public hands: Hand[];
  public visibleCard: Card;
  public currentPlayer: User;
  public message: string;

  constructor(game: Game) {
    this.game = game;

    this.deck = new Deck();
    this.deck.shuffle();

    this.hands = [];
    this.game.players.forEach(() => {
      this.hands.push(new Hand());
    });
  }

  // NOTE: User button - 'Start Round'
  public startRound() {
    this.deal();
    this.visibleCard = this.deck.dealOneCard();
    this.setFirstPlayerForRound();
    this.setMessage(this.currentPlayer.nickname + drawMessage);
  }

  // NOTE: User button - 'Take Visible Card'
  public takeVisibleCard() {
    // Get current user's hand and add visibleCard to it
    const handIndex = this.getCurrentUserIndex();
    this.hands[handIndex].add(this.visibleCard);

    this.visibleCard = null;
    this.setMessage(this.currentPlayer.nickname + discardMessage);
  }

  // NOTE: User button - 'Draw from Deck'
  public drawFromDeck() {
    // Get current user's hand and add card from deck to it
    const handIndex = this.getCurrentUserIndex();
    this.hands[handIndex].add(this.deck.dealOneCard());

    this.setMessage(this.currentPlayer.nickname + discardMessage);
  }

  public discardAfterTurn(card: Card) {
    // Get current user's hand
    const handIndex = this.getCurrentUserIndex();

    // Remove specified card and set it to visibleCard
    this.visibleCard = this.hands[handIndex].discard(card);
  }

  // NOTE: User button - 'Go Out'
  public endRound() {
    // if(nextUp), user can go_out() (includes discard action)
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
    for (let i = 0; i < cardCount; i++) {
      // loop through userCount
      for (let j = 0; j < userCount; j++) {
        // pull card from deck, add it to hand
        this.hands[j].add(this.deck.dealOneCard());
      }
    }
  }

  /**
   * Rotate first player to draw based on round
   * TODO: make private after testing - set up rewire
   */
  public setFirstPlayerForRound() {
    const userCount = this.game.players.length;
    const corrective = Math.abs(Game.startingRound - userCount);
    const currentPlayerIndex = (this.game.round + corrective) % userCount;
    this.currentPlayer = this.game.players[currentPlayerIndex];
  }

  public getCurrentUserIndex(): number {
    return _.findIndex(this.game.players, this.currentPlayer);
  }

  private setMessage(message: string) {
    if (this.message) {
      this.clearMessage();
    }
    this.message = message;
  }

  private clearMessage() {
    this.message = '';
  }
}
