import chai from 'chai';
import forEach from 'mocha-each';
import { Card } from '../../src/models';

const { expect } = chai;

describe('card methods', () => {
  describe('constructor error', () => {
    const invalidSuit = 'Puppies';
    const invalidValue = 2;
    it('throws error if invalid suit is passed', () => {
      const validValue = 8;
      expect(() => new Card(invalidSuit, validValue)).to.throw(`Invalid suit or value: ${invalidSuit}, ${validValue}`)
    });

    it('throws error if invalid value is passed', () => {
      const validSuit = 'Spades';
      expect(() => new Card(validSuit, invalidValue)).to.throw(`Invalid suit or value: ${validSuit}, ${invalidValue}`)
    });

    it('throws error if invalid suit and value are passed', () => {
      expect(() => new Card(invalidSuit, invalidValue)).to.throw(`Invalid suit or value: ${invalidSuit}, ${invalidValue}`)
    });
  });

  describe('toString', () => {
    it('displays Joker as expected', () => {
      expect(new Card('Joker', 12).toString()).to.equal('<Joker>');
    });

    it('displays number card as expected', () => {
      expect(new Card('Hearts', 8).toString()).to.equal('<8 of Hearts>');
    });

    const testCases = [
      ['Jack', 'Diamonds', 11],
      ['Queen', 'Hearts', 12],
      ['King', 'Clubs', 13],
    ]
    
    forEach(testCases)
    .it('displays %s as expected', (faceCardName, suit, value) => {
      const expectedToString = `<${faceCardName} of ${suit}>`;
      const faceCard = new Card(suit, value);
      expect(faceCard.toString()).to.equal(expectedToString);
    });

    it('displays face card as expected', () => {
      expect(new Card('Hearts', 12).toString()).to.equal('<Queen of Hearts>');
    });

  });
});
