import Transformer from './transformer';

export default class Decepticon extends Transformer {
  constructor(data) {
    super(data);
    if (data.isPredaking) {
      this.isPredaking = data.isPredaking;
    }
  }
}
