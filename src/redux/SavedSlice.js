import { createSlice } from "@reduxjs/toolkit";
export const SavedSlice = createSlice({
  name: "SavedSlice",
  initialState: {
    savedProvider : []
  },
  reducers: {
    updateSavedProvider: (state, action) => {
        state.savedProvider = action.payload
    },
  },
});
export const { updateSavedProvider} = SavedSlice.actions;
export default SavedSlice.reducer;