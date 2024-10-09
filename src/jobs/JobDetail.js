import {
  Share,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  ScrollView,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Constant from '../constants/globalConstant';
import HTML from 'react-native-render-html';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import {BallIndicator} from 'react-native-indicators';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Notification from '../components/Notification';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import EmployerCard from '../employers/EmployerCard';
import {decode} from 'html-entities';
import {useSelector, useDispatch} from 'react-redux';
import Translation from '../constants/Translation';

const JobDetail = ({route, navigation}) => {
  const reasons = useSelector(state => state.global.reasonTypeTaxonomy);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const profileImage = useSelector(state => state.value.profileImage);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const RBSheetReportProject = useRef();
  const jobDetail = route.params.item;
  const employerDetail = {
    name: jobDetail.employer[0].name,
    profile_img: jobDetail.employer[0].profile_image,
    _tag_line: jobDetail.employer[0].tag_line,
    followers_count: jobDetail.employer[0].followers_count,
    followers: jobDetail.employer[0].followers,
    employ_id: jobDetail.employer[0].user_id,
  };
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [detail, setDetail] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedInfo, setselectedInfo] = useState(0);
  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(null);
  const [reasonItems, setReasonItems] = useState([]);
  const tagsStyles = {
    body: {
      fontFamily: Constant.secondryFontRegular,
      color: Constant.fontColor,
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  };
  useEffect(() => {
    reasonItems.length = 0;
    for (var i = 0; i < reasons.length; i++) {
      reasonItems.push({
        label: reasons[i].title,
        value: reasons[i].value,
      });
    }
  }, []);
  const openLoginAlert = () => {
    setShowAlert(true);
    setType(Translation.customTabBarError);
    setTitle(Translation.globalOops);
    setDesc(Translation.customTabBarLoginFirst);
  };
  const saveJob = async () => {
    if (jobDetail.favourite == 'yes') {
      setShowAlert(true);
      setType('success');
      setTitle(Translation.jobDetailAlraedy);
      setDesc(Translation.jobDetailAlreadylist);
    } else {
      setLoader(true);
      axios
        .post(
          Constant.BaseUrl + 'user/favorite',
          {
            user_id: userInfo.id,
            favorite_id: jobDetail.job_id,
            type: '_saved_projects',
          },
          {
            headers: {
              Authorization: 'Bearer ' + token.authToken,
            },
          },
        )
        .then(async response => {
          if (response.data.type == 'success') {
            jobDetail.favourite = 'yes';
            route.params.item.favourite = 'yes';
            setRefreshFlatList(!refreshFlatList);
            setLoader(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          } else if (response.data.type == 'error') {
            setLoader(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
        });
    }
  };
  const reportProject = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'user/reporting',
        {
          user_id: userInfo.id,
          id: jobDetail.job_id,
          reason: reasonValue,
          description: detail,
          type: 'project',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          RBSheetReportProject.current.close();
          setRefreshFlatList(!refreshFlatList);
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else if (response.data.type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const onClickShare = () => {
    Share.share(
      {
        message: '',
        url: jobDetail.job_link,
        title: 'Share Job',
      },
      {
        // Android only:
        dialogTitle: jobDetail.job_link,
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        login={token != null ? false : true}
        loginAction={() => {
          setShowAlert(false);
          setTimeout(() => {
            navigation.navigate('Login');
          }, 1000);
        }}
      />
      <View
        style={[styles.headerMainView, {backgroundColor: Constant.whiteColor}]}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => navigation.goBack()}
          style={styles.headerDrawerIcon}>
          <Feather
            name="chevron-left"
            type="chevron-left"
            color={Constant.fontColor}
            size={25}
          />
        </TouchableOpacity>
        <View style={styles.rowView}>
          {loader ? (
            <View style={{marginRight: 20}}>
              <BallIndicator color={Constant.fontColor} size={14} />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => (token != null ? saveJob() : openLoginAlert())}>
                {jobDetail.favourite == 'yes' ? (
                  <AntDesign
                    style={{marginRight: 20}}
                    name="heart"
                    type="heart"
                    color={'#EF4444'}
                    size={22}
                  />
                ) : (
                  <Feather
                    style={{marginRight: 20}}
                    name="heart"
                    type="heart"
                    color={Constant.lightGrayColor}
                    size={22}
                  />
                )}
              </TouchableOpacity>
            </>
          )}
          <Feather
            onPress={() => onClickShare()}
            style={{marginRight: 25}}
            name="share-2"
            type="share-2"
            color={Constant.iconColor}
            size={22}
          />
          <TouchableOpacity>
            <Image
              style={styles.headerPhoto}
              source={
                profileImage != ''
                  ? {uri: profileImage}
                  : require('../../assets/images/NoImage.png')
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {jobDetail.proposal_submitted != 'no' && (
          <View
            style={{
              paddingBottom: 15,
              borderColor: Constant.borderColor,
              borderWidth: 1,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopColor: Constant.whiteColor,
              backgroundColor: Constant.whiteColor,
            }}>
            <View
              style={{
                backgroundColor: '#CEF5E6',
                marginTop: 10,
                padding: 12,
                borderRadius: 10,
                marginHorizontal: 10,
              }}>
              <Text
                style={[
                  styles.invoiceListNotificationText,
                  {color: '#097732'},
                ]}>
                <Text style={{fontFamily: Constant.primaryFontSemiBold}}>
                  {Translation.jobDetailInfo}
                </Text>{' '}
                {Translation.jobDetailSubmittedProposal}
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.ServiceProviderCardPrentStyle,
            {width: '100%', backgroundColor: Constant.whiteColor},
          ]}>
          <FontAwesome
            style={styles.jobCardMainViewBookmark}
            name={jobDetail.is_featured != 'no' ? 'bookmark' : ''}
            size={20}
            color={Constant.primaryColor}
          />
          <Text style={styles.JobDetailHeading}>
            {decode(jobDetail.project_title)}
          </Text>
          <View style={styles.jobCardInfoListMain}>
            <View style={styles.jobCardNameView}>
              <ImageBackground
                // imageStyle={{borderRadius: 25 / 2}}
                style={styles.jobCardInfoListImage}
                source={require('../../assets/images/jobIcon6.png')}
              />
              <Text style={styles.jobCardInfoListHeading}>
                {jobDetail.estimated_hours == '' ? 'Cost' : 'Hourly rate:'}
              </Text>
            </View>
            {jobDetail.estimated_hours == '' ? (
              <Text style={styles.jobCardInfoListHeadingValue}>
                {decode(jobDetail.project_cost)}
                {jobDetail.max_price != ''
                  ? ' - ' + decode(jobDetail.max_price)
                  : ''}
              </Text>
            ) : (
              <Text style={styles.jobCardInfoListHeadingValue}>
                {decode(jobDetail.hourly_rate)}
              </Text>
            )}
          </View>
          {jobDetail.project_level.level_title != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon0.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailSkill}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.project_level.level_title}
              </Text>
            </View>
          )}
          {jobDetail.project_duration != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon1.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailDuration}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.project_duration}
              </Text>
            </View>
          )}
          {jobDetail.job_type != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon2.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailJobType}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.job_type}
              </Text>
            </View>
          )}
          {jobDetail.project_type != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon3.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailProject}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.project_type}
              </Text>
            </View>
          )}
          {jobDetail.deadline_date != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon4.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailDeadline}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.deadline_date}
              </Text>
            </View>
          )}
          {jobDetail.english_level != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon7.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailEnglish}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.english_level}
              </Text>
            </View>
          )}
          {jobDetail.location._country != '' && (
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.jobCardNameView}>
                <ImageBackground
                  // imageStyle={{borderRadius: 25 / 2}}
                  style={styles.jobCardInfoListImage}
                  source={require('../../assets/images/jobIcon5.png')}
                />
                <Text style={styles.jobCardInfoListHeading}>
                  {Translation.jobDetailLocation}
                </Text>
              </View>
              <Text style={styles.jobCardInfoListHeadingValue}>
                {jobDetail.location._country}
              </Text>
            </View>
          )}
          <View style={styles.jobCardInfoListMain}>
            <View style={styles.jobCardNameView}>
              <ImageBackground
                // imageStyle={{borderRadius: 25 / 2}}
                style={styles.jobCardInfoListImage}
                source={require('../../assets/images/jobIcon8.png')}
              />
              <Text style={styles.jobCardInfoListHeading}>
                {Translation.jobDetailProposalsReceived}
              </Text>
            </View>
            <Text style={styles.jobCardInfoListHeadingValue}>
              {jobDetail.proposal_count <= 1
                ? jobDetail.proposal_count + ' ' + Translation.jobDetailProposal
                : jobDetail.proposal_count +
                  ' ' +
                  Translation.jobDetailProposals}
            </Text>
          </View>
          {jobDetail.proposal_submitted == 'no' &&
            profileInfo.user_type == 'freelancer' && (
              <FormButton
                onPress={() =>
                  navigation.navigate('SendProposal', {
                    data: jobDetail,
                    edit: false,
                  })
                }
                buttonTitle={Translation.jobDetailSendProposal}
                backgroundColor={Constant.primaryColor}
                textColor={Constant.whiteColor}
              />
            )}
          {jobDetail.direction != '' && (
            <FormButton
              onPress={() => Linking.openURL(jobDetail.direction)}
              buttonTitle={Translation.jobDetailGetDirections}
              backgroundColor={Constant.grayColor}
              textColor={'#676767'}
              iconName={'map-pin'}
            />
          )}
        </View>

        <View style={styles.JobDetailCardMainView}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.JobDetailCardMainText}>
              {Translation.jobDetailProjectDetail}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setReasonValue(null);
                setDetail('');
                token != null
                  ? RBSheetReportProject.current.open()
                  : openLoginAlert();
              }}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 2,
                backgroundColor: Constant.primaryColor,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.JobDetailItemText,
                  {color: Constant.whiteColor},
                ]}>
                {Translation.jobDetailReport}
              </Text>
              <Feather
                name={'alert-triangle'}
                color={Constant.whiteColor}
                size={16}
              />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.JobDetailCardDescription}>
            {jobDetail.project_content}
          </Text> */}
          <HTML
            tagsStyles={tagsStyles}
            source={{
              html: jobDetail.project_content,
            }}
          />
          <Text style={[styles.JobDetailCardMainTextSub, {marginTop: 10}]}>
            {Translation.jobDetailSkillsRequired}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={jobDetail.skills}
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.JobDetailItemView}>
                  <Text style={styles.JobDetailItemText}>
                    {item.skill_name}
                  </Text>
                </View>
              </View>
            )}
          />
          <Text style={styles.JobDetailCardMainTextSub}>
            {Translation.jobDetailIndustryCategories}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={jobDetail.categories}
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.JobDetailItemView}>
                  <Text style={styles.JobDetailItemText}>
                    {decode(item.name)}
                  </Text>
                </View>
              </View>
            )}
          />
          <Text style={styles.JobDetailCardMainTextSub}>
            {Translation.jobDetailLanguages}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={jobDetail.languages}
            style={{marginBottom: 10}}
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={20}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.JobDetailItemView}>
                  <Text style={styles.JobDetailItemText}>{item.name}</Text>
                </View>
              </View>
            )}
          />
          <Text style={styles.JobDetailCardMainText}>
            {Translation.jobDetailAttachments}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={jobDetail.attachments}
            style={{marginBottom: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={styles.JobDetailAttachmentItemView}>
                <Text style={styles.JobDetailAttachmentItemText}>
                  {item.document_name}
                </Text>
                <Feather
                  name={'download'}
                  color={Constant.fontColor}
                  size={18}
                />
              </View>
            )}
          />
        </View>
        {jobDetail.faq.length != 0 && (
          <View style={styles.JobDetailCardMainView}>
            <Text style={styles.JobDetailFAQsMainHeading}>
              {Translation.jobDetailFequently}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.JobDetailFAQsFlatlist}
              data={jobDetail.faq}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      setselectedQuestion(
                        selectedQuestion == index ? null : index,
                      )
                    }
                    style={[
                      styles.JobDetailFAQsQuestionView,
                      {
                        borderBottomWidth:
                          index == jobDetail.faq.length - 1 ? 0 : 1,
                      },
                    ]}>
                    <Text style={styles.JobDetailFAQsQuestionText}>
                      {item.faq_question}
                    </Text>
                    <Feather
                      name={selectedQuestion == index ? 'minus' : 'plus'}
                      color={Constant.fontColor}
                      size={18}
                    />
                  </TouchableOpacity>
                  {selectedQuestion == index && (
                    <View style={styles.JobDetailFAQsAnswerView}>
                      <Text style={styles.JobDetailFAQsAnswerText}>
                        {item.faq_answer}
                      </Text>
                    </View>
                  )}
                </>
              )}
            />
          </View>
        )}
        <View style={styles.JobDetailEmployerView}>
          <Text style={styles.JobDetailEmployerText}>
            {Translation.jobDetailAboutEmployer}
          </Text>

          <EmployerCard item={employerDetail} />
        </View>
      </ScrollView>
      <RBSheet
        ref={RBSheetReportProject}
        height={Dimensions.get('window').height * 0.5}
        duration={250}
        customStyles={{
          container: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 25,
            backgroundColor: 'transparent',
          },
        }}>
        <View style={styles.RBSheetMainView}>
          <View style={styles.RBSheetHeaderView}>
            <Text style={styles.freelancerDetailCardNameTextStyle}>
              {Translation.jobDetailReportProject}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetReportProject.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.jobDetailReason}
            </Text>
            <DropDownPicker
              style={styles.MultiselectmainView}
              textStyle={{
                color: Constant.fontColor,
                fontSize: 16,
              }}
              placeholderStyle={{
                color: Constant.lightGrayColor,
                fontWeight: '400',
              }}
              searchContainerStyle={{
                borderBottomColor: Constant.borderColor,
              }}
              searchTextInputStyle={{
                color: '#000',
                borderColor: Constant.whiteColor,
              }}
              dropDownContainerStyle={{
                borderColor: Constant.borderColor,
              }}
              open={openReason}
              value={reasonValue}
              placeholder={Translation.jobDetailSelectReason}
              searchPlaceholder={Translation.globalSearchHere}
              items={reasonItems}
              searchable={true}
              setOpen={setOpenReason}
              setValue={setReasonValue}
              setItems={setReasonItems}
              listMode="MODAL"
              theme="LIGHT"
              multiple={false}
              mode="BADGE"
              zIndex={100}
              disableBorderRadius={true}
              badgeDotColors={['#e76f51']}
            />
            <Text style={styles.inputHeading}>
              {Translation.jobDetailDescription}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.jobDetailDescription}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>

            <FormButton
              onPress={() => reportProject()}
              buttonTitle={Translation.jobDetailReportNow}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loading}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default JobDetail;
