import chai from 'chai';
import _ from 'lodash';
import { Card, Hand } from '../../src/models';
import { sortValuesIntoRuns } from '../../src/utils';
import { cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, 
  cardS3, cardS4, cardS5, cardS6, cardS8, cardS9, cardS10 } from '../common/testData';

const { expect } = chai;

// Setup
const hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, 
  cardS3, cardS4, cardS5, cardS6, cardS9]);

describe('hand methods', () => {
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
      const badDiscard = new Card('Spades', 5);
      const expectedError = 'Attempted discard <5 of Spades> not in hand.';
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
      const hand11CardsDiamondsCopy = _.cloneDeep(hand11Cards);
      const cardsOfSuit = hand11CardsDiamondsCopy.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand11CardsDiamondsCopy.getCards().length;

      // Act
      hand11CardsDiamondsCopy.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hand11CardsDiamondsCopy.getProcessedCards()).to.deep.equal([[cardD4, cardD5, cardD6]]);
      expect(hand11CardsDiamondsCopy.getLongRuns()).to.deep.equal([]);
      expect(hand11CardsDiamondsCopy.getLeftovers()).to.deep.equal([cardD13]);
      expect(hand11CardsDiamondsCopy.getCards()).to.deep.equal([cardJ, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);
    });

    it('correctly processes sortedRuns where run.length > 3 with Joker', () => {
      // Arrange
      const suit = 'Spades';
      const hand11CardsSpadesCopy = _.cloneDeep(hand11Cards);
      const cardsOfSuit = hand11CardsSpadesCopy.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand11CardsSpadesCopy.getCards().length;

      // Act
      hand11CardsSpadesCopy.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hand11CardsSpadesCopy.getProcessedCards()).to.deep.equal([]);
      expect(hand11CardsSpadesCopy.getLongRuns()).to.deep.equal([[cardS3, cardS4, cardS5, cardS6]]);
      expect(hand11CardsSpadesCopy.getLeftovers()).to.deep.equal([cardS9]);
      expect(hand11CardsSpadesCopy.getCards()).to.deep.equal([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13]);
    });

    it('correctly processes sortedRuns where run.length < 3 with Joker', () => {
      // Arrange
      const suit = 'Diamonds';
      const handRunLowWithWilds = new Hand([cardJ, cardD4, cardD5, cardH13]);
      const cardsOfSuit = handRunLowWithWilds.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = handRunLowWithWilds.getCards().length;

      // Act 
      handRunLowWithWilds.processRuns(suit, sortedRuns, round);

      // Assert
      expect(handRunLowWithWilds.getProcessedCards()).to.deep.equal([[cardD4, cardD5, cardJ]]);
      expect(handRunLowWithWilds.getLongRuns()).to.deep.equal([]);
      expect(handRunLowWithWilds.getLeftovers()).to.deep.equal([]);
      expect(handRunLowWithWilds.getCards()).to.deep.equal([cardH13]);
      });

    it('correctly processes sortedRuns where run.length === 3 no wilds', () => {
      // Arrange
      const suit = 'Diamonds';
      const hand8CardsDiamonds = _.cloneDeep(hand11Cards);
      hand8CardsDiamonds.remove(cardD13);
      hand8CardsDiamonds.remove(cardJ);
      hand8CardsDiamonds.remove(cardS3);
      const cardsOfSuit = hand8CardsDiamonds.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand8CardsDiamonds.getCards().length;

      // Act 
      hand8CardsDiamonds.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hand8CardsDiamonds.getProcessedCards()).to.deep.equal([[cardD4, cardD5, cardD6]]);
      expect(hand8CardsDiamonds.getLongRuns()).to.deep.equal([]);
      expect(hand8CardsDiamonds.getLeftovers()).to.deep.equal([]);
      expect(hand8CardsDiamonds.getCards()).to.deep.equal([cardH13, cardS4, cardS5, cardS6, cardS9]);
    });

    it('correctly processes sortedRuns where run.length > 3 no wilds', () => {
      // Arrange
      const suit = 'Spades';
      const hand8CardsSpades = _.cloneDeep(hand11Cards);
      hand8CardsSpades.remove(cardD4);
      hand8CardsSpades.remove(cardD13);
      hand8CardsSpades.remove(cardJ);
      const cardsOfSuit = hand8CardsSpades.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand8CardsSpades.getCards().length;

      // Act 
      hand8CardsSpades.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hand8CardsSpades.getProcessedCards()).to.deep.equal([]);
      expect(hand8CardsSpades.getLongRuns()).to.deep.equal([[cardS3, cardS4, cardS5, cardS6]]);
      expect(hand8CardsSpades.getLeftovers()).to.deep.equal([cardS9]);
      expect(hand8CardsSpades.getCards()).to.deep.equal([cardD5, cardD6, cardH13]);
      });

    it('correctly processes sortedRuns where run.length < 3 no wilds', () => {
      // Arrange
      const suit = 'Diamonds';
      const handRunLowNoWilds = new Hand([cardD4, cardD5, cardH13]);
      const cardsOfSuit = handRunLowNoWilds.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = handRunLowNoWilds.getCards().length;

      // Act 
      handRunLowNoWilds.processRuns(suit, sortedRuns, round);

      // Assert
      expect(handRunLowNoWilds.getProcessedCards()).to.deep.equal([]);
      expect(handRunLowNoWilds.getLongRuns()).to.deep.equal([]);
      expect(handRunLowNoWilds.getLeftovers()).to.deep.equal([cardD4, cardD5]);
      expect(handRunLowNoWilds.getCards()).to.deep.equal([cardH13]);
    });

    it('correctly processes sortedRuns where there are two 3-card runs, no wilds', () => {
      // Arrange
      const suit = 'Spades';
      const hard7CardsSpades = new Hand([cardH13, cardS3, cardS4, cardS5, cardS8, cardS9, cardS10]);
      const cardsOfSuit = hard7CardsSpades.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard7CardsSpades.getCards().length;

      // Act 
      hard7CardsSpades.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hard7CardsSpades.getProcessedCards()).to.deep.equal([[cardS3, cardS4, cardS5], [cardS8, cardS9, cardS10]]);
      expect(hard7CardsSpades.getLongRuns()).to.deep.equal([]);
      expect(hard7CardsSpades.getLeftovers()).to.deep.equal([]);
      expect(hard7CardsSpades.getCards()).to.deep.equal([cardH13]);
    });

    it('correctly processes sortedRuns where there are two runs, 3 & 4 cards, no wilds', () => {
      // Arrange
      const suit = 'Spades';
      const hard8CardsSpades = new Hand([cardH13, cardS3, cardS4, cardS5, cardS6, cardS8, cardS9, cardS10]);
      const cardsOfSuit = hard8CardsSpades.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard8CardsSpades.getCards().length;

      // Act 
      hard8CardsSpades.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hard8CardsSpades.getProcessedCards()).to.deep.equal([[cardS8, cardS9, cardS10]]);
      expect(hard8CardsSpades.getLongRuns()).to.deep.equal([[cardS3, cardS4, cardS5, cardS6]]);
      expect(hard8CardsSpades.getLeftovers()).to.deep.equal([]);
      expect(hard8CardsSpades.getCards()).to.deep.equal([cardH13]);
    });

    it('correctly processes sortedRuns where there is one run, one almost run, two wilds', () => {
      // Arrange
      const suit = 'Spades';
      const hard8CardsSpadesJoker = new Hand([cardH13, cardS3, cardS4, cardS5, cardS6, cardS8, cardS9, cardJ]);
      const cardsOfSuit = hard8CardsSpadesJoker.getFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard8CardsSpadesJoker.getCards().length;

      // Act 
      hard8CardsSpadesJoker.processRuns(suit, sortedRuns, round);

      // Assert
      expect(hard8CardsSpadesJoker.getProcessedCards()).to.deep.equal([[cardS8, cardS9, cardJ]]);
      expect(hard8CardsSpadesJoker.getLongRuns()).to.deep.equal([[cardS3, cardS4, cardS5, cardS6]]);
      expect(hard8CardsSpadesJoker.getLeftovers()).to.deep.equal([]);
      expect(hard8CardsSpadesJoker.getCards()).to.deep.equal([cardH13]);
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
