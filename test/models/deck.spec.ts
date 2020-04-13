import * as chai from 'chai';
import 'mocha';
import {Deck} from "../../src/models/deck";

const { expect } = chai;

let testDeck = new Deck();

describe("deck class methods", function() {
  describe("reset deck", function() {
    it("generates a deck of cards with 44 members", function() {
      expect(testDeck.length).to.deep.equal(44);
    });

    it("generates a deck with 11 cards for each of 4 suits", function() {
      let groupBySuit = testDeck.reduce((acc, it) => {
        acc[it.suit] = acc[it.suit] + 1 || 1;
        return acc;
      }, {});
      let arrayOfSuitCounts = groupBySuit.map(obj => {
        return obj.value;
      })
      let arrayOfSuits = groupBySuit.map(obj => {
        return obj.key;
      })
      expect(arrayOfSuitCounts.length).to.equal(4);
      expect(arrayOfSuitCounts).to.deep.equal([11,11,11,11]);
      expect(arrayOfSuits).to.have.members(['Clubs','Diamonds','Hearts','Spades']);
    });

    it("generates a deck with 4 (of different suits) cards for each number/face card", function() {
      let groupByValue = testDeck.reduce((acc, it) => {
        acc[it.value] = acc[it.value] + 1 || 1;
        return acc;
      }, {});
      let arrayOfValueCounts = groupByValue.map(obj => {
        return obj.value;
      })
      let arrayOfValues = groupByValue.map(obj => {
        return obj.key;
      })
      expect(arrayOfValueCounts.length).to.equal(11);
      expect(arrayOfValueCounts).to.deep.equal([4,4,4,4,4,4,4,4,4,4,4]);
      expect(arrayOfValues).to.have.members([3,4,5,6,7,8,9,10,11,12,13]);
    });
  });

  describe("shuffle deck", function() {

  });

  describe("deal from deck", function() {

  });
})