import chai from 'chai';
import 'mocha';
import _ from 'lodash';
import { Card, Deck } from '../../src/models';

const { expect } = chai;

describe('deck class methods', () => {
  describe('assemble', () => {
    it('generates a deck of cards with 46 members', () => {
      const testDeck = new Deck();
      expect(testDeck.deck.length).to.equal(46);
    });

    it('generates a deck with 11 cards for each of 4 suits, plus 2 Jokers', () => {
      const testDeck = new Deck();

      const groupBySuit: { [key: string]: number }  = testDeck.deck.reduce(
        (tally: { [key: string]: number }, card) => {
        tally[card.suit] = tally[card.suit] + 1 || 1;
        return tally;
      }, {});
      const arrayOfSuitCounts: number[] = Object.values(groupBySuit);
      const arrayOfSuits: string[] = Object.keys(groupBySuit);

      expect(arrayOfSuitCounts.length).to.equal(5);
      expect(arrayOfSuits).to.have.members(['Clubs','Diamonds','Hearts','Spades','Joker']);
      expect(arrayOfSuitCounts).to.deep.equal([11,11,11,11,2]);
    });

    it('generates a deck with 4 (of different suits) cards for each number/face card plus 2 Jokers', () => {
      const testDeck = new Deck();

      const groupByValue: { [key: string]: number }  = testDeck.deck.reduce(
        (tally: { [key: string]: number }, card) => {
        tally[card.value] = tally[card.value] + 1 || 1;
        return tally;
      }, {});

      const arrayOfValueCounts: number[] = Object.values(groupByValue);
      const arrayOfValues: string[] = Object.keys(groupByValue);
      expect(arrayOfValueCounts.length).to.equal(11);
      // Because of how we handle Jokers, there are 5 '3' and 5 '4' cards
      expect(arrayOfValueCounts).to.deep.equal([5,5,4,4,4,4,4,4,4,4,4]);
      expect(arrayOfValues).to.have.members(['3','4','5','6','7','8','9','10','11','12','13']);
    });
  });

  describe('shuffle', () => {
    it('mixes up a deck of cards', () => {
      const testDeck = new Deck();
      const beforeDeck = _.cloneDeep(testDeck);
      testDeck.shuffle();
      expect(testDeck).to.not.deep.equal(beforeDeck);
    });
  });

  describe('dealOneCard', () => {
    it('removes the final element from the deck', () => {
      const testDeck = new Deck();
      const dealtCard = testDeck.dealOneCard();
      const expectedCard = new Card('Joker', 4);
      expect(testDeck.deck.length).to.equal(45);
      expect(dealtCard).to.deep.equal(expectedCard);
    });
  });
})