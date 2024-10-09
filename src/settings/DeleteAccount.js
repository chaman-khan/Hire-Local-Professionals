import {View, Text, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Translation from '../constants/Translation';
import Notification from '../components/Notification';
import FormButton from '../components/FormButton';
import axios from 'axios';
import FormInput from '../components/FormInput';
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

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigationforword = useNavigation();
  const settings = useSelector(state => state.setting.settings);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openRemoveReason, setOpenRemoveReason] = useState(false);
  const [removeReasonValue, setRemoveReasonValue] = useState(null);
  const [removeReasonItems, setRemoveReasonItems] = useState([]);

  useEffect(() => {
    getReasons();
  }, []);

  const getReasons = () => {
    fetch(Constant.BaseUrl + 'profile/get_remove_reasons', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.type == 'success') {
          for (var i = 0; i < responseJson.reason.length; i++) {
            removeReasonItems.push({
              label: responseJson.reason[i].value,
              value: responseJson.reason[i].key,
            });
          }
        }
        // setLoader(false);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const deleteAccount = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/delete_account',
        {
          user_id: userInfo.id,
          password: password,
          retype: reTypePassword,
          reason: removeReasonValue,
          description: description,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type === 'success') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle('Success');
          setDesc(response.data.message);

          dispatch(updateToken(null));
          dispatch(updateUserInfo({}));
          dispatch(updateProfileInfo({}));
          dispatch(updateBilling({}));
          dispatch(updateShipping({}));
          dispatch(updateProfileImage(''));
          dispatch(updateProfileBannerImage(''));
          dispatch(updateProfileName(''));
          dispatch(updateVerified(''));

          navigationforword.navigate('Login');
        } else {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <View style={styles.cardView}>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <Text
        style={{
          fontSize: 18,
          lineHeight: 26,
          letterSpacing: 0.5,
          fontFamily: Constant.primaryFontBold,
          color: Constant.fontColor,
          marginBottom: 10,
        }}>
        {Translation.settingsDeleteAccount}
      </Text>
      <Text
        style={{
          fontSize: 15,
          lineHeight: 24,
          letterSpacing: 0.5,
          fontFamily: Constant.secondryFontRegular,
          color: Constant.fontColor,
          marginBottom: 20,
        }}>
        {Translation.settingsDeleteAccountDesc}
      </Text>
      <Text style={styles.inputHeading}>
        {Translation.settingsDeletePassword}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
      </Text>
      <FormInput
        labelValue={password}
        onChangeText={text => setPassword(text)}
        placeholderText={Translation.settingsDeletePasswordPlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsDeleteAccountRetypePassword}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
      </Text>
      <FormInput
        labelValue={reTypePassword}
        onChangeText={text => setReTypePassword(text)}
        placeholderText={
          Translation.settingsDeleteAccountRetypePasswordPlaceholder
        }
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsDeleteSelectReason}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
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
          borderColor: Constant.darkGrayColor,
        }}
        dropDownContainerStyle={{
          backgroundColor: Constant.darkGrayColor,
          borderColor: Constant.borderColor,
        }}
        open={openRemoveReason}
        value={removeReasonValue}
        placeholder={Translation.settingsDeleteSelectReason}
        searchPlaceholder={Translation.globalSearchHere}
        items={removeReasonItems}
        searchable={true}
        setOpen={setOpenRemoveReason}
        setValue={setRemoveReasonValue}
        setItems={setRemoveReasonItems}
        listMode="MODAL"
        theme="LIGHT"
        multiple={false}
        mode="BADGE"
        zIndexInverse={100}
        disableBorderRadius={true}
        badgeDotColors={['#e76f51']}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsDeleteDescription}
      </Text>
      <View
        style={{
          borderColor: Constant.borderColor,
          borderWidth: 1,
          paddingVertical: 10,
          borderRadius: 10,
          marginBottom: 10,
          height: 150,
        }}>
        <TextInput
          placeholder={Translation.settingsDeleteAddDescription}
          multiline
          value={description}
          onChangeText={text => setDescription(text)}
          placeholderTextColor={Constant.lightGrayColor}
          style={{
            backgroundColor: Constant.whiteColor,
            paddingHorizontal: 10,
            fontSize: 17,
            color: Constant.fontColor,
            fontFamily: Constant.primaryFontRegular,
          }}
        />
      </View>
      <FormButton
        onPress={() => deleteAccount()}
        buttonTitle={Translation.settingsDeleteAccountBtn}
        backgroundColor={Constant.primaryColor}
        textColor={Constant.whiteColor}
        loader={loading}
      />
    </View>
  );
};

export default DeleteAccount;
