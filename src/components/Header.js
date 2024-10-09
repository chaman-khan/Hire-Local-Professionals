import React, {useState} from 'react';
import {View, Image, Text, TouchableOpacity, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import {updateSearchView} from '../redux/GlobalStateSlice';
import FormButton from '../components/FormButton';
import {useSelector, useDispatch} from 'react-redux';
import Translation from '../constants/Translation';

const Header = ({
  title,
  titleColor,
  img,
  backColor,
  iconColor,
  backIcon,
  heading,
  searchWithInput,
  handleSearchValue,
  searchVal,
}) => {
  const searchView = useSelector(state => state.global.serach);
  const settings = useSelector(state => state.setting.settings);
  const profileImage = useSelector(state => state.value.profileImage);
  const dispatch = useDispatch();
  const [searchType, setSearchType] = useState('');
  const [search, setSearch] = useState('');
  const navigationforword = useNavigation();
  const navigation = useNavigation();
  const searchListing = () => {
    switch (searchType) {
      case 'freelancer':
        navigation.navigate('FreelancersList', {backDisable: false});
        dispatch(updateSearchView(false));
        break;
      case 'jobs':
        navigation.navigate('JobListing', {searchWithNav: false,backDisable: false});
        dispatch(updateSearchView(false));
        break;
      case 'employers':
        navigation.navigate('EmployerListing', {backDisable: false});
        dispatch(updateSearchView(false));
        break;
      case 'services':
        navigation.navigate('ServicesList', {searchWithNav: false,backDisable: false});
        dispatch(updateSearchView(false));
        break;
      default:
        break;
    }
  };
  return (
    <>
      {!searchView ? (
        <View style={[styles.headerMainView, {backgroundColor: backColor}]}>
          {!backIcon ? (
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => navigationforword.openDrawer()}
              style={styles.headerDrawerIcon}>
              <Feather name="menu" type="menu" color={iconColor} size={25} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => {
                navigationforword.goBack();
              }}
              style={styles.headerDrawerIcon}>
              <Feather
                name="chevron-left"
                type="chevron-left"
                color={iconColor}
                size={25}
              />
            </TouchableOpacity>
          )}
          {!heading ? (
            searchWithInput == true ? (
              <View style={styles.headerMainSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                <TextInput
                  style={{marginLeft: 8,color:Constant.fontColor,fontFamily:Constant.primaryFontRegular}}
                  value={searchVal}
                  onChangeText={text => handleSearchValue(text)}
                  placeholder={Translation.globalStartSearch}
                  placeholderTextColor="#676767"
                  underlineColorAndroid="transparent"
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => dispatch(updateSearchView(true))}
                style={styles.headerMainSearchView}>
                <Feather
                  name="search"
                  color={Constant.lightGrayColor}
                  size={20}
                />
                {/* <TextInput
        style={{marginLeft: 8}}
        value={search}
        onChangeText={text => setSearch(text)}
        placeholder={'Start seacrh here'}
        placeholderTextColor="#676767"
        underlineColorAndroid="transparent"
      /> */}
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 24,
                    letterSpacing: 0.5,
                    marginLeft: 8,
                    fontFamily: Constant.secondryFontRegular,
                    color: '#676767',
                  }}>
                  {Translation.globalStartSearch}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <Text
              style={{
                fontSize: 18,
                lineHeight: 26,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontSemiBold,
                color: Constant.fontColor,
              }}>
              {title}
            </Text>
          )}

          <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            {
              profileImage != "" &&
              navigationforword.navigate('ImagePreview', {
                item:{image: profileImage},
              })
            }
          }
          >
            <Image
              style={styles.headerPhoto}
              source={
                profileImage == ''
                  ? require('../../assets/images/NoImage.png')
                  : {uri: profileImage}
              }
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            height: '120%',
            backgroundColor: '#00000080',
            position: 'absolute',
            zIndex: 10,
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor:Constant.whiteColor,
              paddingHorizontal: 15,
              paddingVertical: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingTop: 40,
            }}>
            <View style={styles.RBSheetHeaderView}>
              <Text style={styles.freelancerDetailCardNameTextStyle}>
                {Translation.headerLookingFor}
              </Text>
              <TouchableOpacity style={styles.RBSheetHeaderCrossView}>
                <Feather
                  onPress={() => dispatch(updateSearchView(false))}
                  name="x"
                  color={'#000'}
                  size={22}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setSearchType('freelancer')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor:
                  searchType == 'freelancer' ? Constant.whiteColor : Constant.grayColor,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  searchType == 'freelancer'
                    ? Constant.borderColor
                    : Constant.whiteColor,
              }}>
              <View
                style={[
                  styles.CustomCheckOuterView,
                  {
                    backgroundColor:
                      searchType == 'freelancer'
                        ? Constant.greenColor
                        : Constant.whiteColor,
                  },
                ]}>
                <View style={styles.CustomCheckInnerView} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 26,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                  marginLeft: 10,
                }}>
                {Translation.headerFreelancer}
              </Text>
            </TouchableOpacity>
            {settings.user_meta.access_type.job_access == "yes" &&
              <TouchableOpacity
              onPress={() => setSearchType('jobs')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor:
                  searchType == 'jobs' ? Constant.whiteColor : Constant.grayColor,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  searchType == 'jobs'
                    ? Constant.borderColor
                    : Constant.whiteColor,
              }}>
              <View
                style={[
                  styles.CustomCheckOuterView,
                  {
                    backgroundColor:
                      searchType == 'jobs'
                        ? Constant.greenColor
                        : Constant.whiteColor,
                  },
                ]}>
                <View style={styles.CustomCheckInnerView} />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 26,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                  marginLeft: 10,
                }}>
                {Translation.headerJobs}
              </Text>
            </TouchableOpacity>}
            <TouchableOpacity
              onPress={() => setSearchType('employers')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor:
                  searchType == 'employers' ? Constant.whiteColor : Constant.grayColor,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  searchType == 'employers'
                    ? Constant.borderColor
                    : Constant.whiteColor,
              }}>
              <View
                style={[
                  styles.CustomCheckOuterView,
                  {
                    backgroundColor:
                      searchType == 'employers'
                        ? Constant.greenColor
                        : Constant.whiteColor,
                  },
                ]}>
                <View style={styles.CustomCheckInnerView} />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 26,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                  marginLeft: 10,
                }}>
                {Translation.headerEmployers}
              </Text>
            </TouchableOpacity>
           {settings.user_meta.access_type.service_access == "yes" &&
            <TouchableOpacity
              onPress={() => setSearchType('services')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor:
                  searchType == 'services' ? Constant.whiteColor : Constant.grayColor,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  searchType == 'services'
                    ? Constant.borderColor
                    : Constant.whiteColor,
              }}>
              <View
                style={[
                  styles.CustomCheckOuterView,
                  {
                    backgroundColor:
                      searchType == 'services'
                        ? Constant.greenColor
                        : Constant.whiteColor,
                  },
                ]}>
                <View style={styles.CustomCheckInnerView} />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 26,
                  letterSpacing: 0.5,
                  fontFamily: Constant.primaryFontSemiBold,
                  color: Constant.fontColor,
                  marginLeft: 10,
                }}>
                {Translation.headerServices}
              </Text>
            </TouchableOpacity>}
            {/* <View
              style={[
                styles.managePortfolioSearchView,
                {
                  borderRadius: 10,
                  height: 45,
                  backgroundColor: Constant.whiteColor,
                  marginTop: 10,
                },
              ]}>
              <Feather
                name="search"
                color={Constant.lightGrayColor}
                size={20}
              />
              <TextInput
                style={{marginLeft: 8}}
                value={search}
                onChangeText={text => setSearch(text)}
                placeholder={'Search with keyword'}
                placeholderTextColor="#676767"
                underlineColorAndroid="transparent"
              />
            </View> */}
            <FormButton
              onPress={() => searchListing()}
              buttonTitle={'Search now'}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              iconName={'filter'}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default Header;
