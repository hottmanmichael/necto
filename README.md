# Necto

Necto compliments Redux by providing a composable, declarative api to create flows through redux (Action -> Reducer or Action -> Saga). The goal of Necto is to reduce boilerplate, simplify and standardize action creators, and group action logic so that your team can write and build new features in Redux faster and more efficienly at scale.

## Inspiration

Redux is a wonderful library with infinite possibilities, however [having too many possibilities makes decision making much harder](https://en.wikipedia.org/wiki/Overchoice). There seems to be growing sentiment across the redux community that there is [`"too much boilerplate", "action constants and action creators aren't needed", "I have to edit too many files to add a feature", "why do I have to switch files to get to my write logic?", "the terms and names are too hard to learn or are confusing", etc...`](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/) and I have personally felt similar pains when trying to make decisions about how to structure and standard redux across various code bases. After spending many sleepless nights thinking about this problem, hacking together semi-standardized patterns, as well as reading several articles that influenced an opinion that Redux actions should be declarative, not imperative, this project was created as an attempt to solve the world's problems. In reality, it was created to enforce standards around how to structure Redux, enforce the idea that actions should describe a behavior or a user interaction rather than give a set of instructions (declarative vs imperative), reduce the amount of boilerplate and files in a Redux app, radically simplify asynchronous actions when using [Sagas](https://redux-saga.js.org/), and most of all, create a simple API that makes writing Redux composable, readable, standardized, and painless.

## How does Necto solve these issues?

In the wild west of Redux land, there are many ways to structure your Redux project. The following is the most basic example of structuring a redux action, reducer, and asynchronous saga. _I understand there are many other ways to setup Redux, such as the [Advanced Section of the Redux documentation](https://redux.js.org/recipes/structuring-reducers/structuring-reducers#structuring-reducers), however in my opinion these pattern still allow for too many possibilities that are difficult to enforce across a larger team and code base._

### Old Way

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

### Necto Way

Creating a Necto Instance

```js
import Necto from 'necto';

const Users = new Necto('users', {
  initialState: {
    foo: 'bar',
    bar: 'foo',
  },
});

Users.createFlow(
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

Users.createFlow(
  'someOtherAsyncAction',
  function*(action) {
    try {
      let { bar } = action.payload;
      // Some saga logic here
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
import Users from './path-to-users-necto';

store.dispatch(
  Users.Actions.someAction(
    'User clicked some button',
    { foo: 'foo' },
    { someMeta: 'someMeta' }
  )
);
/*
  Dispatched Action 

  {
    payload: {
      foo: 'foo',
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

*/
```
