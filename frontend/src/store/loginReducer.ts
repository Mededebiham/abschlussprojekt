import { User } from './types';
import { LoginState } from './types';

// Define the initial state for login
const initialState: LoginState = {
  isLoggedIn: false,
  user: null,
};

// Define action types
interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: {
    user: User;
  };
}

interface LogoutAction {
  type: 'LOGOUT';
}

type LoginActionTypes = LoginSuccessAction | LogoutAction;

// Define the login reducer
const loginReducer = (state: LoginState = initialState, action: LoginActionTypes): LoginState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      console.log("Logout action dispatched"); // Add this line
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

// Action creators
export const loginSuccess = (user: User) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      user: user,
    },
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};

export default loginReducer;
