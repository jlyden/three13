import chai from 'chai';
import { Game } from '../../src/models';

const { expect } = chai;

describe('Game methods', () => {
  const twoUsers = [1,2];

  describe('constructor', () => {
    const userCountError = 'A game can only begin with 2-6 users.';

    it('throws no error if acceptable user count', () => {
      expect(() => new Game(twoUsers)).not.to.throw();
    });

    it('throws error if too few users added to game', () => {
      const singleUser = [1];
      expect(() => new Game(singleUser)).to.throw(userCountError);
    });

    it('throws error if too many users added to game', () => {
      const sevenUsers = [1,2,3,4,5,6,7];
      expect(() => new Game(sevenUsers)).to.throw(userCountError);
    });
  });

  describe('round initialization and advancement', () => {
    const twoPlayerGame = new Game(twoUsers);

    it('starts game at round 3', () => {
      expect(twoPlayerGame.getRound()).to.equal(3);
    });

    it('advances round if not round 13', () => {
      twoPlayerGame.goToNextRound();
      expect(twoPlayerGame.getRound()).to.equal(4);
    });

    it('does not advance round past round 13', () => {
      // Arrange
      while (twoPlayerGame.getRound() < 13) {
        twoPlayerGame.goToNextRound();
      }
      expect(twoPlayerGame.getRound()).to.equal(13);

      twoPlayerGame.goToNextRound();
      expect(twoPlayerGame.getRound()).to.equal(13);
    });
  });
});
