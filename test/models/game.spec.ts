import chai from 'chai';
import { Game, User } from '../../src/models';
import { userOne, userTwo, userThree, userFour, userFive, userSix } from '../common/testData';

const { expect } = chai;

describe('game methods', () => {
  const twoUsers = [userOne, userTwo];
  const twoPlayerGame = new Game(1, twoUsers);
  const userSeven = new User(7, 'Gordon');

  describe('constructor', () => {
    it('correctly assigns players and round', () => {
      expect(twoPlayerGame.players).to.deep.equal(twoUsers);
      expect(twoPlayerGame.round).to.equal(3);
    });

    it('throws error if too few players added to game', () => {
      expect(() => new Game(2, [userOne])).to.throw('Players[] must have 2-6 members.');
    });

    it('throws error if too many players added to game', () => {
      const sevenUsers = [userOne, userTwo, userThree, userFour, userFive, userSix, userSeven];
      expect(() => new Game(3, sevenUsers)).to.throw('Players[] must have 2-6 members.');
    });
  });

  describe('goToNextRound', () => {
    it('correctly advances round if not round 13', () => {
      twoPlayerGame.goToNextRound();
      expect(twoPlayerGame.round).to.equal(4);
    });

    it('does not advance round past round 13', () => {
      // Setup
      while (twoPlayerGame.round < 13) {
        twoPlayerGame.goToNextRound();
      }
      expect(twoPlayerGame.round).to.equal(13);

      twoPlayerGame.goToNextRound();
      expect(twoPlayerGame.round).to.equal(13);
    });
  });
});
