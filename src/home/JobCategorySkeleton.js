import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {decode} from 'html-entities';
import * as Constant from '../constants/globalConstant';

const JobCategorySkeleton = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 40,
        borderColor: Constant.borderColor,
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginRight: 10,
      }}>
      <View style={[styles.jobCatCardImageParentCard, {marginRight: 7}]}>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 45 / 2,
            }}
          />
        </SkeletonPlaceholder>
      </View>
      <View style={{height:25}}>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 40,
              height: 8,
              marginTop: 12,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 60,
              height: 15,
              marginTop:5,
              borderRadius: 10,
            }}
          />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

export default JobCategorySkeleton;
