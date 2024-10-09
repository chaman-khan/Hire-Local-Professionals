import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Switch,
  Platform,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../styles/Style';
import Header from '../components/Header';
import * as Constant from '../constants/globalConstant';
import FormInput from '../components/FormInput';
import DropDownPicker from 'react-native-dropdown-picker';
import {decode} from 'html-entities';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import Translation from '../constants/Translation';
import DocumentPicker from 'react-native-document-picker';
import FormButton from '../components/FormButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {updateServiceTab} from '../redux/GlobalStateSlice';

const PostService = ({serviceItem, addons, reload}) => {
  const token = useSelector(state => state.value.token);
  const settings = useSelector(state => state.setting.settings);
  const userInfo = useSelector(state => state.value.userInfo);
  const languageTaxonomy = useSelector(state => state.global.languageTaxonomy);
  const locationTaxonomy = useSelector(state => state.global.locationTaxonomy);
  const englishLevelTaxonomy = useSelector(
    state => state.global.englishLevelTaxonomy,
  );
  const deliveryTaxonomy = useSelector(state => state.global.deliveryTaxonomy);
  const categoryTaxonomy = useSelector(
    state => state.global.serviceCategoryTaxonomy,
  );
  const responseTimeTaxonomy = useSelector(
    state => state.global.responseTimeTaxonomy,
  );
  const dispatch = useDispatch();
  const [serviceTitle, setServiceTitle] = useState('');
  const [price, setPrice] = useState('');
  const [fileName, setFileName] = useState('');
  const [loader, setLoader] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [files, setFiles] = useState([]);
  const [addonsTitle, setAddonsTitle] = useState('');
  const [addonsPrice, setAddonsPrice] = useState('');
  const [addonsDetail, setAddonsDetail] = useState('');
  const [addonsServices, setAddonsServices] = useState([]);
  const [detail, setDetail] = useState('');
  const [URL, setURL] = useState('');
  const [videosURL, setVideosURL] = useState([]);
  const [serviceImages, setServiceImages] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [refreshFlatList, setRefreshFlatList] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedAddonsServices, setSelectedAddonsServices] = useState([]);
  const [editFile, setEditFile] = useState(false);
  const [fileIndex, setfileIndex] = useState(null);
  const [addonsIndex, setAddonsIndex] = useState(null);
  const [faqsIndex, setFaqsIndex] = useState(null);

  const [openServiceDelivery, setOpenServiceDelivery] = useState(false);
  const [serviceDeliveryValue, setServiceDeliveryValue] = useState(null);
  const [serviceDeliveryItems, setServiceDeliveryItems] = useState([]);

  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);

  const [openResponseTime, setOpenResponseTime] = useState(false);
  const [responseTimeValue, setResponseTimeValue] = useState(null);
  const [responseTimeItems, setResponseTimeItems] = useState([]);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [languageValue, setLanguageValue] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);

  const [openEnglishLevel, setOpenEnglishLevel] = useState(false);
  const [englishLevelValue, setEnglishLevelValue] = useState(null);
  const [englishLevelItems, setEnglishLevelItems] = useState([]);

  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [locationItems, setLocationItems] = useState([]);

  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [downloadable, setDownloadable] = useState(true);

  useEffect(() => {
    languageItems.length = 0;
    locationItems.length = 0;
    serviceDeliveryItems.length = 0;
    for (var i = 0; i < deliveryTaxonomy.length; i++) {
      serviceDeliveryItems.push({
        label: deliveryTaxonomy[i].name,
        slug: deliveryTaxonomy[i].slug,
        value: deliveryTaxonomy[i].id,
      });
    }
    for (var i = 0; i < categoryTaxonomy.length; i++) {
      categoryItems.push({
        label: decode(categoryTaxonomy[i].name),
        value: categoryTaxonomy[i].id,
        slug: categoryTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < responseTimeTaxonomy.length; i++) {
      responseTimeItems.push({
        label: responseTimeTaxonomy[i].name,
        value: responseTimeTaxonomy[i].id,
        slug: responseTimeTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < languageTaxonomy.length; i++) {
      languageItems.push({
        label: languageTaxonomy[i].name,
        value: languageTaxonomy[i].id,
        slug: languageTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < englishLevelTaxonomy.length; i++) {
      englishLevelItems.push({
        label: englishLevelTaxonomy[i].name,
        value: englishLevelTaxonomy[i].slug,
      });
    }
    for (var i = 0; i < locationTaxonomy.length; i++) {
      locationItems.push({
        label: locationTaxonomy[i].name,
        value: locationTaxonomy[i].slug,
      });
    }
    if (serviceItem != null) {
      setServiceTitle(serviceItem.title);
      setServiceDeliveryValue(serviceItem.delivery_time.length != 0 &&  serviceItem.delivery_time[0].id);
      setDownloadable(serviceItem.downloadable == 'no' ? false : true);
      setResponseTimeValue(serviceItem.response_time.length != 0 &&   serviceItem.response_time[0].id);
      setEnglishLevelValue(serviceItem.english_level.length != 0 && serviceItem.english_level[0].slug);
      setPrice(serviceItem.price);
      setDetail(serviceItem.content);
      setServiceImages(serviceItem.images);
      setLocationValue(serviceItem.country.length != 0 && serviceItem.country[0].slug);
      setAddress(serviceItem.address);
      setLongitude(serviceItem.longitude);
      setLatitude(serviceItem.latitude);
      setFeatured(serviceItem.is_featured == 'yes' ? true : false);
      setShowMap(serviceItem.show_map == "on" ? true : false)
      
      let cat = []
      for (var i = 0; i < serviceItem.categories.length; i++) {
        cat.push(serviceItem.categories[i].id);
      }
      setCategoryValue(cat)
      let lang = []
      for (var i = 0; i < serviceItem.speak_languages.length; i++) {
        lang.push(serviceItem.speak_languages[i].id);
      }
      setLanguageValue(lang)
      setRefreshFlatList(!refreshFlatList);
      for (var i = 0; i < serviceItem.addons.length; i++) {
        selectedAddonsServices.push(serviceItem.addons[i].ID);
      }
      setRefreshFlatList(!refreshFlatList);
      setFaqs(serviceItem.faq);
      for (var i = 0; i < serviceItem.videos.length; i++) {
        videosURL.push({
          videotitle: serviceItem.videos[i],
        });
      }
    }
  }, []);
  const toggleMapSwitch = () => {
    setShowMap(previousState => !previousState);
  };
  const toggleFeaturedSwitch = () => {
    setFeatured(previousState => !previousState);
  };
  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      setSelectedFile(res[0]);
      setDisable(true);
      setRefreshFlatList(!refreshFlatList);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const changeTextFileName = text => {
    selectedFile.name = text;
    setRefreshFlatList(!refreshFlatList);
  };
  const addFileToArray = () => {
    files.push(selectedFile);
    setRefreshFlatList(!refreshFlatList);
    setSelectedFile('');
    setDisable(false);
  };
  const updateFileToArray = () => {
    files[fileIndex] = selectedFile;
    setRefreshFlatList(!refreshFlatList);
    setSelectedFile('');
    setDisable(false);
    setEditFile(false);
    setfileIndex(null);
  };
  const editFileInArray = (item, index) => {
    setEditFile(true);
    setfileIndex(index);
    setSelectedFile(JSON.parse(JSON.stringify(item)));
    setDisable(true);
    setRefreshFlatList(!refreshFlatList);
  };
  const deleteFile = index => {
    files.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };
  const PushInArray = (item, index) => {
    if (selectedAddonsServices.includes(item.ID)) {
      const index = selectedAddonsServices.indexOf(item.ID);
      if (index > -1) {
        selectedAddonsServices.splice(index, 1);
      }
      setRefreshFlatList(!refreshFlatList);
    } else {
      selectedAddonsServices.push(item.ID);
      setRefreshFlatList(!refreshFlatList);
    }
  };
  const addAddonsservices = () => {
    if (addonsTitle != '' && addonsPrice != '' && addonsDetail != '') {
      addonsServices.push({
        title: addonsTitle,
        price: addonsPrice,
        description: addonsDetail,
      });
      setRefreshFlatList(!refreshFlatList);
      setAddonsTitle('');
      setAddonsPrice('');
      setAddonsDetail('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalFillCompleteData);
    }
  };
  const updateAddonsservices = () => {
    if (addonsTitle != '' && addonsPrice != '' && addonsDetail != '') {
      addonsServices[addonsIndex].title = addonsTitle;
      addonsServices[addonsIndex].price = addonsPrice;
      addonsServices[addonsIndex].description = addonsDetail;
      setRefreshFlatList(!refreshFlatList);
      setAddonsTitle('');
      setAddonsPrice('');
      setAddonsDetail('');
      setAddonsIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalFillCompleteData);
    }
  };

  const editAddonsService = (item, index) => {
    setAddonsIndex(index);
    setAddonsTitle(item.title);
    setAddonsPrice(item.price);
    setAddonsDetail(item.description);
    setRefreshFlatList(!refreshFlatList);
  };
  const deleteAddonsService = index => {
    addonsServices.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };

  const addURLVideos = () => {
    if (URL != '') {
      videosURL.push({
        videotitle: URL,
      });
      setRefreshFlatList(!refreshFlatList);
      setURL('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.postServicePleaseAddURL);
    }
  };
  const deleteURL = index => {
    videosURL.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };
  const choosePictureFromGallery = async () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      multiple: true,
      maxFiles: 10,
      mediaType: 'photo',
    }).then(img => {
      setUploadedMedia(img);
      for (var i = 0; i < img.length; i++) {
        serviceImages.unshift({
          filename: img[i].filename,
          mime: img[i].mime,
          path: img[i].path,
          size: img[i].size,
          sourceURL: img[i].sourceURL,
        });
      }

      setRefreshFlatList(!refreshFlatList);
    });
  };
  const deleteImage = index => {
    serviceImages.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };
  const addFAQs = () => {
    if (faqQuestion != '' && faqAnswer != '') {
      faqs.push({
        faq_question: faqQuestion,
        faq_answer: faqAnswer,
      });
      setRefreshFlatList(!refreshFlatList);
      setFaqQuestion('');
      setFaqAnswer('');
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalFillCompleteData);
    }
  };
  const updateFAQs = () => {
    if (faqQuestion != '' && faqAnswer != '') {
      faqs[faqsIndex].faq_question = faqQuestion;
      faqs[faqsIndex].faq_answer = faqAnswer;
      setRefreshFlatList(!refreshFlatList);
      setFaqQuestion('');
      setFaqAnswer('');
      setFaqsIndex(null);
    } else {
      setShowAlert(true);
      setType('error');
      setTitle(Translation.globalOops);
      setDesc(Translation.globalFillCompleteData);
    }
  };
  const editFAQs = (item, index) => {
    setFaqsIndex(index);
    setFaqQuestion(item.faq_question);
    setFaqAnswer(item.faq_answer);
    setRefreshFlatList(!refreshFlatList);
  };
  const deleteFAQs = index => {
    faqs.splice(index, 1);
    setRefreshFlatList(!refreshFlatList);
  };
  const saveAndUpdateService = async () => {
    setLoading(true)
    const formData = new FormData();
    let prevImages = []
    let newImages = []
    serviceImages.forEach((item, i) => {
      if (item.hasOwnProperty('url')) 
    {prevImages.push(item)}
    else
    {
      newImages.push(item)
    }
    })
    let prevDocs = []
    let newDocs = []
    files.forEach((item, i) => {
      if (item.hasOwnProperty('attachment_id')) 
    {prevDocs.push(item)}
    else
    {
      newDocs.push(item)
    }
    })

    if (serviceItem != null) {
     
      formData.append('id', serviceItem.ID);
      formData.append('submit_type', 'update');
      formData.append(
        'old_images_service',
        JSON.stringify(prevImages),
      );
      formData.append(
        'old_download_attachments_service',
        JSON.stringify(prevDocs),
      );
    }
    formData.append('user_id', userInfo.id);
    formData.append('title', serviceTitle);
    formData.append('delivery_time', serviceDeliveryValue);
    formData.append('response_time', responseTimeValue);
    formData.append('english_level', englishLevelValue);
    formData.append('price', price);
    formData.append('description', detail);
    formData.append('country', locationValue);
    formData.append('address', address);
    formData.append('longitude', longitude);
    formData.append('latitude', latitude);
    formData.append('is_featured', featured ? 'on' : 'off');
    formData.append('categories', JSON.stringify(categoryValue));
    formData.append('languages', JSON.stringify(languageValue));
    formData.append('addons', JSON.stringify(selectedAddonsServices));
    formData.append('addons_service', JSON.stringify(addonsServices));
    formData.append('faq', JSON.stringify(faqs));
    formData.append('videos', JSON.stringify(videosURL));
    formData.append('downloadable', downloadable ? 'yes' : 'no');
    if (newDocs.length >= 1) {
      formData.append('donwload_size', newDocs.length);
    } else {
      formData.append('donwload_size', 0);
    }
    if (newImages.length >= 1) {
      formData.append('size', newImages.length);
    } else {
      formData.append('size', 0);
    }
    if (newImages.length >= 1) {
      newImages.forEach((item, i) => {
        if (item.hasOwnProperty('filename')) {
          formData.append('service_images' + i, {
            uri: Platform.OS == 'ios' ? item.sourceURL : item.path,
            type: item.mime,
            name:  Platform.OS == 'ios' ? item.filename : item.path.substring(item.path.lastIndexOf('/') + 1),
          });
        }
      });
    }
    if (newDocs.length >= 1) {
      newDocs.forEach((item, i) => {
        formData.append('downloads_documents' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    fetch(Constant.BaseUrl + 'services/update_service', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token.authToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
    setLoading(false)
        if (response.type == 'success') {
          setServiceTitle('');
          setServiceDeliveryValue(null);
          setResponseTimeValue(null);
          setEnglishLevelValue(null);
          setPrice('');
          setDetail('');
          setLocationValue(null);
          setAddress('');
          setLongitude('');
          setLatitude('');
          setFeatured(false);
          setCategoryValue([]);
          setLanguageValue([]);
          setSelectedAddonsServices([]);
          setAddonsServices([]);
          setFaqs([]);
          setVideosURL([]);
          dispatch(updateServiceTab(3));
          reload();
        } else if (response.type == 'error') {
          setShowAlert(true);
          setType(response.type);
          setTitle(response.title);
          setDesc(response.message);
        }
      })
      .catch(error => {
    setLoading(false)
        console.log('error', error);
      });
  };

  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Notification
          show={showAlert}
          hide={hideAlert}
          type={type}
          title={title}
          desc={desc}
        />
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.postServiceTitle}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={serviceTitle}
            onChangeText={text => setServiceTitle(text)}
            placeholderText={Translation.postServiceTitlePlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text style={styles.inputHeading}>
            {Translation.postServiceServiceDelivery}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openServiceDelivery}
            value={serviceDeliveryValue}
            placeholder={Translation.postServiceSelectServiceDelivery}
            searchPlaceholder={Translation.globalSearchHere}
            items={serviceDeliveryItems}
            searchable={true}
            setOpen={setOpenServiceDelivery}
            setValue={setServiceDeliveryValue}
            setItems={setServiceDeliveryItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndexInverse={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postServicePrice}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={price}
            onChangeText={text => setPrice(text)}
            placeholderText={Translation.postServicePricePlaceholder}
            keyboardType="number-pad"
            autoCorrect={false}
          />
          {settings.services_settings.remove_service_downloadable == "no" &&
         <>
          <Text style={styles.inputHeading}>{Translation.postServiceDownloadableService}</Text>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <TouchableOpacity
              onPress={() => setDownloadable(true)}
              style={[
                styles.smallButton,
                {
                  backgroundColor: downloadable
                    ? Constant.greenColor
                    : Constant.whiteColor,
                },
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  {color: downloadable ? Constant.whiteColor : '#484848'},
                ]}>
                {Translation.globalYes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedFile('');
                setDownloadable(false);
              }}
              style={[
                styles.smallButton,
                {
                  backgroundColor: !downloadable
                    ? Constant.greenColor
                    : Constant.whiteColor,
                },
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  {color: !downloadable ? Constant.whiteColor : '#484848'},
                ]}>
               {Translation.globalNo}
              </Text>
            </TouchableOpacity>
          </View>
          {downloadable && (
            <>
              <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
                <Text style={styles.inputHeading}>{Translation.postServiceAddYourFiles}</Text>
                {/* <Feather name={'plus'} color={Constant.fontColor} size={22} /> */}
              </View>
              <View style={styles.subCardView}>
                <Text style={styles.inputHeading}>
                  {Translation.postServiceFileName}
                  {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                </Text>
                <FormInput
                  labelValue={selectedFile.name}
                  onChangeText={text => changeTextFileName(text)}
                  placeholderText={Translation.postServiceFileNamePlaceholder}
                  keyboardType="email-address"
                  autoCorrect={false}
                  editable={disable}
                />
                <Text style={styles.inputHeading}>
                  {Translation.postServiceAddURL}
                  {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
                </Text>
                <FormInput
                  labelValue={selectedFile.uri}
                  // onChangeText={text => selectedFile.uri=text}
                  editable={false}
                  placeholderText={Translation.postServiceAddfileURL}
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                <View style={styles.uploadFileView}>
                  <Image
                    resizeMode="contain"
                    style={styles.uploadFileImage}
                    source={require('../../assets/images/File.png')}
                  />
                  <Text style={styles.uploadFileViewText}>
                    {Translation.globalClickHere}{' '}
                    <Text style={{color: Constant.fontColor}}>
                      {Translation.globalUpload}
                    </Text>
                  </Text>
                  <FormButton
                    onPress={() => pickDocumentfromDevice()}
                    buttonTitle={Translation.globalSelectFile}
                    backgroundColor={Constant.greenColor}
                    textColor={Constant.whiteColor}
                  />
                </View>
                {disable && (
                  <FormButton
                    onPress={() =>
                      editFile ? updateFileToArray() : addFileToArray()
                    }
                    buttonTitle={Translation.globalSaveUpdate}
                    backgroundColor={Constant.primaryColor}
                    textColor={Constant.whiteColor}
                  />
                )}
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={files}
                style={{marginBottom: 10}}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.JobDetailAttachmentItemView,
                      {backgroundColor: '#FCFCFC'},
                    ]}>
                    <Text style={styles.JobDetailAttachmentItemText}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => editFileInArray(item, index)}>
                      <Feather
                        style={{marginRight: 15}}
                        name={'edit-3'}
                        color={Constant.fontColor}
                        size={20}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => deleteFile(index)}>
                      <Feather
                        name={'trash-2'}
                        color={Constant.primaryColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}
          </>}
         {settings.services_settings.remove_service_addon == "no" &&
         <>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>{Translation.postServiceAddonsServices}</Text>
            {/* <Feather name={'plus'} color={Constant.fontColor} size={22} /> */}
          </View>
          <View style={styles.subCardView}>
            <Text style={styles.inputHeading}>
             {Translation.postServiceAddonServiceTitle}
              {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
            </Text>
            <FormInput
              labelValue={addonsTitle}
              onChangeText={text => setAddonsTitle(text)}
              placeholderText={Translation.postServiceAddonTitlePlaceholder}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <Text style={styles.inputHeading}>
              {Translation.postServicePrice}
              {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
            </Text>
            <FormInput
              labelValue={addonsPrice}
              onChangeText={text => setAddonsPrice(text)}
              placeholderText={Translation.postServicePricePlaceholder}
              keyboardType="number-pad"
              autoCorrect={false}
            />
            <Text style={styles.inputHeading}>
              {Translation.postServiceDetail}
              {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.postServiceAddonServiceDetail}
                multiline
                value={addonsDetail}
                onChangeText={text => setAddonsDetail(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <View style={[styles.rowView, {justifyContent: 'flex-end'}]}>
              <TouchableOpacity
                onPress={() =>
                  addonsIndex != null
                    ? updateAddonsservices()
                    : addAddonsservices()
                }
                style={[
                  styles.smallButton,
                  {backgroundColor: Constant.blueColor},
                ]}>
                <Text style={[styles.buttonText, {color: Constant.whiteColor}]}>
                  {addonsIndex != null ? Translation.postServiceUpdatetoList : Translation.postServiceAddtoList}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={addonsServices}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.PostServiceListView, {flexDirection: 'column'}]}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <View>
                    <Text style={styles.PostServiceListText}>{item.title}</Text>
                    <Text style={styles.PostServiceListPriceText}>
                      {decode(settings.currency_symbol)}
                      {item.price}
                    </Text>
                    <Text
                      style={[
                        styles.serviceListCardRatingCountStyle,
                        {marginLeft: 10, color: '#676767'},
                      ]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.rowView, {justifyContent: 'space-between'}]}>
                  <TouchableOpacity
                    onPress={() => editAddonsService(item, index)}
                    style={[
                      styles.smallButton,
                      {backgroundColor: Constant.blueColor},
                    ]}>
                    <Text
                      style={[styles.buttonText, {color: Constant.whiteColor}]}>
                      {Translation.globalEdit}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteAddonsService(index)}
                    style={[
                      styles.smallButton,
                      {
                        backgroundColor: Constant.primaryColor,
                      },
                    ]}>
                    <Text
                      style={[styles.buttonText, {color: Constant.whiteColor}]}>
                      {Translation.globalDelete}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={addons}
            extraData={refreshFlatList}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => PushInArray(item, index)}
                style={[styles.PostServiceListView, {flexDirection: 'column'}]}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                  <TouchableOpacity
                    onPress={() => PushInArray(item, index)}
                    style={styles.checkBoxMainView}>
                    {selectedAddonsServices.includes(item.ID) ? (
                      <View style={styles.checkBoxCheck}>
                        <FontAwesome
                          name="check"
                          type="check"
                          color={Constant.whiteColor}
                          size={14}
                        />
                      </View>
                    ) : (
                      <View style={styles.checkBoxUncheck} />
                    )}
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.PostServiceListText}>{item.title}</Text>
                    <Text style={styles.PostServiceListPriceText}>
                      {item.price}
                    </Text>
                    <Text
                      style={[
                        styles.serviceListCardRatingCountStyle,
                        {marginLeft: 10, color: '#676767'},
                      ]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          </>}
          {settings.services_settings.services_categories == "yes" &&
         <>
          <Text style={styles.inputHeading}>
            {Translation.postServiceServiceCategories}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openCategory}
            value={categoryValue}
            placeholder={Translation.postServiceSelectCategories}
            searchPlaceholder={Translation.globalSearchHere}
            items={categoryItems}
            searchable={true}
            setOpen={setOpenCategory}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true}
            mode="BADGE"
            zIndex={10000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          </>}
          <Text style={styles.inputHeading}>
            {Translation.postServiceServiceResponseTime}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openResponseTime}
            value={responseTimeValue}
            placeholder={Translation.postServiceSelectResponseTime}
            searchPlaceholder={Translation.globalSearchHere}
            items={responseTimeItems}
            searchable={true}
            setOpen={setOpenResponseTime}
            setValue={setResponseTimeValue}
            setItems={setResponseTimeItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={1000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
           {settings.services_settings.remove_service_languages == "no" &&
         <>
          <Text
            style={styles.inputHeading}
            >
            {Translation.postServiceSelectLanguage}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openLanguage}
            value={languageValue}
            placeholder={Translation.postServiceSelectLanguage}
            searchPlaceholder={Translation.globalSearchHere}
            items={languageItems}
            searchable={true}
            setOpen={setOpenLanguage}
            setValue={setLanguageValue}
            setItems={setLanguageItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true}
            mode="BADGE"
            zIndex={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          </>}
          {settings.services_settings.remove_service_english_level == "no" &&
         <>
          <Text style={styles.inputHeading}>
            {Translation.postServiceEnglishLevel}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openEnglishLevel}
            value={englishLevelValue}
            placeholder={Translation.postServiceSelectEnglishLevel}
            searchPlaceholder={Translation.globalSearchHere}
            items={englishLevelItems}
            searchable={true}
            setOpen={setOpenEnglishLevel}
            setValue={setEnglishLevelValue}
            setItems={setEnglishLevelItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndex={10}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          </>}
          <Text style={styles.inputHeading}>
            {Translation.postServiceDetails}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={'Service detail'}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          {settings.services_settings.service_video_option == "no" &&
         <>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>{Translation.postServiceAddYourVideos}</Text>
            {/* <Feather name={'plus'} color={Constant.fontColor} size={22} /> */}
          </View>
          <View style={styles.subCardView}>
            <View style={styles.rowView}>
              <View style={{width: '85%'}}>
                <FormInput
                  labelValue={URL}
                  onChangeText={text => setURL(text)}
                  placeholderText={Translation.postServiceVideoURL}
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => addURLVideos()}
                style={{
                  width: '17%',
                  marginLeft: -5,
                  marginTop: 5,
                  marginBottom: 10,
                  height: 50,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: Constant.blueColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather name={'plus'} color={Constant.whiteColor} size={25} />
              </TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={videosURL}
              style={{marginBottom: 10}}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <FormInput
                  labelValue={item.videotitle}
                  onChangeText={text => {
                    videosURL[index].videotitle = text;
                    setRefreshFlatList(!refreshFlatList);
                  }}
                  placeholderText={Translation.postServiceVideoURL}
                  keyboardType="email-address"
                  autoCorrect={false}
                  iconType={'trash-2'}
                  iconColor={Constant.primaryColor}
                  action = {true}
                  actionIcon={() => deleteURL(index)}
                />
              )}
            />
          </View>
          </>}
          <Text style={styles.inputHeading}>{Translation.postServiceUploadImages}</Text>
          <Text style={styles.PostServiceImageUploadDesc}>
           {Translation.postServiceAllowedForImages}
          </Text>
          <View style={[styles.uploadFileView, {backgroundColor: '#FCFCFC'}]}>
            <Image
              resizeMode="contain"
              style={styles.uploadFileImage}
              source={require('../../assets/images/File.png')}
            />
            <Text style={styles.uploadFileViewText}>
              {Translation.globalClickHere}{' '}
              <Text style={{color: Constant.fontColor}}>{Translation.globalUpload}</Text>
            </Text>
            <FormButton
              onPress={() => choosePictureFromGallery()}
              buttonTitle={Translation.globalSelectFile}
              backgroundColor={Constant.greenColor}
              textColor={Constant.whiteColor}
            />
          </View>
          {serviceImages.length != 0 && (
            <FlatList
              style={{
                borderRadius: 10,
                borderColor: Constant.borderColor,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 15,
              }}
              showsVerticalScrollIndicator={false}
              data={serviceImages}
              numColumns={3}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedGalleryImage(
                      selectedGalleryImage == index ? null : index,
                    )
                  }
                  style={{
                    flex: 1,
                    marginHorizontal: 3,
                    backgroundColor: '#FCFCFC',
                    borderColor: Constant.borderColor,
                    borderWidth: 1,
                    borderRadius: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                  }}>
                  <ImageBackground
                    resizeMode="cover"
                    style={{height: 120, width: '100%'}}
                    imageStyle={{
                      borderRadius: 10,
                    }}
                    source={
                      item.hasOwnProperty('filename')
                        ? {
                            uri:
                              Platform.OS == 'ios' ? item.sourceURL : item.path,
                          }
                        : {uri: item.url}
                    }>
                    {selectedGalleryImage == index && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          borderRadius: 10,
                          backgroundColor: '#00000090',
                        }}>
                        <TouchableOpacity onPress={() => deleteImage(index)}>
                          <Feather
                            name={'trash-2'}
                            color={Constant.primaryColor}
                            size={22}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />
          )}
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}> {Translation.postServiceFeaturedService}</Text>
            <Switch
              style={{
                transform: [{scaleX: 0.8}, {scaleY: 0.8}],
              }}
              trackColor={{false: '#DDDDDD', true: '#22C55E'}}
              thumbColor={Constant.whiteColor}
              ios_backgroundColor={'#DDDDDD'}
              onValueChange={toggleFeaturedSwitch}
              value={featured}
            />
          </View>
          <Text style={styles.inputHeading}>
           {Translation.postServiceLocation}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
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
              borderColor: Constant.darkGrayColor,
            }}
            dropDownContainerStyle={{
              backgroundColor: Constant.darkGrayColor,
              borderColor: Constant.borderColor,
            }}
            open={openLocation}
            value={locationValue}
            placeholder={Translation.postServiceSelectLocation}
            searchPlaceholder={Translation.globalSearchHere}
            items={locationItems}
            searchable={true}
            setOpen={setOpenLocation}
            setValue={setLocationValue}
            setItems={setLocationItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            zIndexInverse={100}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.postServiceYourAddress}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <FormInput
            labelValue={address}
            onChangeText={text => setAddress(text)}
            placeholderText={Translation.postServiceAddAddressPlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'crosshair'}
            iconColor={Constant.lightGrayColor}
          />
          <FormInput
            labelValue={longitude}
            onChangeText={text => setLongitude(text)}
            placeholderText={Translation.postServiceLongitude}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'alert-circle'}
            iconColor={Constant.lightGrayColor}
          />
          <FormInput
            labelValue={latitude}
            onChangeText={text => setLatitude(text)}
            placeholderText={Translation.postServiceLatitude}
            keyboardType="email-address"
            autoCorrect={false}
            iconType={'alert-circle'}
            iconColor={Constant.lightGrayColor}
          />
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={[styles.inputHeading, {width: '80%'}]}>
              {Translation.postServiceShowMapDirection}
            </Text>
            <Switch
              style={{
                transform: [{scaleX: 0.8}, {scaleY: 0.8}],
              }}
              trackColor={{false: '#DDDDDD', true: '#22C55E'}}
              thumbColor={Constant.whiteColor}
              ios_backgroundColor={'#DDDDDD'}
              onValueChange={toggleMapSwitch}
              value={showMap}
            />
          </View>
          {settings.services_settings.service_faq_option == "yes" &&
         <>
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>{Translation.postServiceServiceFAQ}</Text>
            {/* <Feather name={'plus'} color={Constant.fontColor} size={22} /> */}
          </View>
          <View style={styles.subCardView}>
            <Text style={styles.inputHeading}>
              {Translation.postServiceQuestion}
              {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
            </Text>
            <FormInput
              labelValue={faqQuestion}
              onChangeText={text => setFaqQuestion(text)}
              placeholderText={Translation.postServiceQuestionPlaceholder}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <Text style={styles.inputHeading}>
              {Translation.postServiceAnswer}
              {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
            </Text>
            <View style={styles.multilineTextInputView}>
              <TextInput
                placeholder={Translation.postServiceAnswerPlacholder}
                multiline
                value={faqAnswer}
                onChangeText={text => setFaqAnswer(text)}
                placeholderTextColor={Constant.lightGrayColor}
                style={styles.multilineTextInput}
              />
            </View>
            <View style={[styles.rowView, {justifyContent: 'flex-end'}]}>
              <TouchableOpacity
                onPress={() => (faqsIndex != null ? updateFAQs() : addFAQs())}
                style={[
                  styles.smallButton,
                  {backgroundColor: Constant.blueColor},
                ]}>
                <Text style={[styles.buttonText, {color: Constant.whiteColor}]}>
                  {faqsIndex != null ? Translation.postServiceUpdatetoList : Translation.postServiceAddtoList}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={faqs}
            style={{marginBottom: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.JobDetailAttachmentItemView,
                  {backgroundColor: '#FCFCFC'},
                ]}>
                <Text style={styles.JobDetailAttachmentItemText}>
                  {item.faq_question}
                </Text>
                <TouchableOpacity onPress={() => editFAQs(item, index)}>
                  <Feather
                    style={{marginRight: 15}}
                    name={'edit-3'}
                    color={Constant.fontColor}
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteFAQs(index)}>
                  <Feather
                    name={'trash-2'}
                    color={Constant.primaryColor}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          </>}
          <Text style={styles.PostServiceSaveDesc}>
            {Translation.globalSaveUpdateDesc}{' '}
            <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
              "{Translation.globalSaveUpdate}"
            </Text>{' '}
            {Translation.globalSaveUpdateDescEnd}
          </Text>
          <FormButton
            onPress={() => saveAndUpdateService()}
            buttonTitle={Translation.globalSaveUpdate}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostService;
