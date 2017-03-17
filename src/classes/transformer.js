export default class Transformer {
  constructor(data) {
    this.name = data.name;
    this.group = data.group;
    this.strength = data.strength;
    this.intelligence = data.intelligence;
    this.speed = data.speed;
    this.endurance = data.endurance;
    this.rank = data.rank;
    this.courage = data.courage;
    this.firepower = data.firepower;
    this.skill = data.skill;
    this.overallRating = (data.strength + data.intelligence + data.speed + data.endurance + data.firepower);
  }
}
