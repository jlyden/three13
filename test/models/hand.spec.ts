import chai from 'chai';
import _ from 'lodash';
import { Card, Hand, CardGroup, Suit } from '../../src/models';
import { sortValuesIntoRuns } from '../../src/utils';
import {
  cardJ,
  cardC3,
  cardD3,
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

const hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);

describe('Hand methods', () => {

  describe('evaluateHand', () => {
    it('moves all cards from hand to processed cards when they are all wild', () => {
      const wildGroup = new CardGroup([cardJ, cardC3, cardD3]);
      const wildHand = new Hand([cardJ, cardC3, cardD3]);
      const round = wildHand.length();

      wildHand.evaluateHand(round);

      // tslint:disable-next-line: no-unused-expression
      expect(wildHand.getCards()).to.be.empty;
      expect(wildHand.processedCards).to.deep.equal([wildGroup]);
    });

    it('does not move cards from hand to processed when not all wild', () => {
      const setGroup = new CardGroup([cardC3, cardD3, cardJ]);
      const someHand = new Hand([cardJ, cardC3, cardD3, cardH13]);
      const round = someHand.length();

      someHand.evaluateHand(round);

      // tslint:disable-next-line: no-unused-expression
      expect(someHand.getCards()).to.deep.equal([cardH13]);
      expect(someHand.processedCards).to.deep.equal([setGroup]);
    });

    // TODO: Still need to check runs, sets, eval, etc
  });

  describe('findFilteredCards', () => {
    it('returns single card filtered by suit', () => {
      const expected = new CardGroup([cardH13]);
      expect(hand11Cards.findFilteredCards(Suit.Hearts)).to.deep.equal(expected);
    });

    it('returns multiple cards filtered by suit', () => {
      const expected = new CardGroup([cardD4, cardD5, cardD6, cardD13]);
      expect(hand11Cards.findFilteredCards(Suit.Diamonds)).to.deep.equal(expected);
    });

    it('returns empty when hand has none of that suit', () => {
      const expected = new CardGroup();
      expect(hand11Cards.findFilteredCards(Suit.Clubs)).to.deep.equal(expected);
    });

    it('returns single card filtered by value', () => {
      const expected = new CardGroup([cardS9]);
      expect(hand11Cards.findFilteredCards(9)).to.deep.equal(expected);
    });

    it('returns multiple cards filtered by value', () => {
      const expected = new CardGroup([cardD5, cardS5]);
      expect(hand11Cards.findFilteredCards(5)).to.deep.equal(expected);
    });

    it('returns empty when hand has none of that value', () => {
      const expected = new CardGroup();
      expect(hand11Cards.findFilteredCards(11)).to.deep.equal(expected);
    });
  });

  describe('findWildCards', () => {
    it('returns wild cards without round wilds', () => {
      const round = 11;
      const expected = new CardGroup([cardJ]);
      expect(hand11Cards.findWildCards(round)).to.deep.equal(expected);
    });

    it('returns wild cards including round wilds', () => {
      const round = 4;
      const expected = new CardGroup([cardJ, cardD4, cardS4]);
      expect(hand11Cards.findWildCards(round)).to.deep.equal(expected);
    });

    it('returns wild cards without jokers', () => {
      const round = 6;
      const handNoJoker = new Hand([cardH13, cardD6, cardS6, cardS9]);
      const expected = new CardGroup([cardD6, cardS6]);
      expect(handNoJoker.findWildCards(round)).to.deep.equal(expected);
    });

    it('returns empty when hand has no wilds', () => {
      const round = 12;
      const handNoWilds = new Hand([cardH13, cardD6, cardS6, cardS9]);
      const expected = new CardGroup();
      expect(handNoWilds.findWildCards(round)).to.deep.equal(expected);
    });
  });

  describe('processRunsFromHand', () => {
    it('correctly processes sortedRuns where run.length === 3 with Joker', () => {
      // Arrange
      const suit = Suit.Diamonds;
      const hand11CardsDiamondsCopy = _.cloneDeep(hand11Cards);
      const cardsOfSuit = hand11CardsDiamondsCopy.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand11CardsDiamondsCopy.getCards().length;
      const expectedRun = new CardGroup([cardD4, cardD5, cardD6]);
      const remainingHand = new CardGroup([cardJ, cardD13, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);

      // Act
      hand11CardsDiamondsCopy.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hand11CardsDiamondsCopy.processedCards).to.deep.equal([expectedRun]);
      expect(hand11CardsDiamondsCopy.longRuns).to.deep.equal([]);
      expect(hand11CardsDiamondsCopy.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where run.length > 3 with Joker', () => {
      // Arrange
      const suit = Suit.Spades;
      const hand11CardsSpadesCopy = _.cloneDeep(hand11Cards);
      const cardsOfSuit = hand11CardsSpadesCopy.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand11CardsSpadesCopy.getCards().length;
      const expectedRun = new CardGroup([cardS3, cardS4, cardS5, cardS6]);
      const remainingHand = new CardGroup([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, cardS9]);

      // Act
      hand11CardsSpadesCopy.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hand11CardsSpadesCopy.processedCards).to.deep.equal([]);
      expect(hand11CardsSpadesCopy.longRuns).to.deep.equal([expectedRun]);
      expect(hand11CardsSpadesCopy.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where run.length < 3 with Joker', () => {
      // Arrange
      const suit = Suit.Diamonds;
      const handRunLowWithWilds = new Hand([cardJ, cardD5, cardD6, cardH13]);
      const cardsOfSuit = handRunLowWithWilds.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = handRunLowWithWilds.getCards().length;
      const expectedRun = new CardGroup([cardD5, cardD6, cardJ]);
      const remainingHand = new CardGroup([cardH13]);

      // Act
      handRunLowWithWilds.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(handRunLowWithWilds.processedCards).to.deep.equal([expectedRun]);
      expect(handRunLowWithWilds.longRuns).to.deep.equal([]);
      expect(handRunLowWithWilds.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where run.length === 3 no wilds', () => {
      // Arrange
      const suit = Suit.Diamonds;
      const hand8CardsDiamonds = _.cloneDeep(hand11Cards);
      hand8CardsDiamonds.removeMany([cardD13, cardJ, cardS3]);
      const cardsOfSuit = hand8CardsDiamonds.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand8CardsDiamonds.getCards().length;
      const expectedRun = new CardGroup([cardD4, cardD5, cardD6]);
      const remainingHand = new CardGroup([cardH13, cardS4, cardS5, cardS6, cardS9]);

      // Act
      hand8CardsDiamonds.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hand8CardsDiamonds.processedCards).to.deep.equal([expectedRun]);
      expect(hand8CardsDiamonds.longRuns).to.deep.equal([]);
      expect(hand8CardsDiamonds.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where run.length > 3 no wilds', () => {
      // Arrange
      const suit = Suit.Spades;
      const hand8CardsSpades = _.cloneDeep(hand11Cards);
      hand8CardsSpades.removeMany([cardD4, cardD13, cardJ]);
      const cardsOfSuit = hand8CardsSpades.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hand8CardsSpades.getCards().length;
      const expectedRun = new CardGroup([cardS3, cardS4, cardS5, cardS6]);
      const remainingHand = new CardGroup([cardD5, cardD6, cardH13, cardS9]);

      // Act
      hand8CardsSpades.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hand8CardsSpades.processedCards).to.deep.equal([]);
      expect(hand8CardsSpades.longRuns).to.deep.equal([expectedRun]);
      expect(hand8CardsSpades.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where run.length < 3 no wilds', () => {
      // Arrange
      const suit = Suit.Diamonds;
      const handRunLowNoWilds = new Hand([cardD4, cardD5, cardH13]);
      const cardsOfSuit = handRunLowNoWilds.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = handRunLowNoWilds.getCards().length;
      const remainingHand = new CardGroup([cardD4, cardD5, cardH13]);

      // Act
      handRunLowNoWilds.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(handRunLowNoWilds.processedCards).to.deep.equal([]);
      expect(handRunLowNoWilds.longRuns).to.deep.equal([]);
      expect(handRunLowNoWilds.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where there are two 3-card runs, no wilds', () => {
      // Arrange
      const suit = Suit.Spades;
      const hard7CardsSpades = new Hand([cardH13, cardS3, cardS4, cardS5, cardS8, cardS9, cardS10]);
      const cardsOfSuit = hard7CardsSpades.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard7CardsSpades.getCards().length;
      const expectedRunOne = new CardGroup([cardS3, cardS4, cardS5]);
      const expectedRunTwo = new CardGroup([cardS8, cardS9, cardS10]);
      const remainingHand = new CardGroup([cardH13]);

      // Act
      hard7CardsSpades.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hard7CardsSpades.processedCards).to.deep.equal([expectedRunOne, expectedRunTwo]);
      expect(hard7CardsSpades.longRuns).to.deep.equal([]);
      expect(hard7CardsSpades.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where there are two runs, 3 & 4 cards, no wilds', () => {
      // Arrange
      const suit = Suit.Spades;
      const hard8CardsSpades = new Hand([cardH13, cardS3, cardS4, cardS5, cardS6, cardS8, cardS9, cardS10]);
      const cardsOfSuit = hard8CardsSpades.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard8CardsSpades.getCards().length;
      const expectedRun = new CardGroup([cardS8, cardS9, cardS10]);
      const expectedLongRun = new CardGroup([cardS3, cardS4, cardS5, cardS6]);
      const remainingHand = new CardGroup([cardH13]);

      // Act
      hard8CardsSpades.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hard8CardsSpades.processedCards).to.deep.equal([expectedRun]);
      expect(hard8CardsSpades.longRuns).to.deep.equal([expectedLongRun]);
      expect(hard8CardsSpades.getCards()).to.deep.equal(remainingHand.getCards());
    });

    it('correctly processes sortedRuns where there is one run, one almost run, two wilds', () => {
      // Arrange
      const cardD8 = new Card(Suit.Diamonds, 8);
      const suit = Suit.Spades;
      const hard8CardsSpadesJoker = new Hand([cardD8, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9, cardJ]);
      const cardsOfSuit = hard8CardsSpadesJoker.findFilteredCards(suit);
      const sortedRuns = sortValuesIntoRuns(cardsOfSuit);
      const round = hard8CardsSpadesJoker.getCards().length;
      const expectedRun = new CardGroup([cardS9, cardD8, cardJ]);
      const expectedLongRun = new CardGroup([cardS3, cardS4, cardS5, cardS6]);
      const remainingHand = new CardGroup([cardH13]);

      // Act
      hard8CardsSpadesJoker.removeValidRunsFromHand(round, sortedRuns, suit);

      // Assert
      expect(hard8CardsSpadesJoker.processedCards).to.deep.equal([expectedRun]);
      expect(hard8CardsSpadesJoker.longRuns).to.deep.equal([expectedLongRun]);
      expect(hard8CardsSpadesJoker.getCards()).to.deep.equal(remainingHand.getCards());
    });

    // TODO: More tests with more wilds, esp in middle of runs
  });
});
