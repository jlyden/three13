import chai from 'chai';
import _ from 'lodash';
import { Card, Hand, User } from '../../src/models';

const { expect } = chai;

// Setup
const testHand = new Hand();
const cardOne = new Card('Diamonds', 13);
const cardTwo = new Card('Spades', 4);
const cardThree = new Card('Diamonds', 4);

describe('hand methods', () => {
  // Setup for discard and toString
  let handWithOneCard: Hand;
  let handWithTwoCards: Hand;

  describe('add', () => {
    it('adds a card to an empty hand', () => {
      testHand.add(cardOne);
      handWithOneCard = _.cloneDeep(testHand);  

      expect(testHand.getCards().length).to.equal(1);
    });

    it('adds cards to non-empty hand', () => {
      testHand.add(cardTwo);
      handWithTwoCards = _.cloneDeep(testHand);
      testHand.add(cardThree);    

      expect(testHand.getCards().length).to.equal(3);
    });
  });

  describe('toString', () => {
    it('returns the expected three card hand', () => {
      const expected = '[<King of Diamonds>, <4 of Spades>, <4 of Diamonds>]';
      expect(testHand.toString()).to.equal(expected);
    });

    it('returns the expected two card hand', () => {
      const expected = '[<King of Diamonds>, <4 of Spades>]';
      expect(handWithTwoCards.toString()).to.equal(expected);
    });

    it('returns the expected three card hand', () => {
      const expected = '[<King of Diamonds>]';
      expect(handWithOneCard.toString()).to.equal(expected);
    });
  });

  describe('remove', () => {
    it('throws error when trying to remove a card not in hand', () => {
      const badDiscard = new Card('Spades', 5);
      const expectedError = 'Attempted discard <5 of Spades> not in hand.';
      expect(testHand.remove.bind(testHand, badDiscard)).to.throw(expectedError);
      expect(testHand.getCards().length).to.equal(3);
      });

    it('removes a card and leaves two behind', () => {
      const discardThree = testHand.remove(cardThree);
      expect(testHand).to.deep.equal(handWithTwoCards);
      expect(testHand.getCards().length).to.equal(2);
      expect(discardThree).to.deep.equal(cardThree);
    });

    it('removes a card and leaves one behind', () => {
      const discardTwo = testHand.remove(cardTwo);
      expect(testHand).to.deep.equal(handWithOneCard);
      expect(testHand.getCards().length).to.equal(1);
      expect(discardTwo).to.deep.equal(cardTwo);
    });

    it('removes a card and leaves an empty hand', () => {
      const emptyHand = new Hand();
      const discardOne = testHand.remove(cardOne);
      expect(testHand).to.deep.equal(emptyHand);
      expect(testHand.getCards().length).to.equal(0);
      expect(discardOne).to.deep.equal(cardOne);
    });
  });

  describe('evaluateHand', () => {
    // TODO:
  });

  describe('getFilteredCards', () => {
    // TODO:
  });

  describe('getWildCards', () => {
    // TODO:
  });

  describe('sortValuesIntoRuns', () => {
    // TODO:
  });

  describe('processRuns', () => {
    // TODO:
  });

  describe('transformRunArrayIntoCardArray', () => {
    // TODO:
  });

  describe('removeProcessedCardsFromHand', () => {
    // TODO:
  });
});