import chai from 'chai';
import { Game, User } from '../../src/models';

const { expect } = chai;

describe('game methods', () => {
  // Setup
  const users = [new User(1, 'Sammy'), new User(2, 'Les')];
  const game = new Game(1, users);
  
  describe('constructor', () => {
    it('correctly assigns players and round', () => {
      expect(game.players).to.deep.equal(users);
      expect(game.round).to.equal(3);
    });
  });

  describe('goToNextRound', () => {
    it('correctly advances round if not round 13', () => {
      game.goToNextRound();
      expect(game.round).to.equal(4);
    });

    it('does not advance round past round 13', () => {
      // Setup
      while(game.round < 13){
        game.goToNextRound();
      };
      expect(game.round).to.equal(13);

      game.goToNextRound();
      expect(game.round).to.equal(13);
    });
  });
});
