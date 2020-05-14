import chai from 'chai';
import _ from 'lodash';
import { Card } from '../../src/models';
import { transformRunArrayIntoCardArray, sortValuesIntoRuns } from '../../src/utils';

const { expect } = chai;

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
