const { v4 } = require("uuid");

module.exports = class OpsStack {
  constructor() {
    this._ops = [];
    this._uuid = v4();
  }

  addOperation(fn) {
    this._ops = [fn, ...this._ops];
  }

  async perform() {
    const opsPromises = this._ops.map((fn) => fn());
    return await Promise.all(opsPromises);
  }
};
