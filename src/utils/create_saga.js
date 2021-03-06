import regeneratorRuntime from 'regenerator-runtime';
import {
  all,
  fork,
  takeEvery,
  takeLatest,
  takeLeading,
  takeMaybe,
} from 'redux-saga/effects';
import isFunction, { isGeneratorFunction } from './is_function';
import throwIfMissing from './throw_if_missing';

const defaultOptions = {
  yield: 'takeEvery',
  getWatch: undefined,
};

const validYields = ['takeEvery', 'takeLatest', 'takeLeading'];

const getPattern = constant => action => {
  return action._actionType === constant;
};

const getMethod = methodName => {
  switch (methodName) {
    case 'takeEvery':
      return takeEvery;
    case 'takeLatest':
      return takeLatest;
    case 'takeLeading':
      return takeLeading;
    case 'takeMaybe':
      return takeMaybe;
    default:
      return takeEvery;
  }
};

function createSaga(
  constant = throwIfMissing('constant', 'createSaga'),
  fn = throwIfMissing('fn', 'createSaga'),
  _options = defaultOptions
) {
  if ('string' !== typeof constant) {
    throw new Error(
      `The argument (${constant}) passed into createSaga is not a valid parameter. Constant must be a String.`
    );
    return;
  }

  if (!isGeneratorFunction(fn)) {
    throw new Error(
      `The argument (${fn}) passed into createSaga is not a valid parameter. Fn must be valid generator function.`
    );
    return;
  }

  const options = Object.assign({}, defaultOptions, _options);

  var watch;
  if (options.getWatch && isFunction(options.getWatch)) {
    watch = options.getWatch(constant, fn, options);
  } else {
    let method = options.yield;
    if (!validYields.includes(method)) method = defaultOptions.yield;
    let callableMethod = getMethod(method);
    watch = function* watch() {
      yield callableMethod(getPattern(constant), fn);
    };
  }

  return {
    fn,
    watch,
    constant,
  };
}

export default createSaga;
