import {View, Text, Image, ImageBackground} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import { decode } from "html-entities";

const ServiceListSkeleton = props => {
  
  return (
    <View style={[styles.serviceListCardParentStyle, {width: props.width}]}>
      
       <SkeletonPlaceholder>
            <View
              style={{
                width: "100%",
                height: 150,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
      <View style={styles.serviceListCardImageParentStyle}>
        <View style={styles.servisListImageParentStyle}>
        <SkeletonPlaceholder>
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 35 / 2,
              }}
            />
          </SkeletonPlaceholder>
        </View>
        <AntDesign
            style={{alignSelf: 'flex-end'}}
            name={'hearto'}
            size={20}
            color={Constant.borderColor}
          />
      </View>
      <View style={[styles.serviceListCardNameParentStyle,{marginBottom:5}]}>
      <SkeletonPlaceholder>
            <View
              style={{
                width: 130,
                height: 15,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
      </View>
      {/* <View style={{flexDirection: 'row', alignItems: 'center',marginLeft:10,marginBottom:10,width:170}}> */}
        <SkeletonPlaceholder>
            <View
              style={{
                width: 130,
                height: 15,marginHorizontal:10,marginBottom:10,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        {/* </View> */}
      <View style={[styles.serviceListCardReviewParentStyle,{marginTop:10,}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SkeletonPlaceholder>
            <View
              style={{
                width: 80,
                height: 15,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SkeletonPlaceholder>
            <View
              style={{
                width: 40,
                height: 15,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        </View>
      </View>
      <View style={{width: 300, flexDirection: 'row', marginVertical: 10,marginLeft:10}}>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 40,
                height: 15,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 80,
                height: 15,
                marginLeft: 5,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        </View>
    </View>
  );
};

export default ServiceListSkeleton;
