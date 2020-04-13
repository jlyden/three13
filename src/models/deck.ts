// Based on https://wsvincent.com/javascript-object-oriented-deck-cards/

export class Deck{
  public suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  public values = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  private deck: Object[];
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

    for (let suit in this.suits) {
      for (let value in this.values) {
        this.deck.push(`{
          suit: ${this.suits[suit]},
          value: ${this.values[value]}
        }`);
      }
    }
  }

  toString() {

  }
}
