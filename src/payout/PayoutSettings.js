import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import Translation from '../constants/Translation';
import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Notification from '../components/Notification';
import FormInput from '../components/FormInput';
import HTML from 'react-native-render-html';
import FormButton from '../components/FormButton';

const PayoutSettings = () => {
  const isFocused = useIsFocused();
  const settings = useSelector(state => state.setting.settings);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [selectedSection, setSelectedSection] = useState(0);
  const [data, setSata] = useState([{name: '1'}, {name: '2'}, {name: '3'}]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [payoutsData, setpayoutsData] = useState([]);
  const [payoutList, setpayoutList] = useState([]);
  const [payoutSaved, setPayoutSaved] = useState({});
  const [availableBalance, setAvailableBalance] = useState('0.00');
  const [refreshList, setRefreshList] = useState(false);
  const [loader, setLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [payoutType, setPayoutType] = useState('paypal');
  const [payoutForm, setPayoutForm] = useState('');
  const RBSheetWithdrawMoney = useRef();
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [openPaymentGateway, setOpenPaymentGateway] = useState(false);
  const [paymentGatewayValue, setPaymentGatewayValue] = useState(null);
  const [paymentGatewayItems, setPaymentGatewayItems] = useState([]);
  const [tabs, setTabs] = useState([
    {
      name: Translation.payoutSettingsTabPayoutsSettings,
    },
    {
      name: Translation.payoutSettingsTabYourPayouts,
    },
  ]);
  const tagsStyles = {
    body: {
      marginTop: 15,
      fontFamily: 'OpenSans-Regular',
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0.5,
      color: Constant.fontColor,
    },
  };
  useEffect(() => {
    if (isFocused) {
    getAvailableBalance();
    getPayoutSetting();
    getPayoutListing();
    }
  }, [isFocused]);

  const getAvailableBalance = () => {
    fetch(
      Constant.BaseUrl +
        'profile/get_freelancer_availble_balance?user_id=' +
        userInfo.id +
        '&page=1',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setAvailableBalance(responseJson.available_balance);
        // setLoader(false);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const getPayoutSetting = () => {
    setLoader(true);
    payoutsData.length = 0;
    paymentGatewayItems.length = 0
    fetch(
      Constant.BaseUrl + 'profile/get_payout_setting?user_id=' + userInfo.id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setLoader(false);
        Object.entries(responseJson.payout_settings).map(([key, value]) =>
          payoutsData.push({
            type: key,
            value: value,
            fields: Object.entries(value.fields).map(([key, value]) => ({
              name: key,
              val: value,
            })),
          }),
        );
        Object.entries(responseJson.payout_settings).map(([key, value]) =>
          paymentGatewayItems.push({
            label: value.title,
            value: key,
          }),
        );
        if(responseJson.saved_settings == ""){
          let obj = {
            type: ''
          }
          setPayoutSaved(obj);
        }else{
          setPayoutSaved(responseJson.saved_settings);
        }
        setRefreshList(!refreshList);
        // setAvailableBalance(responseJson.available_balance)
        // setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const getPayoutListing = () => {
    fetch(
      Constant.BaseUrl +
        'profile/get_users_payouts?user_id=' +
        userInfo.id +
        '&page=1',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.type == 'success') {
          setpayoutList(responseJson.user_payouts);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const changeInputValue = (val, item, index) => {
    item.val.value = val;
    setRefreshList(!refreshList);
  };
  const savePayoutSetting = () => {
    setLoading(true);
    var payout_settings = {};
    payout_settings.type = payoutSaved.type;
    for (var i = 0; i < payoutsData.length; i++) {
      Object.entries(payoutsData[i].value.fields).map(
        ([key, value]) => (payout_settings[key] = value.value),
      );
    }
    axios
      .post(
        Constant.BaseUrl + 'profile/update_payout_setting',
        {
          user_id: userInfo.id,
          payout_settings: payout_settings,
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
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const withdrawMoney = () => {
    setLoading(true)
    if (paymentGatewayValue != null && amount != 0) {
      var withdarw_Money = {};
      withdarw_Money.amount = amount;
      withdarw_Money.gateway = paymentGatewayValue;
      
      axios
        .post(
          Constant.BaseUrl + 'profile/payout_submit_withdraw',
          {
            user_id: parseInt(userInfo.id),
            withdraw: withdarw_Money,
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
            RBSheetWithdrawMoney.current.close();
            setShowAlert(true);
            setType(response.data.type);
            setTitle(Translation.globalSuccess);
            setDesc(response.data.message);
            getAvailableBalance();
          } else {
            setLoading(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(Translation.globalOops);
            setDesc(response.data.message);
            RBSheetWithdrawMoney.current.close();
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } else {
      RBSheetWithdrawMoney.current.close();
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalFillCompleteData);
    }
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
        title={Translation.payoutSettingsHeader}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <View style={styles.freelancerDetailTopTabView}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => setSelectedSection(index)}
              style={[
                styles.freelancerDetailTopTabViewSingle,
                {
                  backgroundColor:
                    selectedSection == index
                      ? Constant.greenColor
                      : Constant.whiteColor,
                      borderColor: selectedSection == index?
                      Constant.whiteColor:
                      Constant.borderColor,
                },
              ]}>
              <Text
                style={[
                  styles.freelancerDetailTopTabViewSingleText,
                  {
                    color:
                      selectedSection == index
                        ? Constant.whiteColor
                        : Constant.fontColor,
                  },
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedSection == 0 && (
          <View style={styles.cardView}>
            <Text style={[styles.inputHeading, {marginTop: 0}]}>
              {Translation.payoutSettingsHeader}
            </Text>
            <View style={styles.PayoutSettingsWithdrawView}>
              <Image
                resizeMode="contain"
                style={styles.PayoutSettingsWithdrawImage}
                source={require('../../assets/images/Placeholder1.png')}
              />
              <Text style={styles.PayoutSettingsWithdrawAmount}>
                {decode(settings.currency_symbol)}
                {availableBalance}
              </Text>
              <Text style={styles.PayoutSettingsWithdrawBalance}>
                {Translation.payoutSettingsAvailableBalance}
              </Text>
              <FormButton
                onPress={() => {
                  setPaymentGatewayValue(null)
                  setAmount(0)
                  RBSheetWithdrawMoney.current.open()}}
                buttonTitle={Translation.payoutSettingsWithdrawNow}
                backgroundColor={Constant.whiteColor}
                textColor={Constant.fontColor}
              />
            </View>
            {loader && (
              <>
                <View
                  style={{
                    width: '100%',
                    height: 60,
                    marginTop: 7,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <SkeletonPlaceholder>
                    <View
                      style={{
                        width: '100%',
                        height: 60,
                        borderRadius: 10,
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 60,
                    marginTop: 7,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <SkeletonPlaceholder>
                    <View
                      style={{
                        width: '100%',
                        height: 60,
                        borderRadius: 10,
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 60,
                    marginTop: 7,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <SkeletonPlaceholder>
                    <View
                      style={{
                        width: '100%',
                        height: 60,
                        borderRadius: 10,
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
              </>
            )}

            <FlatList
              data={payoutsData}
              extraData={refreshList}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <>
                  {item.value.status == 'enable' && (
                    <View style={styles.PayoutSettingsPayoutView}>
                      <View style={styles.PayoutSettingsPayoutViewTop}>
                        <View style={styles.rowView}>
                          <TouchableOpacity
                            onPress={() => {
                              payoutSaved.type = item.type;
                              setRefreshList(!refreshList);
                            }}
                            style={[
                              styles.CustomCheckOuterView,
                              {
                                backgroundColor:
                                  payoutSaved.type == item.type
                                    ? Constant.greenColor
                                    : Constant.whiteColor,
                              },
                            ]}>
                            <View style={styles.CustomCheckInnerView} />
                          </TouchableOpacity>
                          <Image
                            resizeMode="contain"
                            style={styles.PayoutSettingsPayoutImage}
                            source={{uri: item.value.img_url}}
                          />
                          {/* <Text style={styles.PayoutSettingsPayoutName}>{item.type}</Text> */}
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedPayout(
                              selectedPayout == index ? null : index,
                            )
                          }>
                          <Feather
                            name={selectedPayout == index ? 'minus' : 'plus'}
                            color={Constant.fontColor}
                            size={22}
                          />
                        </TouchableOpacity>
                      </View>
                      {selectedPayout == index && (
                        <>
                          {item.fields != null && (
                            <FlatList
                              data={item.fields}
                              keyExtractor={(x, i) => i.toString()}
                              extraData={refreshList}
                              renderItem={({item, index}) => (
                                <>
                                  <Text style={styles.inputHeading}>
                                    {item.val.title}
                                    <Text
                                      style={{color: Constant.astaricColor}}>
                                      *
                                    </Text>
                                  </Text>
                                  <FormInput
                                    labelValue={item.val.value}
                                    placeholderText={item.val.placeholder}
                                    onChangeText={val =>
                                      changeInputValue(val, item, index)
                                    }
                                  />
                                </>
                              )}
                            />
                          )}
                          {item.value != null && (
                            <HTML
                              tagsStyles={tagsStyles}
                              source={{html: item.value.desc}}
                            />
                          )}
                        </>
                      )}
                    </View>
                  )}
                </>
              )}
            />
            <FormButton
              onPress={() => savePayoutSetting()}
              buttonTitle={'Submit'}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </View>
        )}
        {selectedSection == 1 && (
          <View style={styles.cardView}>
            <Text style={[styles.inputHeading, {marginTop: 0}]}>
              {Translation.payoutSettingsYourPayments}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={payoutList}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <View style={styles.PayoutSettingsPayoutListView}>
                  <View style={styles.PayoutSettingsPayoutListSection}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                     {Translation.payoutSettingsDate}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {item.publish_date}
                    </Text>
                  </View>
                  <View style={styles.PayoutSettingsPayoutListSection}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                      {Translation.payoutSettingsPayoneerEmail}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {item.payout_detail_value}
                    </Text>
                  </View>
                  <View style={styles.PayoutSettingsPayoutListSection}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                      {Translation.payoutSettingsAmount}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {decode(settings.currency_symbol)}
                      {item.price}
                    </Text>
                  </View>
                  <View style={{paddingVertical: 15}}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                      {Translation.payoutSettingsPaymentMethod}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {item.account_type} ({item.status_data})
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
      <RBSheet
        ref={RBSheetWithdrawMoney}
        height={Dimensions.get('window').height * 0.4}
        duration={250}
        customStyles={{
          container: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 25,
            backgroundColor: 'transparent',
          },
        }}>
        <View style={styles.RBSheetMainView}>
          <View style={styles.RBSheetHeaderView}>
            <Text style={styles.freelancerDetailCardNameTextStyle}>
              {Translation.payoutSettingsWithdrawEarnings}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetWithdrawMoney.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{paddingHorizontal: 15}}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.payoutSettingsSelectOnePaymentMethod}
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
                borderColor: Constant.darkGrayColor,
              }}
              dropDownContainerStyle={{
                backgroundColor: Constant.darkGrayColor,
                borderColor: Constant.borderColor,
              }}
              open={openPaymentGateway}
              value={paymentGatewayValue}
              placeholder={Translation.payoutSettingsSelectOnePaymentMethodPlaceholder}
              searchPlaceholder={Translation.globalSearchHere}
              items={paymentGatewayItems}
              searchable={true}
              setOpen={setOpenPaymentGateway}
              setValue={setPaymentGatewayValue}
              setItems={setPaymentGatewayItems}
              listMode="MODAL"
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              zIndexInverse={100}
              disableBorderRadius={true}
              badgeDotColors={['#e76f51']}
            />
            <FormInput
              labelValue={amount}
              placeholderText={Translation.payoutSettingsAddAmount}
              onChangeText={val => setAmount(val)}
              inputType={"number-pad"}
            />
            <FormButton
              buttonTitle={Translation.payoutSettingsWithdrawMoney}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              onPress={() => withdrawMoney()}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default PayoutSettings;
