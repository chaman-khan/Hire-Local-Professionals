import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import Notification from '../components/Notification';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {useSelector, useDispatch} from 'react-redux';
import {
  BallIndicator,
  BarIndicator,
  MaterialIndicator,
} from 'react-native-indicators';
import {useIsFocused} from '@react-navigation/native';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';

const InvoiceList = () => {
  const profileInfo = useSelector(state => state.value.profileInfo);
  const token = useSelector(state => state.value.token);
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const isFocused = useIsFocused();
  const [invoices, setInvoices] = useState([]);
  const [mainIndex, setMainIndex] = useState(null);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [desc, setDesc] = useState('');
  const onEndReachedCalledDuringMomentum = useRef(true);

  useEffect(() => {
    if (isFocused) {
      getInvoiceListing();
    }
  }, [isFocused]);

  const getInvoiceListing = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'profile/get_invoice_listings?user_id=' +
        userInfo.id +
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
        setLoader(false);
        if (responseJson.type == 'success') {
          setInvoices(responseJson.invoices);
          setpageNumber(2);
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreInvoices = async () => {
    setSpinner(true);
    return fetch(
      Constant.BaseUrl +
        'profile/get_invoice_listings?user_id=' +
        userInfo.id +
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
        setSpinner(false);
        setInvoices(invoices.concat(responseJson.invoices));
        setpageNumber(pageNumber + 1);
      })
      .catch(error => {
        setSpinner(false);
        console.error(error);
      });
  };
  const downloadInvoice = (item, index) => {
    setMainIndex(index);
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/download_invoice',
        {
          user_id: userInfo.id,
          order_id: item.post_id,
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
          // checkPermission(
          //   response.data.current_url.file_url,
          //   response.data.current_url.file_path
          // );
          // removeInvoice(response.data.path)
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const checkPermission = async (link, path) => {
    if (Platform.OS === 'ios') {
      setLoading(false);
      downloadMedia(link, path);
    } else {
      setLoading(false);
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
          downloadMedia(link, path);
        } else {
          setShowAlert(true);
          setType('error');
          setAlertTitle('Oops');
          setDesc('Storage Permission Not Granted');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const downloadMedia = (link, path) => {
    let URL = link;
    let date = new Date();
    let ext = '.pdf';
    const {config, fs} = RNFetchBlob;
    let options;
    let PictureDir = fs.dirs.PictureDir;
    options = Platform.select({
      ios: {
        fileCache: true,
        path:
          PictureDir +
          '/Workreap/Invoices/' +
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
            '/Workreap/Invoices/' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: 'Document',
        },
      },
    });
    config(options)
      .fetch('GET', URL)
      .then(res => {
        removeInvoicePDF(path);
        console.log('Success', res);
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(res.data);
        }
      });
  };
  const removeInvoicePDF = path => {
    // setLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'profile/remove_invoice_file',
        {
          user_id: userInfo.id,
          file_path: path,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        console.log('responseReomove', response.data);
      })
      .catch(error => {
        // setLoader(false);
        console.log(error);
      });
  };
  const onEndReachedHandler = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (invoices.length >= 10) {
        loadMoreInvoices();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
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
        title={'Invoices'}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={alertTitle}
        desc={desc}
      />
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
        <View style={[styles.cardView, {flex: 1}]}>
          <View style={styles.invoiceListNotificationView}>
            <Text style={styles.invoiceListNotificationText}>
              {Translation.invoiceListViewable}
            </Text>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{marginTop: 5, marginBottom: 10}}
            data={invoices}
            keyExtractor={(x, i) => i.toString()}
            onEndReached={() => onEndReachedHandler()}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListEmptyComponent={
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop: '50%',
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/images/noData.png')}
                />
                <Text
                  style={[
                    styles.inputHeading,
                    {alignSelf: 'center', fontSize: 16, marginTop: 0},
                  ]}>
                  No record found
                </Text>
              </>
            }
            renderItem={({item, index}) => (
              <View style={styles.invoiceListCard}>
                <View style={styles.invoiceListCardDataView}>
                  <Text style={styles.invoiceListCardDataText}>
                    {Translation.invoiceListOrder}
                  </Text>
                  <Text style={styles.invoiceListCardDataValue}>
                    {item.post_id}
                  </Text>
                </View>
                <View style={styles.invoiceListCardDataView}>
                  <Text style={styles.invoiceListCardDataText}>
                    {Translation.invoiceListCreated}
                  </Text>
                  <Text style={styles.invoiceListCardDataValue}>
                    {item.created_date}
                  </Text>
                </View>
                <View style={styles.invoiceListCardDataView}>
                  <Text style={styles.invoiceListCardDataText}>
                    {Translation.invoiceListAmount}
                  </Text>
                  <Text style={styles.invoiceListCardDataValue}>
                    {item.price}
                  </Text>
                </View>
                {/* <FormButton
                  onPress={() => downloadInvoice(item, index)}
                  buttonTitle={'Download invoice'}
                  backgroundColor={Constant.primaryColor}
                  textColor={Constant.whiteColor}
                  iconName={'download'}
                /> */}
              </View>
            )}
          />
          {spinner == true && (
            <View>
              <BarIndicator count={5} size={20} color={Constant.primaryColor} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default InvoiceList;
