// src/redux/rootReducer.js

import { combineReducers } from '@reduxjs/toolkit';
import newCollectionsReducer from './newCollections/newCollectionsSlice';

const rootReducer = combineReducers({
  newCollections: newCollectionsReducer,
});

export default rootReducer;
