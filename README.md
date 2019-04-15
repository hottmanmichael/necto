# Necto

Necto compliments Redux by providing a composable, declarative api to create flows through redux (Action -> Reducer or Action -> Saga). The goal of Necto is to reduce boilerplate, simplify and standardize action creators, and group action logic so that your team can write and build new features in Redux faster and more efficienly at scale.

## Key Goals

- Work alongside existing redux implementations
- Work with Redux Dev-tools (cause les be honest, this is the real reason we all love Redux)
- Establish a pattern for "interaction" focused actions while maintaining Flux Standard Action practices
- Reduce boilerplate needed to build new slices of the state and write new features
- Standardize action creator objects
- Simplify asynchronous flows that are dispatched from redux actions

## Inspiration

Redux is a wonderful library with infinite possibilities, however [having too many possibilities makes decision making much harder](https://en.wikipedia.org/wiki/Overchoice). There seems to be growing sentiment across the redux community that there is [`"too much boilerplate", "action constants and action creators aren't needed", "I have to edit too many files to add a feature", "why do I have to switch files to get to my write logic?", "the terms and names are too hard to learn or are confusing", etc...`](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/) and I have personally felt similar pains when trying to make decisions about how to structure and standard redux across various code bases. After spending many sleepless nights thinking about this problem, hacking together semi-standardized patterns, as well as reading several articles that influenced an opinion that Redux actions should be declarative, not imperative, this project was created as an attempt to solve the world's problems. In reality, it was created to enforce standards around how to structure Redux, enforce the idea that actions should describe a behavior or a user interaction rather than give a set of instructions (declarative vs imperative), reduce the amount of boilerplate and files in a Redux app, radically simplify asynchronous actions when using [Sagas](https://redux-saga.js.org/), and most of all, create a simple API that makes writing Redux composable, readable, standardized, and painless.

## How does Necto solve these issues?

In the wild west of Redux land, there are many ways to structure your Redux project. The following is the most basic example of structuring a redux action, reducer, and asynchronous saga. _I understand there are many other ways to setup Redux, such as the [Advanced Section of the Redux documentation](https://redux.js.org/recipes/structuring-reducers/structuring-reducers#structuring-reducers), however in my opinion these pattern still allow for too many possibilities that are difficult to enforce across a larger team and code base._

## Old Way

```js
// users/index
import Constants from './constants';
import * as Actions from './actions';
import Reducer from './reducer';
import Sagas from './sagas';
```

```js
// users/constants.js
export default {
  SOME_ACTION: 'USERS/SOME_ACTION',
  SOME_OTHER_ASYNC_ACTION: 'USERS/SOME_OTHER_ASYNC_ACTION',
};
```

```js
// users/actions.js
import Constants from './constants';
export const someAction = foo => ({
  type: Constants.SOME_ACTION,
  foo,
});

export const someOtherAsyncAction = bar => ({
  type: Constants.SOME_OTHER_ASYNC_ACTION,
  bar,
});
```

```js
// users/reducer.js
import Constants from './constants';

const INITIAL_STATE = {
  foo: 'bar',
  bar: 'foo',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Constants.SOME_ACTION:
      return {
        ...state,
        foo: action.foo,
      };
    default:
      return state;
  }
};
```

```js
// users/sagas.js
import regeneratorRuntime from 'regenerator-runtime';
import { put } from 'redux-saga/effects';
import Constants from './constants';

function* someOtherAsyncAction(action) {
  try {
    let { bar } = action;
    // Some saga logic here
  } catch (e) {}
}

export function* watchSomeOtherAsyncAction() {
  yield takeEvery(Constants.SOME_OTHER_ASYNC_ACTION, someOtherAsyncAction);
}

export default all([fork(watchSomeOtherAsyncAction)]);
```

## Necto Way

Creating a Necto Instance

```js
import Necto from 'necto';

const users = new Necto('users', {
  initialState: {
    foo: 'bar',
    bar: 'foo',
  },
});

users.createFlow(
  'someAction',
  (state, action) => ({
    ...state,
    foo: action.payload.foo,
  }),
  {
    requiredParams: {
      payload: ['foo'],
      meta: null,
    },
  }
);

users.createFlow(
  'someOtherAsyncAction',
  function*(action) {
    try {
      let { bar } = action.payload;
      // Any saga logic here
      console.log('What data?', bar);
    } catch (e) {}
  },
  {
    requiredParams: {
      payload: ['bar'],
    },
  }
);
```

Using a Necto Instance

```js
import users from './path-to-users-necto';

store.dispatch(
  users.Actions.someAction(
    'User clicked some button',
    { foo: 'someFooChange' },
    { someMeta: 'someMeta' }
  )
);
/*
  Dispatched Action 

  {
    payload: {
      foo: 'someFooChange',
    },
    meta: {
      someMeta: 'someMeta',
    },
    type: '[USERS/SOME_ACTION] User clicked some button',
    _actionType: 'USERS/SOME_ACTION',
    _interaction: 'User clicked some button',
    _requiredParams: {
      payload: ['foo'],
      meta: null
    }
  }

  Next State
  {
    foo: 'someFooChange',
    bar: 'foo',
  }
*/

store.dispatch(
  users.Actions.someOtherAsyncAction('User fetched some data', {
    bar: 'some data!',
  })
);
/*
  Dispatched Action 

  {
    payload: {
      bar: 'some data!'
    },
    meta: undefined,
    type: '[USERS/SOME_OTHER_ASYNC_ACTION] User fetched some data',
    _actionType: 'USERS/SOME_OTHER_ASYNC_ACTION',
    _interaction: 'User fetched some data',
    _requiredParams: {
      payload: ['bar'],
      meta: null
    }
  }

  Console

  : What data? some data

*/
```

---

# Use

## Install

`$ npm install --save necto`

## Using Necto With Redux

```js
// store/some_model.js
const someModel = new Necto('someModel');
export default someModel;
```

### Connecting to Your Store

```js
// store/combine_reducers.js
import { combineReducers } from 'redux';

import SomeModel from './some_model';

export default combineReducers({
  // other reducers
  ...SomeModel.getReducers(), // returns {'someModel': someModel.Reducers}
  // other reducers (even non-necto!) reducers
});

/*
  Store at @@INIT is
  {
    someModel: initialState
  }
*/
```

### Connecting to Your Saga Middleware

```js
// store/combine_sagas.js
import regeneratorRuntime from 'regenerator-runtime';
import { all } from 'redux-saga/effects';

import SomeModel from './some_model';

export default function* rootSaga() {
  yield all([
    // other sagas
    SomeModel.getSagas(),
    // other sagas
  ]);
}
```

---

# Concepts

##### Reducer Key / Reducer Slice / Name

- This key or name is the slice of the store that sits on the top level

##### Flow

- A flow is an `action => flowPath` combination
- Flows are analogous to a redux action and can be dispatched just like a Redux action, however they imply that based on an action, one of two things occur: **1)** A reducer updates some part of the store or **2)** An asynchronous saga is started

