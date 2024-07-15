import { combineReducers } from 'redux';
import  loginReducer  from './loginReducer';
import  registerReducer  from './registerReducer';

// Define the root reducer by combining multiple reducers
const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export default rootReducer;
