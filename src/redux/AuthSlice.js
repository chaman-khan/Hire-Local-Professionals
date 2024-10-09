import {createSlice} from '@reduxjs/toolkit';
export const AuthSlice = createSlice({
  name: 'AuthSlice',
  initialState: {
    token: null,
    userInfo: {},
    profileInfo: {},
    profileImage: '',
    profileBannerImage: "",
    profileName: '',
    verified: '',
    billing: {},
    shipping: {},
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    updateProfileInfo: (state, action) => {
      state.profileInfo = action.payload;
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    updateProfileBannerImage: (state, action) => {
      state.profileBannerImage = action.payload;
    },
    updateProfileName: (state, action) => {
      state.profileName = action.payload;
    },
    updateVerified: (state, action) => {
      state.verified = action.payload;
    },
    updateBilling: (state, action) => {
      state.billing = action.payload;
    },
    updateShipping: (state, action) => {
      state.shipping = action.payload;
    },
  },
});
export const {
  updateToken,
  updateUserInfo,
  updateProfileInfo,
  updateProfileImage,
  updateProfileBannerImage,
  updateProfileName,
  updateVerified,
  updateBilling,
  updateShipping,
} = AuthSlice.actions;
export default AuthSlice.reducer;
