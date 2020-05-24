import chai from 'chai';
import _ from 'lodash';
import { Card, Deck } from '../../src/models';
import { reduceCardsByValue } from '../../src/utils/cardUtils';

const { expect } = chai;

describe('deck methods', () => {
  describe('shuffle', () => {
    it('mixes up a deck of cards', () => {
      const testDeck = new Deck();
      const beforeDeck = _.cloneDeep(testDeck);
      testDeck.shuffle();
      expect(testDeck).to.not.deep.equal(beforeDeck);
    });
  });

  describe('assemble', () => {
    const testDeck = new Deck();

    it('generates a deck of cards with 46 members', () => {
      expect(testDeck.getCards().length).to.equal(46);
    });

    it('generates a deck with 11 cards for each of 4 suits, plus 2 Jokers', () => {
      const reducedSuits: { [key: string]: number } = testDeck
        .getCards()
        .reduce((tally: { [key: string]: number }, card: Card) => {
          tally[card.suit] = tally[card.suit] + 1 || 1;
          return tally;
        }, {});
      const arrayOfSuitCounts: number[] = Object.values(reducedSuits);
      const arrayOfSuits: string[] = Object.keys(reducedSuits);

      expect(arrayOfSuitCounts.length).to.equal(5);
      expect(arrayOfSuits).to.have.members(['Clubs', 'Diamonds', 'Hearts', 'Spades', 'Joker']);
      expect(arrayOfSuitCounts).to.deep.equal([11, 11, 11, 11, 2]);
    });

    it('generates a deck with 4 (of different suits) cards for each number/face card plus 2 Jokers', () => {
      const testDeckCards = testDeck.getCards();
      const testDeckReducedArray = reduceCardsByValue(testDeckCards);
      const arrayOfValueCounts: number[] = Object.values(testDeckReducedArray);
      const arrayOfValues: string[] = Object.keys(testDeckReducedArray);

      expect(arrayOfValueCounts.length).to.equal(11);
      // Because of how we handle Jokers, there are 5 '3' and 5 '4' cards
      expect(arrayOfValueCounts).to.deep.equal([5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
      expect(arrayOfValues).to.have.members(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);
    });
  });
});
