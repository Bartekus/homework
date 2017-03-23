import Autobot from './autobot';
import Decepticon from './decepticon';

// Array.prototype.hasMin = function(attribute) {
//   return this.reduce(function(prev, curr){
//     return curr[attribute] < prev[attribute] ? prev : curr;
//   });
// };

Array.prototype.hasMax = function(attribute) {
  return this.reduce(function(curr, prev){
    return curr[attribute] < prev[attribute] ? prev : curr;
  });
};

const overallRatingSuperiority = 0;
const courageSuperiority = 4;
const strengthSuperiority = 3;
const skillSuperiority = 3;

let battle = 0;
let autobots = [];
let decepticons = [];
let autobotFighter;
let decepticonFighter;

export default class BattleArena {
  constructor() {
    this._winGroup = null;
    this._survivor = null;

    this._winByCourage = null;
    this._winByStrength = null;
    this._winBySkill = null;
    this._winByOverallRating = null;

    this._autobotsWin = null;
    this._decepticonsWin = null;
    this._endByMutualDestruction = null;
  }

  // I was going to use a more private approach
  // but didn't have much luck with WeakMaps and private methods :(

  // Ordinarily we'd want to use getters and setters as per OOP encapsulation methodology
  // But since everything is contained in single class I opted to be lazy ;)

  // get battle() { return this._battle; }
  // set battle(val) { (val) ? this._battle = val : this._battle = undefined; }
  //
  // get winGroup() { return this._winGroup; }
  // set winGroup(val) { (val) ? this._winGroup = val : this._winGroup = undefined; }
  //
  // get survivor() { return this._survivor; }
  // set survivor(val) { (val) ? this._survivor = val : this._survivor = undefined; }

  static returnTheBest(arr, stat) {
    return arr.hasMax(stat);
  }

  static returnTheWorst(arr, stat) {
    return arr.hasMin(stat);
  }

  static removeFromTeam(name, team) {
    const removeName = new Set([name]);
    return team = team.filter(obj => !removeName.has(obj.name));
  }

  static getFighters(obj) {
    const contenders = obj;
    let transformerType;

    console.log('contenders', contenders, typeof contenders);


    // Probably shouldnt be doing unfiltered for ...in
    // TODO: Add hasOwnProperty guard/check
    // But I like named object so for now it will do...
    // for (let allegiance in contenders) {
    //   transformerType = contenders[allegiance].constructor.name;
    //
    //   if (transformerType === 'Autobot') {
    //     autobots.push(contenders[allegiance]);
    //   } else if (transformerType === 'Decepticon') {
    //     decepticons.push(contenders[allegiance]);
    //   }
    // }

    contenders.forEach(transformer => {
      if (transformer.group === 'A') {
        autobots.push(transformer);
      } else if (transformer.group === 'D') {
        decepticons.push(transformer);
      }
    });


    console.log('autobots', autobots);
    console.log('decepticons', decepticons);

    autobotFighter = BattleArena.returnTheBest(autobots);

    console.log('autobotFighter', autobotFighter);
    autobots = this.removeFromTeam(autobotFighter.name, autobots);

    decepticonFighter = BattleArena.returnTheBest(decepticons);

    console.log('decepticonFighter', decepticonFighter);
    decepticons = this.removeFromTeam(decepticonFighter.name, decepticons);

    return {
      autobot: autobotFighter,
      decepticon: decepticonFighter
    };
  }

