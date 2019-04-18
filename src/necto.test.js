import Necto from './necto';

describe('Necto', () => {
  describe('Instantiation', () => {
    it('should instantiate successfully with a name', () => {
      const test = new Necto('test');
      expect(test.name).toBe('test');
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
      const errorName = 'SomeFlowError';
      const error = new Error(errorName);
      expect(test.Actions.someFlow('description', error).payload.message).toBe(
        errorName
      );
    });
  });

  describe('Using Flows', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
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
      const description = 'some interaction';
      const action = test.Actions.someFlow(description);
      expect(action).toHaveProperty('payload', {});
      expect(action).toHaveProperty('meta', null);
      expect(action).toHaveProperty('_actionType', 'TEST/SOME_FLOW');
      expect(action).toHaveProperty('_interaction', description);
      expect(action).toHaveProperty('_requiredParams', []);
      expect(action).toHaveProperty('_async', false);
    });

    it('should do things', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const test = new Necto('test');
      const someFlow = test.createFlow('someFlow', (state, action) => {
        return {
          ...state,
          foo: action.foo.bar,
        };
      });
      const state = {
        foo: 'bar',
      };
      const action = someFlow.action('example');

      const reducers = test.getReducers();
      reducers['test'](state, action);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });

    // it('should throw ', () => {
    //   jest.spyOn(global.console, 'error').mockImplementation(() => {});
    //   const test = new Necto('test');
    //   test.createFlow('someFlow', (state, action) => ({
    //     ...state,
    //     foo: action.foo
    //   }), {
    //     requiredParams: {

    //     }
    //   });

    // });
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
