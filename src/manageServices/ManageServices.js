import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import Notification from '../components/Notification';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import axios from 'axios';
import FormInput from '../components/FormInput';
import {
  BallIndicator,
  BarIndicator,
  MaterialIndicator,
} from 'react-native-indicators';
import {useIsFocused} from '@react-navigation/native';
import PostService from './PostService';
import PostQoute from './PostQoute';
import QuoteCard from './QuoteCard';
import PostedServiceCard from './PostedServiceCard';
import AddonsServiceCard from './AddonsServiceCard';
import ServiceStatusCard from './ServiceStatusCard';
import ServiceCancelStatusCard from './ServiceCancelStatusCard';
import Dialog, {DialogFooter, DialogButton} from 'react-native-popup-dialog';
import {useSelector, useDispatch} from 'react-redux';
import {updateServiceTab, updateServiceItem} from '../redux/GlobalStateSlice';

const ManageServices = ({route, navigation}) => {
  const token = useSelector(state => state.value.token);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const userInfo = useSelector(state => state.value.userInfo);
  const billing = useSelector(state => state.value.billing);
  const shipping = useSelector(state => state.value.shipping);
  const isFocused = useIsFocused();
  const selectedSection = useSelector(state => state.global.serviceTab);
  const dispatch = useDispatch();
  const [searchAddons, setSearchAddons] = useState('');
  const [searchPostedService, setsearchPostedService] = useState('');
  const [searchQoute, setsearchQoute] = useState('');
  const [searchOngoingService, setSearchOngoingService] = useState('');
  const [searchCompletedService, setSearchCompletedService] = useState('');
  const [searchCancelledService, setSearchCancelledService] = useState('');
  const [pageloading, setPageLoading] = useState(false);
  const [addonsPage, setAddonsPage] = useState(1);
  const [qoutePage, setQoutePage] = useState(1);
  const [postedServicePage, setpostedServicePage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [detail, setDetail] = useState('');
  const [reason, setReason] = useState('');
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(true);
  const [qouteLoader, setQouteLoader] = useState(false);
  const [serviceLoader, setServiceLoader] = useState(false);
  const [addonsLoader, setAddonsLoader] = useState(false);
  const [ongoingLoader, setOngoingLoader] = useState(false);
  const [completeLoader, setCompleteLoader] = useState(false);
  const [cancelLoader, setCancelLoader] = useState(false);
  const [reload, setReload] = useState(false);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [deleteTpye, setDeleteTpye] = useState('');
  const [addonsTitle, setAddonsTitle] = useState('');
  const [addonsPrice, setAddonsPrice] = useState('');
  const [addonsDesc, setAddonsDesc] = useState('');
  const [selectedAddonsID, setselectedAddonsID] = useState(null);
  const [selectedQouteID, setselectedQouteID] = useState(null);
  const [selectedPostedServicesIndex, setSelectedPostedServicesIndex] =
    useState(null);
  const [selectedQouteIndex, setSelectedQouteIndex] = useState(null);
  const [selectedQouteItem, setSelectedQouteItem] = useState(null);
  const [postedServices, setPostedServices] = useState([]);
  const [selectedPostedServiceItem, setSelectedPostedServiceItem] =
    useState(null);
  const [serviceListing, setServiceListing] = useState([]);
  const [employeeListing, setEmployeeListing] = useState([]);
  const [selectedPostedServices, setselectedPostedServices] = useState('');
  const [addonsServices, setAddonsServices] = useState([]);
  const [qoutes, setQoutes] = useState([]);
  const [ongoingServices, setOngoingServices] = useState([]);
  const [completeServices, setCompleteServices] = useState([]);
  const [cancelledServices, setCancelledServices] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertOption, setAlertOption] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tabs, setTabs] = useState([
    {
      name:
        profileInfo.user_type == 'employer'
          ? ''
          : Translation.manageServiceTabPostService,
    },
    {
      name:
        profileInfo.user_type == 'employer'
          ? ''
          : Translation.manageServiceTabSendQoute,
    },
    {name: Translation.manageServiceTabQouteListing},
    {
      name:
        profileInfo.user_type == 'employer'
          ? ''
          : Translation.manageServiceTabPostedService,
    },
    {
      name:
        profileInfo.user_type == 'employer'
          ? ''
          : Translation.manageServiceTabAddonsServices,
    },
    {name: Translation.manageServiceTabOngoingServices},
    {name: Translation.manageServiceTabCompletedServices},
    {name: Translation.manageServiceTabCancelledServices},
  ]);
  const RBSheetAddNew = useRef();
  const RBSheetServiceDetail = useRef();
  const RBSheetViewReason = useRef();
  const RBSheetViewDecline = useRef();
  const refList = useRef();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const scrolTopRef = useRef();

  const getItemLayout = (data, index) => ({
    length: 120,
    offset:
      profileInfo.user_type == 'freelancer'
        ? 120 * index
        : index == 2
        ? 0
        : 25 * index,
    index,
  });
  useEffect(() => {
    if (selectedSection != 1) {
      setSelectedQouteItem(null);
    }
    if (selectedSection != 0) {
      setSelectedPostedServiceItem(null);
    }
    refList.current.scrollToIndex({
      animated: true,
      index: selectedSection,
      viewPosition: 0,
    });
  }, [selectedSection]);

  useEffect(() => {
    if (isFocused) {
      refList.current.scrollToIndex({
        animated: true,
        index: selectedSection,
        viewPosition: 0,
      });
      setRefreshFlatList(!refreshFlatlist);
      getPostedServices();
      getQouteListing();
      getAddonsService();
      getOngoingService();
      getCompletedService();
      getCancelledService();
      getMyServices();
      getEmployerList();
    }
  }, [
    isFocused,
    reload,
    searchCancelledService,
    searchCompletedService,
    searchOngoingService,
    searchQoute,
    searchAddons,
  ]);
  const reloadData = () => {
    setReload(!reload);
  };
  const openServiceHistoryRBSHeet = () => {
    RBSheetServiceDetail.current.open();
  };
  const viewReasonRbSheet = item => {
    setReason(item.feedback);
    RBSheetViewReason.current.open();
  };
  const viewStatusDailog = (item, index) => {
    setselectedPostedServices(item);
    setSelectedPostedServicesIndex(index);
    setVisible(true);
  };
  const getPostedServices = async () => {
    setServiceLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services?user_id=' +
        userInfo.id +
        '&type=search' +
        '&keyword=' +
        searchPostedService +
        '&page_number=1',
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
          setPostedServices(responseJson.services);
          setpostedServicePage(2);
        }
        setServiceLoader(false);
      })
      .catch(error => {
        setServiceLoader(false);
        console.error(error);
      });
  };
  const loadMorePostedServices = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services?user_id=' +
        userInfo.id +
        '&type=search' +
        '&keyword=' +
        searchPostedService +
        '&page_number=' +
        postedServicePage,
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
          setPostedServices(postedServices.concat(responseJson.services));
          setpostedServicePage(postedServicePage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        console.error(error);
      });
  };
  const getQouteListing = async () => {
    setQouteLoader(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_qoutes?listing_type=search&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchQoute +
        '&posts_per_page=10' +
        '&page_number=1',
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
          setQoutes(responseJson.listing);
          setQoutePage(2);
        }
        setQouteLoader(false);
      })
      .catch(error => {
        setQouteLoader(false);
        console.error(error);
      });
  };
  const loadMoreQouteListing = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_qoutes?listing_type=search&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchQoute +
        '&posts_per_page=10' +
        '&page_number=' +
        qoutePage,
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
          setQoutes(qoutes.concat(responseJson.listing));
          setQoutePage(qoutePage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        console.error(error);
      });
  };
  const getAddonsService = async () => {
    setAddonsLoader(true);
    return fetch(
      Constant.BaseUrl +
        'services/get_addons_services?user_id=' +
        userInfo.id +
        '&type=search' +
        +'&keyword=' +
        searchAddons +
        '&page_number=1',
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
          setAddonsServices(responseJson.items);
          setAddonsPage(2);
          RBSheetAddNew.current.close();
        }
        setAddonsLoader(false);
      })
      .catch(error => {
        setAddonsLoader(false);
        console.error(error);
      });
  };
  const loadMoreAddonsService = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'services/get_addons_services?user_id=' +
        userInfo.id +
        +'&keyword=' +
        searchAddons +
        '&page_number=' +
        addonsPage,
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
          setAddonsServices(addonsServices.concat(responseJson.items));
          setAddonsPage(addonsPage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        console.error(error);
      });
  };
  const getOngoingService = async () => {
    setOngoingLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=hired&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchOngoingService +
        '&page_number=1',
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
          setOngoingServices(responseJson.listing);
          setOngoingPage(2);
        }
        setOngoingLoader(false);
      })
      .catch(error => {
        setOngoingLoader(false);
        console.error(error);
      });
  };
  const loadMoreOngoingService = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=hired&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchOngoingService +
        '&page_number=' +
        ongoingPage,
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
          setOngoingServices(ongoingServices.concat(responseJson.listing));
          setOngoingPage(ongoingPage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        console.error(error);
      });
  };
  const getCompletedService = async () => {
    setCompleteLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=completed&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCompletedService +
        '&page_number=1',
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
          setCompleteServices(responseJson.listing);
          setCompletedPage(2);
        }

        setCompleteLoader(false);
      })
      .catch(error => {
        setCompleteLoader(false);
        console.error(error);
      });
  };
  const loadMoreCompletedService = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=completed&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCompletedService +
        '&page_number=' +
        completedPage,
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
          setCompleteServices(completeServices.concat(responseJson.listing));
          setCompletedPage(completedPage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        console.error(error);
      });
  };
  const getCancelledService = async () => {
    setCancelLoader(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=cancelled&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCancelledService +
        '&page_number=1',
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
        setLoader(false);
        if (responseJson.type == 'success') {
          setCancelledServices(responseJson.listing);
          setCancelledPage(2);
        }
        setCancelLoader(false);
      })
      .catch(error => {
        setCancelLoader(false);
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreCancelledService = async () => {
    setPageLoading(true);
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_services_by_type?type=cancelled&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCancelledService +
        '&page_number=' +
        cancelledPage,
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
        setLoader(false);
        if (responseJson.type == 'success') {
          setCancelledServices(cancelledServices.concat(responseJson.listing));
          setCancelledPage(cancelledPage + 1);
        }
        setPageLoading(false);
      })
      .catch(error => {
        setPageLoading(false);
        setLoader(false);
        console.error(error);
      });
  };
  const editPostedService = () => {
    setVisible(false);
    setSelectedPostedServiceItem(selectedPostedServices);
    dispatch(updateServiceTab(0));
  };
  const newAddonsService = () => {
    RBSheetAddNew.current.open();
    setselectedAddonsID(null);
    setAddonsTitle('');
    setAddonsPrice('');
    setAddonsDesc('');
  };
  const editAddonsService = item => {
    RBSheetAddNew.current.open();
    setselectedAddonsID(item.ID);
    setAddonsTitle(item.title);
    setAddonsPrice(item.price);
    setAddonsDesc(item.description);
  };
  const updateAddonsService = () => {
    setAddonsLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'services/add_addon_service',
        {
          user_id: userInfo.id,
          submit_type: selectedAddonsID != null ? 'update' : '',
          id: selectedAddonsID != null ? selectedAddonsID : '',
          title: addonsTitle,
          description: addonsDesc,
          price: addonsPrice,
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
          getAddonsService();
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else if (response.data.type == 'error') {
          setAddonsLoader(false);
          RBSheetAddNew.current.close();
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
  const deleteAddonsService = (id, index) => {
    setAddonsLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'services/delete_addon_service',
        {
          user_id: userInfo.id,
          id: id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          addonsServices.splice(index, 1);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setAddonsLoader(false);
        } else if (response.data.type == 'error') {
          setAddonsLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        // setLoader(false)
        // setLoading(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const onEndReachedHandlerAddons = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (addonsServices.length >= 10) {
        loadMoreAddonsService();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerPosted = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (postedServices.length >= 10) {
        loadMorePostedServices();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerQoute = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (qoutes.length >= 10) {
        loadMoreQouteListing();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerOngoing = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (ongoingServices.length >= 10) {
        loadMoreOngoingService();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCompleted = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (completeServices.length >= 10) {
        loadMoreCompletedService();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCancelled = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (cancelledServices.length >= 10) {
        loadMoreCancelledService();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const updateQouteList = item => {
    if (profileInfo.user_type == 'freelancer') {
      setSelectedQouteItem(item);
      dispatch(updateServiceTab(1));
    } else {
      acceptPayQoute(item);
    }
  };
  const deleteQouteList = (id, index) => {
    setSelectedQouteIndex(index);
    setselectedQouteID(id);
    if (profileInfo.user_type == 'freelancer') {
      setDeleteTpye('qoute');
      setAlertOption(true);
      setShowAlert(true);
      setType('error');
      setTitle(Translation.manageServiceAreUSure);
      setDesc(Translation.manageServiceActionCannotUndone);
    } else {
      setDetail('');
      RBSheetViewDecline.current.open();
    }
  };
  const deleteQouteItem = () => {
    setQouteLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'listing/remove_qoutes',
        {
          user_id: userInfo.id,
          quote_id: selectedQouteID,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setShowAlert(false);
          qoutes.splice(selectedQouteIndex, 1);

          setselectedQouteID(null);
          setSelectedQouteIndex(null);
          setQouteLoader(false);
        } else if (response.data.type == 'error') {
          // setShowAlert(false);
          setQouteLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setQouteLoader(false);
        console.log(error);
      });
  };
  const acceptPayQoute = item => {
    setQouteLoader(true);
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
    payment_data_map_array.order_type = 'quotes';
    payment_data_map_array.quote_id = item.quote_listing_basic.id;
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
          setQouteLoader(false);

          navigation.navigate('Checkout', {link: response.data.url});
        } else if (response.data.type == 'error') {
          setQouteLoader(false);
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
  const declineQoute = () => {
    setQouteLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'listing/decline_qoutes',
        {
          user_id: userInfo.id,
          quote_id: selectedQouteID,
          reason: detail,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          RBSheetViewDecline.current.close();
          qoutes.splice(selectedQouteIndex, 1);
          setDetail('');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setselectedQouteID(null);
          setSelectedQouteIndex(null);
          setQouteLoader(false);
        } else if (response.data.type == 'error') {
          RBSheetViewDecline.current.close();
          setQouteLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setQouteLoader(false);
        console.log(error);
      });
  };
  const deletePostedItem = () => {
    setShowAlert(false);
    setAlertOption(false);
    setServiceLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'services/delete_service',
        {
          user_id: userInfo.id,
          id: selectedPostedServices.ID,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          postedServices.splice(selectedPostedServicesIndex, 1);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setSelectedPostedServicesIndex(null);
          setServiceLoader(false);
        } else if (response.data.type == 'error') {
          setServiceLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setQouteLoader(false);
        console.log(error);
      });
  };
  const getEmployerList = async () => {
    return fetch(
      Constant.BaseUrl +
        'listing/get_user_by_chat_qoutes?user_id=' +
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
        setEmployeeListing(responseJson.employers_list);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const getMyServices = async () => {
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancer_posted_services?user_id=' +
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
        setServiceListing(responseJson.listing);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const deletePostedServiceList = () => {
    setVisible(false);
    setDeleteTpye('service');
    setAlertOption(true);
    setShowAlert(true);
    setType('error');
    setTitle(Translation.manageServiceAreUSure);
    setDesc(Translation.manageServiceActionCannotUndone);
  };
  const deleteAlertView = () => {
    if (deleteTpye == 'service') {
      deletePostedItem();
    } else if (deleteTpye == 'qoute') {
      deleteQouteItem();
    }
  };

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Notification
        option={alertOption}
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        yesAction={deleteAlertView}
      />
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.manageServiceHeader}
      />
      <View style={styles.freelancerDetailTopTabView}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          ref={refList}
          scrollEnabled
          extraData={refreshFlatlist}
          getItemLayout={getItemLayout}
          // initialScrollIndex={selectedSection}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => dispatch(updateServiceTab(index))}
                  style={[
                    styles.freelancerDetailTopTabViewSingle,
                    {
                      backgroundColor:
                        selectedSection == index
                          ? Constant.greenColor
                          : Constant.whiteColor,
                          borderColor: selectedSection == index?
                          Constant.whiteColor:
                          Constant.borderColor,
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
        <>
          {selectedSection == 0 && (
            <PostService
              addons={addonsServices}
              reload={reloadData}
              serviceItem={selectedPostedServiceItem}
            />
          )}
          {selectedSection == 1 && (
            <PostQoute
              service={serviceListing}
              employee={employeeListing}
              reload={reloadData}
              qouteItem={selectedQouteItem}
            />
          )}
          {selectedSection == 2 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <Text style={styles.inputHeading}>
                {Translation.manageServiceQoutesListing}
              </Text>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchQoute}
                  onChangeText={text => setsearchQoute(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {qouteLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                // ref={scrolTopRef}
                showsVerticalScrollIndicator={false}
                data={qoutes}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerQoute()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <QuoteCard
                    item={item}
                    index={index}
                    editQoute={updateQouteList}
                    deleteQoute={deleteQouteList}
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          {selectedSection == 3 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <Text style={styles.inputHeading}>
                {Translation.manageServiceServicesListing}
              </Text>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchPostedService}
                  onChangeText={text => {
                    setReload(!reload);
                    setsearchPostedService(text);
                  }}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {serviceLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={postedServices}
                ref={scrolTopRef}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerPosted()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <PostedServiceCard
                    item={item}
                    index={index}
                    showStatus={viewStatusDailog}
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          {selectedSection == 4 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>
                  {Translation.manageServiceAddonsServicesListing}
                </Text>
                <TouchableOpacity onPress={() => newAddonsService()}>
                  <Feather name={'plus'} color={Constant.fontColor} size={22} />
                </TouchableOpacity>
              </View>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchAddons}
                  onChangeText={text => setSearchAddons(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {addonsLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={addonsServices}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerAddons()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <AddonsServiceCard
                    item={item}
                    index={index}
                    editAddons={editAddonsService}
                    deleteAddons={deleteAddonsService}
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          {selectedSection == 5 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <Text style={styles.inputHeading}>
                {Translation.manageServiceTabOngoingServices}
              </Text>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchOngoingService}
                  onChangeText={text => setSearchOngoingService(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {ongoingLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={ongoingServices}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerOngoing()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <ServiceStatusCard
                    item={item}
                    viewHistory={openServiceHistoryRBSHeet}
                    status="ongoing"
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          {selectedSection == 6 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <Text style={styles.inputHeading}>
                {Translation.manageServiceTabCompletedServices}
              </Text>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchCompletedService}
                  onChangeText={text => setSearchCompletedService(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {completeLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={completeServices}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerCompleted()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <ServiceStatusCard
                    item={item}
                    status="complete"
                    viewHistory={openServiceHistoryRBSHeet}
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          {selectedSection == 7 && (
            <View style={[styles.cardView, {flex: 1}]}>
              <Text style={styles.inputHeading}>
                {Translation.manageServiceTabCancelledServices}
              </Text>
              <View style={styles.managePortfolioSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={searchCancelledService}
                  onChangeText={text => setSearchCancelledService(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {cancelLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={cancelledServices}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerCancelled()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <ServiceCancelStatusCard
                    item={item}
                    showReason={viewReasonRbSheet}
                    status="cancel"
                  />
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
                        {alignSelf: 'center', fontSize: 16, marginTop: 0},
                      ]}>
                      {Translation.globalNoRecordFound}
                    </Text>
                  </>
                }
              />
              {pageloading == true && (
                <View>
                  <BarIndicator
                    count={5}
                    size={20}
                    color={Constant.primaryColor}
                  />
                </View>
              )}
            </View>
          )}
          <RBSheet
            ref={RBSheetAddNew}
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
                  {Translation.manageServiceServiceDescription}
                </Text>
                <TouchableOpacity
                  onPress={() => RBSheetAddNew.current.close()}
                  style={styles.RBSheetHeaderCrossView}>
                  <Feather name="x" color={'#484848'} size={16} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputHeading}>
                  {Translation.manageServiceAddonsTitle}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={addonsTitle}
                  onChangeText={text => setAddonsTitle(text)}
                  placeholderText={
                    Translation.manageServiceAddonsTitlePlaceholder
                  }
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                <Text style={styles.inputHeading}>
                  {Translation.manageServicePrice}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <FormInput
                  labelValue={addonsPrice}
                  onChangeText={text => setAddonsPrice(text)}
                  placeholderText={Translation.manageServicePricePlaceholder}
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                <Text style={styles.inputHeading}>
                  {Translation.manageServiceAddonsDescription}
                  <Text style={{color: Constant.astaricColor}}>*</Text>
                </Text>
                <View style={styles.multilineTextInputView}>
                  <TextInput
                    placeholder={
                      Translation.manageServiceAddonsDescriptionPlaceholder
                    }
                    multiline
                    value={addonsDesc}
                    onChangeText={text => setAddonsDesc(text)}
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
                  onPress={() => updateAddonsService()}
                  buttonTitle={Translation.globalSaveUpdate}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  loader={addonsLoader}
                />
              </ScrollView>
            </View>
          </RBSheet>

          <RBSheet
            ref={RBSheetViewReason}
            // height={Dimensions.get('window').height * 0.5}
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
                  {Translation.manageServiceRejectionReason}
                </Text>
                <TouchableOpacity
                  onPress={() => RBSheetViewReason.current.close()}
                  style={styles.RBSheetHeaderCrossView}>
                  <Feather name="x" color={'#484848'} size={16} />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, width: '97%'}}>
                <Text style={styles.manageServicesRBSReasonText}>{reason}</Text>
              </View>
              <FormButton
                onPress={() => RBSheetViewReason.current.close()}
                buttonTitle={Translation.globalOk}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
              />
            </View>
          </RBSheet>
          <RBSheet
            ref={RBSheetViewDecline}
            height={Dimensions.get('window').height * 0.35}
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
                  {Translation.manageServiceDeclineQuote}
                </Text>
                <TouchableOpacity
                  onPress={() => RBSheetViewDecline.current.close()}
                  style={styles.RBSheetHeaderCrossView}>
                  <Feather name="x" color={'#484848'} size={16} />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, width: '97%'}}>
                <View style={styles.multilineTextInputView}>
                  <TextInput
                    placeholder={Translation.manageServiceAddReason}
                    multiline
                    value={detail}
                    onChangeText={text => setDetail(text)}
                    placeholderTextColor={Constant.lightGrayColor}
                    style={styles.multilineTextInput}
                  />
                </View>
              </View>
              <FormButton
                onPress={() => declineQoute()}
                buttonTitle={Translation.manageServiceDeclineQuote}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
              />
            </View>
          </RBSheet>
        </>
      )}
      <Dialog
        onTouchOutside={() => {
          setVisible(false);
        }}
        dialogStyle={{
          overflow: 'hidden',
          width: Dimensions.get('window').width / 1.3,
        }}
        visible={visible}
        footer={
          <>
            <DialogFooter
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Constant.whiteColor,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('ServiceDetail', {
                    item: selectedPostedServices,
                    edit: true,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: Constant.fontColor,
                    fontSize: 16,
                    lineHeight: 26,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                  }}>
                  {Translation.manageServiceView}
                </Text>
              </TouchableOpacity>
            </DialogFooter>
            <DialogFooter
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => editPostedService()}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: Constant.fontColor,
                    fontSize: 16,
                    lineHeight: 26,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                  }}>
                  {Translation.globalEdit}
                </Text>
              </TouchableOpacity>
            </DialogFooter>
            <DialogFooter
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => deletePostedServiceList()}
                style={{flexDirection: 'row', paddingVertical: 10}}>
                <Text
                  style={{
                    color: Constant.fontColor,
                    fontSize: 16,
                    lineHeight: 26,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                  }}>
                  {Translation.globalDelete}
                </Text>
              </TouchableOpacity>
            </DialogFooter>
            <DialogFooter>
              <DialogButton
                textStyle={{
                  fontSize: 15,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                }}
                text={Translation.globalCancel}
                onPress={() => {
                  setVisible(false);
                }}
              />
            </DialogFooter>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default ManageServices;
