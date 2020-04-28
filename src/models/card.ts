import _ from 'lodash';

export class Card {
  suit: string;
  value: number;

  static suits: string[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static values: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor(suit: string, value: number) {
    if (Card.suits.includes(suit) && Card.values.includes(value)) {
      this.suit = suit;
      this.value = value;
    } else {
      throw new Error(`Invalid suit or value: ${suit}, ${value}`);
    }
  }
}
