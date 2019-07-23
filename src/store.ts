import { Store, createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { state, State } from './reducers';
import createSagaMiddleware from 'redux-saga';
import templateSagaWatcher from './sagas/templateSagaWatcher';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

export const store: Store<State> = createStore(
  state,
  composeEnhancers(
    applyMiddleware(reduxThunk, sagaMiddleware),
  )
);
sagaMiddleware.run(templateSagaWatcher);
