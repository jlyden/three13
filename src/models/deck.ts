import { Card } from './index';

// Based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck {
  private cards: Card[];

  constructor() {
    this.assemble();
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public shuffle(): Deck {
    const { cards } = this;

    // Start with end of deck
    let cardCountdown = cards.length;
    let cardToSwap: number;

    while (cardCountdown) {
      // Get value from front of deck
      cardToSwap = Math.floor(Math.random() * cardCountdown--);

      // and swap with value from end of deck
      [cards[cardCountdown], cards[cardToSwap]] = [cards[cardToSwap], cards[cardCountdown]];
    }

    return this;
  }

  public dealOneCard() {
    return this.cards.pop();
  }

  private assemble(): Deck {
    this.cards = [];

    // tslint:disable-next-line: forin
    for (const suit in Card.suits) {
      if (Card.suits[suit] !== 'Joker') {
        // tslint:disable-next-line: forin
        for (const value in Card.values) {
          const card = new Card(Card.suits[suit], Card.values[value]);
          this.cards.push(card);
        }
      }
    }
    // Add two Jokers, this is 313
    this.cards.push(new Card('Joker', 3));
    this.cards.push(new Card('Joker', 4));
    return this;
  }
}
