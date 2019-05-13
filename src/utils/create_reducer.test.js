import createReducer, { callHandler, validateHandler } from './create_reducer';

describe('Create Reducer', () => {
  describe('No Handlers', () => {
    const handlers = {};
    const initialState = { foo: 'bar' };
    const reducer = createReducer(initialState, handlers);

    it('should return a reducer function when given zero handlers', () => {
      expect(reducer).toEqual(expect.any(Function));
    });

    it('should return the initial state when no handlers are given and the reducer is called without a new state', () => {
      const action = { type: 'TEST' };
      expect(reducer(undefined, action)).toEqual({ ...initialState });
    });

    it('should return the next state when no handlers are given', () => {
      const nextState = { bar: 'foo' };
      const action = { type: 'TEST' };
      expect(reducer(nextState, action)).toEqual({ ...nextState });
    });
  });

  describe('Calling Handlers', () => {
    const initialState = { foo: 'bar' };
    const handlers = {
      A: jest.fn(),
      B: jest.fn(),
    };
    const reducer = createReducer(initialState, handlers);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the state when _actionType and type are not in the action', () => {
      const nextState = { bar: 'foo' };
      const action = { payload: 'test' };
      expect(reducer(nextState, action)).toEqual({ ...nextState });
    });

    it('should use _actiontype over type when both are present in the action', () => {
      const nextState = { bar: 'foo' };
      const action = { _actionType: 'A', type: 'B' };
      reducer(nextState, action);
      expect(handlers.A).toHaveBeenCalledWith(nextState, action);
      expect(handlers.B).not.toHaveBeenCalled();
    });

    it('should use type when _actionType is not present in the action', () => {
      const nextState = { bar: 'foo' };
      const action = { type: 'B' };
      reducer(nextState, action);
      expect(handlers.A).not.toHaveBeenCalled();
      expect(handlers.B).toHaveBeenCalledWith(nextState, action);
    });
  });

  describe('Using callHandler', () => {
    const initialState = { foo: 'bar' };
    const handlers = {
      A: jest.fn().mockImplementation((state, action) => ({
        ...state,
        A: true,
      })),
      B: jest.fn().mockImplementation((state, action) => ({
        ...state,
        B: true,
      })),
      C: jest.fn().mockImplementation(() => ({
        C: true,
      })),
      failure: jest.fn().mockImplementation((state, action) => ({
        fail: action.should.fail.the.test,
      })),
    };
    const reducer = createReducer(initialState, handlers);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call the correct handler and return the value of the handler implementation', () => {
      const nextState = { bar: 'foo' };
      const action = { _actionType: 'A', type: 'B' };
      const doCallHandler = callHandler(handlers, nextState, action);
      expect(doCallHandler('_actionType')).toEqual({ ...nextState, A: true });
    });

    it('should not modify the return value of the handler', () => {
      const nextState = { bar: 'foo' };
      const action = { _actionType: 'C', type: 'B', actionType: 'A' };
      const doCallHandler = callHandler(handlers, nextState, action);
      expect(doCallHandler('_actionType')).toEqual({ C: true });
    });

    it('should console.error an error when reducer handler fails to run', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const nextState = { bar: 'foo' };
      const action = { _actionType: 'failure' };
      const doCallHandler = callHandler(handlers, nextState, action);
      doCallHandler('_actionType');
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should still return the state value when a reducer handler errors', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const nextState = { bar: 'foo' };
      const action = { _actionType: 'failure' };
      const doCallHandler = callHandler(handlers, nextState, action);
      expect(doCallHandler('_actionType')).toEqual({ ...nextState });
    });
  });
});
