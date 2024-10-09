import { configureStore , combineReducers } from "@reduxjs/toolkit";
import token from "./AuthSlice";
import savedItem from "./SavedSlice";
import globalSlice from "./GlobalStateSlice";
import appSetting from "./SettingSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
        value: token,
        saved: savedItem,
        setting: appSetting,
        global: globalSlice
});
const persistConfig = {
    key: 'root',
    storage : AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store