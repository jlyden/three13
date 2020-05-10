import chai from 'chai';
import forEach from 'mocha-each';
import _ from 'lodash';
import { Round, Game, User, Card } from '../../src/models';

const { expect } = chai;

const userOne = new User(1, 'Alice');
const userTwo = new User(2, 'Bert');
const userThree = new User(3, 'Calvin');
const userFour = new User(4, 'Dahlia');
const userFive = new User(5, 'Edith');
const userSix = new User(6, 'Fred');
const twoPlayers = [userOne, userTwo];
const threePlayers = [userOne, userTwo, userThree];

describe('round methods', () => {
  describe('play through a round', () => {
    const progressiveGame = new Game(1, threePlayers);
    const progGameRoundOne = new Round(progressiveGame);
    progGameRoundOne.startRound();

    it('takes Visible Card: adds to hand, sets visibleCard to null - Player 0', () => {
      // Arrange
      const visibleCard: Card = progGameRoundOne.visibleCard;
      const handIndex = progGameRoundOne.getCurrentPlayerIndex();
      const handCountBefore = progGameRoundOne.hands[handIndex].getCards().length;

      // Act
      progGameRoundOne.takeVisibleCard();

      // Assert
      // Expected user
      expect(handIndex).to.equal(0);
      expect(progGameRoundOne.currentPlayer).to.deep.equal(threePlayers[0]);
      expect(progGameRoundOne.message).to.equal('Alice - time to discard')

      // Expected card actions
//      expect(progGameRoundOne.hands[handIndex].toString()).to.include(visibleCard.toString());
      expect(progGameRoundOne.hands[handIndex].getCards().length).to.equal(handCountBefore+1)
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.hands[handIndex].getCards(), 
        [visibleCard], _.isEqual)).to.deep.equal([visibleCard]);
      // tslint:disable-next-line: no-unused-expression
      expect(progGameRoundOne.visibleCard).to.be.null;
    });

    it('discards After Turn - Player 0', () => {
      // Arrange
      const handIndex = progGameRoundOne.getCurrentPlayerIndex();
      const discard = progGameRoundOne.hands[handIndex].getCards()[0];
      const handCountBefore = progGameRoundOne.hands[handIndex].getCards().length;
  
      // Act
      progGameRoundOne.discardAfterTurn(discard);

      // Assert
      expect(progGameRoundOne.hands[handIndex].getCards().length).to.equal(handCountBefore-1)
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.hands[handIndex].getCards(), 
        [discard], _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.deck.getCards(), [discard], _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(progGameRoundOne.visibleCard).to.deep.equal(discard);

      // Next user should be current now, check message
      expect(progGameRoundOne.currentPlayer).to.deep.equal(threePlayers[1]);
      expect(progGameRoundOne.message).to.equal('Bert - time to draw')
    });
  
    it('draws From Deck: and adds card to hand - Player 1', () => {
      // Arrange
      const beforeDeckCount = progGameRoundOne.deck.getCards().length;
      const userHandIndex = progGameRoundOne.getCurrentPlayerIndex();
      const beforeUserHandCount = progGameRoundOne.hands[userHandIndex].getCards().length;
      // User needs to draw
      
      // Act
      progGameRoundOne.drawFromDeck();

      // Assert
      // Expected user
      expect(userHandIndex).to.equal(1);
      expect(progGameRoundOne.currentPlayer).to.deep.equal(threePlayers[1]);
      expect(progGameRoundOne.message).to.equal('Bert - time to discard')

      // Expected card actions
      expect(progGameRoundOne.deck.getCards().length).to.equal(beforeDeckCount-1);
      expect(progGameRoundOne.hands[userHandIndex].getCards().length).to.equal(beforeUserHandCount+1);
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.hands[userHandIndex].getCards(), progGameRoundOne.deck.getCards(), _.isEqual)).to.be.empty;
    });

    it('discards After Turn - Player 1', () => {
      // Arrange
      const handIndex = progGameRoundOne.getCurrentPlayerIndex();
      const discard = progGameRoundOne.hands[handIndex].getCards()[1];
      const handCountBefore = progGameRoundOne.hands[handIndex].getCards().length;
  
      // Act
      progGameRoundOne.discardAfterTurn(discard);

      // Assert
      expect(progGameRoundOne.hands[handIndex].getCards().length).to.equal(handCountBefore-1)
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.hands[handIndex].getCards(), 
        [discard], _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(progGameRoundOne.deck.getCards(), [discard], _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(progGameRoundOne.visibleCard).to.deep.equal(discard);

      // Next user should be current now, check message
      expect(progGameRoundOne.currentPlayer).to.deep.equal(threePlayers[2]);
      expect(progGameRoundOne.message).to.equal('Calvin - time to draw')
    });  
  });

  describe('startRound', () => {
    const testGame = new Game(1, twoPlayers);
    const testRound = new Round(testGame);
      it('correctly prepares the deck and hands', () => {
      expect(testRound.hands.length).to.equal(2);

      // Deck and Users have correct card counts
      expect(testRound.deck.getCards().length).to.equal(46);
      expect(testRound.hands[0].getCards().length).to.equal(0);
      expect(testRound.hands[1].getCards().length).to.equal(0);
    });

    it('deals 3 unique cards to each of 2 users, removing those 6 cards from the deck', () => {
      testRound.startRound();

      // Deck and Users have correct card counts
      expect(testRound.deck.getCards().length).to.equal(39);        
      const userCount = testGame.players.length;
      for (let i = 0; i < userCount; i ++) {
        expect(testRound.hands[i].getCards().length).to.equal(3);
      }

      // No intersections between deck, hands, and visible card
      // tslint doesn't recognize _.intersectionWith as a lodash function
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[0].getCards(), testRound.hands[1].getCards(), _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[0].getCards(), testRound.deck.getCards(), _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(_.intersectionWith(testRound.hands[1].getCards(), testRound.deck.getCards(), _.isEqual)).to.be.empty;
      // tslint:disable-next-line: no-unused-expression
      expect(testRound.visibleCard).to.not.be.null;
      // tslint:disable-next-line: no-unused-expression
      expect(_.findIndex(testRound.hands[0].getCards(), testRound.visibleCard)).to.equal(-1);
      // tslint:disable-next-line: no-unused-expression
      expect(_.findIndex(testRound.hands[1].getCards(), testRound.visibleCard)).to.equal(-1);
      // tslint:disable-next-line: no-unused-expression
      expect(_.findIndex(testRound.deck.getCards(), testRound.visibleCard)).to.equal(-1);
    });

    it('prompts the first user to play', () => {
      expect(testRound.currentPlayer).to.deep.equal(twoPlayers[0]);
      expect(testRound.message).to.equal('Alice - time to draw')
    });
  });

  describe('setNextUp', () => {
    describe('2 player game', () => {
      // Setup
      const testGame2Players = new Game(1, twoPlayers);
      const testRound2Players = new Round(testGame2Players);

      // Once we start a round, users[0] is set to currentPlayer
      testRound2Players.startRound();
      expect(testRound2Players.currentPlayer).to.deep.equal(testRound2Players.game.players[0]);

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
          testRound2Players.setFirstPlayerForRound();
          expect(testRound2Players.currentPlayer).to.deep.equal(testRound2Players.game.players[expected]);
        });
    });

    describe('3 player game', () => {
      // Setup
      const threePlayers = [userOne, userTwo, userThree];
      const testGame3Players = new Game(1, threePlayers);
      const testRound3Players = new Round(testGame3Players);

      // Once we start a round, users[0] is set to currentPlayer
      testRound3Players.startRound();
      expect(testRound3Players.currentPlayer).to.deep.equal(testRound3Players.game.players[0]);

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
          testRound3Players.setFirstPlayerForRound();
          expect(testRound3Players.currentPlayer).to.deep.equal(testRound3Players.game.players[expected]);
        });
    });
 
    describe('4 player game', () => {
      // Setup
      const fourPlayers = [userOne, userTwo, userThree, userFour];
      const testGame4Players = new Game(1, fourPlayers);
      const testRound4Players = new Round(testGame4Players);

      // Once we start a round, users[0] is set to currentPlayer
      testRound4Players.startRound();
      expect(testRound4Players.currentPlayer).to.deep.equal(testRound4Players.game.players[0]);

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
          testRound4Players.setFirstPlayerForRound();
          expect(testRound4Players.currentPlayer).to.deep.equal(testRound4Players.game.players[expected]);
        });
    });

    describe('5 player game', () => {
      // Setup
      const fivePlayers = [userOne, userTwo, userThree, userFour, userFive];
      const testGame5Players = new Game(1, fivePlayers);
      const testRound5Players = new Round(testGame5Players);

      // Once we start a round, users[0] is set to currentPlayer
      testRound5Players.startRound();
      expect(testRound5Players.currentPlayer).to.equal(testRound5Players.game.players[0]);

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
          testRound5Players.setFirstPlayerForRound();
          expect(testRound5Players.currentPlayer).to.equal(testRound5Players.game.players[expected]);
        });
    });

    describe('6 player game', () => {
      // Setup
      const sixPlayers = [userOne, userTwo, userThree, userFour, userFive, userSix];
      const testGame6Players = new Game(1, sixPlayers);
      const testRound6Players = new Round(testGame6Players);

      // Once we start a round, users[0] is set to currentPlayer
      testRound6Players.startRound();
      expect(testRound6Players.currentPlayer).to.equal(testRound6Players.game.players[0]);

      const testCases = [
        [1, 4],
        [2, 5],
        [3, 6],
        [4, 7],
        [5, 8],
        [0, 9],
        [1, 10],
        [2, 11],
        [3, 12],
        [4, 13]
      ];

      forEach(testCases)
        .it('sets user %d to next up for round %d', (expected, round) => {
          testGame6Players.round = round;
          testRound6Players.setFirstPlayerForRound();
          expect(testRound6Players.currentPlayer).to.equal(testRound6Players.game.players[expected]);
        });
    });
  });
});
