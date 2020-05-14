import { Card } from '../models';
import { transformRunArrayIntoCardArray, sortValuesIntoRuns } from '../utils';
import _ from 'lodash';

export class Hand {
  // A run or multiple set must have at least 3 cards in it
  static MINIMUM_SET = 3;

  private cards: Card[];

  // Variables for evaluating the hand at end of game
  private processedCards: Card[][];
  private longRuns: Card[][];
  private leftovers: Card[];

  constructor(cardsToAdd?: Card[]) {
    if (cardsToAdd) {
      this.cards = cardsToAdd;
    } else {
      this.cards = [];
    }

    this.processedCards = [];
    this.longRuns = [];
    this.leftovers = [];
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getProcessedCards(): Card[][] {
    return this.processedCards;
  }

  public getLongRuns(): Card[][] {
    return this.longRuns;
  }

  public getLeftovers(): Card[] {
    return this.leftovers;
  }

  public toString() {
    let stringHand = '[';
    if (this.cards.length > 0) {
      // tslint:disable-next-line: forin
      for (const card in this.cards) {
        stringHand += `${this.cards[card].toString()}, `;
      }
    }
    if (stringHand.slice(-2) === ', ') {
      stringHand = stringHand.substring(0, stringHand.length - 2);
    }
    stringHand += ']';
    return stringHand;
  }

  public add(card: Card) {
    this.cards.push(card);
  }

  public remove(card: Card): Card {
    const cardIndex = _.findIndex(this.cards, {
      suit: card.suit,
      value: card.value,
    });

    // If card is in hand, remove and return it
    if (cardIndex !== -1) {
      const removeArray = _.pullAt(this.cards, [cardIndex]);
      return removeArray[0];
    } else {
      throw new Error(`Attempted discard ${card.toString()} not in hand.`);
    }
  }

  /**
   * Ensure this is a valid 313 hand
   * @param round - current round of game, b/c that determines which cards are wild
   */
  public evaluateHand(round: number) {
    // Look for runs within each suit
    Card.suits.forEach((suit) => {
      const cardsOfSuit = this.getFilteredCards(suit);

      // If there are at least 3 cards in the suit
      if (cardsOfSuit.length >= Hand.MINIMUM_SET) {
        // Sort cards into consecutive runs (of whatever length)
        const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
        this.processRuns(suit, sortedRuns, round);
      } else {
        // If too few cards in suit for a run, add cards to leftovers
        cardsOfSuit.forEach((card) => {
          this.leftovers.push(card);
        });
      }

      // Look for sets in 'leftovers'
      // check leftovers for sets of duplicate numbers
      // (twice in case of buried last cards)

      // calculate penalty
    });
  }

  /**
   * Returns new array of cards matching the param
   * @param matcher 'value' or 'suit' to be filtered on
   *
   * TODO: Make private, use rewire for testing
   */
  public getFilteredCards(matcher: string | number): Card[] {
    let matchingArray: Card[];
    if (typeof matcher === 'string') {
      matchingArray = _.filter(this.cards, {
        suit: matcher,
      });
    } else if (typeof matcher === 'number') {
      matchingArray = _.filter(this.cards, {
        value: matcher,
      });
    }
    return matchingArray;
  }

  /**
   * @param round - cards where value === round are wild, as are Jokers
   * @return array of Wild Cards
   *
   * TODO: Make private, use rewire for testing
   */
  public getWildCards(round: number): Card[] {
    return this.getFilteredCards('Joker').concat(this.getFilteredCards(round));
  }

  /**
   * For all runs in suit,
   *  - adds valid 3 card runs to processed cards
   *  - adds valid 4+ card runs to long runs
   *  - attempts to supplement 1 or 2 card runs with wilds (and add to processed)
   *  - dump whatever remains into leftovers for later set processing
   *
   * @param suit to which all cards in runs belong
   * @param sortedRuns consecutive runs of integers
   * @param round current game round
   *
   * TODO: Make private, use rewire for testing
   */
  public processRuns(suit: string, sortedRuns: number[][], round: number) {
    sortedRuns.forEach((run) => {
      if (run.length === Hand.MINIMUM_SET) {
        // If 3 card run, move to processed
        const cardArray = transformRunArrayIntoCardArray(run, suit);
        this.processedCards.push(cardArray);
        this.removeCardArrayFromHand(cardArray);
      } else if (run.length > Hand.MINIMUM_SET) {
        // If greater than 3 card run, move to longRuns to help with sets later
        const cardArray = transformRunArrayIntoCardArray(run, suit);
        this.longRuns.push(cardArray);
        this.removeCardArrayFromHand(cardArray);
      } else {
        // If less than 3 card run, check if missing cards can be made up from wilds
        const missingCardCount = Hand.MINIMUM_SET - run.length;
        const wildCards: Card[] = this.getWildCards(round);
        if (wildCards.length >= missingCardCount) {
          // Build card array from what you have
          const cardArray = transformRunArrayIntoCardArray(run, suit);

          // Add the wild cards needed to make up what is missing
          for (let i = 0; i < missingCardCount; i++) {
            cardArray.push(wildCards[i]);
          }

          // Add set with wilds to processed Cards as with 3 card run above
          this.processedCards.push(cardArray);
          this.removeCardArrayFromHand(cardArray);
        } else {
          // But if there aren't enough wilds to help, throw in leftovers to help with sets later
          run.forEach((value) => {
            const cardToRemove: Card = new Card(suit, value);
            this.leftovers.push(cardToRemove);
            this.remove(cardToRemove);
          });
        }
      }
    });
  }

  // TODO: Make private, use rewire for testing
  public removeCardArrayFromHand(cardArray: Card[]) {
    cardArray.forEach((card) => {
      this.remove(card);
    });
  }
}
