import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  ImageBackground,
  Share,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Translation from '../constants/Translation';
import Notification from '../components/Notification';
import {BallIndicator} from 'react-native-indicators';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import HTML from 'react-native-render-html';
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import FormButton from '../components/FormButton';
const sliderWidth = Dimensions.get('window').width;
const itemWidth = 300;

const ServiceDetail = ({navigation, route}) => {
  const billing = useSelector(state => state.value.billing);
  const profileImage = useSelector(state => state.value.profileImage);
  const shipping = useSelector(state => state.value.shipping);
  const settings = useSelector(state => state.setting.settings);
  const reasons = useSelector(state => state.global.reasonTypeTaxonomy);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const RBSheetSendMessage = useRef();
  const RBSheetReportService = useRef();
  const serviceDetail = route.params.item;
  const [selectedInfo, setselectedInfo] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [detail, setDetail] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const [showView, setShowView] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(null);
  const [reasonItems, setReasonItems] = useState([]);
  useEffect(() => {
    setPrice(parseInt(serviceDetail.price));
    reasonItems.length = 0;
    for (var i = 0; i < reasons.length; i++) {
      reasonItems.push({
        label: reasons[i].title,
        value: reasons[i].value,
      });
    }
  }, []);

  const tagsStyles = {
    body: {
      fontFamily: Constant.secondryFontRegular,
      color: Constant.fontColor,
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  };

  const checkingbuyer = () => {
    if (profileInfo.user_type == 'freelancer') {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.serviceDetailAccessMessage);
    } else {
      buyService();
    }
  };
  const contactToSeller = () => {
    if (profileInfo.user_type == 'freelancer') {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.serviceDetailAccessMessage);
    } else {
      RBSheetSendMessage.current.open();
    }
  };
  const openLoginAlert = () => {
    setShowAlert(true);
      setType(Translation.customTabBarError);
      setTitle(Translation.globalOops);
      setDesc(Translation.customTabBarLoginFirst);
  }
  const PushInArray = (item, index) => {
    if (selectedAddons.includes(item.ID)) {
      const index = selectedAddons.indexOf(item.ID);
      if (index > -1) {
        selectedAddons.splice(index, 1);
        var total = price - parseFloat(item.price.slice(1));
        setPrice(total);
      }
      setRefreshFlatList(!refreshFlatList);
    } else {
      selectedAddons.push(item.ID);
      var total = price + parseFloat(item.price.slice(1));
      setPrice(total);
      setRefreshFlatList(!refreshFlatList);
    }
  };
  const saveService = async () => {
    if (serviceDetail.favorit == 'yes') {
      setShowAlert(true);
      setType('success');
      setTitle(Translation.serviceDetailAlraedy);
      setDesc(Translation.serviceDetailAlreadyList);
    } else {
      setLoader(true);
      axios
        .post(
          Constant.BaseUrl + 'user/favorite',
          {
            user_id: userInfo.id,
            favorite_id: serviceDetail.service_id,
            type: '_saved_services',
          },
          {
            headers: {
              Authorization: 'Bearer ' + token.authToken,
            },
          },
        )
        .then(async response => {

          if (response.data.type == 'success') {
            serviceDetail.favorit = 'yes';
            route.params.item.favorit = 'yes';
            setRefreshFlatList(!refreshFlatList);
            setLoader(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          } else if (response.data.type == 'error') {
            setLoader(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
        });
    }
  };
  const buyService = () => {
    setLoading(true)
    var billing_info_map = {};
    billing_info_map.address_1 = billing.address_1;
    billing_info_map.city = billing.city;
    billing_info_map.company = billing.company;
    billing_info_map.country = billing.country;
    billing_info_map.email = billing.email;
    billing_info_map.first_name = billing.first_name;
    billing_info_map.last_name = billing.last_name;
    billing_info_map.phone = billing.phone;
    // billing_info_map["state"] = billing.state;
    var shipping_info_map = {};
    shipping_info_map.address_1 = shipping.address_1;
    shipping_info_map.city = shipping.city;
    shipping_info_map.company = shipping.company;
    shipping_info_map.country = shipping.country;
    shipping_info_map.first_name = shipping.first_name;
    shipping_info_map.last_name = shipping.last_name;
    // shipping_info_map["state"] = shipping.state;
    var payment_data_map_array = {};
    payment_data_map_array.order_type = 'service';
    payment_data_map_array.service_id = serviceDetail.service_id;
    payment_data_map_array.customer_id = userInfo.id;
    payment_data_map_array.customer_note = '';
    payment_data_map_array.shipping_methods = 'stripe';
    payment_data_map_array.addons = selectedAddons.toString();
    payment_data_map_array.sameAddress = '1';
    payment_data_map_array.billing_info = billing_info_map;
    payment_data_map_array.shipping_info = shipping_info_map;
    var payment_data = JSON.stringify(payment_data_map_array);
    console.log(JSON.stringify(payment_data))
    axios
      .post(
        Constant.BaseUrl + 'user/create_checkout_page',
        {
          user_id: userInfo.id,
          payment_data: payment_data,
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
  const onClickShare = () => {
    Share.share(
      {
        message: "",
        url: serviceDetail.service_url,
        title: 'Share Service',
      },
      {
        // Android only:
        dialogTitle: serviceDetail.service_url,
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  };
  const sendMessage = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'chat/sendUserMessage',
        {
          user_id: userInfo.id,
          receiver_id: serviceDetail.user_id,
          message: detail,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          RBSheetSendMessage.current.close();
          setDetail('');
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
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
  const reportService = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'user/reporting',
        {
          user_id: userInfo.id,
          id: serviceDetail.service_id,
          reason: reasonValue,
          description: detail,
          type: 'service',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          RBSheetReportService.current.close();
          // setRefreshFlatList(!refreshFlatList);
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
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
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.imageCarouselView}>
        <Image style={styles.imageCarouselImage} source={{uri: item.url}} />
      </View>
    );
  };
  const getSingleFreelancer = async (id) => {
    setLoadingProfile(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=single' +
        '&profile_id=' +
        id,
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
        if (responseJson.type == 'success') {
          navigation.navigate('FreelancerDetail', {
            item: responseJson.freelancers.freelancers_data[0],
          });
        }
        setLoadingProfile(false);
      })
      .catch(error => {
        setLoadingProfile(false);
        console.error(error);
      });
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        login={token != null ? false:true}
        loginAction={()=> {
          setShowAlert(false);
          setTimeout(() => {
            navigation.navigate('Login')
          }, 1000);
        }
        }
      />
      <View style={styles.headerMainDetailView}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => navigation.goBack()}
          style={styles.headerDrawerIcon}>
          <Feather
            name="chevron-left"
            type="chevron-left"
            color={Constant.fontColor}
            size={25}
          />
        </TouchableOpacity>
        <View style={styles.freelancerDetailHeader}>
          {loader ? (
            <View style={{marginRight: 20}}>
              <BallIndicator color={Constant.fontColor} size={14} />
            </View>
          ) : (
            <>
              <TouchableOpacity onPress={() =>token!= null ?   saveService(): openLoginAlert()}>
                {serviceDetail.favorit == 'yes' ? (
                  <AntDesign
                    style={{marginRight: 20}}
                    name="heart"
                    type="heart"
                    color={'#EF4444'}
                    size={22}
                  />
                ) : (
                  <Feather
                    style={{marginRight: 20}}
                    name="heart"
                    type="heart"
                    color={Constant.lightGrayColor}
                    size={22}
                  />
                )}
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => onClickShare()}>
            <Feather
              style={{marginRight: 25}}
              name="share-2"
              type="share-2"
              color={Constant.fontColor}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity>
          <Image style={styles.headerPhoto} source={
                profileImage == ''
                  ? require('../../assets/images/NoImage.png')
                  : {uri: profileImage}
              } />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.ServiceProviderCardPrentStyle,
            {width: '100%', backgroundColor: Constant.whiteColor},
          ]}>
          <FontAwesome
            style={styles.jobCardMainViewBookmark}
            name={serviceDetail.is_featured == 'yes' ? 'bookmark' : ''}
            size={20}
            color={Constant.primaryColor}
          />
          {serviceDetail.categories.length >= 1 && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={serviceDetail.categories}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <Text style={styles.serviceDetailCatTextStyle}>
                  {decode(item.category_name)}{' '}
                  {index + 1 == serviceDetail.categories.length ? '' : ','}
                </Text>
              )}
            />
          )}

          <Text style={styles.serviceDetailTitleStyle}>
            {decode(serviceDetail.title)}
          </Text>
          <View style={styles.serviceDetailContentItemParentStyle}>
            <AntDesign name={'star'} size={13} color={'#FFD101'} />
            <Text style={styles.serviceListCardratingTextStyle}>
              {serviceDetail.rating}/5
            </Text>
            <Text style={styles.serviceListCardRatingCountStyle}>
              (
              {serviceDetail.reviews.length >= 2
                ? serviceDetail.reviews.length + Translation.serviceDetailReviews
                : serviceDetail.reviews.length + Translation.serviceDetailReview}
              )
            </Text>
          </View>
          <View
            style={[
              styles.serviceDetailContentItemParentStyle,
              {marginTop: 0, marginBottom: 10},
            ]}>
            <Feather
              name={'refresh-ccw'}
              size={13}
              color={Constant.lightGrayColor}
            />
            <Text style={styles.serviceListCardRatingCountStyle}>
              {serviceDetail.queue} {Translation.serviceDetailInQueue}
            </Text>
          </View>
          <Carousel
            loop={true}
            layout={'default'}
            data={serviceDetail.images}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            autoplay={false}
          />
        </View>

        <View
          style={[
            styles.ServiceProviderCardPrentStyle,
            styles.serviceDetailDescParentStyle,
          ]}>
          <Text style={styles.serviceDetailDescTitleStyle}>{Translation.serviceDetailDescription}</Text>

          <HTML
            tagsStyles={tagsStyles}
            source={{
              html: serviceDetail.content,
            }}
          />
          <Text style={styles.inputHeading}>
           {Translation.serviceDetailLanguagesSpeak}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={serviceDetail.speak_languages}
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.JobDetailItemView}>
                  <Text style={styles.JobDetailItemText}>
                    {decode(item.name)}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.cardView}>
          <Text style={styles.serviceDetailAboutSellerTextStyle}>
            {Translation.serviceDetailAboutSeller}
          </Text>
           <TouchableOpacity
           activeOpacity={0.6}
              onPress={() =>getSingleFreelancer(serviceDetail.user_id)}
              style={styles.serviceDetailAboutSectionParentStyle}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.headerPhoto}
                  source={{uri: serviceDetail.auther_image}}
                />
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.ServiceProviderCardNameTextStyle}>
                      {serviceDetail.auther_title}
                    </Text>
                    <AntDesign
                      name={'checkcircle'}
                      size={13}
                      color={'#22C55E'}
                    />
                  </View>
                  {serviceDetail.auther_date != "" &&
                    <Text
                    style={[
                      styles.serviceListCardRatingCountStyle,
                      {marginLeft: 0, color: '#484848'},
                    ]}>
                    {Translation.serviceDetailSince}{serviceDetail.auther_date}
                  </Text>}
                </View>
              </View>
              <View>
               {loadingProfile ?
                <View style={{marginRight: 5, alignItems: 'flex-end'}}>
                  <BallIndicator color={Constant.fontColor} size={14} />
                </View>:
                <AntDesign name={'right'} size={13} color={'#484848'} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor: Constant.whiteColor, marginTop: 5}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0A0F26',
              padding: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={[
                      styles.ServiceProviderCardNameTextStyle,
                      {color: Constant.whiteColor},
                    ]}>
                    {decode(settings.currency_symbol)} {price}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.serviceListCardRatingCountStyle,
                    {marginLeft: 0, color: Constant.whiteColor},
                  ]}>
                  {Translation.serviceDetailStartingFrom}
                </Text>
              </View>
            </View>
            <TouchableOpacity
            onPress={()=> setShowView(!showView)}
              style={{
                backgroundColor: '#EEEEEE',
                height: 40,
                width: 40,
                borderRadius: 40 / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name={showView ? 'up':"down"} size={13} color={'#484848'} />
            </TouchableOpacity>
          </View>
          {showView &&
            <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              backgroundColor: Constant.whiteColor,
            }}>
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon4.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.serviceDetailDeliveryTime}
                </Text>
              </View>
              {route.params.edit ? (
                <>
                  {serviceDetail.delivery_time.length != 0 && (
                    <Text style={styles.jobCardInfoListHeadingValue}>
                      {serviceDetail.delivery_time[0].name}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.jobCardInfoListHeadingValue}>
                  {serviceDetail.delivery_time}
                </Text>
              )}
            </View>
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon9.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>{Translation.serviceDetailViews}</Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {serviceDetail.service_views}
              </Text>
            </View>
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon6.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>{Translation.serviceDetailSales}</Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {serviceDetail.sold}
              </Text>
            </View>
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon10.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.serviceDetailResponseTime}
                </Text>
              </View>

              {route.params.edit ? (
                <>
                  {serviceDetail.delivery_time.length != 0 && (
                    <Text style={styles.jobCardInfoListHeadingValue}>
                      {serviceDetail.response_time[0].name}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.jobCardInfoListHeadingValue}>
                  {serviceDetail.response_time}
                </Text>
              )}
            </View>
            {serviceDetail.english_level.length != 0 && (
              <View style={styles.jobCardInfoListMain}>
                <View style={styles.jobCardNameView}>
                  <ImageBackground
                    // imageStyle={{borderRadius: 25 / 2}}
                    style={styles.jobCardInfoListImage}
                    source={require('../../assets/images/jobIcon7.png')}
                  />
                  <Text style={styles.jobCardInfoListHeading}>
                   {Translation.serviceDetailEnglishLevel}
                  </Text>
                </View>
                <Text style={styles.jobCardInfoListHeadingValue}>
                  {serviceDetail.english_level[0].name}
                </Text>
              </View>
            )}
            {serviceDetail.service_location.length != 0 &&
              <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon5.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>{Translation.serviceDetailLocation}</Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {serviceDetail.service_location[0].name}
              </Text>
            </View>}
          </View>}

          <View style={styles.serviceDetailSeparatorStyle} />
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              backgroundColor: Constant.whiteColor,
            }}>
            {serviceDetail.addons.length != 0 &&
              <Text
              style={{
                fontSize: 18,
                lineHeight: 26,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontBold,
                color: Constant.fontColor,
              }}>
              {Translation.serviceDetailAddonsServices}
            </Text>}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={serviceDetail.addons}
              keyExtractor={(x, i) => i.toString()}
              extraData={refreshFlatList}
              renderItem={({item, index}) => (
                <>
                  {item.title != '' && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.PostServiceListView, {borderRadius: 10}]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <TouchableOpacity
                          onPress={() => PushInArray(item, index)}
                          style={styles.checkBoxMainView}>
                          {selectedAddons.includes(item.ID) ? (
                            <View style={styles.checkBoxCheck}>
                              <FontAwesome
                                name="check"
                                type="check"
                                color={Constant.whiteColor}
                                size={14}
                              />
                            </View>
                          ) : (
                            <View style={styles.checkBoxUncheck} />
                          )}
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.PostServiceListText}>
                            {item.title}
                          </Text>
                          <Text style={styles.PostServiceListPriceText}>
                            {' '}
                            {item.price}
                          </Text>
                          <Text
                            style={[
                              styles.serviceListCardRatingCountStyle,
                              {marginLeft: 10, color: '#676767'},
                            ]}>
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          </View>
          <View style={styles.serviceDetailSeparatorStyle} />
          <View style={{padding: 15}}>
            <Text
              style={[
                styles.serviceListCardRatingCountStyle,
                styles.serviceDetailBottomTextStyle,
              ]}>
              <Text style={{color: Constant.primaryColor}}>*</Text> {Translation.serviceDetailPriceVaryNote}
            </Text>

            <FormButton
              onPress={() => token != null ?  checkingbuyer() : openLoginAlert()}
              buttonTitle={Translation.serviceDetailBuyNow}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
            <View
              style={[
                styles.rowView,
                {width: '100%', justifyContent: 'space-between'},
              ]}>
              <View style={{width: '49%'}}>
                <FormButton
                  onPress={() => token != null ? contactToSeller() :openLoginAlert()}
                  buttonTitle={Translation.serviceDetailContactSeller}
                  backgroundColor={Constant.grayColor}
                  textColor={'#676767'}
                />
              </View>
              <View style={{width: '49%'}}>
                <FormButton
                  onPress={() => {
                    setDetail('');
                    setReasonValue(null);
                    token != null ? RBSheetReportService.current.open(): openLoginAlert();
                  }}
                  buttonTitle={Translation.serviceDetailReport}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  iconName={'alert-triangle'}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={RBSheetSendMessage}
        height={Dimensions.get('window').height * 0.5}
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
              {Translation.serviceDetailReportSendMessage}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetSendMessage.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>{Translation.serviceDetailMessage}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.serviceDetailMessagePlaceholder}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <Text style={[styles.manageServicesRBSSubHeading, {marginLeft: 5}]}>
             {Translation.serviceDetailReportSendMessageFreelancer}
            </Text>
            <FormButton
              onPress={() => sendMessage()}
              buttonTitle={Translation.serviceDetailSendMessage}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
      <RBSheet
        ref={RBSheetReportService}
        height={Dimensions.get('window').height * 0.5}
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
              {Translation.serviceDetailReportService}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetReportService.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>{Translation.serviceDetailReason}</Text>
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
              placeholder={Translation.serviceDetailSelectReason}
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
            <Text style={styles.inputHeading}>{Translation.serviceDetailDescription}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.serviceDetailDescription}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>

            <FormButton
              onPress={() => reportService()}
              buttonTitle={Translation.serviceDetailReportNow}
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

export default ServiceDetail;
