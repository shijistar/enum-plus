import TestAdapterBase, { type PrepareContext } from './base';

export class JestAdapter extends TestAdapterBase {
  constructor() {
    super();
    this._type = 'jest';
  }

  override test<Data>(
    name: string,
    prepare: (context: PrepareContext) => Data,
    assertion: (data: Data) => void,
    prepareContext?: Record<string, unknown>
  ): void {
    test(name, () => {
      const result = prepare(prepareContext as PrepareContext);
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
