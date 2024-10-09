import {
  View,
  Text,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import * as Constant from '../constants/globalConstant';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import Notification from '../components/Notification';
import {BallIndicator} from 'react-native-indicators';
import {
  updateProjectTab,
  updateJobTab,
  updateServiceTab,
} from '../redux/GlobalStateSlice';
import {
  updateToken,
  updateUserInfo,
  updateProfileInfo,
  updateProfileImage,
  updateProfileBannerImage,
  updateProfileName,
  updateVerified,
  updateBilling,
  updateShipping,
} from '../redux/AuthSlice';
import Translation from '../constants/Translation';

const customDrawer = ({navigation}) => {
  const token = useSelector(state => state.value.token);
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileImage = useSelector(state => state.value.profileImage);
  const bannerImage = useSelector(state => state.value.profileBannerImage);
  const profileName = useSelector(state => state.value.profileName);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const isVerified = useSelector(state => state.value.verified);

  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [openTab, setopenTab] = useState('');
  function isObjectEmpty(object) {
    var isEmpty = true;
    for (keys in object) {
      isEmpty = false;
      break;
    }
    return isEmpty;
  }
  var isEmpty = isObjectEmpty(profileInfo);
  const logout = () => {
    dispatch(updateToken(null));
    dispatch(updateUserInfo({}));
    dispatch(updateProfileInfo({}));
    dispatch(updateBilling({}));
    dispatch(updateShipping({}));
    dispatch(updateProfileImage(''));
    dispatch(updateProfileBannerImage(''));
    dispatch(updateProfileName(''));
    dispatch(updateVerified(''));
    // navigation.navigate('Login');
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const switchAccount = () => {
    setLoading(true);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token.authToken,
    };
    axios
      .post(
        Constant.BaseUrl + 'switch_user/switch_user_account',
        {
          user_id: userInfo.id,
        },
        {
          headers: headers,
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          dispatch(updateToken(response.data.authToken));
          dispatch(updateUserInfo(response.data.profile.umeta));
          dispatch(updateProfileInfo(response.data.profile.pmeta));
          dispatch(updateBilling(response.data.profile.billing));
          dispatch(updateShipping(response.data.profile.shipping));
          dispatch(updateProfileImage(response.data.profile.pmeta.profile_img));
          dispatch(
            updateProfileBannerImage(response.data.profile.pmeta.banner_img),
          );
          dispatch(updateProfileName(response.data.profile.pmeta.full_name));
          dispatch(updateVerified(response.data.profile.pmeta._is_verified));
          navigation.navigate('Home');
          setLoading(false);
        } else if (response.data.type == 'error') {
          setLoading(false);
          setShowAlert(true);
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
  const getSingleEmployer = async () => {
    setLoadingProfile(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_employers?listing_type=single' +
        '&profile_id=' +
        userInfo.profile_id,
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
          navigation.navigate('EmployerDetail', {
            item: responseJson.employers[0],
          });
        }
        setLoadingProfile(false);
      })
      .catch(error => {
        setLoadingProfile(false);
        console.error(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const getSingleFreelancer = async () => {
    setLoadingProfile(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=single' +
        '&profile_id=' +
        userInfo.id,
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
  const openGuppy = () => {
    // let url = 'guppy://';
    // Linking.openURL(url)
    //   .then(data => {})
    //   .catch(() => {
    //     if (Platform.OS == 'ios') {
    //       Linking.openURL('https://apps.apple.com/app/wp-guppy/id1592264186');
    //     } else {
    //       Linking.openURL(
    //         'https://play.google.com/store/apps/details?id=com.guppy',
    //       );
    //     }
    //   });
    setShowAlert(true);
    setType("error");
    setTitle(Translation.globalOops);
    setDesc("You have enabled guppy so you have to buy WP Guppy Messenger - React Native Messenger APP for WP Guppy and setup with your app");
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
      {!isEmpty ? (
        <ImageBackground
          resizeMode="cover"
          style={styles.drawerImageBackgeoundStyle}
          source={
            bannerImage != ''
              ? {uri: bannerImage}
              : require('../../assets/images/NoImage.png')
          }>
          <View style={styles.drawerHeaderParentContentStyle}>
            <View
              style={[
                styles.servisListImageParentStyle,
                {backgroundColor: '#ffffff40', marginTop: 8},
              ]}>
              <Image
                resizeMode="contain"
                style={styles.serviceListImageStyle}
                source={
                  profileImage != ''
                    ? {uri: profileImage}
                    : require('../../assets/images/NoImage.png')
                }
              />
            </View>
            <Text style={styles.drawerNameStyle}>{profileName}</Text>
            <Text style={[styles.serviceListCardNameStyle, {color: '#EAB308'}]}>
              {profileInfo._tag_line}
            </Text>
            {settings.user_meta.access_type.job_access == 'yes' &&
              profileInfo.user_type == 'employer' && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ManageJobs');
                    dispatch(updateJobTab(0));
                  }}
                  style={styles.drawerPostButtonStyle}>
                  <Text style={styles.drawerPostButtonTextStyle}>
                    {Translation.customDrawerJob}
                  </Text>
                </TouchableOpacity>
              )}
            {settings.user_meta.access_type.service_access == 'yes' &&
              profileInfo.user_type == 'freelancer' && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ManageServices');
                    dispatch(updateServiceTab(0));
                  }}
                  style={styles.drawerPostButtonStyle}>
                  <Text style={styles.drawerPostButtonTextStyle}>
                    {Translation.customDrawerService}
                  </Text>
                </TouchableOpacity>
              )}
            {settings.switch_account == 'yes' && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => switchAccount()}
                style={{
                  backgroundColor: Constant.grayColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  width: '100%',
                  padding: 7,
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <Text
                  style={[
                    styles.drawerPostButtonTextStyle,
                    {color: '#484848'},
                  ]}>
                  {profileInfo.user_type == 'employer'
                    ? Translation.customDrawerFreelancer
                    : Translation.customDrawerEmployer}
                </Text>
                {loading == true ? (
                  <View>
                    <BallIndicator color={Constant.iconColor} size={14} />
                  </View>
                ) : (
                  <Feather name={'user'} size={18} color={Constant.iconColor} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      ) : (
        <View
          style={{
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            height: 120,
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: 150,
              height: 120,
            }}
            source={require('../../assets/images/Logo.png')}
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:Constant.whiteColor}}>
        {!isEmpty && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('DashboardTab')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'home'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerHome}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'sliders'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerDashboard}
              </Text>
            </TouchableOpacity>
            {(settings.chat_settings.gadget == 'chat' ||
              settings.chat_settings.gadget == 'inbox' ||
              settings.chat_settings.gadget == 'guppy') && (
              <TouchableOpacity
                onPress={() =>
                  settings.chat_settings.gadget == 'guppy'
                    ? openGuppy()
                    : navigation.navigate('Inbox')
                }
                style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
                <Feather name={'message-square'} size={18} color={Constant.iconColor} />
                <Text style={styles.drawerItemTextStyle}>
                  {Translation.customDrawerInbox}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() =>
                profileInfo.user_type == 'freelancer'
                  ? getSingleFreelancer()
                  : getSingleEmployer()
              }
              style={[
                styles.drawerItemParentStyle,
                styles.drawerAddonStyle,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather name={'monitor'} size={18} color={Constant.iconColor} />
                <Text style={styles.drawerItemTextStyle}>
                  {Translation.customDrawerProfile}
                </Text>
              </View>
              {loadingProfile && (
                <View style={{marginRight: 5, alignItems: 'flex-end'}}>
                  <BallIndicator color={Constant.fontColor} size={14} />
                </View>
              )}
            </TouchableOpacity>

            {profileInfo.user_type == 'freelancer' ? (
              <>
                {settings.identity_verification == 'yes' && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('IdentityVerification')}
                    style={[
                      styles.drawerItemParentStyle,
                      styles.drawerAddonParentStyle,
                    ]}>
                    <View style={styles.drawerDropdownItemParentStyle}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Feather
                          name={'check-square'}
                          size={18}
                          color={Constant.iconColor}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerIdentity}
                        </Text>
                      </View>
                      <View
                        style={{
                          padding: 3,
                          backgroundColor:
                            isVerified == 'yes' ? '#22C55E30' : '#F9731660',
                          borderRadius: 25,
                        }}>
                        <Feather
                          name={isVerified == 'yes' ? 'check' : 'x'}
                          size={13}
                          color={isVerified == 'yes' ? '#22C55E' : '#F97316'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {settings.employer_identity_verification == 'yes' && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('IdentityVerification')}
                    style={[
                      styles.drawerItemParentStyle,
                      styles.drawerAddonParentStyle,
                    ]}>
                    <View style={styles.drawerDropdownItemParentStyle}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Feather
                          name={'check-square'}
                          size={18}
                          color={Constant.iconColor}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerIdentity}
                        </Text>
                      </View>
                      <View
                        style={{
                          padding: 3,
                          backgroundColor:
                            isVerified == 'yes' ? '#22C55E30' : '#F9731660',
                          borderRadius: 25,
                        }}>
                        <Feather
                          name={isVerified == 'yes' ? 'check' : 'x'}
                          size={13}
                          color={isVerified == 'yes' ? '#22C55E' : '#F97316'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}

            <TouchableOpacity
              style={[
                styles.drawerItemParentStyle,
                styles.drawerAddonParentStyle,
              ]}
              activeOpacity={0.9}
              onPress={() => setopenTab(openTab == 'setting' ? '' : 'setting')}>
              <View style={styles.drawerDropdownItemParentStyle}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Feather name={'settings'} size={18} color={Constant.iconColor} />
                  <Text style={styles.drawerItemTextStyle}>Settings</Text>
                </View>
                <Feather
                  name={openTab == 'setting' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Constant.iconColor}
                />
              </View>
              {openTab == 'setting' && (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfile')}
                    style={[
                      styles.drawerItemParentStyle,
                      {
                        alignItems: 'center',
                        paddingHorizontal: 6,
                      },
                    ]}>
                    <Feather
                      name={'corner-down-right'}
                      size={14}
                      color={'#00000040'}
                    />
                    <Text style={styles.drawerItemTextStyle}>
                      {Translation.customDrawerEdit}
                    </Text>
                  </TouchableOpacity>
                  {profileInfo.user_type == 'freelancer' && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PayoutSettings')}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerPayout}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AccountSettings')}
                    style={[
                      styles.drawerItemParentStyle,
                      styles.drawerChildItemAddonStyle,
                    ]}>
                    <Feather
                      name={'corner-down-right'}
                      size={14}
                      color={'#00000040'}
                    />
                    <Text style={styles.drawerItemTextStyle}>
                      {Translation.customDrawerAccount}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>

            {profileInfo.user_type == 'freelancer' && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setopenTab(openTab == 'portfolio' ? '' : 'portfolio')
                }
                style={[
                  styles.drawerItemParentStyle,
                  styles.drawerAddonParentStyle,
                ]}>
                <View style={styles.drawerDropdownItemParentStyle}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name={'edit'} size={18} color={Constant.iconColor} />
                    <Text style={styles.drawerItemTextStyle}>
                      {Translation.customDrawerPortfolios}
                    </Text>
                  </View>
                  <Feather
                    name={
                      openTab == 'portfolio' ? 'chevron-up' : 'chevron-down'
                    }
                    size={18}
                    color={Constant.iconColor}
                  />
                </View>
                {openTab == 'portfolio' && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddPortfolios', {data: null})
                      }
                      style={[
                        styles.drawerItemParentStyle,
                        {
                          alignItems: 'center',
                          paddingHorizontal: 6,
                        },
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerAddPortfolio}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PortfoliosLisiting')}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerPortfoliolisitngs}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>
            )}

            {profileInfo.user_type == 'freelancer' &&
              settings.user_meta.access_type.job_access == 'yes' && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    setopenTab(openTab == 'project' ? '' : 'project')
                  }
                  style={[
                    styles.drawerItemParentStyle,
                    styles.drawerAddonParentStyle,
                  ]}>
                  <View style={styles.drawerDropdownItemParentStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Feather
                        name={'shopping-bag'}
                        size={18}
                        color={Constant.iconColor}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerManageProjects}
                      </Text>
                    </View>
                    <Feather
                      name={
                        openTab == 'project' ? 'chevron-up' : 'chevron-down'
                      }
                      size={18}
                      color={Constant.iconColor}
                    />
                  </View>
                  {openTab == 'project' && (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageProjects');
                          dispatch(updateProjectTab(0));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          {
                            alignItems: 'center',
                            paddingHorizontal: 6,
                          },
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerProposals}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageProjects');
                          dispatch(updateProjectTab(1));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerOngoingProjects}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageProjects');
                          dispatch(updateProjectTab(2));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerCompleted}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageProjects');
                          dispatch(updateProjectTab(3));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerCancelled}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </TouchableOpacity>
              )}

            {profileInfo.user_type == 'employer' &&
              settings.user_meta.access_type.job_access == 'yes' && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setopenTab(openTab == 'job' ? '' : 'job')}
                  style={[
                    styles.drawerItemParentStyle,
                    styles.drawerAddonParentStyle,
                  ]}>
                  <View style={styles.drawerDropdownItemParentStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Feather
                        name={'shopping-bag'}
                        size={18}
                        color={Constant.iconColor}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerManagejobs}
                      </Text>
                    </View>
                    <Feather
                      name={openTab == 'job' ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Constant.iconColor}
                    />
                  </View>
                  {openTab == 'job' && (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageJobs');
                          dispatch(updateJobTab(0));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          {
                            alignItems: 'center',
                            paddingHorizontal: 6,
                          },
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerJob}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageJobs');
                          dispatch(updateJobTab(1));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerPostedjobs}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageJobs');
                          dispatch(updateJobTab(2));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerOngoingJobs}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageJobs');
                          dispatch(updateJobTab(3));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerCompletedJobs}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ManageJobs');
                          dispatch(updateJobTab(4));
                        }}
                        style={[
                          styles.drawerItemParentStyle,
                          styles.drawerChildItemAddonStyle,
                        ]}>
                        <Feather
                          name={'corner-down-right'}
                          size={14}
                          color={'#00000040'}
                        />
                        <Text style={styles.drawerItemTextStyle}>
                          {Translation.customDrawerCancelledJobs}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </TouchableOpacity>
              )}

            {settings.user_meta.access_type.service_access == 'yes' && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setopenTab(openTab == 'service' ? '' : 'service')
                }
                style={[
                  styles.drawerItemParentStyle,
                  styles.drawerAddonParentStyle,
                ]}>
                <View style={styles.drawerDropdownItemParentStyle}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name={'edit'} size={18} color={Constant.iconColor} />
                    <Text style={styles.drawerItemTextStyle}>
                      {Translation.customDrawerManageServices}
                    </Text>
                  </View>
                  <Feather
                    name={openTab == 'service' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Constant.iconColor}
                  />
                </View>
                {openTab == 'service' && (
                  <>
                    {profileInfo.user_type == 'freelancer' && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ManageServices');
                            dispatch(updateServiceTab(0));
                          }}
                          style={[
                            styles.drawerItemParentStyle,
                            {
                              alignItems: 'center',
                              paddingHorizontal: 6,
                            },
                          ]}>
                          <Feather
                            name={'corner-down-right'}
                            size={14}
                            color={'#00000040'}
                          />
                          <Text style={styles.drawerItemTextStyle}>
                            {Translation.customDrawerPostService}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ManageServices');
                            dispatch(updateServiceTab(1));
                          }}
                          style={[
                            styles.drawerItemParentStyle,
                            styles.drawerChildItemAddonStyle,
                          ]}>
                          <Feather
                            name={'corner-down-right'}
                            size={14}
                            color={'#00000040'}
                          />
                          <Text style={styles.drawerItemTextStyle}>
                            {Translation.customDrawerSendQuote}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ManageServices');
                        dispatch(updateServiceTab(2));
                      }}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                        {
                          marginTop:
                            profileInfo.user_type == 'freelancer' ? 0 : 10,
                        },
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerQuoteListings}
                      </Text>
                    </TouchableOpacity>
                    {profileInfo.user_type == 'freelancer' && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ManageServices');
                            dispatch(updateServiceTab(3));
                          }}
                          style={[
                            styles.drawerItemParentStyle,
                            styles.drawerChildItemAddonStyle,
                          ]}>
                          <Feather
                            name={'corner-down-right'}
                            size={14}
                            color={'#00000040'}
                          />
                          <Text style={styles.drawerItemTextStyle}>
                            {Translation.customDrawerPostedServices}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ManageServices');
                            dispatch(updateServiceTab(4));
                          }}
                          style={[
                            styles.drawerItemParentStyle,
                            styles.drawerChildItemAddonStyle,
                          ]}>
                          <Feather
                            name={'corner-down-right'}
                            size={14}
                            color={'#00000040'}
                          />
                          <Text style={styles.drawerItemTextStyle}>
                            {Translation.customDrawerAddonsServices}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ManageServices');
                        dispatch(updateServiceTab(5));
                      }}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerOngoingServices}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ManageServices');
                        dispatch(updateServiceTab(6));
                      }}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerCompletedServices}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ManageServices');
                        dispatch(updateServiceTab(7));
                      }}
                      style={[
                        styles.drawerItemParentStyle,
                        styles.drawerChildItemAddonStyle,
                      ]}>
                      <Feather
                        name={'corner-down-right'}
                        size={14}
                        color={'#00000040'}
                      />
                      <Text style={styles.drawerItemTextStyle}>
                        {Translation.customDrawerCancelledServices}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>
            )}

            {settings.remove_saved == 'no' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('SavedItem')}
                style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
                <Feather name={'heart'} size={18} color={Constant.iconColor} />
                <Text style={styles.drawerItemTextStyle}>
                  {Translation.customDrawerSavedItems}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('InvoiceList')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'file'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerInvoices}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Dispute')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'shield'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerDisputes}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {isEmpty && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'log-in'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.globalLogin}
              </Text>
            </TouchableOpacity>

            {settings.registration_option == 'enable' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
                <Feather name={'book'} size={18} color={Constant.iconColor} />
                <Text style={styles.drawerItemTextStyle}>
                  {Translation.customDrawerSignup}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {settings.help_support.gadget == 'enable' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('HelpAndSupport')}
            style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
            <Feather name={'headphones'} size={18} color={Constant.iconColor} />
            <Text style={styles.drawerItemTextStyle}>
              {Translation.customDrawerHelp}
            </Text>
          </TouchableOpacity>
        )}

        {!isEmpty && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('PricePlan')}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'box'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerPackages}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => logout()}
              style={[styles.drawerItemParentStyle, styles.drawerAddonStyle]}>
              <Feather name={'power'} size={18} color={Constant.iconColor} />
              <Text style={styles.drawerItemTextStyle}>
                {Translation.customDrawerLogout}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default customDrawer;
