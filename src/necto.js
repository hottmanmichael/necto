import regeneratorRuntime from 'regenerator-runtime';
import { all, fork } from 'redux-saga/effects';
import Case from 'case';
import doCreateFlow from './utils/create_flow';
import createSaga from './utils/create_saga';
import createReducer from './utils/create_reducer';
import getDefaultOptions from './default_options';
import isFunction from './utils/is_function';

class Necto {
  constructor(name, _options) {
    this.name = name; // Reducer Slice Key
    this.nameConstant = this.formatNameConstant(name);

    this.options = Object.assign(getDefaultOptions(), _options);

    this.InitialState = this._getInitialState(this.options.initialState);
    this.Constants = {};
    this.Actions = {};
    this.Reducers = {};
    this.Sagas = {};

    const initialFlows = this._getInitialFlows(doCreateFlow(this.name));
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
  _getInitialState(initialState) {
    const state = this.getInitialState() || {};
    return {
      ...state,
      ...initialState,
    };
  }
  getInitialState() {
    return {};
  }

  // @overrideable
  _getInitialFlows(createFlow) {
    let flows = this.getInitialFlows(createFlow, this);
    return Array.isArray(flows) ? flows : [];
  }
  getInitialFlows(createFlow) {
    return [];
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
