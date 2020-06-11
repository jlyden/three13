import chai from 'chai';
import forEach from 'mocha-each';
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
  cardD3,
} from '../common/testData';

const { expect } = chai;

// Setup
const hand11Cards = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13, cardS3, cardS4, cardS5, cardS6, cardS9]);

describe('CardGroup methods', () => {
  const handWithOneCard = new Hand([cardJ]);
  const handWithTwoCards = new Hand([cardJ, cardD4]);
  const handWithThreeCards = new Hand([cardJ, cardD4, cardD5]);

  describe('toString', () => {
    it('returns the expected three card hand', () => {
      const expected = '[<Joker>, <4 of Diamonds>, <5 of Diamonds>]';
      expect(handWithThreeCards.toString()).to.equal(expected);
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

  describe('getCardAt', () => {
    const testCases = [
      [0, cardJ],
      [1, cardD4],
      [2, cardD5]
    ];

    forEach(testCases)
      .it('returns correct card for index %d', (index, card) => {
        expect(handWithThreeCards.getCardAt(index)).to.deep.equal(card);
      });
  });

  describe('getCards', () => {
    describe('gets cards from hand with cards', () => {
      const expectedCards = [cardJ, cardD4, cardD5];
      expect(handWithThreeCards.getCards()).to.deep.equal(expectedCards);
    });

    describe('gets cards from hand without cards', () => {
      const expectedEmtpySet: Card[] = [];
      const emptyHand = new Hand();
      expect(emptyHand.getCards()).to.deep.equal(expectedEmtpySet);
    });
  });

  describe('length', () => {
    it('returns expected lengths of cardGroups', () => {
      const emptyHand = new Hand();
      expect(emptyHand.length()).to.equal(0);
      expect(handWithOneCard.length()).to.equal(1);
      expect(handWithTwoCards.length()).to.equal(2);
      expect(handWithThreeCards.length()).to.equal(3);
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

  describe('add', () => {
    it('adds a card to an empty hand', () => {
      const testHand = new Hand();
      testHand.add(cardJ);
      expect(testHand).to.deep.equal(handWithOneCard);
    });

    it('adds cards to non-empty hand', () => {
      const testHand = new Hand([cardJ]);
      testHand.add(cardD4);
      expect(testHand).to.deep.equal(handWithTwoCards);
    });
  });

  describe('addMany', () => {
    it('addsMany cards to empty Hand', () => {
      const testHand = new Hand();
      testHand.addMany([cardJ, cardD4]);
      expect(testHand).to.deep.equal(handWithTwoCards);
    });

    it('addsMany cards to empty Hand', () => {
      const testHand = new Hand([cardJ]);
      testHand.addMany([cardD4, cardD5]);
      expect(testHand).to.deep.equal(handWithThreeCards);
    });
  });

  describe('remove', () => {
    it('throws error when trying to remove a card not in group', () => {
      const badDiscard = cardS5;
      const expectedError = 'Remove Error: <5 of Spades> not in group.';
      expect(() => handWithThreeCards.remove(badDiscard)).to.throw(expectedError);
      expect(handWithThreeCards.getCards().length).to.equal(3);
    });

    it('removes a card and leaves two behind', () => {
      const testHandWith3 = _.cloneDeep(handWithThreeCards);
      const discardThree = testHandWith3.remove(cardD5);
      expect(testHandWith3).to.deep.equal(handWithTwoCards);
      expect(discardThree).to.deep.equal(cardD5);
    });

    it('removes a card and leaves one behind', () => {
      const testHandWith2 = _.cloneDeep(handWithTwoCards);
      const discardTwo = testHandWith2.remove(cardD4);
      expect(testHandWith2).to.deep.equal(handWithOneCard);
      expect(discardTwo).to.deep.equal(cardD4);
    });

    it('removes a card and leaves an empty hand', () => {
      const testHandWith1 = _.cloneDeep(handWithOneCard);
      const emptyHand = new Hand();
      const discardOne = testHandWith1.remove(cardJ);
      expect(testHandWith1).to.deep.equal(emptyHand);
      expect(discardOne).to.deep.equal(cardJ);
    });
  });

  describe('removeMany - removes none if error', () => {
    const notFoundError = 'One card to remove is not in group';
    const badDiscard1 = cardS5;
    const badDiscard2 = cardD3;
    const goodDiscard1 = cardJ
    const goodDiscard2 = cardD4;
    const removeArrayTestHand = new Hand([cardJ, cardD4, cardD5, cardD6, cardD13, cardH13]);
    const firstArrayToRemove = [cardH13, cardD13, cardD6];
    const secondArrayToRemove = [cardJ, cardD4, cardD5];
    let removeArray: Hand;

    it('throws error if first card in array is not in group, and removes none', () => {
      const testHandDiscardFirst = _.cloneDeep(removeArrayTestHand);
      const discardArray = [badDiscard1, goodDiscard1]
      expect(() => testHandDiscardFirst.removeMany(discardArray)).to.throw(notFoundError);
      expect(testHandDiscardFirst.getCards().length).to.equal(6);
    });

    it('throws error if second card in array is not in group, and removes none', () => {
      const testHandDiscardSecond = _.cloneDeep(removeArrayTestHand);
      const discardArray = [goodDiscard1, badDiscard1]
      expect(() => testHandDiscardSecond.removeMany(discardArray)).to.throw(notFoundError);
      expect(testHandDiscardSecond.getCards().length).to.equal(6);
    });

    it('throws error if middle card is not in group, and removes none', () => {
      const testHandDiscardMiddle = _.cloneDeep(removeArrayTestHand);
      const discardArray = [goodDiscard1, badDiscard1, goodDiscard2]
      expect(() => testHandDiscardMiddle.removeMany(discardArray)).to.throw(notFoundError);
      expect(testHandDiscardMiddle.getCards().length).to.equal(6);
    });

    it('throws error if multiple cards are not in group, and removes none', () => {
      const testHandDiscardTwo = _.cloneDeep(removeArrayTestHand);
      const discardArray = [goodDiscard1, badDiscard1, goodDiscard2, badDiscard2]
      expect(() => testHandDiscardTwo.removeMany(discardArray)).to.throw(notFoundError);
      expect(testHandDiscardTwo.getCards().length).to.equal(6);
    });

    it('removes expected cards from hand, leaving others', () => {
      removeArray = _.cloneDeep(removeArrayTestHand);
      removeArray.removeMany(firstArrayToRemove);
      expect(removeArray.getCards()).to.deep.equal(secondArrayToRemove);
    });

    it('removes expected cards from hand, leaving none', () => {
      removeArray.removeMany(secondArrayToRemove);
      expect(removeArray.getCards()).to.deep.equal([]);
    });
  });

  describe('move', () => {
    // TODO
    // TODO: Error
});

  describe('moveGroup', () => {
    // TODO
    // TODO: Error
  });

  describe('moveGroupToGroupArray', () => {
    // TODO
    // TODO: Error
  });
});
