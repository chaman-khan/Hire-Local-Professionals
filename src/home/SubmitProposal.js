import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Constant from '../constants/globalConstant';
import {SafeAreaView} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';

const SubmitProposal = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mobile, setMobile] = useState(false);
  const [web, setWeb] = useState(false);
  const [wordPress, setWordPress] = useState(false);

  const Checkbox = ({title, checked, setChecked}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'white',
            borderColor: Constant.borderColor,
            borderWidth: 1,
            borderRadius: 3,
          }}
          onPress={() => {
            setChecked(!checked);
          }}>
          {checked && (
            <Image
              source={require('../../assets/images/check.png')}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontRegular,
            color: '#000000',
            marginLeft: 10,
          }}>
          {title}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: Constant.borderColor,
          borderLeftColor: Constant.borderColor,
          borderRightColor: Constant.borderColor,
          borderTopColor: Constant.whiteColor,
          borderBottomWidth: 1,
          padding: 10,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 45,
            width: 45,
            borderRadius: 60,
            backgroundColor: Constant.grayColor,
          }}>
          <Feather
            name="chevron-left"
            type="chevron-left"
            color={Constant.iconColor}
            size={25}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontMedium,
            color: '#000000',
          }}>
          Proposal form
        </Text>
        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            borderRadius: 60,
          }}></TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1, padding: 10}}>
        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontRegular,
            color: '#000000',
          }}>
          Fields marked with an{' '}
          <Text style={{color: Constant.primaryColor}}>*</Text> are required
        </Text>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontMedium,
            color: '#000000',
          }}>
          Name <Text style={{color: Constant.primaryColor}}>*</Text>
        </Text>
        <FormInput
          placeholderText={'Your Name'}
          labelValue={name}
          onChangeText={userName => setName(userName)}
        />
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontMedium,
            color: '#000000',
          }}>
          Email <Text style={{color: Constant.primaryColor}}>*</Text>
        </Text>
        <FormInput
          placeholderText={'Your Email'}
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <Text
          style={{
            fontSize: 14,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontMedium,
            color: '#000000',
          }}>
          Select which type of development
          <Text style={{color: Constant.primaryColor}}>*</Text>
        </Text>
        <Checkbox
          title={'Mobile App Development'}
          checked={mobile}
          setChecked={setMobile}
        />
        <Checkbox title={'Web Development'} checked={web} setChecked={setWeb} />
        <Checkbox
          title={'WordPress Development'}
          checked={wordPress}
          setChecked={setWordPress}
        />
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            letterSpacing: 0.5,
            fontFamily: Constant,
            fontFamily: Constant.primaryFontMedium,
            color: '#000000',
          }}>
          Message <Text style={{color: Constant.primaryColor}}>*</Text>
        </Text>

        <View style={{...styles.inputContainer, height: 150}}>
          <TextInput
            placeholder={'Write your message here'}
            labelValue={message}
            onChangeText={message => setMessage(message)}
            style={{...styles.input, textAlignVertical: 'top'}}
            autoCorrect={true}
            placeholderTextColor={Constant.lightGrayColor}
            multiline
          />
        </View>
        <FormButton
          backgroundColor={Constant.primaryColor}
          buttonTitle={'Submmit'}
          textColor={'white'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubmitProposal;