  static fightersCompareStats(autobot, decepticon, statToCheck) {
    let difference = undefined;
    let comparedAgainst = undefined;
    let statsChampion = undefined;

    if (statToCheck === 'courage') {
      comparedAgainst = courageSuperiority;
    } else if (statToCheck === 'strength') {
      comparedAgainst = strengthSuperiority;
    } else if (statToCheck === 'skill') {
      comparedAgainst = skillSuperiority;
    } else if (statToCheck === 'overallRating') {
      comparedAgainst = overallRatingSuperiority;
    }

    if (autobot[statToCheck] > decepticon[statToCheck]) {
      difference = autobot[statToCheck] - decepticon[statToCheck];

      if (difference >= comparedAgainst) {
        statsChampion = autobot;
      }

    } else if (decepticon[statToCheck] > autobot[statToCheck]) {

      difference = decepticon[statToCheck] - autobot[statToCheck];

      if (difference >= comparedAgainst) {
        statsChampion = decepticon;
      }
    }

    if (statsChampion) {
      if (statToCheck === 'courage') {
        this._winByCourage = statsChampion;
      } else if (statToCheck === 'strength') {
        this._winByStrength = statsChampion;
      } else if (statToCheck === 'skill') {
        this._winBySkill = statsChampion;
      } else if (statToCheck === 'overallRating') {
        this._winByOverallRating = statsChampion;
      }
    }
  }

  static survivorCheck(group) {
    if (this._autobotsWin && group.length > 0) {
      group.forEach((survivor) => console.log(`Survivors from the losing team (Decepticons): ${ survivor.name }`));
    } else if (this._decepticonsWin && group.length > 0) {
      group.forEach((survivor) => console.log(`Survivors from the losing team (Autobots): ${ survivor.name }`));
    } else if (this._endByMutualDestruction) {
      autobotFighter = null;
      autobots = null;
      decepticonFighter = null;
      decepticons = null;
      console.log('GAME OVER!\nAll Competitors have been destroyed...');
    }
  }

  static winnerCheck(transformer) {
    this._winGroup = transformer;
      console.log(`${battle} battle`);
    if (this._winGroup.group === 'A') {
      this._autobotsWin = true;
      console.log(`Winning team (Autobots): ${this._winGroup.name}`);
      return this.survivorCheck(decepticons)
    } else if (this._winGroup.group === 'D') {
      this._decepticonsWin = true;
      console.log(`Winning team (Decepticons): ${this._winGroup.name}`);
      return this.survivorCheck(autobots)
    }
  }

  static engage(obj) {
    battle++;
    let autobot = obj.autobot;
    let decepticon = obj.decepticon;

    if (autobot.name === 'Optimus Prime' && decepticon === 'Predaking') {
      console.log(`Oh NOOO! Optimus Prime!? and Predaking!? We're all doomed!`);
      this._endByMutualDestruction = true;
      return this.survivorCheck(null);
    } else if (autobot.name === 'Optimus Prime' && decepticon !== 'Predaking') {
      console.log(`Optimus Prime reign supreme and brings glorious victory to the Autobots team!`);
      return this.winnerCheck(autobot);
    } else if (autobot.name !== 'Optimus Prime' && decepticon === 'Predaking') {
      console.log(`Predaking reign supreme and brings decisive victory to the Decepticons team!`);
      return this.winnerCheck(decepticon);
    }

    this.fightersCompareStats(autobot, decepticon, 'courage');
    this.fightersCompareStats(autobot, decepticon, 'strength');
    this.fightersCompareStats(autobot, decepticon, 'skill');
    this.fightersCompareStats(autobot, decepticon, 'overallRating');

    if (this._winByCourage && this._winByStrength && this._winByCourage === this._winByStrength) {
      return this.winnerCheck(this._winByCourage);
    } else if (this._winBySkill) {
      return this.winnerCheck(this._winBySkill);
    } else if (this._winByOverallRating) {
      return this.winnerCheck(this._winByOverallRating);
    }
  }

  static createTransformer(arr) {
    if (arr.length !== 10) {
      return console.log('You did not enter the correct number of elements required to create a transformer.');
    }

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
      let autobot = [];

      return new Autobot({
        name: name,
        group: group,
        strength: strength,
        intelligence: intelligence,
        speed: speed,
        endurance: endurance,
        rank: rank,
        courage: courage,
        firepower: firepower,
        skill: skill
      });

      // return autobot;

    } else if ( group === 'D' ) {
      let decepticon = [];

      return new Decepticon({
        name: name,
        group: group,
        strength: strength,
        intelligence: intelligence,
        speed: speed,
        endurance: endurance,
        rank: rank,
        courage: courage,
        firepower: firepower,
        skill: skill
      });

      // return decepticon;
    }
  }

}
