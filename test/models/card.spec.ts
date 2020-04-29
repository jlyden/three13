import chai from 'chai';
import 'mocha';
import _ from 'lodash';
import { Card } from '../../src/models';

const { expect } = chai;

describe('card class methods', () => {
  describe('toString', () => {
    it('displays number card as expected', () => {
      const aCard = new Card('Hearts', 8);
      expect(aCard.toString()).to.equal('<8 of Hearts>');
    })

    it('displays face card as expected', () => {
      const aCard = new Card('Hearts', 12);
      expect(aCard.toString()).to.equal('<Queen of Hearts>');
    })

    it('displays joker as expected', () => {
      const aCard = new Card('Joker', 12);
      expect(aCard.toString()).to.equal('<Joker>');
    })
  })
})
