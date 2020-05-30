import _ from 'lodash';

export enum Suit {
  Clubs = 'Clubs', 
  Diamonds = 'Diamonds', 
  Hearts = 'Hearts', 
  Spades = 'Spades', 
  Joker = 'Joker' 
}

export class Card {
  suit: string;
  value: number;

  // TOOD: Suits and Values as enums?
  static VALUES: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor(suit: Suit, value: number) {
    if (value > 2 && value < 14) {
      this.suit = suit;
      this.value = value;
    } else {
      throw new Error(`Invalid suit or value: ${suit}, ${value}`);
    }
  }

  public toString() {
    if (this.suit === Suit.Joker) {
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
