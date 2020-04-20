import * as chai from 'chai';
import * as _ from 'lodash';
import 'mocha';
import { Deck } from "../../src/models/deck";
import { Card } from '../../src/models';

const { expect } = chai;

describe("deck class methods", function() {
  describe("assemble", function() {
    it("generates a deck of cards with 44 members", function() {
      let testDeck = new Deck();
      expect(testDeck.deck.length).to.equal(44);
    });

    it("generates a deck with 11 cards for each of 4 suits", function() {
      let testDeck = new Deck();

      const groupBySuit: { [key: string]: number }  = testDeck.deck.reduce(
        (tally: { [key: string]: number }, card) => {
        tally[card.suit] = tally[card.suit] + 1 || 1;
        return tally;
      }, {});
      const arrayOfSuitCounts: number[] = Object.values(groupBySuit);
      const arrayOfSuits: string[] = Object.keys(groupBySuit);

      expect(arrayOfSuitCounts.length).to.equal(4);
      expect(arrayOfSuitCounts).to.deep.equal([11,11,11,11]);
      expect(arrayOfSuits).to.have.members(['Clubs','Diamonds','Hearts','Spades']);
    });

    it("generates a deck with 4 (of different suits) cards for each number/face card", function() {
      let testDeck = new Deck();

      const groupByValue: { [key: string]: number }  = testDeck.deck.reduce(
        (tally: { [key: string]: number }, card) => {
        tally[card.value] = tally[card.value] + 1 || 1;
        return tally;
      }, {});

      let arrayOfValueCounts: number[] = Object.values(groupByValue);
      let arrayOfValues: string[] = Object.keys(groupByValue);
      expect(arrayOfValueCounts.length).to.equal(11);
      expect(arrayOfValueCounts).to.deep.equal([4,4,4,4,4,4,4,4,4,4,4]);
      expect(arrayOfValues).to.have.members(['3','4','5','6','7','8','9','10','11','12','13']);
    });
  });

  describe("shuffle", function() {
    it("mixes up a deck of cards", function() {
      let testDeck = new Deck();
      let beforeDeck = _.cloneDeep(testDeck);
      testDeck.shuffle();
      expect(testDeck).to.not.deep.equal(beforeDeck);
    });
  });

  describe("dealOneCard", function() {
    it("removes the final element from the deck", function() {
      let testDeck = new Deck();
      let dealtCard = testDeck.dealOneCard();
      let expectedCard = new Card('Spades', 13);
      expect(testDeck.deck.length).to.equal(43);
      expect(dealtCard).to.deep.equal(expectedCard);
    });
  });
})