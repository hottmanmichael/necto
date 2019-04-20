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

    it('should not create a reducer or saga if no flowPath is given', () => {
      const name = 'test';
      const test = new Necto(name);
      const someFlow = test.createFlow('someFlow');
      expect(someFlow.action).toBeDefined();
      expect(someFlow.reducer).not.toBeDefined();
      expect(someFlow.saga).not.toBeDefined();
    });

    it('should create a reducer if (state, action) is used as the flowPath', () => {
      const name = 'test';
      const test = new Necto(name);
      const someFlow = test.createFlow('someFlow', (state, action) => ({
        foo: 'bar',
      }));
      expect(someFlow.action).toBeDefined();
      expect(someFlow.reducer).toBeDefined();
      expect(someFlow.saga).not.toBeDefined();
      expect(someFlow.reducer(null, { foo: 'bar' })).toEqual({
        foo: 'bar',
      });
    });

    it('should create a saga if *(action) is used as the flowPath', () => {
      const name = 'test';
      const test = new Necto(name);
      const someFlow = test.createFlow('someFlow', function*(action) {});
      expect(someFlow.action).toBeDefined();
      expect(someFlow.saga).toBeDefined();
      expect(someFlow.reducer).not.toBeDefined();
    });

    it('should fail creation if an invalid flowPath argument is used', () => {
      const name = 'test';
      const test = new Necto(name);

      // Valid
      expect(() => {
        const someFlow = test.createFlow('someFlow', function*(action) {});
      }).not.toThrow();
      expect(() => {
        const someFlow = test.createFlow('someFlow', (state, action) => {});
      }).not.toThrow();
      expect(() => {
        const someFlow = test.createFlow('someFlow', function(
          state,
          action
        ) {});
      }).not.toThrow();

      // Invalid
      expect(() => {
        const someFlow = test.createFlow('someFlow', function(
          test,
          me,
          out
        ) {});
      }).toThrow();
      expect(() => {
        const someFlow = test.createFlow('someFlow', function(
          state,
          { payload }
        ) {});
      }).toThrow();
      expect(() => {
        const someFlow = test.createFlow('someFlow', function*(state) {});
      }).toThrow();
      expect(() => {
        const someFlow = test.createFlow('someFlow', function*(
          state,
          action
        ) {});
      }).toThrow();
    });

    describe('Setting the _async property', () => {
      it('should set _async to false when there is not a flow path', () => {
        const name = 'test';
        const test = new Necto(name);
        const someFlow = test.createFlow('someFlow');
        expect(someFlow.action('test')).toHaveProperty('_async', false);
      });

      it('should set _async to false when a reducer is the flow path', () => {
        const name = 'test';
        const test = new Necto(name);
        const someFlow = test.createFlow('someFlow', (state, action) => state);
        expect(someFlow.action('test')).toHaveProperty('_async', false);
      });

      it('should set _async to true when a saga is the flow path', () => {
        const name = 'test';
        const test = new Necto(name);
        const someFlow = test.createFlow('someFlow', function*(action) {});
        expect(someFlow.action('test')).toHaveProperty('_async', true);
      });
    });
  });

  describe('Using Flows', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should handle error objects as the payload', () => {
      const test = new Necto('test');
      test.createFlow('someFlow');
      const errorName = 'SomeFlowError';
      const error = new Error(errorName);
      expect(test.Actions.someFlow('description', error).payload.message).toBe(
        errorName
      );
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
      expect(action).toHaveProperty('meta', {});
      expect(action).toHaveProperty('_actionType', 'TEST/SOME_FLOW');
      expect(action).toHaveProperty('_interaction', description);
      expect(action).toHaveProperty('_requiredParams', []);
      expect(action).toHaveProperty('_async', false);
    });

    it('should throw a console warning if an error occurs in the reducer', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const name = 'test';
      const test = new Necto(name);
      const someFlow = test.createFlow('someFlow', (state, action) => {
        return {
          ...state,
          foo: action.foo.bar, // bar does not exist here
        };
      });
      const initialState = { foo: 'bar' };
      const action = someFlow.action('example');
      const reducers = test.getReducers();
      reducers[name](initialState, action);
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
