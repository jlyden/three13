import chai from 'chai';
import _ from 'lodash';
import { CardGroup, Suit } from '../../src/models';
import {
  transformRunArrayIntoCardGroup,
  sortValuesIntoRuns,
  reduceCardsByValue,
  removeValueFromArray,
} from '../../src/utils';
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5 } from '../common/testData';

const { expect } = chai;

describe('Utils: CardUtils methods', () => {
  describe('transformRunArrayIntoCardGroup', () => {
    it('properly completes transformation', () => {
      const expectedGroup = new CardGroup([cardS4, cardS5, cardS6]);
      const testSuit = Suit.Spades;
      const testRunArray = [4, 5, 6];

      const actualCardArray = transformRunArrayIntoCardGroup(testRunArray, testSuit);
      expect(actualCardArray).to.deep.equal(expectedGroup);
    });
  });

  describe('sortValuesIntoRuns', () => {
    it('sorts values with one run and one single', () => {
      const spadeGroup = new CardGroup([cardS3, cardS4, cardS5, cardS6, cardS9]);
      const expected = [[3, 4, 5, 6], [9]];
      expect(sortValuesIntoRuns(spadeGroup)).to.deep.equal(expected);
    });

    it('sorts values no consecutive values', () => {
      const heartGroup = new CardGroup([cardH3, cardH5, cardH10, cardH13]);
      const expected = [[3], [5], [10], [13]];
      expect(sortValuesIntoRuns(heartGroup)).to.deep.equal(expected);
    });
  });

  describe('reduceCardsByValue', () => {
    it('returns the expected reduced object', () => {
      const someCards = [cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5];
      const expectedReduction = {
        '3': 2,
        '4': 1,
        '5': 2,
        '6': 1,
        '9': 1,
        '10': 1,
        '13': 1,
      };
      expect(reduceCardsByValue(someCards)).to.deep.equal(expectedReduction);
    });
  });

  describe('removeValueFromArray', () => {
    it('returns array with specified value removed', () => {
      const someArray = [3, 4, 7, 8, 10];
      const valueToRemove = 7;
      const expectedResult = [3, 4, 8, 10];
      expect(removeValueFromArray(someArray, valueToRemove)).to.deep.equal(expectedResult);
    });

    it('returns original array when specified value is not in it', () => {
      const someArray = [3, 4, 7, 8, 10];
      const valueToRemove = 6;
      const expectedResult = [3, 4, 7, 8, 10];
      expect(removeValueFromArray(someArray, valueToRemove)).to.deep.equal(expectedResult);
    });
  });
});
