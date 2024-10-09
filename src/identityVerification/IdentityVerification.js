import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import DocumentPicker from 'react-native-document-picker';
import {useIsFocused} from '@react-navigation/native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import axios from 'axios';
import Notification from '../components/Notification';
import {BallIndicator} from 'react-native-indicators';
import {updateVerified} from '../redux/AuthSlice';
import Translation from '../constants/Translation';

const IdentityVerification = () => {
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const verified = useSelector(state => state.value.verified);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [identity, setIdentity] = useState('');
  const [verificationAttachment, setVerificationAttachment] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [address, setAddress] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      getIdentityVerification();
    }
  }, [isFocused]);

  const getIdentityVerification = () => {
    fetch(Constant.BaseUrl + 'user/identity_status?user_id=' + userInfo.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.authToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.identity_verification == 1) {
          dispatch(updateVerified('yes'));
        } else if (responseJson.identity_verification == 2) {
          dispatch(updateVerified('pending'));
        } else {
          dispatch(updateVerified('no'));
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      for (var i = 0; i < res.length; i++) {
        verificationAttachment.push(res[i]);
      }
      setRefreshList(!refreshList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const deleteFile = index => {
    verificationAttachment.splice(index, 1);
    setRefreshList(!refreshList);
  };

  const updateIdentityVerification = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('verification_number', identity);
    formData.append('address', address);
    formData.append('document_size', verificationAttachment.length);
    verificationAttachment.forEach((item, i) => {
      formData.append('attachment' + i, {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
    fetch(Constant.BaseUrl + 'user/identity_verfication', {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token.authToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(async response => {
        if (response.type == 'success') {
          dispatch(updateVerified('pending'));
          verificationAttachment.length = 0;
          setLoading(false);
          setShowAlert(true);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
          setName('');
          setPhone('');
          setIdentity('');
          setAddress('');
        } else {
          setLoading(false);
          setShowAlert(true);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  const cancelReupload = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'user/cancel_verification_request',
        {
          user_id: userInfo.id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setLoading(false);
          dispatch(updateVerified('no'));
        } else {
          setShowAlert(true);
          setLoading(false);
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

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header backColor={Constant.whiteColor} iconColor={Constant.fontColor} />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      {loader ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Constant.darkGrayColor,
            zIndex: 20,
          }}>
          <View style={{marginTop: -70}}>
            <BallIndicator count={8} size={26} color={Constant.fontColor} />
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {verified == 'yes' ? (
            <View style={styles.cardView}>
              <View style={styles.rowView}>
                <Text style={styles.identityVerificationHeading}>
                  {Translation.identityVerificationUploadDoc}
                </Text>
                <FontAwesome
                  style={{marginLeft: 10, marginBottom: 10}}
                  name={'check-circle'}
                  size={25}
                  color={'#22C55E'}
                />
              </View>

              <Text style={styles.identityVerificationDesc}>
                {Translation.identityVerificationCongratulation}
              </Text>
            </View>
          ) : verified == 'no' ? (
            <View style={styles.cardView}>
              <Text style={styles.identityVerificationHeading}>
                {Translation.identityVerificationUploadDoc}
              </Text>
              <Text style={styles.identityVerificationDesc}>
                {Translation.identityVerificationUploadNational}
              </Text>
              <Text style={styles.inputHeading}>
                {Translation.identityVerificationName}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={name}
                onChangeText={text => setName(text)}
                placeholderText={Translation.identityVerificationEnterName}
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.identityVerificationPhoneNumber}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={phone}
                onChangeText={text => setPhone(text)}
                placeholderText={Translation.identityVerificationEnterName}
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.identityVerificationText}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={identity}
                onChangeText={text => setIdentity(text)}
                placeholderText={'Identity card or passport number'}
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.identityVerificationAddress}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <View style={styles.multilineTextInputView}>
                <TextInput
                  placeholder={Translation.identityVerificationAddAddress}
                  multiline
                  value={address}
                  onChangeText={text => setAddress(text)}
                  placeholderTextColor={Constant.lightGrayColor}
                  style={styles.multilineTextInput}
                />
              </View>
              <View style={styles.uploadFileView}>
                <Image
                  resizeMode="contain"
                  style={{width: 60, height: 60, marginTop: 10}}
                  source={require('../../assets/images/File.png')}
                />
                <Text style={styles.uploadFileViewText}>
                  {Translation.identityVerificationClick}{' '}
                  <Text style={{color: Constant.fontColor}}>
                    {Translation.globalUpload}
                  </Text>
                </Text>
                <FormButton
                  onPress={() => pickDocumentfromDevice()}
                  buttonTitle={Translation.globalSelectFile}
                  backgroundColor={Constant.greenColor}
                  textColor={Constant.whiteColor}
                />
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                extraData={refreshList}
                data={verificationAttachment}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.JobDetailAttachmentItemView,
                      {backgroundColor: '#FCFCFC'},
                    ]}>
                    <Text style={styles.JobDetailAttachmentItemText}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => deleteFile(index)}>
                      <Feather
                        name={'trash-2'}
                        color={Constant.primaryColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View style={styles.identityVerificationSaveView}>
                <Text style={styles.identityVerificationSaveDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                  <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                    {Translation.globalSaveUpdate}
                  </Text>{' '}
                  {Translation.globalSaveUpdateDescEnd}
                </Text>
                <FormButton
                  onPress={() => updateIdentityVerification()}
                  buttonTitle={Translation.globalSaveUpdate}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loading}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#FFF6CC',
                margin: 15,
                padding: 15,
                borderRadius: 5,
                elevation: 3,
                shadowOffset: {width: 0, height: 1},
                shadowColor: '#000000',
                shadowOpacity: 0.1,
              }}>
              <Text
                style={{
                  fontFamily: Constant.primaryFontSemiBold,
                  fontSize: 18,
                  lineHeight: 26,
                  letterSpacing: 0.5,
                  color: Constant.fontColor,
                }}>
               {Translation.identityVerificationWoohoo}
              </Text>
              <Text
                style={{
                  fontFamily: Constant.secondryFontRegular,
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  color: Constant.fontColor,
                }}>
                {Translation.identityVerificationSubmittedDocuments}
              </Text>
              <View style={{marginVertical: 10}}>
                <View
                  style={{
                    backgroundColor: Constant.whiteColor,
                    borderRadius: 4,
                    borderColor: '#DDDDDD',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontFamily: Constant.primaryFontSemiBold,
                      fontSize: 16,
                      lineHeight: 26,
                      letterSpacing: 0.5,
                      color: Constant.lightGrayColor,
                      marginLeft: 10,
                    }}>
                    {Translation.identityVerificationRequest}
                  </Text>
                </View>
              </View>
              <FormButton
                buttonTitle={Translation.identityVerificationReUpload}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
                loderColor={Constant.fontColor}
                onPress={() => {
                  cancelReupload();
                }}
              />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default IdentityVerification;
