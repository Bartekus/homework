import BattleArena from './battleArena';

export default class Combat {
  constructor(data) {
    const contenders = [];

    this._contenders = data;
    // this._contenders.forEach((transformer) => {
    //   Object.assign(contenders, BattleArena.createTransformer(transformer));
    // });
    this._contenders.forEach((transformer) => {
      contenders.push(BattleArena.createTransformer(transformer));
    });

    BattleArena.engage(BattleArena.getFighters(contenders));
  }

}
