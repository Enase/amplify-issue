/* eslint-disable import/no-import-module-exports */
import { applyMiddleware, compose, createStore } from 'redux';
import createReduxPromiseListener from 'redux-promise-listener';
import createSagaMiddleware from 'redux-saga';
import reduxHistoryContext from './reduxHistoryContext';
import createReducer from './reducers';

/**
 * Create the store with dynamic reducers
 */

const { createReduxHistory, routerMiddleware } = reduxHistoryContext;

const initialState = {};

let composeEnhancers = compose;
const reduxSagaMonitorOptions = {};

// If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
  /* eslint-disable no-underscore-dangle */
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  }

  // NOTE: Uncomment the code below to restore support for Redux Saga
  // Dev Tools once it supports redux-saga version 1.x.x
  // if (window.__SAGA_MONITOR_EXTENSION__)
  //   reduxSagaMonitorOptions = {
  //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
  //   };
  /* eslint-enable */
}

const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const reduxPromiseListener = createReduxPromiseListener();

// Create the store with middlewares
// 1. sagaMiddleware: Makes redux-sagas work
// 2. routerMiddleware: Syncs the location/URL path to the state
// 3. reduxPromiseListener: https://github.com/erikras/redux-promise-listener
const middlewares = [routerMiddleware, sagaMiddleware, reduxPromiseListener.middleware];

const enhancers = [applyMiddleware(...middlewares)];

const store = (() => {
  const initialStore = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );
  // Extensions
  initialStore.runSaga = sagaMiddleware.run;
  initialStore.injectedReducers = {}; // Reducer registry
  initialStore.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }
  return initialStore;
})();

const promiseListener = reduxPromiseListener;

const history = createReduxHistory(store);

export {
  store,
  promiseListener,
  history,
};
