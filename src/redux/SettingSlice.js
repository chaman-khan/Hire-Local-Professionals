import { createSlice } from "@reduxjs/toolkit";
export const SettingSlice = createSlice({
  name: "SettingSlice",
  initialState: {
    settings : {},
  },
  reducers: {
    updateSetting: (state, action) => {
      state.settings = action.payload
  },
  },
});
export const { updateSetting } = SettingSlice.actions;
export default SettingSlice.reducer;