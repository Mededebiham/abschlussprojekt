// store.ts
import { createStore, combineReducers } from 'redux';
import loginReducer from './loginReducer'; 
import {LoginState} from './types'
// Import other reducers if you have them

// Define RootState based on the combined state of all reducers
export interface RootState {
  login: LoginState;
  // Add other state slices from other reducers if needed
}

// Combine reducers
const rootReducer = combineReducers({
  login: loginReducer,
  // Add other reducers here if you have them
});

// Create the Redux store using the rootReducer
const store = createStore(rootReducer);

export default store;

// import { createStore } from 'redux';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import { rootReducer } from './reducers';

// // Configuration for redux-persist
// const persistConfig = {
//   key: 'root',
//   storage,
// };

// // Wrap the root reducer with redux-persist
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create the Redux store using the persisted reducer
// export const store = createStore(persistedReducer);

// // Create a persistor object to persist the store
// export const persistor = persistStore(store);
