import chai from 'chai';
import forEach from 'mocha-each';
import _ from 'lodash';
import { Round, Game, User } from '../../src/models';

const { expect } = chai;

const userOne = new User(1, 'Alice');
const userTwo = new User(2, 'Bert');
const userThree = new User(3, 'Calvin');
const userFour = new User(4, 'Dahlia');
const userFive = new User(5, 'Edith');
const twoPlayers = [userOne, userTwo];

describe('round methods', () => {
  describe('startRound', () => {
    // Setup
    const testGame = new Game(1, twoPlayers);
    const testRound = new Round(testGame);

    it('correctly prepares the deck and hands', () => {
      expect(testRound.hands.length).to.equal(2);

      // Deck and Users have correct card counts
      expect(testRound.deck.cards.length).to.equal(46);
      expect(testRound.hands[0].hand.length).to.equal(0);
      expect(testRound.hands[1].hand.length).to.equal(0);
    });

    it('deals 3 unique cards to each of 2 users, removing those 6 cards from the deck', () => {
      testRound.startRound(); // round 1, 3 cards

      // Deck and Users have correct card counts
      expect(testRound.deck.cards.length).to.equal(40);        
      const userCount = testGame.players.length;
      for (let i = 0; i < userCount; i ++) {
        expect(testRound.hands[i].hand.length).to.equal(3);
      }

      // No intersections between deck and hands
      // tslint doesn't recognize _.intersectionWith as a lodash function
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[0].hand, testRound.hands[1].hand, _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[0].hand, testRound.deck.cards, _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[1].hand, testRound.deck.cards, _.isEqual)).to.be.empty;
    });

    it('prompts the first user to play', () => {
      expect(testRound.nextUp).to.deep.equal(twoPlayers[0]);
      expect(testRound.message).to.equal('Alice, time to draw and discard!')
    });
  });

  describe('setNextUp', () => {
    describe('2 player game', () => {
      // Setup
      const testGame2Players = new Game(1, twoPlayers);
      const testRound2Players = new Round(testGame2Players);

      // Once we start a round, users[0] is set to nextUp
      testRound2Players.startRound();
      expect(testRound2Players.nextUp).to.deep.equal(testRound2Players.game.players[0]);

      const testCases = [
        [1, 4],
        [0, 5],
        [1, 6],
        [0, 7],
        [1, 8],
        [0, 9],
        [1, 10],
        [0, 11],
        [1, 12],
        [0, 13]
      ]

      forEach(testCases)
        .it('sets user %d to next up for round %d', (expected, round) => {
          testGame2Players.round = round;
          testRound2Players.setNextUp();
          expect(testRound2Players.nextUp).to.deep.equal(testRound2Players.game.players[expected]);
        })
    });

    describe('3 player game', () => {
      // Setup
      const threePlayers = [userOne, userTwo, userThree];
      const testGame3Players = new Game(1, threePlayers);
      const testRound3Players = new Round(testGame3Players);

      // Once we start a round, users[0] is set to nextUp
      testRound3Players.startRound();
      expect(testRound3Players.nextUp).to.deep.equal(testRound3Players.game.players[0]);

      const testCases = [
        [1, 4],
        [2, 5],
        [0, 6],
        [1, 7],
        [2, 8],
        [0, 9],
        [1, 10],
        [2, 11],
        [0, 12],
        [1, 13]
      ];

      forEach(testCases)
        .it('sets user %d to next up for round %d', (expected, round) => {
          testGame3Players.round = round;
          testRound3Players.setNextUp();
          expect(testRound3Players.nextUp).to.deep.equal(testRound3Players.game.players[expected]);
        })
    });
 
    describe('4 player game', () => {
      // Setup
      const fourPlayers = [userOne, userTwo, userThree, userFour];
      const testGame4Players = new Game(1, fourPlayers);
      const testRound4Players = new Round(testGame4Players);

      // Once we start a round, users[0] is set to nextUp
      testRound4Players.startRound();
      expect(testRound4Players.nextUp).to.deep.equal(testRound4Players.game.players[0]);

      const testCases = [
        [1, 4],
        [2, 5],
        [3, 6],
        [0, 7],
        [1, 8],
        [2, 9],
        [3, 10],
        [0, 11],
        [1, 12],
        [2, 13]
      ];

      forEach(testCases)
        .it('sets user %d to next up for round %d', (expected, round) => {
          testGame4Players.round = round;
          testRound4Players.setNextUp();
          expect(testRound4Players.nextUp).to.deep.equal(testRound4Players.game.players[expected]);
        })
    });

    describe('5 player game', () => {
      // Setup
      const fivePlayers = [userOne, userTwo, userThree, userFour, userFive];
      const testGame5Players = new Game(1, fivePlayers);
      const testRound5Players = new Round(testGame5Players);

      // Once we start a round, users[0] is set to nextUp
      testRound5Players.startRound();
      expect(testRound5Players.nextUp).to.equal(testRound5Players.game.players[0]);

      const testCases = [
        [1, 4],
        [2, 5],
        [3, 6],
        [4, 7],
        [0, 8],
        [1, 9],
        [2, 10],
        [3, 11],
        [4, 12],
        [0, 13]
      ];

      forEach(testCases)
        .it('sets user %d to next up for round %d', (expected, round) => {
          testGame5Players.round = round;
          testRound5Players.setNextUp();
          expect(testRound5Players.nextUp).to.equal(testRound5Players.game.players[expected]);
        });
    });
  });
});
