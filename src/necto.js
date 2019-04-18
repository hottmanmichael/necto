// import regeneratorRuntime from 'regenerator-runtime';
import Case from 'case';
import doCreateFlow from './utils/create_flow';
import createSaga from './utils/create_saga';
import createReducer from './utils/create_reducer';
import getOptions from './options';
import getInitialState from './utils/create_flow/state';
import getInitialFlows from './utils/create_flow/get_initial_flows';
import getArgs from './utils/get_args';
import isFunction from './utils/is_function';

class Necto {
  constructor(name, _options) {
    this.name = name; // Reducer Slice Key
    this.nameConstant = this.formatNameConstant(name);

    this.options = Object.assign(getOptions(), _options);

    this.InitialState = this.getInitialState(this.options.initialState);
    this.Constants = {};
    this.Actions = {};
    this.Reducers = {};
    this.Sagas = {};

    const initialFlows = this.getInitialFlows(doCreateFlow(this.name));
    if (Array.isArray(initialFlows)) {
      // FIXME: Validate that initialFlows is an array of flows?
      initialFlows.forEach(({ _internal }) => {
        this._attachFlow(_internal);
      });
    }
  }

  // Interface
  createFlow(...args) {
    const createFlow = doCreateFlow(this.name);
    const flow = createFlow.apply(this, args);
    const { _internal, ...restFlow } = flow;
    this._attachFlow(_internal);
    return restFlow;
  }

  addSaga(...args) {
    const saga = createSaga.apply(this, args);
    this._attachFlow({
      Saga: { [saga.constant]: saga.watch },
    });
    return saga;
  }

  addReducer(constant, reducerFn) {
    const validReducerArgs = ['state', 'action'];
    const reducerArgs = getArgs(reducerFn);

    if ('string' !== typeof constant) {
      throw new Error(
        `addReducer expected constant to be a string, instead got ${constant}`
      );
    }

    if (!isFunction(reducerFn)) {
      throw new Error(
        `addReducer expected a function, instead got ${reducerFn}`
      );
    }

    if (JSON.stringify(reducerArgs) !== JSON.stringify(validReducerArgs)) {
      throw new Error(
        `addReducer expected the reducer function to have two arguments (state, action), instead got ${reducerArgs}`
      );
    }

    this._attachFlow({
      Reducer: { [constant]: reducerFn },
    });
  }

  getSagas() {
    let sagas = [];
    Object.keys(this.Sagas).forEach(saga => {
      const forkable = this.Sagas[saga].watch;
      sagas.push(fork(forkable));
    });
    return all(sagas);
  }

  getReducers() {
    return {
      [this.name]: createReducer(this.InitialState, this.Reducers),
    };
  }

  // @overrideable
  formatNameConstant(name) {
    return Case.constant(name);
  }
  // @overrideable
  getInitialState(initialState) {
    return getInitialState(initialState);
  }
  // @overrideable
  getInitialFlows(createFlow) {
    return getInitialFlows(createFlow, this);
  }

  /**
   * Private Methods
   */

  _attachFlow(flow) {
    if (flow.Constant) {
      this.Constants = {
        ...this.Constants,
        ...flow.Constant,
      };
    }

    if (flow.Action) {
      this.Actions = {
        ...this.Actions,
        ...flow.Action,
      };
    }

    if (flow.Reducer) {
      this.Reducers = {
        ...this.Reducers,
        ...flow.Reducer,
      };
    }

    if (flow.Saga) {
      this.Sagas = {
        ...this.Sagas,
        ...flow.Saga,
      };
    }
  }
}

export default Necto;
