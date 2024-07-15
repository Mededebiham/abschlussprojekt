// registerReducer.ts
import { Reducer } from 'redux';

// Define the interface for the register state
interface RegisterState {
  isRegistered: boolean;
  // Add more register-related fields as needed
}

// Define the initial state for register
const initialState: RegisterState = {
  isRegistered: false,
};

// Define the register reducer
const registerReducer: Reducer<RegisterState> = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isRegistered: true,
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isRegistered: false,
      };
    default:
      return state;
  }
};

export default registerReducer;
