// src/redux/newCollections/newCollectionsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchNewCollections } from './newCollectionsAPI';

const initialState = {
  newCollections: [],
  loading: false,
  error: null,
};

const newCollectionsSlice = createSlice({
  name: 'newCollections',
  initialState,
  reducers: {
    setNewCollections: (state, action) => {
      state.newCollections = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setNewCollections, setLoading, setError } = newCollectionsSlice.actions;

export default newCollectionsSlice.reducer;

export const fetchNewCollectionsAsync = () => async dispatch => {
  try {
    dispatch(setLoading(true));
    const data = await fetchNewCollections();
    dispatch(setNewCollections(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};
