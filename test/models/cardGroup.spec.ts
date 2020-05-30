import chai from 'chai';
import _ from 'lodash';
import { Card, Deck, Hand, Suit } from '../../src/models';
import {
  cardJ,
  cardD4,
  cardD5,
  cardD6,
  cardD13,
  cardH13,
  cardS3,
  cardS4,
  cardS5,
  cardS6,
  cardS8,
  cardS9,
  cardS10,
} from '../common/testData';


const { expect } = chai;

// Setup
const hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);

describe('CardGroup methods', () => {
  // Setup for discard and toString
  const genericTestHand = new Hand();
  let handWithOneCard: Hand;
  let handWithTwoCards: Hand;

  describe('add', () => {
    it('adds a card to an empty hand', () => {
      genericTestHand.add(cardJ);
      handWithOneCard = _.cloneDeep(genericTestHand);

      expect(genericTestHand.getCards().length).to.equal(1);
    });

    it('adds cards to non-empty hand', () => {
      genericTestHand.add(cardD4);
      handWithTwoCards = _.cloneDeep(genericTestHand);
      genericTestHand.add(cardD5);

      expect(genericTestHand.getCards().length).to.equal(3);
    });
  });

  describe('toString', () => {
    it('returns the expected three card hand', () => {
      const expected = '[<Joker>, <4 of Diamonds>, <5 of Diamonds>]';
      expect(genericTestHand.toString()).to.equal(expected);
    });

    it('returns the expected two card hand', () => {
      const expected = '[<Joker>, <4 of Diamonds>]';
      expect(handWithTwoCards.toString()).to.equal(expected);
    });

    it('returns the expected three card hand', () => {
      const expected = '[<Joker>]';
      expect(handWithOneCard.toString()).to.equal(expected);
    });
  });

  describe('remove', () => {
    it('throws error when trying to remove a card not in hand', () => {
      const badDiscard = new Card(Suit.Spades, 5);
      const expectedError = 'Remove Error: <5 of Spades> not in group.';
      expect(() => genericTestHand.remove(badDiscard)).to.throw(expectedError);
      expect(genericTestHand.getCards().length).to.equal(3);
    });

    it('removes a card and leaves two behind', () => {
      const discardThree = genericTestHand.remove(cardD5);
      expect(genericTestHand).to.deep.equal(handWithTwoCards);
      expect(genericTestHand.getCards().length).to.equal(2);
      expect(discardThree).to.deep.equal(cardD5);
    });

    it('removes a card and leaves one behind', () => {
      const discardTwo = genericTestHand.remove(cardD4);
      expect(genericTestHand).to.deep.equal(handWithOneCard);
      expect(genericTestHand.getCards().length).to.equal(1);
      expect(discardTwo).to.deep.equal(cardD4);
    });

    it('removes a card and leaves an empty hand', () => {
      const emptyHand = new Hand();
      const discardOne = genericTestHand.remove(cardJ);
      expect(genericTestHand).to.deep.equal(emptyHand);
      expect(genericTestHand.getCards().length).to.equal(0);
      expect(discardOne).to.deep.equal(cardJ);
    });
  });


  describe('pop', () => {
    const testDeck = new Deck();

    it('removes the final element from the deck - Joker', () => {
      const dealtCardOne = testDeck.pop();
      const expectedCardOne = new Card(Suit.Joker, 4);
      expect(testDeck.getCards().length).to.equal(45);
      expect(dealtCardOne).to.deep.equal(expectedCardOne);
    });

    it('remove element -2 from deck', () => {
      const dealtCardTwo = testDeck.pop();
      const expectedCardTwo = new Card(Suit.Joker, 3);
      expect(testDeck.getCards().length).to.equal(44);
      expect(dealtCardTwo).to.deep.equal(expectedCardTwo);
    });

    it('remove element -3 from deck', () => {
      const dealtCardThree = testDeck.pop();
      const expectedCardThree = new Card(Suit.Spades, 13);
      expect(testDeck.getCards().length).to.equal(43);
      expect(dealtCardThree).to.deep.equal(expectedCardThree);
    });
  });


  describe('removeMany', () => {
    const removeArrayTestHand = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13]);
    const firstArrayToRemove = [cardH13, cardD13, cardD6];
    const secondArrayToRemove = [cardJ, cardD4, cardD5];

    it('removes expected cards from hand, leaving others', () => {
      removeArrayTestHand.removeMany(firstArrayToRemove);
      expect(removeArrayTestHand.getCards().length).to.equal(3);
      expect(removeArrayTestHand.getCards()).to.deep.equal(secondArrayToRemove);
    });

    it('removes expected cards from hand, leaving none', () => {
      removeArrayTestHand.removeMany(secondArrayToRemove);
      expect(removeArrayTestHand.getCards().length).to.equal(0);
      expect(removeArrayTestHand.getCards()).to.deep.equal([]);
    });
  });


});
