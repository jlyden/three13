import { Card } from './index';

// Based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck {
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

    // tslint:disable-next-line: forin
    for (const suit in Card.suits) {
      if (Card.suits[suit] !== 'Joker') {
        // tslint:disable-next-line: forin
        for (const value in Card.values) {
          const card = new Card(Card.suits[suit], Card.values[value]);
          this.deck.push(card);
        }
      }
    }
    // Add two Jokers, this is 313
    this.deck.push(new Card('Joker', 3));
    this.deck.push(new Card('Joker', 4));
    return this;
  }
}
