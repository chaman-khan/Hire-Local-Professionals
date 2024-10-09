import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {decode} from 'html-entities';
import styles from '../styles/Style';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Translation from '../constants/Translation';
import * as Constant from '../constants/globalConstant';
import FormButton from '../components/FormButton';

const ProjectProposalCard = ({item,index}) => {
  const settings = useSelector(state => state.setting.settings);
  const navigationforword = useNavigation();

  return (
    <>
      <View style={styles.projectProposalCardView}>
        <View style={styles.rowView}>
          <View
            style={[
              styles.projectProposalCardStatus,
              {
                backgroundColor:
                  item.status_key == 'hired'
                    ? '#F97316'
                    : item.status_key == 'completed'
                    ? Constant.greenColor
                    : item.status_key == 'pending'
                    ? '#64748B'
                    : null,
              },
            ]}>
            <Text style={styles.projectProposalCardStatusText}>
              {item.status_key == 'hired'
                ? item.status
                : item.status_key == 'completed'
                ? item.status
                : item.status_key == 'pending'
                ? item.status
                : null}
            </Text>
          </View>
          {item.status_key == 'pending' && (
            <TouchableOpacity
              onPress={() =>
                navigationforword.navigate('SendProposal', {
                  data: item,
                  edit: true,
                })
              }
              style={[
                styles.projectProposalCardStatus,
                {
                  marginLeft: 10,
                  backgroundColor: '#6366F1',
                },
              ]}>
              <Text style={styles.projectProposalCardStatusText}>
                {Translation.projectProposalCardEditProposal}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.projectProposalCardHeading}>
          {decode(item.job_title)}
        </Text>
        <Text style={styles.projectProposalCardTag}>{decode(item.title)}</Text>
        <Text style={styles.projectProposalCardPrice}>
          {decode(item.budget_dollar)}
        </Text>
        {item.job_type == 'fixed' ? (
          <Text style={[styles.projectProposalCardTag, {marginBottom: 0}]}>
            {Translation.projectProposalCardDuration} ({item.duration.value})
          </Text>
        ) : (
          <>
            <Text style={[styles.projectProposalCardTag, {marginBottom: 0}]}>
              {Translation.projectProposalCardEstimatedHours} ({item.estimated_hours})
            </Text>
            <Text style={styles.projectProposalCardTag}>
              {Translation.projectProposalCardAmountHour} ({decode(settings.currency_symbol)}{item.per_hour_price}.00)
            </Text>
          </>
        )}
        {item.accept_milestone_btn == 'show' && (
          <FormButton
          onPress={()=> navigationforword.navigate('ManageMilestone',{data:item,type:"proposal",status:"pending",index:index})}
            buttonTitle={'Accept Milestones'}
            backgroundColor={Constant.greenColor}
            textColor={Constant.whiteColor}
            //  loader={loading}
          />
        )}
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.projectProposalCardLeftButton}>
          <Text style={styles.projectProposalCardTag}>{Translation.projectProposalCardCoverLetter}</Text>
        </View>
        <View style={styles.projectProposalCardRightButton}>
          <Text style={styles.projectProposalCardTag}>
            {item.proposal_documents_count < 2
              ? item.proposal_documents_count + Translation.projectProposalCardFileAttach
              : item.proposal_documents_count + Translation.projectProposalCardFilesAttach}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ProjectProposalCard;
