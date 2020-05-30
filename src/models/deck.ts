import { Card, CardGroup, Suit } from '../models';

// Based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck extends CardGroup {
  constructor() {
    super();
    this.assemble();
  }

  public shuffle(): Deck {
    const { group } = this;

    // Start with end of deck
    let cardCountdown = this.length();
    let cardToSwap: number;

    while (cardCountdown) {
      // Get value from front of deck
      cardToSwap = Math.floor(Math.random() * cardCountdown--);

      // and swap with value from end of deck
      [group[cardCountdown], group[cardToSwap]] = [group[cardToSwap], group[cardCountdown]];
    }

    return this;
  }

  private assemble(): Deck {
    for (const suit of Object.values(Suit)) {
      if (suit !== Suit.Joker) {
        // tslint:disable-next-line: forin
        for (const value of Card.VALUES) {
          const card = new Card(suit, value);
          this.addMany([card]);
        }
      }
    }
    // Add two Jokers, this is 313
    this.addMany([new Card(Suit.Joker, 3)]);
    this.addMany([new Card(Suit.Joker, 4)]);
    return this;
  }
}
