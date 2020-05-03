import chai from 'chai';
import { Game, User } from '../../src/models';

const { expect } = chai;

describe('game methods', () => {
  // Setup
  const testUsers = [new User(1, 'Sammy'), new User(2, 'Les')];
  const testGame = new Game(1, testUsers);
  
  describe('constructor', () => {
    it('correctly assigns players and round', () => {
      expect(testGame.players).to.deep.equal(testUsers);
      expect(testGame.round).to.equal(3);
    });
  });

  describe('goToNextRound', () => {
    it('correctly advances round if not round 13', () => {
      testGame.goToNextRound();
      expect(testGame.round).to.equal(4);
    });

    it('does not advance round past round 13', () => {
      // Setup
      while(testGame.round < 13){
        testGame.goToNextRound();
      };
      expect(testGame.round).to.equal(13);

      testGame.goToNextRound();
      expect(testGame.round).to.equal(13);
    });
  });
});
