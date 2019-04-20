import ensureRequiredParams from './ensure_required_params';

describe('ensureRequiredParams', () => {
  const baseAction = {
    type: 'TEST_TYPE',
  };

  describe('Core Functionality', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return the action result if no params are given', () => {
      let actionResult = Object.assign({}, baseAction, {
        payload: {},
        meta: null,
      });

      let resultA = ensureRequiredParams({
        actionResult,
        actionName: 'someAction',
        requiredParams: null,
      });
      expect(resultA).toBe(actionResult);

      let resultB = ensureRequiredParams({
        actionResult,
        actionName: 'someAction',
        requiredParams: undefined,
      });
      expect(resultB).toBe(actionResult);

      let resultC = ensureRequiredParams({
        actionResult,
        actionName: 'someAction',
        requiredParams: false,
      });
      expect(resultC).toBe(actionResult);

      let resultD = ensureRequiredParams({
        actionResult,
        actionName: 'someAction',
      });
      expect(resultD).toBe(actionResult);
    });

    it('should return the action if params are given', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      let actionResult = Object.assign({}, baseAction, {
        payload: {},
        meta: null,
      });

      let resultA = ensureRequiredParams({
        actionResult,
        requiredParams: { payload: ['foo'] },
        actionName: 'someAction',
      });
      expect(resultA).toBe(actionResult);

      let resultB = ensureRequiredParams({
        actionResult,
        requiredParams: ['foo'],
        actionName: 'someAction',
      });
      expect(resultB).toBe(actionResult);
    });

    it('should return the action even if a console error is thrown', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      let actionResult = Object.assign({}, baseAction, {
        payload: {},
        meta: null,
      });

      let resultA = ensureRequiredParams({
        actionResult,
        requiredParams: ['payload.foo'],
        actionName: 'someAction',
      });
      expect(resultA).toBe(actionResult);

      let resultB = ensureRequiredParams({
        actionResult,
        requiredParams: { payload: ['foo'], meta: ['bar', 'foo'] },
        actionName: 'someAction',
      });
      expect(resultB).toBe(actionResult);
    });

    describe('Array Pattern', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw a console error if the action is called without required payload actions', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: null,
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: ['payload.foo'],
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
      });

      it('should throw a console error if the action is called without required meta actions', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: ['meta.foo'],
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
      });

      it('should throw a multiple console errors if called without required multiple payload params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: ['payload.foo', 'payload.bar'],
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(2);
      });

      it('should throw a multiple console errors if called without required multiple payload and meta params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: [
            'payload.foo',
            'payload.bar',
            'meta.foo',
            'meta.bar',
          ],
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(4);
      });

      it('should throw an error for a nested array value foo[0].bar', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {
            foo: ['bar', 'car', 'gnar'],
          },
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: ['payload.foo[0].boo', 'payload.foo[2].car'],
          actionName: 'someAction',
        });
        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(2);
      });

      it('should not throw an error for a valid nested array value foo[0].bar', () => {
        jest.spyOn(global.console, 'error').mockImplementation(a => {
          console.log(a);
        });

        let actionResult = Object.assign({}, baseAction, {
          payload: {
            foo: [{ bar: 'foo' }, 'car'],
          },
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: ['payload.foo[0].bar', 'payload.foo[1]'],
          actionName: 'someAction',
        });

        expect(console.error).not.toBeCalledWith(expect.any(Error));
        // expect(console.error).to / HaveBeenCalledTimes(2);
      });
    });

    describe('Object Pattern', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw a console error if the action is called without required payload params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: null,
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: {
            payload: ['foo'],
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
      });

      it('should throw a console error if the action is called without required meta params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: {
            meta: ['foo'],
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
      });

      it('should throw multiple console errors if called without multiple required payload params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: {
            payload: ['foo', 'bar'],
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(2);
      });

      it('should throw multiple console errors if called without required multiple payload and meta params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: {
            payload: ['foo', 'bar'],
            meta: ['foo', 'bar'],
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(4);
      });
    });

    describe('Function Pattern', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should accept a function as the requirestParams option', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: () => {},
          actionName: 'someAction',
        });
      });

      it('should throw a console error if the action is called without required payload params', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: action => {
            return ['payload.foo'];
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(1);
      });

      it('should allow conditional payload params with a function', () => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        let actionResult = Object.assign({}, baseAction, {
          payload: {
            foo: 'foo',
            bar: 'bar',
            bang: 'bang',
          },
          meta: {},
        });

        ensureRequiredParams({
          actionResult,
          requiredParams: action => {
            return action.payload.foo && action.payload.bar
              ? { payload: ['bang'] }
              : null;
          },
          actionName: 'someAction',
        });

        expect(console.error).not.toBeCalledWith(expect.any(Error));

        let secondActionResult = Object.assign({}, baseAction, {
          payload: {},
          meta: {
            foo: 'foo',
            bar: 'bar',
          },
        });

        ensureRequiredParams({
          actionResult: secondActionResult,
          requiredParams: action => {
            return action.meta.foo && action.meta.bar
              ? { payload: ['bang'] }
              : null;
          },
          actionName: 'someAction',
        });

        expect(console.error).toBeCalledWith(expect.any(Error));
      });
    });
  });

  describe('Parameter Validation', () => {
    it('should throw if no action name is provided', () => {
      expect(() => {
        ensureRequiredParams({});
      }).toThrow();

      expect(() => {
        ensureRequiredParams({
          actionName: null,
        });
      }).toThrow();

      expect(() => {
        ensureRequiredParams({
          actionName: false,
        });
      }).toThrow();

      expect(() => {
        ensureRequiredParams({
          actionName: 'test',
          actionResult: {},
        });
      }).not.toThrow();
    });

    it('should throw if no action result is provided', () => {
      expect(() => {
        ensureRequiredParams({ actionName: 'name' });
      }).toThrow();
      expect(() => {
        ensureRequiredParams({ actionName: 'name', actionResult: undefined });
      }).toThrow();
      expect(() => {
        ensureRequiredParams({ actionName: 'name', actionResult: 'test' });
      }).not.toThrow();
      expect(() => {
        ensureRequiredParams({ actionName: 'name', actionResult: {} });
      }).not.toThrow();
    });
  });
});
