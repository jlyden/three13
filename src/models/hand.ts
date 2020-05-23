import _ from 'lodash';
import { Card } from '../models';
import { transformRunArrayIntoCardArray, sortValuesIntoRuns } from '../utils';
import { reduceCardsByValue, removeValueFromArray } from '../../src/utils/cardUtils';

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
    // TODO: Wrap everything to line 105 in method 'processRunsFromHand()'
    // Look for runs within each suit
    for (const suit of Card.SUITS) {
      // Ignore Jokers as 'suit'
      if (suit === 'Joker') {
        continue;
      }

      const cardsOfSuit = this.findFilteredCards(suit);

      // If there are at least 3 cards in the suit
      if (cardsOfSuit.length >= Hand.MINIMUM_SET) {
        // Sort cards into consecutive runs (of whatever length)
        const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
        this.removeValidRunsFromHand(suit, sortedRuns, round);
      } else {
        // If too few cards in suit for a run, add cards to leftovers
        cardsOfSuit.forEach((card) => {
          this.leftovers.push(card);
        });
      }
    };

    // Prepare to process sets
    this.moveLeftoversBackToHand();
    this.processSetsFromHand(round);

    // check leftovers for sets of duplicate numbers
    // (twice ?? in case of buried last cards)

    // calculate penalty based on what remains in leftovers
  }

  /**
   * Returns new array of cards matching the param
   * @param matcher 'value' or 'suit' to be filtered on
   *
   * Note: This does not remove cards from hand
   * TODO: Make private, use rewire for testing
   */
  public findFilteredCards(matcher: string | number): Card[] {
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
   * Note: This does not remove cards from hand
   * TODO: Make private, use rewire for testing
   */
  public findWildCards(round: number): Card[] {
    return this.findFilteredCards('Joker').concat(this.findFilteredCards(round));
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
  public removeValidRunsFromHand(suit: string, sortedRuns: number[][], round: number) {
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
        const wildCards: Card[] = this.findWildCards(round);
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
          // But if there aren't enough wilds to help, throw these cards in leftovers to help with sets later
          run.forEach((value) => {
            const cardToRemove: Card = new Card(suit, value);
            this.moveHandCardToLeftovers(cardToRemove);
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

  // TODO: Make private, use rewire for testing
  public moveLeftoversBackToHand() {
    this.leftovers.forEach((card) => {
      this.add(card);
    });
  }

  /**
   * Runs are already removed from hand, these are just 'leftovers'
   * Sort & group hand by number
   * Remove sets of 3 or 4 cards of same value 
   * Look in long_runs (where run > 3) for completion cards for 1 or 2 card sets
   * Consider wilds to make up what is still missing
   * TODO: Make private, use rewire for testing
   */
  public processSetsFromHand(round: number) {
    // Get hand values excluding wild for round, sorted desc
    const valuesDescWithoutWilds = removeValueFromArray(this.getValuesFromHand(), round);

    // Filter hand by value, but don't consider round wilds
    for (const value of valuesDescWithoutWilds) {
      const cardsOfValue = this.findFilteredCards(value);

      // TODO: There's a lot of repetition here - fix it
      // If set.length >= 3, add to processed cards
      if (cardsOfValue.length >= Hand.MINIMUM_SET) {
        this.processedCards.push(cardsOfValue);
        this.removeCardArrayFromHand(cardsOfValue);
      } else {
        // Look for help in long runs
        const longRunsCount = this.longRuns.length;
        for (let i = 0; i < longRunsCount; i++) {
          const longRunCount = this.longRuns[i].length;
          // Try match higher value first
          if (this.longRuns[i][longRunCount - 1].value === value) {
            // Move card
            const removedCard = _.pullAt(this.longRuns[i], [-1])[0];
            cardsOfValue.push(removedCard);

            // If that finishes the set
            if (cardsOfValue.length === Hand.MINIMUM_SET) {
              // Move set to processed cards
              this.processedCards.push(cardsOfValue);

              // Move long run to processed cards if it's no longer long            
              if (longRunCount - 1 === Hand.MINIMUM_SET) {
                // remove longRun From longRuns
                const removedLongRun = _.pullAt(this.longRuns, i)[0];
                // add longRun to processed
                this.processedCards.push(removedLongRun);
              }
              break;
            }
          } else if (this.longRuns[i][0].value === value) {
            // Move card
            const removedCard = _.pullAt(this.longRuns[i], [0])[0];
            cardsOfValue.push(removedCard);

            // If that finishes the set
            if (cardsOfValue.length === Hand.MINIMUM_SET) {
              // Move set to processed cards
              this.processedCards.push(cardsOfValue);

              // Move long run to processed cards if it's no longer long            
              if (longRunCount - 1 === Hand.MINIMUM_SET) {
                // remove longRun From longRuns
                const removedLongRun = _.pullAt(this.longRuns, i)[0];
                // add longRun to processed
                this.processedCards.push(removedLongRun);
              }
              break;
            }
            // If single value from longRun doesn't complete set, we keep looping
          }
        }
        // QUESTION: if we break after pushing cardsOfValue to processed,
        //           can we still end up here? If so, need to bail
        
        // If we didn't break out, set isn't complete yet - check wilds
        // Find whatever wilds are left
        const wildCards: Card[] = this.findWildCards(round);
        const neededCards = Hand.MINIMUM_SET - cardsOfValue.length;
        // If we have enough wild cards to complete set, do it
        if(wildCards.length >= neededCards) {
          do {
            // move wildcard from hand to cardsOfValue
            const wildCard = this.remove(wildCards.pop());
            cardsOfValue.push(wildCard);
          } while (cardsOfValue.length < Hand.MINIMUM_SET);

          // Now move completed set to processedCards
          this.processedCards.push(cardsOfValue);
        }

        // Same QUESTION as before
        // If we couldn't complete set with longRuns or wilds,
        // push to leftovers for calculations
        cardsOfValue.forEach(card => {
          this.moveHandCardToLeftovers(card);
        });
      }
    }
  }

  // TODO: Make private, use rewire for testing
  public getValuesFromHand() {
    const cardsReducedArray = reduceCardsByValue(this.cards);
    // NOTE: I don't think this array will have 0s in it. check
    const valuesArray = Object.keys(cardsReducedArray).map(v => Number(v));
    valuesArray.sort((a, b) => { return b - a });
    return valuesArray;
  }

  // TODO: Make private, use rewire for testing
  public moveHandCardToLeftovers(card: Card) {
      this.leftovers.push(card);
      this.remove(card);
  }
}
