import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {decode} from 'html-entities';
import DocumentPicker from 'react-native-document-picker';
import Notification from '../components/Notification';
import FormInput from '../components/FormInput';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';

const SendProposal = ({route, navigation}) => {
  const durationTaxonomy = useSelector(state => state.global.durationTaxonomy);
  const settings = useSelector(state => state.setting.settings);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);

  const proposalDetail = route.params.data;
  const jobType = route.params.edit
    ? proposalDetail.job_type
    : proposalDetail.project_type.toLowerCase();
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceFee, setServiceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [name, setName] = useState('');
  const [documentsArray, setDocumentsArray] = useState([]);
  const [rate, setRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDuration, setOpenDuration] = useState(false);
  const [durationValue, setDurationValue] = useState(null);
  const [durationItems, setDurationItems] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    for (var i = 0; i < durationTaxonomy.length; i++) {
      durationItems.push({
        label: durationTaxonomy[i].name,
        value: durationTaxonomy[i].slug,
      });
    }
    if (route.params.edit == true) {
      setAmount(proposalDetail.budget.toString());
      setRate(proposalDetail.per_hour_price);
      setDetail(proposalDetail.cover);
      setServiceFee(parseFloat(proposalDetail.service_cost));
      setDurationValue(proposalDetail.duration.key);
      setTotalAmount(
        proposalDetail.budget - parseInt(proposalDetail.service_cost),
      );
      setEstimatedTime(proposalDetail.estimated_hours);
      setDocumentsArray(proposalDetail.proposal_documents_urls);
      setRefreshFlatlist(!refreshFlatlist);
    }
  }, []);

  useEffect(() => {
    getAdminShare();
  }, [amount, rate, estimatedTime]);

  const changeAmount = text => {
    setAmount(text);
  };
  const changeRate = text => {
    setRate(text);
  };
  const changeHours = text => {
    setEstimatedTime(text);
  };
  const getAdminShare = async val => {
    setShowLoading(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/project_shares?project_id=' +
        proposalDetail.ID +
        '&proposed_amount=' +
        amount +
        '&hourly_rate=' +
        rate +
        '&hours=' +
        estimatedTime,
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
        setServiceFee(responseJson.project_shares.admin_shares);
        // setTotalAmount(amount - responseJson.project_shares.admin_shares);
        setTotalAmount(responseJson.project_shares.freelancer_shares);
        setShowLoading(false);
      })
      .catch(error => {
        setShowLoading(false);
        // console.error(error);
      });
  };
  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      for (var i = 0; i < res.length; i++) {
        documentsArray.push(res[i]);
      }
      setRefreshFlatlist(!refreshFlatlist);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const deleteDocuments = index => {
    documentsArray.splice(index, 1);
    setRefreshFlatlist(!refreshFlatlist);
  };

  const submitProposal = async () => {
    setLoading(true);
    let PreDocsArray = [];
    let newDocsArray = [];

    for (var i = 0; i < documentsArray.length; i++) {
      if (documentsArray[i].hasOwnProperty('attachment_id')) {
        PreDocsArray.push(documentsArray[i]);
      } else {
        newDocsArray.push(documentsArray[i]);
      }
    }
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    if (route.params.edit == true) {
      formData.append('submit_type', 'edit');
      formData.append('proposal_id', proposalDetail.ID);
    } else {
      formData.append('submit_type', 'add');
    }
    formData.append(
      'project_id',
      route.params.edit == true
        ? proposalDetail.project_id
        : proposalDetail.job_id,
    );
    formData.append('proposed_amount', jobType == 'fixed' ? amount : rate);
    formData.append('estimeted_time', estimatedTime);
    if (jobType == 'fixed') {
      formData.append('proposed_time', durationValue);
    }
    formData.append('proposed_content', detail);
    formData.append(
      'old_download_attachments_proposal',
      JSON.stringify(PreDocsArray),
    );

    formData.append('size', newDocsArray != null ? newDocsArray.length : '0');
    if (newDocsArray != null) {
      newDocsArray.forEach((item, i) => {
        formData.append('proposal_files' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }

    axios
      .post(Constant.BaseUrl + 'proposal/add_proposal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.authToken,
        },
      })
      .then(response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setType(response.data.type);
          setAlertTitle(response.data.title);
          setDesc(response.data.message);
          // navigation.goBack();
        } else {
          setShowAlert(true);
          setType(response.data.type);
          setAlertTitle(response.data.title);
          setDesc(response.data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.sendProposalSubmit}
        backIcon={true}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={alertTitle}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.sendProposalAmount}
          </Text>
          <View style={styles.subCardView}>
            {jobType == 'fixed' ? (
              <>
                <Text style={styles.inputHeading}>
                  {Translation.sendProposalEnterAmount}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={amount}
                  onChangeText={text => changeAmount(text)}
                  placeholderText={Translation.sendProposalEnterProposalAmount}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  iconType={'dollar-sign'}
                  iconColor={Constant.lightGrayColor}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputHeading}>
                  {Translation.sendProposalPerHour}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={rate}
                  onChangeText={text => changeRate(text)}
                  placeholderText={Translation.sendProposalEnterRate}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  iconType={'dollar-sign'}
                  iconColor={Constant.lightGrayColor}
                />
              </>
            )}

            {jobType != 'fixed' && (
              <FormInput
                labelValue={estimatedTime}
                onChangeText={text => changeHours(text)}
                placeholderText={Translation.sendProposalEstimatedHours}
                keyboardType="email-address"
                autoCorrect={false}
              />
            )}
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontRegular,
                color: '#484848',
                marginTop: 5,
                marginBottom: 5,
              }}>
              {Translation.sendProposalTotalAmount}
            </Text>
            {jobType == 'fixed' && (
              <>
                <Text style={styles.inputHeading}>
                  {Translation.sendProposalDuration}
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
                  open={openDuration}
                  value={durationValue}
                  placeholder={Translation.sendProposalTimePeriod}
                  searchPlaceholder={Translation.globalSearchHere}
                  items={durationItems}
                  searchable={true}
                  setOpen={setOpenDuration}
                  setValue={setDurationValue}
                  setItems={setDurationItems}
                  listMode="MODAL"
                  theme="LIGHT"
                  multiple={false}
                  mode="BADGE"
                  zIndexInverse={100}
                  disableBorderRadius={true}
                  badgeDotColors={['#e76f51']}
                />
              </>
            )}
            <View style={styles.rowView}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontRegular,
                  color: Constant.greenColor,
                  marginTop: 10,
                  marginRight: 10,
                  marginBottom: 5,
                }}>
                ({decode(settings.currency_symbol)})
              </Text>
              {jobType == 'fixed' ? (
                <Text style={styles.inputHeading}>
                  {route.params.edit ? decode(settings.currency_symbol) : ''}
                  {route.params.edit
                    ? proposalDetail.cost
                    : decode(proposalDetail.project_cost)}
                  {' - '}
                  {route.params.edit ? decode(settings.currency_symbol) : ''}
                  {proposalDetail.max_price}
                </Text>
              ) : (
                <Text style={styles.inputHeading}>
                  {route.params.edit
                    ? proposalDetail.project_cost
                    : proposalDetail.hourly_rate +
                      Translation.sendProposalRatefor +
                      proposalDetail.estimated_hours +
                      Translation.sendProposalHours}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontRegular,
                color: '#484848',
                marginTop: 5,
                marginBottom: 5,
              }}>
              {jobType == 'fixed'
                ? Translation.sendProposalProposedAmount
                : Translation.sendProposalproposedHourlyRate}
            </Text>
            <View
              style={{
                borderBottomColor: Constant.borderColor,
                marginVertical: 10,
                borderBottomWidth: 1,
              }}
            />
            <View style={styles.rowView}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontRegular,
                  color: Constant.greenColor,
                  marginTop: 10,
                  marginRight: 10,
                  marginBottom: 5,
                }}>
                ({decode(settings.currency_symbol)})
              </Text>
              <Text style={styles.inputHeading}>
                {' '}
                {jobType == 'fixed' ? amount : rate}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontRegular,
                color: '#484848',
                marginTop: 5,
                marginBottom: 5,
              }}>
              {jobType == 'fixed'
                ? Translation.sendProposalYourProposedAmount
                : Translation.sendProposalYourProposedHourly}
            </Text>
            <View
              style={{
                borderBottomColor: Constant.borderColor,
                marginVertical: 10,
                borderBottomWidth: 1,
              }}
            />
            <View style={styles.rowView}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontRegular,
                  color: Constant.greenColor,
                  marginTop: 10,
                  marginRight: 10,
                  marginBottom: 5,
                }}>
                ({decode(settings.currency_symbol)})
              </Text>
              {!showLoading ? (
                <Text style={styles.inputHeading}>-{serviceFee}</Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
            </View>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontRegular,
                color: '#484848',
                marginTop: 5,
                marginBottom: 5,
              }}>
              <Text style={styles.inputHeading}>
                {' '}
                {Translation.sendProposalWorkreapApp}
              </Text>
              {Translation.sendProposalServiceFee}
            </Text>
            <View
              style={{
                borderBottomColor: Constant.borderColor,
                marginVertical: 10,
                borderBottomWidth: 1,
              }}
            />
            <View style={styles.rowView}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontRegular,
                  color: Constant.greenColor,
                  marginTop: 10,
                  marginRight: 10,
                  marginBottom: 5,
                }}>
                ({decode(settings.currency_symbol)})
              </Text>
              {!showLoading ? (
                <Text style={styles.inputHeading}>{totalAmount}</Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 15,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
            </View>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontRegular,
                color: '#484848',
                marginTop: 5,
                marginBottom: 5,
              }}>
              {jobType == 'fixed'
                ? Translation.sendProposalAmountText
                : Translation.sendProposalHourlyPrice}
              {Translation.sendProposalReceiveAfter}
              <Text style={styles.inputHeading}>
                {' '}
                {Translation.sendProposalWorkreapApp}{' '}
              </Text>
              {Translation.sendProposalDeduction}
            </Text>
          </View>
          <Text style={styles.inputHeading}>
            {Translation.sendProposalDescription}
          </Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={Translation.sendProposalAddDescription}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          <Text style={styles.inputHeading}>Upload Files</Text>
          <View style={[styles.uploadFileView, {backgroundColor: '#FCFCFC'}]}>
            <Image
              resizeMode="contain"
              style={styles.uploadFileImage}
              source={require('../../assets/images/File.png')}
            />
            <Text style={styles.uploadFileViewText}>
              {Translation.globalClickHere}{' '}
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
          {documentsArray.length != 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={documentsArray}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.profileSettingProjectListView,
                    {paddingVertical: 15},
                  ]}>
                  <View style={{marginLeft: 10, width: '80%'}}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.profileSettingFAQList,
                        {color: Constant.fontColor, marginBottom: 0},
                      ]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.profileSettingFAQList,
                        {fontFamily: Constant.primaryFontRegular},
                      ]}>
                      {Translation.sendProposalFileSize}{' '}
                      {(item.size / 1024).toFixed(2)}{' '}
                      {Translation.sendProposalKB}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteDocuments(index)}>
                    <Feather
                      style={{marginRight: 10}}
                      name={'x'}
                      color={Constant.fontColor}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <FormButton
            onPress={() => submitProposal()}
            buttonTitle={Translation.sendProposalText}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendProposal;
