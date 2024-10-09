import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import styles from '../styles/Style';
import axios from 'axios';
import Notification from '../components/Notification';
import Translation from '../constants/Translation';
import JobCard from '../jobs/JobCard';
import ServicesListCard from '../home/ServicesListCard';
import {useSelector, useDispatch} from 'react-redux';
import EmployerCard from '../employers/EmployerCard';
import {BallIndicator,BarIndicator} from 'react-native-indicators';
import {useIsFocused} from '@react-navigation/native';
import ServiceProviderCard from '../home/ServiceProviderCard';

const SavedItem = ({route}) => {
  const token = useSelector(state => state.value.token);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const userInfo = useSelector(state => state.value.userInfo);
  const isFocused = useIsFocused();
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [services, setServices] = useState([]);
  const [freelancer, setFreelancer] = useState([]);
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNumberJob, setpageNumberJob] = useState(1);
  const [pageNumberService, setpageNumberService] = useState(1);
  const [pageNumberCompany, setpageNumberCompany] = useState(1);
  const [pageNumberFreelancer, setpageNumberFreelancer] = useState(1);
  const [selectedSection, setSelectedSection] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tabs, setTabs] = useState([
    {
      name: Translation.savedItemTabSavedJobs,
    },
    {
      name: Translation.savedItemTabSavedServices,
    },
    {
      name: Translation.savedItemTabFollowedCompanies,
    },
    {
      name: Translation.savedItemTabLikedFreelancers,
    },
  ]);

  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      setSelectedSection(0);
      getSavedJobList();
      getSavedFreelancerList();
      getSavedServicesList();
      getSavedEmployersList();
    }
  }, [isFocused]);

  const getSavedJobList = async () => {
    return fetch(
      Constant.BaseUrl +
        'listing/get_jobs?listing_type=favourite&user_id=' +
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
        if(responseJson.type == "success")
        {setJobs(responseJson.jobs);
        setpageNumberJob(2);}
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreSavedJobList = async () => {
    setSpinner(true)
    return fetch(
      Constant.BaseUrl +
        'listing/get_jobs?listing_type=favourite&user_id=' +
        userInfo.id +
        '&page_number='+pageNumberJob ,
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
        { setJobs(jobs.concat(responseJson.jobs) );
        setpageNumberJob(pageNumberJob+1);
       }
       setSpinner(false)
      })
      .catch(error => {
       setSpinner(false)
        console.error(error);
      });
  };
  const getSavedFreelancerList = async () => {
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=favorite&user_id=' +
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
        if(responseJson.type == "success")
        {setFreelancer(responseJson.freelancers.freelancers_data);
        setpageNumberFreelancer(2);}
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreSavedFreelancerList = async () => {
    setSpinner(true)
    return fetch(
      Constant.BaseUrl +
        'listing/get_freelancers?listing_type=favorite&user_id=' +
        userInfo.id +
        '&page_number='+pageNumberFreelancer,
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
        { setpageNumberFreelancer(pageNumberFreelancer+1)
        setFreelancer(freelancer.concat(responseJson.freelancers.freelancers_data));}
     setSpinner(false)
      })
      .catch(error => {
        setSpinner(false)
        console.error(error);
      });
  };
  const getSavedServicesList = async () => {
    return fetch(
      Constant.BaseUrl +
        'services/get_services?listing_type=favorite&user_id=' +
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
        if(responseJson.type == "success")
        {
          setServices(responseJson.services);
          setpageNumberService(2);
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreSavedServicesList = async () => {
    setSpinner(true)
    return fetch(
      Constant.BaseUrl +
        'services/get_services?listing_type=favorite&user_id=' +
        userInfo.id +
        '&page_number='+pageNumberService,
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
          setServices(services.concat(responseJson.services));
          setpageNumberService(pageNumberService+1);
        }
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(false);
        console.error(error);
      });
  };
  const getSavedEmployersList = async () => {
    return fetch(
      Constant.BaseUrl +
        'listing/get_employers?listing_type=favorite&user_id=' +
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
        if(responseJson.type == "success")
        {
          setEmployers(responseJson.employers);
          setpageNumberCompany(2);
        }
        
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const loadMoreSavedEmployersList = async () => {
    setSpinner(true)
    return fetch(
      Constant.BaseUrl +
        'listing/get_employers?listing_type=favorite&user_id=' +
        userInfo.id +
        '&page_number='+pageNumberCompany,
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
          setEmployers(employers.concat(responseJson.employers));
          setpageNumberCompany(pageNumberCompany+1);
        }
        
        setSpinner(false);
      })
      .catch(error => {
        setSpinner(false);
        console.error(error);
      });
  };

  const deleteSavedItem = async (id, type, index) => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'favourite/remove-favourite',
        {
          user_id: userInfo.id,
          item_id: id,
          item_type: type,
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
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          if (type == '_saved_projects') {
            jobs.splice(index, 1);
          } else if (type == '_saved_services') {
            services.splice(index, 1);
          } else if (type == '_following_employers') {
            employers.splice(index, 1);
          } else if (type == '_saved_freelancers') {
            freelancer.splice(index, 1);
          }
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
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const onEndReachedHandler = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (freelancer.length >= 10) {
        loadMoreSavedFreelancerList();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerJob = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (jobs.length >= 10) {
        loadMoreSavedJobList();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerService = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (services.length >= 10) {
        loadMoreSavedServicesList();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const onEndReachedHandlerCompany = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (employers.length >= 10) {
        loadMoreSavedEmployersList();
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
        title={Translation.savedItemHeader}
      />
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <View style={styles.freelancerDetailTopTabView}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => setSelectedSection(index)}
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
        <View style={{flex:1}}>
          {selectedSection == 0 && (
            <View style={[styles.cardView, {paddingHorizontal: 0}]}>
              <Text style={styles.cardMainText}>{Translation.savedItemTabSavedJobs}</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={jobs}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerJob()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <JobCard
                    item={item}
                    index={index}
                    saved={true}
                    removeItem={deleteSavedItem}
                    load={loading}
                  />
                )}
                ListEmptyComponent={
                  <>
                  <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop:"50%",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/images/noData.png") }
                />
                <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%",fontSize:16,marginTop:0}]}>No record found</Text>
                </>
                }
              />
            </View>
          )}
          {selectedSection == 1 && (
            <View style={[styles.cardView, {paddingHorizontal: 15}]}>
              <Text style={[styles.cardMainText, {marginHorizontal: 0}]}>
                {Translation.savedItemTabSavedServices}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={services}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerService()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <ServicesListCard
                    width="100%"
                    item={item}
                    index={index}
                    saved={true}
                    removeItem={deleteSavedItem}
                    load={loading}
                  />
                )}
                ListEmptyComponent={
                  <>
                  <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop:"50%",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/images/noData.png") }
                />
                <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%" ,fontSize:16,marginTop:0}]}>No record found</Text>
                </>
                }
              />
            </View>
          )}
          {selectedSection == 2 && (
            <View style={[styles.cardView, {paddingHorizontal: 0}]}>
              <Text style={styles.cardMainText}>{Translation.savedItemTabFollowedCompanies}</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={employers}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandlerCompany()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <EmployerCard
                    item={item}
                    index={index}
                    saved={true}
                    removeItem={deleteSavedItem}
                    load={loading}
                  />
                )}
                ListEmptyComponent={
                  <>
                  <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop:"50%",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/images/noData.png") }
                />
                <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%" ,fontSize:16,marginTop:0}]}>No record found</Text>
                </>
                }
              />
            </View>
          )}
          {selectedSection == 3 && (
            <View style={styles.cardView}>
              <Text style={[styles.cardMainText, {marginHorizontal: 0}]}>
                {Translation.savedItemTabLikedFreelancers}
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={freelancer}
                keyExtractor={(x, i) => i.toString()}
                onEndReached={() => onEndReachedHandler()}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum.current = false;
                }}
                renderItem={({item, index}) => (
                  <ServiceProviderCard
                    width={'100%'}
                    item={item}
                    index={index}
                    load={loading}
                    saved={true}
                    removeItem={deleteSavedItem}
                  />
                )}
                ListEmptyComponent={
                  <>
                  <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop:"50%",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/images/noData.png") }
                />
                <Text style={[styles.inputHeading,{ alignSelf: "center",marginBottom:"80%" ,fontSize:16,marginTop:0}]}>No record found</Text>
                </>
                }
              />
              {spinner == true && (
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
        </View>
      )}
    </SafeAreaView>
  );
};

export default SavedItem;
