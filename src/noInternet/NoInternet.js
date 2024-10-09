import {NativeModules, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as Constant from '../constants/globalConstant';
import Translation from '../constants/Translation';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import FormButton from '../components/FormButton';

const NoInternet = () => {
  return (
    <View
      style={{
        backgroundColor: Constant.whiteColor,
        flex: 1,
        paddingHorizontal: 20,
        justifyContent:"center"
      }}>
      <Text
        style={{
          fontSize: 50,
          marginBottom:10,
        //   marginTop:"35%",
          letterSpacing: 0.5,
          textAlign: 'center',
          fontFamily: Constant.primaryFontMedium,
          color: "#787878",
        }}>
        {Translation.globalOops}...
      </Text>
      <Animatable.Image
        resizeMode={'contain'}
        iterationCount={'infinite'}
        iterationDelay={2000}
        duration={3000}
        style={{width: 400, height: 260, marginBottom: 40,marginTop:40}}
        animation="shake"
        source={require('../../assets/images/NoInternet.png')}
      />
      <Text
        style={{
          fontSize: 18,
          lineHeight: 24,
          letterSpacing: 0.5,
          textAlign: 'center',
          fontFamily: Constant.primaryFontMedium,
          color: Constant.fontColor,
        }}>
        {Translation.globalInternetMessage}
      </Text>
      <View style={{width: '45%', alignSelf: 'center',marginTop:10}}>
        <FormButton
          buttonTitle={Translation.globalTry}
          backgroundColor={Constant.primaryColor}
          textColor={Constant.whiteColor}
          onPress={() => NativeModules.DevSettings.reload()}
        />
      </View>
    </View>
  );
};

export default NoInternet;
