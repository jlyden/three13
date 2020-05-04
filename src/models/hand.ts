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

  public discard(card: Card) {
    const cardIndex = _.findIndex(this.hand, {
      suit: card.suit,
      value: card.value,
    });
    const discardArray = _.pullAt(this.hand, [cardIndex]);
    return discardArray[0];
  }
}
