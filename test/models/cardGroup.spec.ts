import chai from 'chai';
import forEach from 'mocha-each';
import _ from 'lodash';
import { CardGroup } from '../../src/models';
import { CardNotFoundError } from '../../src/errors';
import { cardJ3, cardD4, cardD5, cardD6, cardD13, cardH13, cardS5, cardD3 } from '../common/testData';

const { expect } = chai;

describe('CardGroup methods', () => {
  const emptyGroup = new CardGroup();
  const groupWithOneCard = new CardGroup([cardJ3]);
  const groupWithTwoCards = new CardGroup([cardJ3, cardD4]);
  const groupWithThreeCards = new CardGroup([cardJ3, cardD4, cardD5]);
  const groupWithSixCards = new CardGroup([cardJ3, cardD4, cardD5, cardD6, cardD13, cardH13]);

  describe('toString', () => {
    it('returns the expected empty card group', () => {
      const expected = '[]';
      expect(emptyGroup.toString()).to.equal(expected);
    });

    it('returns the expected three card group', () => {
      const expected = '[<Joker>, <4 of Diamonds>, <5 of Diamonds>]';
      expect(groupWithThreeCards.toString()).to.equal(expected);
    });

    it('returns the expected two card group', () => {
      const expected = '[<Joker>, <4 of Diamonds>]';
      expect(groupWithTwoCards.toString()).to.equal(expected);
    });

    it('returns the expected three card group', () => {
      const expected = '[<Joker>]';
      expect(groupWithOneCard.toString()).to.equal(expected);
    });
  });

  describe('getCardAt', () => {
    const testCases = [
      [0, cardJ3],
      [1, cardD4],
      [2, cardD5],
    ];

    forEach(testCases).it('returns correct card for index %d', (index, card) => {
      expect(groupWithThreeCards.getCardAt(index)).to.deep.equal(card);
    });
  });

  describe('getCards', () => {
    describe('gets cards from group with cards', () => {
      const expectedCards = [cardJ3, cardD4, cardD5];
      expect(groupWithThreeCards.getCards()).to.deep.equal(expectedCards);
    });

    describe('gets no cards from group without cards', () => {
      expect(emptyGroup.getCards()).to.deep.equal([]);
    });
  });

  describe('length', () => {
    it('returns expected lengths of cardGroups', () => {
      expect(emptyGroup.length()).to.equal(0);
      expect(groupWithOneCard.length()).to.equal(1);
      expect(groupWithTwoCards.length()).to.equal(2);
      expect(groupWithThreeCards.length()).to.equal(3);
    });
  });

  describe('pop', () => {
    const popTestHand = _.cloneDeep(groupWithThreeCards);

    it('pops the final element from the group', () => {
      const lastCardInGroup = popTestHand.pop();
      const expectedCardOne = cardD5;
      expect(popTestHand.getCards().length).to.equal(2);
      expect(lastCardInGroup).to.deep.equal(expectedCardOne);
    });

    it('pops element -2 from deck', () => {
      const secondLastCardInGroup = popTestHand.pop();
      const expectedCardOne = cardD4;
      expect(popTestHand.getCards().length).to.equal(1);
      expect(secondLastCardInGroup).to.deep.equal(expectedCardOne);
    });

    it('pops element -3 from deck', () => {
      const thirdLastCardInGroup = popTestHand.pop();
      const expectedCardOne = cardJ3;
      expect(popTestHand.getCards().length).to.equal(0);
      expect(thirdLastCardInGroup).to.deep.equal(expectedCardOne);
    });
  });

  describe('add', () => {
    it('adds a card to an empty group', () => {
      const testGroup = new CardGroup();
      testGroup.add(cardJ3);
      expect(testGroup).to.deep.equal(groupWithOneCard);
    });

    it('adds cards to non-empty group', () => {
      const testGroup = new CardGroup([cardJ3]);
      testGroup.add(cardD4);
      expect(testGroup).to.deep.equal(groupWithTwoCards);
    });
  });

  describe('addMany', () => {
    it('addsMany cards to empty Group', () => {
      const testGroup = new CardGroup();
      testGroup.addMany([cardJ3, cardD4]);
      expect(testGroup).to.deep.equal(groupWithTwoCards);
    });

    it('addsMany cards to non-empty Group', () => {
      const testGroup = new CardGroup([cardJ3]);
      testGroup.addMany([cardD4, cardD5]);
      expect(testGroup).to.deep.equal(groupWithThreeCards);
    });
  });

  describe('remove', () => {
    it('throws error when trying to remove a card not in group', () => {
      const badDiscard = cardS5;
      const expectedMessage = '<5 of Spades> not in group.';
      expect(() => groupWithThreeCards.remove(badDiscard)).to.throw(CardNotFoundError);
      expect(() => groupWithThreeCards.remove(badDiscard)).to.throw(expectedMessage);
      expect(groupWithThreeCards.getCards().length).to.equal(3);
    });

    it('removes a card and leaves two behind', () => {
      const testGroupWith3 = _.cloneDeep(groupWithThreeCards);
      const discardThree = testGroupWith3.remove(cardD5);
      expect(testGroupWith3).to.deep.equal(groupWithTwoCards);
      expect(discardThree).to.deep.equal(cardD5);
    });

    it('removes a card and leaves one behind', () => {
      const testGroupWith2 = _.cloneDeep(groupWithTwoCards);
      const discardTwo = testGroupWith2.remove(cardD4);
      expect(testGroupWith2).to.deep.equal(groupWithOneCard);
      expect(discardTwo).to.deep.equal(cardD4);
    });

    it('removes a card and leaves an empty group', () => {
      const testGroupWith1 = _.cloneDeep(groupWithOneCard);
      const discardOne = testGroupWith1.remove(cardJ3);
      expect(testGroupWith1).to.deep.equal(emptyGroup);
      expect(discardOne).to.deep.equal(cardJ3);
    });
  });

  describe('removeMany - removes none if error', () => {
    const errorMessage = 'At least one card to remove not in group';
    const badDiscard1 = cardS5;
    const badDiscard2 = cardD3;
    const goodDiscard1 = cardJ3;
    const goodDiscard2 = cardD4;
    const firstArrayToRemove = [cardH13, cardD13, cardD6];
    const secondArrayToRemove = [cardJ3, cardD4, cardD5];
    let removeArray: CardGroup;

    it('throws error if first card in array is not in group, and removes none', () => {
      const testGroupDiscardFirst = _.cloneDeep(groupWithSixCards);
      const discardArray = [badDiscard1, goodDiscard1];
      expect(() => testGroupDiscardFirst.removeMany(discardArray)).to.throw(CardNotFoundError);
      expect(() => testGroupDiscardFirst.removeMany(discardArray)).to.throw(errorMessage);
      expect(testGroupDiscardFirst.getCards().length).to.equal(6);
    });

    it('throws error if second card in array is not in group, and removes none', () => {
      const testGroupDiscardSecond = _.cloneDeep(groupWithSixCards);
      const discardArray = [goodDiscard1, badDiscard1];
      expect(() => testGroupDiscardSecond.removeMany(discardArray)).to.throw(CardNotFoundError);
      expect(() => testGroupDiscardSecond.removeMany(discardArray)).to.throw(errorMessage);
      expect(testGroupDiscardSecond.getCards().length).to.equal(6);
    });

    it('throws error if middle card is not in group, and removes none', () => {
      const testGroupDiscardMiddle = _.cloneDeep(groupWithSixCards);
      const discardArray = [goodDiscard1, badDiscard1, goodDiscard2];
      expect(() => testGroupDiscardMiddle.removeMany(discardArray)).to.throw(CardNotFoundError);
      expect(() => testGroupDiscardMiddle.removeMany(discardArray)).to.throw(errorMessage);
      expect(testGroupDiscardMiddle.getCards().length).to.equal(6);
    });

    it('throws error if multiple cards are not in group, and removes none', () => {
      const testGroupDiscardTwo = _.cloneDeep(groupWithSixCards);
      const discardArray = [goodDiscard1, badDiscard1, goodDiscard2, badDiscard2];
      expect(() => testGroupDiscardTwo.removeMany(discardArray)).to.throw(CardNotFoundError);
      expect(() => testGroupDiscardTwo.removeMany(discardArray)).to.throw(errorMessage);
      expect(testGroupDiscardTwo.getCards().length).to.equal(6);
    });

    it('removes expected cards from group, leaving others', () => {
      removeArray = _.cloneDeep(groupWithSixCards);
      removeArray.removeMany(firstArrayToRemove);
      expect(removeArray.getCards()).to.deep.equal(secondArrayToRemove);
    });

    it('removes expected cards from group, leaving none', () => {
      removeArray.removeMany(secondArrayToRemove);
      expect(removeArray.getCards()).to.deep.equal([]);
    });
  });

  describe('move', () => {
    it('moves a card to an empty target CardGroup', () => {
      const sourceTwoCards = _.cloneDeep(groupWithTwoCards);
      const expectedTarget = new CardGroup([cardD4]);
      const originalTarget = new CardGroup();
      sourceTwoCards.move(cardD4, originalTarget);
      // Source group should not have card, but Target should
      expect(sourceTwoCards).to.deep.equal(groupWithOneCard);
      expect(originalTarget).to.deep.equal(expectedTarget);
    });

    it('moves a card to a target CardGroup with a card', () => {
      const sourceTwoCards = _.cloneDeep(groupWithTwoCards);
      const expectedSource = new CardGroup([cardD4]);
      const expectedTarget = new CardGroup([cardH13, cardJ3]);
      const originalTarget = new CardGroup([cardH13]);
      sourceTwoCards.move(cardJ3, originalTarget);
      // Source group should not have card, but Target should
      expect(sourceTwoCards).to.deep.equal(expectedSource);
      expect(originalTarget).to.deep.equal(expectedTarget);
    });

    it('moves a card from a source CardGroup left empty afterwards', () => {
      const sourceOneCard = _.cloneDeep(groupWithOneCard);
      const expectedTarget = new CardGroup([cardD4, cardD5, cardJ3]);
      const originalTarget = new CardGroup([cardD4, cardD5]);
      sourceOneCard.move(cardJ3, originalTarget);
      // Source group should not have card, but Target should
      expect(sourceOneCard).to.deep.equal(emptyGroup);
      expect(originalTarget).to.deep.equal(expectedTarget);
    });

    it('throws error when trying to move a card not in source CardGroup', () => {
      const sourceOneCard = _.cloneDeep(groupWithOneCard);
      expect(() => sourceOneCard.move(cardH13, emptyGroup)).to.throw(CardNotFoundError);
      expect(emptyGroup.length()).to.equal(0);
    });
  });

  describe('moveGroupToGroupArray', () => {
    const sourceSixCards = _.cloneDeep(groupWithSixCards);
    const targetGroupArray: CardGroup[] = [];
    const firstGroupToRemove = new CardGroup([cardH13, cardD13, cardD6]);
    const secondGroupToRemove = new CardGroup([cardJ3, cardD4, cardD5]);

    it('moves a group to an empty target group arry', () => {
      const expectedTarget = [firstGroupToRemove];
      sourceSixCards.moveGroupToGroupArray(firstGroupToRemove, targetGroupArray);
      // Source group should not have cards, but Target Array should have the group
      expect(sourceSixCards).to.deep.equal(secondGroupToRemove);
      expect(targetGroupArray).to.deep.equal(expectedTarget);
    });

    it('moves a group to a target group array with a group, leaving source empty', () => {
      const expectedTarget = [firstGroupToRemove, secondGroupToRemove];
      sourceSixCards.moveGroupToGroupArray(secondGroupToRemove, targetGroupArray);
      // Source group should not have card, but Target should
      expect(sourceSixCards).to.deep.equal(emptyGroup);
      expect(targetGroupArray).to.deep.equal(expectedTarget);
    });

    it('throws error when trying to move a source group where one card not in group', () => {
      const errorSourceSixCards = _.cloneDeep(groupWithSixCards);
      const errorTargetGroupArray: CardGroup[] = [];
      const errorGroupToRemove = new CardGroup([cardD3, cardD4, cardD5]);
      expect(() => errorSourceSixCards.moveGroupToGroupArray(errorGroupToRemove, errorTargetGroupArray)).to.throw(
        CardNotFoundError,
      );
      expect(errorTargetGroupArray.length).to.equal(0);
    });
  });
});
