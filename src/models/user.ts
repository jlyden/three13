export class User {
  public id: number;
  public nickname: string;

  constructor(id: number, nickname: string) {
    this.id = id; // TODO: Refactor when there's a db to provide this
    this.nickname = nickname;
  }
}
