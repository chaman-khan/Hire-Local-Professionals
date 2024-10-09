import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import Header from '../components/Header';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import Notification from '../components/Notification';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import {decode} from 'html-entities';
import FormButton from '../components/FormButton';
import {BallIndicator} from 'react-native-indicators';
import Translation from '../constants/Translation';

const Dispute = () => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const isFocused = useIsFocused();
  const [detail, setDetail] = useState('');
  const [disputes, setDisputes] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const RBSheetCreateDispute = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(null);
  const [reasonItems, setReasonItems] = useState([]);

  const [openProject, setOpenProject] = useState(false);
  const [ProjectValue, setProjectValue] = useState(null);
  const [ProjectItems, setProjectItems] = useState([]);
  useEffect(() => {
    if (isFocused) {
      getDisputes();
      getReasons();
      getCategories();
    }
  }, [isFocused]);

  const getDisputes = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl + 'profile/get_dispute_listings?user_id=' + userInfo.id,
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
        setDisputes(responseJson.list);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const getCategories = async () => {
    // ProjectItems.length = 0;
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'disputes/list_projects_services?user_id=' +
        userInfo.id,
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
        if (responseJson.type == 'success') {
          let data = []
          for (var i = 0; i < responseJson.list.length; i++) {
            data.push({
              label: responseJson.list[i].post_title,
              value: responseJson.list[i].item_id,
            });
          }
          setProjectItems(data)
          setRefresh(!refresh)
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  const getReasons = async () => {
    reasonItems.length = 0;
    return fetch(
      Constant.BaseUrl +
        'disputes/get_disputes_reasons_list?user_id=' +
        userInfo.id,
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
        Object.entries(responseJson.list).map(([key, value]) =>
          reasonItems.push({
            label: value,
            value: key,
          }),
        );
      })
      .catch(error => {
        console.error(error);
      });
  };
  const sendDispute = () => {
    setLoading(true);
    var dispute = {};
    dispute.project = ProjectValue;
    dispute.reason = reasonValue;
    dispute.description = detail;
    axios
      .post(
        Constant.BaseUrl + 'disputes/create_disputes',
        {
          user_id: userInfo.id,
          dispute: dispute,
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
          RBSheetCreateDispute.current.close();
          setReasonValue(null);
          setProjectValue(null);
          setDetail('');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalSuccess);
          setDesc(response.data.message);
          getDisputes();
        } else {
          setLoading(false);
          RBSheetCreateDispute.current.close();
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDesc(response.data.message);
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
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={'Dispute'}
      />
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
        <View style={[styles.cardView, {flex: 1}]}>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>{Translation.disputeCreate}</Text>
            <Feather
              onPress={() => {
                setReasonValue(null);
                setProjectValue(null);
                setDetail('');
                RBSheetCreateDispute.current.open();
              }}
              name={'plus'}
              color={Constant.fontColor}
              size={22}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={disputes}
            style={{marginBottom: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={styles.PayoutSettingsPayoutListView}>
                <View style={styles.PayoutSettingsPayoutListSection}>
                  <Text style={styles.PayoutSettingsPayoutListHeading}>
                    {Translation.disputeSubject}
                  </Text>
                  <Text style={styles.PayoutSettingsPayoutListValue}>
                    {item.title}
                  </Text>
                </View>
                <View style={styles.PayoutSettingsPayoutListSection}>
                  <Text style={styles.PayoutSettingsPayoutListHeading}>
                    {Translation.disputeService}
                  </Text>
                  <Text style={styles.PayoutSettingsPayoutListValue}>
                    {decode(item.project_title)}
                  </Text>
                </View>
                <View style={{paddingVertical: 15}}>
                  <View
                    style={[styles.rowView, {justifyContent: 'space-between'}]}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                      {Translation.disputeStatus}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {item.post_status}
                    </Text>
                  </View>
                  <View
                    style={[styles.rowView, {justifyContent: 'space-between'}]}>
                    <Text style={styles.PayoutSettingsPayoutListHeading}>
                      {Translation.disputeAction}
                    </Text>
                    <Text style={styles.PayoutSettingsPayoutListValue}>
                      {Translation.disputeView}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop: '50%',
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/images/noData.png')}
                />
                <Text
                  style={[
                    styles.inputHeading,
                    {alignSelf: 'center', fontSize: 16, marginTop: 0},
                  ]}>
                  {Translation.globalNoRecordFound}
                </Text>
              </>
            }
          />
        </View>
      )}
      <RBSheet
        ref={RBSheetCreateDispute}
        height={Dimensions.get('window').height * 0.6}
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
             {Translation.disputeCreate}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetCreateDispute.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.manageServicesRBSMainView}>
              <Text
                style={[styles.manageServicesRBSSubHeading, {marginLeft: 5}]}>
               {Translation.disputeCancelled}
              </Text>
            </View>
            <Text style={styles.inputHeading}>{Translation.disputeService}</Text>
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
              open={openProject}
              value={ProjectValue}
              placeholder={Translation.disputeSelectProject}
              searchPlaceholder={Translation.globalSearchHere}
              items={ProjectItems}
              searchable={true}
              setOpen={setOpenProject}
              setValue={setProjectValue}
              setItems={setProjectItems}
              listMode="MODAL"
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              zIndex={1000}
              disableBorderRadius={true}
              badgeDotColors={['#e76f51']}
            />
            <Text style={styles.inputHeading}>{Translation.disputeReason}</Text>
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
              open={openReason}
              value={reasonValue}
              placeholder={Translation.disputeSelectReason}
              searchPlaceholder={Translation.globalSearchHere}
              items={reasonItems}
              searchable={true}
              setOpen={setOpenReason}
              setValue={setReasonValue}
              setItems={setReasonItems}
              listMode="MODAL"
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              zIndex={100}
              disableBorderRadius={true}
              badgeDotColors={['#e76f51']}
            />
            <Text style={styles.inputHeading}>{Translation.disputeDescription}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.disputeDescription}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>

            <FormButton
              onPress={() => sendDispute()}
              buttonTitle={Translation.disputeSend}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Dispute;
