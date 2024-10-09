import {
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Notification from '../components/Notification';
import Header from '../components/Header';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import {decode} from 'html-entities';
import CountDown from 'react-native-countdown-component';
import styles from '../styles/Style';
import {
  updateProjectTab,
  updateJobTab,
  updateServiceTab,
} from '../redux/GlobalStateSlice';
import Translation from '../constants/Translation';

const Dashboard = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [DashboardData, setDashboardData] = useState({});
  const [loader, setLoader] = useState(false);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [countDownId, setCountDownId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isFocused) {
      if (profileInfo.user_type == 'freelancer') {
        getFreelancerDashboardData();
      } else {
        getEmployerDashboardData();
      }
    }
  }, [isFocused]);
  const getFreelancerDashboardData = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_freelancer_insights?user_id=' +
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
        setDashboardData(responseJson);
        setLoader(false);
        // var t1 = new Date();
        // var utc = t1.getTime() + t1.getTimezoneOffset() * 60000;
        // var nd = new Date(
        //   utc + 3600000 * parseInt(responseJson.timezone.gmt_offset),
        // );
        // var t2 = new Date(responseJson.expiry_string);
        // var dif = (t2.getTime() - nd.getTime()) / 1000;
        // console.log("number",Math.trunc(dif))
        // setCountDown(Math.trunc(dif));
        // const id = new Date().getTime().toString()
        // setCountDownId(id)
        // setRefreshFlatList(!refreshFlatList)
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const getEmployerDashboardData = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_employer_insights?user_id=' +
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
        setDashboardData(responseJson);
        setLoader(false);
        // var t1 = new Date();
        // var utc = t1.getTime() + t1.getTimezoneOffset() * 60000;
        // var nd = new Date(
        //   utc + 3600000 * parseInt(responseJson.timezone.gmt_offset),
        // );
        // var t2 = new Date(responseJson.expiry_string);
        // var dif = (t2.getTime() - nd.getTime()) / 1000;
        // setCountDown(Math.trunc(dif));
        // const id = new Date().getTime().toString()
        // setCountDownId(id)
        // setRefreshFlatList(!refreshFlatList)
      })
      .catch(error => {
        setLoader(false);
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
    setType('error');
    setTitle(Translation.globalOops);
    setDesc(
      'You have enabled guppy so you have to buy WP Guppy Messenger - React Native Messenger APP for WP Guppy and setup with your app',
    );
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={'Dashboard'}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <TouchableOpacity
              onPress={() =>
                settings.chat_settings.gadget == 'guppy'
                  ? openGuppy()
                  : navigation.navigate('Inbox', {backButton: true})
              }
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingBottom: 20,
                paddingTop: 14,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor:
                    DashboardData.unread_messages != '0'
                      ? Constant.primaryColor
                      : Constant.whiteColor,
                  borderRadius: 20,
                  alignSelf: 'flex-end',
                }}
              />
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-1.png')}
              />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {Translation.dashboardMessage}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ManageProjects');
                dispatch(updateProjectTab(0));
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-2.png')}
              />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {Translation.dashboardProposals}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SavedItem')}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-3.png')}
              />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {Translation.dashboardView}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (profileInfo.user_type == 'freelancer') {
                  navigation.navigate('ManageProjects');
                  dispatch(updateProjectTab(1));
                } else {
                  navigation.navigate('ManageJobs');
                  dispatch(updateJobTab(2));
                }
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-4.png')}
              />
              {!loader ? (
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 24,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                    color: Constant.fontColor,
                  }}>
                  {profileInfo.user_type == 'freelancer'
                    ? DashboardData.ongoing_jobs
                    : DashboardData.total_ongoing_jobs}
                </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? Translation.dashboardProjects
                  : Translation.dashboardJobs}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <TouchableOpacity
              onPress={() => {
                if (profileInfo.user_type == 'freelancer') {
                  navigation.navigate('ManageProjects');
                  dispatch(updateProjectTab(2));
                } else {
                  navigation.navigate('ManageJobs');
                  dispatch(updateJobTab(3));
                }
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-5.png')}
              />
              
              {!loader ? (
                <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? DashboardData.completed_jobs
                  : DashboardData.total_completed_jobs}
              </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? Translation.dashboardCompleteProjects
                  : Translation.dashboardCompleteJobs}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (profileInfo.user_type == 'freelancer') {
                  navigation.navigate('ManageProjects');
                  dispatch(updateProjectTab(3));
                } else {
                  navigation.navigate('ManageJobs');
                  dispatch(updateJobTab(4));
                }
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-6.png')}
              />
             
              {!loader ? (
                 <Text
                 style={{
                   fontSize: 14,
                   lineHeight: 24,
                   letterSpacing: 0.5,
                   fontFamily: Constant.primaryFontSemiBold,
                   color: Constant.fontColor,
                 }}>
                 {profileInfo.user_type == 'freelancer'
                   ? DashboardData.total_cancelled_jobs
                   : DashboardData.total_cancelled_jobs}
               </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? Translation.dashboardCancelledProjects
                  : Translation.dashboardCancelledjobs}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <View
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-7.png')}
              />
              
              {!loader ? (
                 <Text
                 style={{
                   fontSize: 14,
                   lineHeight: 24,
                   letterSpacing: 0.5,
                   fontFamily: Constant.primaryFontSemiBold,
                   color: Constant.fontColor,
                 }}>
                 {profileInfo.user_type == 'freelancer'
                   ? DashboardData.total_sold_services
                   : DashboardData.total_posted_jobs}
               </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? Translation.dashboardServices
                  : Translation.dashboardPostedJobs}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ManageServices');
                dispatch(updateServiceTab(5));
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-8.png')}
              />
              
              {!loader ? (
                 <Text
                 style={{
                   fontSize: 14,
                   lineHeight: 24,
                   letterSpacing: 0.5,
                   fontFamily: Constant.primaryFontSemiBold,
                   color: Constant.fontColor,
                 }}>
                 {profileInfo.user_type == 'freelancer'
                   ? DashboardData.ongoing_services
                   : DashboardData.total_ongoing_services}
               </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {Translation.dashboardOngoingServices}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.rowView,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ManageServices');
                dispatch(updateServiceTab(6));
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-9.png')}
              />
              
              {!loader ? (
                <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? DashboardData.total_completed_services
                  : DashboardData.total_completed_services}
              </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {Translation.dashboardCompletedServices}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ManageServices');
                dispatch(updateServiceTab(7));
              }}
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '49%',
                paddingHorizontal: 20,
                paddingVertical: 20,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  marginBottom: 7,
                }}
                source={require('../../assets/images/dashboard-10.png')}
              />
              
              {!loader ? (
                <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}>
                {profileInfo.user_type == 'freelancer'
                  ? DashboardData.total_cancelled_services
                  : DashboardData.total_cancelled_services}
              </Text>
              ) : (
                <SkeletonPlaceholder>
                  <View
                    style={{
                      width: 40,
                      height: 17,
                      borderRadius: 45 / 2,
                      marginTop: 10,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.secondryFontRegular,
                  color: '#676767',
                }}>
                {Translation.dashboardCancelledServices}
              </Text>
            </TouchableOpacity>
          </View>
          {profileInfo.user_type == 'freelancer' && (
            <View
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                backgroundColor: Constant.whiteColor,
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 25,
                marginBottom: 10,
                elevation: 5, //android
                shadowColor: '#000', // ios
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={styles.rowView}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    marginBottom: 7,
                  }}
                  source={require('../../assets/images/dashboard-11.png')}
                />
                <View style={{marginLeft: 15}}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 24,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontSemiBold,
                      color: Constant.fontColor,
                    }}>
                    {decode(DashboardData.available_balance)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      fontFamily: Constant.secondryFontRegular,
                      color: '#676767',
                    }}>
                    {Translation.dashboardBalance}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('PayoutSettings')}>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                    fontFamily: Constant.secondryFontSemiBold,
                    color: Constant.blueColor,
                  }}>
                  {Translation.dashboardWithdraw}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              borderRadius: 10,
              borderColor: Constant.borderColor,
              borderWidth: 1,
              backgroundColor: Constant.whiteColor,
              width: '100%',
              paddingBottom: 25,
              marginBottom: 10,
              elevation: 5, //android
              shadowColor: '#000', // ios
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 1,
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                // backgroundColor: '#06B6D4',
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderBottomLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'flex-end',
                marginBottom: 10,
              }}>
              {/* <CountDown
                // id={countDownId}
                size={10}
                until={countDown}
                // onFinish={() => alert('Finished')}
                digitStyle={{backgroundColor: '#06B6D4'}}
                digitTxtStyle={{color: '#fff', fontWeight: 'bold'}}
                timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                separatorStyle={{color: '#fff'}}
                timeToShow={['D', 'H', 'M', 'S']}
                timeLabels={{d: null, h: null, m: null, s: null}}
                showSeparator
              /> */}
            </View>
            <View style={{width: '100%', paddingHorizontal: 20}}>
              <View style={styles.rowView}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    marginBottom: 7,
                  }}
                  source={require('../../assets/images/dashboard-12.png')}
                />
                <View style={{marginLeft: 15}}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 24,
                      letterSpacing: 0.5,
                      fontFamily: Constant.primaryFontSemiBold,
                      color: Constant.fontColor,
                    }}>
                    {Translation.dashboardPackage}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PricePlan')}>
                    <Text
                      style={{
                        fontSize: 13,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        fontFamily: Constant.secondryFontSemiBold,
                        color: Constant.blueColor,
                      }}>
                      {Translation.dashboardUpgrade}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
