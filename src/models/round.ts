import _ from 'lodash';
import { drawMessage, discardMessage, invalidDiscardMessage } from '../constants/messages';
import { Deck, Hand, Game, User } from '../models';
import { Card } from './card';
import { CardNotFoundError } from '../errors';

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
    this.visibleCard = this.deck.pop();
    this.setFirstPlayerForRound();
  }

  // NOTE: User button - 'Take Visible Card'
  public takeVisibleCard() {
    // Get current user's hand and add visibleCard to it
    const handIndex = this.getCurrentPlayerIndex();
    this.hands[handIndex].add(this.visibleCard);

    this.visibleCard = null;
    this.setMessage(this.currentPlayer.nickname + discardMessage);
  }

  // NOTE: User button - 'Draw from Deck'
  public drawFromDeck() {
    // Get current user's hand and add card from deck to it
    const handIndex = this.getCurrentPlayerIndex();
    this.hands[handIndex].add(this.deck.pop());

    // Remind user to discard
    this.setMessage(this.currentPlayer.nickname + discardMessage);
  }

  // NOTE: User needs to communicate discard card
  // TODO: break up this method to re-use pieces in endRound
  public discardAfterTurn(card: Card) {
    // Get current user's hand
    const handIndex = this.getCurrentPlayerIndex();

    try {
      // Remove specified card and set it to visibleCard
      this.visibleCard = this.hands[handIndex].remove(card);

      // Set up for next player turn
      this.setNextCurrentPlayer();
    } catch (CardNotFoundError) {
      // If error, set message so player can try again
      this.setMessage(invalidDiscardMessage);
    }
  }

  // NOTE: User needs to communicate discard and intention to 'Go out'
  // TODO: Tests
  public endRound(discard: Card) {
    // Get current user's hand
    const handIndex = this.getCurrentPlayerIndex();

    try {
      // Go out or not, user's discard becomes visibleCard
      this.visibleCard = this.hands[handIndex].remove(discard);

      // evaluate user's hand - if invalid, round continues
      const penalty = this.hands[handIndex].evaluateHand(this.game.round);

      if(penalty > 0) {
        // This user can't go out
        // Send this user message that they can't go out
        // Prompt next player to play
      }
      // Update user score
      // Display user's hand

      // set end_of_round = true: all other users get only one more turn
      // after each discard(), evaluate each of their hands and calculate score
      // after last user has discarded, start next round
    } catch(err) {
      // Deal with it
    } finally {
      // What do we need here?
    }
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
        this.hands[j].add(this.deck.pop());
      }
    }
  }

  /**
   * Rotate first player to draw based on round
   * TODO: make private after testing - set up rewire
   */
  public setFirstPlayerForRound() {
    const userCount = this.game.players.length;
    const corrective = Math.abs(Game.STARTING_ROUND - userCount);
    const currentPlayerIndex = (this.game.round + corrective) % userCount;
    this.currentPlayer = this.game.players[currentPlayerIndex];
    this.setMessage(this.currentPlayer.nickname + drawMessage);
  }

  private setNextCurrentPlayer() {
    const currentPlayerIndex = this.getCurrentPlayerIndex();
    // Set next player to current and update message message
    this.currentPlayer = this.game.players[currentPlayerIndex + 1];
    this.setMessage(this.currentPlayer.nickname + drawMessage);
  }

  public getCurrentPlayerIndex(): number {
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
