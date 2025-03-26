const NodeEnvironment = require('jest-environment-node').default;
const { TextEncoder, TextDecoder } = require('util');

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
      this.global.ArrayBuffer = ArrayBuffer;
      this.global.Uint8Array = Uint8Array;
    }
  }
}

module.exports = CustomEnvironment; 