import * as React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { App } from './app';
import { TemplatesContainer } from './components/templates/templatesContainer';

import { Provider } from 'react-redux';
import { store } from './store';

export const AppRouter: React.StatelessComponent<{}> = () => {

  return (
    <Provider store={store}>
      <Router>
        <div>
          <Route component={App} />
          <Switch>
            <Route component={TemplatesContainer} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}