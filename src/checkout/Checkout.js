import {View, Text, SafeAreaView} from 'react-native';
import React , { useEffect } from 'react';
import Header from '../components/Header';
import styles from '../styles/Style'
import * as Constant from '../constants/globalConstant';
import {WebView} from 'react-native-webview';

const Checkout = ({navigation,route}) => {
 
  return (
    <SafeAreaView style={styles.globalContainer}>
        <Header
        backIcon={true}
        iconColor={Constant.iconColor}
        heading={true}
        title={'Checkout'}/>
      <WebView source={{uri: route.params.link}} />
    </SafeAreaView>
  );
};

export default Checkout;