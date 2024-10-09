import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Switch,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Style';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import RBSheet from 'react-native-raw-bottom-sheet';
import DocumentPicker from 'react-native-document-picker';
import FormInput from '../components/FormInput';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import Notification from '../components/Notification';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormButton from '../components/FormButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {updateJobTab} from '../redux/GlobalStateSlice';
import {decode} from 'html-entities';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const PostJob = ({jobItem, reload}) => {
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const settings = useSelector(state => state.setting.settings);
  const categoryTaxonomy = useSelector(state => state.global.categoryTaxonomy);
  const serviceCategoryTaxonomy = useSelector(
    state => state.global.serviceCategoryTaxonomy,
  );
  const freelancerTypeTaxonomy = useSelector(
    state => state.global.freelancerTypeTaxonomy,
  );
  const durationTaxonomy = useSelector(state => state.global.durationTaxonomy);
  const projectLevelTaxonomy = useSelector(
    state => state.global.projectLevelTaxonomy,
  );
  const industrialExperienceTaxonomy = useSelector(
    state => state.global.industrialExperienceTaxonomy,
  );
  const LocationTypeTaxonomy = useSelector(
    state => state.global.LocationTypeTaxonomy,
  );
  const skillTaxonomy = useSelector(state => state.global.skillTaxonomy);
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const RBSheetCalender = useRef();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [searchedDate, setSearchedDate] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [mileStoneSwitchvisible, setMileStoneSwitchvisible] = useState(false);
  const [attachmentSwitchvisible, setAttachmentSwitchvisible] = useState(false);
  const [featuredSwitchvisible, setFeaturedSwitchvisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');
  const [calendarType, setCalendarType] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [projectLevel, setProjectLevel] = useState(false);
  const [projectLevelValue, setProjectLevelValue] = useState('');
  const [projectLevelItems, setProjectLevelItems] = useState([]);

  const [jobDuration, setJobDuration] = useState(false);
  const [jobDurationValue, setJobDurationValue] = useState('');
  const [jobDurationItems, setJobDurationItems] = useState([]);

  const [freelancertype, setFreelancertype] = useState(false);
  const [freelancertypeValue, setFreelancertypeValue] = useState('');
  const [freelancertypeValueArray, setFreelancertypeValueArray] = useState([]);
  const [freelancertypeItems, setFreelancertypeItems] = useState([]);

  const [englishLevel, setEnglishLevel] = useState(false);
  const [englishLevelValue, setEnglishLevelValue] = useState('');
  const [englishLevelItems, setEnglishLevelItems] = useState([]);

  const [locationType, setLocationType] = useState(false);
  const [locationTypeValue, setLocationTypeValue] = useState('');
  const [locationTypeItems, setLocationTypeItems] = useState([]);

  const [experience, setExperience] = useState(false);
  const [experienceValue, setExperienceValue] = useState('');
  const [experienceValueArray, setExperienceValueArray] = useState([]);
  const [experienceItems, setExperienceItems] = useState([]);

  const [jobType, setJobType] = useState(false);
  const [jobTypeValue, setJobTypeValue] = useState('');
  const [jobTypeItems, setJobTypeItems] = useState([]);

  const [jobCategories, setJobCategories] = useState(false);
  const [jobCategoriesValue, setJobCategoriesValue] = useState([]);
  const [jobCategoriesItems, setJobCategoriesItems] = useState([]);

  const [languages, setLanguages] = useState(false);
  const [languagesValue, setLanguagesValue] = useState([]);
  const [languagesItems, setLanguagesItems] = useState([]);

  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [locationItems, setLocationItems] = useState([]);

  const [skills, setSkills] = useState(false);
  const [skillsValue, setSkillsValue] = useState([]);
  const [skillsItems, setSkillsItems] = useState([]);

  const toggleMileStoneSwitch = () => {
    setMileStoneSwitchvisible(
      mileStoneSwitchvisible => !mileStoneSwitchvisible,
    );
  };
  const toggleAttacmentSwitch = () => {
    setAttachmentSwitchvisible(
      attachmentSwitchvisible => !attachmentSwitchvisible,
    );
  };
  const toggleFeaturedSwitch = () => {
    setFeaturedSwitchvisible(featuredSwitchvisible => !featuredSwitchvisible);
  };

  useEffect(() => {
    languagesItems.length = 0;
    for (var i = 0; i < languageTaxonomy.length; i++) {
      languagesItems.push({
        label: languageTaxonomy[i].name,
        value: languageTaxonomy[i].id,
        slug: languageTaxonomy[i].slug,
      });
    }

    englishLevelItems.length = 0;
    for (var i = 0; i < englishLevelTaxonomy.length; i++) {
      englishLevelItems.push({
        label: englishLevelTaxonomy[i].name,
        value: englishLevelTaxonomy[i].slug,
      });
    }

    jobCategoriesItems.length = 0;
    for (var i = 0; i < categoryTaxonomy.length; i++) {
      jobCategoriesItems.push({
        label: decode(categoryTaxonomy[i].name),
        value: categoryTaxonomy[i].id,
        slug: categoryTaxonomy[i].slug,
      });
    }

    freelancertypeItems.length = 0;
    for (var i = 0; i < freelancerTypeTaxonomy.length; i++) {
      freelancertypeItems.push({
        label: decode(freelancerTypeTaxonomy[i].name),
        value: freelancerTypeTaxonomy[i].slug,
        id: freelancerTypeTaxonomy[i].id,
      });
    }

    jobDurationItems.length = 0;
    for (var i = 0; i < durationTaxonomy.length; i++) {
      jobDurationItems.push({
        label: durationTaxonomy[i].name,
        value: durationTaxonomy[i].slug,
      });
    }

    experienceItems.length = 0;
    for (var i = 0; i < industrialExperienceTaxonomy.length; i++) {
      experienceItems.push({
        label: industrialExperienceTaxonomy[i].name,
        value: industrialExperienceTaxonomy[i].id,
      });
    }

    projectLevelItems.length = 0;
    for (var i = 0; i < projectLevelTaxonomy.length; i++) {
      projectLevelItems.push({
        label: projectLevelTaxonomy[i].name,
        value: projectLevelTaxonomy[i].slug,
        id: projectLevelTaxonomy[i].id,
      });
    }

    locationTypeItems.length = 0;
    for (const [key, value] of Object.entries(
      settings.project_settings.get_job_location,
    )) {
      locationTypeItems.push({
        label: value,
        value: key,
      });
    }

    jobTypeItems.length = 0;
    for (const [key, value] of Object.entries(
      settings.project_settings.get_job_type,
    )) {
      jobTypeItems.push({
        label: value,
        value: key,
      });
    }
    skillsItems.length = 0;
    for (var i = 0; i < skillTaxonomy.length; i++) {
      skillsItems.push({
        label: decode(skillTaxonomy[i].name),
        value: skillTaxonomy[i].id,
        slug: skillTaxonomy[i].slug,
      });
    }
    locationItems.length = 0;
    for (var i = 0; i < locationTaxonomy.length; i++) {
      locationItems.push({
        label: locationTaxonomy[i].name,
        value: locationTaxonomy[i].slug,
      });
    }
    if (jobItem != null) {
      setName(jobItem.title);
      setProjectLevelValue(jobItem.project_level);
      setJobDurationValue(jobItem.project_duration);
      if (settings.project_settings.multiselect_freelancertype == 'enable') {
        setFreelancertypeValueArray(jobItem.freelancer_level);
      } else {
        setFreelancertypeValue(jobItem.freelancer_level[0]);
      }
      setEnglishLevelValue(jobItem.english_level);
      setLocationTypeValue(jobItem.job_location_type);
      if (
        settings.project_settings.job_experience_option.enable
          .multiselect_experience == 'multiselect'
      ) {
        setExperienceValueArray(jobItem.experience);
      } else {
        setExperienceValue(jobItem.experience[0]);
      }
      setExpiryDate(jobItem.expiry_date);
      setDeadlineDate(jobItem.deadline);
      setJobTypeValue(jobItem.project_type.gadget);
      if (jobItem.project_type.gadget == 'fixed') {
        setMaxPrice(jobItem.project_type.fixed.max_price);
        setMinPrice(jobItem.project_type.fixed.project_cost);
      } else {
        setMaxPrice(jobItem.project_type.hourly.max_price);
        setMinPrice(jobItem.project_type.hourly.hourly_rate);
        setEstimatedHours(jobItem.project_type.hourly.estimated_hours);
      }
      setMileStoneSwitchvisible(jobItem.is_milestone == 'on' ? true : false);

      setJobCategoriesValue(jobItem.project_cat);
      let lang = [];
      for (var i = 0; i < jobItem.languages_array.length; i++) {
        lang.push(jobItem.languages_array[i].id);
      }
      setLanguagesValue(lang);
      setDetail(jobItem.description);
      let skill = [];
      if (jobItem.skills != null) {
        for (var i = 0; i < jobItem.skills.length; i++) {
          skill.push(jobItem.skills[i].term_id);
        }
      }
      setSkillsValue(skill);
      setDocuments(jobItem.document_array);
      setAttachmentSwitchvisible(
        jobItem.is_attachment_show == 'on' ? true : false,
      );
      setFeaturedSwitchvisible(jobItem.is_featured == 'on' ? true : false);
      setLocationValue(jobItem.job_location.country[0].slug);
      setAddress(jobItem.job_location);
      setLongitude(jobItem.job_location);
      setLatitude(jobItem.job_location);
      setFaqs(jobItem.project_faq);
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
    const selectedAndroidDate =
      currentDate.getFullYear() +
      '-' +
      ('0' + (currentDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + currentDate.getDate()).slice(-2);
    setDate(currentDate);
    if (calendarType == 'expiry') {
      setExpiryDate(selectedAndroidDate);
    } else if (calendarType == 'deadline') {
      setDeadlineDate(selectedAndroidDate);
    }
  };

  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      for (var i = 0; i < res.length; i++) {
        documents.push(res[i]);
      }
      setRefreshFlatList(!refreshFlatList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const deleteImage = index => {
    documents.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };

  const addFAQs = () => {
    faqs.push({
      faq_question: faqQuestion,
      faq_answer: faqAnswer,
    });
    setFaqQuestion('');
    setFaqAnswer('');
    setRefreshFlatList(!refreshFlatList);
  };
  const deleteFAQs = index => {
    faqs.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };
  const addDateInField = () => {
    if (calendarType == 'expiry') {
      setExpiryDate(searchedDate);
    } else if (calendarType == 'deadline') {
      setDeadlineDate(searchedDate);
    }
    RBSheetCalender.current.close();
  };

  const postJob = async () => {
    setLoading(true);
    let prevDocs = [];
    let newdocs = [];
    documents.forEach((item, i) => {
      if (item.hasOwnProperty('attachment_id')) {
        prevDocs.push(item);
      } else {
        newdocs.push(item);
      }
    });
    const formData = new FormData();
    if (jobItem != null) {
      formData.append('id', jobItem.ID);
      formData.append('submit_type', 'update');
      formData.append('old_attachments_project', JSON.stringify(prevDocs));
    } else {
      formData.append('submit_type', 'add');
      formData.append('id', '');
    }

    formData.append('user_id', userInfo.id);
    formData.append('title', name);
    formData.append('project_level', projectLevelValue);
    formData.append('job_option', locationTypeValue);
    formData.append(
      'experiences',
      settings.project_settings.job_experience_option.enable
        .multiselect_experience == 'multiselect'
        ? JSON.stringify(experienceValueArray)
        : experienceValue,
    );
    formData.append('project_duration', jobDurationValue);
    formData.append(
      'freelancer_level',
      settings.project_settings.multiselect_freelancertype == 'enable'
        ? JSON.stringify(freelancertypeValueArray)
        : freelancertypeValue,
    );
    formData.append('english_level', englishLevelValue);
    formData.append('project_type', jobTypeValue);
    formData.append('hourly_rate', minPrice);
    formData.append('estimated_hours', estimatedHours);
    formData.append('max_price', maxPrice);
    formData.append('expiry_date', expiryDate);
    formData.append('deadline', deadlineDate);
    formData.append('project_cost', minPrice);
    formData.append('description', detail);
    formData.append('country', locationValue);
    formData.append('address', address);
    formData.append('is_featured', featuredSwitchvisible ? 'on' : 'off');
    formData.append('show_attachments', attachmentSwitchvisible ? 'on' : 'off');
    formData.append('skills', JSON.stringify(skillsValue));
    formData.append('languages', JSON.stringify(languagesValue));
    formData.append('categories', JSON.stringify(jobCategoriesValue));
    formData.append('is_milestone', mileStoneSwitchvisible ? 'on' : 'off');
    formData.append('faq', JSON.stringify(faqs));
    if (newdocs != null) {
      newdocs.forEach((item, i) => {
        formData.append('project_documents' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
      formData.append('size', newdocs.length);
    }
    fetch(Constant.BaseUrl + 'listing/update_job', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token.authToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(function (response) {
        setLoading(false);
        if (response.type == 'success') {
          setName('');
          setProjectLevelValue(null);
          setJobDurationValue(null);
          setFreelancertypeValue(null);
          setEnglishLevelValue(null);
          setLocationTypeValue(null);
          setExperienceValue(null);
          setExpiryDate('');
          setDeadlineDate('');
          setJobTypeValue(null);
          setMaxPrice('');
          setMinPrice('');
          setMileStoneSwitchvisible(false);
          setJobCategoriesValue(null);
          setLanguagesValue(null);
          setDetail('');
          setSkillsValue(null);
          setDocuments(null);
          setAttachmentSwitchvisible(false);
          setFeaturedSwitchvisible(false);
          setLocationTypeValue(null);
          setAddress('');
          setLongitude('');
          setLatitude('');
          setFaqs([]);
          dispatch(updateJobTab(1));
          reload(response.message);
        } else if (response.type == 'error') {
          setShowAlert(true);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('error', error);
      });
  };

  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Notification
          show={showAlert}
          hide={hideAlert}
          type={type}
          title={title}
          desc={desc}
        />
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.postJobProject}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={name}
            onChangeText={text => setName(text)}
            placeholderText={'Add project title'}
            keyboardType="email-address"
            autoCorrect={false}
          />
          {settings.project_settings.remove_project_level == 'no' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobProjectLevel}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={projectLevel}
                value={projectLevelValue}
                placeholder={Translation.postJobSelectProjectLevel}
                searchPlaceholder={Translation.globalSearchHere}
                items={projectLevelItems}
                searchable={true}
                setOpen={setProjectLevel}
                setValue={setProjectLevelValue}
                setItems={setProjectLevelItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={false}
                mode="BADGE"
                zIndex={1000000000}
                zIndexInverse={10}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
            </>
          )}
          {settings.project_settings.remove_project_duration == 'no' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobDuration}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={jobDuration}
                value={jobDurationValue}
                placeholder={Translation.postJobSelectJobDuration}
                searchPlaceholder={Translation.globalSearchHere}
                items={jobDurationItems}
                searchable={true}
                setOpen={setJobDuration}
                setValue={setJobDurationValue}
                setItems={setJobDurationItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={false}
                mode="BADGE"
                zIndex={100000000}
                zIndexInverse={100}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
            </>
          )}
          {settings.project_settings.remove_freelancer_type == 'no' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobFreelancerType}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={freelancertype}
                value={
                  settings.project_settings.multiselect_freelancertype ==
                  'enable'
                    ? freelancertypeValueArray
                    : freelancertypeValue
                }
                placeholder={Translation.postJobSelectFreelancerType}
                searchPlaceholder={Translation.globalSearchHere}
                items={freelancertypeItems}
                searchable={true}
                setOpen={setFreelancertype}
                setValue={
                  settings.project_settings.multiselect_freelancertype ==
                  'enable'
                    ? setFreelancertypeValueArray
                    : setFreelancertypeValue
                }
                setItems={setFreelancertypeItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={
                  settings.project_settings.multiselect_freelancertype ==
                  'enable'
                    ? true
                    : false
                }
                mode="BADGE"
                zIndex={10000000}
                zIndexInverse={1000}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
            </>
          )}
          {settings.project_settings.remove_english_level == 'no' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobEnglishLevel}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={englishLevel}
                value={englishLevelValue}
                placeholder={Translation.postJobSelectEnglishLevel}
                searchPlaceholder={Translation.globalSearchHere}
                items={englishLevelItems}
                searchable={true}
                setOpen={setEnglishLevel}
                setValue={setEnglishLevelValue}
                setItems={setEnglishLevelItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={false}
                mode="BADGE"
                zIndex={1000000}
                zIndexInverse={100000}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
            </>
          )}
          {/* {settings.project_settings.remove_location_type == "no" &&
         <> */}
          <Text style={styles.inputHeading}>
            {Translation.postJobLocationType}
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
              borderColor: Constant.borderColor,
              backgroundColor: Constant.darkGrayColor,
            }}
            open={locationType}
            value={locationTypeValue}
            placeholder={Translation.postJobProjectlocationType}
            searchPlaceholder={Translation.globalSearchHere}
            items={locationTypeItems}
            searchable={true}
            setOpen={setLocationType}
            setValue={setLocationTypeValue}
            setItems={setLocationTypeItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={100000}
            zIndexInverse={100000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          {/* </>} */}
          {settings.project_settings.job_experience_option.gadget ==
            'enable' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobExperience}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={experience}
                value={
                  settings.project_settings.job_experience_option.enable
                    .multiselect_experience == 'multiselect'
                    ? experienceValueArray
                    : experienceValue
                }
                placeholder={Translation.postJobYearsExperiencePreferred}
                searchPlaceholder={Translation.globalSearchHere}
                items={experienceItems}
                searchable={true}
                setOpen={setExperience}
                setValue={
                  settings.project_settings.job_experience_option.enable
                    .multiselect_experience == 'multiselect'
                    ? setExperienceValueArray
                    : setExperienceValue
                }
                setItems={setExperienceItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={
                  settings.project_settings.job_experience_option.enable
                    .multiselect_experience == 'multiselect'
                    ? true
                    : false
                }
                mode="BADGE"
                zIndex={10000}
                zIndexInverse={1000000}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
              <Text style={styles.inputHeading}>
                {Translation.postJobExpiredDate}
              </Text>
              <FormInput
                labelValue={expiryDate}
                // onChangeText={text => setExpiryDate(text)}
                placeholderText={Translation.postJobProjectExpiryDate}
                keyboardType="email-address"
                autoCorrect={false}
                editable={false}
                iconType={'calendar'}
                action={true}
                iconColor={Constant.iconColor}
                actionIcon={() => {
                  setCalendarType('expiry');
                  if (Platform.OS == 'ios') {
                    RBSheetCalender.current.open();
                  } else {
                    setShowDatePicker(true);
                  }
                }}
              />
            </>
          )}

          <Text style={styles.inputHeading}>
            {Translation.postJobDeadlineDate}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <FormInput
            labelValue={deadlineDate}
            // onChangeText={text => setDeadlineDate(text)}
            placeholderText={Translation.postJobProjectDeadlineDate}
            keyboardType="email-address"
            autoCorrect={false}
            editable={false}
            iconType={'calendar'}
            action={true}
            iconColor={Constant.iconColor}
            actionIcon={() => {
              setCalendarType('deadline');
              if (Platform.OS == 'ios') {
                RBSheetCalender.current.open();
              } else {
                setShowDatePicker(true);
              }
            }}
          />
          <Text style={styles.inputHeading}>
            {Translation.postJobType}
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
              borderColor: Constant.borderColor,
              backgroundColor: Constant.darkGrayColor,
            }}
            open={jobType}
            value={jobTypeValue}
            placeholder={Translation.postJobSelectJobType}
            searchPlaceholder={Translation.globalSearchHere}
            items={jobTypeItems}
            searchable={true}
            setOpen={setJobType}
            setValue={setJobTypeValue}
            setItems={setJobTypeItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={1000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postJobMinimumPrice}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={minPrice}
            onChangeText={text => setMinPrice(text)}
            placeholderText={Translation.postJobMinimumPricePlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text style={styles.inputHeading}>
            {Translation.postJobMaximumPrice}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={maxPrice}
            onChangeText={text => setMaxPrice(text)}
            placeholderText={'Add maximum price'}
            keyboardType="email-address"
            autoCorrect={false}
          />
          {jobTypeValue == 'hourly' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobEstimatedHours}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={estimatedHours}
                onChangeText={text => setEstimatedHours(text)}
                placeholderText={Translation.postJobEstimatedHours}
                keyboardType="email-address"
                autoCorrect={false}
              />
            </>
          )}

          {jobTypeValue != 'hourly' && (
            <View
              style={[
                styles.rowView,
                {justifyContent: 'space-between', marginVertical: 10},
              ]}>
              <Text style={[styles.inputHeading, {width: '80%'}]}>
                {Translation.postJobRequireMilestonePayments}
              </Text>
              <Switch
                style={{
                  transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                }}
                trackColor={{false: '#DDDDDD', true: '#22C55E'}}
                thumbColor={Constant.whiteColor}
                ios_backgroundColor={'#DDDDDD'}
                onValueChange={toggleMileStoneSwitch}
                value={mileStoneSwitchvisible}
              />
            </View>
          )}
          <Text style={styles.inputHeading}>
            {Translation.postJobJobCategory}
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
              borderColor: Constant.borderColor,
              backgroundColor: Constant.darkGrayColor,
            }}
            open={jobCategories}
            value={jobCategoriesValue}
            placeholder={Translation.postJobSelectJobCategory}
            searchPlaceholder={Translation.globalSearchHere}
            items={jobCategoriesItems}
            searchable={true}
            setOpen={setJobCategories}
            setValue={setJobCategoriesValue}
            setItems={setJobCategoriesItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true}
            mode="BADGE"
            zIndex={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />

          {settings.project_settings.remove_languages == 'no' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.postJobLanguages}
                {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
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
                  borderColor: Constant.borderColor,
                  backgroundColor: Constant.darkGrayColor,
                }}
                open={languages}
                value={languagesValue}
                placeholder={Translation.postJobSelectLanguage}
                searchPlaceholder={Translation.globalSearchHere}
                items={languagesItems}
                searchable={true}
                setOpen={setLanguages}
                setValue={setLanguagesValue}
                setItems={setLanguagesItems}
                listMode="MODAL"
                theme="LIGHT"
                multiple={true}
                mode="BADGE"
                zIndex={10}
                disableBorderRadius={true}
                badgeDotColors={['#e76f51']}
              />
            </>
          )}
          <Text style={styles.inputHeading}>
            {Translation.postJobJobDetails}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={Translation.postJobDetails}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>

          <Text style={styles.inputHeading}>
            {Translation.postJobSkillsRequired}
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
              borderColor: Constant.borderColor,
              backgroundColor: Constant.darkGrayColor,
            }}
            open={skills}
            value={skillsValue}
            placeholder={Translation.postJobSelectSkill}
            searchPlaceholder={Translation.globalSearchHere}
            items={skillsItems}
            searchable={true}
            setOpen={setSkills}
            setValue={setSkillsValue}
            setItems={setSkillsItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true}
            mode="BADGE"
            zIndex={1}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />

          <Text style={styles.inputHeading}>
            {Translation.postJobUploadRelevantProjectFiles}
          </Text>

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

          <FlatList
            showsVerticalScrollIndicator={false}
            data={documents}
            style={{marginBottom: 10}}
            extraData={refreshFlatList}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.JobDetailAttachmentItemView,
                  {backgroundColor: '#FCFCFC'},
                ]}>
                <Text style={styles.JobDetailAttachmentItemText}>
                  {item.name}
                </Text>
                <TouchableOpacity onPress={() => deleteImage(index)}>
                  <Feather
                    name={'trash-2'}
                    color={Constant.primaryColor}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <View>
              <Text style={[styles.inputHeading, {marginBottom: 0}]}>
                {Translation.postJobAttachments}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontRegular,
                  color: '#484848',
                  marginBottom: 5,
                }}>
                ({Translation.postJobShowAttachmentsJob})
              </Text>
            </View>
            <Switch
              style={{
                transform: [{scaleX: 0.8}, {scaleY: 0.8}],
              }}
              trackColor={{false: '#DDDDDD', true: '#22C55E'}}
              thumbColor={Constant.whiteColor}
              ios_backgroundColor={'#DDDDDD'}
              onValueChange={toggleAttacmentSwitch}
              value={attachmentSwitchvisible}
            />
          </View>

          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <Text style={[styles.inputHeading, {width: '80%'}]}>
              {Translation.postJobFeaturedJob}
            </Text>
            <Switch
              style={{
                transform: [{scaleX: 0.8}, {scaleY: 0.8}],
              }}
              trackColor={{false: '#DDDDDD', true: '#22C55E'}}
              thumbColor={Constant.whiteColor}
              ios_backgroundColor={'#DDDDDD'}
              onValueChange={toggleFeaturedSwitch}
              value={featuredSwitchvisible}
            />
          </View>
          <Text style={styles.inputHeading}>
            {Translation.postJobLocation}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
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
            open={openLocation}
            value={locationValue}
            placeholder={Translation.postJobSelectLocation}
            searchPlaceholder={Translation.globalSearchHere}
            items={locationItems}
            searchable={true}
            setOpen={setOpenLocation}
            setValue={setLocationValue}
            setItems={setLocationItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndexInverse={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postJobYourAddress}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <FormInput
            labelValue={address}
            onChangeText={text => setAddress(text)}
            placeholderText={Translation.postJobYourAddressPlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'crosshair'}
            iconColor={Constant.lightGrayColor}
          />
          <FormInput
            labelValue={longitude}
            onChangeText={text => setLongitude(text)}
            placeholderText={Translation.postJobLongitude}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'alert-circle'}
            iconColor={Constant.lightGrayColor}
          />
          <FormInput
            labelValue={latitude}
            onChangeText={text => setLatitude(text)}
            placeholderText={Translation.postJobLatitude}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'alert-circle'}
            iconColor={Constant.lightGrayColor}
          />
          {settings.project_settings.job_faq_option == 'yes' && (
            <>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.postJobServiceFAQ}
                </Text>
                {showFAQ == false ? (
                  <TouchableOpacity onPress={() => setShowFAQ(!showFAQ)}>
                    <Feather
                      name={'plus'}
                      color={Constant.fontColor}
                      size={22}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setShowFAQ(!showFAQ)}>
                    <Feather
                      name={'minus'}
                      color={Constant.fontColor}
                      size={22}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {showFAQ == true && (
                <>
                  <View style={styles.subCardView}>
                    <Text style={styles.inputHeading}>
                      {Translation.postJobQuestion}
                      {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                    </Text>
                    <FormInput
                      labelValue={faqQuestion}
                      onChangeText={text => setFaqQuestion(text)}
                      placeholderText={Translation.postJobQuestionPlacholder}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.postJobAnswer}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <View style={styles.multilineTextInputView}>
                      <TextInput
                        placeholder={Translation.postJobAnswerPlaceholder}
                        multiline
                        value={faqAnswer}
                        onChangeText={text => setFaqAnswer(text)}
                        placeholderTextColor={Constant.lightGrayColor}
                        style={styles.multilineTextInput}
                      />
                    </View>
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() => addFAQs()}
                        style={[
                          styles.smallButton,
                          {backgroundColor: Constant.blueColor},
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postJobAddToList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={faqs}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.JobDetailAttachmentItemView,
                      {backgroundColor: '#FCFCFC'},
                    ]}>
                    <Text style={styles.JobDetailAttachmentItemText}>
                      {item.faq_question}
                    </Text>
                    {/* <Feather
                          style={{marginRight: 15}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        /> */}
                    <TouchableOpacity onPress={() => deleteFAQs(index)}>
                      <Feather
                        name={'trash-2'}
                        color={Constant.primaryColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}
          <Text style={styles.PostServiceSaveDesc}>
            {Translation.globalSaveUpdateDesc}{' '}
            <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
              "{Translation.globalSaveUpdate}"
            </Text>{' '}
            {Translation.globalSaveUpdateDescEnd}
          </Text>
          <FormButton
            onPress={() => postJob()}
            buttonTitle={Translation.globalSaveUpdate}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
      <RBSheet
        ref={RBSheetCalender}
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
              {Translation.postJobPickDate}
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
              addDateInField();
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

export default PostJob;
