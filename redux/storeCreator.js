import { createStore, applyMiddleware, compose } from 'redux';
import waterfall from 'promise-waterfall';
import { fromJS } from 'immutable';

import ApiClient from '../shared/request/ApiClient';
import reducers from './modules/reducers';
import clientMiddleware from './middleware/clientMiddleware';


import { initialState as test } from './modules/test';


const defaultState = {
  test,
};

export default function storeCreator(initialState = defaultState, isServer) {

  initialState = fromJS(initialState);

  const middleware = [
    clientMiddleware(new ApiClient(), waterfall),
  ];

  if (__DEVELOPMENT__) {

    let composeEnhancers = compose;

    if (!isServer && window) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    return createStore(reducers(), initialState, composeEnhancers(
      applyMiddleware(...middleware),
    ));
  }

  const store = createStore(reducers(), initialState, compose(
    applyMiddleware(...middleware),
  ));


  if (isServer && typeof window === 'undefined') {
    return store;
  } else {
    if (!window.store) {
      window.store = store;
    }
    return window.store;
  }
}
