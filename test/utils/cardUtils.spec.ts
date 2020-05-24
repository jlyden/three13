import chai from 'chai';
import _ from 'lodash';
import { Card, CardGroup } from '../../src/models';
import { transformRunArrayIntoCardGroup, sortValuesIntoRuns } from '../../src/utils';
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13 } from '../common/testData';

const { expect } = chai;

// TODO: more tests?
describe('utils: cardUtils methods', () => {
  describe('transformRunArrayIntoCardGroup', () => {
    it('properly completes transformation', () => {
      const expectedGroup = new CardGroup([cardS4, cardS5, cardS6]);
      const testSuit = 'Spades';
      const testRunArray = [4, 5, 6];

      const actualCardArray = transformRunArrayIntoCardGroup(testRunArray, testSuit);
      expect(actualCardArray).to.deep.equal(expectedGroup);
    });
  });

  describe('sortValuesIntoRuns', () => {
    it('sorts values with one run and one single', () => {
      const spadeGroup= new CardGroup([cardS3, cardS4, cardS5, cardS6, cardS9]);
      const expected = [[3, 4, 5, 6], [9]];
      expect(sortValuesIntoRuns(spadeGroup)).to.deep.equal(expected);
    });

    it('sorts values no consecutive values', () => {
      const heartGroup = new CardGroup([cardH13]);
      const expected = [[13]];
      expect(sortValuesIntoRuns(heartGroup)).to.deep.equal(expected);
    });
  });
});
