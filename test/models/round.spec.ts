import chai from 'chai';
import 'mocha';
import _ from 'lodash';
import { Round, Card, Deck, Game, User } from '../../src/models';

const { expect } = chai;

describe('round class methods', () => {
  describe('start', () => {
    // Setup
    const userOne = new User(1, 'Sammy');
    const userTwo = new User(2, 'Les');
    const game = new Game(1, [userOne, userTwo]);
    const round = new Round(game); // 2 users

    it('correctly prepares the deck and hands', () => {
      expect(round.userCount).to.equal(2);
      expect(round.hands.length).to.equal(2);

      // Deck and Users have correct card counts
      expect(round.deck.deck.length).to.equal(46);
      expect(round.hands[0].hand.length).to.equal(0);
      expect(round.hands[1].hand.length).to.equal(0);
    });

    it('deals 3 unique cards to each of 2 users, removing those 6 cards from the deck', () => {
      round.startRound(1); // round 1, 3 cards

      // Deck and Users have correct card counts
      expect(round.deck.deck.length).to.equal(40);        
      for (let i = 0; i < round.userCount; i ++) {
        expect(round.hands[i].hand.length).to.equal(3);
      }
      // No intersections between deck and hands
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(round.hands[0].hand, round.hands[1].hand, _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(round.hands[0].hand, round.deck.deck, _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(round.hands[1].hand, round.deck.deck, _.isEqual)).to.be.empty;
    });

    it('prompts the first user to play', () => {
      expect(round.message).to.equal('Sammy, time to draw and discard!')
    });
  });
});

