import TestAdapterBase from './base';

export class JestAdapter extends TestAdapterBase {
  constructor() {
    super();
    this._type = 'jest';
  }

  override test<Data>(
    name: string,
    prepare: (() => Data) | (() => Promise<Data>),
    assertion: (data: Data) => void
  ): void {
    test(name, () => {
      const result = prepare();
      if (result instanceof Promise) {
        result.then(assertion);
      } else {
        assertion(result);
      }
    });
  }
  override expect<ActualType = unknown>(actual: ActualType): jest.JestMatchers<ActualType> {
    return expect(actual);
  }
  override describe(name: string, fn: () => void): void {
    describe(name, fn);
  }
}
