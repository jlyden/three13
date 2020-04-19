import * as chai from 'chai';
import 'mocha';
import { Deck } from "../../src/models/deck";

const { expect } = chai;

describe("deck class methods", function() {
  describe("assemble deck", function() {
    it("generates a deck of cards with 44 members", function() {
      let testDeck = new Deck();
      expect(testDeck.deck.length).to.equal(44);
    });

    it("generates a deck with 11 cards for each of 4 suits", function() {
      let testDeck = new Deck();

      let groupBySuit = testDeck.deck.reduce((tally, card) => {
        tally[card.suit] = tally[card.suit] + 1 || 1;
        return tally;
      }, {});
      let arrayOfSuitCounts = Object.values(groupBySuit);
      let arrayOfSuits = Object.keys(groupBySuit);

      expect(arrayOfSuitCounts.length).to.equal(4);
      expect(arrayOfSuitCounts).to.deep.equal([11,11,11,11]);
      expect(arrayOfSuits).to.have.members(['Clubs','Diamonds','Hearts','Spades']);
    });

    it("generates a deck with 4 (of different suits) cards for each number/face card", function() {
      let testDeck = new Deck();

      let groupByValue = testDeck.deck.reduce((tally, card) => {
        tally[card.value] = tally[card.value] + 1 || 1;
        return tally;
      }, {});

      let arrayOfValueCounts = Object.values(groupByValue);
      let arrayOfValues = Object.keys(groupByValue);
      expect(arrayOfValueCounts.length).to.equal(11);
      expect(arrayOfValueCounts).to.deep.equal([4,4,4,4,4,4,4,4,4,4,4]);
      expect(arrayOfValues).to.have.members(['3','4','5','6','7','8','9','10','11','12','13']);
    });
  });
/*
  describe("shuffle deck", function() {

  });

  describe("deal from deck", function() {

  });
*/
})