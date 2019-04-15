import isFunction from '../is_function';
import ensureRequiredParams from '../ensure_required_params';
import getArgs from '../get_args';
import createSaga from '../create_saga';
import { formatActionNames } from './format_names';
import throwIfMissing from '../throw_if_missing';

const defaultOptions = {
  async: false,
  requiredParams: [],
};

export default key => {
  // FIXME: Should be customizable?
  let reducerKey = key.toUpperCase();

  return function createFlow(
    createFlowName,
    createFlowPath = undefined,
    createFlowOptions = defaultOptions
  ) {
    // Merge with default options
    const options = Object.assign({}, defaultOptions, createFlowOptions);

    // Format namesd
    const { actionName, constantKey, actionType } = formatActionNames(
      createFlowName,
      reducerKey,
      options
    );

    /* 
      Dispatchable Action Creator 

      Action object compliant with "Flux Standard Action"
      https://github.com/redux-utilities/flux-standard-action
    */
    const boundAction = function bindAction(
      interaction = throwIfMissing('interaction', actionType),
      payload = {},
      meta = null
    ) {
      if ('string' !== typeof interaction) {
        throw new Error(
          `Actions must contain an interaction description string as the first parameter.
          Expected a String, received ${interaction} instead.`
        );
      }

      var _payload = {
        payload,
      };

      if (payload instanceof Error) _payload.error = true;

      return ensureRequiredParams({
        actionName: createFlowName,
        requiredParams: options.requiredParams,
        actionResult: {
          ..._payload,
          meta,
          type: `[${actionType}] ${interaction}`,
          _actionType: actionType, // Stays constant, is listened to by createReducer to update tree
          _interaction: interaction, // Describes an interaction
          _requiredParams: options.requiredParams,
        },
      });
    };

    /* 
      Saga or Reducer
    */
    let boundReducer, boundSaga;
    const hasFlowPath = createFlowPath && isFunction(createFlowPath);
    const flowPathArgs = getArgs(createFlowPath);

    if (hasFlowPath) {
      let reducerArgs = ['state', 'action'];
      let sagaArgs = ['action'];

      // Create either a reducer or a saga based oon the createFlowPath param
      // This is an intentional design pattern to ensure a flow either triggers
      // a series of actions and async operations with a saga, or triggers an
      // update to the state tree with a reducer. This checks param names to
      // rather than length to enforce consitency and readability for createFlow.
      if (JSON.stringify(flowPathArgs) === JSON.stringify(reducerArgs)) {
        boundReducer = createFlowPath;
      } else if (JSON.stringify(flowPathArgs) === JSON.stringify(sagaArgs)) {
        boundSaga = createSaga(actionType, createFlowPath, createFlowOptions);
      } else {
        throw new Error(
          `Could not create a valid flow path for ${actionType}. 
          Expected either (state, action) for a reducer or (action) for a saga, received ${flowPathArgs} instead.`
        );
      }
    }

    return {
      // Returned from flow creator
      actionName,
      actionType,
      saga: boundSaga,
      action: boundAction,
      reducer: boundReducer,

      // Internal API
      // Used to spread onto existing Necto class properties
      _internal: {
        Constant: { [constantKey]: actionType },
        Action: { [actionName]: boundAction },
        Reducer: boundReducer && { [actionType]: boundReducer },
        Saga: boundSaga && { [actionType]: boundSaga },
      },
    };
  };
};
