import Necto from './necto';

describe('Necto', () => {
  describe('Instantiation', () => {
    it('should instantiate successfully with a name', () => {
      const test = new Necto('test');
      expect(test.name).toBe('test');
    });
    it('should contain all default flows', () => {
      const test = new Necto('test');
      expect(test).toHaveProperty('Actions.isLoading');
      expect(test).toHaveProperty('Actions.isLoadingComplete');
      expect(test).toHaveProperty('Actions.mergeDataFromApi');
    });
  });
  describe('createFlow', () => {
    it('should attach an action and a constant to the instance', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      expect(test.Actions).toHaveProperty('someFlow', expect.any(Function));
      expect(test.Constants).toHaveProperty('SOME_FLOW', 'TEST/SOME_FLOW');
    });

    it('should handle error objects', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      const error = new Error('SomeFlowError');

      console.log(test.Actions.someFlow('description', error));
    });
  });

  describe('Using Flows', () => {
    it('should throw when an action is called without an interaction description', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      expect(() => {
        test.Actions.someFlow();
      }).toThrow();
    });

    it('should throw when an action is called with a non-string interaction description', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      expect(() => {
        test.Actions.someFlow({ foo: 'bar' });
      }).toThrow();
    });

    it('should return a plain object when a action is called', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      console.log(test.Actions.someFlow('hello world'));
    });
  });
});

describe('Extending Necto', () => {
  describe('getInitialFlows', () => {
    it('should create no default flows if getInitialFlows is overridden and returns nothing', () => {
      class ExtendedNecto extends Necto {
        getInitialFlows(createFlow, necto) {
          return [];
        }
      }
      const test = new ExtendedNecto('test');
      expect(test).not.toHaveProperty('Actions.isLoading');
      expect(test).not.toHaveProperty('Actions.isLoadingComplete');
      expect(test).not.toHaveProperty('Actions.mergeDataFromApi');
    });
  });
});
