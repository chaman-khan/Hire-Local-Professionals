import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import {BallIndicator} from 'react-native-indicators';


const FormButton = ({
  buttonTitle,
  iconName,
  textColor,
  loader,
  backgroundColor,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {backgroundColor: backgroundColor, borderColor:backgroundColor == Constant.grayColor ? Constant.borderColor : backgroundColor == Constant.whiteColor ? Constant.borderColor: Constant.whiteColor,}]}
      {...rest}>
      <Text style={[styles.buttonText, {color: textColor}]}>{buttonTitle}</Text>
      {iconName != null &&
        <Feather
        style={{marginHorizontal: 7}}
        name={iconName}
        size={20}
        color={textColor}
      />}
      {loader && (
        <View style={{marginLeft:10}}>
          <BallIndicator color="white" size={14} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FormButton;
