import { Card } from './index';

// Losely based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck{
  static suits: string[] = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static values: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
  public deck: Array<Card>;

  length: any;
  reduce: any;

  constructor(){
    this.deck = [];
    this.assemble();
    this.shuffle();
  }

  public shuffle(){
    const { deck } = this;

    // Start with end of deck
    let card_countdown = deck.length;
    let element_to_swap: number;

    while(card_countdown){
      // Get value from front of deck
      element_to_swap = Math.floor(Math.random() * card_countdown--);

      // and swap with value from end of deck
      [deck[card_countdown], deck[element_to_swap]] = [deck[element_to_swap], deck[card_countdown]];
    }

    return this;
  }

  public deal(){
    return this.deck.pop();
  }

  private assemble(){
    this.deck = [];

    for (let suit in Deck.suits) {
      for (let value in Deck.values) {
        let card = new Card(
          Deck.suits[suit],
          Deck.values[value]
        );
        this.deck.push(card);
      }
    }
  }
}
