import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import BillingAddress from './BillingAddress';
import {useIsFocused} from '@react-navigation/native';
import {BallIndicator} from 'react-native-indicators';
import ManageAccount from './ManageAccount';
import {useSelector, useDispatch} from 'react-redux';
import Password from './Password';
import Translation from '../constants/Translation';
import EmailNotification from './EmailNotification';
import DeleteAccount from './DeleteAccount';

const AccountSettings = () => {
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const [selectedSection, setSelectedSection] = useState(0);
  const isFocused = useIsFocused();
  const [billigInfo, setBilligInfo] = useState({});
  const [loader, setLoader] = useState(true);
  const [tabs, setTabs] = useState([
    {
      name: Translation.settingsTabManageAccount,
    },
    {
      name: Translation.settingsTabBillingAddress,
    },
    {
      name: Translation.settingsTabPassword,
    },
    {
      name: Translation.settingsTabEmailNotifications,
    },
    {
      name:
        settings.delete_account_hide == 'no'
          ? Translation.settingsTabDeleteAccount
          : '',
    },
  ]);
  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      getBillingInfo();
    }
  }, [isFocused]);

  const getBillingInfo = async () => {
    return fetch(
      Constant.BaseUrl + 'profile/get_billing_settings?user_id=' + userInfo.id,
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
        setBilligInfo(responseJson);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.settingsAccountSettings}
      />
      <View style={styles.freelancerDetailTopTabView}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => (
            <>
              {item.name != '' && (
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedSection == 0 && <ManageAccount />}
          {selectedSection == 1 && <BillingAddress data={billigInfo} reload={getBillingInfo} />}
          {selectedSection == 2 && <Password />}
          {selectedSection == 3 && <EmailNotification />}
          {selectedSection == 4 && <DeleteAccount />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AccountSettings;
