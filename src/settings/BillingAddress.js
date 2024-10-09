import {
  View,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import {decode} from 'html-entities';
import DropDownPicker from 'react-native-dropdown-picker';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';
import FormInput from '../components/FormInput';
import {updateBilling} from '../redux/AuthSlice';

const BillingAddress = ({data,reload}) => {
  const billing = useSelector(state => state.value.billing);
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const countryTaxonomy = useSelector(state => state.global.countryTaxonomy);
  const [loading, setLoading] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openCountry, setOpenCountry] = useState(false);
  const [countryValue, setCountryValue] = useState([]);
  const [countryItems, setCountryItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    countryItems.length = 0;
    for (var i = 0; i < countryTaxonomy.length; i++) {
      countryItems.push({
        label: decode(countryTaxonomy[i].title),
        value: countryTaxonomy[i].value,
      });
    }
    setFname(data.first_name);
    setLname(data.last_name);
    setCompanyName(data.company);
    setAddress(data.address_1);
    setZipCode(data.postcode);
    setPhone(data.phone);
    setEmail(data.email);
    setCity(data.city);
    setCountryValue(data.country);
  }, []);

  const saveBillingDetail = () => {
    let billingData = [];
    setLoading(true);
    billingData.push({
      billing_first_name: fname,
      billing_last_name: lname,
      billing_company: companyName,
      billing_address_1: address,
      billing_country: countryValue,
      billing_city: city,
      billing_postcode: zipCode,
      billing_phone: phone,
      billing_email: email,
    });
    axios
      .post(
        Constant.BaseUrl + 'user/update_billing',
        {
          user_id: userInfo.id,
          billing: billingData[0],
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
          setTitle('Success');
          setDesc(response.data.message);
          reload()
          let billingInfo = JSON.parse(JSON.stringify(billing));
          billingInfo.address_1 = address;
          billingInfo.city = city;
          billingInfo.company = companyName;
          billingInfo.country = countryValue;
          billingInfo.email = email;
          billingInfo.first_name = fname;
          billingInfo.last_name = lname;
          billingInfo.phone = phone;
          billingInfo.postcode = zipCode;
          dispatch(updateBilling(billingInfo));
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
        {Translation.settingsAccountBillingDetails}
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
        {Translation.settingsAccountCompleteBilling}
      </Text>
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountFirstName}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={fname}
        onChangeText={text => setFname(text)}
        placeholderText={Translation.settingsAccountFirstNamePlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountLastName}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={lname}
        onChangeText={text => setLname(text)}
        placeholderText={Translation.settingsAccountLastNamePlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountCompanyName}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={companyName}
        onChangeText={text => setCompanyName(text)}
        placeholderText={Translation.settingsAccountCompanyNamePlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountAddress}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={address}
        onChangeText={text => setAddress(text)}
        placeholderText={Translation.settingsAccountAddressPlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        Country
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
        open={openCountry}
        value={countryValue}
        placeholder={Translation.settingsAccountCountryPlaceholder}
        searchPlaceholder={Translation.globalSearchHere}
        items={countryItems}
        searchable={true}
        setOpen={setOpenCountry}
        setValue={setCountryValue}
        setItems={setCountryItems}
        listMode="MODAL"
        theme="LIGHT"
        multiple={false}
        mode="BADGE"
        zIndexInverse={100}
        disableBorderRadius={true}
        badgeDotColors={['#e76f51']}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountCity}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={city}
        onChangeText={text => setCity(text)}
        placeholderText={Translation.settingsAccountCityPlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountZipcode}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={zipCode}
        onChangeText={text => setZipCode(text)}
        placeholderText={Translation.settingsAccountZipcodePlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountPhoneNumber}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={phone}
        onChangeText={text => setPhone(text)}
        placeholderText={Translation.settingsAccountPhoneNumberPlaceholder}
        autoCorrect={false}
      />
      <Text style={styles.inputHeading}>
        {Translation.settingsAccountEmail}
        <Text style={{color: Constant.astaricColor}}>*</Text>
      </Text>
      <FormInput
        labelValue={email}
        onChangeText={text => setEmail(text)}
        placeholderText={Translation.settingsAccountEmailPlaceholder}
        autoCorrect={false}
      />
      <FormButton
        onPress={() => saveBillingDetail()}
        buttonTitle={Translation.globalSaveUpdate}
        backgroundColor={Constant.primaryColor}
        textColor={Constant.whiteColor}
        loader={loading}
      />
    </View>
  );
};

export default BillingAddress;
