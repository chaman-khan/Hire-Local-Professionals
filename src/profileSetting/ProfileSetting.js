import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import FormInput from '../components/FormInput';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Translation from '../constants/Translation';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {BallIndicator} from 'react-native-indicators';
import DateTimePicker from '@react-native-community/datetimepicker';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';
import {decode} from 'html-entities';
import axios from 'axios';
import {
  updateProfileImage,
  updateProfileBannerImage,
  updateProfileName,
  updateProfileInfo,
} from '../redux/AuthSlice';

const ProfileSetting = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const profileInfo = useSelector(state => state.value.profileInfo);
  const token = useSelector(state => state.value.token);
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const industrialExpTaxonomy = useSelector(
    state => state.global.industrialExpCategoriesTaxonomy,
  );
  const specializationTaxonomy = useSelector(
    state => state.global.specializationTaxonomy,
  );
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const departmentsTaxonomy = useSelector(
    state => state.global.departmentsTaxonomy,
  );
  const NoEmployeeTaxonomy = useSelector(
    state => state.global.NoEmployeeTaxonomy,
  );
  const skillsTaxonomy = useSelector(state => state.global.skillTaxonomy);
  const freelancerTypeTaxonomy = useSelector(
    state => state.global.freelancerTypeTaxonomy,
  );
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const RBSheetCalender = useRef();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tagline, setTagline] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [detail, setDetail] = useState('');
  const [photo, setPhoto] = useState('');
  const [resume, setResume] = useState(null);
  const [bannerPhoto, setBannerPhoto] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [skills, setSkills] = useState([]);
  const [customSkill, setcustomSkill] = useState(false);
  const [skillCustom, setSkillCustom] = useState('');
  const [skillVal, setSkillVal] = useState('');
  const [skillsForm, setSkillsForm] = useState(false);
  const [skillsIndex, setSkillsIndex] = useState(null);
  const [editSkills, setEditSkills] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [SelectedNoEmolyee, setSelectedNoEmolyee] = useState(null);
  const [brouchers, setBrouchers] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [expTitle, setExpTitle] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expDetail, setExpDetail] = useState('');
  const [experienceForm, setExperienceForm] = useState(false);
  const [experienceIndex, setExperienceIndex] = useState(null);
  const [editExperience, setEditExperience] = useState(false);
  const [educations, setEducations] = useState([]);
  const [eduTitle, setEduTitle] = useState('');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');
  const [eduInstitute, setEduInstitute] = useState('');
  const [eduDetail, setEduDetail] = useState('');
  const [educationForm, setEducationForm] = useState(false);
  const [educationIndex, setEducationIndex] = useState(null);
  const [editEducation, setEditEducation] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectURL, setProjectURL] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  const [projectForm, setProjectForm] = useState(false);
  const [projectIndex, setProjectIndex] = useState(null);
  const [editProject, setEditProject] = useState(false);
  const [awards, setAwards] = useState([]);
  const [date, setDate] = useState(new Date());
  const [awardDate, setAwardDate] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [awardImage, setAwardImage] = useState(null);
  const [awardTitle, setAwardTitle] = useState('');
  const [searchedDate, setSearchedDate] = useState('');
  const [searchedShortDate, setSearchedShortDate] = useState('');
  const [awardForm, setAwardForm] = useState(false);
  const [awardIndex, setAwardIndex] = useState(null);
  const [editAward, setEditAward] = useState(false);
  const [videosURL, setVideosURL] = useState([]);
  const [URL, setURL] = useState('');
  const [specialization, setSpecialization] = useState([]);
  const [specializationForm, setSpecializationForm] = useState(false);
  const [specializationIndex, setSpecializationIndex] = useState(null);
  const [editSpecialization, setEditSpecialization] = useState(false);
  const [specializationPercentage, setSpecializationPercentage] = useState('');
  const [industrialExp, setIndustrialExp] = useState([]);
  const [industrialForm, setIndustrialForm] = useState(false);
  const [industrialIndex, setIndustrialIndex] = useState(null);
  const [editIndustrial, setEditIndustrial] = useState(false);
  const [industrialPercentage, setIndustrialPercentage] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [faqsForm, setFaqsForm] = useState(false);
  const [faqIndex, setFaqIndex] = useState(null);
  const [editFaq, setEditFaq] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [name, setName] = useState('');
  const [selectedSection, setSelectedSection] = useState(0);
  const [department, setDepartment] = useState('');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [loader, setLoader] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const [openGender, setOpenGender] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([]);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [languageValue, setLanguageValue] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);

  const [openEnglishLevel, setOpenEnglishLevel] = useState(false);
  const [englishLevelValue, setEnglishLevelValue] = useState(null);
  const [englishLevelItems, setEnglishLevelItems] = useState([]);

  const [openFreelancerType, setOpenFreelancerType] = useState(false);
  const [freelancerTypeValue, setFreelancerTypeValue] = useState(null);
  const [freelancerTypeItems, setFreelancerTypeItems] = useState([]);

  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState([]);
  const [locationItems, setLocationItems] = useState([]);

  const [openIndustrialExp, setOpenIndustrialExp] = useState(false);
  const [industrialExpValue, setIndustrialExpValue] = useState(null);
  const [industrialExpItems, setIndustrialExpItems] = useState([]);

  const [openSpecialization, setOpenSpecialization] = useState(false);
  const [specializationValue, setSpecializationValue] = useState(null);
  const [specializationItems, setSpecializationItems] = useState([]);

  const [openSkills, setOpenSkills] = useState(false);
  const [skillsValue, setSkillsValue] = useState(null);
  const [skillsItems, setSkillsItems] = useState([]);

  const [tabs, setTabs] = useState([
    {name: Translation.profileSettingTabPersonalDetailSkill},
    {name: Translation.profileSettingTabExpEdu},
    {
      name:
        settings.freelancers_settings.freelancer_social_profile_settings
          .gadget == 'enable'
          ? Translation.profileSettingTabSocialProfiles
          : '',
    },
    {name: Translation.profileSettingTabGalleryPhoto},
    {name: Translation.profileSettingTabProjects},
    {name: Translation.profileSettingTabAwardsCertifications},
    {name: Translation.profileSettingTabProfileVideos},
    {name: Translation.profileSettingTabSpecilization},
    {name: Translation.profileSettingTabIndustrialExperience},
    {name: Translation.profileSettingTabProfileFAQ},
  ]);
  const [employerTabs, setEmployerTabs] = useState([
    {name: Translation.profileSettingTabPersonalDetail},
    {name: Translation.profileSettingTabBrouchers},
    {
      name:
        settings.employers_settings.employer_social_profile_settings.gadget ==
        'enable'
          ? Translation.profileSettingTabSocialProfiles
          : '',
    },
  ]);

  useEffect(() => {
    languageItems.length = 0;
    locationItems.length = 0;
    englishLevelItems.length = 0;
    freelancerTypeItems.length = 0;
    industrialExpItems.length = 0;
    specializationItems.length = 0;
    genderItems.length = 0;
    skillsItems.length = 0;

    Object.entries(settings.gender_settings).map(([key, value]) =>
      genderItems.push({
        label: value,
        value: key,
      }),
    );
    for (var i = 0; i < languageTaxonomy.length; i++) {
      languageItems.push({
        label: languageTaxonomy[i].name,
        value: languageTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < locationTaxonomy.length; i++) {
      locationItems.push({
        label: locationTaxonomy[i].name,
        value: locationTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < englishLevelTaxonomy.length; i++) {
      englishLevelItems.push({
        label: englishLevelTaxonomy[i].name,
        value: englishLevelTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < freelancerTypeTaxonomy.length; i++) {
      freelancerTypeItems.push({
        label: freelancerTypeTaxonomy[i].name,
        value: freelancerTypeTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < industrialExpTaxonomy.length; i++) {
      industrialExpItems.push({
        label: decode(industrialExpTaxonomy[i].name),
        value: industrialExpTaxonomy[i].id,
      });
    }
    for (var i = 0; i < specializationTaxonomy.length; i++) {
      specializationItems.push({
        label: decode(specializationTaxonomy[i].name),
        value: specializationTaxonomy[i].id,
      });
    }
    for (var i = 0; i < skillsTaxonomy.length; i++) {
      skillsItems.push({
        label: decode(skillsTaxonomy[i].name),
        value: skillsTaxonomy[i].id,
      });
    }
    if (isFocused) {
      setSelectedSection(0);
      setLoader(true);
      if (profileInfo.user_type == 'freelancer') {
        getProfileData();
      } else {
        getProfileData();
        getEmployeeProfileData();
      }
    }
  }, [isFocused]);
  useEffect(() => {
    if (profileInfo.user_type == 'freelancer') {
      getProfileData();
    } else {
      getProfileData();
      getEmployeeProfileData();
    }
  }, [selectedSection]);

  const getProfileData = async () => {
    return fetch(Constant.BaseUrl + 'profile/setting?id=' + userInfo.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setGenderValue(responseJson.gender);
        setFirstName(responseJson.first_name);
        setLastName(responseJson.last_name);
        setDisplayName(responseJson.display_name);
        setHourlyRate(responseJson.per_hour_rate);
        setMaxPrice(responseJson.max_price);
        setPhoneNumber(responseJson.phone_number);
        setTagline(decode(responseJson.tag_line));
        setResume(responseJson.resume_doc);
        setDetail(responseJson.content);
        setLanguageValue(responseJson.languages);
        setEnglishLevelValue(responseJson.english_level);
        setFreelancerTypeValue(responseJson.freelancer_types.toString());
        setPhoto(responseJson.profile_photo);
        setBannerPhoto(responseJson.banner_image_info);
        setLocationValue(responseJson.location.slug);
        setAddress(responseJson.address);
        setLongitude(responseJson.longitude);
        setLatitude(responseJson.latitude);
        setSkills(responseJson.skills);
        setExperiences(responseJson.experience);
        setEducations(responseJson.education);
        setGallery(
          responseJson.freelancer_gallery == ''
            ? []
            : responseJson.freelancer_gallery,
        );
        setProjects(responseJson.projects);
        setAwards(responseJson.awards);
        setVideosURL(responseJson.videos);
        setSpecialization(responseJson.specializations);
        setIndustrialExp(responseJson.industrial_experiences);
        setFaqs(responseJson.faqs);
        setSocialMedia(responseJson.social_media);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const getEmployeeProfileData = async () => {
    return fetch(
      Constant.BaseUrl + 'profile/get_employer_profle?user_id=' + userInfo.id,
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
        setJobTitle(responseJson.job_title);
        setBrouchers(responseJson.brochures);
        setSelectedDepartment(parseInt(responseJson.department));
        setSelectedNoEmolyee(parseInt(responseJson.employees));
        setCompanyName(responseJson.company_name);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  const addSkillsinList = () => {
    var skillName = '';
    for (var i = 0; i < skillsTaxonomy.length; i++) {
      if (skillsValue == skillsTaxonomy[i].id) {
        skillName = skillsTaxonomy[i].name;
      }
    }
    if (skillsValue != null && skillVal != '' && parseInt(skillVal) <= 100) {
      skills.push({
        id: skillsValue,
        name: skillName,
        val: skillVal,
      });
      setRefreshList(!refreshList);
      setSkillsValue(null);
      setSkillVal('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(skillVal) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const addCustomSkillsinList = () => {
    if (skillCustom != '' && skillVal != '' && parseInt(skillVal) <= 100) {
      skills.push({
        name: skillCustom,
        custom: 'yes',
        val: skillVal,
      });
      setRefreshList(!refreshList);
      setSkillCustom('');
      setSkillVal('');
      setcustomSkill(false);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(skillVal) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const editClickSkills = (item, index) => {
    if (item.hasOwnProperty('custom')) {
      setSkillsIndex(index);
      setSkillsForm(true);
      setEditSkills(true);
      setcustomSkill(true);
      setSkillCustom(item.name);
      setSkillVal(item.val.toString());
    } else {
      setSkillsIndex(index);
      setSkillsForm(true);
      setEditSkills(true);
      setSkillsValue(item.id);
      setSkillVal(item.val.toString());
    }
  };
  const addEditSkillsinList = () => {
    if (skillsValue != null && skillVal != '' && parseInt(skillVal) <= 100) {
      var skillName = '';
      for (var i = 0; i < skillsTaxonomy.length; i++) {
        if (skillsValue == skillsTaxonomy[i].id) {
          skillName = skillsTaxonomy[i].name;
        }
      }
      skills[skillsIndex].id = skillsValue;
      skills[skillsIndex].name = skillName;
      skills[skillsIndex].val = skillVal;
      setRefreshList(!refreshList);
      setSkillsValue(null);
      setSkillVal('');
      setEditSkills(false);
      setSkillsIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(skillVal) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const addEditCustomSkillsinList = () => {
    if (skillCustom != '' && skillVal != '' && parseInt(skillVal) <= 100) {
      skills[skillsIndex].name = skillCustom;
      skills[skillsIndex].val = skillVal;
      setRefreshList(!refreshList);
      setSkillCustom('');
      setSkillVal('');
      setcustomSkill(false);
      setEditSkills(false);
      setSkillsIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(skillVal) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const cancelEditSkills = () => {
    setSkillsIndex(null);
    setEditSkills(false);
    setSkillsValue(null);
    setcustomSkill(false);
    setSkillVal('');
  };
  const deleteSkills = index => {
    skills.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const pickDocumentfromDevice = async () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      includeBase64: true,
    }).then(img => {
      setResume(img);
      setRefreshList(!refreshList);
    });
  };
  const saveUpdatePersonalDataFreelancer = () => {
    setLoading(true);
    let basics = [];
    let settings = [];
    let skillsArray = [];
    let customSkillData = [];
    let languageArray = [];
    let banner = {};
    let profilePhoto = {};
    for (var i = 0; i < skills.length; i++) {
      if (skills[i].hasOwnProperty('custom')) {
        customSkillData.push({
          skill: skills[i].name,
          value: skills[i].val,
        });
      } else {
        skillsArray.push({
          skill: skills[i].id,
          value: skills[i].val,
        });
      }
    }
    for (var i = 0; i < languageValue.length; i++) {
      for (var j = 0; j < languageTaxonomy.length; j++) {
        if (languageValue[i] == languageTaxonomy[j].slug) {
          languageArray.push(languageTaxonomy[j].id);
        }
      }
    }
    basics.push({
      user_id: userInfo.id,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      user_type: profileInfo.user_type,
      longitude: longitude,
      latitude: latitude,
      per_hour_rate: hourlyRate,
      max_price: maxPrice,
      user_phone_number: phoneNumber,
      country: locationValue,
      // no_of_employees: EmployeeKnown[0],
      address: address,
      tag_line: tagline,
      content: detail,
      gender: genderValue,
      resume_base64:
        resume != ''
          ? resume.hasOwnProperty('document_name')
            ? {}
            : {
                name:
                  Platform.OS == 'ios'
                    ? resume.filename
                    : resume.path.substring(resume.path.lastIndexOf('/') + 1),
                type: resume.mime,
                base64_string: resume.data,
              }
          : {},
    });
    if (bannerPhoto.hasOwnProperty('banner_image_url')) {
      banner = {};
    } else {
      banner = {
        name:
          Platform.OS == 'ios'
            ? bannerPhoto.filename
            : bannerPhoto.path.substring(bannerPhoto.path.lastIndexOf('/') + 1),
        type: bannerPhoto.mime,
        base64_string: bannerPhoto.data,
      };
    }
    if (photo.hasOwnProperty('attachment_id')) {
      profilePhoto = {};
    } else {
      if (photo == []) {
        profilePhoto = {};
      } else {
        profilePhoto = {
          name:
            Platform.OS == 'ios'
              ? photo.filename
              : photo.path.substring(photo.path.lastIndexOf('/') + 1),
          type: photo.mime,
          base64_string: photo.data,
        };
      }
    }

    settings.push({
      languages: languageArray,
      freelancer_type: freelancerTypeValue,
      skills: skillsArray,
      custom_skills: customSkillData,
      english_level: englishLevelValue,
    });

    axios
      .post(
        Constant.BaseUrl + 'profile/update_freelancer_profile',
        {
          user_id: userInfo.id,
          basics: basics[0],
          settings: settings[0],
          banner_base64: banner,
          profile_base64: profilePhoto,
        },
        {
          headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          dispatch(updateProfileImage(response.data.profile_img_url));
          dispatch(updateProfileBannerImage(response.data.banner_img_url));
          dispatch(updateProfileName(displayName));
          let data = JSON.parse(JSON.stringify(profileInfo));
          data._tag_line = tagline;
          dispatch(updateProfileInfo(data));

          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log('in catch', error);
        setLoading(false);
      });
  };
  const saveUpdatePersonalDataEmployer = () => {
    setLoading(true);
    let basics = [];
    let banner = {};
    let profilePhoto = {};
    if (bannerPhoto.hasOwnProperty('attachment_id')) {
      banner = {};
    } else {
      banner = {
        name:
          Platform.OS == 'ios'
            ? bannerPhoto.filename
            : bannerPhoto.path.substring(bannerPhoto.path.lastIndexOf('/') + 1),
        type: bannerPhoto.mime,
        base64_string: bannerPhoto.data,
      };
    }
    if (photo.hasOwnProperty('attachment_id')) {
      profilePhoto = {};
    } else {
      profilePhoto = {
        name:
          Platform.OS == 'ios'
            ? photo.filename
            : photo.path.substring(photo.path.lastIndexOf('/') + 1),
        type: photo.mime,
        base64_string: photo.data,
      };
    }
    basics.push({
      user_id: userInfo.id,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      longitude: longitude,
      latitude: latitude,
      user_phone_number: phoneNumber,
      country: locationValue,
      address: address,
      tag_line: tagline,
      content: detail,
      avatar_base64: profilePhoto,
      department: selectedDepartment.toString(),
      employees: SelectedNoEmolyee.toString(),
      company_name: companyName,
      company_name_title: jobTitle,
    });
    axios
      .post(
        Constant.BaseUrl + 'dashboard/update_employer_profile',
        {
          user_id: userInfo.id,
          basics: basics[0],
          banner_base64: banner,
        },
        {
          headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          dispatch(updateProfileImage(response.data.profile_img_url));
          dispatch(updateProfileBannerImage(response.data.banner_img_url));
          dispatch(updateProfileName(displayName));
          let data = JSON.parse(JSON.stringify(profileInfo));
          data._tag_line = tagline;
          dispatch(updateProfileInfo(data));

          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log('in catch', error);
        setLoading(false);
      });
  };

  const addExperienceinList = () => {
    if (expTitle != '' && expCompany != '') {
      experiences.push({
        title: expTitle,
        startdate: expStartDate,
        enddate: expEndDate,
        company: expCompany,
        description: expDetail,
      });
      setRefreshList(!refreshList);
      setExpTitle('');
      setExpStartDate('');
      setExpEndDate('');
      setExpCompany('');
      setExpDetail('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompulsoryFields);
    }
  };
  const editClickExperience = (item, index) => {
    setExperienceIndex(index);
    setExperienceForm(true);
    setEditExperience(true);
    setExpTitle(item.title);
    setExpStartDate(item.startdate);
    setExpEndDate(item.enddate);
    setExpCompany(item.company);
    setExpDetail(item.description);
  };
  const addEditExperienceinList = () => {
    if (expTitle != '' && expCompany != '') {
      experiences[experienceIndex].title = expTitle;
      experiences[experienceIndex].startdate = expStartDate;
      experiences[experienceIndex].enddate = expEndDate;
      experiences[experienceIndex].company = expCompany;
      experiences[experienceIndex].description = expDetail;
      setRefreshList(!refreshList);
      setExpTitle('');
      setExpStartDate('');
      setExpEndDate('');
      setExpCompany('');
      setExpDetail('');
      setExperienceIndex(null);
      setEditExperience(false);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const cancelEditExperience = () => {
    setExperienceIndex(null);
    setEditExperience(false);
    setExpTitle('');
    setExpStartDate('');
    setExpEndDate('');
    setExpCompany('');
    setExpDetail('');
  };
  const deleteExperience = index => {
    experiences.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const addEducationinList = () => {
    if (eduTitle != '' && eduInstitute != '') {
      educations.push({
        title: eduTitle,
        startdate: eduStartDate,
        enddate: eduEndDate,
        institute: eduInstitute,
        description: eduDetail,
      });
      setRefreshList(!refreshList);
      setEduTitle('');
      setEduStartDate('');
      setEduEndDate('');
      setEduInstitute('');
      setEduDetail('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompulsoryFields);
    }
  };
  const editClickEducation = (item, index) => {
    setEducationIndex(index);
    setEducationForm(true);
    setEditEducation(true);
    setEduTitle(item.title);
    setEduStartDate(item.startdate);
    setEduEndDate(item.enddate);
    setEduInstitute(item.company);
    setEduDetail(item.description);
  };
  const addEditEducationinList = () => {
    if (eduTitle != '' && eduInstitute != '') {
      educations[educationIndex].title = eduTitle;
      educations[educationIndex].startdate = eduStartDate;
      educations[educationIndex].enddate = eduEndDate;
      educations[educationIndex].institute = eduInstitute;
      educations[educationIndex].description = eduDetail;
      setRefreshList(!refreshList);
      setEduTitle('');
      setEduStartDate('');
      setEduEndDate('');
      setEduInstitute('');
      setEduDetail('');
      setEducationIndex(null);
      setEditEducation(false);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const cancelEditEducation = () => {
    setEducationIndex(null);
    setEditEducation(false);
    setEduTitle('');
    setEduStartDate('');
    setEduEndDate('');
    setEduInstitute('');
    setEduDetail('');
  };
  const deleteEducation = index => {
    educations.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateExpEdu = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings',
        {
          user_id: userInfo.id,
          edit_type: 'edu_exp',
          education: educations,
          experience: experiences,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setExperienceForm(false);
          setEducationForm(false);
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const saveUpdateSocialProfile = async () => {
    var socialObj = {};
    for (let i = 0; i < socialMedia.length; i++) {
      socialObj[socialMedia[i].slug] = socialMedia[i].social_url;
    }
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl +
          'profile/update_social_profile_setting?user_id=' +
          userInfo.id,
        {
          id: userInfo.id,
          basics: socialObj,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const chooseMultiplePictures = async () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      multiple: true,
      maxFiles: 10,
      mediaType: 'photo',
    }).then(img => {
      for (var i = 0; i < img.length; i++) {
        gallery.unshift({
          filename: img[i].filename,
          mime: img[i].mime,
          path: img[i].path,
          size: img[i].size,
          sourceURL: img[i].sourceURL,
        });
      }
      setRefreshList(!refreshList);
    });
  };
  const deleteGalleryImage = index => {
    gallery.splice(index, 1);
    setRefreshList(!refreshList);
    setSelectedGalleryImage(null);
  };
  const saveUpdateGallery = () => {
    setLoading(true);
    let galleryArray = [];
    let newGalleryArray = [];
    for (var i = 0; i < gallery.length; i++) {
      if (gallery[i].hasOwnProperty('attachment_url')) {
        galleryArray.push(gallery[i]);
      } else {
        newGalleryArray.push(gallery[i]);
      }
    }
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('images_gallery', JSON.stringify(galleryArray));
    formData.append('images_gallery_new', newGalleryArray.length);
    if (newGalleryArray != null) {
      newGalleryArray.forEach((item, i) => {
        formData.append('gallery_images' + i, {
          uri: Platform.OS == 'ios' ? item.sourceURL : item.path,
          type: item.mime,
          name:
            Platform.OS == 'ios'
              ? item.filename
              : item.path.substring(item.path.lastIndexOf('/') + 1),
        });
      });
    }
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings?edit_type=gallery',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const pickBrouchersfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      console.log(res);
      for (var i = 0; i < res.length; i++) {
        brouchers.push(res[i]);
      }
      setRefreshList(!refreshList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const deleteBrouchers = index => {
    brouchers.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateBrouchers = () => {
    setLoading(true);
    let broucherArray = [];
    let newBroucherArray = [];
    for (var i = 0; i < brouchers.length; i++) {
      if (brouchers[i].hasOwnProperty('attachment_id')) {
        broucherArray.push(brouchers[i]);
      } else {
        newBroucherArray.push(brouchers[i]);
      }
    }
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('id', userInfo.id);
    formData.append('brochures', JSON.stringify(broucherArray));
    formData.append('size', newBroucherArray.length);
    if (newBroucherArray != null) {
      newBroucherArray.forEach((item, i) => {
        formData.append('brochures_files' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    axios
      .post(Constant.BaseUrl + 'profile/update_brochures_setting', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.authToken,
        },
      })
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const addProjectinList = () => {
    if (projectTitle != '' && projectURL != '' && projectImage != null) {
      projects.push({
        title: projectTitle,
        link: projectURL,
        image: projectImage,
      });
      setRefreshList(!refreshList);
      setProjectTitle('');
      setProjectURL('');
      setProjectImage(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const editClickProject = (item, index) => {
    setProjectIndex(index);
    setProjectForm(true);
    setEditProject(true);
    setProjectTitle(item.title);
    setProjectURL(item.link);
    setProjectImage(item.hasOwnProperty('image') ? item.image : item);
  };
  const addEditProjectinList = () => {
    if (projectTitle != '' && projectURL != '' && projectImage != null) {
      projects[projectIndex].title = projectTitle;
      projects[projectIndex].link = projectURL;
      projects[projectIndex].image = projectImage;
      setRefreshList(!refreshList);
      setProjectTitle('');
      setProjectURL('');
      setProjectImage(null);
      setProjectIndex(null);
      setEditProject(false);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const cancelEditProject = () => {
    setProjectIndex(null);
    setEditProject(false);
    setProjectTitle('');
    setProjectURL('');
    setProjectImage(null);
  };
  const deleteProject = index => {
    projects.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateProject = async () => {
    let projectsArray = [];
    let imagesProject = [];

    for (var i = 0; i < projects.length; i++) {
      if (projects[i].hasOwnProperty('image')) {
        projectsArray.push({
          title: projects[i].title,
          link: projects[i].link,
         
        });
        imagesProject.push({
          name: projects[i].image.name,
          type: projects[i].image.type,
          uri: projects[i].image.uri,
          index:i
        })
      } else {
        projectsArray.push({
          title: projects[i].title,
          link: projects[i].link,
          image: {
            attachment_id: projects[i].attachment_id,
            url: projects[i].img_url,
          },
        });
      }
    }
    setLoading(true);
    console.log('object', projectsArray);
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('edit_type', 'projects');
    formData.append('project', JSON.stringify(projectsArray));
    if (imagesProject != null) {
      imagesProject.forEach((item, i) => {
        formData.append('project_image_' + item.index, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    console.log('formData', formData);
    fetch(Constant.BaseUrl + 'profile/update_tab_settings', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token.authToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(async response => {
        console.log("objectResponse",response)
        if (response.type == 'success') {
          setSpecializationForm(false);
          setShowAlert(true);
          setLoading(false);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const choosePictureFromGallery = async val => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      mediaType: 'photo',
      includeBase64: true,
    }).then(img => {
      if (val == 'awards') {
        setAwardImage(img);
      } else if (val == 'projects') {
        setProjectImage(img);
      } else if (val == 'profile') {
        setPhoto(img);
      } else if (val == 'banner') {
        setBannerPhoto(img);
      }
      setRefreshList(!refreshList);
    });
  };
  const pickProjectfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      let text = res.type;
      const myArray = text.split('/');
      setProjectImage({
        show: myArray[0] == 'image' ? 'yes' : '',
        uri: res.uri,
        name: res.name,
        type: res.type,
      });

      setRefreshList(!refreshList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const pickAwardsfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      let text = res.type;
      const myArray = text.split('/');
      setAwardImage({
        show: myArray[0] == 'image' ? 'yes' : '',
        uri: res.uri,
        name: res.name,
        type: res.type,
      });

      setRefreshList(!refreshList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    setSearchedDate(
      currentDate.getFullYear() +
        '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + currentDate.getDate()).slice(-2),
    );
    setSearchedShortDate(
      monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear(),
    );
    setDate(currentDate);
  };
  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = selectedDate;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    setShowDatePicker(false);
    const selectedAndroidDate =
      currentDate.getFullYear() +
      '-' +
      ('0' + (currentDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + currentDate.getDate()).slice(-2);
    setSearchedDate(selectedAndroidDate);
    if (calendarType == 'award') {
      setDisplayDate(
        monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear(),
      );
      setAwardDate(selectedAndroidDate);
    } else if (calendarType == 'expStart') {
      setExpStartDate(selectedAndroidDate);
    } else if (calendarType == 'expEnd') {
      setExpEndDate(selectedAndroidDate);
    } else if (calendarType == 'eduStart') {
      setEduStartDate(selectedAndroidDate);
    } else if (calendarType == 'eduEnd') {
      setEduEndDate(selectedAndroidDate);
    }

    setDate(currentDate);
  };
  const addAwardinList = () => {
    if (awardTitle != '' && awardDate != '' && awardImage != null) {
      awards.push({
        title: awardTitle,
        date: awardDate,
        displayDate: displayDate,
        image: awardImage,
      });
      setRefreshList(!refreshList);
      setAwardTitle('');
      setAwardDate('');
      setDisplayDate('');
      setAwardImage(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const editClickAward = (item, index) => {
    setAwardIndex(index);
    setAwardForm(true);
    setEditAward(true);
    setAwardTitle(item.title);
    setAwardDate(item.date);
    setDisplayDate(item.hasOwnProperty('image') ? item.displayDate : item.date);
    setAwardImage(item.hasOwnProperty('image') ? item.image : item);
  };
  const addEditAwardinList = () => {
    if (awardTitle != '' && awardDate != '' && awardImage != null) {
      awards[awardIndex].title = awardTitle;
      awards[awardIndex].date = awardDate;
      awards[awardIndex].displayDate = displayDate;
      if (awardImage.hasOwnProperty('img_url')) {
      } else {
        awards[awardIndex].image = awardImage;
      }
      setRefreshList(!refreshList);
      setAwardTitle('');
      setAwardDate('');
      setDisplayDate('');
      setAwardImage(null);
      setAwardIndex(null);
      setEditAward(false);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const cancelEditAward = () => {
    setAwardIndex(null);
    setEditAward(false);
    setAwardTitle('');
    setAwardDate('');
    setDisplayDate('');
    setAwardImage(null);
  };
  const deleteAward = index => {
    awards.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateAward = async () => {
    let awardsArray = [];
    let imagesAwards = [];
    console.log("object",awards)
    for (var i = 0; i < awards.length; i++) {
      if (awards[i].hasOwnProperty('image')) {
        awardsArray.push({
          title: awards[i].title,
          date: awards[i].date,
        });
        imagesAwards.push({
          name: awards[i].image.name,
          type: awards[i].image.type,
          uri: awards[i].image.uri,
          index:i
        })
      } else {
        awardsArray.push({
          title: awards[i].title,
          date: awards[i].date,
          image: {
            attachment_id: awards[i].attachment_id,
            url: awards[i].img_url,
          },
        });
      }
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('edit_type', 'awards');
    formData.append('awards', JSON.stringify(awardsArray));
    if (imagesAwards != null) {
      imagesAwards.forEach((item, i) => {
        formData.append('project_award_image_' + item.index, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    console.log('formData', formData);
      fetch(Constant.BaseUrl + 'profile/update_tab_settings', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.authToken,
        },
        body: formData,
      })
        .then(response => response.json())
      .then(async response => {
        if (response.type == 'success') {
          setAwardForm(false);
          setShowAlert(true);
          setLoading(false);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const addURLVideos = () => {
    if (URL != '') {
      videosURL.push(URL);
      setRefreshList(!refreshList);
      setURL('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingPleaseAddURL);
    }
  };
  const deleteURL = index => {
    videosURL.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateVideosURL = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings',
        {
          user_id: userInfo.id,
          edit_type: 'videos',
          videos: videosURL,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const addSpecializationinList = () => {
    var specializationName = '';
    for (var i = 0; i < specializationItems.length; i++) {
      if (specializationValue == specializationItems[i].value) {
        specializationName = specializationItems[i].label;
      }
    }
    if (
      specializationValue != null &&
      specializationPercentage != '' &&
      parseInt(specializationPercentage) <= 100
    ) {
      specialization.push({
        id: specializationValue,
        title: specializationName,
        val: specializationPercentage,
      });
      setRefreshList(!refreshList);
      setSpecializationValue(null);
      setSpecializationPercentage('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(specializationPercentage) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const editClickSpecialization = (item, index) => {
    setSpecializationIndex(index);
    setSpecializationForm(true);
    setEditSpecialization(true);
    setSpecializationValue(item.id);
    setSpecializationPercentage(item.val.toString());
  };
  const addEditSpecializationinList = () => {
    if (
      specializationValue != null &&
      specializationPercentage != '' &&
      parseInt(specializationPercentage) <= 100
    ) {
      var specializationName = '';
      for (var i = 0; i < specializationItems.length; i++) {
        if (specializationValue == specializationItems[i].value) {
          specializationName = specializationItems[i].label;
        }
      }
      specialization[specializationIndex].id = specializationValue;
      specialization[specializationIndex].title = specializationName;
      specialization[specializationIndex].val = specializationPercentage;
      setRefreshList(!refreshList);
      setSpecializationValue(null);
      setSpecializationPercentage('');
      setEditSpecialization(false);
      setSpecializationIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(specializationPercentage) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const cancelEditSpecialization = () => {
    setSpecializationIndex(null);
    setEditSpecialization(false);
    setSpecializationValue(null);
    setSpecializationPercentage('');
  };
  const deleteSpecialization = index => {
    specialization.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateSpecialization = async () => {
    let SpecializationArray = [];
    for (var i = 0; i < specialization.length; i++) {
      SpecializationArray.push({
        title: specialization[i].title,
        spec: specialization[i].id.toString(),
        value: specialization[i].val,
      });
    }
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings',
        {
          user_id: userInfo.id,
          edit_type: 'specialization',
          specialization: SpecializationArray,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setSpecializationForm(false);
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const addIndustrialExpinList = () => {
    var IndustrialExpName = '';
    for (var i = 0; i < industrialExpItems.length; i++) {
      if (industrialExpValue == industrialExpItems[i].value) {
        IndustrialExpName = industrialExpItems[i].label;
      }
    }
    if (
      industrialExpValue != null &&
      industrialPercentage != '' &&
      parseInt(industrialPercentage) <= 100
    ) {
      industrialExp.push({
        id: industrialExpValue,
        title: IndustrialExpName,
        val: industrialPercentage,
      });
      setRefreshList(!refreshList);
      setIndustrialExpValue(null);
      setIndustrialPercentage('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(industrialPercentage) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const editIndustrialExp = (item, index) => {
    setIndustrialIndex(index);
    setIndustrialForm(true);
    setEditIndustrial(true);
    setIndustrialExpValue(item.id);
    setIndustrialPercentage(item.val.toString());
  };
  const addEditIndustrialExpinList = () => {
    if (
      industrialExpValue != null &&
      industrialPercentage != '' &&
      parseInt(industrialPercentage) <= 100
    ) {
      var IndustrialExpName = '';
      for (var i = 0; i < industrialExpItems.length; i++) {
        if (industrialExpValue == industrialExpItems[i].value) {
          IndustrialExpName = industrialExpItems[i].label;
        }
      }
      industrialExp[industrialIndex].id = industrialExpValue;
      industrialExp[industrialIndex].title = IndustrialExpName;
      industrialExp[industrialIndex].val = industrialPercentage;
      setRefreshList(!refreshList);
      setIndustrialExpValue(null);
      setIndustrialPercentage('');
      setEditIndustrial(false);
      setIndustrialIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(
        parseInt(industrialPercentage) <= 100
          ? Translation.profileSettingFillCompleteData
          : Translation.profileSettingEnterValid,
      );
    }
  };
  const cancelEditIndustrialExp = () => {
    setIndustrialIndex(null);
    setEditIndustrial(false);
    setIndustrialExpValue(null);
    setIndustrialPercentage('');
  };
  const deleteIndustrialExp = index => {
    industrialExp.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateIndustrialExp = async () => {
    let IndustrialArray = [];
    for (var i = 0; i < industrialExp.length; i++) {
      IndustrialArray.push({
        title: industrialExp[i].title,
        exp: industrialExp[i].id.toString(),
        value: industrialExp[i].val,
      });
    }
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings',
        {
          user_id: userInfo.id,
          edit_type: 'industrial_experience',
          industrial_experiences: IndustrialArray,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const addFAQsinList = () => {
    if (question != '' && answer != '') {
      faqs.push({
        faq_question: question,
        faq_answer: answer,
      });
      setRefreshList(!refreshList);
      setQuestion('');
      setAnswer('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const editFAQs = (item, index) => {
    setFaqIndex(index);
    setFaqsForm(true);
    setEditFaq(true);
    setAnswer(item.faq_answer);
    setQuestion(item.faq_question);
  };
  const addEditFAQsinList = () => {
    if (question != '' && answer != '') {
      faqs[faqIndex].faq_question = question;
      faqs[faqIndex].faq_answer = answer;
      setRefreshList(!refreshList);
      setQuestion('');
      setAnswer('');
      setEditFaq(false);
      setFaqIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.profileSettingFillCompleteData);
    }
  };
  const cancelEditFaq = () => {
    setFaqIndex(null);
    setEditFaq(false);
    setAnswer('');
    setQuestion('');
  };
  const deleteFAQs = index => {
    faqs.splice(index, 1);
    setRefreshList(!refreshList);
  };
  const saveUpdateFaqs = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/update_tab_settings',
        {
          user_id: userInfo.id,
          edit_type: 'faq',
          faq: faqs,
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
          setFaqsForm(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else {
          setShowAlert(true);
          setLoading(false);
          setType(response.data.type);
          setTitle(response.data.title);
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
  const addDateInField = () => {
    if (calendarType == 'award') {
      setDisplayDate(searchedShortDate);
      setAwardDate(searchedDate);
    } else if (calendarType == 'expStart') {
      setExpStartDate(searchedDate);
    } else if (calendarType == 'expEnd') {
      setExpEndDate(searchedDate);
    } else if (calendarType == 'eduStart') {
      setEduStartDate(searchedDate);
    } else if (calendarType == 'eduEnd') {
      setEduEndDate(searchedDate);
    }

    RBSheetCalender.current.close();
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={'Edit my profile'}
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
          data={profileInfo.user_type == 'employer' ? employerTabs : tabs}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => setSelectedSection(index)}
                  style={[
                    styles.freelancerDetailTopTabViewSingle,
                    {
                      backgroundColor:
                        selectedSection == index
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedSection == index
                          ? Constant.whiteColor
                          : Constant.borderColor,
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
            </>
          )}
        />
      </View>
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
          {selectedSection == 0 && (
            <View style={[styles.cardView, {paddingTop: 5}]}>
              <View style={styles.profileSettingImageView}>
                <ImageBackground
                  style={{height: 180, overflow: 'hidden', borderRadius: 10}}
                  imageStyle={{
                    borderRadius: 10,
                  }}
                  source={
                    bannerPhoto != null
                      ? bannerPhoto.hasOwnProperty('banner_image_url')
                        ? bannerPhoto.banner_image_url != ''
                          ? {uri: bannerPhoto.banner_image_url}
                          : require('../../assets/images/NoImage.png')
                        : {
                            uri:
                              Platform.OS == 'ios'
                                ? bannerPhoto.sourceURL
                                : bannerPhoto.path,
                          }
                      : require('../../assets/images/NoImage.png')
                  }>
                  <View
                    style={[
                      styles.freelancerDetailImageOverly,
                      {
                        backgroundColor: '#00000050',
                        alignItems: 'center',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => choosePictureFromGallery('banner')}
                      style={{alignSelf: 'flex-end', padding: 15}}>
                      <Feather
                        name="edit-3"
                        color={Constant.whiteColor}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 20,
                  marginTop: -60,
                  alignItems: 'center',
                }}>
                {photo != null && (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 70 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Constant.whiteColor,
                    }}>
                    <Image
                      style={{
                        width: 65,
                        height: 65,
                        borderRadius: 65 / 2,
                      }}
                      source={
                        photo.hasOwnProperty('image_url')
                          ? photo.image_url != ''
                            ? {uri: photo.image_url}
                            : require('../../assets/images/NoImage.png')
                          : {
                              uri:
                                Platform.OS == 'ios'
                                  ? photo.sourceURL
                                  : photo.path,
                            }
                      }
                    />
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => choosePictureFromGallery('profile')}
                  style={{
                    marginTop: -35,
                    marginLeft: -20,
                    backgroundColor: Constant.whiteColor,
                    overflow: 'visible',
                    borderRadius: 50,
                    zIndex: 100,
                    borderWidth: 1,
                    padding: 5,
                    borderColor: Constant.whiteColor,
                  }}>
                  <Feather name="plus" color={Constant.fontColor} size={14} />
                </TouchableOpacity>
              </View>
              {profileInfo.user_type == 'freelancer' && (
                <>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingSelectGender}
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
                    open={openGender}
                    value={genderValue}
                    placeholder={Translation.profileSettingSelectGender}
                    searchPlaceholder={Translation.globalSearchHere}
                    items={genderItems}
                    searchable={true}
                    setOpen={setOpenGender}
                    setValue={setGenderValue}
                    setItems={setGenderItems}
                    listMode="MODAL"
                    theme="LIGHT"
                    multiple={false}
                    mode="BADGE"
                    zIndexInverse={100}
                    disableBorderRadius={true}
                    badgeDotColors={['#e76f51']}
                  />
                </>
              )}
              <Text style={styles.inputHeading}>
                {Translation.profileSettingFirstName}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={firstName}
                onChangeText={text => setFirstName(text)}
                placeholderText={Translation.profileSettingFirstNamePlaceholder}
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.profileSettingLastName}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={lastName}
                onChangeText={text => setLastName(text)}
                placeholderText={Translation.profileSettingLastNamePlaceholder}
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.profileSettingDisplayName}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={displayName}
                onChangeText={text => setDisplayName(text)}
                placeholderText={
                  Translation.profileSettingDisplayNamePlaceholder
                }
                keyboardType="email-address"
                autoCorrect={false}
              />
              {profileInfo.user_type == 'freelancer' && (
                <>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingHourlyRate}
                    <Text style={{color: Constant.astaricColor}}>*</Text>
                  </Text>
                  <FormInput
                    labelValue={hourlyRate}
                    onChangeText={text => setHourlyRate(text)}
                    placeholderText={
                      Translation.profileSettingHourlyRatePlaceholder
                    }
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingMaximumHourRate}
                    <Text style={{color: Constant.astaricColor}}>*</Text>
                  </Text>
                  <FormInput
                    labelValue={maxPrice}
                    onChangeText={text => setMaxPrice(text)}
                    placeholderText={
                      Translation.profileSettingMaximumHourRatePlaceholder
                    }
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </>
              )}
              <Text style={styles.inputHeading}>
                {Translation.profileSettingPhoneNumber}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                placeholderText={
                  Translation.profileSettingPhoneNumberPlaceholder
                }
                keyboardType="email-address"
                autoCorrect={false}
              />
              <Text style={styles.inputHeading}>
                {Translation.profileSettingTagline}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={tagline}
                onChangeText={text => setTagline(text)}
                placeholderText={Translation.profileSettingTaglinePlaceholder}
                keyboardType="email-address"
                autoCorrect={false}
              />
              {profileInfo.user_type == 'employer' && (
                <>
                  {settings.employers_settings.company_job_title ==
                    'enable' && (
                    <>
                      <Text style={styles.inputHeading}>
                        {Translation.profileSettingCompanyName}
                        {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                      </Text>
                      <FormInput
                        labelValue={companyName}
                        onChangeText={text => setCompanyName(text)}
                        placeholderText={
                          Translation.profileSettingCompanyNamePlaceholder
                        }
                        keyboardType="email-address"
                        autoCorrect={false}
                      />
                    </>
                  )}
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingJob}
                    <Text style={{color: Constant.astaricColor}}>*</Text>
                  </Text>
                  <FormInput
                    labelValue={jobTitle}
                    onChangeText={text => setJobTitle(text)}
                    placeholderText={Translation.profileSettingJobPlaceholder}
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </>
              )}
              <Text style={styles.inputHeading}>
                {Translation.profileSettingAddDescription}
              </Text>
              <View style={styles.multilineTextInputView}>
                <TextInput
                  placeholder={
                    Translation.profileSettingAddDescriptionPlaceholder
                  }
                  multiline
                  value={detail}
                  onChangeText={text => setDetail(text)}
                  placeholderTextColor={Constant.lightGrayColor}
                  style={styles.multilineTextInput}
                />
              </View>
              {profileInfo.user_type == 'freelancer' && (
                <>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingLanguagesSpeak}
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
                    open={openLanguage}
                    value={languageValue}
                    placeholder={Translation.profileSettingSelectLanguages}
                    searchPlaceholder={Translation.globalSearchHere}
                    items={languageItems}
                    searchable={true}
                    setOpen={setOpenLanguage}
                    setValue={setLanguageValue}
                    setItems={setLanguageItems}
                    listMode="MODAL"
                    theme="LIGHT"
                    multiple={true}
                    mode="BADGE"
                    zIndex={10000}
                    disableBorderRadius={true}
                    badgeDotColors={[Constant.primaryColor]}
                  />
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingEnglishLevel}
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
                    open={openEnglishLevel}
                    value={englishLevelValue}
                    placeholder={Translation.profileSettingSelectEnglishLevel}
                    searchPlaceholder={Translation.globalSearchHere}
                    items={englishLevelItems}
                    searchable={true}
                    setOpen={setOpenEnglishLevel}
                    setValue={setEnglishLevelValue}
                    setItems={setEnglishLevelItems}
                    listMode="MODAL"
                    theme="LIGHT"
                    multiple={false}
                    mode="BADGE"
                    zIndex={1000}
                    disableBorderRadius={true}
                    badgeDotColors={[Constant.primaryColor]}
                  />
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingTypeFreelancer}
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
                    open={openFreelancerType}
                    value={freelancerTypeValue}
                    placeholder={Translation.profileSettingSelectTypeFreelancer}
                    searchPlaceholder={Translation.globalSearchHere}
                    items={freelancerTypeItems}
                    searchable={true}
                    setOpen={setOpenFreelancerType}
                    setValue={setFreelancerTypeValue}
                    setItems={setFreelancerTypeItems}
                    listMode="MODAL"
                    theme="LIGHT"
                    multiple={false}
                    mode="BADGE"
                    zIndex={100}
                    disableBorderRadius={true}
                    badgeDotColors={[Constant.primaryColor]}
                  />
                </>
              )}
              {profileInfo.user_type == 'employer' && (
                <>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingCompanyDetails}
                  </Text>
                  <View style={styles.subCardView}>
                    <Text style={[styles.inputHeading, {marginTop: 0}]}>
                      {Translation.profileSettingYourDepartment}
                    </Text>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={departmentsTaxonomy}
                      style={{marginBottom: 10}}
                      keyExtractor={(x, i) => i.toString()}
                      renderItem={({item, index}) => (
                        <View style={[styles.rowView, {marginTop: 10}]}>
                          <TouchableOpacity
                            onPress={() => setSelectedDepartment(item.id)}
                            style={[
                              styles.CustomCheckOuterView,
                              {
                                backgroundColor:
                                  selectedDepartment == item.id
                                    ? Constant.greenColor
                                    : Constant.whiteColor,
                              },
                            ]}>
                            <View style={styles.CustomCheckInnerView} />
                          </TouchableOpacity>

                          <Text
                            style={[
                              styles.PayoutSettingsPayoutName,
                              {marginLeft: 10, color: '#484848'},
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                  <View style={styles.subCardView}>
                    <Text style={[styles.inputHeading, {marginTop: 0}]}>
                      {Translation.profileSettingNoEmployees}
                    </Text>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={NoEmployeeTaxonomy}
                      style={{marginBottom: 10}}
                      keyExtractor={(x, i) => i.toString()}
                      renderItem={({item, index}) => (
                        <View style={[styles.rowView, {marginTop: 10}]}>
                          <TouchableOpacity
                            onPress={() => setSelectedNoEmolyee(item.value)}
                            style={[
                              styles.CustomCheckOuterView,
                              {
                                backgroundColor:
                                  SelectedNoEmolyee == item.value
                                    ? Constant.greenColor
                                    : Constant.whiteColor,
                              },
                            ]}>
                            <View style={styles.CustomCheckInnerView} />
                          </TouchableOpacity>

                          <Text
                            style={[
                              styles.PayoutSettingsPayoutName,
                              {marginLeft: 10, color: '#484848'},
                            ]}>
                            {item.title}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </>
              )}
              {profileInfo.user_type == 'freelancer' && (
                <>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingUploadResume}
                  </Text>
                  <View style={styles.uploadFileView}>
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
                  {resume != null && resume != '' && (
                    <View
                      style={[
                        styles.JobDetailAttachmentItemView,
                        {backgroundColor: '#FCFCFC'},
                      ]}>
                      <Text style={styles.JobDetailAttachmentItemText}>
                        {resume.hasOwnProperty('document_name')
                          ? resume.document_name
                          : Platform.OS == 'ios'
                          ? resume.filename
                          : resume.path.substring(
                              resume.path.lastIndexOf('/') + 1,
                            )}
                      </Text>
                      <TouchableOpacity onPress={() => setResume(null)}>
                        <Feather
                          name={'trash-2'}
                          color={Constant.primaryColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
              <Text style={styles.inputHeading}>
                {Translation.profileSettingYourLocation}
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
                open={openLocation}
                value={locationValue}
                placeholder={Translation.profileSettingSelectLocation}
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
                {Translation.profileSettingYourAddress}
                <Text style={{color: Constant.astaricColor}}>*</Text>
              </Text>
              <FormInput
                labelValue={address}
                onChangeText={text => setAddress(text)}
                placeholderText={
                  Translation.profileSettingYourAddressPlaceholder
                }
                keyboardType="email-address"
                autoCorrect={false}
                iconType={'crosshair'}
                iconColor={Constant.lightGrayColor}
              />
              <FormInput
                labelValue={longitude}
                onChangeText={text => setLongitude(text)}
                placeholderText={Translation.profileSettingLongitude}
                keyboardType="email-address"
                autoCorrect={false}
                iconType={'alert-circle'}
                iconColor={Constant.lightGrayColor}
              />
              <FormInput
                labelValue={latitude}
                onChangeText={text => setLatitude(text)}
                placeholderText={Translation.profileSettingLatitude}
                keyboardType="email-address"
                autoCorrect={false}
                iconType={'alert-circle'}
                iconColor={Constant.lightGrayColor}
              />
              {profileInfo.user_type == 'freelancer' && (
                <>
                  <View
                    style={[styles.rowView, {justifyContent: 'space-between'}]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingMySkills}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSkillsForm(!skillsForm)}>
                      <Feather
                        name={skillsForm ? 'minus' : 'plus'}
                        color={Constant.fontColor}
                        size={22}
                      />
                    </TouchableOpacity>
                  </View>

                  {skillsForm && (
                    <>
                      {editSkills && (
                        <View style={styles.profileSettingProjectView}>
                          <View style={{marginLeft: 5, flexDirection: 'row'}}>
                            <Feather
                              style={{marginRight: 10}}
                              name={'edit-3'}
                              color={Constant.fontColor}
                              size={20}
                            />
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.profileSettingProjectName,
                                {width: '85%'},
                              ]}>
                              {skills[skillsIndex].name}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => cancelEditSkills()}>
                            <Feather
                              style={{marginRight: 10}}
                              name={'x'}
                              color={Constant.fontColor}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      <View
                        style={[
                          styles.subCardView,
                          {
                            borderRadius: editSkills ? 0 : 10,
                            marginTop: editSkills ? 0 : 10,
                          },
                        ]}>
                        {settings.freelancers_settings.allow_custom_skills ==
                          'yes' && (
                          <TouchableOpacity
                            onPress={() => {
                              setSkillCustom('');
                              setSkillVal('');
                              setcustomSkill(!customSkill);
                            }}
                            style={{
                              alignSelf: 'flex-end',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.inputHeading,
                                {color: Constant.blueColor},
                              ]}>
                              {customSkill
                                ? 'Cancel custom skill '
                                : 'Add custom skill'}
                            </Text>
                            {!customSkill && (
                              <Feather
                                style={{marginLeft: 5, marginTop: 5}}
                                name={'plus'}
                                color={Constant.blueColor}
                                size={15}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                        <Text style={styles.inputHeading}>
                          {Translation.profileSettingAddSkill}
                          <Text style={{color: Constant.astaricColor}}>*</Text>
                        </Text>
                        {customSkill ? (
                          <FormInput
                            labelValue={skillCustom}
                            onChangeText={text => setSkillCustom(text)}
                            placeholderText={Translation.profileSettingAddSkill}
                            keyboardType="email-address"
                            autoCorrect={false}
                          />
                        ) : (
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
                            open={openSkills}
                            value={skillsValue}
                            placeholder={Translation.profileSettingSelectSkill}
                            searchPlaceholder={Translation.globalSearchHere}
                            items={skillsItems}
                            searchable={true}
                            setOpen={setOpenSkills}
                            setValue={setSkillsValue}
                            setItems={setSkillsItems}
                            listMode="MODAL"
                            theme="LIGHT"
                            multiple={false}
                            mode="BADGE"
                            zIndexInverse={100}
                            disableBorderRadius={true}
                            badgeDotColors={['#e76f51']}
                          />
                        )}
                        <Text style={styles.inputHeading}>
                          {Translation.profileSettingAddValue}
                          <Text style={{color: Constant.astaricColor}}>*</Text>
                        </Text>
                        <FormInput
                          labelValue={skillVal}
                          onChangeText={text => setSkillVal(text)}
                          placeholderText={
                            Translation.profileSettingAddValuePlaceholder
                          }
                          keyboardType="email-address"
                          autoCorrect={false}
                        />
                        <View
                          style={[
                            styles.rowView,
                            {justifyContent: 'flex-end'},
                          ]}>
                          <TouchableOpacity
                            onPress={() =>
                              skillsIndex != null
                                ? customSkill
                                  ? addEditCustomSkillsinList()
                                  : addEditSkillsinList()
                                : customSkill
                                ? addCustomSkillsinList()
                                : addSkillsinList()
                            }
                            style={[
                              styles.smallButton,
                              {
                                backgroundColor: Constant.blueColor,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.buttonText,
                                {color: Constant.whiteColor},
                              ]}>
                              {Translation.globalSaveUpdate}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={skills}
                    inverted
                    style={{marginBottom: 10, marginTop: skillsForm ? 0 : 10}}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({item, index}) => (
                      <View
                        style={[
                          styles.JobDetailAttachmentItemView,
                          {backgroundColor: '#FCFCFC'},
                        ]}>
                        <Text style={styles.JobDetailAttachmentItemText}>
                          {item.name}
                          {'   '}
                          <Text style={styles.profileSettingSkillPercentage}>
                            {item.val}%
                          </Text>
                        </Text>
                        <View style={styles.rowView}>
                          <TouchableOpacity
                            onPress={() => editClickSkills(item, index)}>
                            <Feather
                              style={{marginRight: 15}}
                              name={'edit-3'}
                              color={Constant.fontColor}
                              size={20}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => deleteSkills(index)}>
                            <Feather
                              style={{marginRight: 10}}
                              name={'trash-2'}
                              color={Constant.primaryColor}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </>
              )}
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() =>
                  profileInfo.user_type == 'freelancer'
                    ? saveUpdatePersonalDataFreelancer()
                    : saveUpdatePersonalDataEmployer()
                }
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {profileInfo.user_type != 'employer' ? (
            <>
              {selectedSection == 1 && (
                <>
                  <View style={styles.cardView}>
                    <View
                      style={[
                        styles.rowView,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={styles.inputHeading}>
                        {Translation.profileSettingAddExperience}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setExperienceForm(!experienceForm)}>
                        <Feather
                          name={experienceForm ? 'minus' : 'plus'}
                          color={Constant.fontColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    {experienceForm && (
                      <>
                        {editExperience && (
                          <View style={styles.profileSettingProjectView}>
                            <View style={{marginLeft: 5, flexDirection: 'row'}}>
                              <Feather
                                style={{marginRight: 10}}
                                name={'edit-3'}
                                color={Constant.fontColor}
                                size={20}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.profileSettingProjectName,
                                  {width: '85%'},
                                ]}>
                                {experiences[experienceIndex].title}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => cancelEditExperience()}>
                              <Feather
                                style={{marginRight: 10}}
                                name={'x'}
                                color={Constant.fontColor}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                        <View
                          style={[
                            styles.subCardView,
                            {
                              borderRadius: editExperience ? 0 : 10,
                              marginTop: editExperience ? 0 : 10,
                            },
                          ]}>
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingExperience}
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>
                          </Text>
                          <FormInput
                            labelValue={expTitle}
                            onChangeText={text => setExpTitle(text)}
                            placeholderText={
                              Translation.profileSettingExperiencePlaceholder
                            }
                            keyboardType="email-address"
                            autoCorrect={false}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingStartDate}
                            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                          </Text>
                          <FormInput
                            labelValue={expStartDate}
                            // onChangeText={text => s(text)}
                            placeholderText={
                              Translation.profileSettingStartDate
                            }
                            keyboardType="email-address"
                            editable={false}
                            autoCorrect={false}
                            iconType={'calendar'}
                            iconColor={Constant.fontColor}
                            action={true}
                            actionIcon={() => {
                              if (Platform.OS == 'ios') {
                                RBSheetCalender.current.open();
                              } else {
                                setShowDatePicker(true);
                              }
                              setCalendarType('expStart');
                            }}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingEndDate}
                            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                          </Text>
                          <FormInput
                            labelValue={expEndDate}
                            // onChangeText={text => setName(text)}
                            placeholderText={Translation.profileSettingEndDate}
                            editable={false}
                            keyboardType="email-address"
                            autoCorrect={false}
                            iconType={'calendar'}
                            iconColor={Constant.fontColor}
                            action={true}
                            actionIcon={() => {
                              if (Platform.OS == 'ios') {
                                RBSheetCalender.current.open();
                              } else {
                                setShowDatePicker(true);
                              }
                              setCalendarType('expEnd');
                            }}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingCompany}
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>
                          </Text>
                          <FormInput
                            labelValue={expCompany}
                            onChangeText={text => setExpCompany(text)}
                            placeholderText={
                              Translation.profileSettingCompanyPlaceholder
                            }
                            keyboardType="email-address"
                            autoCorrect={false}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingProjectDetail}
                            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                          </Text>
                          <View style={styles.multilineTextInputView}>
                            <TextInput
                              placeholder={
                                Translation.profileSettingAddDescriptionPlaceholder
                              }
                              multiline
                              value={expDetail}
                              onChangeText={text => setExpDetail(text)}
                              placeholderTextColor={Constant.lightGrayColor}
                              style={styles.multilineTextInput}
                            />
                          </View>
                          <View
                            style={[
                              styles.rowView,
                              {justifyContent: 'flex-end'},
                            ]}>
                            <TouchableOpacity
                              onPress={() =>
                                projectIndex != null
                                  ? addEditExperienceinList()
                                  : addExperienceinList()
                              }
                              style={[
                                styles.smallButton,
                                {
                                  backgroundColor: Constant.blueColor,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.buttonText,
                                  {color: Constant.whiteColor},
                                ]}>
                                {Translation.globalSaveUpdate}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.profileSettingExpDesc}>
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>{' '}
                            {Translation.profileSettingLeaveDateText}
                          </Text>
                        </View>
                      </>
                    )}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={experiences}
                      inverted
                      style={{marginBottom: 10}}
                      keyExtractor={(x, i) => i.toString()}
                      renderItem={({item, index}) => (
                        <View
                          style={[
                            styles.JobDetailAttachmentItemView,
                            {backgroundColor: '#FCFCFC'},
                          ]}>
                          <Text style={styles.JobDetailAttachmentItemText}>
                            {item.title}
                          </Text>
                          <View style={styles.rowView}>
                            <TouchableOpacity
                              onPress={() => editClickExperience(item, index)}>
                              <Feather
                                style={{marginRight: 15}}
                                name={'edit-3'}
                                color={Constant.fontColor}
                                size={20}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => deleteExperience(index)}>
                              <Feather
                                style={{marginRight: 10}}
                                name={'trash-2'}
                                color={Constant.primaryColor}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                  <View style={styles.cardView}>
                    <View
                      style={[
                        styles.rowView,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Text style={styles.inputHeading}>
                        {Translation.profileSettingAddEducation}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEducationForm(!educationForm)}>
                        <Feather
                          name={educationForm ? 'minus' : 'plus'}
                          color={Constant.fontColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    {educationForm && (
                      <>
                        {editEducation && (
                          <View style={styles.profileSettingProjectView}>
                            <View style={{marginLeft: 5, flexDirection: 'row'}}>
                              <Feather
                                style={{marginRight: 10}}
                                name={'edit-3'}
                                color={Constant.fontColor}
                                size={20}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.profileSettingProjectName,
                                  {width: '85%'},
                                ]}>
                                {educations[educationIndex].title}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => cancelEditEducation()}>
                              <Feather
                                style={{marginRight: 10}}
                                name={'x'}
                                color={Constant.fontColor}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                        <View
                          style={[
                            styles.subCardView,
                            {
                              borderRadius: editExperience ? 0 : 10,
                              marginTop: editExperience ? 0 : 10,
                            },
                          ]}>
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingDegree}
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>
                          </Text>
                          <FormInput
                            labelValue={eduTitle}
                            onChangeText={text => setEduTitle(text)}
                            placeholderText={
                              Translation.profileSettingDegreePlaceholder
                            }
                            keyboardType="email-address"
                            autoCorrect={false}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingStartDate}
                          </Text>
                          <FormInput
                            labelValue={eduStartDate}
                            placeholderText={
                              Translation.profileSettingStartDate
                            }
                            keyboardType="email-address"
                            editable={false}
                            autoCorrect={false}
                            iconType={'calendar'}
                            iconColor={Constant.fontColor}
                            action={true}
                            actionIcon={() => {
                              if (Platform.OS == 'ios') {
                                RBSheetCalender.current.open();
                              } else {
                                setShowDatePicker(true);
                              }
                              setCalendarType('eduStart');
                            }}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingEndDate}
                          </Text>
                          <FormInput
                            labelValue={eduEndDate}
                            editable={false}
                            placeholderText={Translation.profileSettingEndDate}
                            keyboardType="email-address"
                            autoCorrect={false}
                            iconType={'calendar'}
                            iconColor={Constant.fontColor}
                            action={true}
                            actionIcon={() => {
                              if (Platform.OS == 'ios') {
                                RBSheetCalender.current.open();
                              } else {
                                setShowDatePicker(true);
                              }
                              setCalendarType('eduEnd');
                            }}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingInstitute}
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>
                          </Text>
                          <FormInput
                            labelValue={eduInstitute}
                            onChangeText={text => setEduInstitute(text)}
                            placeholderText={'Institute title'}
                            keyboardType="email-address"
                            autoCorrect={false}
                          />
                          <Text style={styles.inputHeading}>
                            {Translation.profileSettingProjectDetail}
                            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                          </Text>
                          <View style={styles.multilineTextInputView}>
                            <TextInput
                              placeholder={
                                Translation.profileSettingAddDescriptionPlaceholder
                              }
                              multiline
                              value={eduDetail}
                              onChangeText={text => setEduDetail(text)}
                              placeholderTextColor={Constant.lightGrayColor}
                              style={styles.multilineTextInput}
                            />
                          </View>
                          <View
                            style={[
                              styles.rowView,
                              {justifyContent: 'flex-end'},
                            ]}>
                            <TouchableOpacity
                              onPress={() =>
                                educationIndex != null
                                  ? addEditEducationinList()
                                  : addEducationinList()
                              }
                              style={[
                                styles.smallButton,
                                {
                                  backgroundColor: Constant.blueColor,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.buttonText,
                                  {color: Constant.whiteColor},
                                ]}>
                                {Translation.globalSaveUpdate}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.profileSettingExpDesc}>
                            <Text style={{color: Constant.astaricColor}}>
                              *
                            </Text>{' '}
                            {Translation.profileSettingLeaveDateDegree}
                          </Text>
                        </View>
                      </>
                    )}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={educations}
                      inverted
                      style={{marginBottom: 10}}
                      keyExtractor={(x, i) => i.toString()}
                      renderItem={({item, index}) => (
                        <View
                          style={[
                            styles.JobDetailAttachmentItemView,
                            {backgroundColor: '#FCFCFC'},
                          ]}>
                          <Text style={styles.JobDetailAttachmentItemText}>
                            {item.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() => editClickEducation(item, index)}>
                            <Feather
                              style={{marginRight: 15}}
                              name={'edit-3'}
                              color={Constant.fontColor}
                              size={20}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => deleteEducation(index)}>
                            <Feather
                              style={{marginRight: 10}}
                              name={'trash-2'}
                              color={Constant.primaryColor}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                  <View style={styles.cardView}>
                    <Text style={styles.saveButtonDesc}>
                      {Translation.globalSaveUpdateDesc}{' '}
                      <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                        "{Translation.globalSaveUpdate}"
                      </Text>{' '}
                      {Translation.globalSaveUpdateDescEnd}
                    </Text>
                    <FormButton
                      onPress={() => saveUpdateExpEdu()}
                      buttonTitle={Translation.globalSaveUpdate}
                      backgroundColor={Constant.primaryColor}
                      textColor={Constant.whiteColor}
                      loader={loading}
                    />
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              {selectedSection == 1 && (
                <View style={styles.cardView}>
                  <Text style={styles.inputHeading}>
                    {Translation.profileSettingUploadBrochures}
                  </Text>
                  <View
                    style={[
                      styles.uploadFileView,
                      {
                        backgroundColor: Constant.whiteColor,
                      },
                    ]}>
                    <Image
                      resizeMode="contain"
                      style={styles.uploadFileImage}
                      source={require('../../assets/images/File.png')}
                    />
                    <Text style={styles.uploadFileViewText}>
                      {Translation.globalClickHere}{' '}
                      <Text
                        style={{
                          color: Constant.fontColor,
                        }}>
                        {Translation.globalUpload}
                      </Text>
                    </Text>
                    <FormButton
                      onPress={() => pickBrouchersfromDevice()}
                      buttonTitle={Translation.globalSelectFile}
                      backgroundColor={Constant.greenColor}
                      textColor={Constant.whiteColor}
                    />
                  </View>

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={brouchers}
                    inverted
                    style={{marginBottom: 10}}
                    ListEmptyComponent={
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 200,
                        }}>
                        <Image
                          style={{
                            width: 100,
                            height: 100,
                            marginTop: 20,
                          }}
                          source={require('../../assets/images/noData.png')}
                        />
                        <Text
                          style={[
                            styles.inputHeading,
                            {fontSize: 16, marginTop: 0},
                          ]}>
                          {Translation.globalNoRecordFound}
                        </Text>
                      </View>
                    }
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({item, index}) => (
                      <View
                        style={[
                          styles.profileSettingProjectListView,
                          {paddingVertical: 15},
                        ]}>
                        <View style={{marginLeft: 10, width: '85%'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.profileSettingFAQList,
                              {color: Constant.fontColor, marginBottom: 0},
                            ]}>
                            {item.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.profileSettingFAQList,
                              {fontFamily: Constant.primaryFontRegular},
                            ]}>
                            {Translation.profileSettingFileSize}
                            {item.hasOwnProperty('attachment_id')
                              ? item.size
                              : (item.size / 1024).toFixed(2) + ' KB'}
                          </Text>
                        </View>
                        <Feather
                          onPress={() => deleteBrouchers(index)}
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </View>
                    )}
                  />
                  <Text style={styles.saveButtonDesc}>
                    {Translation.globalSaveUpdateDesc}{' '}
                    <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                      "{Translation.globalSaveUpdate}"
                    </Text>{' '}
                    {Translation.globalSaveUpdateDescEnd}
                  </Text>
                  <FormButton
                    onPress={() => saveUpdateBrouchers()}
                    buttonTitle={Translation.globalSaveUpdate}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                    loader={loading}
                  />
                </View>
              )}
            </>
          )}
          {selectedSection == 2 && (
            <>
              <View style={styles.cardView}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingSocialProfileItems}
                </Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={socialMedia}
                  extraData={refreshList}
                  style={{marginBottom: 10}}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <>
                      <Text style={styles.inputHeading}>{item.title}</Text>
                      <FormInput
                        labelValue={item.social_url}
                        onChangeText={text => {
                          socialMedia[index].social_url = text;
                          setRefreshList(!refreshList);
                        }}
                        placeholderText={item.placeholder}
                        keyboardType="email-address"
                        autoCorrect={false}
                      />
                    </>
                  )}
                />
                <Text style={styles.saveButtonDesc}>
                  {Translation.globalSaveUpdateDesc}{' '}
                  <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                    "{Translation.globalSaveUpdate}"
                  </Text>{' '}
                  {Translation.globalSaveUpdateDescEnd}
                </Text>
                <FormButton
                  onPress={() => saveUpdateSocialProfile()}
                  buttonTitle={Translation.globalSaveUpdate}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loading}
                />
              </View>
            </>
          )}
          {selectedSection == 3 && (
            <>
              <View style={styles.cardView}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingGalleryPhoto}
                </Text>
                <View
                  style={[
                    styles.uploadFileView,
                    {
                      backgroundColor: Constant.whiteColor,
                    },
                  ]}>
                  <Image
                    resizeMode="contain"
                    style={styles.uploadFileImage}
                    source={require('../../assets/images/File.png')}
                  />
                  <Text style={styles.uploadFileViewText}>
                    {Translation.globalClickHere}{' '}
                    <Text
                      style={{
                        color: Constant.fontColor,
                      }}>
                      {Translation.globalUpload}
                    </Text>
                  </Text>
                  <FormButton
                    onPress={() => chooseMultiplePictures()}
                    buttonTitle={Translation.globalSelectFile}
                    backgroundColor={Constant.greenColor}
                    textColor={Constant.whiteColor}
                  />
                </View>
                <FlatList
                  style={{
                    borderRadius: 10,
                    borderColor: Constant.borderColor,
                    borderWidth: gallery.length == 0 ? 0 : 1,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    marginBottom: 15,
                  }}
                  showsVerticalScrollIndicator={false}
                  data={gallery}
                  numColumns={3}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        setSelectedGalleryImage(
                          selectedGalleryImage == index ? null : index,
                        )
                      }
                      style={{
                        flex: 1,
                        marginHorizontal: 3,
                        backgroundColor: '#FCFCFC',
                        borderColor: Constant.borderColor,
                        borderWidth: 1,
                        borderRadius: 10,
                        marginBottom: 10,
                        flexDirection: 'row',
                      }}>
                      <ImageBackground
                        resizeMode="cover"
                        style={{height: 120, width: '100%'}}
                        imageStyle={{
                          borderRadius: 10,
                        }}
                        source={
                          item.hasOwnProperty('attachment_url')
                            ? {uri: item.attachment_url}
                            : {
                                uri:
                                  Platform.OS == 'ios'
                                    ? item.sourceURL
                                    : item.path,
                              }
                        }>
                        {selectedGalleryImage == index && (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 1,
                              borderRadius: 10,
                              backgroundColor: '#00000090',
                            }}>
                            <TouchableOpacity
                              onPress={() => deleteGalleryImage(index)}>
                              <Feather
                                name={'trash-2'}
                                color={Constant.primaryColor}
                                size={22}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </ImageBackground>
                    </TouchableOpacity>
                  )}
                />
                <Text style={styles.saveButtonDesc}>
                  {Translation.globalSaveUpdateDesc}{' '}
                  <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                    "{Translation.globalSaveUpdate}"
                  </Text>{' '}
                  {Translation.globalSaveUpdateDescEnd}
                </Text>
                <FormButton
                  onPress={() => saveUpdateGallery()}
                  buttonTitle={Translation.globalSaveUpdate}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loading}
                />
              </View>
            </>
          )}
          {selectedSection == 4 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingAddYourProjects}
                </Text>
                <TouchableOpacity onPress={() => setProjectForm(!projectForm)}>
                  <Feather
                    name={projectForm ? 'minus' : 'plus'}
                    color={Constant.fontColor}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {projectForm && (
                <>
                  {editProject && (
                    <View style={styles.profileSettingProjectView}>
                      <View style={styles.rowView}>
                        <Image
                          resizeMode="contain"
                          style={styles.profileSettingProjectViewImage}
                          // source={{uri:awards[awardIndex].img_url}}
                          source={
                            projects[projectIndex].hasOwnProperty('image')
                              ? projects[projectIndex].image.show == 'yes'
                                ? {
                                    uri: projects[projectIndex].image.uri,
                                  }
                                : require('../../assets/images/fileType.png')
                              : {uri: projects[projectIndex].img_url}
                          }
                        />
                        <View style={{marginLeft: 15}}>
                          <View style={styles.rowView}>
                            <Text style={styles.profileSettingProjectName}>
                              {projects[projectIndex].title}
                            </Text>
                            <Feather
                              style={{marginLeft: 10}}
                              name={'edit-3'}
                              color={Constant.fontColor}
                              size={16}
                            />
                          </View>
                          <Text style={styles.profileSettingProjectLink}>
                            {projects[projectIndex].link}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => cancelEditProject()}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.subCardView,
                      {
                        borderRadius: editProject ? 0 : 10,
                        marginTop: editProject ? 0 : 10,
                      },
                    ]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingProject}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={projectTitle}
                      onChangeText={text => setProjectTitle(text)}
                      placeholderText={
                        Translation.profileSettingProjectPlaceholder
                      }
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingURL}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={projectURL}
                      onChangeText={text => setProjectURL(text)}
                      placeholderText={Translation.profileSettingURLPlaceholder}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingFileUpload}
                    </Text>
                    <View
                      style={[
                        styles.uploadFileView,
                        {
                          backgroundColor: Constant.whiteColor,
                        },
                      ]}>
                      <Image
                        resizeMode="contain"
                        style={styles.uploadFileImage}
                        source={require('../../assets/images/File.png')}
                      />
                      <Text style={styles.uploadFileViewText}>
                        {Translation.globalClickHere}{' '}
                        <Text
                          style={{
                            color: Constant.fontColor,
                          }}>
                          {Translation.globalUploadPhoto}
                        </Text>
                      </Text>
                      <FormButton
                        onPress={() => pickProjectfromDevice()}
                        buttonTitle={Translation.globalSelectFile}
                        backgroundColor={Constant.greenColor}
                        textColor={Constant.whiteColor}
                      />
                    </View>
                    {projectImage != null && (
                      <View
                        style={[
                          styles.JobDetailAttachmentItemView,
                          {backgroundColor: '#FCFCFC'},
                        ]}>
                        <Text style={styles.JobDetailAttachmentItemText}>
                          {projectImage.hasOwnProperty('file_name')
                            ? projectImage.file_name
                            : projectImage.name}
                        </Text>
                        <TouchableOpacity onPress={() => setProjectImage(null)}>
                          <Feather
                            name={'trash-2'}
                            color={Constant.primaryColor}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() =>
                          projectIndex != null
                            ? addEditProjectinList()
                            : addProjectinList()
                        }
                        style={[
                          styles.smallButton,
                          {
                            backgroundColor: Constant.blueColor,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postServiceAddtoList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={projects}
                inverted
                style={{marginBottom: 10, marginTop: projectForm ? 0 : 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.profileSettingProjectListView}>
                    <View style={styles.rowView}>
                      <Image
                        // resizeMode="contain"
                        style={styles.profileSettingProjectViewImage}
                        source={
                          item.hasOwnProperty('image')
                            ? item.image.show == 'yes'
                              ? {
                                  uri: item.image.uri,
                                }
                              : require('../../assets/images/fileType.png')
                            : item.img_url != ''
                            ? {uri: item.img_url}
                            : require('../../assets/images/NoImage.png')
                        }
                      />
                      <View style={{marginLeft: 15}}>
                        <Text style={styles.profileSettingProjectName}>
                          {item.title}
                        </Text>
                        <Text style={styles.profileSettingProjectLink}>
                          {item.link}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowView}>
                      <TouchableOpacity
                        onPress={() => editClickProject(item, index)}>
                        <Feather
                          style={{marginRight: 15}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteProject(index)}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'trash-2'}
                          color={Constant.primaryColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateProject()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {selectedSection == 5 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingAwardCertifications}
                </Text>
                <TouchableOpacity onPress={() => setAwardForm(!awardForm)}>
                  <Feather
                    name={awardForm ? 'minus' : 'plus'}
                    color={Constant.fontColor}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {awardForm && (
                <>
                  {editAward && (
                    <View style={styles.profileSettingProjectView}>
                      <View style={styles.rowView}>
                        <Image
                          resizeMode="contain"
                          style={styles.profileSettingProjectViewImage}
                          // source={{uri:awards[awardIndex].img_url}}
                          source={
                            awards[awardIndex].hasOwnProperty('image')
                              ? awards[awardIndex].image.show == 'yes'
                                ? {
                                    uri: awards[awardIndex].image.uri,
                                  }
                                : require('../../assets/images/fileType.png')
                              : {uri: awards[awardIndex].img_url}
                          }
                        />
                        <View style={{marginLeft: 15}}>
                          <View style={styles.rowView}>
                            <Text style={styles.profileSettingProjectName}>
                              {awards[awardIndex].title}
                            </Text>
                            <Feather
                              style={{marginLeft: 10}}
                              name={'edit-3'}
                              color={Constant.fontColor}
                              size={16}
                            />
                          </View>

                          <Text style={styles.profileSettingProjectLink}>
                            {awards[awardIndex].date}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => cancelEditAward()}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.subCardView,
                      {
                        borderRadius: editAward ? 0 : 10,
                        marginTop: editAward ? 0 : 10,
                      },
                    ]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingAwardTitle}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={awardTitle}
                      onChangeText={text => setAwardTitle(text)}
                      placeholderText={Translation.profileSettingAwardTitle}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingAwardDate}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={displayDate}
                      editable={true}
                      placeholderText={Translation.profileSettingSelectDate}
                      keyboardType="email-address"
                      autoCorrect={false}
                      iconType={'calendar'}
                      action={true}
                      actionIcon={() => {
                        if (Platform.OS == 'ios') {
                          RBSheetCalender.current.open();
                        } else {
                          setShowDatePicker(true);
                        }
                        setCalendarType('award');
                      }}
                      iconColor={Constant.lightGrayColor}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingUploadPhoto}
                    </Text>
                    <View
                      style={[
                        styles.uploadFileView,
                        {
                          backgroundColor: Constant.whiteColor,
                        },
                      ]}>
                      <Image
                        resizeMode="contain"
                        style={styles.uploadFileImage}
                        source={require('../../assets/images/File.png')}
                      />
                      <Text style={styles.uploadFileViewText}>
                        {Translation.globalClickHere}{' '}
                        <Text
                          style={{
                            color: Constant.fontColor,
                          }}>
                          {Translation.globalUploadPhoto}
                        </Text>
                      </Text>
                      <FormButton
                        onPress={() => pickAwardsfromDevice()}
                        buttonTitle={Translation.globalSelectFile}
                        backgroundColor={Constant.greenColor}
                        textColor={Constant.whiteColor}
                      />
                    </View>
                    {awardImage != null && (
                      <View
                        style={[
                          styles.JobDetailAttachmentItemView,
                          {backgroundColor: '#FCFCFC'},
                        ]}>
                        <Text style={styles.JobDetailAttachmentItemText}>
                          {awardImage.hasOwnProperty('file_name')
                            ? awardImage.file_name
                            : awardImage.name}
                        </Text>
                        <TouchableOpacity onPress={() => setAwardImage(null)}>
                          <Feather
                            name={'trash-2'}
                            color={Constant.primaryColor}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() =>
                          awardIndex != null
                            ? addEditAwardinList()
                            : addAwardinList()
                        }
                        style={[
                          styles.smallButton,
                          {
                            backgroundColor: Constant.blueColor,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postServiceAddtoList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={awards}
                inverted
                style={{marginBottom: 10, marginTop: awardForm ? 0 : 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.profileSettingProjectListView}>
                    <View style={styles.rowView}>
                      <Image
                        // resizeMode="contain"
                        style={styles.profileSettingProjectViewImage}
                        source={
                          item.hasOwnProperty('image')
                            ? item.image.show == 'yes'
                              ? {
                                  uri: item.image.uri,
                                }
                              : require('../../assets/images/fileType.png')
                              
                            : {uri: item.img_url}
                        }
                      />
                      <View style={{marginLeft: 15}}>
                        <Text style={styles.profileSettingProjectName}>
                          {item.title}
                        </Text>
                        <Text style={styles.profileSettingProjectLink}>
                          {item.hasOwnProperty('image')
                            ? item.displayDate
                            : item.date}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowView}>
                      <TouchableOpacity
                        onPress={() => editClickAward(item, index)}>
                        <Feather
                          style={{marginRight: 15}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteAward(index)}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'trash-2'}
                          color={Constant.primaryColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateAward()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {selectedSection == 6 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingAddYourVideos}
                </Text>
                {/* <Feather name={'plus'} color={Constant.fontColor} size={22} /> */}
              </View>
              <View style={styles.subCardView}>
                <View style={styles.rowView}>
                  <View style={{width: '85%'}}>
                    <FormInput
                      labelValue={URL}
                      onChangeText={text => setURL(text)}
                      placeholderText={Translation.profileSettingVideoURL}
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => addURLVideos()}
                    style={{
                      width: '17%',
                      marginLeft: -5,
                      marginTop: 5,
                      marginBottom: 10,
                      height: 50,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      backgroundColor: Constant.blueColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Feather
                      name={'plus'}
                      color={Constant.whiteColor}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={videosURL}
                  inverted
                  style={{marginBottom: 10}}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <FormInput
                      labelValue={item}
                      placeholderText={Translation.profileSettingVideoURL}
                      keyboardType="email-address"
                      autoCorrect={false}
                      iconType={'trash-2'}
                      iconColor={Constant.primaryColor}
                      action={true}
                      actionIcon={() => deleteURL(index)}
                    />
                  )}
                />
              </View>
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateVideosURL()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {selectedSection == 7 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingSpecializations}
                </Text>
                <TouchableOpacity
                  onPress={() => setSpecializationForm(!specializationForm)}>
                  <Feather
                    name={specializationForm ? 'minus' : 'plus'}
                    color={Constant.fontColor}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {specializationForm && (
                <>
                  {editSpecialization && (
                    <View style={styles.profileSettingProjectView}>
                      <View style={{marginLeft: 10}}>
                        <View style={styles.rowView}>
                          <Feather
                            style={{marginRight: 10}}
                            name={'edit-3'}
                            color={Constant.fontColor}
                            size={16}
                          />
                          <Text style={styles.profileSettingProjectName}>
                            {specialization[specializationIndex].title}
                          </Text>
                        </View>
                        <Text style={styles.profileSettingProjectLink}>
                          {' '}
                          {specialization[specializationIndex].val}%
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => cancelEditSpecialization()}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.subCardView,
                      {
                        borderRadius: editSpecialization ? 0 : 10,
                        marginTop: editSpecialization ? 0 : 10,
                      },
                    ]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingSelectCategory}
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
                      open={openSpecialization}
                      value={specializationValue}
                      placeholder={Translation.profileSettingSelectCategory}
                      searchPlaceholder={Translation.globalSearchHere}
                      items={specializationItems}
                      searchable={true}
                      setOpen={setOpenSpecialization}
                      setValue={setSpecializationValue}
                      setItems={setSpecializationItems}
                      listMode="MODAL"
                      theme="LIGHT"
                      multiple={false}
                      mode="BADGE"
                      zIndexInverse={100}
                      disableBorderRadius={true}
                      badgeDotColors={['#e76f51']}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingAddPercentage}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={specializationPercentage}
                      onChangeText={text => setSpecializationPercentage(text)}
                      placeholderText={
                        Translation.profileSettingAddPercentagePlacholder
                      }
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() =>
                          specializationIndex != null
                            ? addEditSpecializationinList()
                            : addSpecializationinList()
                        }
                        style={[
                          styles.smallButton,
                          {backgroundColor: Constant.blueColor},
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postServiceAddtoList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={specialization}
                inverted
                style={{
                  marginBottom: 10,
                  marginTop: specializationForm ? 0 : 10,
                }}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.profileSettingProjectListView}>
                    <View style={{marginLeft: 10}}>
                      <Text style={styles.profileSettingProjectName}>
                        {item.title}
                      </Text>
                      <Text style={styles.profileSettingProjectLink}>
                        {item.val}%
                      </Text>
                    </View>
                    <View style={styles.rowView}>
                      <TouchableOpacity
                        onPress={() => editClickSpecialization(item, index)}>
                        <Feather
                          style={{marginRight: 15}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteSpecialization(index)}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'trash-2'}
                          color={Constant.primaryColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateSpecialization()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {selectedSection == 8 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingYourIndustrialExperience}
                </Text>
                <TouchableOpacity
                  onPress={() => setIndustrialForm(!industrialForm)}>
                  <Feather
                    name={industrialForm ? 'minus' : 'plus'}
                    color={Constant.fontColor}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {industrialForm && (
                <>
                  {editIndustrial && (
                    <View style={styles.profileSettingProjectView}>
                      <View style={{marginLeft: 10}}>
                        <View style={styles.rowView}>
                          <Feather
                            style={{marginRight: 10}}
                            name={'edit-3'}
                            color={Constant.fontColor}
                            size={16}
                          />
                          <Text style={styles.profileSettingProjectName}>
                            {industrialExp[industrialIndex].title}
                          </Text>
                        </View>
                        <Text style={styles.profileSettingProjectLink}>
                          {' '}
                          {industrialExp[industrialIndex].val}%
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => cancelEditIndustrialExp()}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.subCardView,
                      {
                        borderRadius: editIndustrial ? 0 : 10,
                        marginTop: editIndustrial ? 0 : 10,
                      },
                    ]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingSelectCategory}
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
                      open={openIndustrialExp}
                      value={industrialExpValue}
                      placeholder={Translation.profileSettingSelectCategory}
                      searchPlaceholder={Translation.globalSearchHere}
                      items={industrialExpItems}
                      searchable={true}
                      setOpen={setOpenIndustrialExp}
                      setValue={setIndustrialExpValue}
                      setItems={setIndustrialExpItems}
                      listMode="MODAL"
                      theme="LIGHT"
                      multiple={false}
                      mode="BADGE"
                      zIndexInverse={100}
                      disableBorderRadius={true}
                      badgeDotColors={['#e76f51']}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingAddPercentage}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={industrialPercentage}
                      onChangeText={text => setIndustrialPercentage(text)}
                      placeholderText={
                        Translation.profileSettingAddPercentagePlacholder
                      }
                      keyboardType="numeric"
                      autoCorrect={false}
                      maxLength={5}
                    />
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() =>
                          industrialIndex != null
                            ? addEditIndustrialExpinList()
                            : addIndustrialExpinList()
                        }
                        style={[
                          styles.smallButton,
                          {backgroundColor: Constant.blueColor},
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postServiceAddtoList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={industrialExp}
                inverted
                style={{marginBottom: 10, marginTop: industrialForm ? 0 : 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.profileSettingProjectListView}>
                    <View style={{marginLeft: 10}}>
                      <Text style={styles.profileSettingProjectName}>
                        {decode(item.title)}
                      </Text>
                      <Text style={styles.profileSettingProjectLink}>
                        {item.val}%
                      </Text>
                    </View>
                    <View style={styles.rowView}>
                      <TouchableOpacity
                        onPress={() => editIndustrialExp(item, index)}>
                        <Feather
                          style={{marginRight: 15}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteIndustrialExp(index)}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'trash-2'}
                          color={Constant.primaryColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateIndustrialExp()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
          {selectedSection == 9 && (
            <View style={styles.cardView}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.profileSettingFAQlist}
                </Text>
                <TouchableOpacity onPress={() => setFaqsForm(!faqsForm)}>
                  <Feather
                    name={faqsForm ? 'minus' : 'plus'}
                    color={Constant.fontColor}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {faqsForm && (
                <>
                  {editFaq && (
                    <View style={styles.profileSettingProjectView}>
                      <View style={{marginLeft: 5, flexDirection: 'row'}}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'edit-3'}
                          color={Constant.fontColor}
                          size={20}
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.profileSettingProjectName,
                            {width: '85%'},
                          ]}>
                          {faqs[faqIndex].faq_question}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => cancelEditFaq()}>
                        <Feather
                          style={{marginRight: 10}}
                          name={'x'}
                          color={Constant.fontColor}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.subCardView,
                      {
                        borderRadius: editFaq ? 0 : 10,
                        marginTop: editFaq ? 0 : 10,
                      },
                    ]}>
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingQuestion}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <FormInput
                      labelValue={question}
                      onChangeText={text => setQuestion(text)}
                      placeholderText={
                        Translation.profileSettingQuestionPlaceholder
                      }
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHeading}>
                      {Translation.profileSettingAnswer}
                      <Text style={{color: Constant.astaricColor}}>*</Text>
                    </Text>
                    <View style={styles.multilineTextInputView}>
                      <TextInput
                        placeholder={
                          Translation.profileSettingAnswerPlaceholder
                        }
                        multiline
                        value={answer}
                        onChangeText={text => setAnswer(text)}
                        placeholderTextColor={Constant.lightGrayColor}
                        style={styles.multilineTextInput}
                      />
                    </View>
                    <View
                      style={[styles.rowView, {justifyContent: 'flex-end'}]}>
                      <TouchableOpacity
                        onPress={() =>
                          faqIndex != null
                            ? addEditFAQsinList()
                            : addFAQsinList()
                        }
                        style={[
                          styles.smallButton,
                          {backgroundColor: Constant.blueColor},
                        ]}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: Constant.whiteColor},
                          ]}>
                          {Translation.postServiceAddtoList}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={faqs}
                inverted
                style={{marginBottom: 10}}
                extraData={refreshList}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.profileSettingProjectListView}>
                    <View style={{marginLeft: 10, width: '80%'}}>
                      <Text
                        numberOfLines={1}
                        style={styles.profileSettingFAQList}>
                        {item.faq_question}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => editFAQs(item, index)}>
                      <Feather
                        style={{marginRight: 15}}
                        name={'edit-3'}
                        color={Constant.fontColor}
                        size={20}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFAQs(index)}>
                      <Feather
                        style={{marginRight: 10}}
                        name={'trash-2'}
                        color={Constant.primaryColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <Text style={styles.saveButtonDesc}>
                {Translation.globalSaveUpdateDesc}{' '}
                <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
                  "{Translation.globalSaveUpdate}"
                </Text>{' '}
                {Translation.globalSaveUpdateDescEnd}
              </Text>
              <FormButton
                onPress={() => saveUpdateFaqs()}
                buttonTitle={Translation.globalSaveUpdate}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </View>
          )}
        </ScrollView>
      )}
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
              {Translation.profileSettingPickDate}
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

export default ProfileSetting;
