import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../components/Header';
import axios from 'axios';
import Notification from '../components/Notification';
import HTML from 'react-native-render-html';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';

const HelpAndSupport = () => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [description, setDescription] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [searchedFaqs, setSearchedFaqs] = useState([])
  const [detail, setDetail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openReason, setOpenReason] = useState(false);
  const [reasonValue, setReasonValue] = useState(null);
  const [reasonItems, setReasonItems] = useState([]);
  const tagsStyles = {
    body: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 15,
      lineHeight: 24,
      letterSpacing: 0.5,
      color: Constant.fontColor,
    },
  };
  useEffect(() => {
    getHelpSupportList()
  }, [])
  
  const getHelpSupportList = async () => {
    reasonItems.length = 0
    return fetch(Constant.BaseUrl + 'profile/help_faq', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setDescription(responseJson.result.desc)
        setFaqs(responseJson.result.faqs)
        setSearchedFaqs(responseJson.result.faqs)
        for (var i = 0; i < responseJson.result.query.length; i++) {
          reasonItems.push({
            label: responseJson.result.query[i].value,
            value: responseJson.result.query[i].key,
          });
        }
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const handleSearch = text => {
    const formattedQuery = text.toLowerCase()
    const newData = faqs.filter((item) => {
      return item.question.toLowerCase().includes(formattedQuery)
    })
    setSearchedFaqs(newData)
  }
  const submitQuery = async () => {
    setLoading(true)
      axios
        .post(Constant.BaseUrl + "profile/help_support_query", {
          user_id: userInfo.id,
          query_type: reasonValue,
          details: detail,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },)
        .then(async (response) => {
  
          if (response.data.type == 'success') {
            setLoading(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
            setDetail("")
            setReasonValue(null)
            
          } else if (response.data.type == 'error') {
            setLoading(false);
            setShowAlert(true);
            setType(response.data.type);
            setTitle(response.data.title);
            setDesc(response.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("err",error);
        });
    };
    const hideAlert = () => {
      setShowAlert(false);
    };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Header
        backColor={Constant.whiteColor}
        iconColor={Constant.iconColor}
        heading={true}
        title={Translation.helpAndSupportText}
      />
        <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>{Translation.helpAndSupportSettings}</Text>
          <View style={styles.managePortfolioSearchView}>
            <Feather name="search" color={Constant.lightGrayColor} size={20} />
            <TextInput
              style={{marginLeft: 8}}
              // value={search}
              onChangeText={handleSearch}
              placeholder={Translation.helpAndSupportSearch}
              placeholderTextColor="#676767"
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.PayoutSettingsPayoutDesc}>
            {description}
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchedFaqs}
            style={{marginBottom: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <>
                <View
                  style={{
                    backgroundColor: Constant.grayColor,
                    borderColor: Constant.borderColor,
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 10,
                    padding: 15,
                    borderBottomLeftRadius: selectedQuestion == index ? 0 : 10,
                    borderBottomRightRadius: selectedQuestion == index ? 0 : 10,
                    borderBottomColor:
                      selectedQuestion == index
                        ? Constant.whiteColor
                        : Constant.borderColor,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedQuestion(
                        selectedQuestion == index ? null : index,
                      )
                    }
                    style={styles.PayoutSettingsPayoutViewTop}>
                    <Text style={styles.PayoutSettingsPayoutName}>
                    {item.question}
                    </Text>
                  </TouchableOpacity>
                </View>
                {selectedQuestion == index && (
                  <View
                    style={{
                      backgroundColor: Constant.whiteColor,
                      borderColor: Constant.borderColor,
                      borderWidth: 1,
                      borderTopColor: Constant.whiteColor,
                      borderRadius: 10,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      padding: 15,
                      paddingTop:0,
                      marginBottom: 10,
                      marginTop: -3,
                    }}>
                    {/* <Text
                      style={[
                        styles.PayoutSettingsPayoutName,
                        {marginBottom: 0},
                      ]}>
                     {item.question}
                    </Text> */}
                    {/* <Text style={styles.PayoutSettingsPayoutDesc}>
                      {}
                    </Text> */}
                    <HTML
                              tagsStyles={tagsStyles}
                              source={{html: item.answer}}
                            />
                  </View>
                )}
              </>
            )}
          />
        </View>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>{Translation.helpAndSupportAsk}</Text>
          <Text style={styles.inputHeading}>
            {Translation.helpAndSupportSelectReason}
            <Text style={{color: Constant.astaricColor}}>*</Text>
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
            placeholder={Translation.helpAndSupportQueryType}
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
            zIndex={1000}
            disableBorderRadius={true}
            badgeDotColors={[Constant.primaryColor]}
          />
          <Text style={styles.inputHeading}>{Translation.helpAndSupportDescriptionDetails}</Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={Translation.helpAndSupportDescription}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          <FormButton
            onPress={() => submitQuery()}
            buttonTitle={Translation.globalSubmit}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpAndSupport;
