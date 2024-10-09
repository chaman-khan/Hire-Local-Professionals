import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import FormButton from '../components/FormButton';
import {useSelector, useDispatch} from 'react-redux';
import FormInput from '../components/FormInput';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/Style';
import Notification from '../components/Notification';
import axios from 'axios';
import {
  updateToken,
  updateUserInfo,
  updateProfileInfo,
  updateProfileImage,
  updateProfileBannerImage,
  updateProfileName,
  updateVerified,
  updateBilling,
  updateShipping,
} from '../redux/AuthSlice';
import Translation from '../constants/Translation';

const Login = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureP, setSecureP] = useState(true);
  const [emailValid, setEmailValid] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const navigationforword = useNavigation();

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
  const login = () => {
    setLoading(true);
    if (email != '' && password != '') {
      axios
        .post(Constant.BaseUrl + 'user/do_login', {
          username: email,
          password: password,
        })
        .then(async response => {
          if (response.data.type == 'success') {
            setLoading(false);
            // if (response.data.userDetails.is_deactivated == "false") {
            dispatch(updateToken(response.data.authToken));
            dispatch(updateUserInfo(response.data.profile.umeta));
            dispatch(updateProfileInfo(response.data.profile.pmeta));
            dispatch(updateBilling(response.data.profile.billing));
            dispatch(updateShipping(response.data.profile.shipping));
            dispatch(
              updateProfileImage(response.data.profile.pmeta.profile_img),
            );
            dispatch(
              updateProfileBannerImage(response.data.profile.pmeta.banner_img),
            );
            dispatch(updateProfileName(response.data.profile.pmeta.full_name));
            dispatch(updateVerified(response.data.profile.pmeta._is_verified));
            // navigation.navigate('DashboardTab');
            navigation.reset({
              index: 0,
              routes: [{name: 'DashboardTab'}],
            });
            // } else {
            //   setUserId(response.data.userDetails.userId);
            //   setUserToken(response.data.authToken.authToken);
            //   RBSheetRestoreAccount.current.open();
            // }
          } else if (response.data.type == 'error') {
            setLoading(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalEnterData);
      setLoading(false);
    }
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
                  <Text style={styles.authFormHeaderText}>
                    {Translation.logInNow}
                  </Text>
                </View>
                <View style={styles.authFormBodyInputs}>
                  <Text style={styles.authFormBodyInputsHeading}>
                    {Translation.globalEmail}
                    <Text
                      style={{
                        color: Constant.astaricColor,
                      }}>
                      *
                    </Text>
                  </Text>
                  <FormInput
                    labelValue={email}
                    onChangeText={userEmail => setEmail(userEmail)}
                    placeholderText={'Enter email address'}
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                  <Text style={styles.authFormBodyInputsHeading}>
                    {Translation.globalPassword}
                    <Text
                      style={{
                        color: Constant.astaricColor,
                      }}>
                      *
                    </Text>
                  </Text>
                  <FormInput
                    labelValue={password}
                    onChangeText={userPassword => setPassword(userPassword)}
                    placeholderText={Translation.globalEnterPassword}
                    iconType="eye"
                    iconclick={true}
                    secure={true}
                  />
                  <FormButton
                    onPress={() => login()}
                    buttonTitle={Translation.logInText}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                    loader={loading}
                  />
                </View>

                <View style={styles.authFormFooterView}>
                  {settings.registration_option == 'enable' ? (
                    <Text
                      onPress={() => navigation.navigate('Signup')}
                      style={styles.authFormFooterText}>
                      {Translation.logInJoin}
                    </Text>
                  ) : (
                    <View />
                  )}
                  <Text
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.authFormFooterText}>
                    {Translation.logInPasswordLost}
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

export default Login;
