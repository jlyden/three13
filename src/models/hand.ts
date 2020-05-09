import { Card, User } from './index';
import _ from 'lodash';

export class Hand {
  public hand: Card[];

  constructor() {
    this.hand = [];
  }

  public toString() {
    let stringHand = '[';
    if (this.hand.length > 0) {
      // tslint:disable-next-line: forin
      for (const card in this.hand) {
        stringHand += `${this.hand[card].toString()}, `;
      }
    }
    if (stringHand.slice(-2) === ', ') {
      stringHand = stringHand.substring(0, stringHand.length - 2);
    }
    stringHand += ']';
    return stringHand;
  }

  public add(card: Card) {
    this.hand.push(card);
  }

  public discard(card: Card): Card {
    const cardIndex = _.findIndex(this.hand, {
      suit: card.suit,
      value: card.value,
    });
    
    // If card is in hand, remove and return it
    if(cardIndex !== -1) {
      const discardArray = _.pullAt(this.hand, [cardIndex]);
      return discardArray[0];
    } else {
      throw new Error(`Attempted discard ${card.toString()} not in hand.`);
    }
  }

  /**
   * Ensure this is a valid 313 hand
   * @param round - current round of game, b/c that determines which cards are wild
   */
  public validate(round: number) {
    // Considerations: Jokers can be anything; Wild card can be anything
    // note wild cards based on round
    


  }

}
