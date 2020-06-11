import chai from 'chai';
import forEach from 'mocha-each';
import { Card, Suit } from '../../src/models';

const { expect } = chai;

describe('Card methods', () => {
  describe('constructor error', () => {
    const invalidValue = 2;
    it('throws error if invalid value is passed', () => {
      const validSuit = Suit.Spades;
      expect(() => new Card(validSuit, invalidValue)).to.throw(`Invalid suit or value: ${validSuit}, ${invalidValue}`);
    });
  });

  describe('toString', () => {
    it('displays Joker as expected', () => {
      expect(new Card(Suit.Joker, 12).toString()).to.equal('<Joker>');
    });

    it('displays number card as expected', () => {
      expect(new Card(Suit.Hearts, 8).toString()).to.equal('<8 of Hearts>');
    });

    const testCases = [
      ['Jack', Suit.Diamonds, 11],
      ['Queen', Suit.Hearts, 12],
      ['King', Suit.Clubs, 13],
    ];

    forEach(testCases).it('displays %s as expected', (faceCardName, suit, value) => {
      const expectedToString = `<${faceCardName} of ${suit}>`;
      const faceCard = new Card(suit, value);
      expect(faceCard.toString()).to.equal(expectedToString);
    });

    it('displays face card as expected', () => {
      expect(new Card(Suit.Hearts, 12).toString()).to.equal('<Queen of Hearts>');
    });
  });
});
