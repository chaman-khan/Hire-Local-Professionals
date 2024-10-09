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
import React, {useEffect, useState, useRef} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import Header from '../components/Header';
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import Notification from '../components/Notification';
import StarRating from 'react-native-star-rating';
import Translation from '../constants/Translation';
import axios from 'axios';
import HTML from 'react-native-render-html';
import {useIsFocused} from '@react-navigation/native';
import * as Constant from '../constants/globalConstant';
import DocumentPicker from 'react-native-document-picker';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

const ManageMilestone = ({navigation, route}) => {
  const billing = useSelector(state => state.value.billing);
  const shipping = useSelector(state => state.value.shipping);
  const settings = useSelector(state => state.setting.settings);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileImage = useSelector(state => state.value.profileImage);
  const profileName = useSelector(state => state.value.profileName);
  const token = useSelector(state => state.value.token);
  const historyDetail = route.params.data;
  const RBSheetAddNewMilestone = useRef();
  const RBSheetCalender = useRef();
  const RBSheetSendReason = useRef();
  const RBSheetInvoiceDetail = useRef();
  const RBSheetFeeback = useRef();
  const isFocused = useIsFocused();

  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [milestoneComplete, setMilestoneComplete] = useState(false);
  const [freelancerReview, setFreelancerReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [droploading, setDropLoading] = useState(false);
  const [documentsArray, setDocumentsArray] = useState([]);
  const [milstonesArray, setMilstonesArray] = useState([]);
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [budget, setBudget] = useState('');
  const [escrow, setEscrow] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false)
  const [paid, setPaid] = useState('');
  const [remainingPrice, setRemainingPrice] = useState('');
  const [detail, setDetail] = useState('');
  const [remaining, setRemaining] = useState(null);
  const [selectedInovice, setSelectedInovice] = useState(null);
  const [date, setDate] = useState(new Date());
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [feedbackData, setFeedbackData] = useState([]);
  const [milestoneTitle, setMilestoneTitle] = useState(null);
  const [selectedMilestonID, setSelectedMilestonID] = useState('');
  const [milestonePrice, setMilestonePrice] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchedDate, setSearchedDate] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    feedbackData.length = 0;
    Object.entries(settings.project_ratings).map(([key, value]) =>
      feedbackData.push({
        label: value,
        value: key,
        rate: 1,
      }),
    );
    if (route.params.type == 'proposal') {
    } else if (route.params.type == 'job') {
      setBudget(
        historyDetail.proposal_freelancers[route.params.index].total_price,
      );
      setEscrow(
        historyDetail.proposal_freelancers[route.params.index].in_escrow,
      );
      setPaid(
        historyDetail.proposal_freelancers[route.params.index].milestone_paid,
      );
      setRemainingPrice(
        historyDetail.proposal_freelancers[route.params.index].remainings,
      );
      if (
        historyDetail.proposal_freelancers[route.params.index].remaning_price ==
        0
      ) {
        setMilestoneComplete(true);
      }
      setRemaining(
        historyDetail.proposal_freelancers[route.params.index].remaning_price,
      );
      if (
        historyDetail.proposal_freelancers[route.params.index]
          .proposal_status == 'pending'
      ) {
        setFreelancerReview(true);
      }
      if (
        historyDetail.proposal_freelancers[route.params.index]
          .proposal_status == 'approved'
      ) {
        setJobStatus('hired');
      }
    }

  }, []);
  useEffect(() => {
    if (isFocused) {
      getMilstoneArray();
    }
  }, [isFocused]);

  const tagsStyles = {
    body: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0.5,
      marginBottom: 10,
      color: Constant.fontColor,
    },
  };
  const getMilstoneArray = async () => {
    var proposalId = 0;
    if (route.params.type == 'proposal') {
      if (route.params.status == 'ongoing') {
        proposalId = historyDetail.proposal_id;
      } else if (route.params.status == 'pending') {
        proposalId = historyDetail.ID;
      } else if (route.params.status == 'complete') {
        proposalId = historyDetail.proposal_id;
      }
    } else if (route.params.type == 'job') {
      proposalId =
        historyDetail.proposal_freelancers[route.params.index].proposal_id;
    }
    return fetch(
      Constant.BaseUrl +
        'milestone/get_job_milestone_details?proposal_id=' +
        proposalId,

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
        setLoading(false);
        RBSheetAddNewMilestone.current.close();
        if (route.params.type == 'proposal') {
          setMilstonesArray(responseJson.milestones);
          setBudget(responseJson.total_price);
          setEscrow(responseJson.hired_price);
          setPaid(responseJson.completed_price);
          setRemainingPrice(responseJson.remainings);
          setRefreshFlatlist(!refreshFlatlist);
        } else if (route.params.type == 'job') {
          setBudget(responseJson.total_price);
          setEscrow(responseJson.hired_price);
          setPaid(responseJson.completed_price);
          setRemainingPrice(responseJson.remainings);
          historyDetail.proposal_freelancers[
            route.params.index
          ].proposal_milestone = responseJson.milestones;
          setRemaining(
            parseInt(
              historyDetail.proposal_freelancers[route.params.index]
                .total_price_formated,
            ) - responseJson.total_milestone_price,
          );
          historyDetail.proposal_freelancers[route.params.index].remainings =
            responseJson.remainings;
          if (
            parseInt(
              historyDetail.proposal_freelancers[route.params.index]
                .total_price_formated,
            ) -
              responseJson.total_milestone_price ==
            0
          ) {
            setMilestoneComplete(true);
          }
          setRefreshFlatlist(!refreshFlatlist);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
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
      historyDetail.proposal_freelancers[route.params.index].proposal_id,
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
            route.params.type == 'proposal'
              ? historyDetail.project_history
              : historyDetail.proposal_freelancers[route.params.index]
                  .project_history;
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
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Documents',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted..');
          downloadMedia(link);
        } else {
          setLoading(false);
          setShowAlert(true);
          setType('error');
          setTitle(Translation.globalOops);
          setDesc(Translation.manageMilestoneStoragePermission);
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
    const selectedAndroidDate = currentDate.getFullYear() +
    '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + currentDate.getDate()).slice(-2);
    setSearchedDate(selectedAndroidDate);
    setDate(currentDate);
  };

  const editMilestone = item => {
    RBSheetAddNewMilestone.current.open();
    setSelectedMilestonID(item.milstone_id);
    setMilestoneTitle(item.milstone_title);
    setMilestonePrice(item.price);
    setDueDate(item.milstone_date);
    setMilestoneDesc(item.milstone_content);
  };
  const saveUpdateMilestone = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'milestone/add_milestone',
        {
          user_id: userInfo.id,
          id: historyDetail.proposal_freelancers[route.params.index]
            .proposal_id,
          milestone_id: selectedMilestonID != null ? selectedMilestonID : '',
          title: milestoneTitle,
          description: milestoneDesc,
          price: milestonePrice,
          due_date: dueDate,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          // setLoading(false);
          getMilstoneArray();
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else if (response.data.type == 'error') {
          setLoading(false);
          RBSheetAddNewMilestone.current.close();
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
  const sendMiletonetoFreelancer = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'milestone/send_milestone_request',
        {
          user_id: userInfo.id,
          id: historyDetail.proposal_freelancers[route.params.index]
            .proposal_id,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data[0].type == 'success') {
          setFreelancerReview(true);
          setLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        } else if (response.data[0].type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        }
      })
      .catch(error => {
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const acceptMilstones = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'milestone/approve_milestone_request',
        {
          user_id: userInfo.id,
          proposal_id: historyDetail.ID,
          status: 'approved',
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data[0].type == 'success') {
          route.params.status = 'ongoing';
          setLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        } else if (response.data[0].type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        }
      })
      .catch(error => {
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const declineMilstones = () => {
    setDeclineLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'milestone/cancel_milestone_request',
        {
          user_id: userInfo.id,
          proposal_id: historyDetail.ID,
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
        if (response.data[0].type == 'success') {
          setDeclineLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        } else if (response.data[0].type == 'error') {
          setDeclineLoading(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        }
      })
      .catch(error => {
        // setLoader(false)
        setLoading(false);
        console.log(error);
      });
  };
  const payMilestone = index => {
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
    payment_data_map_array.order_type = 'milestone';
    payment_data_map_array.proposal_id =
      historyDetail.proposal_freelancers[route.params.index].proposal_id;
    payment_data_map_array.milestone_id =
      historyDetail.proposal_freelancers[route.params.index].proposal_milestone[
        index
      ].milstone_id;
    payment_data_map_array.job_id = historyDetail.ID;
    payment_data_map_array.customer_id = userInfo.id;
    payment_data_map_array.customer_note = '';
    payment_data_map_array.shipping_methods = 'stripe';
    payment_data_map_array.sameAddress = '1';
    payment_data_map_array.billing_info = billing_info_map;
    payment_data_map_array.shipping_info = shipping_info_map;
    var payment_data = JSON.stringify(payment_data_map_array);
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
          navigation.navigate('Checkout', {link: response.data.url});
        } else if (response.data.type == 'error') {
          // setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getInvoiceDetail = async id => {
    setSelectedInovice(id)
    return fetch(
      Constant.BaseUrl +
        'profile/get_invoice_detail?user_id=' +
        userInfo.id +
        '&invoice_id=' +
        id,

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
        setInvoiceDetail(responseJson);
        RBSheetInvoiceDetail.current.open();
        setLoading(false);

        setRefreshFlatlist(!refreshFlatlist);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const completeNowMilestone = id => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'milestone/complete_milestone',
        {
          user_id: userInfo.id,
          milestone_id: id,
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
          getMilstoneArray();
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
  const updateJobStatus = () => {
    if (jobStatus == 'completed') {
      RBSheetFeeback.current.open();
    } else if (jobStatus == 'cancelled') {
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
          // getMilstoneArray();
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
        title={Translation.manageMilestoneManageMilestone}
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
        {(route.params.status == 'ongoing' ||
          route.params.status == 'complete') && (
          <View style={styles.cardView}>
            {profileInfo.user_type == 'employer' ? (
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
                  {Translation.manageMilestoneHiredFreelancer}
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
                        {
                          historyDetail.proposal_freelancers[0]
                            .rating_proposal_author.round_rate
                        }
                        /
                        {
                          historyDetail.proposal_freelancers[0]
                            .rating_proposal_author.total_rating
                        }
                        {/* (5 Feedback) */}
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
                    {decode(settings.currency_symbol)}
                    {
                      historyDetail.proposal_freelancers[0].proposal_price_time
                        .proposed_amount
                    }
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
                        {Translation.manageMilestoneEstimatedHours} (
                        {
                          historyDetail.proposal_freelancers[route.params.index]
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
                        {Translation.manageMilestoneAmountPerHour} (
                        {
                          historyDetail.proposal_freelancers[route.params.index]
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
                      {Translation.manageMilestoneDuration} (
                      {
                        historyDetail.proposal_freelancers[route.params.index]
                          .proposal_price_time.duration
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
                        {Translation.manageMilestoneAttachement}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.jobCardInfoListHeadingValue,
                        {color: Constant.blueColor},
                      ]}>
                      1 file attached
                    </Text>
                  </View>
                  {route.params.status == 'complete' && (
                  <FormButton
                    onPress={() => {}}
                    buttonTitle={'Project Completed'}
                    backgroundColor={Constant.greenColor}
                    textColor={Constant.whiteColor}
                  />
                )}
                  {route.params.status == 'ongoing' &&
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
                            <Feather
                            onPress={() => setSelectedStatus(!selectedStatus)}
                            name="chevron-down"
                            color={Constant.fontColor}
                            size={24}
                          />
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
                                {Translation.manageMilestoneHired}
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
                            {budget == paid && (
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
                                  {Translation.manageMilestoneCompleted}
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
                            )}
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
                               {Translation.manageMilestoneCancelled}
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
                        {Translation.manageMilestoneUpdate}
                      </Text>
                    </TouchableOpacity>
                  </View>}
                </View>
              </>
            ) : (
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
                  {Translation.manageMilestoneFreelancer}
                </Text>
                <View
                  style={[
                    styles.projectProposalCardView,
                    {borderRadius: 10, borderBottomColor: Constant.borderColor},
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ImageBackground
                      resizeMode="cover"
                      imageStyle={{
                        borderRadius: 50 / 2,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={{
                        uri: profileImage,
                      }}
                    />
                    <View style={{width: '80%', marginLeft: 15}}>
                      <View style={styles.rowView}>
                        <Text
                          style={[
                            styles.employerCardHeadingText,
                            {marginBottom: 0},
                          ]}>
                          {profileName}
                        </Text>
                        <FontAwesome
                          style={{marginLeft: 5}}
                          name={'check-circle'}
                          size={16}
                          color={'#22C55E'}
                        />
                      </View>
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
                    {/* {decode(settings.currency_symbol)} */}
                    {historyDetail.budget_dollar}
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
                        {Translation.manageMilestoneEstimatedHours} (20)
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 22,
                          letterSpacing: 0.5,
                          color: '#676767',
                          fontFamily: Constant.secondryFontRegular,
                        }}>
                        {Translation.manageMilestoneAmountPerHour} ($175.00)
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
                      {Translation.manageMilestoneDuration} ({historyDetail.duration.value})
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
                        {Translation.manageMilestoneAttachement}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.jobCardInfoListHeadingValue,
                        {color: Constant.blueColor},
                      ]}>
                      {historyDetail.proposal_documents_count} {Translation.manageMilestoneAttachementFileAttached}
                    </Text>
                  </View>
                </View>
                {route.params.status == 'complete' && (
                  <FormButton
                    onPress={() => {}}
                    buttonTitle={Translation.manageMilestoneProjectCompleted}
                    backgroundColor={Constant.greenColor}
                    textColor={Constant.whiteColor}
                  />
                )}
              </>
            )}
          </View>
        )}

        {route.params.status == 'pending' && (
          <View style={styles.cardView}>
            {profileInfo.user_type == 'employer' ? (
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
                  {Translation.manageMilestoneFreelancer}
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
                      source={{
                        uri: historyDetail.proposal_freelancers[
                          route.params.index
                        ].url,
                      }}
                    />
                    <View style={{width: '80%', marginLeft: 15}}>
                      <View style={styles.rowView}>
                        <Text
                          style={[
                            styles.employerCardHeadingText,
                            {marginBottom: 0},
                          ]}>
                          {
                            historyDetail.proposal_freelancers[
                              route.params.index
                            ].freelancer_title
                          }
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
                        {
                          historyDetail.proposal_freelancers[route.params.index]
                            .rating_proposal_author.round_rate
                        }
                        /5
                        ({historyDetail.proposal_freelancers[route.params.index]
                            .rating_proposal_author.total_rating} {Translation.manageMilestoneFeedback})
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
                    {decode(settings.currency_symbol)}
                    {
                      historyDetail.proposal_freelancers[route.params.index]
                        .proposal_price_time.proposed_amount
                    }
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
                        {Translation.manageMilestoneEstimatedHours} (
                        {
                          historyDetail.proposal_freelancers[route.params.index]
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
                        {Translation.manageMilestoneAmountPerHour} (
                        {
                          historyDetail.proposal_freelancers[route.params.index]
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
                      {Translation.manageMilestoneDuration} (
                      {
                        historyDetail.proposal_freelancers[route.params.index]
                          .proposal_price_time.duration
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
                        {Translation.manageMilestoneAttachement}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.jobCardInfoListHeadingValue,
                        {color: Constant.blueColor},
                      ]}>
                      {
                        historyDetail.proposal_freelancers[route.params.index]
                          .proposal_docs
                      }{' '}
                      {Translation.manageMilestoneAttachementFileAttached}
                    </Text>
                  </View>
                  
                  {freelancerReview ? (
                    <FormButton
                      onPress={() => {}}
                      buttonTitle={Translation.manageMilestoneUnderFreelancerReview}
                      backgroundColor={Constant.primaryColor}
                      textColor={Constant.whiteColor}
                    />
                  ) : (
                    <>
                      {milestoneComplete ? (
                        <FormButton
                          onPress={() => {
                            sendMiletonetoFreelancer();
                          }}
                          buttonTitle={Translation.manageMilestoneSendMilestoneFreelancer}
                          backgroundColor={Constant.greenColor}
                          textColor={Constant.whiteColor}
                          loader={loading}
                        />
                      ) : (
                        <FormButton
                          onPress={() => {
                            setSelectedMilestonID(null);
                            setMilestoneTitle('');
                            setMilestoneDesc('');
                            setDueDate('');
                            setMilestonePrice(remaining.toString());
                            RBSheetAddNewMilestone.current.open();
                          }}
                          buttonTitle={Translation.manageMilestoneAddNewmilestone}
                          backgroundColor={Constant.primaryColor}
                          textColor={Constant.whiteColor}
                          loader={loading}
                        />
                      )}
                    </>
                  )}
                </View>
              </>
            ) : (
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
                  {Translation.manageMilestoneFreelancer}
                </Text>
                <View
                  style={[
                    styles.projectProposalCardView,
                    {borderRadius: 10, borderBottomColor: Constant.borderColor},
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ImageBackground
                      resizeMode="cover"
                      imageStyle={{
                        borderRadius: 50 / 2,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={{
                        uri: profileImage,
                      }}
                    />
                    <View style={{width: '80%', marginLeft: 15}}>
                      <View style={styles.rowView}>
                        <Text
                          style={[
                            styles.employerCardHeadingText,
                            {marginBottom: 0},
                          ]}>
                          {profileName}
                        </Text>
                        <FontAwesome
                          style={{marginLeft: 5}}
                          name={'check-circle'}
                          size={16}
                          color={'#22C55E'}
                        />
                      </View>
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
                    {/* {decode(settings.currency_symbol)} */}
                    {historyDetail.budget_dollar}
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
                        {Translation.manageMilestoneEstimatedHours} (20)
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 22,
                          letterSpacing: 0.5,
                          color: '#676767',
                          fontFamily: Constant.secondryFontRegular,
                        }}>
                        {Translation.manageMilestoneAmountPerHour} ($175.00)
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
                      {Translation.manageMilestoneDuration} ({historyDetail.duration.value})
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
                        {Translation.manageMilestoneAttachement}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.jobCardInfoListHeadingValue,
                        {color: Constant.blueColor},
                      ]}>
                      {historyDetail.proposal_documents_count} {Translation.manageMilestoneAttachementFileAttached}
                    </Text>
                  </View>

                  {route.params.status == 'pending' && (
                    <View
                      style={[
                        styles.rowView,
                        {justifyContent: 'space-between', width: '100%'},
                      ]}>
                      <View style={{width: '48%'}}>
                        <FormButton
                          onPress={() => acceptMilstones()}
                          buttonTitle={Translation.manageMilestoneAccept}
                          backgroundColor={Constant.greenColor}
                          textColor={Constant.whiteColor}
                          loader={loading}
                        />
                      </View>

                      <View
                        style={{
                          width: '48%',
                        }}>
                        <FormButton
                          onPress={() => RBSheetSendReason.current.open()}
                          buttonTitle={Translation.manageMilestoneDecline}
                          backgroundColor={Constant.primaryColor}
                          textColor={Constant.whiteColor}
                          loader={declineLoading}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        )}
        <View style={styles.cardView}>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              letterSpacing: 0.5,
              fontFamily: Constant.primaryFontSemiBold,
              color: Constant.fontColor,
              marginTop: 15,
            }}>
            {Translation.manageMilestoneProjectBudgetDetails}
          </Text>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <View
              style={[
                styles.projectProposalCardView,
                {
                  borderRadius: 10,
                  borderBottomColor: Constant.borderColor,
                  width: '49%',
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ImageBackground
                  resizeMode="cover"
                  imageStyle={{
                    borderRadius: 50 / 2,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require('../../assets/images/budget.png')}
                />
                <View style={{width: '80%', marginLeft: 15}}>
                  <View style={styles.rowView}>
                    <Text
                      style={[
                        styles.employerCardHeadingText,
                        {marginBottom: 0, color: Constant.greenColor},
                      ]}>
                      {/* {decode(settings.currency_symbol)}  */}
                      {budget}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      color: '#676767',
                      fontFamily: Constant.primaryFontRegular,
                    }}>
                    {Translation.manageMilestoneTotalBudget}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.projectProposalCardView,
                {
                  borderRadius: 10,
                  borderBottomColor: Constant.borderColor,
                  width: '49%',
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ImageBackground
                  resizeMode="cover"
                  imageStyle={{
                    borderRadius: 50 / 2,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require('../../assets/images/escrow.png')}
                />
                <View style={{width: '80%', marginLeft: 15}}>
                  <View style={styles.rowView}>
                    <Text
                      style={[
                        styles.employerCardHeadingText,
                        {marginBottom: 0, color: Constant.blueColor},
                      ]}>
                      {/* {decode(settings.currency_symbol)}  */}
                      {escrow}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      color: '#676767',
                      fontFamily: Constant.primaryFontRegular,
                    }}>
                    {Translation.manageMilestoneInEscrow}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <View
              style={[
                styles.projectProposalCardView,
                {
                  borderRadius: 10,
                  borderBottomColor: Constant.borderColor,
                  width: '49%',
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ImageBackground
                  resizeMode="cover"
                  imageStyle={{
                    borderRadius: 50 / 2,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require('../../assets/images/paid.png')}
                />
                <View style={{width: '80%', marginLeft: 15}}>
                  <View style={styles.rowView}>
                    <Text
                      style={[
                        styles.employerCardHeadingText,
                        {marginBottom: 0, color: '#9b59b6'},
                      ]}>
                      {/* {decode(settings.currency_symbol)}  */}
                      {paid}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      color: '#676767',
                      fontFamily: Constant.primaryFontRegular,
                    }}>
                    {Translation.manageMilestoneMilestonePaid}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.projectProposalCardView,
                {
                  borderRadius: 10,
                  borderBottomColor: Constant.borderColor,
                  width: '49%',
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ImageBackground
                  resizeMode="cover"
                  imageStyle={{
                    borderRadius: 50 / 2,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require('../../assets/images/remainings.png')}
                />
                <View style={{width: '80%', marginLeft: 15}}>
                  <View style={styles.rowView}>
                    <Text
                      style={[
                        styles.employerCardHeadingText,
                        {marginBottom: 0, color: Constant.fontColor},
                      ]}>
                      {decode(settings.currency_symbol)}
                      {remainingPrice}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      color: '#676767',
                      fontFamily: Constant.primaryFontRegular,
                    }}>
                    {Translation.manageMilestoneRemainings}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>{Translation.manageMilestoneMilestones}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              route.params.type == 'job'
                ? historyDetail.proposal_freelancers[route.params.index]
                    .proposal_milestone
                : milstonesArray
            }
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.projectProposalCardView,
                  {
                    borderRadius: 10,
                    borderBottomColor: Constant.borderColor,
                    paddingBottom: 5,
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  
                  <View style={{width: '100%', marginLeft: 0}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          styles.employerCardHeadingText,
                          {marginBottom: 0},
                        ]}>
                        {item.milstone_title}
                      </Text>
                      {route.params.type == 'job' ? (
                        <>
                          {item.updated_status == 'hired' && (
                            <View
                              style={[
                                styles.projectProposalCardStatus,
                                {
                                  backgroundColor: '#F97316',
                                },
                              ]}>
                              <Text
                                style={styles.projectProposalCardStatusText}>
                                {Translation.manageMilestoneHired}
                              </Text>
                            </View>
                          )}
                        </>
                      ) : (
                        <View
                          style={[
                            styles.projectProposalCardStatus,
                            {
                              backgroundColor:
                                item.updated_status == 'hired'
                                  ? '#F97316'
                                  : item.updated_status == 'completed'
                                  ? Constant.greenColor
                                  : item.updated_status == 'pending'
                                  ? '#64748B'
                                  : item.updated_status == 'pay_now'
                                  ? '#64748B'
                                  : null,
                            },
                          ]}>
                          <Text style={styles.projectProposalCardStatusText}>
                            {item.updated_status == 'hired'
                              ? item.updated_status.charAt(0).toUpperCase() +
                                item.updated_status.slice(1)
                              : item.updated_status == 'completed'
                              ? item.updated_status.charAt(0).toUpperCase() +
                                item.updated_status.slice(1)
                              : item.updated_status == 'pending'
                              ? item.updated_status.charAt(0).toUpperCase() +
                                item.updated_status.slice(1)
                              : item.updated_status == 'pay_now'
                              ? 'Pending'
                              : null}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.primaryFontRegular,
                      }}>
                      {Translation.manageMilestoneBudget} {item.price_formate}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.jobCardInfoListMain,
                    {width: '100%', marginTop: 10},
                  ]}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/jobIcon1.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>{Translation.manageMilestoneDueDate}</Text>
                  </View>
                  <Text
                    style={[
                      styles.jobCardInfoListHeadingValue,
                      {color: '#676767'},
                    ]}>
                    {item.milstone_date_formate}
                  </Text>
                </View>
                {route.params.type != 'proposal' && (
                  <>
                    {historyDetail.proposal_freelancers[route.params.index]
                      .proposal_status == 'approved' ? (
                      <>
                        {item.updated_status == 'hired' ||
                        item.updated_status == 'completed' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}>
                            <View style={{width: '49%'}}>
                              {item.updated_status == 'completed' ? (
                                <FormButton
                                  // onPress={() => payMilestone(index)}
                                  buttonTitle={Translation.manageMilestoneCompleted}
                                  backgroundColor={Constant.greenColor}
                                  textColor={Constant.whiteColor}
                                  // loader={loading}
                                />
                              ) : (
                                <FormButton
                                  onPress={() => {
                                    setSelectedMilestonID(item.milstone_id);
                                    completeNowMilestone(item.milstone_id);
                                  }}
                                  buttonTitle={Translation.manageMilestoneCompleteNow}
                                  backgroundColor={Constant.greenColor}
                                  textColor={Constant.whiteColor}
                                  loader={
                                    selectedMilestonID == item.milstone_id
                                      ? loading
                                      : null
                                  }
                                />
                              )}
                            </View>
                            <View style={{width: '49%'}}>
                              <FormButton
                                onPress={() =>
                                  getInvoiceDetail(item.invoice_id)
                                }
                                buttonTitle={Translation.manageMilestoneCheckInvoice}
                                backgroundColor={Constant.blueColor}
                                textColor={Constant.whiteColor}
                                // loader={loading}
                              />
                            </View>
                          </View>
                        ) : item.updated_status == 'pending' ||
                          item.updated_status == 'pay_now' ? (
                          <FormButton
                            onPress={() => payMilestone(index)}
                            buttonTitle={Translation.manageMilestonePayNow}
                            backgroundColor={Constant.greenColor}
                            textColor={Constant.whiteColor}
                            // loader={loading}
                          />
                        ) : null}
                      </>
                    ) : (
                      <View
                        style={[
                          styles.rowView,
                          {justifyContent: 'space-between', width: '100%'},
                        ]}>
                        {route.params.type == 'job' && (
                          <View style={{width: '48%'}}>
                            <FormButton
                              onPress={() => editMilestone(item)}
                              buttonTitle={Translation.globalEdit}
                              backgroundColor={Constant.primaryColor}
                              textColor={Constant.whiteColor}
                              // loader={loading}
                            />
                          </View>
                        )}
                        <View
                          style={{
                            width: route.params.type == 'job' ? '48%' : '100%',
                          }}>
                          <FormButton
                            onPress={() => {}}
                            buttonTitle={Translation.manageMilestonePending}
                            backgroundColor={'#767676'}
                            textColor={Constant.whiteColor}
                            // loader={loading}
                          />
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          />
        </View>
        {(route.params.status == 'ongoing' ||
          route.params.status == 'complete') && (
          <View style={styles.cardView}>
            <Text style={styles.inputHeading}>{Translation.manageMilestoneProjectHistory}</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{
                borderColor: Constant.borderColor,
                borderWidth: 1,
                borderRadius: 10,
              }}
              data={
                route.params.type == 'proposal'
                  ? historyDetail.project_history
                  : historyDetail.proposal_freelancers[route.params.index]
                      .project_history
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
                  {Translation.manageMilestoneNoHistoryFound}
                </Text>
              }
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedHistory(selectedHistory == index ? null : index)
                  }
                  style={{
                    borderBottomColor:
                      route.params.type == 'proposal'
                        ? index == historyDetail.project_history.length - 1
                          ? Constant.whiteColor
                          : Constant.borderColor
                        : index ==
                          historyDetail.proposal_freelancers[route.params.index]
                            .project_history.length -
                            1
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
                              buttonTitle={Translation.manageMilestoneAttachments}
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
                <Text style={styles.inputHeading}>{Translation.manageMilestoneDescription}</Text>
                <View style={styles.multilineTextInputView}>
                  <TextInput
                    placeholder={Translation.manageMilestoneDescriptionPlaceholder}
                    multiline
                    value={detail}
                    onChangeText={text => setDetail(text)}
                    placeholderTextColor={Constant.lightGrayColor}
                    style={styles.multilineTextInput}
                  />
                </View>
                <Text style={styles.inputHeading}>
                 {Translation.manageMilestoneUploadRelevantProjectFiles}
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
                          {Translation.manageMilestoneFileSize}{(item.size / 1024).toFixed(2)} KB
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
                  buttonTitle={Translation.manageMilestoneSendNow}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={loading}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
      <RBSheet
        ref={RBSheetAddNewMilestone}
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
             {Translation.manageMilestoneAddNewMilestone}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetAddNewMilestone.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.manageMilestoneMilestoneTitle}
              <Text style={{color: Constant.astaricColor}}>*</Text>
            </Text>
            <FormInput
              labelValue={milestoneTitle}
              onChangeText={text => setMilestoneTitle(text)}
              placeholderText={Translation.manageMilestoneMilestoneTitlePlceholder}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <Text style={styles.inputHeading}>
              {Translation.manageMilestoneDueDateForm}
              <Text style={{color: Constant.astaricColor}}>*</Text>
            </Text>
            <FormInput
              labelValue={dueDate}
              onChangeText={text => setDeadlineDate(text)}
              placeholderText={Translation.manageMilestoneDueDateForm}
              keyboardType="email-address"
              autoCorrect={false}
              editable={false}
              iconType={'calendar'}
              iconColor= {Constant.iconColor}
              action={true}
              actionIcon={() => {if (Platform.OS == 'ios') {
                RBSheetCalender.current.open();
              } else {
                setShowDatePicker(true);
              }}}
            />
            <Text style={styles.inputHeading}>
              {Translation.manageMilestonePrice}
              <Text style={{color: Constant.astaricColor}}>*</Text>
            </Text>
            <FormInput
              labelValue={milestonePrice}
              onChangeText={text => setMilestonePrice(text)}
              placeholderText={Translation.manageMilestonePricePlaceholder}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <Text style={styles.inputHeading}>
              {Translation.manageMilestoneDescription}
              <Text style={{color: Constant.astaricColor}}>*</Text>
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder= {Translation.manageMilestoneDescription}
                multiline
                value={milestoneDesc}
                onChangeText={text => setMilestoneDesc(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
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
              onPress={() => saveUpdateMilestone()}
              buttonTitle={Translation.globalSaveUpdate}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
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
                {Translation.manageMilestonePickDate}
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
                RBSheetCalender.current.close();
                setDueDate(searchedDate);
              }}
              buttonTitle={Translation.globalOk}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
            />
          </View>
        </RBSheet>
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
              {Translation.manageMilestoneCancelReason}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetSendReason.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>{Translation.manageMilestoneReason}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.manageMilestoneTypeReasonHere}
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
                  : cancelJob()
              }
              buttonTitle={Translation.manageMilestoneCancelReason}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
      <RBSheet
        ref={RBSheetInvoiceDetail}
        height={Dimensions.get('window').height * 0.7}
        duration={250}
        customStyles={{
          container: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 25,
            backgroundColor: 'transparent',
          },
        }}>
        {Object.keys(invoiceDetail).length !== 0 && (
          <View style={styles.RBSheetMainView}>
            <View style={styles.RBSheetHeaderView}>
              <Text style={styles.freelancerDetailCardNameTextStyle}>
                {Translation.manageMilestoneInvoiceDetail}
              </Text>
              <TouchableOpacity
                onPress={() => RBSheetInvoiceDetail.current.close()}
                style={styles.RBSheetHeaderCrossView}>
                <Feather name="x" color={'#484848'} size={16} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  borderColor: Constant.borderColor,
                  borderWidth: 1,
                  borderRadius: 6,
                  padding: 10,
                  marginTop: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      {Translation.manageMilestoneProjectTitle}
                    </Text>
                    <Text style={[styles.inputHeading, {marginTop: 0}]}>
                      {invoiceDetail.invoice_details.title}
                      {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                    </Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text
                      style={[
                        styles.inputHeading,
                        {color: Constant.blueColor, fontSize: 18, marginTop: 0},
                      ]}>
                      {Translation.manageMilestoneInvoice}
                      {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                    </Text>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      #{selectedInovice}
                    </Text>
                    <Text style={styles.saveButtonDesc}>
                      {invoiceDetail.created_date}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderTopColor: Constant.borderColor,
                    borderTopWidth: 1,
                  }}
                />
                <Text style={[styles.inputHeading, {marginBottom: 0}]}>{Translation.manageMilestoneTo}</Text>
                <Text style={[styles.saveButtonDesc, {marginBottom: 0}]} />
                <HTML
                  tagsStyles={tagsStyles}
                  source={{html: invoiceDetail.billing_to}}
                />
                <View
                  style={{
                    borderTopColor: Constant.borderColor,
                    borderTopWidth: 1,
                  }}
                />
                <Text style={styles.inputHeading}>{Translation.manageMilestoneFrom}</Text>
                <HTML
                  tagsStyles={tagsStyles}
                  source={{html: invoiceDetail.from_billing_address}}
                />
                <View
                  style={{
                    borderTopColor: Constant.borderColor,
                    borderTopWidth: 1,
                  }}
                />
                <View
                  style={{
                    backgroundColor: Constant.grayColor,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginTop: 10,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      {Translation.manageMilestoneItem}
                    </Text>
                    <Text style={styles.inputHeading}>
                      {invoiceDetail.invoice_details.counter}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      {Translation.manageMilestoneDescription}
                    </Text>
                    <Text style={styles.inputHeading}>
                      {invoiceDetail.invoice_details.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      {Translation.manageMilestoneCost}
                    </Text>
                    <Text style={styles.inputHeading}>
                      {invoiceDetail.invoice_details.cost}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                      {Translation.manageMilestoneTaxes}
                    </Text>
                    <Text style={styles.inputHeading}>
                      {invoiceDetail.invoice_details.taxes}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                     {Translation.manageMilestoneAmount}
                    </Text>
                    <Text style={styles.inputHeading}>
                      {invoiceDetail.invoice_details.amount}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={[styles.saveButtonDesc, {marginBottom: 0}]}>
                    {Translation.manageMilestoneSubtotal}
                  </Text>
                  <Text style={styles.inputHeading}>
                    {invoiceDetail.subtotal}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: Constant.primaryColor,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginTop: 10,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={[
                        styles.inputHeading,
                        {color: Constant.whiteColor},
                      ]}>
                      {Translation.manageMilestoneTotal}
                    </Text>
                    <Text
                      style={[
                        styles.inputHeading,
                        {color: Constant.whiteColor},
                      ]}>
                      {invoiceDetail.total}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.saveButtonDesc, {marginVertical: 10}]}>
                  {Translation.manageMilestoneInvoiceNote}
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </RBSheet>
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
             {Translation.manageMilestoneCompleteProject}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetFeeback.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>{Translation.manageMilestoneFeedback}</Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.manageMilestoneAddFeedback}
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
              onPress={() => completeJob()}
              buttonTitle={Translation.manageMilestoneSendFeedback}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
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

export default ManageMilestone;
