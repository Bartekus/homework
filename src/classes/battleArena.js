import Autobot    from './autobot';
import Decepticon from './decepticon';

Array.prototype.hasMax = function(attribute) {
  if (this.length === 0) { return null }
  return this.reduce(function(curr, prev) { return curr[attribute] < prev[attribute] ? prev : curr });
};

const overallRatingSuperiority = 0;
const courageSuperiority       = 4;
const strengthSuperiority      = 3;
const skillSuperiority         = 3;

let battle = 0;
let autobotsWinCount       = 0;
let decepticonsWinCount    = 0;
let winnerTeam             = [];
let autobotsWinners        = [];
let decepticonsWinners     = [];

export default class BattleArena {
  constructor() {
    this._winnerGroup            = null;
    this._survivor               = null;

    this._winByCourage           = null;
    this._winByStrength          = null;
    this._winBySkill             = null;
    this._winByOverallRating     = null;

    this._endByMutualDestruction = null;
    this._gameOver               = null;
  }

  static returnTheBest(arr, stat)  { return arr.hasMax(stat) }

  static returnTheWorst(arr, stat) { return arr.hasMin(stat) }

  static getFighters(obj) {
    let contenders        = obj;
    let autobots          = [];
    let decepticons       = [];

    for (let allegiance in contenders) {
           let transformerType = contenders[allegiance].constructor.name;

           if (transformerType === 'Autobot'   ) {    autobots.push(contenders[allegiance]) }
      else if (transformerType === 'Decepticon') { decepticons.push(contenders[allegiance]) }
    }

    let autobotFighter    = BattleArena.returnTheBest(   autobots, 'rank');
    let decepticonFighter = BattleArena.returnTheBest(decepticons, 'rank');

    return {
         autobot: autobotFighter,
      decepticon: decepticonFighter
    };
  }

  static fightersCompareStats(autobot, decepticon, statToCheck) {
    let difference      = undefined;
    let comparedAgainst = undefined;
    let statsChampion   = undefined;

         if (statToCheck === 'courage'      ) { comparedAgainst = courageSuperiority }
    else if (statToCheck === 'strength'     ) { comparedAgainst = strengthSuperiority }
    else if (statToCheck === 'skill'        ) { comparedAgainst = skillSuperiority }
    else if (statToCheck === 'overallRating') { comparedAgainst = overallRatingSuperiority }

           if (autobot[statToCheck]    > decepticon[statToCheck]) { difference  =    autobot[statToCheck] - decepticon[statToCheck];
           if (difference >= comparedAgainst) { statsChampion = autobot }}
      else if (decepticon[statToCheck] > autobot[statToCheck])    { difference  = decepticon[statToCheck] - autobot[statToCheck];
           if (difference >= comparedAgainst) { statsChampion = decepticon }}

    if (statsChampion) {
             if (statToCheck === 'courage'      ) { this._winByCourage       = statsChampion }
        else if (statToCheck === 'strength'     ) { this._winByStrength      = statsChampion }
        else if (statToCheck === 'skill'        ) { this._winBySkill         = statsChampion }
        else if (statToCheck === 'overallRating') { this._winByOverallRating = statsChampion }
    }
  }

  static triggerGameOver() {
    console.log(`${battle} battle`);

    if (this._endByMutualDestruction) { return console.log('GAME OVER!\nAll Transformers have been destroyed!'); }

    if (this._winnerGroup) {
      let winnerTransformers = [];
      this._winnerGroup === 'Autobots' ? autobotsWinners.forEach((member) => winnerTransformers.push(member.name)) : null;
      this._winnerGroup === 'Decepticons' ? decepticonsWinners.forEach((member) => winnerTransformers.push(member.name)) : null;

      console.log(`Winning team (${this._winnerGroup}): ${''.concat(...winnerTransformers.join(', '))}`)
    }

    if (this._survivor) { console.log(`Survivor from the losing team (${ this._survivor.group === 'A' ? 'Autobots' : 'Decepticons' }): ${ this._survivor.name }`) }
  }

  static winCounter(transformer) {
    if (transformer.group === 'A') {
      autobotsWinCount++;
      autobotsWinners.push(transformer);
    } else if (transformer.group === 'D') {
      decepticonsWinCount++;
      decepticonsWinners.push(transformer);
    }
  }

  static engage(obj) {
    battle++;
    let autobot    = obj.autobot;
    let decepticon = obj.decepticon;

         if (autobot.name === 'Optimus Prime' && decepticon.name === 'Predaking') { return this._endByMutualDestruction = true }
    else if (autobot.name === 'Optimus Prime' && decepticon.name !== 'Predaking') { return this.winCounter(autobot) }
    else if (autobot.name !== 'Optimus Prime' && decepticon.name === 'Predaking') { return this.winCounter(decepticon) }

    this.fightersCompareStats(autobot, decepticon, 'courage');
    this.fightersCompareStats(autobot, decepticon, 'strength');
    this.fightersCompareStats(autobot, decepticon, 'skill');
    this.fightersCompareStats(autobot, decepticon, 'overallRating');

         if (this._winByCourage &&
             this._winByStrength &&
             this._winByCourage === this._winByStrength) { return this.winCounter(this._winByCourage) }
    else if (this._winBySkill)                           { return this.winCounter(this._winBySkill) }
    else if (this._winByOverallRating)                   { return this.winCounter(this._winByOverallRating) }
  }

  static lobby(obj) {
    let allContenders      = obj;
    let fightingContenders = null;

    while (Object.keys(allContenders).length >= 2 && this._endByMutualDestruction !== true && this._gameOver !== true) {
      fightingContenders = this.getFighters(allContenders);

      if (fightingContenders.autobot && fightingContenders.decepticon) {
        delete allContenders[fightingContenders.autobot.name];
        delete allContenders[fightingContenders.decepticon.name];
        this.engage(fightingContenders);
      } else {
        this._gameOver = true;
        break;
      }
    }

    if (fightingContenders.autobot) { this._winnerGroup = 'Autobots'; }
    if (fightingContenders.decepticon) { this._winnerGroup = 'Decepticons'; }

    if (Object.keys(allContenders).length === 1 && this._endByMutualDestruction !== true) {
      this._survivor = allContenders[Object.keys(allContenders)];
    }

    return this.triggerGameOver();
  }

  static createTransformer(arr) {
    if (arr.length !== 10) { return console.log('You did not enter the correct number of elements required to create a transformer.') }

    let name         = arr[0];
    let group        = arr[1];
    let strength     = arr[2];
    let intelligence = arr[3];
    let speed        = arr[4];
    let endurance    = arr[5];
    let rank         = arr[6];
    let courage      = arr[7];
    let firepower    = arr[8];
    let skill        = arr[9];

    if (group === 'A') {
      let autobot   = {};
      autobot[name] = new Autobot({
        name:         name,
        group:        group,
        strength:     strength,
        intelligence: intelligence,
        speed:        speed,
        endurance:    endurance,
        rank:         rank,
        courage:      courage,
        firepower:    firepower,
        skill:        skill
      });
      return autobot;

    } else if (group === 'D') {
      let decepticon   = {};
      decepticon[name] = new Decepticon({
        name:         name,
        group:        group,
        strength:     strength,
        intelligence: intelligence,
        speed:        speed,
        endurance:    endurance,
        rank:         rank,
        courage:      courage,
        firepower:    firepower,
        skill:        skill
      });
      return decepticon;
    }
  }
}
