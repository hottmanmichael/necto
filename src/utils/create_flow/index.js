import Case from 'case';
import isFunction, { isGeneratorFunction } from '../is_function';
import ensureRequiredParams from '../ensure_required_params';
import createSaga from '../create_saga';
import { formatActionNames } from './format_names';
import throwIfMissing, { throwConditionalIfMissing } from '../throw_if_missing';

const defaultOptions = {
  requiredParams: [],
  interactionRequired: true,
};

export default key => {
  // FIXME: Should be customizable?
  let reducerKey = Case.constant(key);

  return function createFlow(
    createFlowName,
    createFlowPath = undefined,
    createFlowOptions = defaultOptions
  ) {
    // Merge with default options
    const options = Object.assign({}, defaultOptions, createFlowOptions);

    // Format names
    const { actionName, constantKey, actionType } = formatActionNames(
      createFlowName,
      reducerKey,
      options
    );

    // Determine Flow Path
    let boundReducer, boundSaga;
    const hasFlowPath = createFlowPath && isFunction(createFlowPath);

    if (hasFlowPath) {
      if (isGeneratorFunction(createFlowPath)) {
        boundSaga = createSaga(actionType, createFlowPath, createFlowOptions);
      } /* isReducer... */ else {
        boundReducer = createFlowPath;
      }
    }

    /*
      Dispatchable Action Creator

      Action object compliant with "Flux Standard Action"
      https://github.com/redux-utilities/flux-standard-action
    */
    const boundAction = function bindAction(
      interaction = throwConditionalIfMissing(
        options.interactionRequired,
        'interaction',
        actionType
      ),
      payload = {},
      meta = {}
    ) {
      if (options.interactionRequired && 'string' !== typeof interaction) {
        throw new Error(
          `Actions must contain an interaction description string as the first parameter.
          Expected a String, received ${interaction} instead.`
        );
      }

      let type = `[${actionType}]`;
      if ('string' === typeof interaction) {
        type += ` ${interaction}`;
      } else {
        const [_p, _m] = arguments;
        payload = _p;
        meta = _m;
        interaction = null;
      }

      // FIXME: Should this allow for non-object payload?
      var _payload = {
        payload,
      };

      // Handle Error Objects since spread syntax
      // won't spread error properties
      if (payload instanceof Error) {
        _payload = {
          message: payload.message,
          stack: payload.stack,
          error: true,
        }
      }

      return ensureRequiredParams({
        actionName: createFlowName,
        requiredParams: options.requiredParams,
        actionResult: {
          ..._payload,
          meta,
          type,
          _actionType: actionType, // Stays constant, is listened to by createReducer to update tree
          _interaction: interaction, // Describes an interaction
          _requiredParams: options.requiredParams,
          _async: !!(hasFlowPath && isGeneratorFunction(createFlowPath)),
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
