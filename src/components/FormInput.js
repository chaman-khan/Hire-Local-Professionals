import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';

const FormInput = ({
  labelValue,
  placeholderText,
  inputType,
  iconType,
  editable,
  iconclick,
  secure,
  iconColor,
  action,
  actionIcon,
  contHeight = 20,
  ...rest
}) => {
  const [secureP, setSecureP] = useState(secure);
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholderText}
        value={labelValue}
        placeholderTextColor={Constant.lightGrayColor}
        style={styles.input}
        autoCorrect={true}
        textContentType="emailAddress"
        keyboardType={inputType}
        editable={editable}
        secureTextEntry={secureP}
        {...rest}
      />

      {iconclick == true ? (
        <TouchableOpacity
          onPress={() => setSecureP(!secureP)}
          style={styles.iconStyle}>
          <Feather
            name={secureP ? iconType : 'eye-off'}
            size={20}
            color={Constant.lightGrayColor}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => (action ? actionIcon() : console.log('icon'))}
          style={styles.iconStyle}>
          <Feather name={iconType} size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FormInput;
