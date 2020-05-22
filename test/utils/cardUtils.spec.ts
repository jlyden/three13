import chai from 'chai';
import _ from 'lodash';
import { Card } from '../../src/models';
import { transformRunArrayIntoCardArray, sortValuesIntoRuns } from '../../src/utils';
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13 } from '../common/testData';

const { expect } = chai;

// TODO: more tests?
describe('utils: cardUtils methods', () => {
  describe('transformRunArrayIntoCardArray', () => {
    it('properly completes transformation', () => {
      const expectedCardArray = [cardS4, cardS5, cardS6];
      const testSuit = 'Spades';
      const testRunArray = [4, 5, 6];

      const actualCardArray = transformRunArrayIntoCardArray(testRunArray, testSuit);
      expect(actualCardArray).to.deep.equal(expectedCardArray);
    });
  });

  describe('sortValuesIntoRuns', () => {
    it('sorts values with one run and one single', () => {
      const arrayOfSpades: Card[] = [cardS3, cardS4, cardS5, cardS6, cardS9];
      const expected = [[3, 4, 5, 6], [9]];
      expect(sortValuesIntoRuns(arrayOfSpades)).to.deep.equal(expected);
    });

    it('sorts values no consecutive values', () => {
      const arrayOfHearts: Card[] = [cardH13];
      const expected = [[13]];
      expect(sortValuesIntoRuns(arrayOfHearts)).to.deep.equal(expected);
    });
  });
});
