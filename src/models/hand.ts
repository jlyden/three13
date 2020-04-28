import { Card } from './index';
import _ from 'lodash';

export class Hand {
  public hand: Card[];

  constructor() {
    this.hand = [];
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
