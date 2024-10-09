import {
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Translation from '../constants/Translation';
import {decode} from 'html-entities';

const ProposalCard = ({item, index, project, status}) => {
  const billing = useSelector(state => state.value.billing);
  const shipping = useSelector(state => state.value.shipping);
  const settings = useSelector(state => state.setting.settings);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileImage = useSelector(state => state.value.profileImage);
  const profileName = useSelector(state => state.value.profileName);
  const token = useSelector(state => state.value.token);
  const navigationforword = useNavigation();

  const hireNow = () => {
    var billing_info_map = {};
    billing_info_map.address_1 = billing.address_1;
    billing_info_map.city = billing.city;
    billing_info_map.company = billing.company;
    billing_info_map.country = billing.country;
    billing_info_map.email = billing.email;
    billing_info_map.first_name = billing.first_name;
    billing_info_map.last_name = billing.last_name;
    billing_info_map.phone = billing.phone;
    // billing_info_map["state"] = billing.state;
    var shipping_info_map = {};
    shipping_info_map.address_1 = shipping.address_1;
    shipping_info_map.city = shipping.city;
    shipping_info_map.company = shipping.company;
    shipping_info_map.country = shipping.country;
    shipping_info_map.first_name = shipping.first_name;
    shipping_info_map.last_name = shipping.last_name;
    // shipping_info_map["state"] = shipping.state;
    var payment_data_map_array = {};
    payment_data_map_array.order_type = 'hiring';
    payment_data_map_array.proposal_id = item.proposal_id;
    payment_data_map_array.job_id = project.ID;
    payment_data_map_array.customer_id = userInfo.id;
    payment_data_map_array.customer_note = '';
    payment_data_map_array.shipping_methods = 'stripe';
    payment_data_map_array.sameAddress = '1';
    payment_data_map_array.billing_info = billing_info_map;
    payment_data_map_array.shipping_info = shipping_info_map;
    var payment_data = JSON.stringify(payment_data_map_array);
    axios
      .post(
        Constant.BaseUrl + 'user/create_checkout_page',
        {
          user_id: userInfo.id,
          payment_data: payment_data,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          
          navigationforword.navigate('Checkout', {link: response.data.url});
        } else if (response.data.type == 'error') {
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <>
      <View
        style={[
          styles.projectProposalCardView,
          {
            borderBottomColor:
              status == 'ongoing' ? Constant.borderColor : Constant.whiteColor,
            borderBottomLeftRadius: status == 'ongoing' ? 10 :0,
            borderBottomRightRadius: status == 'ongoing' ? 10 : 0
          },
        ]}>
        <View style={{flexDirection: 'row'}}>
          <ImageBackground
            resizeMode="cover"
            imageStyle={{
              borderRadius: 55 / 2,
            }}
            style={styles.employerCardprofileImage}
            source={{uri: item.url}}
          />
          <View style={{width: '80%', marginLeft: 15}}>
            <View style={styles.rowView}>
              <Text style={[styles.employerCardHeadingText, {marginBottom: 0}]}>
                {item.freelancer_title}
              </Text>
              <FontAwesome
                style={{marginLeft: 5}}
                name={'check-circle'}
                size={16}
                color={'#22C55E'}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                letterSpacing: 0.5,
                color: '#676767',
                fontFamily: Constant.primaryFontRegular,
              }}>
              {item.rating_proposal_author.round_rate}/5(
              {item.rating_proposal_author.total_rating} {Translation.viewHistoryFeedback})
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 22,
            marginTop: 12,
            lineHeight: 30,
            letterSpacing: 0.5,
            color: Constant.fontColor,
            fontFamily: Constant.primaryFontSemiBold,
          }}>
          {decode(settings.currency_symbol)}
          {parseFloat(item.proposal_price_time.proposed_amount).toFixed(2)}
        </Text>
        {project.job_type != 'fixed' ? (
          <>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                letterSpacing: 0.5,
                color: '#676767',
                fontFamily: Constant.secondryFontRegular,
              }}>
              {Translation.manageMilestoneEstimatedHours} ({item.proposal_price_time.estimeted_time})
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                letterSpacing: 0.5,
                color: '#676767',
                fontFamily: Constant.secondryFontRegular,
              }}>
              {Translation.manageMilestoneAmountPerHour} ({item.proposal_price_time.total_amount})
            </Text>
          </>
        ) : (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              letterSpacing: 0.5,
              color: '#676767',
              fontFamily: Constant.secondryFontRegular,
            }}>
            {Translation.manageMilestoneDuration} ({item.proposal_price_time.duration})
          </Text>
        )}
        <View
          style={[styles.jobCardInfoListMain, {width: '100%', marginTop: 10}]}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/attachment.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>{Translation.manageMilestoneAttachement}</Text>
          </View>
          <Text
            style={[
              styles.jobCardInfoListHeadingValue,
              {color: Constant.blueColor},
            ]}>
            {item.proposal_docs} {Translation.manageMilestoneAttachementFileAttached}
          </Text>
        </View>
        
      </View>
      {status != 'ongoing' && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.addonsServiceCardLeftButton,
              {backgroundColor: Constant.whiteColor},
            ]}>
            <Text style={styles.addonsServiceCardLeftButtonText}>{Translation.proposalCardChatNow}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              project.is_milestone == 'on'
                ? navigationforword.navigate('ManageMilestone', {
                    data: project,
                    type: 'job',
                    status: 'pending',
                    index: index,
                  })
                : hireNow()
            }
            style={[
              styles.addonsServiceCardRightButton,
              {backgroundColor: Constant.grayColor},
            ]}>
            {project.is_milestone == 'on' ? (
              <Text
                style={[
                  styles.addonsServiceCardRightButtonText,
                  {color: '#676767'},
                ]}>
                {Translation.proposalCardHireCreateMilestone}
              </Text>
            ) : (
              <Text
                style={[
                  styles.addonsServiceCardRightButtonText,
                  {color: '#676767'},
                ]}>
                {Translation.proposalCardHireNow}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ProposalCard;
