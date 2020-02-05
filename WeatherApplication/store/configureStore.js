import { createStore, combineReducers } from 'redux';
import Cities from '../reducers/Cities';

const rootReducer = combineReducers({
    cities: Cities
});

export const configureStore = createStore(rootReducer)
