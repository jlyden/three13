<?php
  // Modeled on https://wsvincent.com/javascript-object-oriented-deck-cards/
  class Deck {
    private $deck = [];

    private const SUITS = ['C', 'D', 'H', 'S'];
    private const VALUES = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

    public function prepare_deck() {
      $this->deck = [];

      foreach ($SUITS as $suit) {
        foreach ($VALUES as $value) {
          array_push($this->deck, $value . "-" . $suit);
        }
      }
    }

    public function shuffle() {
      // Assign local variable to for readability
      $current_deck = $this->deck;

      // Start with end of deck
      $card_countdown = count($current_deck);

      while($card_countdown > 0) {
        // Get value from front of deck
        $element_to_swap = rand(1,$card_countdown--);

        // and swap with value from end of deck
        $temp_holder = $current_deck[$card_countdown];
        $current_deck[$card_countdown] = $current_deck[$element_to_swap];
        $current_deck[$element_to_swap] = $temp_holder;
      }
    }

    public function deal() {
      return array_pop($this->deck);
    }
  }
?>
