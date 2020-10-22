import { createStore } from 'redux';
import Immutable from 'immutable';
import RootReducer from './RootReducer';
import Reactotron from '../helper/Reactotron';

export default createStore(RootReducer, Immutable.Map(), Reactotron.createEnhancer());
