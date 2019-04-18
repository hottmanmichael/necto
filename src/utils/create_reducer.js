import isFunction from './is_function';

const callHandler = (handlers, state, action) => name => {
  try {
    const handler = handlers[name];
    return handler(state, action);
  } catch (e) {
    console.warn(
      `An error occurred while calling a reducer called: ${name}. The error stack trace is below.`
    );
    console.error(e);
  } finally {
    return state;
  }
};

const validateHandler = handlers => (name, action) =>
  handlers.hasOwnProperty(action[name]) && isFunction(handlers[action[name]]);

export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    const doValidateHandler = validateHandler(handlers, action);
    const doCallHandler = callHandler(handlers, state, action);
    if (doValidateHandler(action._actionType)) {
      return doCallHandler(action._actionType);
    } else if (doValidateHandler(action.type)) {
      return doCallHandler(action.type);
    } else {
      return state;
    }
  };
}
