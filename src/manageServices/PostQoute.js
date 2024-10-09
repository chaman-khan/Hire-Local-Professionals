import {
  Platform,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Style';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';
import FormInput from '../components/FormInput';
import Notification from '../components/Notification';
import Translation from '../constants/Translation';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {updateServiceTab} from '../redux/GlobalStateSlice';
import FormButton from '../components/FormButton';

const PostQoute = ({service, employee, reload, qouteItem}) => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const RBSheetCalender = useRef();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [searchedDate, setSearchedDate] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openEmployer, setOpenEmployer] = useState(false);
  const [employerValue, setEmployerValue] = useState(null);
  const [employerItems, setEmployerItems] = useState([]);

  const [openService, setOpenService] = useState(false);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);

  useEffect(() => {
    for (var i = 0; i < employee.length; i++) {
      if (employee[i].get_user_type != 'administrator') {
        employerItems.push({
          label: employee[i].username,
          value: employee[i].id,
        });
      }
    }
    if (service != null) {
      for (var i = 0; i < service.length; i++) {
        serviceItems.push({
          label: service[i].serviceTitle,
          value: service[i].serviceID,
        });
      }
    }
    if (qouteItem != null) {
      setPrice(qouteItem.quote_listing_basic.user_price);
      setDetail(qouteItem.quote_listing_basic.content);
      setDeliveryDate(qouteItem.quote_listing_basic.date);
      setServiceValue(parseInt(qouteItem.quote_listing_basic.service_id));
      setEmployerValue(qouteItem.service_employer.employer_id);
    }
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setSearchedDate(
      currentDate.getFullYear() +
        '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + currentDate.getDate()).slice(-2),
    );
    setDate(currentDate);
  };

  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    const selectedAndroidDate = currentDate.getFullYear() +
    '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + currentDate.getDate()).slice(-2);
    setDeliveryDate(selectedAndroidDate);
    setDate(currentDate);
  };

  const updateQoute = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'listing/add_qoutes',
        {
          user_id: userInfo.id,
          employer: employerValue,
          service: serviceValue,
          price: price,
          date: deliveryDate,
          description: detail,
          submit_type: qouteItem != null ? 'update' : '',
          qoute_id: qouteItem != null ? qouteItem.quote_listing_basic.id : '',
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setLoading(false);
          dispatch(updateServiceTab(2));
          reload();
        } else if (response.data.type == 'error') {
          setLoading(false);
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
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.postQouteEmployer}
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
            open={openEmployer}
            value={employerValue}
            placeholder={Translation.postQouteSelectEmployer}
            searchPlaceholder={Translation.globalSearchHere}
            items={employerItems}
            searchable={true}
            setOpen={setOpenEmployer}
            setValue={setEmployerValue}
            setItems={setEmployerItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={10000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postQouteService}
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
            listParentContainerStyle={{
              marginVertical: 5,
              borderBottomColor: Constant.borderColor,
              borderBottomWidth: 1,
            }}
            open={openService}
            value={serviceValue}
            placeholder={Translation.postQouteSelectService}
            searchPlaceholder={Translation.globalSearchHere}
            loading={loading}
            items={serviceItems}
            searchable={true}
            setOpen={setOpenService}
            setValue={setServiceValue}
            setItems={setServiceItems}
            listMode="FLATLIST"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndexInverse={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postQouteQoutePrice}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={price}
            onChangeText={text => setPrice(text)}
            placeholderText={Translation.postQouteQoutePricePlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text style={styles.inputHeading}>
            {Translation.postQouteDeliveryDate}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={deliveryDate}
            placeholderText={Translation.postQouteDeliveryDatePlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
            editable={false}
            iconType={'calendar'}
            iconColor= {Constant.iconColor}
            action={true}
            actionIcon={() => 
              {if (Platform.OS == 'ios') {
                RBSheetCalender.current.open();
              } else {
                setShowDatePicker(true);
              }}}
          />

          <Text style={styles.inputHeading}>
            {Translation.postQouteDescription}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={Translation.postQouteDescriptionPlaceholder}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          <Text style={styles.saveButtonDesc}>{Translation.postQouteDesc}</Text>
          <FormButton
            onPress={() => updateQoute()}
            buttonTitle={Translation.postQouteSendQoute}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
      <RBSheet
        ref={RBSheetCalender}
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
              {Translation.postQoutePickDate}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetCalender.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            display="spinner"
            onChange={onChange}
          />
          <FormButton
            onPress={() => {
              setDeliveryDate(searchedDate);
              RBSheetCalender.current.close();
            }}
            buttonTitle={Translation.globalOk}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
          />
        </View>
      </RBSheet>
      {showDatePicker == true ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          display="calendar"
          onChange={onChangeAndroid}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default PostQoute;
