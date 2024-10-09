import {View, Text, ImageBackground} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../constants/globalConstant';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Translation from '../constants/Translation';
import axios from 'axios';
import {updateJobTab} from '../redux/GlobalStateSlice';
import FormButton from '../components/FormButton';
import Notification from '../components/Notification';

const JobStatusCard = ({item, status, reload}) => {
  const userInfo = useSelector(state => state.value.userInfo);
  const token = useSelector(state => state.value.token);
  const dispatch = useDispatch();
  const navigationforword = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [alertOption, setAlertOption] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const hideAlert = () => {
    setShowAlert(false);
  };
  const repostJob = () => {
    setShowAlert(false);
    setAlertOption(false);
    setLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'dashboard/cancelled_project_repost',
        {
          user_id: userInfo.id,
          project_id: item.ID,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setLoader(false);
          dispatch(updateJobTab(1))
          reload(response.data.message);
        } else if (response.data.type == 'error') {
          setLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };
  return (
    <>
      <Notification
        option={alertOption}
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        iconName={'alert-triangle'}
        yesAction={repostJob}
      />
      <View
        style={[
          styles.projectStatusCardView,
          {
            borderBottomLeftRadius: status == 'cancel' ? 10 : 0,
            borderBottomRightRadius: status == 'cancel' ? 10 : 0,
            paddingBottom: 10,
            backgroundColor:
              status == 'cancel' ? '#FFF8F8' : Constant.whiteColor,
          },
        ]}>
        {status == 'complete' && (
          <View style={styles.rowView}>
            <View style={styles.projectStatusCardStatus}>
              <Text style={styles.projectStatusCardStatusText}>
                {Translation.jobStatusCardProjectComplete}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.jobCardNameView}>
          <Text style={styles.jobCardNameViewText}>{item.employer_name}</Text>

          <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
        </View>

        <Text style={styles.jobCardMainHeading}>{item.title}</Text>
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              //   imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon0.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>{Translation.jobStatusCardSkilLevel}</Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_level.charAt(0).toUpperCase() +
              item.project_level.slice(1)}
          </Text>
        </View>
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              //   imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon8.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>{Translation.jobStatusCardProjectType}</Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_type.gadget.charAt(0).toUpperCase() +
              item.project_type.gadget.slice(1)}
          </Text>
        </View>
        {status == 'complete' ? (
          <>
            {item.is_milestone == 'on' ? (
              <FormButton
                onPress={() =>
                  navigationforword.navigate('ManageMilestone', {
                    data: item,
                    type: 'job',
                    status: status,
                    index: 0,
                  })
                }
                buttonTitle={Translation.jobStatusCardViewHistory}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
              />
            ) : (
              <FormButton
                onPress={() =>
                  navigationforword.navigate('ViewHistory', {
                    data: item,
                    type: 'job',
                    status: status,
                  })
                }
                buttonTitle={Translation.jobStatusCardViewHistory}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
              />
            )}
          </>
        ) : (
          <>
            {status != 'cancel' ? (
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                {item.is_milestone == 'on' ? (
                  <FormButton
                    onPress={() =>
                      navigationforword.navigate('ManageMilestone', {
                        data: item,
                        type: 'job',
                        status: status,
                        index: 0,
                      })
                    }
                    buttonTitle={Translation.jobStatusCardViewDetail}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                  />
                ) : (
                  <>
                    <View style={{width: '49%'}}>
                      <FormButton
                        onPress={() =>
                          navigationforword.navigate('ViewHistory', {
                            data: item,
                            type: 'job',
                            status: status,
                          })
                        }
                        buttonTitle={Translation.jobStatusCardViewHistory}
                        backgroundColor={Constant.primaryColor}
                        textColor={Constant.whiteColor}
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <FormButton
                        onPress={() =>
                          navigationforword.navigate('ManageProposals', {
                            data: item,
                            status: 'ongoing',
                          })
                        }
                        buttonTitle={Translation.jobStatusCardViewProposals}
                        backgroundColor={Constant.whiteColor}
                        textColor={Constant.lightGrayColor}
                      />
                    </View>
                  </>
                )}
              </View>
            ) : (
              <FormButton
                onPress={() => {
                  setShowAlert(true);
                  setType('alert');
                  setTitle(Translation.jobStatusCardJobRepost);
                  setAlertOption(true);
                  setDesc(Translation.jobStatusCardReopenJob);
                }}
                buttonTitle={Translation.jobStatusCardRepost}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
                loader={loader}
              />
            )}
          </>
        )}
      </View>
      {status != 'cancel' && (
        <View
          style={{
            borderColor: Constant.borderColor,
            borderWidth: 1,
            borderTopColor: Constant.whiteColor,
            paddingVertical: 8,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: '#FCFCFC',
            paddingHorizontal: 15,
          }}>
          <View style={styles.jobCardInfoListMain}>
            <View style={{flexDirection: 'row'}}>
              <ImageBackground
                resizeMode="cover"
                imageStyle={{
                  borderRadius: 50 / 2,
                }}
                style={{
                  width: 50,
                  height: 50,
                }}
                source={{uri: item.hired_freelancer_img}}
              />
              <View style={{width: '80%', marginLeft: 15}}>
                <View style={styles.rowView}>
                  <Text
                    style={[styles.employerCardHeadingText, {marginBottom: 0}]}>
                    {item.hired_freelancer_title}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                    color: '#676767',
                    fontFamily: Constant.primaryFontRegular,
                  }}>
                  {Translation.jobStatusCardHired}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default JobStatusCard;
