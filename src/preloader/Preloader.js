import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {isConnected} from '../components/CheckInternet';
import {updateSetting} from '../redux/SettingSlice';
const Preloader = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    isConnected()
      .then(() => console.log('has internet connection'))
      .catch(() => navigation.navigate('NoInternet'));
    getSettings();
  }, []);

  const getSettings = async () => {
    return fetch(Constant.BaseUrl + 'user/get_theme_settings', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch(updateSetting(responseJson));
        // navigation.navigate('StackHome');
        navigation.reset({
          index: 0,
          routes: [{name: 'StackHome'}],
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <View
      style={{
        backgroundColor: '#000',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animatable.Image
        resizeMode={'contain'}
        style={{width: 180, height: 180}}
        animation="slideOutUp"
        source={require('../../assets/images/Logo.png')}></Animatable.Image>
    </View>
  );
};

export default Preloader;
