import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';
import Translation from '../constants/Translation';

const Notification = ({
  show,
  hide,
  yesAction,
  type,
  title,
  desc,
  option,
  iconName,
  login,
  loginAction
}) => {
  const navigationforword = useNavigation();

  return (
    <View>
      <Dialog
        dialogStyle={{
          marginHorizontal: 20,
          backgroundColor: Constant.whiteColor,
          width: '85%',
        }}
        visible={show}
        onTouchOutside={() => {
          hide();
        }}
        footer={
          <DialogFooter>
            {option ? (
              <>
                <DialogButton
                  style={{
                    borderRightWidth: 1,
                    borderRightColor: Constant.borderColor,
                    backgroundColor: Constant.primaryColor,
                  }}
                  textStyle={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: Constant.whiteColor,
                  }}
                  text={Translation.globalYes}
                  onPress={() => yesAction()}
                />
                <DialogButton
                  textStyle={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: Constant.fontColor,
                  }}
                  text={Translation.globalNo}
                  onPress={() => hide()}
                />
              </>
            ) : (
              <>
                {login && (
                  <DialogButton
                    style={{
                      borderRightWidth: 1,
                      borderRightColor: Constant.borderColor,
                      backgroundColor: Constant.primaryColor,
                    }}
                    textStyle={{fontSize: 15, fontWeight: '700', color: Constant.whiteColor}}
                    text={Translation.globalLogin}
                    onPress={() => loginAction()}
                  />
                )}
                <DialogButton
                  textStyle={{fontSize: 15, fontWeight: '700', color: '#000'}}
                  text={Translation.globalCancel}
                  onPress={() => hide()}
                />
              </>
            )}
          </DialogFooter>
        }>
        <DialogContent>
          <View style={{height: 20}} />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather
              style={{marginBottom: 5}}
              name={
                type == 'success'
                  ? 'check-circle'
                  : type == 'error'
                  ? 'x-circle'
                  : iconName
              }
              size={40}
              color={type == 'success' ? '#22C55E' : '#EF4444'}
            />
            <Text
              style={{
                fontSize: 18,
                lineHeight: 26,
                letterSpacing: 0.5,
                color: Constant.fontColor,
                fontFamily: Constant.primaryFontSemiBold,
              }}>
              {title}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 24,
                letterSpacing: 0.5,
                color: Constant.fontColor,
                fontFamily: Constant.secondryFontRegular,
                textAlign: 'center',
              }}>
              {desc}
            </Text>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default Notification;
