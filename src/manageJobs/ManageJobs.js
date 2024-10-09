import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import {useIsFocused} from '@react-navigation/native';
import Translation from '../constants/Translation';
import Notification from '../components/Notification';
import PostJob from './PostJob';
import PostedJob from './PostedJob';
import {useSelector, useDispatch} from 'react-redux';
import JobStatusCard from './JobStatusCard';
import {updateJobTab} from '../redux/GlobalStateSlice';
import {
  BallIndicator,
  BarIndicator,
  MaterialIndicator,
} from 'react-native-indicators';

const ManageJobs = ({route, navigation}) => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const selectedSection = useSelector(state => state.global.jobTab);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [jobLoader, setJobLoader] = useState(false);
  const [reload, setReload] = useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [searchOngoing, setSearchOngoing] = useState('');
  const [searchComplete, setSearchComplete] = useState('');
  const [searchCancel, setSearchCancel] = useState('');
  const [pageloading, setPageLoading] = useState(false);
  const [pagePostJob, setPagePostJob] = useState(1);
  const [pageOngoingJob, setPageOngoingJob] = useState(1);
  const [pageCompleteJob, setPageCompleteJob] = useState(1);
  const [pageCancelJob, setPageCancelJob] = useState(1);
  const [selectedJob, setselectedJob] = useState(null);
  const [selectedJobId, setselectedJobId] = useState(null);
  const [selectedJobIndex, setselectedJobIndex] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [cancelledJobs, setCancelledJobs] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertOption, setAlertOption] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tabs, setTabs] = useState([
    {name: Translation.manageJobsTabPostJob},
    {name: Translation.manageJobsTabPostedJobs},
    {name: Translation.manageJobsTabOngoingJobs},
    {name: Translation.manageJobsTabCompletedJobs},
    {name: Translation.manageJobsTabCancelledJobs},
  ]);
  const refList = useRef();

  const getItemLayout = (data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  });
  useEffect(() => {
    if (selectedSection != 0) {
      setselectedJob(null);
    }
    refList.current.scrollToIndex({
      animated: true,
      index: selectedSection,
      viewPosition: 0,
    });
  }, [selectedSection]);
  useEffect(() => {
    if (isFocused) {
      getJobsListing();
      getOngoingJobs();
      getCompletedJobs();
      getCancelledJobs();
    }
  }, [isFocused, reload, search, searchOngoing, searchComplete, searchCancel]);
  const reloadData = msg => {
    setReload(!reload);
    setShowAlert(true);
    setType('success');
    setTitle(Translation.globalSuccess);
    setDesc(msg);
  };
  const getJobsListing = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?user_id=' +
        userInfo.id +
        '&keyword=' +
        search +
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
        // if(responseJson.type == "success")
        // {
        setJobs(responseJson);
        setPagePostJob(2);
        // }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreJobsListing = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?user_id=' +
        userInfo.id +
        '&keyword=' +
        search +
        '&page_number='+pagePostJob,

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
        // if(responseJson.type == "success")
        // {
        setJobs(jobs.concat(responseJson));
        setPagePostJob(pagePostJob+1);
        // }
        setPageLoading(false)
      })
      .catch(error => {
        setPageLoading(false)
        setLoader(false);
        console.error(error);
      });
  };
  const getOngoingJobs = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=hired&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchOngoing +
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
        // if(responseJson.type == "success")
        // {
        setOngoingJobs(responseJson);
        setPageOngoingJob(2);
        // }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreOngoingJobs = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=hired&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchOngoing +
        '&page_number='+pageOngoingJob,

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
        // if(responseJson.type == "success")
        // {
        setOngoingJobs(ongoingJobs.concat(responseJson));
        setPageOngoingJob(pageOngoingJob+1);
        // }
        setPageLoading(false)
      })
      .catch(error => {
        setPageLoading(false)
        setLoader(false);
        console.error(error);
      });
  };
  const getCompletedJobs = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=completed&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchComplete +
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
        // if(responseJson.type == "success")
        // {
        setCompletedJobs(responseJson);
        setPageCompleteJob(2);
        // }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreCompletedJobs = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=completed&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchComplete +
        '&page_number='+pageCompleteJob,

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
        // if(responseJson.type == "success")
        // {
        setCompletedJobs(completedJobs.concat(responseJson));
        setPageCompleteJob(pageCompleteJob+1);
        // }
        setPageLoading(false)
      })
      .catch(error => {
        setPageLoading(false)
        setLoader(false);
        console.error(error);
      });
  };
  const getCancelledJobs = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=cancelled&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCancel +
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
        setLoader(false)
        // if(responseJson.type == "success")
        // {
        setCancelledJobs(responseJson);
        setPageCancelJob(2);
        // }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreCancelledJobs = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/manage_employer_jobs?type=cancelled&user_id=' +
        userInfo.id +
        '&keyword=' +
        searchCancel +
        '&page_number='+pageCancelJob,

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
        setLoader(false)
        // if(responseJson.type == "success")
        // {
        setCancelledJobs(cancelledJobs.concat(responseJson));
        setPageCancelJob(pageCancelJob+1);
        // }
        setPageLoading(false)
      })
      .catch(error => {
        setPageLoading(false)
        setLoader(false);
        console.error(error);
      });
  };
  const editJob = item => {
    setselectedJob(item);
    dispatch(updateJobTab(0));
  };
  const deleteJobVerify = (id, index) => {
    setselectedJobId(id);
    setselectedJobIndex(index);
    setAlertOption(true);
    setShowAlert(true);
    setType('error');
    setTitle(Translation.manageJobsAreYouSure);
    setDesc(Translation.manageJobsCannotBeUndone);
  };
  const deleteJob = () => {
    setAlertOption(false);
    setShowAlert(false);
    setJobLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'listing/delete_listing',
        {
          user_id: userInfo.id,
          project_id: selectedJobId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data[0].type == 'success') {
          jobs.splice(selectedJobIndex, 1);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
          setJobLoader(false);
        } else if (response.data[0].type == 'error') {
          setJobLoader(false);
          setShowAlert(true);
          setType(response.data[0].type);
          setTitle(response.data[0].title);
          setDesc(response.data[0].message);
        }
      })
      .catch(error => {
        setJobLoader(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const onEndReachedHandlerPosted = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (jobs.length >= 10) {
        loadMoreJobsListing();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerOngoing = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (ongoingJobs.length >= 10) {
        loadMoreOngoingJobs();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCompleted = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (completedJobs.length >= 10) {
        loadMoreCompletedJobs();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCancelled = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (cancelledJobs.length >= 10) {
        loadMoreCancelledJobs();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.manageJobsHeader}
      />
      <Notification
        option={alertOption}
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        yesAction={deleteJob}
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
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => dispatch(updateJobTab(index))}
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
          <PostJob jobItem={selectedJob} reload={reloadData} />
        )}
        {selectedSection == 1 && (
           <View style={[styles.cardView, {flex: 1}]}>
            <Text style={styles.inputHeading}>{Translation.manageJobsTabPostedJobs}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8, width: '87%', color:Constant.fontColor}}
                value={search}
                onChangeText={text => setSearch(text)}
                placeholder={Translation.inboxSearch}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
              {jobLoader && (
                <MaterialIndicator
                  count={8}
                  size={14}
                  color={Constant.lightGrayColor}
                />
              )}
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={jobs}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerPosted()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
              renderItem={({item, index}) => (
                <PostedJob
                  item={item}
                  index={index}
                  edit={editJob}
                  deleteItem={deleteJobVerify}
                />
              )}
              ListEmptyComponent={
                <>
                <Image
                style={{
                  width: 100,
                  height: 100,
                  marginTop:"40%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/noData.png") }
              />
              <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%",fontSize:16,marginTop:0}]}>{Translation.globalNoRecordFound}</Text>
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

        {selectedSection == 2 && (
           <View style={[styles.cardView, {flex: 1}]}>
            <Text style={styles.inputHeading}>{Translation.manageJobsAllOngoingJobs}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8}}
                value={searchOngoing}
                onChangeText={text => setSearchOngoing(text)}
                placeholder={Translation.inboxSearch}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={ongoingJobs}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerOngoing()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
              renderItem={({item, index}) => (
                <JobStatusCard item={item} status="ongoing" />
              )}
              ListEmptyComponent={
                <>
                <Image
                style={{
                  width: 100,
                  height: 100,
                  marginTop:"40%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/noData.png") }
              />
              <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%",fontSize:16,marginTop:0}]}>{Translation.globalNoRecordFound}</Text>
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
            <Text style={styles.inputHeading}>{Translation.manageJobsAllCompletedJobs}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8}}
                value={searchComplete}
                onChangeText={text => setSearchComplete(text)}
                placeholder={Translation.inboxSearch}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={completedJobs}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerCompleted()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
              renderItem={({item, index}) => (
                <JobStatusCard item={item} status="complete" />
              )}
              ListEmptyComponent={
                <>
                <Image
                style={{
                  width: 100,
                  height: 100,
                  marginTop:"40%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/noData.png") }
              />
              <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%",fontSize:16,marginTop:0}]}>{Translation.globalNoRecordFound}</Text>
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
            <Text style={styles.inputHeading}>{Translation.manageJobsAllCancelledJobs}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8}}
                value={searchCancel}
                onChangeText={text => setSearchCancel(text)}
                placeholder={Translation.inboxSearch}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cancelledJobs}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerCancelled()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
              renderItem={({item, index}) => (
                <JobStatusCard item={item} status="cancel" reload={reloadData}/>
              )}
              ListEmptyComponent={
                <>
                <Image
                style={{
                  width: 100,
                  height: 100,
                  marginTop:"40%",
                  alignSelf: "center",
                }}
                source={require("../../assets/images/noData.png") }
              />
              <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%",fontSize:16,marginTop:0}]}>{Translation.globalNoRecordFound}</Text>
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
      </>
      )}
    </SafeAreaView>
  );
};

export default ManageJobs;
