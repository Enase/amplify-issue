import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import Amplify from 'aws-amplify';
import 'sanitize.css/sanitize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import amplifyConfig from './amplifyConfig';
import './assets/styles/base.scss';
// Import root app

// Create redux store with history
import { history, store } from './store';

// configure and register aws amplify
Amplify.Logger.LOG_LEVEL = process.env.AMPLIFY_LOGGER_LOG_LEVEL;
Amplify.configure(amplifyConfig);

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <React.StrictMode>
          <div>Hello world</div>
        </React.StrictMode>
      </Router>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  // module.hot.accept(['./containers/Main'], () => {
  //   ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  //   render();
  // });
}

render();

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  /* eslint-disable global-require */
  /* eslint-disable import/no-extraneous-dependencies */
  const runtime = require('@lcdp/offline-plugin/runtime');
  /* eslint-enable global-require */
  /* eslint-enable import/no-extraneous-dependencies */
  runtime.install({
    onInstalled: () => {
      // console.log('SW Event:', 'onInstalled');
    },
    onUpdating: () => {
      // console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      // Reload the web-page to load into the new version
      // if (!confirm('Website was updated, do you want to reload page to get the updates?')) { // eslint-disable-line
      //   return;
      // }
      window.location.reload();
    },

    onUpdateFailed: () => {
      // console.log('SW Event:', 'onUpdateFailed');
    },
  });
}
