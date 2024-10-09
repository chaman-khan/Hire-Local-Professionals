import {
  Image,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import EmployerCard from './EmployerCard';
import {useIsFocused} from '@react-navigation/native';
import Header from '../components/Header';
import FormButton from '../components/FormButton';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {BarIndicator, BallIndicator} from 'react-native-indicators';
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const EmployerList = ({navigation, route}) => {
  const userInfo = useSelector(state => state.value.userInfo);
  const settings = useSelector(state => state.setting.settings);
  const RBSheetFilter = useRef();
  const isFocused = useIsFocused();
  const [spinner, setSpinner] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [employers, setEmployers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [selectedInfo, setselectedInfo] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedLoaction, setSelectedLoaction] = useState([]);
  const [selectedNoOfEmployees, setSelectedNoOfEmployees] = useState('');
  const [filter, setFilter] = useState([
    {
      name:
        settings.employers_search_filters.employer_department != 'enable'
          ? ''
          : Translation.employerListTabDepartments,
    },
    {
      name:
        settings.employers_search_filters.employer_employees != 'enable'
          ? ''
          : Translation.employerListTabNoEmployees,
    },
    {
      name:
        settings.employers_search_filters.employer_locations != 'enable'
          ? ''
          : Translation.employerListTabLocation,
    },
  ]);
  const departmentsTaxonomy = useSelector(
    state => state.global.departmentsTaxonomy,
  );
  const NoEmployeeTaxonomy = useSelector(
    state => state.global.NoEmployeeTaxonomy,
  );
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const [departmentArray, setDepartmentArray] = useState(departmentsTaxonomy);
  const [employeesArray, setEmployessArray] = useState(NoEmployeeTaxonomy);
  const [locationArray, setLocationArray] = useState(locationTaxonomy);

  useEffect(() => {
    if (isFocused) {
      getEmployerList();
    }
  }, [isFocused, searchVal]);

  const getEmployerList = async () => {
    setSpinner(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_employers?listing_type=search&page_number=1&keyword=' +
        searchVal +
        '&profile_id=' +
        userInfo.profile_id +
        '&user_id=' +
        userInfo.id +
        '&employees=' +
        JSON.stringify(selectedNoOfEmployees) +
        '&location=' +
        JSON.stringify(selectedLoaction) +
        '&department=' +
        JSON.stringify(selectedDepartment),
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
        setEmployers(responseJson.employers);
        setpageNumber(2);
      })
      .catch(error => {
        setLoader(false);
        setSpinner(false);
      });
  };
  const loadMoreData = async () => {
    setLoader(true);
    return fetch(
      Constant.BaseUrl +
        'listing/get_employers?listing_type=search&page_number=1&profile_id=' +
        userInfo.profile_id +
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
        if (responseJson.type == 'success') {
          let data = responseJson.employers;
          setEmployers(employers.concat(data));
          setpageNumber(pageNumber + 1);
          setRefreshFlatList(!refreshFlatlist);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };
  const onEndReachedHandler = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (employers.length >= 10) {
        loadMoreData();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  };
  const handelSelectedItem = (item, index) => {
    switch (selectedInfo) {
      case 0:
        if (!selectedDepartment.includes(item.slug)) {
          selectedDepartment.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedDepartment.length; j++) {
            if (selectedDepartment[j] == item.slug) {
              selectedDepartment.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }
        break;
      case 1:
        if (selectedNoOfEmployees == item.value) {
          setSelectedNoOfEmployees('');
          setRefreshFlatList(!refreshFlatlist);
        } else {
          setSelectedNoOfEmployees(item.value);

          setRefreshFlatList(!refreshFlatlist);
        }

        break;

      case 2:
        if (!selectedLoaction.includes(item.slug)) {
          selectedLoaction.push(item.slug);
          setRefreshFlatList(!refreshFlatlist);
        } else {
          for (var j = 0; j < selectedLoaction.length; j++) {
            if (selectedLoaction[j] == item.slug) {
              selectedLoaction.splice(j, 1);
            }
          }
          setRefreshFlatList(!refreshFlatlist);
        }

        break;

      default:
        break;
    }
  };
  const handleClearFilter = () => {
    setSelectedDepartment([]);
    setSelectedLoaction([]);
    setSelectedNoOfEmployees('');
    setselectedInfo(null);
    getEmployerList();
  };
  const handleSearchValue = text => {
    setSearchVal(text);
  };
  const handleApplyFilter = () => {
    RBSheetFilter.current.close();
    getEmployerList();
  };
  const handelSearchKeyword = val => {
    switch (selectedInfo) {
      case 0:
        if (val) {
          const newData = departmentsTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setDepartmentArray(newData);
          setSearch(val);
        } else {
          setDepartmentArray(departmentsTaxonomy);
          setSearch(val);
        }
        break;
      case 1:
        if (val) {
          const newData = NoEmployeeTaxonomy.filter(item => {
            const itemData = item.search_title
              ? item.search_title.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setEmployessArray(newData);
          setSearch(val);
        } else {
          setEmployessArray(NoEmployeeTaxonomy);
          setSearch(val);
        }
        break;
      case 2:
        if (val) {
          const newData = locationTaxonomy.filter(item => {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setLocationArray(newData);
          setSearch(val);
        } else {
          setLocationArray(locationTaxonomy);
          setSearch(val);
        }
        break;

      default:
        break;
    }
  };
  const handelClearItem = () => {
    switch (selectedInfo) {
      case 0:
        setSelectedDepartment([]);
        break;
      case 1:
        setSelectedNoOfEmployees('');
        break;
      case 2:
        setSelectedLoaction([]);
        break;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        backIcon={route.params.backDisable ? false : true}
        searchWithInput={true}
        handleSearchValue={handleSearchValue}
      />
      <View style={[styles.freelancerDetailTopTabView, {flexDirection: 'row'}]}>
        <TouchableOpacity
          activeOpacity={0.2}
          style={[styles.headerDrawerIcon, {marginRight: 10}]}>
          <Feather name="sliders" color={'#484848'} size={16} />
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={{alignItems: 'center'}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filter}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
                <TouchableOpacity
                  onPress={() => {
                    RBSheetFilter.current.open();
                    setselectedInfo(index);
                    handelSearchKeyword("")
                    setSearch("")
                  }}
                  style={[
                    styles.freelancerDetailTopTabViewSingle,
                    {
                      backgroundColor:
                        selectedInfo == index
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedInfo == index
                          ? Constant.whiteColor
                          : Constant.borderColor,
                      flexDirection: 'row',
                      alignItems: 'center',
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
                    {index == 0
                      ? selectedDepartment.length > 0
                        ? `(${selectedDepartment.length})`
                        : ''
                      : index == 1
                      ? selectedNoOfEmployees != ''
                        ? `(1)`
                        : ''
                      : selectedLoaction.length > 0
                      ? `(${selectedLoaction.length})`
                      : ''}
                  </Text>
                  <Feather
                    style={{marginLeft: 5}}
                    name="plus"
                    color={
                      selectedInfo == index
                        ? Constant.whiteColor
                        : Constant.fontColor
                    }
                    size={15}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={() => handleClearFilter()}>
              <Text
                style={[
                  styles.ServiceProviderCardReviewCountStyle,
                  {color: Constant.lightGrayColor, fontFamily: 'Outfit-Bold'},
                ]}>
                {Translation.globalClearFilters}
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
      {spinner ? (
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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={employers}
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
          keyExtractor={(x, i) => i.toString()}
          extraData={refreshFlatlist}
          onEndReached={() => onEndReachedHandler()}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('EmployerDetail', {item: item})
              }>
              <EmployerCard item={item} />
            </TouchableOpacity>
          )}
        />
      )}
      {loader == true && (
        <View style={{marginTop: 15, marginBottom: 20}}>
          <BarIndicator count={6} size={20} color={Constant.primaryColor} />
        </View>
      )}
      <RBSheet
        ref={RBSheetFilter}
        height={Dimensions.get('window').height * 0.6}
        duration={250}
        customStyles={{
          container: {
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: 'transparent',
          },
        }}>
        <View
          style={{
            backgroundColor: Constant.whiteColor,
            padding: 10,
            flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.freelancerDetailCardNameTextStyle}>
              {selectedInfo == 0
                ? Translation.employerListTabDepartments
                : selectedInfo == 1
                ? Translation.employerListTabNoEmployees
                : Translation.employerListTabLocation}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetFilter.current.close()}
              style={{
                height: 45,
                width: 45,
                borderRadius: 45 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Constant.grayColor,
              }}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.headerMainSearchView,
              {
                width: '100%',
                borderRadius: 10,
                backgroundColor: Constant.whiteColor,
                marginBottom: 10,
              },
            ]}>
            <Feather name="search" color={Constant.lightGrayColor} size={20} />
            <TextInput
              style={{marginLeft: 8, color:Constant.fontColor}}
              value={search}
              onChangeText={text => handelSearchKeyword(text)}
              placeholder={Translation.globalStartSearch}
              placeholderTextColor="#676767"
              underlineColorAndroid="transparent"
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              selectedInfo == 0
                ? departmentArray
                : selectedInfo == 1
                ? employeesArray
                : locationArray
            }
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            extraData={refreshFlatlist}
            ListEmptyComponent={
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop: 40,
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
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[
                    styles.JobDetailItemView,
                    {
                      backgroundColor:
                        selectedDepartment.includes(item.slug) ||
                        selectedNoOfEmployees == item.value ||
                        selectedLoaction.includes(item.slug)
                          ? Constant.greenColor
                          : Constant.whiteColor,
                      borderColor:
                        selectedDepartment.includes(item.slug) ||
                        selectedNoOfEmployees == item.value ||
                        selectedLoaction.includes(item.slug)
                          ? Constant.whiteColor
                          : Constant.borderColor,
                    },
                  ]}
                  onPress={() => handelSelectedItem(item, index)}>
                  <Text
                    style={[
                      styles.JobDetailItemText,
                      {
                        color:
                          selectedDepartment.includes(item.slug) ||
                          selectedNoOfEmployees == item.value ||
                          selectedLoaction.includes(item.slug)
                            ? Constant.whiteColor
                            : Constant.fontColor,
                      },
                    ]}>
                    {selectedInfo == 1
                      ? decode(item.search_title)
                      : decode(item.name)}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <View style={{marginBottom: 10, width: '48%'}}>
              <FormButton
                buttonTitle={Translation.globalApplyFilter}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                onPress={() => handleApplyFilter()}
              />
            </View>
            <View style={{marginBottom: 10, width: '48%'}}>
              <FormButton
                buttonTitle={Translation.globalClearFilter}
                backgroundColor={Constant.grayColor}
                textColor={Constant.fontColor}
                onPress={() => handelClearItem()}
              />
            </View>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default EmployerList;
