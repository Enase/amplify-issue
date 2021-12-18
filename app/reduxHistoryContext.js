import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history,
  savePreviousLocations: 5,
});
export default { createReduxHistory, routerMiddleware, routerReducer };
