import {View, Text} from 'react-native';
import React, {useState} from 'react';
import * as Constant from '../constants/globalConstant';
import {decode} from 'html-entities';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

const Password = () => {
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const resetPassword = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_password',
        {
          user_id: userInfo.id,
          password: currentPassword,
          retype: newPassword,
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
          setNewPassword('');
          setCurrentPassword('');
        } else {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDesc(decode(response.data.message));
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
        {Translation.settingsPasswordReset}
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
        {Translation.settingsPasswordResetDesc}
      </Text>
      <Text style={styles.inputHeading}>
        {Translation.settingsPasswordCurrent}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
      </Text>
      <FormInput
        labelValue={currentPassword}
        onChangeText={text => setCurrentPassword(text)}
        placeholderText={Translation.settingsPasswordCurrentPlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsPasswordNew}
        <Text
          style={{
            color: Constant.astaricColor,
          }}>
          *
        </Text>
      </Text>
      <FormInput
        labelValue={newPassword}
        onChangeText={text => setNewPassword(text)}
        placeholderText={Translation.settingsPasswordNewPlaceholder}
        autoCorrect={false}
      />
      <FormButton
        onPress={() => resetPassword()}
        buttonTitle={Translation.settingsPasswordChangeBtn}
        backgroundColor={Constant.primaryColor}
        textColor={Constant.whiteColor}
        loader={loading}
      />
    </View>
  );
};

export default Password;
