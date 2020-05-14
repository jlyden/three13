import chai from 'chai';
import _ from 'lodash';
import { Card, Hand } from '../../src/models';
import { sortValuesIntoRuns } from '../../src/utils';

const { expect } = chai;

// Setup
const genericTestHand = new Hand();
const cardJ = new Card('Joker', 3);
const cardD4 = new Card('Diamonds', 4);
const cardD5 = new Card('Diamonds', 5);
const cardD6 = new Card('Diamonds', 6);
const cardD13 = new Card('Diamonds', 13);
const cardH13 = new Card('Hearts', 13);
const cardS3 = new Card('Spades', 3);
const cardS4 = new Card('Spades', 4);
const cardS5 = new Card('Spades', 5);
const cardS6 = new Card('Spades', 6);
const cardS9 = new Card('Spades', 9);
const hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);

describe('hand methods', () => {
  // Setup for discard and toString
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
      const badDiscard = new Card('Spades', 5);
      const expectedError = 'Attempted discard <5 of Spades> not in hand.';
      expect(genericTestHand.remove.bind(genericTestHand, badDiscard)).to.throw(expectedError);
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

  describe('evaluateHand', () => {
    // TODO:
  });

  describe('getFilteredCards', () => {
    it('returns single card filtered by suit', () => {
      const expected: Card[] = [cardH13];
      expect(hand11Cards.getFilteredCards('Hearts')).to.deep.equal(expected);
    });

    it('returns multiple cards filtered by suit', () => {
      const expected: Card[] = [cardD4, cardD5, cardD6, cardD13];
      expect(hand11Cards.getFilteredCards('Diamonds')).to.deep.equal(expected);
    });

    it('returns empty when hand has none of that suit', () => {
      const expected: Card[] = [];
      expect(hand11Cards.getFilteredCards('Clubs')).to.deep.equal(expected);
    });

    it('returns single card filtered by value', () => {
      const expected: Card[] = [cardS9];
      expect(hand11Cards.getFilteredCards(9)).to.deep.equal(expected);
    });

    it('returns multiple cards filtered by value', () => {
      const expected: Card[] = [cardD5, cardS5];
      expect(hand11Cards.getFilteredCards(5)).to.deep.equal(expected);
    });

    it('returns empty when hand has none of that value', () => {
      const expected: Card[] = [];
      expect(hand11Cards.getFilteredCards(11)).to.deep.equal(expected);
    });
  });

  describe('getWildCards', () => {
    it('returns wild cards without round wilds', () => {
      const expected: Card[] = [cardJ];
      expect(hand11Cards.getWildCards(11)).to.deep.equal(expected);
    });

    it('returns wild cards including round wilds', () => {
      const expected: Card[] = [cardJ, cardD4, cardS4];
      expect(hand11Cards.getWildCards(4)).to.deep.equal(expected);
    });

    it('returns wild cards without jokers', () => {
      const handNoJoker = new Hand([cardH13, cardD6, cardS6, cardS9]);
      const expected: Card[] = [cardD6, cardS6];
      expect(handNoJoker.getWildCards(6)).to.deep.equal(expected);
    });

    it('returns empty when hand has no wilds', () => {
      const handNoWilds = new Hand([cardH13, cardD6, cardS6, cardS9]);
      const expected: Card[] = [];
      expect(handNoWilds.getWildCards(12)).to.deep.equal(expected);
    });
  });

  describe('processRuns', () => {
    it('correctly processes sortedRuns where run.length === 3 with Joker', () => {
      // Arrange
      const suit = 'Diamonds';
      const hand11CardsCopy = _.cloneDeep(hand11Cards);
      const cardsOfSuit = hand11CardsCopy.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = 10;

      // Act
      hand11CardsCopy.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hand11CardsCopy.getProcessedCards()).to.deep.equal([[cardD4, cardD5, cardD6]]);
      expect(hand11CardsCopy.getLongRuns()).to.deep.equal([]);
      expect(hand11CardsCopy.getLeftovers()).to.deep.equal([cardD13]);
      expect(hand11CardsCopy.getCards()).to.deep.equal([cardJ, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);
    });

    it('correctly processes sortedRuns where run.length > 3 with Joker', () => {
      //      hand11Cards, Spades, sort
      /*
      processedCards, longRuns, leftovers
      hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, 
        cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);
        */
    });

    it('correctly processes sortedRuns where run.length === 3 no wilds', () => {
      //      hand11Cards, Diamonds, sort
    });

    it('correctly processes sortedRuns where run.length > 3 no wilds', () => {
      //      hand11Cards, Spades, sort
    });

    it('correctly processes sortedRuns where run.length < 3 no wilds', () => {
      const handRunLowWithWilds = new Hand([cardJ, cardD4, cardD5, cardH13]);
      //      handRunLowWithWilds, Diamonds, sort, Round 9
    });

    it('correctly processes sortedRuns where run.length < 3 with Round Wild', () => {
      const handRunLowWithWilds = new Hand([cardJ, cardD4, cardD5, cardH13]);
      //      handRunLowWithWilds, Hearts, sort, ROund 4
    });

    it('correctly processes sortedRuns where run.length < 3 without wilds', () => {
      const handRunLowNoWilds = new Hand([cardJ, cardD4, cardD5, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);
      //      handRunLowWithWilds, Diamonds, sort, ROund 10
    });
  });

  describe('removeCardArrayFromHand', () => {
    const removeArrayTestHand = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13]);
    const firstArrayToRemove = [cardH13, cardD13, cardD6];
    const secondArrayToRemove = [cardJ, cardD4, cardD5];

    it('removes expected cards from hand, leaving others', () => {
      removeArrayTestHand.removeCardArrayFromHand(firstArrayToRemove);
      expect(removeArrayTestHand.getCards().length).to.equal(3);
      expect(removeArrayTestHand.getCards()).to.deep.equal(secondArrayToRemove);
    });

    it('removes expected cards from hand, leaving none', () => {
      removeArrayTestHand.removeCardArrayFromHand(secondArrayToRemove);
      expect(removeArrayTestHand.getCards().length).to.equal(0);
      expect(removeArrayTestHand.getCards()).to.deep.equal([]);
    });
  });
});
