import _ from 'lodash';

export class Card {
  suit: string;
  value: number;

  static SUITS: string[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'Joker'];
  static VALUES: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor(suit: string, value: number) {
    if (Card.SUITS.includes(suit) && Card.VALUES.includes(value)) {
      this.suit = suit;
      this.value = value;
    } else {
      throw new Error(`Invalid suit or value: ${suit}, ${value}`);
    }
  }

  public toString() {
    if (this.suit === 'Joker') {
      return '<' + this.suit + '>';
    }
    let cardValue: string;
    switch (this.value) {
      case 11:
        cardValue = 'Jack';
        break;
      case 12:
        cardValue = 'Queen';
        break;
      case 13:
        cardValue = 'King';
        break;
      default:
        cardValue = this.value.toString();
        break;
    }
    return `<${cardValue} of ${this.suit}>`;
  }
}
