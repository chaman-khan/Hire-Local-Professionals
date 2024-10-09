import {View, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import React, {useState,useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import {updateSearchView} from '../redux/GlobalStateSlice';
import {useSelector, useDispatch} from 'react-redux';
import Notification from '../components/Notification';
import Translation from '../constants/Translation';


const CustomTabBar = ({navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedTab("home")
  }, [])

  function isObjectEmpty(object) {
    var isEmpty = true;
    for (keys in object) {
      isEmpty = false;
      break;
    }
    return isEmpty;
  }
  var isEmpty = isObjectEmpty(profileInfo);

  const hideAlert = () => {
    setShowAlert(false);
  };
  const openSettings = () => {
    if (!isEmpty) {
      setSelectedTab('setting');
      navigation.navigate('ProfileSetting');
    } else {
      // Alert.alert('Login');
      setShowAlert(true);
      setType(Translation.customTabBarError);
      setTitle(Translation.globalOops);
      setDesc(Translation.customTabBarLoginFirst);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.customTabBarMainContainer}>
        <View style={styles.tabButtonParentStyle}>
          <View
            style={[
              styles.tabButtonSelectedBar,
              {
                backgroundColor:
                  selectedTab == 'home' ? Constant.primaryColor : '#ffffff00',
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('home');
              navigation.navigate('Home');
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather
              name={'home'}
              size={20}
              color={selectedTab == 'home' ? Constant.iconColor : Constant.lightGrayColor}
            />
            <Text
              style={[
                styles.tabButtonTextStyle,
                {color: selectedTab == 'home' ? Constant.iconColor : Constant.lightGrayColor},
              ]}>
              {Translation.customTabBarHome}
            </Text>
          </TouchableOpacity>
        </View>

        {settings.user_meta.access_type.job_access == "yes" ?
          <View style={styles.tabButtonParentStyle}>
          <View
            style={[
              styles.tabButtonSelectedBar,
              {
                backgroundColor:
                  selectedTab == 'job' ? Constant.primaryColor : '#ffffff00',
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('job');
              navigation.navigate('JobList', {backDisable: true});
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather
              name={'briefcase'}
              size={20}
              color={selectedTab == 'job' ? Constant.iconColor : Constant.lightGrayColor}
            />
            <Text
              style={[
                styles.tabButtonTextStyle,
                {color: selectedTab == 'job' ? Constant.iconColor : Constant.lightGrayColor},
              ]}>
              {Translation.customTabBarJobs}
            </Text>
          </TouchableOpacity>
        </View>:
         <View style={styles.tabButtonParentStyle}>
         <View
           style={[
             styles.tabButtonSelectedBar,
             {
               backgroundColor:
                 selectedTab == 'job' ? Constant.primaryColor : '#ffffff00',
             },
           ]}
         />
         <TouchableOpacity
           onPress={() => {
             setSelectedTab('job');
             navigation.navigate('ServiceList', {backDisable: true});
           }}
           style={{alignItems: 'center', justifyContent: 'center'}}>
           <Feather
             name={'briefcase'}
             size={20}
             color={selectedTab == 'job' ? Constant.iconColor : Constant.lightGrayColor}
           />
           <Text
             style={[
               styles.tabButtonTextStyle,
               {color: selectedTab == 'job' ? Constant.iconColor : Constant.lightGrayColor},
             ]}>
             {Translation.customTabBarServices}
           </Text>
         </TouchableOpacity>
       </View>}

        <TouchableOpacity
          style={styles.tabSearchButtonParentStyle}
          onPress={() => dispatch(updateSearchView(true))}>
          <View style={styles.tabSearchLinearParentStyle}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#FC8B92', '#FB5F69', '#FA4753']}
              style={styles.tabSearchLinearStyle}>
              <Feather name={'search'} size={20} color={Constant.whiteColor} />
            </LinearGradient>
          </View>
          <Text style={styles.tabButtonTextStyle}>{Translation.customTabBarSearch}</Text>
        </TouchableOpacity>

        <View style={styles.tabButtonParentStyle}>
          <View
            style={[
              styles.tabButtonSelectedBar,
              {
                backgroundColor:
                  selectedTab == 'company'
                    ? Constant.primaryColor
                    : '#ffffff00',
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('company');
              navigation.navigate('EmployerList', {backDisable: true});
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather
              name={'message-square'}
              size={20}
              color={selectedTab == 'company' ? Constant.iconColor : Constant.lightGrayColor}
            />
            <Text
              style={[
                styles.tabButtonTextStyle,
                {
                  color:
                    selectedTab == 'company' ? Constant.iconColor : Constant.lightGrayColor,
                },
              ]}>
              {Translation.customTabBarCompany}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabButtonParentStyle}>
          <View
            style={[
              styles.tabButtonSelectedBar,
              {
                backgroundColor:
                  selectedTab == 'setting'
                    ? Constant.primaryColor
                    : '#ffffff00',
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => openSettings()}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather
              name={'settings'}
              size={20}
              color={selectedTab == 'setting' ? Constant.iconColor : Constant.lightGrayColor}
            />
            <Text
              style={[
                styles.tabButtonTextStyle,
                {
                  color:
                    selectedTab == 'setting' ? Constant.iconColor : Constant.lightGrayColor,
                },
              ]}>
              {Translation.customTabBarSettings}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        login={true}
        loginAction={()=> {
          setShowAlert(false)
          navigation.navigate('Login')}}
      />
    </SafeAreaView>
  );
};

export default CustomTabBar;
