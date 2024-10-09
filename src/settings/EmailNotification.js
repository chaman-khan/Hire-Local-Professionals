import {
  View,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import Notification from '../components/Notification';
import axios from 'axios';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import {updateUserInfo} from '../redux/AuthSlice';

const EmailNotification = () => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userInfo.user_email);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const emailChanged = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_profile_email',
        {
          user_id: userInfo.id,
          useremail: email,
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
          setTitle(Translation.globalSuccess);
          setDesc(response.data.message);
          let data = JSON.parse(JSON.stringify(userInfo));
          data.user_email = email;
          dispatch(updateUserInfo(data));
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
  const hideAlert = () => {
    setShowAlert(false);
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
        {Translation.settingsEmailNotifications}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 0.5,
          fontFamily: Constant.primaryFontMedium,
          color: Constant.fontColor,
          marginBottom: 10,
        }}>
        {Translation.settingsEmailNotificationsNote}
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
        {Translation.settingsEmailNotificationsDesc}
      </Text>
      <Text style={styles.inputHeading}>
        {Translation.settingsEmailNotificationsEmail}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
      </Text>
      <FormInput
        labelValue={email}
        onChangeText={text => setEmail(text)}
        placeholderText={Translation.settingsEmailNotificationsEmailPlaceholder}
        autoCorrect={false}
      />
      <FormButton
        onPress={() => emailChanged()}
        buttonTitle={Translation.settingsEmailNotificationsChangeEmail}
        backgroundColor={Constant.primaryColor}
        textColor={Constant.whiteColor}
        loader={loading}
      />
    </View>
  );
};

export default EmailNotification;
