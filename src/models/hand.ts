import { Card } from './index';

export class Hand {

  public hand: Card[];

  constructor() {
    this.hand = [];
  }

  public add(card: Card) {
    this.hand.push(card);
  }

  public discard(card: Card) {
    
  }

}