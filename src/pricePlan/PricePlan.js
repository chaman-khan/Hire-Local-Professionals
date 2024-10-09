import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import Notification from '../components/Notification';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useSelector, useDispatch} from 'react-redux';
import {decode} from 'html-entities';
import {BallIndicator} from 'react-native-indicators';
import {useIsFocused} from '@react-navigation/native';
import FormButton from '../components/FormButton';

const PricePlan = ({navigation, route}) => {
  const profileInfo = useSelector(state => state.value.profileInfo);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const billing = useSelector(state => state.value.billing);
  const shipping = useSelector(state => state.value.shipping);
  const isFocused = useIsFocused();
  const sliderWidth = Dimensions.get('window').width * 0.9;
  const itemWidth = Dimensions.get('window').width * 0.8;
  const [loader, setLoader] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (isFocused) {
      getPackeges();
    }
  }, [isFocused]);

  const getPackeges = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_packages?user_type=' +
        profileInfo.user_type,
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
        setLoader(false);
        setPackages(responseJson.pakcages);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  const buyPackage = id => {
    setLoading(true);
    var billing_info_map = {};
    billing_info_map['address_1'] = billing.address_1;
    billing_info_map['city'] = billing.city;
    billing_info_map['company'] = billing.company;
    billing_info_map['country'] = billing.country;
    billing_info_map['email'] = billing.email;
    billing_info_map['first_name'] = billing.first_name;
    billing_info_map['last_name'] = billing.last_name;
    billing_info_map['phone'] = billing.phone;
    billing_info_map['state'] = billing.state;
    var shipping_info_map = {};
    shipping_info_map['address_1'] = shipping.address_1;
    shipping_info_map['city'] = shipping.city;
    shipping_info_map['company'] = shipping.company;
    shipping_info_map['country'] = shipping.country;
    shipping_info_map['first_name'] = shipping.first_name;
    shipping_info_map['last_name'] = shipping.last_name;
    // shipping_info_map["state"] = shipping.state;
    var payment_data_map_array = {};
    payment_data_map_array['order_type'] = 'package';
    payment_data_map_array['product_id'] = id;
    payment_data_map_array['customer_id'] = userInfo.id;
    payment_data_map_array['customer_note'] = '';
    payment_data_map_array['shipping_methods'] = 'stripe';
    payment_data_map_array['sameAddress'] = '1';
    payment_data_map_array['billing_info'] = billing_info_map;
    payment_data_map_array['shipping_info'] = shipping_info_map;
    var payment_data = JSON.stringify(payment_data_map_array);

    axios
      .post(
        Constant.BaseUrl + 'dashboard/create_checkout_page',
        {
          payment_data: payment_data,
        },
        {
          headers: {
            // Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setLoading(false);
          navigation.navigate('Checkout', {link: response.data.url});
        } else if (response.data.type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
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

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.pricePlanMainView}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.pricePlanName}>{item.title}</Text>
          <Text style={styles.pricePlanNameDesc}>{item.tagline}</Text>
        </View>
        <View style={styles.pricePlanPriceView}>
          <Text style={styles.pricePlanPriceText}>
            {decode(item.symbol)}
            {item.price}
          </Text>
          <Text style={styles.pricePlanPriceDurationText}>{item.duration}</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{marginTop: 5, marginBottom: 10}}
          data={item.features}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <View style={styles.pricePlanOptionView}>
              <Text style={styles.pricePlanOptionName}>{item.title}</Text>
              {item.value == 'yes' || item.value == 'no' ? (
                <Feather
                  name={item.value == 'yes' ? 'check' : 'slash'}
                  color={
                    item.value == 'yes'
                      ? Constant.greenColor
                      : Constant.primaryColor
                  }
                  size={22}
                />
              ) : (
                <Text style={styles.pricePlanOptionValue}>{item.value}</Text>
              )}
            </View>
          )}
        />

        <View style={{paddingHorizontal: 10}}>
          <FormButton
            onPress={() => buyPackage(item.ID)}
            buttonTitle={Translation.globalBuyNow}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header backColor={Constant.whiteColor} iconColor={Constant.iconColor} />
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
          <View style={styles.cardView}>
            <Text style={styles.pricePlanHeading}>
              {Translation.pricePlanHeading}
            </Text>
            <Text style={styles.pricePlanDesc}>
              {Translation.pricePlanDesc}
            </Text>
            <View style={{marginTop: 10}}>
              <Carousel
                loop={true}
                layout={'default'}
                data={packages}
                renderItem={renderItem}
                sliderWidth={sliderWidth}
                onSnapToItem={index => setActiveSlide(index)}
                itemWidth={itemWidth}
                autoplay={false}
              />
              <Pagination
                dotsLength={packages.length}
                activeDotIndex={activeSlide}
                // containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: Constant.greenColor,
                }}
                // inactiveDotStyle={{
                //   backgroundColor:Constant.borderColor
                // }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PricePlan;
