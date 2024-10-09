import {
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect,useRef} from 'react';
import Header from '../components/Header';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import axios from 'axios';
import Notification from '../components/Notification';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
} from 'react-native-popup-dialog';
import {
  BallIndicator,
  BarIndicator,
  MaterialIndicator,
} from 'react-native-indicators';

const PortfoliosLisiting = ({navigation}) => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const isFocused = useIsFocused();
  const [openServices, setOpenServices] = useState(false);
  const [portfolios, setportfolios] = useState([]);
  const [portfolioLoader, setPortfolioLoader] = useState(false);
  const [pageloading, setPageLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertOption, setAlertOption] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState({});
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isFocused) {
      getPortfolioList();
    }
  }, [isFocused,search]);

  const getPortfolioList = async () => {
    setPortfolioLoader(true);
    return fetch(
      Constant.BaseUrl +
        'portfolios/get_portfolios?listing_type=listing&user_id=' +
        userInfo.id +
        '&page_number=1'+
        "&keyword="+search,
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
        if(responseJson.type ==  "success")
        {
          setportfolios(responseJson.portfolios);
          setPageNumber(2)
        }
        setPortfolioLoader(false);
      })
      .catch(error => {
        setPortfolioLoader(false);
        console.error(error);
      });
  };
  const loadMorePortfolioList = async () => {
    setLoader(true);
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'portfolios/get_portfolios?listing_type=listing&user_id=' +
        userInfo.id +
        '&page_number='+pageNumber+
        "&keyword="+search,
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
        if(responseJson.type ==  "success")
        {
          setportfolios(portfolios.concat(responseJson.portfolios));
          setPageNumber(pageNumber + 1);
        }
        setLoader(false);
        setPageLoading(false);

      })
      .catch(error => {
        setLoader(false);
        setPageLoading(false);

        console.error(error);
      });
  };
  const onEndReachedHandler = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (portfolios.length >= 10) {
        loadMorePortfolioList();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  }
  const deletePortfolioList = () => {
    setVisible(false)
    setAlertOption(true);
    setShowAlert(true);
    setType('error');
    setTitle(Translation.portfoliosLisitingAreYouSure);
    setDesc(Translation.portfoliosLisitingCannotBeUndone);
  };
  const deletePortfolioItem = () => {
    setAlertOption(false);
    hideAlert()
    setPortfolioLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'portfolios/delete_portfolio',
        {
          user_id: userInfo.id,
          id: selectedPortfolio.ID,
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
          portfolios.splice(selectedPortfolioIndex, 1);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setSelectedPortfolio({});
          setSelectedPortfolioIndex(null);
          setPortfolioLoader(false);
        } else if (response.data.type == 'error') {
          setShowAlert(false);
          setPortfolioLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setPortfolioLoader(false);
        console.log(error);
      });
  };
  const changePortfolioStatus = (val,item,index) => {
    setPortfolioLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'portfolios/update_post_status',
        {
          user_id: userInfo.id,
          id: item.ID,
          status:val
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          portfolios[index].status = val
          setSelectedStatus(null)
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setPortfolioLoader(false);
        } else if (response.data.type == 'error') {
          setPortfolioLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setPortfolioLoader(false);
        console.log(error);
      });
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
        title={Translation.portfoliosLisitingManagePortfolios}
      />
       <Notification
        option={alertOption}
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        yesAction={deletePortfolioItem}
      />
      <View style={[styles.cardView, {flex: 1}]}>
        <Text style={styles.inputHeading}>{Translation.portfoliosLisitingPortfoliosListing}</Text>
        <View style={styles.managePortfolioSearchView}>
          <Feather name="search" color={Constant.lightGrayColor} size={20} />
          <TextInput
                  style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                  value={search}
                  onChangeText={text => setSearch(text)}
                  placeholder={Translation.inboxSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
                {portfolioLoader && (
                  <MaterialIndicator
                    count={8}
                    size={14}
                    color={Constant.lightGrayColor}
                  />
                )}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={portfolios}
          style={{marginBottom: 10}}
          keyExtractor={(x, i) => i.toString()}
          onEndReached={() => onEndReachedHandler()}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          renderItem={({item, index}) => (
            <>
              <View style={styles.managePortfolioListView}>
                <View style={styles.managePortfolioListTopView}>
                  <Image
                    resizeMode="center"
                    style={styles.managePortfolioListImage}
                    source={{uri:item.portfolio_img}}
                  />
                  <Text style={styles.managePortfolioListHeading}>
                    {item.title}
                  </Text>
                  <View style={{width: '10%', alignItems: 'flex-end'}}>
                    <Feather
                      onPress={() => {
                        setSelectedPortfolio(item)
                        setSelectedPortfolioIndex(index)
                        setVisible(true)}}
                      name="more-vertical"
                      color={Constant.fontColor}
                      size={24}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.managePortfolioListBottomView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: Constant.borderColor,
                    borderBottomWidth: selectedStatus == index ? 1 : 0,
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
                    {item.status == 'publish' ? Translation.portfoliosLisitingPublish : Translation.portfoliosLisitingDraft}
                  </Text>

                  <Feather
                    onPress={() =>
                      setSelectedStatus(selectedStatus == index ? null : index)
                    }
                    name="chevron-down"
                    color={Constant.fontColor}
                    size={24}
                  />
                </View>
                {selectedStatus == index && (
                  <>
                    <TouchableOpacity
                    onPress={() => changePortfolioStatus("publish",item,index)}
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
                        {Translation.portfoliosLisitingPublish}
                      </Text>

                      {item.status == 'publish' && (
                        <Feather
                          onPress={() => setVisible(true)}
                          name="check"
                          color={Constant.fontColor}
                          size={18}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                     onPress={() => changePortfolioStatus("draft",item,index)}
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
                       {Translation.portfoliosLisitingDraft}
                      </Text>

                      {item.status == 'draft' && (
                        <Feather
                          onPress={() => setVisible(true)}
                          name="check"
                          color={Constant.fontColor}
                          size={18}
                        />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
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
           {selectedPortfolio.status != "draft" &&
            <DialogFooter
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Constant.whiteColor,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('PortfolioDetail',{data:selectedPortfolio});
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
                 {Translation.portfoliosLisitingView}
                </Text>
              </TouchableOpacity>
            </DialogFooter>}
            <DialogFooter
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  navigation.navigate('AddPortfolios',{data:selectedPortfolio});
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
                  {Translation.globalEdit}
                </Text>
              </TouchableOpacity>
            </DialogFooter>
            <DialogFooter
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => deletePortfolioList()}
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

export default PortfoliosLisiting;
