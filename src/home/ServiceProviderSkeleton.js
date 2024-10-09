import {View, Text, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';

const ServiceProviderSkeleton = props => {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          borderColor: Constant.borderColor,
          borderWidth: 0.6,
          borderRadius: 20,
          marginTop: 10,
          paddingHorizontal: 15,
          width: 300,
          marginRight: 10,
        }}>
        <View
          style={{
            width: 300,
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 35 / 2,
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 140,
                height: 15,
                marginLeft: 10,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        </View>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 80,
              height: 15,
              marginTop: 12,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 80,
              height: 15,
              marginTop: 12,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
        <View style={[styles.rowView, {width: '100%',marginTop:12}]}>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 26,
                height: 26,
                marginTop: 5,
                borderRadius: 26 / 2,
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                width: 80,
                height: 15,
                marginLeft: 10,
                borderRadius: 10,
              }}
            />
          </SkeletonPlaceholder>
        </View>

        <View style={{width: 300, flexDirection: 'row', marginVertical: 10}}>
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
    </SkeletonPlaceholder>
  );
};

export default ServiceProviderSkeleton;
