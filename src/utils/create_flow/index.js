import isFunction, { isGeneratorFunction } from '../is_function';
import ensureRequiredParams from '../ensure_required_params';
import getArgs from '../get_args';
import createSaga from '../create_saga';
import { formatActionNames } from './format_names';
import throwIfMissing from '../throw_if_missing';

const defaultOptions = {
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
      Determine Flow Path
    */
    let boundReducer, boundSaga;
    const hasFlowPath = createFlowPath && isFunction(createFlowPath);
    const flowPathArgs = getArgs(createFlowPath);
    const reducerArgs = ['state', 'action'];
    const sagaArgs = ['action'];
    const matchesReducerArgs =
      JSON.stringify(flowPathArgs) === JSON.stringify(reducerArgs);
    const matchesSagaArgs =
      JSON.stringify(flowPathArgs) === JSON.stringify(sagaArgs);

    if (hasFlowPath) {
      // Create either a reducer or a saga based oon the createFlowPath param
      // This is an intentional design pattern to ensure a flow either triggers
      // a series of actions and async operations with a saga, or triggers an
      // update to the state tree with a reducer. This checks param names to
      // rather than length to enforce consitency and readability for createFlow.
      if (matchesReducerArgs) {
        if (isGeneratorFunction(createFlowPath)) {
          throw new Error(
            `Could not create a valid flow path for ${actionType}. Reducer cannot be a generator function.`
          );
        } else {
          boundReducer = createFlowPath;
        }
      } else if (matchesSagaArgs) {
        if (!isGeneratorFunction(createFlowPath)) {
          throw new Error(
            `Could not create a valid flow path for ${actionType}. Saga must be a generator function.`
          );
        } else {
          boundSaga = createSaga(actionType, createFlowPath, createFlowOptions);
        }
      } else {
        throw new Error(
          `Could not create a valid flow path for ${actionType}. Expected either (state, action) for a reducer or (action) for a saga, received ${flowPathArgs} instead.`
        );
      }
    }

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
          _async: !!(hasFlowPath && matchesSagaArgs),
        },
      });
    };

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
