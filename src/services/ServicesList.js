import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import ServicesListCard from '../home/ServicesListCard';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {BarIndicator, BallIndicator} from 'react-native-indicators';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from '../components/FormButton';
import {updateUserInfo} from '../redux/AuthSlice';
import {decode} from 'html-entities';
import RangeSlider from 'rn-range-slider';
import Thumb from './Slider/Thumb';
import Label from './Slider/Label';
import Notch from './Slider/Notch';
import Rail from './Slider/Rail';
import RailSelected from './Slider/RailSelected';

const ServicesList = ({navigation, route}) => {
  const onEndReachedCalledDuringMomentum = useRef(true);
  const userInfo = useSelector(state => state.value.userInfo);
  const settings = useSelector(state => state.setting.settings);
  const RBSheetFilter = useRef();
  const [search, setSearch] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [services, setServices] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [lowRange, setLowRange] = useState(lowPriceFromSetting);
  const [highRange, setHighRange] = useState(highPriceFromSetting);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const isFocused = useIsFocused();
  const [selectedInfo, setselectedInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedEnglishLevel, setSelectedEnglishLevel] = useState([]);
  const [selectedLoaction, setSelectedLoaction] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState([]);
  const [selectedResponseTime, setSelectedResponseTime] = useState([]);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [filter, setFilter] = useState([
    {name: Translation.serviceListFilterCategories},
    {
      name:
        settings.services_search_filters.services_price != 'enable'
          ? ''
          : Translation.serviceListFilterPriceRange,
    },
    {
      name:
        settings.services_search_filters.services_locations != 'enable'
          ? ''
          : Translation.serviceListFilterLocation,
    },
    {
      name:
        settings.services_search_filters.services_dilivery != 'enable'
          ? ''
          : Translation.serviceListFilterDeliveryTime,
    },
    {
      name:
        settings.services_search_filters.services_response != 'enable'
          ? ''
          : Translation.serviceListFilterResponseTime,
    },
    {
      name:
        settings.services_search_filters.services_languages != 'enable'
          ? ''
          : Translation.serviceListFilterLanguages,
    },
    {
      name:
        settings.services_search_filters.services_english_level != 'enable'
          ? ''
          : Translation.serviceListFilterEnglishLevel,
    },
  ]);

  const lowPriceFromSetting = useSelector(
    state => state.setting.settings.price_filter_start,
  );
  const highPriceFromSetting = useSelector(
    state => state.setting.settings.price_filter_end,
  );
  const deliveryTaxonomy = useSelector(state => state.global.deliveryTaxonomy);
  const responseTimeTaxonomy = useSelector(
    state => state.global.responseTimeTaxonomy,
  );
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const categoryTaxonomy = useSelector(state => state.global.categoryTaxonomy);
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const [categoryArray, setCategoryArray] = useState(categoryTaxonomy);
  const [locationArray, setLocationArray] = useState(locationTaxonomy);
  const [deliveryTimeArray, setDeliveryTimeArray] = useState(deliveryTaxonomy);
  const [responseTimeArray, setResponseTimeArray] =
    useState(responseTimeTaxonomy);
  const [languageArray, setLanguageArray] = useState(languageTaxonomy);
  const [englishLevelArray, setEnglishLevelArray] =
    useState(englishLevelTaxonomy);

  useEffect(() => {
    if (isFocused) {
      if (route.params.searchWithNav == true) {
        selectedCategory.length = 0;
        selectedCategory.push(route.params.Category);
        setselectedInfo(0);
      }
      getServicesList();
    }
  }, [isFocused, searchVal]);

  const getServicesList = async () => {
    return fetch(
      Constant.BaseUrl +
        'services/get_services?listing_type=search&page_number=1&keyword=' +
        searchVal +
        '&user_id=' +
        userInfo.id +
        '&profile_id=' +
        userInfo.profile_id +
        '&language=' +
        JSON.stringify(selectedLanguage) +
        '&location=' +
        JSON.stringify(selectedLoaction) +
        '&category=' +
        JSON.stringify(selectedCategory) +
        '&english_level=' +
        JSON.stringify(selectedEnglishLevel) +
        '&service_duration=' +
        JSON.stringify(selectedDeliveryTime) +
        '&response_time=' +
        JSON.stringify(selectedResponseTime) +
        '&minprice=' +
        lowRange +
        '&maxprice=' +
        highRange,
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
          setSpinner(false);
          setServices(responseJson.services);
          setpageNumber(2);
        }
      })
      .catch(error => {
        setSpinner(false);
        setLoader(false);
      });
  };
  const loadMoreData = async () => {
    setLoader(true);

    return fetch(
      Constant.BaseUrl +
        'services/get_services?listing_type=search&page_number=1&keyword=' +
        searchVal +
        '&user_id=' +
        userInfo.id +
        '&profile_id=' +
        userInfo.profile_id +
        '&language=' +
        JSON.stringify(selectedLanguage) +
        '&location=' +
        JSON.stringify(selectedLoaction) +
        '&category=' +
        JSON.stringify(selectedCategory) +
        '&english_level=' +
        JSON.stringify(selectedEnglishLevel) +
        '&service_duration=' +
        JSON.stringify(selectedDeliveryTime) +
        '&response_time=' +
        JSON.stringify(selectedResponseTime) +
        '&minprice=' +
        lowRange +
        '&maxprice=' +
        highRange +
        '&page_number=' +
        pageNumber,
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
          setServices(responseJson);
          let data = responseJson.services;
          setServices(services.concat(data));
          setpageNumber(pageNumber + 1);
          setRefreshFlatList(!refreshFlatlist);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };
  const onEndReachedHandler = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (services.length >= 10) {
        loadMoreData();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const handelSelectedItem = (item, index) => {
    switch (selectedInfo) {
      case 0:
        if (!selectedCategory.includes(item.slug)) {
          selectedCategory.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedCategory.length; j++) {
            if (selectedCategory[j] == item.slug) {
              selectedCategory.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 2:
        if (!selectedLoaction.includes(item.slug)) {
          selectedLoaction.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedLoaction.length; j++) {
            if (selectedLoaction[j] == item.slug) {
              selectedLoaction.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 3:
        if (!selectedDeliveryTime.includes(item.slug)) {
          selectedDeliveryTime.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedDelivery.length; j++) {
            if (selectedDeliveryTime[j] == item.slug) {
              selectedDeliveryTime.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }

        break;
      case 4:
        if (!selectedResponseTime.includes(item.slug)) {
          selectedResponseTime.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedResponseTime.length; j++) {
            if (selectedResponseTime[j] == item.slug) {
              selectedResponseTime.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 5:
        if (!selectedLanguage.includes(item.slug)) {
          selectedLanguage.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedLanguage.length; j++) {
            if (selectedLanguage[j] == item.slug) {
              selectedLanguage.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 6:
        if (!selectedEnglishLevel.includes(item.slug)) {
          selectedEnglishLevel.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedEnglishLevel.length; j++) {
            if (selectedEnglishLevel[j] == item.slug) {
              selectedEnglishLevel.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      default:
        break;
    }
  };
  const openSheet = (item, index) => {
    setselectedInfo(index);
    RBSheetFilter.current.open();
    handelSearchKeyword("")
     setSearch("")
  };
  const handelRangeValue = useCallback(
    (newLow, newHigh) => {
      setLowRange(newLow);
      setHighRange(newHigh);
    },
    [setLowRange, setHighRange],
  );
  const handleSearchValue = text => {
    setSearchVal(text);
  };
  const handleApplyFilter = () => {
    RBSheetFilter.current.close();
    getServicesList();
  };
  const handleClearFilter = () => {
    setSelectedEnglishLevel([]);
    setSelectedLoaction([]);
    setSelectedLanguage([]);
    setSelectedDeliveryTime([]);
    setSelectedResponseTime([]);
    setSelectedCategory([]);
    setselectedInfo(null);
    getServicesList();
  };
  const handelSearchKeyword = val => {
    switch (selectedInfo) {
      case 0:
        if (val) {
          const newData = categoryTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setCategoryArray(newData);
          setSearch(val);
        } else {
          setCategoryArray(categoryTaxonomy);
          setSearch(val);
        }
        break;
      case 2:
        if (val) {
          const newData = locationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setLocationArray(newData);
          setSearch(val);
        } else {
          setLocationArray(locationTaxonomy);
          setSearch(val);
        }
        break;
      case 3:
        if (val) {
          const newData = deliveryTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setDeliveryTimeArray(newData);
          setSearch(val);
        } else {
          setDeliveryTimeArray(deliveryTaxonomy);
          setSearch(val);
        }
        break;
      case 4:
        if (val) {
          const newData = responseTimeTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setResponseTimeArray(newData);
          setSearch(val);
        } else {
          setResponseTimeArray(responseTimeTaxonomy);
          setSearch(val);
        }
        break;
      case 5:
        if (val) {
          const newData = languageTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setLanguageArray(newData);
          setSearch(val);
        } else {
          setLanguageArray(languageTaxonomy);
          setSearch(val);
        }
        break;
      case 6:
        if (val) {
          const newData = englishLevelTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setEnglishLevelArray(newData);
          setSearch(val);
        } else {
          setEnglishLevelArray(englishLevelTaxonomy);
          setSearch(val);
        }
        break;
      default:
        break;
    }
  };
  const handelClearItem = () => {
    switch (selectedInfo) {
      case 0:
        setSelectedCategory([]);
        break;
      case 1:
        setLowRange(lowPriceFromSetting);
        setHighRange(highPriceFromSetting);
        break;
      case 2:
        setSelectedLoaction([]);

        break;
      case 3:
        setSelectedLoaction([]);
        setSelectedDeliveryTime([]);
        break;
      case 4:
        setSelectedResponseTime([]);
        break;
      case 5:
        setSelectedLanguage([]);
        break;
      case 6:
        setSelectedEnglishLevel([]);

        break;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        backIcon={route.params.backDisable ? false : true}
        searchWithInput={true}
        handleSearchValue={handleSearchValue}
      />
      <View style={[styles.freelancerDetailTopTabView, {flexDirection: 'row'}]}>
        <TouchableOpacity
          activeOpacity={0.2}
          style={[styles.headerDrawerIcon, {marginRight: 10}]}>
          <Feather name="sliders" color={'#484848'} size={16} />
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={{alignItems: 'center'}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filter}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => openSheet(item, index)}
                  style={[
                    styles.freelancerDetailTopTabViewSingle,
                    {
                      backgroundColor:
                        selectedInfo == index
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedInfo == index
                          ? Constant.whiteColor
                          : Constant.borderColor,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.freelancerDetailTopTabViewSingleText,
                      {
                        color:
                          selectedInfo == index
                            ? Constant.whiteColor
                            : Constant.fontColor,
                      },
                    ]}>
                    {item.name}
                    {index == 0
                      ? selectedCategory.length > 0
                        ? `(${selectedCategory.length})`
                        : ''
                      : // : index == 1
                      // ? selectedHourlyRates != ''
                      //   ? `(1)`
                      //   : ''
                      index == 2
                      ? selectedLoaction.length > 0
                        ? `(${selectedLoaction.length})`
                        : ''
                      : index == 3
                      ? selectedDeliveryTime.length > 0
                        ? `(${selectedDeliveryTime.length})`
                        : ''
                      : index == 4
                      ? selectedResponseTime.length > 0
                        ? `(${selectedResponseTime.length})`
                        : ''
                      : index == 5
                      ? selectedLanguage.length > 0
                        ? `(${selectedLanguage.length})`
                        : ''
                      : selectedEnglishLevel.length > 0
                      ? `(${selectedEnglishLevel.length})`
                      : ''}
                  </Text>
                  <Feather
                    style={{marginLeft: 5}}
                    name="plus"
                    color={
                      selectedInfo == index
                        ? Constant.whiteColor
                        : Constant.fontColor
                    }
                    size={15}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={() => handleClearFilter()}>
              <Text
                style={[
                  styles.ServiceProviderCardReviewCountStyle,
                  {color: Constant.lightGrayColor, fontFamily: 'Outfit-Bold'},
                ]}>
                {Translation.globalClearFilters}
              </Text>
            </TouchableOpacity>
          }
        />
      </View>

      <View style={[styles.cardView, {marginTop: 10, flex: 1}]}>
        <Text style={styles.homeHeadingStyle}>
          {Translation.serviceListExploreServices}
        </Text>
        {spinner ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Constant.whiteColor,
              zIndex: 20,
            }}>
            <View style={{marginTop: -70}}>
              <BallIndicator count={8} size={26} color={Constant.fontColor} />
            </View>
          </View>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop: '40%',
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
            data={services}
            keyExtractor={(x, i) => i.toString()}
            extraData={refreshFlatlist}
            onEndReached={() => onEndReachedHandler()}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ServiceDetail', {
                    item: item,
                    edit: false,
                  })
                }>
                <ServicesListCard width="100%" item={item} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {loader == true && (
        <View style={{marginTop: 15, marginBottom: 20}}>
          <BarIndicator count={6} size={20} color={Constant.primaryColor} />
        </View>
      )}
      <RBSheet
        ref={RBSheetFilter}
        height={
          selectedInfo == 1
            ? Dimensions.get('window').height * 0.4
            : Dimensions.get('window').height * 0.4
        }
        duration={250}
        customStyles={{
          container: {
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: 'transparent',
          },
        }}>
        <View
          style={{
            backgroundColor: Constant.whiteColor,
            padding: 10,
            flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.freelancerDetailCardNameTextStyle}>
              {selectedInfo == 0
                ? Translation.serviceListFilterCategories
                : selectedInfo == 1
                ? Translation.serviceListFilterPriceRange
                : selectedInfo == 2
                ? Translation.serviceListFilterLocation
                : selectedInfo == 3
                ? Translation.serviceListFilterDeliveryTime
                : selectedInfo == 4
                ? Translation.serviceListFilterResponseTime
                : selectedInfo == 5
                ? Translation.serviceListFilterLanguages
                : Translation.serviceListFilterEnglishLevel}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetFilter.current.close()}
              style={{
                height: 45,
                width: 45,
                borderRadius: 45 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Constant.grayColor,
              }}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          {selectedInfo == 1 ? null : (
            <View
              style={[
                styles.headerMainSearchView,
                {
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: Constant.whiteColor,
                  marginBottom: 10,
                },
              ]}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8, color:Constant.fontColor}}
                value={search}
                onChangeText={text => handelSearchKeyword(text)}
                placeholder={'Start seacrh here'}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View>
          )}

          {selectedInfo == 1 ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                  // marginHorizontal: 5,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 26,
                      // marginHorizontal: 15,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontBold,
                      color: Constant.fontColor,
                    }}>
                    {Translation.serviceListMin}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 26,
                      // marginHorizontal: 15,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontRegular,
                      color: Constant.fontColor,
                    }}>
                    {lowRange}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 26,
                      // marginHorizontal: 15,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontBold,
                      color: Constant.fontColor,
                    }}>
                    {Translation.serviceListMax}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 26,
                      // marginHorizontal: 15,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontRegular,
                      color: Constant.fontColor,
                    }}>
                    {highRange}
                  </Text>
                </View>
              </View>
              <RangeSlider
                style={{
                  paddingVertical: 20,
                }}
                gravity={'center'}
                min={parseInt(lowPriceFromSetting)}
                max={parseInt(highPriceFromSetting)}
                floatingLabel
                step={1}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                // renderLabel={renderLabel}
                // renderNotch={renderNotch}
                onValueChanged={handelRangeValue}
              />
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={
                selectedInfo == 0
                  ? categoryArray
                  : // : selectedInfo == 1
                  // ? null
                  selectedInfo == 2
                  ? locationArray
                  : selectedInfo == 3
                  ? deliveryTimeArray
                  : selectedInfo == 4
                  ? responseTimeArray
                  : selectedInfo == 5
                  ? languageArray
                  : englishLevelArray
              }
              style={{marginBottom: 10}}
              columnWrapperStyle={{flexWrap: 'wrap'}}
              numColumns={20}
              keyExtractor={(x, i) => i.toString()}
              ListEmptyComponent={
                <>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 40,
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
              renderItem={({item, index}) => (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={[
                      styles.JobDetailItemView,
                      {
                        backgroundColor:
                          selectedCategory.includes(item.slug) ||
                          selectedDeliveryTime.includes(item.slug) ||
                          selectedResponseTime.includes(item.slug) ||
                          selectedEnglishLevel.includes(item.slug) ||
                          selectedLanguage.includes(item.slug) ||
                          selectedLoaction.includes(item.slug)
                            ? Constant.greenColor
                            : Constant.whiteColor,
                        borderColor:
                          selectedCategory.includes(item.slug) ||
                          selectedDeliveryTime.includes(item.slug) ||
                          selectedResponseTime.includes(item.slug) ||
                          selectedEnglishLevel.includes(item.slug) ||
                          selectedLanguage.includes(item.slug) ||
                          selectedLoaction.includes(item.slug)
                            ? Constant.whiteColor
                            : Constant.borderColor,
                      },
                    ]}
                    onPress={() => handelSelectedItem(item, index)}>
                    <Text
                      style={[
                        styles.JobDetailItemText,
                        {
                          color:
                            selectedCategory.includes(item.slug) ||
                            selectedDeliveryTime.includes(item.slug) ||
                            selectedResponseTime.includes(item.slug) ||
                            selectedEnglishLevel.includes(item.slug) ||
                            selectedLanguage.includes(item.slug) ||
                            selectedLoaction.includes(item.slug)
                              ? Constant.whiteColor
                              : Constant.fontColor,
                        },
                      ]}>
                      {decode(item.name)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <View
              style={{
                marginBottom: 10,
                width: selectedInfo != 1 ? '48%' : '100%',
              }}>
              <FormButton
                buttonTitle={Translation.globalApplyFilter}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                onPress={() => handleApplyFilter()}
              />
            </View>
            {selectedInfo != 1 && (
              <View style={{marginBottom: 10, width: '48%'}}>
                <FormButton
                  buttonTitle={Translation.globalClearFilter}
                  backgroundColor={Constant.grayColor}
                  textColor={Constant.fontColor}
                  onPress={() => handelClearItem()}
                />
              </View>
            )}
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default ServicesList;
