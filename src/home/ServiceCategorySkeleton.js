import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { decode } from 'html-entities';

const ServiceCategorySkeleton = ({item}) => {
  return (
    <ImageBackground
      style={styles.serviceCatCardParentStyle}
      imageStyle={{
        borderRadius: 10,
      }}
      source={require("../../assets/images/NoImage.png")}>
      <LinearGradient
        style={styles.serviceCatCardGradientStyle}
        colors={['#00000020', '#00000080', '#00000095']}>
        <View
          style={{
            alignItems:'flex-start',
            padding: 15,
            width:150,
          }}>
           <SkeletonPlaceholder>
          <View
            style={{
              width: 80,
              height: 25,
              marginTop: 12,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
        <View
            style={{
              width: 120,
              height: 15,
              marginTop: 12,
              borderRadius: 10,
            }}
          >
          <SkeletonPlaceholder>
          <View
            style={{
              width: 120,
              height: 15,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
        </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default ServiceCategorySkeleton;
