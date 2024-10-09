import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import RBSheet from "react-native-raw-bottom-sheet";
import {useIsFocused} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../constants/globalConstant';
import Notification from '../components/Notification';
import FormButton from '../components/FormButton';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import FormInput from '../components/FormInput';
import DropDownPicker from 'react-native-dropdown-picker';
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

const Signup = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [heightView, setHeightView] = useState(1.2);
  const [userType, setUserType] = useState('freelancer');
  const [secureP, setSecureP] = useState(true);
  const [emailValid, setEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [locationItems, setLocationItems] = useState([]);

  useEffect(() => {
    for (var i = 0; i < locationTaxonomy.length; i++) {
      locationItems.push({
        label: locationTaxonomy[i].name,
        value: locationTaxonomy[i].slug,
      });
    }
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (Platform.OS == 'android') {
          setHeightView(1.5);
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Platform.OS == 'android') {
          setHeightView(1.2);
        }
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
  const signup = () => {
    setLoading(true);
    axios
      .post(Constant.BaseUrl + 'user/signup', {
        username: userName,
        user_phone_number: phone,
        email: email,
        first_name: firstName,
        last_name: lastName,
        location: locationValue,
        password: password,
        verify_password: retypePassword,
        user_type: userType,
        termsconditions: agree,
      })
      .then(async response => {
        if (response.data.type == 'success') {
          login();
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
            navigation.navigate('DashboardTab');
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
    } else {
      Alert.alert(Translation.globalOops, Translation.globalEnterData);
    }
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
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
          <View
            style={[
              styles.signupFormMainView,
              {height: Dimensions.get('window').height / heightView},
            ]}>
            <View
              style={[
                styles.signupFormInsideView,
                {height: Dimensions.get('window').height / heightView},
              ]}>
              <View style={styles.authFormHeaderView}>
                <Text style={styles.authFormHeaderText}>
                  {Translation.signUpFree}
                </Text>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.authFormBodyInputs}>
                <Text style={styles.authFormBodyInputsHeading}>
                  {Translation.signUpName}
                  <Text
                    style={{
                      color: Constant.astaricColor,
                    }}>
                    *
                  </Text>
                </Text>
                <FormInput
                  labelValue={firstName}
                  onChangeText={text => setFirstName(text)}
                  placeholderText={'Enter first name'}
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                <Text style={styles.authFormBodyInputsHeading}>
                  {Translation.signUpLastName}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={lastName}
                  onChangeText={text => setLastName(text)}
                  placeholderText={Translation.signUpEnterLastName}
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                {settings.remove_username == 'no' && (
                  <>
                    <Text style={styles.authFormBodyInputsHeading}>
                      {Translation.signUpUserName}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={userName}
                      onChangeText={text => setUserName(text)}
                      placeholderText={Translation.signUpEnterUserName}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </>
                )}
                {settings.phone_setting == 'enable' && (
                  <>
                    <Text style={styles.authFormBodyInputsHeading}>
                      {Translation.signUpPhoneNo}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={phone}
                      onChangeText={text => setPhone(text)}
                      placeholderText={Translation.signUpEnterPhoneNo}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </>
                )}
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
                <Text style={styles.authFormBodyInputsHeading}>
                  {Translation.globalPassword}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={password}
                  onChangeText={userPassword => setPassword(userPassword)}
                  placeholderText={Translation.globalEnterPassword}
                  iconType="eye"
                  iconclick={true}
                  secure={true}
                />
                <Text style={styles.authFormBodyInputsHeading}>
                  Retype password
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={retypePassword}
                  onChangeText={userPassword => setRetypePassword(userPassword)}
                  placeholderText={Translation.signUpRetypePassword}
                  iconType="eye"
                  iconclick={true}
                  secure={true}
                />
                {settings.hide_loaction == 'no' && (
                  <>
                    <Text style={styles.authFormBodyInputsHeading}>
                      {Translation.signUpLocation}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <DropDownPicker
                      style={styles.MultiselectmainView}
                      textStyle={{
                        color: Constant.fontColor,
                        fontSize: 16,
                      }}
                      placeholderStyle={{
                        color: Constant.lightGrayColor,
                        fontWeight: '400',
                      }}
                      searchContainerStyle={{
                        borderBottomColor: Constant.borderColor,
                      }}
                      searchTextInputStyle={{
                        color: '#000',
                        borderColor: Constant.whiteColor,
                      }}
                      dropDownContainerStyle={{
                        borderColor: Constant.borderColor,
                      }}
                      open={openLocation}
                      value={locationValue}
                      placeholder={Translation.signUpSelectLocation}
                      searchPlaceholder={Translation.signUpSearch}
                      items={locationItems}
                      searchable={true}
                      setOpen={setOpenLocation}
                      setValue={setLocationValue}
                      setItems={setLocationItems}
                      listMode="MODAL"
                      theme="LIGHT"
                      multiple={false}
                      mode="BADGE"
                      zIndex={1000}
                      disableBorderRadius={true}
                      badgeDotColors={['#e76f51']}
                    />
                  </>
                )}
                <Text style={styles.authFormBodyInputsHeading}>
                  {Translation.signUpStartAs}
                </Text>
                <View style={styles.signupFormUserTypeView}>
                  <TouchableOpacity
                    onPress={() => setUserType('freelancer')}
                    style={[
                      styles.signupFormUserTypeSingle,
                      {
                        backgroundColor:
                          userType == 'freelancer'
                            ? Constant.greenColor
                            : Constant.whiteColor,
                      },
                    ]}>
                    <Text
                      // onPress={() => navigation.navigate("signup")}
                      style={[
                        styles.signupFormUserTypeSingleText,
                        {
                          color:
                            userType == 'freelancer'
                              ? Constant.whiteColor
                              : Constant.lightGrayColor,
                        },
                      ]}>
                      {Translation.globalFreelancer}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setUserType('employer')}
                    style={[
                      styles.signupFormUserTypeSingle,
                      {
                        backgroundColor:
                          userType == 'employer'
                            ? Constant.greenColor
                            : Constant.whiteColor,
                      },
                    ]}>
                    <Text
                      // onPress={() => navigation.navigate("lostPassword")}
                      style={[
                        styles.signupFormUserTypeSingleText,
                        {
                          color:
                            userType == 'employer'
                              ? Constant.whiteColor
                              : Constant.lightGrayColor,
                        },
                      ]}>
                      {Translation.globalEmployer}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setAgree(!agree)}
                  style={styles.checkBoxMainView}>
                  {agree ? (
                    <View style={styles.checkBoxCheck}>
                      <FontAwesome
                        name="check"
                        type="check"
                        color={Constant.whiteColor}
                        size={14}
                      />
                    </View>
                  ) : (
                    <View style={styles.checkBoxUncheck} />
                  )}
                  <Text style={styles.signupTermsAndConditionText}>
                    {Translation.globalAgree}{' '}
                    <Text style={{color: Constant.blueColor}}>
                      {Translation.globalTerm}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <FormButton
                  onPress={() => signup()}
                  buttonTitle={Translation.signUpText}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loading}
                />
              </ScrollView>
              <View style={styles.authFormFooterView}>
                <Text
                  onPress={() => navigation.navigate('Login')}
                  style={styles.authFormFooterText}>
                  {Translation.signInText}
                </Text>
                <Text
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.authFormFooterText}>
                  {Translation.signUpLost}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default Signup;
