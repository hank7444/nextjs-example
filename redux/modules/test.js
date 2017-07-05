import { fromJS } from 'immutable';
import { test as cons } from '../constants';

export const initialState = fromJS({
  getList: false,
  getListSuc: false,
  getListErr: false,
  counter: 0,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case cons.GET_LIST:
      return state.merge({
        getList: false,
        getListSuc: false,
        getListErr: false,
      });

    case cons.GET_LIST_SUCCESS: {
      return state.merge({
        getList: false,
        getListSuc: true,
        getListErr: false,
      });
    }
    case cons.GET_LIST_FAIL:
      return state.merge({
        getList: false,
        getListSuc: false,
        getListErr: action.error,
      });

    case cons.ADD_COUNTER:
      return state.merge({
        counter: state.get('counter') + 1,
      });

    default:
      return state;
  }
}

export function addCounter() {
  return {
    type: cons.ADD_COUNTER,
  };
}
