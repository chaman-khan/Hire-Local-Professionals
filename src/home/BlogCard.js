import {View, Text, Image, ImageBackground} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const BlogCard = ({item, width}) => {
  return (
    <View style={[styles.serviceListCardParentStyle, {width: width}]}>
      <ImageBackground
        style={styles.serviceListImageBackgeoundStyle}
        imageStyle={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        source={
          item.thumbnail != ''
            ? {uri: item.thumbnail}
            : require('../../assets/images/NoImage.png')
        }>
        <View style={styles.serviceListCardImagebackgroundOverlyStyle} />
      </ImageBackground>
      <Text style={[styles.serviceListCardTaglineStyle, {marginTop: 10}]}>
        {decode(item.title)}
      </Text>
      <View
        style={[styles.serviceListCardReviewParentStyle, {marginBottom: 10}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather
            name={'calendar'}
            size={13}
            color={Constant.lightGrayColor}
          />
          <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
            {item.date}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather
            name={'message-square'}
            size={13}
            color={Constant.lightGrayColor}
          />
          <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
            {item.comments_counts}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather name={'eye'} size={13} color={Constant.lightGrayColor} />
          <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
            {item.post_views}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BlogCard;
