import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import FormButton from '../components/FormButton';
import Header from '../components/Header';
import ProposalCard from './ProposalCard';

const ManageProposals = ({route, navigation}) => {
  const settings = useSelector(state => state.setting.settings);
  const proposalDetail = route.params.data;
 
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.manageProposalsHeader}
        backIcon={true}
      />
      <TouchableOpacity
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20,
          paddingRight: 40,
          borderColor: Constant.borderColor,
          borderWidth: 1,
          borderTopColor: Constant.whiteColor,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderRadius: 20,
          paddingBottom: 10,
          backgroundColor: Constant.whiteColor,
        }}>
        <View style={styles.jobCardNameView}>
          <Text style={styles.jobCardNameViewText}>
            {proposalDetail.employer_name}
          </Text>
          {proposalDetail.employer_verified == 'yes' && (
            <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
          )}
        </View>
        <Text style={styles.jobCardMainHeading}>{proposalDetail.title}</Text>
        <View style={styles.jobCardInfoListMain}>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {proposalDetail.project_level.charAt(0).toUpperCase() +
              proposalDetail.project_level.slice(1)}
          </Text>
          <Text
            style={[
              styles.jobCardInfoListHeadingValue,
              {color: Constant.lightGrayColor},
            ]}>
            |
          </Text>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {proposalDetail.project_type.gadget.charAt(0).toUpperCase() +
              proposalDetail.project_type.gadget.slice(1)}
          </Text>
          <Text
            style={[
              styles.jobCardInfoListHeadingValue,
              {color: Constant.lightGrayColor},
            ]}>
            |
          </Text>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {proposalDetail.proposals_count}
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.cardView, {flex: 1}]}>
          {route.params.status == 'ongoing' && (
            <>
              <Text style={styles.inputHeading}>{Translation.manageProposalsHiredFreelnacer}</Text>
              <View
                style={[
                  styles.projectProposalCardView,
                  {
                    borderBottomColor: Constant.borderColor,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <ImageBackground
                    resizeMode="cover"
                    imageStyle={{
                      borderRadius: 55 / 2,
                    }}
                    style={styles.employerCardprofileImage}
                    source={{uri: proposalDetail.hired_freelancer_img}}
                  />
                  <View style={{width: '80%', marginLeft: 15}}>
                    <View style={styles.rowView}>
                      <Text
                        style={[
                          styles.employerCardHeadingText,
                          {marginBottom: 0},
                        ]}>
                        {proposalDetail.hired_freelancer_title}
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
              {proposalDetail.freelancer.hired_freelancer_ratings.round_rate}/5(
              {proposalDetail.freelancer.hired_freelancer_ratings.total_rating} {Translation.manageMilestoneFeedback})
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
          {parseFloat(proposalDetail.freelancer.proposal_price_time.proposed_amount).toFixed(2)}
                </Text>
                {proposalDetail.job_type != 'fixed' ? (
                  <>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.secondryFontRegular,
                      }}>
                     {Translation.manageMilestoneEstimatedHours} ({proposalDetail.freelancer.proposal_price_time.estimeted_time})
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                        letterSpacing: 0.5,
                        color: '#676767',
                        fontFamily: Constant.secondryFontRegular,
                      }}>
                      {Translation.manageMilestoneAmountPerHour} ({proposalDetail.freelancer.proposal_price_time.total_amount})
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
                    {Translation.manageMilestoneDuration} ({proposalDetail.freelancer.proposal_price_time.duration})
                  </Text>
                )}
                <View
                  style={[
                    styles.jobCardInfoListMain,
                    {width: '100%', marginTop: 10},
                  ]}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/attachment.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {TranslationmanageMilestoneAttachement}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.jobCardInfoListHeadingValue,
                      {color: Constant.blueColor},
                    ]}>
                    {proposalDetail.freelancer.attachment_counts} {Translation.manageMilestoneAttachementFileAttached}
                  </Text>
                </View>
                <View style={{width: '49%', alignSelf: 'flex-end'}}>
                  <FormButton
                    onPress={() =>
                      navigation.navigate('ViewHistory', {
                        data: proposalDetail,
                        type: 'job',
                        status: route.params.status,
                      })
                    }
                    buttonTitle={Translation.manageProposalsViewHistory}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                  />
                </View>
              </View>
            </>
          )}

          <Text style={styles.inputHeading}>{Translation.manageProposalsReceivedProposals}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={proposalDetail.proposal_freelancers}
            style={{marginBottom: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <ProposalCard
                item={item}
                index={index}
                project={proposalDetail}
                status={route.params.status}
              />
            )}
            ListEmptyComponent={
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginTop: '40%',
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/images/noData.png')}
                />
                <Text
                  style={[
                    styles.inputHeading,
                    {alignSelf: 'center', fontSize: 16, marginTop: 0},
                  ]}>
                 {Translation.globalNoRecordFound}
                </Text>
              </>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageProposals;
