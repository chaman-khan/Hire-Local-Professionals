import {View, Text, Image} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from '../styles/Style';

const JobByCountrySkeleton = ({item}) => {
  return (
    <View style={styles.jobByCountryCardParentStyle}>
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 45 / 2,
        }}>
        <SkeletonPlaceholder>
          <View
            style={{
              width: 45,
              height: 45,
              borderRadius: 45 / 2,
            }}
          />
        </SkeletonPlaceholder>
      </View>
      <SkeletonPlaceholder>
        <View
          style={{
            width: 40,
            height: 12,
            marginTop: 7,
            marginLeft:10,
            borderRadius: 10,
          }}
        />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder>
        <View
          style={{
            width: 60,
            height: 15,
            marginTop: 5,
            borderRadius: 10,
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
};

export default JobByCountrySkeleton;
