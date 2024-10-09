import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Share,
  ScrollView,
  Dimensions,
  ImageBackground,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../styles/Style';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import Notification from '../components/Notification';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../components/FormButton';
import HTML from 'react-native-render-html';
import {decode} from 'html-entities';
import {useSelector, useDispatch} from 'react-redux';
import EmployerCard from '../employers/EmployerCard';
import Translation from '../constants/Translation';

const EmployerDetail = ({route, navigation}) => {
  const profileImage = useSelector(state => state.value.profileImage);
  const settings = useSelector(state => state.setting.settings);
  const reasons = useSelector(state => state.global.reasonTypeTaxonomy);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const RBSheetReportEmployer = useRef();
  const employerDetail = route.params.item;
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const [selectedInfo, setselectedInfo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [detail, setDetail] = useState('');
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
  const onClickShare = () => {
    Share.share(
      {
        message: "",
        url: employerDetail.company_link,
        title: "Share Employer",
      },
      {
        // Android only:
        dialogTitle: employerDetail.company_link,
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  };
  const openLoginAlert = () => {
    setShowAlert(true);
      setType(Translation.customTabBarError);
      setTitle(Translation.globalOops);
      setDesc(Translation.customTabBarLoginFirst);
  }
  const reportEmployer = async () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'user/reporting',
        {
          user_id: userInfo.id,
          id: employerDetail.employ_id,
          reason: reasonValue,
          description: detail,
          type: 'employer',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          RBSheetReportEmployer.current.close();
          // setRefreshFlatList(!refreshFlatList);
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
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
        login={token != null ? false:true}
        loginAction={()=> {
          setShowAlert(false);
          setTimeout(() => {
            navigation.navigate('Login')
          }, 1000);
        }
        }
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
          <TouchableOpacity
            onPress={() => {
              setReasonValue(null);
              setDetail('');
              token!= null ?  RBSheetReportEmployer.current.open():openLoginAlert();
            }}>
            <Feather
              style={{marginRight: 20}}
              name={'alert-triangle'}
              color={Constant.fontColor}
              size={22}
            />
          </TouchableOpacity>

          <Feather
            onPress={() => onClickShare()}
            style={{marginRight: 25}}
            name="share-2"
            type="share-2"
            color={Constant.fontColor}
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
        <View style={styles.EmployerDetailMainTopView}>
          <ImageBackground
            style={{height: 220}}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            source={
              employerDetail.banner_img != ''
                ? {uri: employerDetail.banner_img}
                : require('../../assets/images/NoImage.png')
            }>
            <View style={styles.EmployerDetailTopImageOverly} />
          </ImageBackground>
          <EmployerCard item={employerDetail} noBorder={true} />
        </View>

        {employerDetail.employer_des != '' && (
          <View style={styles.EmployerDetailMainCardView}>
            <Text style={styles.EmployerDetailMainCardText}>
              {Translation.employerDetailAbout} “{employerDetail.name}”
            </Text>
            {/* <Text style={styles.EmployerDetailMainCardDesc}>
            {employerDetail.employer_des}
          </Text> */}
            <HTML
              tagsStyles={tagsStyles}
              source={{
                html: employerDetail.employer_des,
              }}
            />
          </View>
        )}
        <View style={styles.EmployerDetailMainCardView}>
          <Text style={styles.EmployerDetailMainCardText}>
            {Translation.employerDetailPostedProjects}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={employerDetail.jobs}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View style={styles.EmployerDetailProjectView}>
                <View style={styles.rowView}>
                  <Text style={styles.EmployerDetailProjectUserName}>
                    {employerDetail.name}
                  </Text>
                  <FontAwesome
                    name={'check-circle'}
                    size={16}
                    color={Constant.greenColor}
                  />
                </View>
                <Text style={styles.EmployerDetailProjectName}>
                  {decode(item.project_title)}
                </Text>
                <Text style={styles.EmployerDetailProjectStartText}>
                  {Translation.employerDetailStarting}
                  <Text style={styles.EmployerDetailProjectPrice}>
                    {decode(item.project_cost)}
                  </Text>
                </Text>

                <HTML
                  tagsStyles={tagsStyles}
                  source={{
                    html: item.project_content.substring(0, 200) + '...',
                  }}
                />

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={item.skills}
                  style={{marginBottom: 10}}
                  columnWrapperStyle={{flexWrap: 'wrap'}}
                  numColumns={20}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({item, index}) => (
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.EmployerDetailProjectSkillView}>
                        <Text style={styles.EmployerDetailProjectSkillText}>
                          {item.skill_name}
                        </Text>
                      </View>
                    </View>
                  )}
                />
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/jobIcon0.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.employerDetailSkillLevel}
                    </Text>
                  </View>
                  <Text style={styles.jobCardInfoListHeadingValue}>
                    {item.project_level.level_title}
                  </Text>
                </View>
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/jobIcon1.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.employerDetailDuration}
                    </Text>
                  </View>
                  <Text style={styles.jobCardInfoListHeadingValue}>
                    {item.project_duration}
                  </Text>
                </View>
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/jobIcon3.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.employerDetailProjectType}
                    </Text>
                  </View>
                  <Text style={styles.jobCardInfoListHeadingValue}>
                    {item.project_type}
                  </Text>
                </View>
                <View style={styles.jobCardInfoListMain}>
                  <View style={styles.jobCardNameView}>
                    <ImageBackground
                      // imageStyle={{borderRadius: 25 / 2}}
                      style={styles.jobCardInfoListImage}
                      source={require('../../assets/images/jobIcon4.png')}
                    />
                    <Text style={styles.jobCardInfoListHeading}>
                      {Translation.employerDetailProjectDeadline}
                    </Text>
                  </View>
                  <Text style={styles.jobCardInfoListHeadingValue}>
                    {item.deadline_date}
                  </Text>
                </View>
                {settings.user_meta.access_type.job_access == 'yes' && (
                  <FormButton
                    onPress={() =>
                      navigation.navigate('JobDetail', {item: item})
                    }
                    buttonTitle={Translation.employerDetailViewJob}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                  />
                )}
              </View>
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
      <RBSheet
        ref={RBSheetReportEmployer}
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
              {Translation.employerDetailReportEmployer}
            </Text>
            <TouchableOpacity
              onPress={() => RBSheetReportEmployer.current.close()}
              style={styles.RBSheetHeaderCrossView}>
              <Feather name="x" color={'#484848'} size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputHeading}>
              {Translation.employerDetailReason}
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
              placeholder={Translation.employerDetailSelectReason}
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
              {Translation.employerDetailDescription}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.employerDetailDescription}
                multiline
                value={detail}
                onChangeText={text => setDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>

            <FormButton
              onPress={() => reportEmployer()}
              buttonTitle={Translation.employerDetailReportNow}
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

export default EmployerDetail;
