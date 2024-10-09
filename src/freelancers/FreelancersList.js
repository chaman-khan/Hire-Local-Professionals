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
import React, {useState, useEffect, useRef} from 'react';
import ServiceProviderCard from '../home/ServiceProviderCard';
import Header from '../components/Header';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import {BarIndicator, BallIndicator} from 'react-native-indicators';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from '../components/FormButton';
import {useSelector, useDispatch} from 'react-redux';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const FreelancersList = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const RBSheetFilter = useRef();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [selectedInfo, setselectedInfo] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const [pageNumber, setpageNumber] = useState(1);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState([]);
  const [selectedHourlyRates, setSelectedHourlyRates] = useState('');
  const [selectedIndustrialExperience, setSelectedIndustrialExperience] =
    useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEnglishLevel, setSelectedEnglishLevel] = useState([]);
  const [selectedLoaction, setSelectedLoaction] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const userInfo = useSelector(state => state.value.userInfo);
  const freelancerTaxonomy = useSelector(
    state => state.global.freelancerTypeTaxonomy,
  );
  const industrialExperienceTaxonomy = useSelector(
    state => state.global.industrialExperienceTaxonomy,
  );
  const specializationTaxonomy = useSelector(
    state => state.global.specializationTaxonomy,
  );
  const skillTaxonomy = useSelector(state => state.global.skillTaxonomy);
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const hourlyRateTaxonomy = useSelector(
    state => state.global.hourlyRateTaxonomy,
  );
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [freelancers, setFreelancers] = useState([]);
  const [freelancerTypeArray, setFreelancerTypeArray] =
    useState(freelancerTaxonomy);
  const [hourlyRateArray, setHourlyRateArray] = useState(hourlyRateTaxonomy);
  const [industrialExperienceArray, setIndustrialExperienceArray] = useState(
    industrialExperienceTaxonomy,
  );
  const [sepcializationArray, setSepcializationArray] = useState(
    specializationTaxonomy,
  );
  const [skillsArray, setSkillsArray] = useState(skillTaxonomy);
  const [englishLevelArray, setEnglishLevelArray] =
    useState(englishLevelTaxonomy);
  const [locationArray, setLocationArray] = useState(locationTaxonomy);
  const [languagesArray, setLanguagesArray] = useState(languageTaxonomy);
  const [filter, setFilter] = useState([
    {
      name:
        settings.freelancer_search_filters.freelancer_type != 'enable'
          ? ''
          : Translation.freelancersListTabFreelancer,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_per_rate != 'enable'
          ? ''
          : Translation.freelancersListTabHourly,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_industrial_exprience !=
        'enable'
          ? ''
          : Translation.freelancersListTabIndustrial,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_specializations !=
        'enable'
          ? ''
          : Translation.freelancersListTabSpecialization,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_skills != 'enable'
          ? ''
          : Translation.freelancersListTabSkills,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_english != 'enable'
          ? ''
          : Translation.freelancersListTabEnglish,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_locations != 'enable'
          ? ''
          : Translation.freelancersListTabLocation,
    },
    {
      name:
        settings.freelancer_search_filters.freelancer_languages != 'enable'
          ? ''
          : Translation.freelancersListTabLanguages,
    },
  ]);

  useEffect(() => {
    getFreelancerList();
  }, [searchVal]);

  const getFreelancerList = async () => {
    setSpinner(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=search&show_users=10&keyword=' +
        searchVal +
        '&profile_id=' +
        userInfo.profile_id +
        '&user_id=' +
        userInfo.id +
        '&language=' +
        JSON.stringify(selectedLanguage) +
        '&location=' +
        JSON.stringify(selectedLoaction) +
        '&skills=' +
        JSON.stringify(selectedSkills) +
        '&english_level=' +
        JSON.stringify(selectedEnglishLevel) +
        '&hourly_rate=' +
        selectedHourlyRates +
        '&type=' +
        JSON.stringify(selectedFreelancer) +
        '&industrial_experience=' +
        JSON.stringify(selectedIndustrialExperience),
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
        setSpinner(false);
        setFreelancers(
          responseJson.freelancers != null
            ? responseJson.freelancers.freelancers_data
            : [],
        );
        setpageNumber(2);
      })
      .catch(error => {
        setSpinner(false);
        // setLoader(false);
      });
  };
  const loadMoreData = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=search&show_users=10&profile_id=' +
        '&page_number=' +
        pageNumber +
        searchVal +
        '&profile_id=' +
        userInfo.profile_id +
        '&user_id=' +
        userInfo.id +
        '&language=' +
        JSON.stringify(selectedLanguage) +
        '&location=' +
        JSON.stringify(selectedLoaction) +
        '&skills=' +
        JSON.stringify(selectedSkills) +
        '&english_level=' +
        JSON.stringify(selectedEnglishLevel) +
        '&hourly_rate=' +
        selectedHourlyRates +
        '&type=' +
        JSON.stringify(selectedFreelancer) +
        '&industrial_experience=' +
        JSON.stringify(selectedIndustrialExperience),
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
          let data = responseJson.freelancers.freelancers_data;
          setFreelancers(freelancers.concat(data));
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
      if (freelancers.length >= 10) {
        loadMoreData();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const handelSelectedItem = (item, index) => {
    switch (selectedInfo) {
      case 0:
        if (!selectedFreelancer.includes(item.slug)) {
          selectedFreelancer.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedFreelancer.length; j++) {
            if (selectedFreelancer[j] == item.slug) {
              selectedFreelancer.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 1:
        setSelectedHourlyRates(item.slug);
        setRefreshFlatList(!refreshFlatlist);
        break;
      case 2:
        if (!selectedIndustrialExperience.includes(item.slug)) {
          selectedIndustrialExperience.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedIndustrialExperience.length; j++) {
            if (selectedIndustrialExperience[j] == item.slug) {
              selectedIndustrialExperience.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 3:
        if (!selectedSpecialization.includes(item.slug)) {
          selectedSpecialization.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedSpecialization.length; j++) {
            if (selectedSpecialization[j] == item.slug) {
              selectedSpecialization.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 4:
        if (!selectedSkills.includes(item.slug)) {
          selectedSkills.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedSkills.length; j++) {
            if (selectedSkills[j] == item.slug) {
              selectedSkills.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 5:
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
      case 6:
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
      case 7:
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
      default:
        break;
    }
  };
  const handleClearFilter = () => {
    setSelectedFreelancer([]);
    setSelectedHourlyRates('');
    setSelectedIndustrialExperience([]);
    setSelectedSpecialization([]);
    setSelectedSkills([]);
    setSelectedEnglishLevel([]);
    setSelectedLoaction([]);
    setSelectedLanguage([]);
    setselectedInfo(null);
    getFreelancerList();
  };
  const handleSearchValue = text => {
    setSearchVal(text);
  };
  const handleApplyFilter = () => {
    RBSheetFilter.current.close();
    getFreelancerList();
  };
  const handelSearchKeyword = val => {
    switch (selectedInfo) {
      case 0:
        if (val) {
          const newData = freelancerTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFreelancerTypeArray(newData);
          setSearch(val);
        } else {
          setFreelancerTypeArray(freelancerTaxonomy);
          setSearch(val);
        }
        break;
      case 1:
        if (val) {
          const newData = hourlyRateTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setHourlyRateArray(newData);
          setSearch(val);
        } else {
          setHourlyRateArray(hourlyRateTaxonomy);
          setSearch(val);
        }
        break;
      case 2:
        if (val) {
          const newData = industrialExperienceTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setIndustrialExperienceArray(newData);
          setSearch(val);
        } else {
          setIndustrialExperienceArray(industrialExperienceTaxonomy);
          setSearch(val);
        }
        break;
      case 3:
        if (val) {
          const newData = specializationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setSepcializationArray(newData);
          setSearch(val);
        } else {
          setSepcializationArray(specializationTaxonomy);
          setSearch(val);
        }
        break;
      case 4:
        if (val) {
          const newData = skillTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setSkillsArray(newData);
          setSearch(val);
        } else {
          setSkillsArray(skillTaxonomy);
          setSearch(val);
        }
        break;
      case 5:
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
      case 6:
        if (val) {
          const newData = locationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setEnglishLevelArray(newData);
          setSearch(val);
        } else {
          setEnglishLevelArray(locationTaxonomy);
          setSearch(val);
        }
        break;
      case 7:
        if (val) {
          const newData = languageTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setLanguagesArray(newData);
          setSearch(val);
        } else {
          setLanguagesArray(languageTaxonomy);
          setSearch(val);
        }
        break;
      default:
        break;
    }
  };
  const handelClearItem = (item, index) => {
    switch (selectedInfo) {
      // setselectedInfo(null);
      // getFreelancerList();
      case 0:
        setSelectedFreelancer([]);
        break;
      case 1:
        setSelectedHourlyRates('');
        break;
      case 2:
        setSelectedIndustrialExperience([]);
        break;
      case 3:
        setSelectedSpecialization([]);
      case 4:
        setSelectedSkills([]);
        break;
      case 5:
        setSelectedEnglishLevel([]);
        break;
      case 6:
        setSelectedLoaction([]);
        break;
      case 7:
        setSelectedLanguage([]);
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
        backIcon={true}
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
                  onPress={() => {
                    RBSheetFilter.current.open();
                    setselectedInfo(index);
                    handelSearchKeyword("")
                    setSearch("")
                  }}
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
                    {item.name}{' '}
                    {index == 0
                      ? selectedFreelancer.length > 0
                        ? `(${selectedFreelancer.length})`
                        : ''
                      : index == 1
                      ? selectedHourlyRates != ''
                        ? `(1)`
                        : ''
                      : index == 2
                      ? selectedIndustrialExperience.length > 0
                        ? `(${selectedIndustrialExperience.length})`
                        : ''
                      : index == 3
                      ? selectedSpecialization.length > 0
                        ? `(${selectedSpecialization.length})`
                        : ''
                      : index == 4
                      ? selectedSkills.length > 0
                        ? `(${selectedSkills.length})`
                        : ''
                      : index == 5
                      ? selectedEnglishLevel.length > 0
                        ? `(${selectedEnglishLevel.length})`
                        : ''
                      : index == 6
                      ? selectedLoaction.length > 0
                        ? `(${selectedLoaction.length})`
                        : ''
                      : selectedLanguage.length > 0
                      ? `(${selectedLanguage.length})`
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
          {Translation.freelancersListTabExplore}
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
          // freelancers.length != 0 && (
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
            data={freelancers}
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
                  navigation.navigate('FreelancerDetail', {item: item})
                }>
                <ServiceProviderCard width="100%" item={item} />
              </TouchableOpacity>
            )}
          />
          // )
        )}
      </View>
      {loader == true && (
        <View style={{marginTop: 15, marginBottom: 20}}>
          <BarIndicator count={6} size={20} color={Constant.primaryColor} />
        </View>
      )}
      <RBSheet
        ref={RBSheetFilter}
        height={Dimensions.get('window').height * 0.6}
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
                ? Translation.freelancersListTabFreelancer
                : selectedInfo == 1
                ? Translation.freelancersListTabHourly
                : selectedInfo == 2
                ? Translation.freelancersListTabIndustrial
                : selectedInfo == 3
                ? Translation.freelancersListTabSpecialization
                : selectedInfo == 4
                ? Translation.freelancersListTabSkills
                : selectedInfo == 5
                ? Translation.freelancersListTabEnglish
                : selectedInfo == 6
                ? Translation.freelancersListTabLocation
                : Translation.freelancersListTabLanguages}
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
            <Feather name="search" color={Constant.lightGrayColor} size={20} />
            <TextInput
              style={{marginLeft: 8, color:Constant.fontColor}}
              value={search}
              onChangeText={text => handelSearchKeyword(text)}
              placeholder={Translation.globalStartSearch}
              placeholderTextColor="#676767"
              underlineColorAndroid="transparent"
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              selectedInfo == 0
                ? freelancerTypeArray
                : selectedInfo == 1
                ? hourlyRateArray
                : selectedInfo == 2
                ? industrialExperienceArray
                : selectedInfo == 3
                ? sepcializationArray
                : selectedInfo == 4
                ? skillsArray
                : selectedInfo == 5
                ? englishLevelArray
                : selectedInfo == 6
                ? locationArray
                : languagesArray
            }
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            extraData={refreshFlatlist}
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
                        selectedFreelancer.includes(item.slug) ||
                        // selectedHourlyRates.includes(item.slug) ||
                        selectedHourlyRates == item.slug ||
                        selectedIndustrialExperience.includes(item.slug) ||
                        selectedSpecialization.includes(item.slug) ||
                        selectedSkills.includes(item.slug) ||
                        selectedEnglishLevel.includes(item.slug) ||
                        selectedLoaction.includes(item.slug) ||
                        selectedLanguage.includes(item.slug)
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedFreelancer.includes(item.slug) ||
                        // selectedHourlyRates.includes(item.slug) ||
                        selectedHourlyRates == item.slug ||
                        selectedIndustrialExperience.includes(item.slug) ||
                        selectedSpecialization.includes(item.slug) ||
                        selectedSkills.includes(item.slug) ||
                        selectedEnglishLevel.includes(item.slug) ||
                        selectedLoaction.includes(item.slug) ||
                        selectedLanguage.includes(item.slug)
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
                          selectedFreelancer.includes(item.slug) ||
                          // selectedHourlyRates.includes(item.slug) ||
                          selectedHourlyRates == item.slug ||
                          selectedIndustrialExperience.includes(item.slug) ||
                          selectedSpecialization.includes(item.slug) ||
                          selectedSkills.includes(item.slug) ||
                          selectedEnglishLevel.includes(item.slug) ||
                          selectedLoaction.includes(item.slug) ||
                          selectedLanguage.includes(item.slug)
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
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <View style={{marginBottom: 10, width: '48%'}}>
              <FormButton
                buttonTitle={Translation.globalApplyFilter}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                onPress={() => handleApplyFilter()}
              />
            </View>
            <View style={{marginBottom: 10, width: '48%'}}>
              <FormButton
                buttonTitle={Translation.globalClearFilter}
                backgroundColor={Constant.grayColor}
                textColor={Constant.fontColor}
                onPress={() => handelClearItem()}
              />
            </View>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default FreelancersList;