##### Flow Path

- A flow path is either a reducer function or an asynchronous saga function.

##### Saga

- An asynchronous path that is triggered from the dispatch of an action
- https://redux-saga.js.org/
- Necto mostly makes use of takeEvery and takeLatest in redux-saga, however also lets you specify your own ["watcher"](https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html) function to customize any saga flows.

---

# API

### `new Necto(name, [options])`

##### Arguments

- `name` (_String_): Name of your reducer key
- `[options]` (_Object_):
  - `initialState` (_any_): The initial state for this slice of the store

### `createFlow(name, flowPath, [options])`

##### Arguments

- `name` (_String_): Action function name (only valid function names allowed)
- `flowPath` (_Function_): defined as either `function (state, action)` OR `function*(action)`. Necto checks the actual names of the arguemnts that are passed into this function and decides what type of flow path to create. e.g. `function (a, b)` will throw an error on flow creation.

  1. Reducer Function: Takes the paramters `(state, action)` and should return a new slice of the state
  2. Saga Generator Function: Takes the parameter (action), should be a generator function (`function*() {}`) and can handle any asynchronous code that a normal saga function can.

- `[options]` (_Object_): Optional
  - `requiredParams` (_Object_ or _Array {String}_):
    - `payload` (_Array {String}_): Any required payload parameters specified as dot-notation, like lodash.get. Validates if key exists and is not null or undefined.
    - `meta` (_Array {String}_): Any required meta parameters specified as dot-notation, like lodash.get. Validates if key exists and is not null or undefined.
    - \*\* `requiredParams` can also be provided as an array of strings. Instead of `{payload: ['foo'], meta: ['bar']}`, you can pass in `['payload.foo','meta.bar']`

---

# Other

### What does Necto mean?

Verb
nectō (present infinitive nectere, perfect active nexī, supine nexum); third conjugation

1. I bind, tie, fasten, connect, interweave, attach; unite; relate.
1. I bind by obligation, oblige, make liable.
1. I contrive, devise, compose, produce.

### Future Plans

- TODO...
