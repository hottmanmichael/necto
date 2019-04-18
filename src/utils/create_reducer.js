import isFunction from './is_function';

export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (
      handlers.hasOwnProperty(action._actionType) &&
      isFunction(handlers[action._actionType])
    ) {
      return handlers[action._actionType](state, action);
    } else if (
      handlers.hasOwnProperty(action.type) &&
      isFunction(handlers[action.type])
    ) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
