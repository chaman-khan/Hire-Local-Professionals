import {View, Text, Switch, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import Notification from '../components/Notification';
import {BallIndicator} from 'react-native-indicators';
import Translation from '../constants/Translation';
import axios from 'axios';
import FormButton from '../components/FormButton';
import {useSelector, useDispatch} from 'react-redux';

const ManageAccount = () => {
  const token = useSelector(state => state.value.token);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const userInfo = useSelector(state => state.value.userInfo);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [disableAccount, setDisableAccount] = useState(false);
  const [disableHourlyRate, setDisableHourlyRate] = useState(false);
  const [disableNotification, setDisableNotification] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    getAccountSetting();
  }, []);

  const getAccountSetting = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl + 'profile/get_setting?user_id=' + userInfo.id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setLoader(false);
        if (responseJson.account_settings.profile_blocked == 'on') {
          setDisableAccount(true);
        } else {
          setDisableAccount(false);
        }
        if (responseJson.account_settings.hourly_rate == 'on') {
          setDisableHourlyRate(true);
        } else {
          setDisableHourlyRate(false);
        }
        if (responseJson.account_settings.project_notification == 'on') {
          setDisableNotification(true);
        } else {
          setDisableNotification(false);
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  const toggleSwitchDisableAccount = () => {
    setDisableAccount(previousState => !previousState);
  };
  const toggleSwitchDisableHourlyRate = () => {
    setDisableHourlyRate(previousState => !previousState);
  };
  const toggleSwitchDisableNotification = () => {
    setDisableNotification(previousState => !previousState);
  };

  const manageAccount = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_block_setting',
        {
          user_id: userInfo.id,
          disable_account: disableAccount ? 'on' : 'off',
          disable_hourly_rate: disableHourlyRate ? 'on' : 'off',
          disable_project_notification: disableNotification ? 'on' : 'off',
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
        {Translation.settingsManageAccount}
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
        {Translation.settingsManageAccountDesc}
      </Text>

      <View
        style={{
          marginTop: 5,
          marginBottom: 10,
          width: '100%',
          height: Dimensions.get('window').height / 18,
          borderColor: Constant.borderColor,
          borderRadius: 10,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Constant.whiteColor,
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            width: '80%',
            letterSpacing: 0.5,
            fontFamily: Constant.primaryFontSemiBold,
            color: Constant.fontColor,
            marginTop: 10,
            marginBottom: 5,
          }}>
          {' '}
          {Translation.settingsManageAccountDisable}
        </Text>
        {loader ? (
          <View style={{marginRight: 10, alignItems: 'flex-end'}}>
            <BallIndicator color={Constant.fontColor} size={14} />
          </View>
        ) : (
          <Switch
            style={{
              transform: [{scaleX: 0.8}, {scaleY: 0.8}],
            }}
            trackColor={{false: '#DDDDDD', true: '#22C55E'}}
            thumbColor={Constant.whiteColor}
            ios_backgroundColor={'#DDDDDD'}
            onValueChange={toggleSwitchDisableAccount}
            value={disableAccount}
          />
        )}
      </View>

      {profileInfo.user_type == 'freelancer' && (
        <>
          <View
            style={{
              marginTop: 5,
              marginBottom: 10,
              width: '100%',
              height: Dimensions.get('window').height / 18,
              borderColor: Constant.borderColor,
              borderRadius: 10,
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Constant.whiteColor,
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                width: '80%',
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontSemiBold,
                color: Constant.fontColor,
                marginTop: 10,
                marginBottom: 5,
              }}>
              {' '}
              {Translation.settingsManageAccountDisableHourly}
            </Text>
            {loader ? (
              <View style={{marginRight: 10, alignItems: 'flex-end'}}>
                <BallIndicator color={Constant.fontColor} size={14} />
              </View>
            ) : (
              <Switch
                style={{
                  transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                }}
                trackColor={{false: '#DDDDDD', true: '#22C55E'}}
                thumbColor={Constant.whiteColor}
                ios_backgroundColor={'#DDDDDD'}
                onValueChange={toggleSwitchDisableHourlyRate}
                value={disableHourlyRate}
              />
            )}
          </View>

          <View
            style={{
              marginTop: 5,
              marginBottom: 10,
              width: '100%',
              height: Dimensions.get('window').height / 18,
              borderColor: Constant.borderColor,
              borderRadius: 10,
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Constant.whiteColor,
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                width: '80%',
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontSemiBold,
                color: Constant.fontColor,
                marginTop: 10,
                marginBottom: 5,
              }}>
              {' '}
              {Translation.settingsManageAccountProjectNotifications}
            </Text>
            {loader ? (
              <View style={{marginRight: 10, alignItems: 'flex-end'}}>
                <BallIndicator color={Constant.fontColor} size={14} />
              </View>
            ) : (
              <Switch
                style={{
                  transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                }}
                trackColor={{false: '#DDDDDD', true: '#22C55E'}}
                thumbColor={Constant.whiteColor}
                ios_backgroundColor={'#DDDDDD'}
                onValueChange={toggleSwitchDisableNotification}
                value={disableNotification}
              />
            )}
          </View>
        </>
      )}
      <FormButton
        onPress={() => manageAccount()}
        buttonTitle={Translation.settingsManageAccountSaveSettings}
        backgroundColor={Constant.primaryColor}
        textColor={Constant.whiteColor}
        loader={loading}
      />
    </View>
  );
};

export default ManageAccount;
