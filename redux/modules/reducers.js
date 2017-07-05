import { combineReducers } from 'redux';
import test from './test';


export default () => {
  const appReducer = combineReducers({
    test,
  });

  return (state, action) => {
    return appReducer(state, action);
  };
};
