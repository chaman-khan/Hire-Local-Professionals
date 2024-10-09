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
import React, {useState, useEffect,useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import {useIsFocused} from '@react-navigation/native';
import ProjectProposalCard from './ProjectProposalCard';
import ProjectStatusCard from './ProjectStatusCard';
import { useSelector, useDispatch } from "react-redux";
import {updateProjectTab} from "../redux/GlobalStateSlice"
import {
  BallIndicator,
  BarIndicator,
  MaterialIndicator,
} from 'react-native-indicators';

const ManageProjects = ({route, navigation}) => {
  const userInfo = useSelector(state => state.value.userInfo);
  const selectedSection = useSelector((state) => state.global.projectTab);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [refreshFlatlist, setRefreshFlatList] = useState(false); 
  const [pageloading, setPageLoading] = useState(false);
  const [ProposalPage, setProposalPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [searchProposal, setSearchProposal] = useState('');
  const [searchOngoing, setSearchOngoing] = useState('');
  const [searchComplete, setSearchComplete] = useState('');
  const [searchCancel, setSearchCancel] = useState('');
  const [proposals, setProposals] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [cancelledProjects, setCancelledProjects] = useState([]);
  const [tabs, setTabs] = useState([
    {name: Translation.manageProjectsTabProposal},
    {name: Translation.manageProjectsTabOngoingProjects},
    {name: Translation.manageProjectsTabCompletedProjects},
    {name: Translation.manageProjectsTabCanceledProjects},
  ]);
  const refList = useRef()

  const  getItemLayout = (data, index) => (
     { length: 80, offset: 80 * index, index }
   )
   useEffect(() => {
     refList.current.scrollToIndex({
       animated: true,
       index: selectedSection ,
       viewPosition: 0
     })
   }, [selectedSection])
  useEffect(() => {
    if (isFocused) {
      getProposalListing();
      getOngoingProjects();
      getCompletedProjects()
      getCancelledProjects()
    }
  }, [isFocused,searchProposal,searchOngoing,searchComplete,searchCancel]);

  const getProposalListing = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_my_proposals?user_id='+ userInfo.id+"&keyword="+searchProposal+
        "&page_number=1" ,
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
        if(responseJson.type == "success")
        {
          setProposals(responseJson.proposals);
          setProposalPage(2)
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreProposalListing = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_my_proposals?user_id='+ userInfo.id+"&keyword="+searchProposal +
        "&page_number="+ProposalPage ,
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
        setPageLoading(false)
        if(responseJson.type == "success")
        {
          setProposals(proposals.concat(responseJson.proposals));
          setProposalPage(ProposalPage+1)
        }
      })
      .catch(error => {
        setPageLoading(false)
        console.error(error);
      });
  };
  const getOngoingProjects = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_ongoing_jobs?user_id='+ userInfo.id+"&keyword="+searchOngoing+
        "&page_number=1" ,
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
        setOngoingProjects(responseJson);
        setOngoingPage(2)
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreOngoingProjects = async () => {
        setPageLoading(true)
        return fetch(
      Constant.BaseUrl +
        'dashboard/get_ongoing_jobs?user_id='+ userInfo.id+"&keyword="+searchOngoing+
        "&page_number="+ongoingPage ,
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
        setPageLoading(false)
        setOngoingProjects(ongoingProjects.concat(responseJson));
        setOngoingPage(ongoingPage+1)
      })
      .catch(error => {
        setPageLoading(false)
        console.error(error);
      });
  };
  const getCompletedProjects = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_completed_jobs?user_id='+ userInfo.id+"&keyword="+searchComplete+
        "&page_number=1" ,
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
        setCompletedProjects(responseJson);
        setCompletedPage(2)
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreCompletedProjects = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_completed_jobs?user_id='+ userInfo.id+"&keyword="+searchComplete+
        "&page_number="+completedPage ,
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
        setPageLoading(false)
        setCompletedProjects(completedProjects.concat(responseJson));
        setCompletedPage(completedPage+1)
      })
      .catch(error => {
        setLoader(false); 
        setPageLoading(false)
        console.error(error);
      });
  };
  const getCancelledProjects = async () => {
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_freelancer_cancelled_jobs?user_id='+ userInfo.id+"&keyword="+searchCancel+
        "&page_number=1" ,
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
        setCancelledProjects(responseJson);
        setCancelledPage(2)
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreCancelledProjects = async () => {
    setPageLoading(true)
    return fetch(
      Constant.BaseUrl +
        'dashboard/get_freelancer_cancelled_jobs?user_id='+ userInfo.id+"&keyword="+searchCancel+
        "&page_number="+cancelledPage ,
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
        setCancelledProjects(cancelledProjects.concat(responseJson));
        setCancelledPage(cancelledPage+1)
        setPageLoading(false)
      })
      .catch(error => {
        setLoader(false);
        setPageLoading(false)
        console.error(error);
      });
  };
  const onEndReachedHandlerProposals = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (proposals.length >= 10) {
        loadMoreProposalListing();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerOngoing = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (ongoingProjects.length >= 10) {
        loadMoreOngoingProjects();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCompleted = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (completedProjects.length >= 10) {
        loadMoreCompletedProjects();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCancelled = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (cancelledProjects.length >= 10) {
        loadMoreCancelledProjects();
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
        title={'Manage projects'}
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
              onPress={() =>  dispatch(updateProjectTab(index))}
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
           <View style={[styles.cardView, {flex: 1}]}>
            <Text style={styles.inputHeading}>{Translation.manageProjectsSubmittedProposals}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather name="search" color={Constant.lightGrayColor} size={20} />
              <TextInput
                style={{marginLeft: 8}}
                value={searchProposal}
                onChangeText={text => setSearchProposal(text)}
                placeholder={Translation.inboxSearch}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={proposals}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerProposals()}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              renderItem={({item, index}) => (
                <ProjectProposalCard item={item} index={index}/>
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
                      {alignSelf: 'center',marginBottom:"80%", fontSize: 16, marginTop: 0},
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
        {selectedSection == 1 && (
           <View style={[styles.cardView, {flex: 1}]}>
            <Text style={styles.inputHeading}>{Translation.manageProjectsAllOngoingProjects}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather name="search" color={Constant.lightGrayColor} size={20} />
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
              data={ongoingProjects}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerOngoing()}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              renderItem={({item, index}) => (
                <ProjectStatusCard item={item} status="ongoing" index={index}/>
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
                      {alignSelf: 'center',marginBottom:"80%", fontSize: 16, marginTop: 0},
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
        {selectedSection == 2 && (
           <View style={[styles.cardView, {flex: 1}]}>
            <Text style={styles.inputHeading}>{Translation.manageProjectsTabCompletedProjects}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather name="search" color={Constant.lightGrayColor} size={20} />
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
              data={completedProjects}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerCompleted()}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              renderItem={({item, index}) => (
                <ProjectStatusCard item={item} status="complete" />
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
                      {alignSelf: 'center',marginBottom:"80%", fontSize: 16, marginTop: 0},
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
            <Text style={styles.inputHeading}>{Translation.manageProjectsTabCanceledProjects}</Text>
            <View style={styles.managePortfolioSearchView}>
              <Feather name="search" color={Constant.lightGrayColor} size={20} />
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
              data={cancelledProjects}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              onEndReached={() => onEndReachedHandlerCancelled()}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              renderItem={({item, index}) => (
                <ProjectStatusCard item={item} status="cancel" />
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
                      {alignSelf: 'center',marginBottom:"80%", fontSize: 16, marginTop: 0},
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
      </>)}
    </SafeAreaView>
  );
};

export default ManageProjects;
