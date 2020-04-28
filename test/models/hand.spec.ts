import chai from 'chai';
import 'mocha';
import _ from 'lodash';
import { Card, Hand } from '../../src/models';

const { expect } = chai;

// Setup
const testHand = new Hand();
const cardOne = new Card('Diamonds', 9);
const cardTwo = new Card('Spades', 4);
const cardThree = new Card('Diamonds', 4);
testHand.add(cardOne);
const handWithOneCard = _.cloneDeep(testHand);
testHand.add(cardTwo);
const handWithTwoCards = _.cloneDeep(testHand);
testHand.add(cardThree);

describe('hand class methods', () => {
  describe('discard', () => {
    it('removes a card and leaves two behind', () => {
      const discardThree = testHand.discard(cardThree);
      expect(testHand).to.deep.equal(handWithTwoCards);
      expect(discardThree).to.deep.equal(cardThree);
    })

    it('removes a card and leaves one behind', () => {
      const discardTwo = testHand.discard(cardTwo);
      expect(testHand).to.deep.equal(handWithOneCard);
      expect(discardTwo).to.deep.equal(cardTwo);
    })

    it('removes a card and leaves an empty hand', () => {
      const emptyHand = new Hand();
      const discardOne = testHand.discard(cardOne);
      expect(testHand).to.deep.equal(emptyHand);
      expect(discardOne).to.deep.equal(cardOne);
    })
  })
})