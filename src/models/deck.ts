import { Card } from './index';

// Based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck {
  static suits: string[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static values: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  public deck: Card[];

  constructor() {
    this.deck = [];
    this.assemble();
  }

  public shuffle(): Deck {
    const { deck } = this;

    // Start with end of deck
    let cardCountdown = deck.length;
    let cardToSwap: number;

    while (cardCountdown) {
      // Get value from front of deck
      cardToSwap = Math.floor(Math.random() * cardCountdown--);

      // and swap with value from end of deck
      [deck[cardCountdown], deck[cardToSwap]] = [deck[cardToSwap], deck[cardCountdown]];
    }

    return this;
  }

  public dealOneCard() {
    return this.deck.pop();
  }

  private assemble(): Deck {
    this.deck = [];

    for (const suit in Deck.suits) {
      for (const value in Deck.values) {
        const card = new Card(Deck.suits[suit], Deck.values[value]);
        this.deck.push(card);
      }
    }

    return this;
  }
}
