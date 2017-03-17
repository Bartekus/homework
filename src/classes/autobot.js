import Transformer from './transformer';

export default class Autobot extends Transformer {
  constructor(data) {
    super(data);
    if (data.isOptimusPrime) {
      this.isOptimusPrime = data.isOptimusPrime;
    }
  }
}
