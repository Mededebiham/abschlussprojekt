// reducers.ts

import { combineReducers } from 'redux';
import { RootState } from './types';
import {User} from './types'
// Define initial state
const initialUserState: RootState = {
  isLoggedIn: false,
  user: null,
};

// Define action types
enum ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// Define action creators
export const login = (user: User) => ({
  type: ActionTypes.LOGIN as ActionTypes.LOGIN,
  payload: user,
});

export const logout = () => ({
  type: ActionTypes.LOGOUT as ActionTypes.LOGOUT,
});

// Define reducers
const userReducer = (state = initialUserState, action: any): RootState => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      console.log(action.payload);
      
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  user: userReducer,
});
export type LoginAction = ReturnType<typeof login>;

