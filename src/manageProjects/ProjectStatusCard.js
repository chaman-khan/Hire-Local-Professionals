import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../constants/globalConstant';
import Translation from '../constants/Translation';
import {useNavigation} from '@react-navigation/native';
import FormButton from '../components/FormButton';

const ProjectStatusCard = ({item,status,index}) => {
  const navigationforword = useNavigation();
  return (
    <View
      style={[
        styles.projectStatusCardView,
        {
          backgroundColor: status == 'cancel' ? '#FFF8F8' : Constant.whiteColor,
        },
      ]}>
      {status == 'complete' && (
        <View style={styles.rowView}>
          <View style={styles.projectStatusCardStatus}>
            <Text style={styles.projectStatusCardStatusText}>
              {Translation.projectStatusCardProjectComplete}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.jobCardNameView}>
        <Text style={styles.jobCardNameViewText}>{item.employer_name}</Text>
        {item.employer_verified == "yes" &&
          <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />}
      </View>

      <Text style={styles.jobCardMainHeading}>
       {item.title}
      </Text>
      <View style={styles.jobCardInfoListMain}>
        <View style={styles.jobCardNameView}>
          <ImageBackground
            // imageStyle={{borderRadius: 25 / 2}}
            style={styles.jobCardInfoListImage}
            source={require('../../assets/images/jobIcon0.png')}
          />
          <Text style={styles.jobCardInfoListHeading}>{Translation.projectStatusCardSkillLevel}</Text>
        </View>
        <Text style={styles.jobCardInfoListHeadingValue}>{item.project_level}</Text>
      </View>
      <View style={styles.jobCardInfoListMain}>
        <View style={styles.jobCardNameView}>
          <ImageBackground
            // imageStyle={{borderRadius: 25 / 2}}
            style={styles.jobCardInfoListImage}
            source={require('../../assets/images/jobIcon8.png')}
          />
          <Text style={styles.jobCardInfoListHeading}>{Translation.projectStatusCardProjectType}</Text>
        </View>
        <Text style={styles.jobCardInfoListHeadingValue}>{item.project_type}</Text>
      </View>

      {item.location.length != 0 &&
        <View style={styles.jobCardInfoListMain}>
        <View style={styles.jobCardNameView}>
          <ImageBackground
            // imageStyle={{borderRadius: 25 / 2}}
            style={{
              width: 26,
              height: 18,
            }}
            source={{uri:item.location[0].location_flag}}
          />
          <Text style={styles.jobCardInfoListHeading}>{Translation.projectStatusCardCountry}</Text>
        </View>
        <Text style={styles.jobCardInfoListHeadingValue}>{item.location[0].location_name}</Text>
      </View>}
      {status != 'cancel' && (
        <>
          {status == 'complete' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon12.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>{Translation.projectStatusCardDuration}</Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
               {item.project_duration}
              </Text>
            </View>
          )}
          <View style={styles.jobCardInfoListMain}>
            <View style={styles.jobCardNameView}>
              <ImageBackground
                // imageStyle={{borderRadius: 25 / 2}}
                style={styles.jobCardInfoListImage}
                source={require('../../assets/images/jobIcon11.png')}
              />
              <Text style={styles.jobCardInfoListHeading}>{Translation.projectStatusCardEmployer}</Text>
            </View>
            <Text
              style={[
                styles.jobCardInfoListHeadingValue,
                {color: Constant.blueColor},
              ]}>
             {item.employer_name}
            </Text>
          </View>
        </>
      )}
      {status != 'cancel' && (
        <FormButton
        onPress={() =>item.milestone_option == "on" ?  navigationforword.navigate('ManageMilestone',{data:item,type:"proposal",status:status,index:index}) : navigationforword.navigate('ViewHistory',{data:item,type:"project",status:status})}
          buttonTitle={Translation.projectStatusCardViewHistory}
          backgroundColor={Constant.primaryColor}
          textColor={Constant.whiteColor}
        />
      )}
    </View>
  );
};

export default ProjectStatusCard;
