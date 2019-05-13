import isFunction from './is_function';

export const callHandler = (handlers, state, action) => name => {
  let value = state;
  try {
    const reducer = handlers[action[name]];
    value = reducer(state, action);
  } catch (e) {
    const error = new Error(
      `An error occurred while calling the reducer for ${action[name]}. ${
        e.stack
      }`
    );
    error.stack = e.stack;
    console.error(error);
  }
  return value;
};

export const validateHandler = (handlers, action) => name =>
  handlers &&
  action &&
  action[name] &&
  handlers.hasOwnProperty(action[name]) &&
  isFunction(handlers[action[name]]);

export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    const isHandlerValid = validateHandler(handlers, action);
    const doCallHandler = callHandler(handlers, state, action);
    if (isHandlerValid('_actionType')) {
      return doCallHandler('_actionType');
    } else if (isHandlerValid('type')) {
      return doCallHandler('type');
    } else {
      return state;
    }
  };
}
