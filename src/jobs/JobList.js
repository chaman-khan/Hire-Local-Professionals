import {
  Image,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import JobCard from './JobCard';
import Header from '../components/Header';
import FormButton from '../components/FormButton';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {BarIndicator, BallIndicator} from 'react-native-indicators';
import {decode} from 'html-entities';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import Translation from '../constants/Translation';

const JobList = ({navigation, route}) => {
  const settings = useSelector(state => state.setting.settings);
  const isFocused = useIsFocused();
  const RBSheetFilter = useRef();
  const refList = useRef();
  const [selectedInfo, setselectedInfo] = useState(null);
  const [search, setSearch] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [pageNumber, setpageNumber] = useState(1);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const userInfo = useSelector(state => state.value.userInfo);
  const [jobType, setjobType] = useState([]);
  const [projectType, setprojectType] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState([]);
  const [selectedIndustrialExperience, setSelectedIndustrialExperience] =
    useState([]);
  const [selectedProjectDuration, setSelectedProjectDuration] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEnglishLevel, setSelectedEnglishLevel] = useState([]);
  const [selectedLoaction, setSelectedLoaction] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFreelancerType, setSelectedFreelancerType] = useState([]);
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const durationTaxonomy = useSelector(state => state.global.durationTaxonomy);
  const projectExperienceTaxonomy = useSelector(
    state => state.global.projectExperienceTaxonomy,
  );
  const skillTaxonomy = useSelector(state => state.global.skillTaxonomy);
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const categoryTaxonomy = useSelector(state => state.global.categoryTaxonomy);
  const freelancerTaxonomy = useSelector(
    state => state.global.freelancerTypeTaxonomy,
  );
  const [languagesArray, setLanguagesArray] = useState(languageTaxonomy);
  const [loactionArray, setLoactionArray] = useState(locationTaxonomy);
  const [skillsArray, setSkillsArray] = useState(skillTaxonomy);
  const [categoriesArray, setCategoriesArray] = useState(categoryTaxonomy);
  const [experienceArray, setExperienceArray] = useState(
    projectExperienceTaxonomy,
  );
  const [durationArray, setDurationArray] = useState(durationTaxonomy);
  const [projectTypeArray, setProjectTypeArray] = useState(projectType);
  const [englishLevelArray, setEnglishLevelArray] =
    useState(englishLevelTaxonomy);
  const [jobTypeArray, setJobTypeArray] = useState(jobType);
  const [freelancerTypeArray, setFreelancerTypeArray] =
  useState(freelancerTaxonomy);
  const [filter, setFilter] = useState([
    {
      name:
        settings.jobs_search_filters.job_type != 'enable'
          ? ''
          : Translation.jobListTabJob,
    },
    {
      name:
        settings.jobs_search_filters.job_english_level != 'enable'
          ? ''
          : Translation.jobListTabEnglish,
    },
    {
      name:
        settings.jobs_search_filters.job_option_type != 'enable'
          ? ''
          : Translation.jobListTabProject,
    },
    {
      name:
        settings.jobs_search_filters.job_length != 'enable'
          ? ''
          : Translation.jobListTabProjectLength,
    },
    {
      name:
        settings.jobs_search_filters.job_exprience_type != 'enable'
          ? ''
          : Translation.jobListTabExperience,
    },
    {
      name:
        settings.jobs_search_filters.job_categories != 'enable'
          ? ''
          : Translation.jobListTabCategories,
    },
    {
      name:
        settings.jobs_search_filters.job_skills != 'enable'
          ? ''
          : Translation.jobListTabSkills,
    },
    {
      name:
        settings.jobs_search_filters.job_locations != 'enable'
          ? ''
          : Translation.jobListTabLocation,
    },
    {
      name:
        settings.jobs_search_filters.job_languages != 'enable'
          ? ''
          : Translation.jobListTabLanguages,
    },
    {
      name:
        settings.jobs_search_filters.job_freelancer_type != 'enable'
          ? ''
          : Translation.jobListTabFreelancerType,
    },
  ]);
  const getItemLayout = (data, index) => ({
    length: 80,
    offset: 100 * index,
    index,
  });
  useEffect(() => {
    if (isFocused) {
      if (route.params.searchWithNav == true) {
        if (route.params.type == 'category') {
          selectedCategory.length = 0;
          selectedCategory.push(route.params.jobCategory);
          setselectedInfo(5);
          refList.current.scrollToIndex({
            animated: true,
            index: 5,
            viewPosition: 0,
          });
        } else if (route.params.type == 'country') {
          selectedLoaction.length = 0;
          selectedLoaction.push(route.params.country.country_slug);
          setselectedInfo(7);
          refList.current.scrollToIndex({
            animated: true,
            index: 7,
            viewPosition: 0,
          });
        }
      }
      jobType.length = 0;
      projectType.length = 0;
      Object.entries(settings.job_types).forEach(([key, value]) =>
        jobType.push({
          slug: key,
          name: value,
        }),
      );
      Object.entries(settings.project_settings.get_job_type).forEach(
        ([key, value]) =>
          projectType.push({
            slug: key,
            name: value,
          }),
      );

      getJobList();
    }
  }, [searchVal, isFocused]);

  const getJobList = async () => {
    setSpinner(true);
    return fetch(
      Constant.BaseUrl +
      'listing/get_jobs?listing_type=search&page_number=1&minprice=' + settings.price_filter_start + '&maxprice=' + settings.price_filter_end + '&keyword=' +
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
        '&duration=' +
        JSON.stringify(selectedProjectDuration) +
        '&type=' +
        JSON.stringify(selectedFreelancerType) +
        '&job_type=' +
        JSON.stringify(selectedFreelancer) +
        '&project_type=' +
        selectedProjectType +
        '&category=' +
        JSON.stringify(selectedCategory) +
        '&experience=' +
        JSON.stringify(selectedExperience),
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
        setJobs(responseJson.jobs);
        setpageNumber(2);
      })
      .catch(error => {
        setSpinner(false);
      });
  };
  const loadMoreData = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
      'listing/get_jobs?listing_type=search&page_number=1&minprice=' + settings.price_filter_start + '&maxprice=' + settings.price_filter_end + '&keyword=' +
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
        '&duration=' +
        JSON.stringify(selectedProjectDuration) +
        '&type=' +
        JSON.stringify(selectedFreelancerType) +
        '&job_type=' +
        JSON.stringify(selectedFreelancer) +
        '&project_type=' +
        selectedProjectType +
        '&category=' +
        JSON.stringify(selectedCategory) +
        '&experience=' +
        JSON.stringify(selectedExperience) +
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
          let data = responseJson.jobs;
          setJobs(jobs.concat(data));
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
      if (jobs.length >= 10) {
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
      case 2:
        setSelectedProjectType(item.slug);
        setRefreshFlatList(!refreshFlatlist);
        break;
      case 3:
        if (!selectedProjectDuration.includes(item.slug)) {
          selectedProjectDuration.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedProjectDuration.length; j++) {
            if (selectedProjectDuration[j] == item.slug) {
              selectedProjectDuration.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 4:
        if (!selectedExperience.includes(item.slug)) {
          selectedExperience.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedExperience.length; j++) {
            if (selectedExperience[j] == item.slug) {
              selectedExperience.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 5:
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
      case 6:
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
      case 7:
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
      case 8:
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
        case 9:
          if (!selectedFreelancerType.includes(item.slug)) {
            selectedFreelancerType.push(item.slug);
            setRefreshFlatList(!refreshFlatlist);
          } else {
            for (var j = 0; j < selectedFreelancerType.length; j++) {
              if (selectedFreelancerType[j] == item.slug) {
                selectedFreelancerType.splice(j, 1);
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
    setSelectedProjectType('');
    setSelectedIndustrialExperience([]);
    setSelectedProjectDuration([]);
    setSelectedSkills([]);
    setSelectedExperience([]);
    setSelectedEnglishLevel([]);
    setSelectedCategory([]);
    setSelectedLoaction([]);
    setSelectedLanguage([]);
    setselectedInfo(null);
    getJobList();
  };
  const handleSearchValue = text => {
    setSearchVal(text);
  };
  const handleApplyFilter = () => {
    RBSheetFilter.current.close();
    getJobList();
  };
  const handelSearchKeyword = val => {
    switch (selectedInfo) {
      case 0:
        if (val) {
          const newData = jobType.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setJobTypeArray(newData);
          setSearch(val);
        } else {
          setJobTypeArray(jobType);
          setSearch(val);
        }
        break;
      case 1:
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
      case 2:
        if (val) {
          const newData = projectType.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setProjectTypeArray(newData);
          setSearch(val);
        } else {
          setProjectTypeArray(projectType);
          setSearch(val);
        }
        break;
      case 3:
        if (val) {
          const newData = durationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setDurationArray(newData);
          setSearch(val);
        } else {
          setDurationArray(durationTaxonomy);
          setSearch(val);
        }
        break;
      case 4:
        if (val) {
          const newData = projectExperienceTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setExperienceArray(newData);
          setSearch(val);
        } else {
          setExperienceArray(projectExperienceTaxonomy);
          setSearch(val);
        }
        break;
      case 5:
        if (val) {
          const newData = categoryTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setCategoriesArray(newData);
          setSearch(val);
        } else {
          setCategoriesArray(categoryTaxonomy);
          setSearch(val);
        }
        break;
      case 6:
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
      case 7:
        if (val) {
          const newData = locationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setLoactionArray(newData);
          setSearch(val);
        } else {
          setLoactionArray(locationTaxonomy);
          setSearch(val);
        }
        break;
      case 8:
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
        case 9:
          if (val) {
            const newData = freelancerTaxonomy.filter((item) => {
              const itemData = item.name
                ? item.name.toUpperCase()
                : "".toUpperCase();
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
        default:
          break;
    }
  };
  const handelClearItem = () => {
    switch (selectedInfo) {
      case 0:
        setSelectedFreelancer([]);
        break;
      case 1:
        setSelectedEnglishLevel([]);
        break;
      case 2:
        setSelectedProjectType('');
        break;
      case 3:
        setSelectedProjectDuration([]);
        break;
      case 4:
        setSelectedExperience([]);
        break;
      case 5:
        setSelectedCategory([]);
        break;
      case 6:
        setSelectedSkills([]);
        break;
      case 7:
        setSelectedLoaction([]);
        break;
      case 8:
        setSelectedLanguage([]);
        break;
      case 9:
        setSelectedFreelancerType([]);
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
          ref={refList}
          getItemLayout={getItemLayout}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => {
                    RBSheetFilter.current.open();
                    setselectedInfo(index);
                    handelSearchKeyword('');
                    setSearch('');
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
                    {item.name}
                    {index == 0
                      ? selectedFreelancer.length > 0
                        ? `(${selectedFreelancer.length})`
                        : ''
                      : index == 1
                      ? selectedEnglishLevel.length > 0
                        ? `(${selectedEnglishLevel.length})`
                        : ''
                      : index == 2
                      ? selectedProjectType != ''
                        ? `(1)`
                        : ''
                      : index == 3
                      ? selectedProjectDuration.length > 0
                        ? `(${selectedProjectDuration.length})`
                        : ''
                      : index == 4
                      ? selectedExperience.length > 0
                        ? `(${selectedExperience.length})`
                        : ''
                      : index == 5
                      ? selectedCategory.length > 0
                        ? `(${selectedCategory.length})`
                        : ''
                      : index == 6
                      ? selectedSkills.length > 0
                        ? `(${selectedSkills.length})`
                        : ''
                      : index == 7
                      ? selectedLoaction.length > 0
                        ? `(${selectedLoaction.length})`
                        : ''
                      : index == 8
                      ? selectedLanguage.length > 0
                        ? `(${selectedLanguage.length})`
                        : ''
                      : selectedFreelancerType.length > 0
                      ? `(${selectedFreelancerType.length})`
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
      {spinner ? (
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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={jobs}
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
          keyExtractor={(x, i) => i.toString()}
          extraData={refreshFlatlist}
          onEndReached={() => onEndReachedHandler()}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('JobDetail', {item: item})}>
              <JobCard item={item} />
            </TouchableOpacity>
          )}
        />
      )}
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
                ? Translation.jobListTabJob
                : selectedInfo == 1
                ? Translation.jobListTabEnglish
                : selectedInfo == 2
                ? Translation.jobListTabProject
                : selectedInfo == 3
                ? Translation.jobListTabProjectLength
                : selectedInfo == 4
                ? Translation.jobListTabExperience
                : selectedInfo == 5
                ? Translation.jobListTabCategories
                : selectedInfo == 6
                ? Translation.jobListTabSkills
                : selectedInfo == 7
                ? Translation.jobListTabLocation
                : selectedInfo == 8
                ? Translation.jobListTabLanguages
                : Translation.jobListTabFreelancerType}
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
              style={{marginLeft: 8, color: Constant.fontColor}}
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
                ? jobTypeArray
                : selectedInfo == 1
                ? englishLevelArray
                : selectedInfo == 2
                ? projectTypeArray
                : selectedInfo == 3
                ? durationArray
                : selectedInfo == 4
                ? experienceArray
                : selectedInfo == 5
                ? categoriesArray
                : selectedInfo == 6
                ? skillsArray
                : selectedInfo == 7
                ? loactionArray
                : selectedInfo == 8
                ? languagesArray
                : freelancerTypeArray
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
                        selectedEnglishLevel.includes(item.slug) ||
                        selectedProjectType == item.slug ||
                        selectedIndustrialExperience.includes(item.slug) ||
                        selectedProjectDuration.includes(item.slug) ||
                        selectedSkills.includes(item.slug) ||
                        selectedExperience.includes(item.slug) ||
                        selectedLoaction.includes(item.slug) ||
                        selectedCategory.includes(item.slug) ||
                        selectedLanguage.includes(item.slug) ||
                        selectedFreelancerType.includes(item.slug)
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedFreelancer.includes(item.slug) ||
                        // selectedHourlyRates.includes(item.slug) ||
                        selectedEnglishLevel.includes(item.slug) ||
                        selectedProjectType == item.slug ||
                        selectedIndustrialExperience.includes(item.slug) ||
                        selectedProjectDuration.includes(item.slug) ||
                        selectedSkills.includes(item.slug) ||
                        selectedExperience.includes(item.slug) ||
                        selectedLoaction.includes(item.slug) ||
                        selectedCategory.includes(item.slug) ||
                        selectedLanguage.includes(item.slug) ||
                        selectedFreelancerType.includes(item.slug)
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
                          selectedEnglishLevel.includes(item.slug) ||
                          selectedProjectType == item.slug ||
                          selectedIndustrialExperience.includes(item.slug) ||
                          selectedProjectDuration.includes(item.slug) ||
                          selectedSkills.includes(item.slug) ||
                          selectedExperience.includes(item.slug) ||
                          selectedLoaction.includes(item.slug) ||
                          selectedCategory.includes(item.slug) ||
                          selectedLanguage.includes(item.slug) ||
                          selectedFreelancerType.includes(item.slug)
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

export default JobList;
