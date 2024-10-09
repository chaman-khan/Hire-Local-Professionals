import {
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  ImageBackground,
  Share
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import styles from '../styles/Style';
import * as Progress from 'react-native-progress';
import Notification from '../components/Notification';
import {BallIndicator} from 'react-native-indicators';
import DropDownPicker from 'react-native-dropdown-picker';
import HTML from 'react-native-render-html';
import FormButton from '../components/FormButton';
import ServicesListCard from '../home/ServicesListCard';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const FreelancerDetail = ({navigation, route}) => {
  const settings = useSelector(state => state.setting.settings);
  const token = useSelector(state => state.value.token);
  const profileImage = useSelector(state => state.value.profileImage);
  const userInfo = useSelector(state => state.value.userInfo);
  const reasons = useSelector(state => state.global.reasonTypeTaxonomy);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const freelancerDetail = route.params.item;
  const RBSheetSendOffer = useRef();
  const [selectedInfo, setselectedInfo] = useState(0);
  const [detail, setDetail] = useState('');
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openProjectList, setOpenProjectList] = useState(false);
  const [projectListValue, setProjectListValue] = useState(null);
  const [projectListItems, setProjectListItems] = useState([]);
  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(null);
  const [reasonItems, setReasonItems] = useState([]);
  const [data, setData] = useState([
    {
      name: Translation.freelancerDetailTabAbout,
    },
    {
      name:
        settings.user_meta.access_type.service_access == 'yes'
          ? Translation.freelancerDetailTabServices
          : '',
    },
    {
      name: Translation.freelancerDetailTabCrafted,
    },
    {
      name: Translation.freelancerDetailTabEducation,
    },
    {
      name: Translation.freelancerDetailTabFaq,
    },
    {
      name: token != null ? Translation.freelancerDetailTabReport: "",
    },
  ]);
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

  useEffect(() => {
    getProjectsList();
    reasonItems.length = 0;
    for (var i = 0; i < reasons.length; i++) {
      reasonItems.push({
        label: reasons[i].title,
        value: reasons[i].value,
      });
    }
  }, []);

  const getProjectsList = async () => {
    projectListItems.length = 0;
    return fetch(
      Constant.BaseUrl + 'chat/employer_jobs?user_id=' + userInfo.id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.type == 'success') {
          for (var i = 0; i < responseJson.projects.length; i++) {
            projectListItems.push({
              label: responseJson.projects[i].title,
              value: responseJson.projects[i].id,
            });
          }
        }
      })
      .catch(error => {
        // setLoader(false);
        console.error(error);
      });
  };
  const sendMessage = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'chat/send_offer',
        {
          user_id: userInfo.id,
          receiver_id: freelancerDetail.user_id,
          project_id: projectListValue,
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
          RBSheetSendOffer.current.close();
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
  const saveFreelancer = async () => {
    if (freelancerDetail.favorit == 'yes') {
      setShowAlert(true);
      setType('success');
      setTitle(Translation.freelancerDetailAlraedy);
      setDesc(Translation.freelancerDetailAlreadyList);
    } else {
      setLoader(true);
      axios
        .post(
          Constant.BaseUrl + 'user/favorite',
          {
            user_id: userInfo.id,
            favorite_id: freelancerDetail.user_id,
            type: '_saved_freelancers',
          },
          {
            headers: {
              Authorization: 'Bearer ' + token.authToken,
            },
          },
        )
        .then(async response => {

          if (response.data.type == 'success') {
            freelancerDetail.favorit = 'yes';
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
  const reportFreelancer = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'user/reporting',
        {
          user_id: userInfo.id,
          id: freelancerDetail.user_id,
          reason: reasonValue,
          description: detail,
          type: 'freelancer',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          setDetail('');
          setReasonValue(null);
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
  const hideAlert = () => {
    setShowAlert(false);
   
  };
  const openLoginAlert = () => {
    setShowAlert(true);
      setType(Translation.customTabBarError);
      setTitle(Translation.globalOops);
      setDesc(Translation.customTabBarLoginFirst);
  }
  const onClickShare = () => {
    Share.share(
      {
        message: "",
        url: freelancerDetail.freelancer_link,
        title: 'Share Freelancer',
      },
      {
        // Android only:
        dialogTitle: freelancerDetail.freelancer_link,
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
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
              {userInfo.profile_id != freelancerDetail.profile_id && (
                <TouchableOpacity onPress={() => token != null ? saveFreelancer():openLoginAlert() }>
                  {freelancerDetail.favorit == 'yes' ? (
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
              )}
            </>
          )}

          <Feather
            onPress={() => onClickShare()}
            style={{marginRight: 25}}
            name="share-2"
            type="share-2"
            color={Constant.iconColor}
            size={22}
          />
          <TouchableOpacity>
            <Image style={styles.headerPhoto} source={
                profileImage == ''
                  ? require('../../assets/images/NoImage.png')
                  : {uri: profileImage}
              } />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.freelancerDetailTopTabView}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => setselectedInfo(index)}
                  style={[
                    styles.freelancerDetailTopTabViewSingle,
                    {
                      backgroundColor:
                        selectedInfo == index
                          ? Constant.greenColor
                          : Constant.whiteColor,
                          borderColor: selectedInfo == index?
                          Constant.whiteColor:
                          Constant.borderColor,
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
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedInfo == 0 && (
          <>
            <View
              style={[
                styles.ServiceProviderCardPrentStyle,
                {width: '100%', backgroundColor: Constant.whiteColor},
              ]}>
              <FontAwesome
                style={styles.jobCardMainViewBookmark}
                name={'bookmark'}
                size={20}
                color={Constant.primaryColor}
              />
              <View style={styles.freelancerDetailCardName}>
                <Image
                  resizeMode="contain"
                  style={styles.freelancerDetailCardImageStyle}
                  source={{uri: freelancerDetail.profile_img}}
                />

                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.freelancerDetailCardNameTextStyle}>
                      {freelancerDetail.name}
                    </Text>
                    <AntDesign
                      name={'checkcircle'}
                      size={13}
                      color={'#22C55E'}
                    />
                  </View>

                  {freelancerDetail._perhour_rate != '' && (
                    <Text style={styles.freelancerDetailPriceTextStyle}>
                      {freelancerDetail._perhour_rate}/hr
                    </Text>
                  )}
                </View>
              </View>
              {freelancerDetail._tag_line != '' && (
                <Text style={styles.freelancerDetailCardTaglineStyle}>
                  {freelancerDetail._tag_line}
                </Text>
              )}
              <View style={styles.freelancerDetailCardReviewView}>
                <AntDesign name={'star'} size={16} color={'#FFD101'} />
                <Text style={styles.freelancerDetailRatingTextStyle}>
                  {freelancerDetail.wt_average_rating}/5
                </Text>
                <Text style={styles.ServiceProviderCardReviewCountStyle}>
                  (
                  {freelancerDetail.reviews.length >= 2
                    ? freelancerDetail.reviews.length + ' Reviews'
                    : freelancerDetail.reviews.length + ' Review'}
                  )
                </Text>
              </View>
              {freelancerDetail.member_since != '' && (
                <View style={styles.freelancerDetailPriceParentStyle}>
                  <Feather
                    name="calendar"
                    color={Constant.lightGrayColor}
                    size={16}
                  />
                  <Text style={styles.freelancerDetailRatingTextStyle}>
                    {Translation.freelancerDetailMember}
                  </Text>
                  <Text style={styles.freelancerDetailValuesTextStyle}>
                    {freelancerDetail.member_since}
                  </Text>
                </View>
              )}
              {freelancerDetail.languages.length != 0 && (
                <View style={styles.freelancerDetailPriceParentStyle}>
                  <Feather
                    name="flag"
                    color={Constant.lightGrayColor}
                    size={16}
                  />
                  <Text style={styles.freelancerDetailRatingTextStyle}>
                    {Translation.freelancerDetailLanguages}
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={freelancerDetail.languages}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({item, index}) => (
                      <Text style={styles.freelancerDetailValuesTextStyle}>
                        {item.name}{' '}
                        {index + 1 == freelancerDetail.languages.length
                          ? ''
                          : ','}
                      </Text>
                    )}
                  />
                </View>
              )}
              {freelancerDetail.location._country != '' && (
                <View style={styles.freelancerDetailLocationParentStyle}>
                  <Image
                    resizeMode="stretch"
                    style={styles.freelancerDetailLocationImageStyle}
                    source={{uri: freelancerDetail.location.flag}}
                  />
                  <Text style={styles.freelancerDetailLocationTextStyle}>
                    {freelancerDetail.location._country}
                  </Text>
                </View>
              )}
              {/* <Text style={styles.freelancerDetailCardTaglineStyle}>
                {freelancerDetail.content}
              </Text> */}
               <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: freelancerDetail.content,
                      }}
                    />
              {/* <Text style={styles.freelancerDetailShowButton}>Show all</Text> */}
              {profileInfo.user_type != 'freelancer' && (
                <FormButton
                  onPress={() =>token != null ? RBSheetSendOffer.current.open() : openLoginAlert()}
                  buttonTitle={Translation.freelancerDetailSendOffer}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loader}
                />
              )}
            </View>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeading}>
                {Translation.freelancerDetailMySkills}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={freelancerDetail.skills}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View>
                    <Text style={styles.freelancerDetailSkillText}>
                      {decode(item.skill_name)} {'  '}
                      <Text style={styles.freelancerDetailSkillPercentage}>
                        {item.skill_percent}%
                      </Text>
                    </Text>
                    <Progress.Bar
                      style={{marginVertical: 5}}
                      progress={item.skill_val / 100}
                      width={Dimensions.get('window').width / 1.1}
                      color={Constant.greenColor}
                      borderColor={Constant.whiteColor}
                      unfilledColor={Constant.borderColor}
                    />
                  </View>
                )}
              />
            </View>
            <View style={styles.freelancerDetailCountingView}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#06B6D4',
                      },
                    ]}>
                    {freelancerDetail.ongoning_jobs}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailOngoingProjects}
                  </Text>
                </View>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#6366F1',
                      },
                    ]}>
                    {freelancerDetail.completed_jobs}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailCompleted}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#EF4444',
                      },
                    ]}>
                    {freelancerDetail.cancelled_jobs}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailCancelled}
                  </Text>
                </View>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#22C55E',
                      },
                    ]}>
                    {freelancerDetail.ongoing_services}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailOngoingServices}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#F97316',
                      },
                    ]}>
                    {freelancerDetail.completed_services}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailCompletedServices}
                  </Text>
                </View>
                <View style={styles.freelancerDetailCountingSingleView}>
                  <Text
                    style={[
                      styles.freelancerDetailCountingTextValue,
                      {
                        color: '#EAB308',
                      },
                    ]}>
                    {freelancerDetail.cancelled_services}
                  </Text>
                  <Text style={styles.freelancerDetailCountingTextHeading}>
                    {Translation.freelancerDetailCancelledServices}
                  </Text>
                </View>
              </View>
              <View style={styles.freelancerDetailCountingSingleViewLast}>
                <Text
                  style={[
                    styles.freelancerDetailCountingTextValue,
                    {
                      color: '#9B59B6',
                    },
                  ]}>
                  {decode(freelancerDetail.total_earnings)}
                </Text>
                <Text style={styles.freelancerDetailCountingTextHeading}>
                 {Translation.freelancerDetailEarnings}
                </Text>
              </View>
            </View>
          </>
        )}
        {selectedInfo == 1 && (
          <View style={styles.freelancerDetailCardMainViewMiddle}>
            <Text style={styles.freelancerDetailCardMainHeadingBold}>
              {Translation.freelancerDetailServices}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={freelancerDetail.services}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ServiceDetail', {
                    item: item,
                    edit: false,
                  })
                }
                >
                  <ServicesListCard width={'100%'} item={item} />
                </TouchableOpacity>
              )}
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
                      {
                        alignSelf: 'center',
                        marginBottom: '80%',
                        fontSize: 16,
                        marginTop: 0,
                      },
                    ]}>
                  {Translation.globalNoRecordFound}
                  </Text>
                </>
              }
            />
          </View>
        )}
        {selectedInfo == 2 && (
          <>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeadingBold}>
                {Translation.freelancerDetailCraftedProjects}
              </Text>

              {freelancerDetail._projects.length != 0 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={freelancerDetail._projects}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <View>
                      <View style={styles.freelancerDetailCraftedMainView}>
                        <ImageBackground
                          style={{height: 150}}
                          imageStyle={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          }}
                          source={item.image.url != "" ? {uri: item.image.url} :require("../../assets/images/NoImage.png")}>
                          <View style={styles.freelancerDetailImageOverly} />
                        </ImageBackground>
                        <View style={styles.freelancerDetailCraftedTextView}>
                          <Text
                            style={styles.freelancerDetailCraftedTextHeading}>
                            {item.title}
                          </Text>
                          <Text style={styles.freelancerDetailCraftedTextLink}>
                            {item.link}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              ) : (
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
                    style={[styles.inputHeading, {fontSize: 16, marginTop: 0}]}>
                    {Translation.globalNoRecordFound}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeadingBold}>
                {Translation.freelancerDetailPortfolios}
              </Text>
              {freelancerDetail.portfolios.length != 0 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={freelancerDetail.portfolios}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <TouchableOpacity>
                      <View style={styles.freelancerDetailPortfolioMainView}>
                        <ImageBackground
                          style={{height: 150}}
                          imageStyle={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          }}
                          source={{uri: item.portfolio_gallery[0]}}>
                          <View style={styles.freelancerDetailImageOverly} />
                        </ImageBackground>
                        {/* <View style={styles.freelancerDetailPortfolioProfileView}>
                        <Image
                          resizeMode="contain"
                          style={styles.freelancerDetailPortfolioImageStyle}
                          source={require('../../assets/images/Placeholder11.png')}
                        />
                      </View> */}
                        <View style={styles.freelancerDetailPortfolioTextView}>
                          <Text
                            style={styles.freelancerDetailPortfolioTextName}>
                            {item.freelancer_name}
                          </Text>
                          <AntDesign
                            name={'checkcircle'}
                            size={13}
                            color={'#22C55E'}
                          />
                        </View>
                        <Text
                          style={styles.freelancerDetailPortfolioTextTagline}>
                          {decode(item.portfolio_title)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
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
                    style={[styles.inputHeading, {fontSize: 16, marginTop: 0}]}>
                    {Translation.globalNoRecordFound}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
        {selectedInfo == 3 && (
          <>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeadingBold}>
                {Translation.freelancerDetailExperience}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={freelancerDetail._experience}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      borderColor: Constant.borderColor,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      marginVertical: 5,
                      borderRadius: 6,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Feather
                        name="globe"
                        color={Constant.lightGrayColor}
                        size={16}
                      />
                      <Text style={styles.freelancerDetailEduExpMTextValue}>
                        {item.company}
                      </Text>
                    </View>
                    <Text style={styles.freelancerDetailEduExpTextHeading}>
                      {item.title}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Feather
                        name="calendar"
                        color={Constant.lightGrayColor}
                        size={16}
                      />
                      <Text style={styles.freelancerDetailEduExpMTextValue}>
                        {item.startdate} - {item.enddate}
                      </Text>
                    </View>
                    <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: item.description,
                      }}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        marginTop: 60,
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
              />
            </View>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeadingBold}>
                {Translation.freelancerDetailEducation}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={freelancerDetail._educations}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.freelancerDetailEduMainView}>
                    <View style={styles.rowView}>
                      <Feather
                        name="globe"
                        color={Constant.lightGrayColor}
                        size={16}
                      />
                      <Text style={styles.freelancerDetailEduExpMTextValue}>
                        {item.institute}
                      </Text>
                    </View>
                    <Text style={styles.freelancerDetailEduExpTextHeading}>
                      {item.title}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Feather
                        name="calendar"
                        color={Constant.lightGrayColor}
                        size={16}
                      />
                      <Text style={styles.freelancerDetailEduExpMTextValue}>
                        {item.startdate} - {item.enddate}
                      </Text>
                    </View>

                    <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: item.description,
                      }}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        marginTop: 60,
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
              />
            </View>
            <View style={styles.freelancerDetailCardMainView}>
              <Text style={styles.freelancerDetailCardMainHeadingBold}>
                {Translation.freelancerDetailAwards}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={freelancerDetail._awards}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.freelancerDetailAwardsView}>
                    <View style={styles.rowView}>
                      <ImageBackground
                        resizeMode="cover"
                        imageStyle={{
                          borderRadius: 55 / 2,
                        }}
                        style={styles.freelancerDetailAwardsImage}
                        source={item.image.url != "" ? {uri: item.image.url}:require("../../assets/images/NoImage.png")}
                      />
                      <View>
                        <Text style={styles.freelancerDetailAwardsMainText}>
                          {item.title}
                        </Text>
                        <Text style={styles.freelancerDetailAwardsDateText}>
                          {item.date}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        marginTop: 60,
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
              />
            </View>
          </>
        )}
        {selectedInfo == 4 && (
          <View style={styles.freelancerDetailCardMainViewMiddle}>
            <Text style={styles.freelancerDetailFAQsMainHeading}>
              {Translation.freelancerDetailFequently}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.freelancerDetailFAQsFlatlist}
              data={freelancerDetail.faqs}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      setselectedQuestion(
                        selectedQuestion == index ? null : index,
                      )
                    }
                    style={[
                      styles.freelancerDetailFAQsQuestionView,
                      {
                        borderBottomWidth:
                          index == freelancerDetail.length - 1 ? 0 : 1,
                      },
                    ]}>
                    <Text style={styles.freelancerDetailFAQsQuestionText}>
                      {decode(item.faq_question)}
                    </Text>
                    <Feather
                      name={selectedQuestion == index ? 'minus' : 'plus'}
                      color={Constant.fontColor}
                      size={18}
                    />
                  </TouchableOpacity>
                  {selectedQuestion == index && (
                    <View style={styles.freelancerDetailFAQsAnswerView}>
                      <Text style={styles.freelancerDetailFAQsAnswerText}>
                        {decode(item.faq_answer)}
                      </Text>
                    </View>
                  )}
                </>
              )}
              ListEmptyComponent={
                <>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 60,
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
            />
          </View>
        )}
        {selectedInfo == 5 && (
          <View style={styles.freelancerDetailCardMainViewMiddle}>
            <Text style={styles.freelancerDetailFAQsMainHeading}>
             {Translation.freelancerDetailReportFreelancer}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputHeading}>{Translation.freelancerDetailReason}</Text>
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
                placeholder={Translation.freelancerDetailSelectReason}
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
              <Text style={styles.inputHeading}>{Translation.freelancerDetailDescription}</Text>
              <View style={styles.multilineTextInputView}>
                <TextInput
                  placeholder={Translation.freelancerDetailDescription}
                  multiline
                  value={detail}
                  onChangeText={text => setDetail(text)}
                  placeholderTextColor={Constant.lightGrayColor}
                  style={styles.multilineTextInput}
                />
              </View>

              <FormButton
                onPress={() => reportFreelancer()}
                buttonTitle={Translation.freelancerDetailReport}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <RBSheet
        ref={RBSheetSendOffer}
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
             {Translation.freelancerDetailSendMessage}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetSendOffer.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={styles.manageServicesRBSMainView}>
              <Text
                style={[styles.manageServicesRBSSubHeading, {marginLeft: 5}]}>
                You can only create a dispute against the cancelled
                projects/services.
              </Text>
            </View> */}
            <Text style={styles.inputHeading}>{Translation.freelancerDetailProjects}</Text>

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
              open={openProjectList}
              value={projectListValue}
              placeholder={Translation.freelancerDetailSelectProjects}
              searchPlaceholder={Translation.globalSearchHere}
              items={projectListItems}
              searchable={true}
              setOpen={setOpenProjectList}
              setValue={setProjectListValue}
              setItems={setProjectListItems}
              listMode="MODAL"
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              zIndex={100}
              disableBorderRadius={true}
              badgeDotColors={['#e76f51']}
            />
            <Text style={styles.inputHeading}>{Translation.freelancerDetailTypeMessage}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.freelancerDetailTypeMessage}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <Text style={[styles.manageServicesRBSSubHeading, {marginLeft: 5}]}>
              {Translation.freelancerDetailClick}
            </Text>
            <FormButton
              onPress={() => sendMessage()}
              buttonTitle={Translation.freelancerDetailSendMessage}
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

export default FreelancerDetail;
