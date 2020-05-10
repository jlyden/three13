import chai from 'chai';
import { Card } from '../../src/models';

const { expect } = chai;

describe('card methods', () => {
  describe('toString', () => {
    it('displays number card as expected', () => {
      expect(new Card('Hearts', 8).toString()).to.equal('<8 of Hearts>');
    });

    it('displays face card as expected', () => {
      expect(new Card('Hearts', 12).toString()).to.equal('<Queen of Hearts>');
    });

    it('displays joker as expected', () => {
      expect(new Card('Joker', 12).toString()).to.equal('<Joker>');
    });
  });
});
