import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import Notification from '../components/Notification';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import styles from '../styles/Style';
import Translation from "../constants/Translation"

const ForgotPassword = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const validateEmail = userEmail => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(userEmail) === false) {
      setEmailValid(false);
      return false;
    } else {
      setEmailValid(true);
      setEmail(userEmail);
    }
  };
  const forgotPassword = () => {
    setLoading(true);
    axios
      .post(Constant.BaseUrl + 'user/forgot_password', {
        email: email,
      })
      .then(async response => {
        if (response.data.type == 'success') {
          setEmail('');
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else if (response.data.type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.LoginKeyboardAvoid}>
      <View style={{flex: 1}}>
        <Notification
          show={showAlert}
          hide={hideAlert}
          type={type}
          title={title}
          desc={desc}
        />
        <ImageBackground
          resizeMode={'cover'}
          imageStyle={{}}
          style={{width: '100%', height: '100%'}}
          source={require('../../assets/images/loginBackground.png')}>
          <SafeAreaView style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DashboardTab')}
              style={styles.skipButtonView}>
              <Text style={styles.LoginSkipText}>{Translation.globalSkip}</Text>
              <Feather
                style={{marginHorizontal: 7}}
                name={'chevron-right'}
                size={20}
                color={Constant.whiteColor}
              />
            </TouchableOpacity>
            <View style={styles.authFormMainView}>
              <View style={styles.authFormInsideView}>
                <View style={styles.authFormHeaderView}>
                  <Text style={styles.authFormHeaderText}>{Translation.forgotPasswordText}</Text>
                </View>
                <View style={styles.authFormBodyInputs}>
                  <Text style={styles.authFormBodyInputsHeading}>
                    {Translation.globalEmail}
                    <Text style={{color: Constant.astaricColor}}>*</Text>
                  </Text>
                  <FormInput
                    labelValue={email}
                    onChangeText={userEmail => setEmail(userEmail)}
                    placeholderText={Translation.globalEmailAdress}
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                  <FormButton
                    onPress={() => forgotPassword()}
                    buttonTitle={Translation.globalGetPassword}
                    backgroundColor={Constant.primaryColor}
                    loader={loading}
                    textColor={Constant.whiteColor}
                  />
                </View>

                <View style={styles.authFormFooterView}>
                  {settings.registration_option == 'enable' ? (
                    <Text
                      onPress={() => navigation.navigate('Signup')}
                      style={styles.authFormFooterText}>
                      {Translation.forgotPasswordJoin}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => navigation.navigate('Login')}
                      style={styles.authFormFooterText}>
                      {Translation.forgotPasswordSignIn}
                    </Text>
                  )}
                  <Text
                    // onPress={() => navigation.navigate("lostPassword")}
                    style={styles.authFormFooterText}>
                    {Translation.forgotPasswordLost}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
