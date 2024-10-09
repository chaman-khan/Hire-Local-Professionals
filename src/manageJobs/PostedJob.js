import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import Translation from '../constants/Translation';
import Notification from '../components/Notification';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';

const PostedJob = ({item, status,index ,edit,deleteItem}) => {
  const navigationforword = useNavigation();
  const settings = useSelector(state => state.setting.settings);
  return (
    <>
      <View
        style={[
          styles.projectStatusCardView,
          {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingBottom: 10,
            paddingTop:settings.project_settings.allow_delete_project == "yes" ? 0: 10,
          },
        ]}>
        {settings.project_settings.allow_delete_project == "yes" &&
          <TouchableOpacity
          activeOpacity={0.6}
          onPress={()=> deleteItem(item.ID,index)}
          style={{
            backgroundColor: Constant.primaryColor,
            height: 50,
            width: 50,
            alignSelf: 'flex-end',
            borderBottomLeftRadius: 25,
            borderTopRightRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight:-15
          }}>
          <Feather  name={'trash-2'} size={20} color={Constant.whiteColor} />
        </TouchableOpacity>}
        <View style={[styles.jobCardNameView,{marginTop:settings.project_settings.allow_delete_project == "yes" ? -25 : 0}]}>
          <Text style={styles.jobCardNameViewText}>{item.employer_name}</Text>

          {item.employer_verified == 'yes' && (
            <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
          )}
        </View>

        <Text style={styles.jobCardMainHeading}>{item.title}</Text>
        {item.project_level != "" &&
          <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon0.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>{Translation.postedJobSkillLevel}</Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
          {item.project_level.charAt(0).toUpperCase() + item.project_level.slice(1)}
          </Text>
        </View>}
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon8.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>{Translation.postedJobProjectType}</Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_type.gadget.charAt(0).toUpperCase() + item.project_type.gadget.slice(1)}
          </Text>
        </View>
        <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
          <View style={{width: '49%'}}>
            <FormButton
              onPress={() =>
                navigationforword.navigate('ManageProposals', {data: item,status:"pending"})
              }
              buttonTitle={Translation.postedJobViewProposals}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
            />
          </View>
          <View style={{width: '49%'}}>
            <FormButton
              onPress={() =>  edit(item)}
              buttonTitle={Translation.postedJobEditJob}
              backgroundColor={Constant.whiteColor}
              textColor={Constant.lightGrayColor}
            />
          </View>
          
        </View>
      </View>
      <View
        style={{
          borderColor: Constant.borderColor,
          borderWidth: 1,
          borderTopColor: Constant.whiteColor,
          paddingVertical: 8,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: Constant.grayColor,
          paddingHorizontal: 15,
        }}>
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <Text
              style={[
                styles.jobCardInfoListHeading,
                {fontFamily: Constant.primaryFontRegular},
              ]}>
              {Translation.postedJobProposals}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 26,
              letterSpacing: 0.5,
              color: Constant.fontColor,
              fontFamily: Constant.secondryFontSemiBold,
            }}>
            {item.proposals_count}
          </Text>
        </View>
      </View>
    </>
  );
};

export default PostedJob;
