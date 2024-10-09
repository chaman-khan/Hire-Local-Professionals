import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import Header from '../components/Header';
import RNFetchBlob from 'rn-fetch-blob';
import {BallIndicator} from 'react-native-indicators';
import Notification from '../components/Notification';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as Constant from '../constants/globalConstant';
import DocumentPicker from 'react-native-document-picker';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';
import {updateJobTab, updateServiceTab} from '../redux/GlobalStateSlice';
import Translation from '../constants/Translation';

const ViewHistory = ({navigation, route}) => {
  const profileInfo = useSelector(state => state.value.profileInfo);
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const historyDetail = route.params.data;
  const RBSheetSendReason = useRef();
  const dispatch = useDispatch();
  const RBSheetFeeback = useRef();
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [droploading, setDropLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentsArray, setDocumentsArray] = useState([]);
  const [jobStatus, setJobStatus] = useState('hired');
  const [serviceStatus, setServiceStatus] = useState('hired');
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [detail, setDetail] = useState('');
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (route.params.type == 'job') {
      feedbackData.length = 0;
      Object.entries(settings.project_ratings).map(([key, value]) =>
        feedbackData.push({
          label: value,
          value: key,
          rate: 1,
        }),
      );
    }
    if (route.params.type == 'service') {
      feedbackData.length = 0;
      Object.entries(settings.services_ratings).map(([key, value]) =>
        feedbackData.push({
          label: value,
          value: key,
          rate: 1,
        }),
      );
    }
  }, []);

  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      for (var i = 0; i < res.length; i++) {
        documentsArray.push(res[i]);
      }
      setRefreshFlatlist(!refreshFlatlist);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const deleteDocument = index => {
    documentsArray.splice(index, 1);
    setRefreshFlatlist(!refreshFlatlist);
  };
  const sendMessage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userInfo.id);
    formData.append('sender_id', userInfo.id);
    formData.append(
      'id',
      route.params.type == 'project'
        ? historyDetail.proposal_id
        : route.params.type == 'job'
        ? historyDetail.proposal_id
        : historyDetail.order_id,
    );
    formData.append('chat_desc', detail);

    formData.append(
      'size',
      documentsArray != null ? documentsArray.length : '0',
    );
    if (documentsArray != null) {
      documentsArray.forEach((item, i) => {
        formData.append('project_files' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }

    axios
      .post(Constant.BaseUrl + 'proposal/sendproposal_chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token.authToken,
        },
      })
      .then(response => {
        if (response.data.type == 'success') {
          let comments =
            route.params.type == 'job'
              ? historyDetail.proposal_freelancers[0].project_history
              : route.params.type == 'project'
              ? historyDetail.project_history
              : historyDetail.history;

          comments.unshift({
            ID: response.data.comment_id,
            date_sent: response.data.date,
            message: response.data.content_message,
            sender_image: response.data.img,
            download_url: response.data.downloadUrl,
          });
          setDetail('');
          setDocumentsArray([]);
          setRefreshFlatlist(!refreshFlatlist);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          // navigation.goBack();
        } else {
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const checkPermission = async link => {
    setLoading(true);
    if (Platform.OS === 'ios') {
      downloadMedia(link);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: Translation.viewHistoryStoragePermission,
            message: Translation.viewHistoryNeedsAccess,
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadMedia(link);
        } else {
          setLoading(false);
          setShowAlert(true);
          setType('error');
          setTitle(Translation.globalOops);
          setDesc(Translation.viewHistoryGranted);
        }
      } catch (error) {
        setLoading(false);
        console.warn(error);
      }
    }
  };
  const downloadMedia = link => {
    let URL = link;
    let date = new Date();
    let ext = '.zip';
    const {config, fs} = RNFetchBlob;
    let options;
    let PictureDir = fs.dirs.PictureDir;
    setLoading(false);
    options = Platform.select({
      ios: {
        fileCache: true,
        path:
          PictureDir +
          '/Workreap/Documents/' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        appendExt: ext,
      },
      android: {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          notification: true,
          path:
            PictureDir +
            '/Workreap/Documents/' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: 'Document',
        },
      },
    });
    config(options)
      .fetch('GET', URL)
      .then(res => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(res.data);
        }
      });
  };
  const updateJobStatus = () => {
    if (jobStatus == 'completed') {
      RBSheetFeeback.current.open();
    } else if (jobStatus == 'cancelled') {
      RBSheetSendReason.current.open();
    }
  };
  const updateServiceStatus = () => {
    if (serviceStatus == 'completed') {
      RBSheetFeeback.current.open();
    } else if (serviceStatus == 'cancelled') {
      RBSheetSendReason.current.open();
    }
  };
  const cancelJob = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'dashboard/cancelled_project',
        {
          user_id: userInfo.id,
          project_id: historyDetail.ID,
          cancelled_reason: cancelReason,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          dispatch(updateJobTab(4));
          navigation.goBack();
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
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const completeJob = () => {
    let feebackFinalObj = {};
    for (var i = 0; i < feedbackData.length; i++) {
      feebackFinalObj[feedbackData[i].value] = feedbackData[i].rate;
    }
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'dashboard/complete_project',
        {
          user_id: userInfo.id,
          project_id: historyDetail.ID,
          feedback: feebackFinalObj,
          feedback_description: feedbackDesc,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          // getMilstoneArray();
          RBSheetFeeback.current.close();
          dispatch(updateJobTab(3));
          navigation.goBack();
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
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const cancelService = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'dashboard/cancelled_services',
        {
          user_id: userInfo.id,
          service_order_id: historyDetail.order_id,
          cancelled_reason: cancelReason,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          dispatch(updateServiceTab(7));
          navigation.goBack();
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
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const completeService = () => {
    setLoading(true);
    let feebackFinalObj = {};
    for (var i = 0; i < feedbackData.length; i++) {
      feebackFinalObj[feedbackData[i].value] = feedbackData[i].rate;
    }

    axios
      .post(
        Constant.BaseUrl + 'dashboard/complete_services',
        {
          user_id: userInfo.id,
          service_order_id: historyDetail.order_id,
          feedback: feebackFinalObj,
          feedback_description: feedbackDesc,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          // getMilstoneArray();
          RBSheetFeeback.current.close();
          dispatch(updateServiceTab(6));
          navigation.goBack();
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
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.viewHistoryTitle}
        backIcon={true}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          {route.params.type == 'project' && (
            <View
              style={[
                styles.projectStatusCardView,
                {
                  paddingBottom: 10,
                },
              ]}>
              <View style={styles.jobCardNameView}>
                <Text style={styles.jobCardNameViewText}>
                  {historyDetail.employer_name}
                </Text>

                {historyDetail.employer_verified == 'yes' && (
                  <FontAwesome
                    name={'check-circle'}
                    size={16}
                    color={'#22C55E'}
                  />
                )}
              </View>

              <Text style={styles.jobCardMainHeading}>
                {historyDetail.title}
              </Text>
              <View style={styles.jobCardInfoListMain}>
                <View style={styles.jobCardNameView}>
                  <ImageBackground
                    // imageStyle={{borderRadius: 25 / 2}}
                    style={styles.jobCardInfoListImage}
                    source={require('../../assets/images/jobIcon0.png')}
                  />
                  <Text style={styles.jobCardInfoListHeading}>
                    {Translation.viewHistorySkill}
                  </Text>
                </View>
                <Text style={styles.jobCardInfoListHeadingValue}>
                  {historyDetail.project_level}
                </Text>
              </View>
              <View style={styles.jobCardInfoListMain}>
                <View style={styles.jobCardNameView}>
                  <ImageBackground
                    // imageStyle={{borderRadius: 25 / 2}}
                    style={styles.jobCardInfoListImage}
                    source={require('../../assets/images/jobIcon8.png')}
                  />
                  <Text style={styles.jobCardInfoListHeading}>
                    {Translation.viewHistoryProjectType}
                  </Text>
                </View>
                <Text style={styles.jobCardInfoListHeadingValue}>
                  {historyDetail.project_type}
                </Text>
              </View>
              {historyDetail.location.length != 0 && (
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={{uri: historyDetail.location[0].location_flag}}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.viewHistoryCountry}
                    </Text>
                  </View>
                  <Text style={styles.jobCardInfoListHeadingValue}>
                    {historyDetail.location[0].location_name}
                  </Text>
                </View>
              )}
            </View>
          )}
          {route.params.type == 'service' && (
            <>
              <View style={styles.serviceStatusCardViewTile}>
                <View
                  style={{
                    width: '15%',
                  }}>
                  <Image
                    // resizeMode="contain"
                    style={styles.serviceStatusCardViewTileImage}
                    source={{uri: historyDetail.featured_img}}
                  />
                </View>

                <View style={{width: '80%'}}>
                  <Text style={styles.serviceStatusCardViewTileHeading}>
                    {historyDetail.service_title}
                  </Text>
                  <View style={styles.rowView}>
                    <Text style={styles.serviceStatusCardViewTilePriceText}>
                      {Translation.viewHistoryOfferedPrice}
                    </Text>
                    <Text style={styles.serviceStatusCardViewTilePriceValue}>
                      {historyDetail.order_total}
                    </Text>
                  </View>
                </View>
              </View>
              {historyDetail.addons.length != 0 && (
                <>
                  <Text
                    style={[
                      styles.serviceStatusCardViewTileHeading,
                      {
                        marginVertical: 10,
                        marginLeft: 0,
                        fontFamily: Constant.primaryFontMedium,
                      },
                    ]}>
                    {Translation.viewHistoryAddonsServices}
                  </Text>
                  <FlatList
                    style={{marginBottom: 10}}
                    showsVerticalScrollIndicator={false}
                    data={historyDetail.addons}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          backgroundColor: '#fcfcfc',
                          borderColor: Constant.borderColor,
                          borderWidth: 1,
                          paddingHorizontal: 15,
                          borderBottomColor:
                            historyDetail.addons.length - 1 == index
                              ? Constant.borderColor
                              : Constant.whiteColor,
                          flexDirection: 'row',
                          paddingVertical: 10,
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 22,
                              letterSpacing: 0.5,
                              color: Constant.fontColor,
                              fontFamily: Constant.primaryFontSemiBold,
                            }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 22,
                              letterSpacing: 0.5,
                              color: '#676767',
                              fontFamily: Constant.primaryFontSemiBold,
                            }}>
                            {item.detail}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 22,
                            letterSpacing: 0.5,
                            marginLeft: 15,
                            color: '#676767',
                            fontFamily: Constant.primaryFontSemiBold,
                          }}>
                          {item.price}
                        </Text>
                      </View>
                    )}
                  />
                </>
              )}
            </>
          )}
          {profileInfo.user_type == 'employer' && route.params.type == 'job' && (
            <>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                  marginTop: 15,
                }}>
                {Translation.viewHistoryHiredFreelancer}
              </Text>
              <View
                style={[
                  styles.projectProposalCardView,
                  {borderRadius: 10, borderBottomColor: Constant.borderColor},
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <ImageBackground
                    resizeMode="cover"
                    imageStyle={{
                      borderRadius: 50 / 2,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    source={{uri: historyDetail.hired_freelancer_img}}
                  />
                  <View style={{width: '80%', marginLeft: 15}}>
                    <View style={styles.rowView}>
                      <Text
                        style={[
                          styles.employerCardHeadingText,
                          {marginBottom: 0},
                        ]}>
                        {historyDetail.hired_freelancer_title}
                      </Text>
                      <FontAwesome
                        style={{marginLeft: 5}}
                        name={'check-circle'}
                        size={16}
                        color={'#22C55E'}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.primaryFontRegular,
                      }}>
                      4.8/5 (5 {Translation.viewHistoryFeedback})
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 22,
                    marginTop: 12,
                    lineHeight: 30,
                    letterSpacing: 0.5,
                    color: Constant.fontColor,
                    fontFamily: Constant.primaryFontSemiBold,
                  }}>
                  {historyDetail.proposal_freelancers[0].total_price}
                </Text>
                {historyDetail.job_type != 'fixed' ? (
                  <>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.secondryFontRegular,
                      }}>
                      {Translation.viewHistoryEstimatedHours} (
                      {
                        historyDetail.proposal_freelancers[0]
                          .proposal_price_time.estimeted_time
                      }
                      )
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.secondryFontRegular,
                      }}>
                      {Translation.viewHistoryAmount} (
                      {
                        historyDetail.proposal_freelancers[0]
                          .proposal_price_time.total_amount
                      }
                      )
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      color: '#676767',
                      fontFamily: Constant.secondryFontRegular,
                    }}>
                    {Translation.viewHistoryDuration}(
                    {
                      historyDetail.proposal_freelancers[0].proposal_price_time
                        .duration
                    }
                    )
                  </Text>
                )}
                <View
                  style={[
                    styles.jobCardInfoListMain,
                    {width: '100%', marginTop: 10},
                  ]}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/attachment.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.viewHistoryAttachement}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.jobCardInfoListHeadingValue,
                      {color: Constant.blueColor},
                    ]}>
                    {historyDetail.proposal_freelancers[0].proposal_docs} file
                    {Translation.viewHistoryAttached}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 10,
                  }}>
                  <View style={{width: '70%'}}>
                    <View
                      style={[
                        styles.managePortfolioListBottomView,
                        {borderRadius: 6},
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignContent: 'center',
                          justifyContent: 'space-between',
                          borderBottomColor: Constant.borderColor,
                          borderBottomWidth: selectedStatus ? 1 : 0,
                          padding: 12,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            lineHeight: 24,
                            letterSpacing: 0.5,
                            marginLeft: 10,
                            fontFamily: Constant.secondryFontRegular,
                            color: Constant.lightGrayColor,
                          }}>
                          {jobStatus.charAt(0).toUpperCase() +
                            jobStatus.slice(1)}
                        </Text>
                        {droploading ? (
                          <View style={{marginRight: 5}}>
                            <BallIndicator
                              color={Constant.fontColor}
                              size={14}
                            />
                          </View>
                        ) : (
                          <Feather
                            onPress={() => setSelectedStatus(!selectedStatus)}
                            name="chevron-down"
                            color={Constant.fontColor}
                            size={24}
                          />
                        )}
                      </View>
                      {selectedStatus && (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedStatus(false);
                              setJobStatus('hired');
                            }}
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              justifyContent: 'space-between',
                              paddingHorizontal: 10,
                              paddingTop: 5,
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                lineHeight: 24,
                                letterSpacing: 0.5,
                                marginLeft: 10,
                                fontFamily: Constant.secondryFontRegular,
                                color: Constant.fontColor,
                              }}>
                              Hired
                            </Text>
                            {jobStatus == 'hired' && (
                              <Feather
                                // onPress={() => setVisible(true)}
                                name="check"
                                color={Constant.fontColor}
                                size={18}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedStatus(false);
                              setJobStatus('completed');
                            }}
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              justifyContent: 'space-between',
                              paddingHorizontal: 10,
                              paddingTop: 5,
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                lineHeight: 24,
                                letterSpacing: 0.5,
                                marginLeft: 10,
                                fontFamily: Constant.secondryFontRegular,
                                color: Constant.fontColor,
                              }}>
                              {Translation.viewHistoryCompleted}
                            </Text>
                            {jobStatus == 'completed' && (
                              <Feather
                                // onPress={() => setVisible(true)}
                                name="check"
                                color={Constant.fontColor}
                                size={18}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedStatus(false);
                              setJobStatus('cancelled');
                            }}
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              justifyContent: 'space-between',
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                lineHeight: 24,
                                letterSpacing: 0.5,
                                marginLeft: 10,
                                fontFamily: Constant.secondryFontRegular,
                                color: Constant.fontColor,
                              }}>
                              {Translation.viewHistoryCancelled}
                            </Text>
                            {jobStatus == 'cancelled' && (
                              <Feather
                                // onPress={() => setVisible(true)}
                                name="check"
                                color={Constant.fontColor}
                                size={18}
                              />
                            )}
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => updateJobStatus()}
                    style={{
                      backgroundColor: Constant.primaryColor,
                      borderRadius: 6,
                      paddingVertical: 12,
                      width: '29%',
                      // height: 45,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        letterSpacing: 0.5,
                        fontFamily: Constant.primaryFontBold,
                        color: Constant.whiteColor,
                      }}>
                      {Translation.viewHistoryUpdate}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              letterSpacing: 0.5,
              fontFamily: Constant.primaryFontSemiBold,
              color: Constant.fontColor,
              marginTop: 15,
            }}>
            Hired freelancer
          </Text>
          <View
            style={[
              styles.projectProposalCardView,
              {borderRadius: 10, borderBottomColor: Constant.borderColor},
            ]}>
            <View style={{flexDirection: 'row'}}>
              <ImageBackground
                resizeMode="cover"
                imageStyle={{
                  borderRadius: 50 / 2,
                }}
                style={{
                  width: 50,
                  height: 50,
                }}
                source={require('../../assets/images/demo.jpg')}
              />
              <View style={{width: '80%', marginLeft: 15}}>
                <View style={styles.rowView}>
                  <Text
                    style={[styles.employerCardHeadingText, {marginBottom: 0}]}>
                    Jessica Stevens
                  </Text>
                  <FontAwesome
                    style={{marginLeft: 5}}
                    name={'check-circle'}
                    size={16}
                    color={'#22C55E'}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                    color: '#676767',
                    fontFamily: Constant.primaryFontRegular,
                  }}>
                  4.8/5 (5 Feedback)
                </Text>
              </View>
            </View>
            <FormButton
                  // onPress={() => navigation.navigate('identityInformation')}
                  buttonTitle={'View status'}
                  backgroundColor={Constant.grayColor}
                  textColor={'#676767'}
                />
          </View> */}
            </>
          )}
          {profileInfo.user_type == 'employer' &&
            route.params.type == 'service' && (
              <>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                    color: Constant.fontColor,
                    marginTop: 15,
                  }}>
                  {Translation.viewHistoryHiredFreelancer}
                </Text>
                <View
                  style={[
                    styles.projectProposalCardView,
                    {borderRadius: 10, borderBottomColor: Constant.borderColor},
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <ImageBackground
                      resizeMode="cover"
                      imageStyle={{
                        borderRadius: 50 / 2,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={{uri: historyDetail.service.freelancer_avatar}}
                    />
                    <View style={{width: '80%', marginLeft: 15}}>
                      <View style={styles.rowView}>
                        <Text
                          style={[
                            styles.employerCardHeadingText,
                            {marginBottom: 0},
                          ]}>
                          {historyDetail.service.freelancer_title}
                        </Text>
                        <FontAwesome
                          style={{marginLeft: 5}}
                          name={'check-circle'}
                          size={16}
                          color={'#22C55E'}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 22,
                          letterSpacing: 0.5,
                          color: '#676767',
                          fontFamily: Constant.primaryFontRegular,
                        }}>
                        {historyDetail.service.reviews_rate}/5 (
                        {historyDetail.service.total_rating}{' '}
                        {Translation.viewHistoryFeedback})
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 10,
                    }}>
                    <View style={{width: '70%'}}>
                      <View
                        style={[
                          styles.managePortfolioListBottomView,
                          {borderRadius: 6},
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                            borderBottomColor: Constant.borderColor,
                            borderBottomWidth: selectedStatus ? 1 : 0,
                            padding: 12,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              lineHeight: 24,
                              letterSpacing: 0.5,
                              marginLeft: 10,
                              fontFamily: Constant.secondryFontRegular,
                              color: Constant.lightGrayColor,
                            }}>
                            {serviceStatus.charAt(0).toUpperCase() +
                              serviceStatus.slice(1)}
                          </Text>
                          {droploading ? (
                            <View style={{marginRight: 5}}>
                              <BallIndicator
                                color={Constant.fontColor}
                                size={14}
                              />
                            </View>
                          ) : (
                            <Feather
                              onPress={() => setSelectedStatus(!selectedStatus)}
                              name="chevron-down"
                              color={Constant.fontColor}
                              size={24}
                            />
                          )}
                        </View>
                        {selectedStatus && (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedStatus(false);
                                setServiceStatus('hired');
                              }}
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 10,
                                paddingTop: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  lineHeight: 24,
                                  letterSpacing: 0.5,
                                  marginLeft: 10,
                                  fontFamily: Constant.secondryFontRegular,
                                  color: Constant.fontColor,
                                }}>
                                Hired
                              </Text>
                              {serviceStatus == 'hired' && (
                                <Feather
                                  // onPress={() => setVisible(true)}
                                  name="check"
                                  color={Constant.fontColor}
                                  size={18}
                                />
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedStatus(false);
                                setServiceStatus('completed');
                              }}
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 10,
                                paddingTop: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  lineHeight: 24,
                                  letterSpacing: 0.5,
                                  marginLeft: 10,
                                  fontFamily: Constant.secondryFontRegular,
                                  color: Constant.fontColor,
                                }}>
                                {Translation.viewHistoryCompleted}
                              </Text>
                              {serviceStatus == 'completed' && (
                                <Feather
                                  // onPress={() => setVisible(true)}
                                  name="check"
                                  color={Constant.fontColor}
                                  size={18}
                                />
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedStatus(false);
                                setServiceStatus('cancelled');
                              }}
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  lineHeight: 24,
                                  letterSpacing: 0.5,
                                  marginLeft: 10,
                                  fontFamily: Constant.secondryFontRegular,
                                  color: Constant.fontColor,
                                }}>
                                {Translation.viewHistoryCancelled}
                              </Text>
                              {serviceStatus == 'cancelled' && (
                                <Feather
                                  // onPress={() => setVisible(true)}
                                  name="check"
                                  color={Constant.fontColor}
                                  size={18}
                                />
                              )}
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => updateServiceStatus()}
                      style={{
                        backgroundColor: Constant.primaryColor,
                        borderRadius: 6,
                        paddingVertical: 12,
                        width: '29%',
                        // height: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          letterSpacing: 0.5,
                          fontFamily: Constant.primaryFontBold,
                          color: Constant.whiteColor,
                        }}>
                        {Translation.viewHistoryUpdate}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
        </View>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.viewHistoryProject}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              borderColor: Constant.borderColor,
              borderWidth: 1,
              borderRadius: 10,
            }}
            data={
              route.params.type == 'job'
                ? historyDetail.proposal_freelancers[0].project_history
                : route.params.type == 'project'
                ? historyDetail.project_history
                : historyDetail.history
            }
            keyExtractor={(x, i) => i.toString()}
            ListEmptyComponent={
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 22,
                  letterSpacing: 0.5,
                  marginLeft: 15,
                  color: '#676767',
                  marginVertical: 10,
                  fontFamily: Constant.primaryFontSemiBold,
                }}>
                {Translation.viewHistoryNoFound}
              </Text>
            }
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedHistory(selectedHistory == index ? null : index)
                }
                style={{
                  // borderBottomColor:index == historyDetail.history.length-1 ? Constant.whiteColor : Constant.borderColor,
                  borderBottomColor:
                    route.params.type == 'job'
                      ? index ==
                        historyDetail.proposal_freelancers[0].project_history
                          .length -
                          1
                        ? Constant.whiteColor
                        : Constant.borderColor
                      : route.params.type == 'project'
                      ? index == historyDetail.project_history.length - 1
                        ? Constant.whiteColor
                        : Constant.borderColor
                      : index == historyDetail.history.length - 1
                      ? Constant.whiteColor
                      : Constant.borderColor,

                  borderBottomWidth: 1,
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}>
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.rowView}>
                    <ImageBackground
                      resizeMode="cover"
                      imageStyle={{
                        borderRadius: 50 / 2,
                        borderColor: Constant.borderColor,
                        borderWidth: 0.6,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={{uri: item.sender_image}}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        marginLeft: 15,
                        color: '#676767',
                        fontFamily: Constant.primaryFontRegular,
                      }}>
                      {item.date_sent}
                    </Text>
                  </View>
                  <Feather
                    name={
                      selectedHistory == index
                        ? 'chevron-down'
                        : 'chevron-right'
                    }
                    color={'#676767'}
                    size={20}
                  />
                </View>
                {selectedHistory == index && (
                  <>
                    <Text style={styles.PayoutSettingsPayoutDesc}>
                      {item.message}
                    </Text>
                    {item.hasOwnProperty('download_url') && (
                      <>
                        {item.download_url != '' && (
                          <FormButton
                            onPress={() => checkPermission(item.download_url)}
                            buttonTitle={'Attachments'}
                            backgroundColor={Constant.grayColor}
                            textColor={'#484848'}
                            iconName={'download'}
                            loader={loading}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </TouchableOpacity>
            )}
          />
          {route.params.status == 'ongoing' && (
            <>
              <Text style={styles.inputHeading}>
                {Translation.viewHistoryDescription}
              </Text>
              <View style={styles.multilineTextInputView}>
                <TextInput
                  placeholder={Translation.viewHistoryDescriptionDetail}
                  multiline
                  value={detail}
                  onChangeText={text => setDetail(text)}
                  placeholderTextColor={Constant.lightGrayColor}
                  style={styles.multilineTextInput}
                />
              </View>
              <Text style={styles.inputHeading}>
                {Translation.viewHistoryUploadFiles}
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
                  onPress={() => pickDocumentfromDevice()}
                  buttonTitle={Translation.globalSelectFile}
                  backgroundColor={Constant.greenColor}
                  textColor={Constant.whiteColor}
                />
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={documentsArray}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.profileSettingProjectListView,
                      {paddingVertical: 15},
                    ]}>
                    <View style={{marginLeft: 10, width: '80%'}}>
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
                        {Translation.viewHistoryFileSize}
                        {(item.size / 1024).toFixed(2)}{' '}
                        {Translation.viewHistoryKB}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteDocument(index)}>
                      <Feather
                        style={{marginRight: 10}}
                        name={'x'}
                        color={Constant.fontColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <FormButton
                onPress={() => sendMessage()}
                buttonTitle={Translation.viewHistorySendNow}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loading}
              />
            </>
          )}
        </View>
      </ScrollView>
      <RBSheet
        ref={RBSheetFeeback}
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
              {Translation.viewHistoryCompleteProject}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetFeeback.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.viewHistoryFeedback}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.viewHistoryAddFeeback}
                multiline
                value={feedbackDesc}
                onChangeText={text => setFeedbackDesc(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={feedbackData}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={20}
                    fullStarColor={'#fecb02'}
                    emptyStarColor={'#fecb02'}
                    rating={item.rate}
                    selectedStar={rating => {
                      feedbackData[index].rate = rating;
                      setRefreshFlatlist(!refreshFlatlist);
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      marginLeft: 15,
                      color: Constant.fontColor,
                      marginVertical: 10,
                      fontFamily: Constant.primaryFontSemiBold,
                    }}>
                    {item.label}
                  </Text>
                </View>
              )}
            />
            <FormButton
              onPress={() =>
                route.params.type == 'job' ? completeJob() : completeService()
              }
              buttonTitle={Translation.viewHistorySendFeedback}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
      <RBSheet
        ref={RBSheetSendReason}
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
              {Translation.viewHistoryCancelReason}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetSendReason.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.viewHistoryReason}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.viewHistoryTypeReason}
                multiline
                value={cancelReason}
                onChangeText={text => setCancelReason(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <FormButton
              onPress={() =>
                profileInfo.user_type == 'freelancer'
                  ? declineMilstones()
                  : route.params.type == 'job'
                  ? cancelJob()
                  : cancelService()
              }
              buttonTitle={Translation.viewHistoryCancelReason}
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

export default ViewHistory;
