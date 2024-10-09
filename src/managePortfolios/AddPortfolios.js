import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Constant from '../constants/globalConstant';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';
import {useSelector, useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import Notification from '../components/Notification';
import {useIsFocused} from '@react-navigation/native';
import FormInput from '../components/FormInput';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../components/FormButton';

const AddPortfolios = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const portfolioCategoriesTaxonomy = useSelector(
    state => state.global.portfolioCategoriesTaxonomy,
  );
  const portfolioTagsTaxonomy = useSelector(
    state => state.global.portfolioTagsTaxonomy,
  );
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [documentsArray, setDocumentsArray] = useState([]);
  const [galleryArray, setGalleryArray] = useState([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [URL, setURL] = useState('');
  const [detail, setDetail] = useState('');
  const [data, setSata] = useState([{name: '1'}, {name: '2'}, {name: '3'}]);
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoURL, setvideoURL] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);

  const [openTags, setOpenTags] = useState(false);
  const [tagsValue, setTagsValue] = useState([]);
  const [tagsItems, setTagsItems] = useState([]);
  useEffect(() => {
    if (isFocused) {
      documentsArray.length = 0;
      galleryArray.length = 0;
    }
    for (var i = 0; i < portfolioCategoriesTaxonomy.length; i++) {
      categoryItems.push({
        label: decode(portfolioCategoriesTaxonomy[i].name),
        value: portfolioCategoriesTaxonomy[i].id,
      });
    }
    for (var i = 0; i < portfolioTagsTaxonomy.length; i++) {
      tagsItems.push({
        label: decode(portfolioTagsTaxonomy[i].name),
        value: decode(portfolioTagsTaxonomy[i].name),
      });
    }
    if (route.params.data != null) {
      categoryValue.length = 0;
      setTitle(route.params.data.title);
      setLink(route.params.data.custom_link);
      setDetail(route.params.data.description);
      let cat = []
      for (var i = 0; i < route.params.data.categories.length; i++) {
        cat.push(route.params.data.categories[i].id);
      }
      setCategoryValue(cat)
      let tag = []
      for (var i = 0; i < route.params.data.portfolio_tags.length; i++) {
        tag.push(decode(route.params.data.portfolio_tags[i].name));
      }
      setTagsValue(tag)
      setRefreshFlatlist(!refreshFlatlist)
      setvideoURL(route.params.data.db_videos);
      setGalleryArray(route.params.data.gallery_imgs);
      setDocumentsArray(route.params.data.documents);
    }
    else
    {
      
      setTitle('');
      setLink('');
      setCategoryValue([]);
      setTagsValue([]);
      setvideoURL([]);
      setDetail('');
      setGalleryArray([]);
      setDocumentsArray([]);
    }
  }, [isFocused]);
  const addURLtoArray = () => {
    videoURL.push(URL);
    setRefreshFlatlist(!refreshFlatlist);
    setURL('');
  };
  const changeArrayText = (text, index) => {
    videoURL[index] = text;
    setRefreshFlatlist(!refreshFlatlist);
  };
  const deleteURLItem = index => {
    videoURL.splice(index, 1);
    setRefreshFlatlist(!refreshFlatlist);
  };
  const choosePictureFromGallery = async () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      multiple: true,
      maxFiles: 10,
    }).then(img => {
      setUploadedMedia(img);
      for (var i = 0; i < img.length; i++) {
        galleryArray.unshift({
          filename: img[i].filename,
          mime: img[i].mime,
          path: img[i].path,
          size: img[i].size,
          sourceURL: img[i].sourceURL,
        });
      }
      setRefreshFlatlist(!refreshFlatlist);
    });
  };
  const deleteSingleImage = index => {
    galleryArray.splice(index, 1);
    setRefreshFlatlist(!refreshFlatlist);
  };
  const pickDocumentfromDevice = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      for (var i = 0; i < res.length; i++) {
        documentsArray.push(res[i]);
      }
      setRefreshFlatlist(!refreshFlatlist);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const deleteDocument = index => {
    documentsArray.splice(index, 1);
    setRefreshFlatlist(!refreshFlatlist);
  };
  const addPortfolio = async () => {
    let PreGalleryArray = [];
    let newGalleryArray = [];
    let PreDocsArray = [];
    let newDocsArray = [];
    for (var i = 0; i < galleryArray.length; i++) {
      if (galleryArray[i].hasOwnProperty('attachment_id')) {
        PreGalleryArray.push(galleryArray[i]);
      } else {
        newGalleryArray.push(galleryArray[i]);
      }
    }
    for (var i = 0; i < documentsArray.length; i++) {
      if (documentsArray[i].hasOwnProperty('attachment_id')) {
        PreDocsArray.push(documentsArray[i]);
      } else {
        newDocsArray.push(documentsArray[i]);
      }
    }
    setLoading(true);
    const formData = new FormData();
    if (route.params.data != null) {
    formData.append('submit_type', 'update');
    formData.append('id', route.params.data.ID);
    formData.append('previous_images', JSON.stringify(PreGalleryArray));
    formData.append('previous_documents', JSON.stringify(PreDocsArray));

    }else 
    {
    formData.append('submit_type', 'add');
    }
    formData.append('user_id', userInfo.id);
    formData.append('title', title);
    formData.append('custom_link', link);
    formData.append('categories', JSON.stringify(categoryValue));
    formData.append('tags', JSON.stringify(tagsValue));
    formData.append('videos', JSON.stringify(videoURL));
    formData.append('description', detail);
    if (newGalleryArray != null) {
      newGalleryArray.forEach((item, i) => {
          formData.append('gallery_imgs' + i, {
            uri: Platform.OS == 'ios' ? item.sourceURL : item.path,
            type: item.mime,
            name:
              Platform.OS == 'ios'
                ? item.filename
                : item.path.substring(item.path.lastIndexOf('/') + 1),
          });
      });
    }
    formData.append(
      'gallery_size',
      newGalleryArray != null ? newGalleryArray.length : '0',
    );
    if (newDocsArray != null) {
      newDocsArray.forEach((item, i) => {
        formData.append('documents' + i, {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });
    }
    formData.append(
      'documents_size',
      newDocsArray != null ? newDocsArray.length : '0',
    );

    fetch(Constant.BaseUrl + 'portfolios/update_portfolio', {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token.authToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(async response => {
        if (response.type == "success") {
          setShowAlert(true);
          setType(response.type);
          setAlertTitle(response.title);
          setDesc(response.message);
          setTitle('');
          setLink('');
          setCategoryValue([]);
          setTagsValue([]);
          setvideoURL([]);
          setDetail('');
          setGalleryArray([]);
          setDocumentsArray([]);
          if (route.params.data != null) {
            navigation.navigate('PortfoliosLisiting');
            // navigation.goBack();
          }
        } else  {
          setShowAlert(true);
          setType(response.type);
          setAlertTitle(response.title);
          setDesc(response.message);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
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
        title={Translation.addPortfoliosHeader}
      />
       <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={alertTitle}
        desc={desc}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.addPortfoliosPortfolioTitle}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <FormInput
            labelValue={title}
            onChangeText={text => setTitle(text)}
            placeholderText={Translation.addPortfoliosPortfolioTitlePlaceholder}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text style={styles.inputHeading}>{Translation.addPortfoliosCustomLink}</Text>
          <FormInput
            labelValue={link}
            onChangeText={text => setLink(text)}
            placeholderText={Translation.addPortfoliosCustomLinkPalceholder}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text
            style={styles.inputHeading}>
            {Translation.addPortfoliosPortfolioCategories}
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
              borderColor: Constant.whiteColor,
            }}
            dropDownContainerStyle={{
              borderColor: Constant.borderColor,
            }}
            open={openCategory}
            value={categoryValue}
            placeholder={Translation.addPortfoliosSelectPortfolioCategories}
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
            zIndex={1000}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <Text style={styles.inputHeading}>
            {Translation.addPortfoliosPortfolioTags}
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
            open={openTags}
            value={tagsValue}
            placeholder={Translation.addPortfoliosSelectPortfolioTags}
            searchPlaceholder={Translation.globalSearchHere}
            items={tagsItems}
            searchable={true}
            setOpen={setOpenTags}
            setValue={setTagsValue}
            setItems={setTagsItems}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true}
            mode="BADGE"
            zIndex={10}
            disableBorderRadius={true}
            badgeDotColors={['#e76f51']}
          />
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>{Translation.addPortfoliosAddYourVideos}</Text>
            <TouchableOpacity onPress={() => addURLtoArray()}>
              <Feather name={'plus'} color={Constant.fontColor} size={22} />
            </TouchableOpacity>
          </View>
          <View style={styles.subCardView}>
            <FormInput
              labelValue={URL}
              onChangeText={text => setURL(text)}
              placeholderText={Translation.addPortfoliosVideoURL}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={videoURL}
              style={{marginBottom: 10}}
              extraData={refreshFlatlist}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <FormInput
                  labelValue={item}
                  onChangeText={text => changeArrayText(text, index)}
                  placeholderText={Translation.addPortfoliosVideoURL}
                  keyboardType="email-address"
                  autoCorrect={false}
                  iconType={'trash-2'}
                  iconColor={Constant.primaryColor}
                  action = {true}
                  actionIcon={() => deleteURLItem(index)}
                />
              )}
            />
          </View>
          <Text style={styles.inputHeading}>
            {Translation.addPortfoliosPortfolioDetail}
            {/* <Text style={{color: Constant.astaricColor}}>*</Text> */}
          </Text>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={Translation.addPortfoliosPortfolioDetailPlaceholder}
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          <Text style={styles.inputHeading}>
           {Translation.addPortfoliosUploadImages}
            <Text style={{color: Constant.astaricColor}}>*</Text>
          </Text>
          <Text style={styles.managePortfolioImagesDesc}>
            {Translation.addPortfoliosAllowedPhotos}
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
          {galleryArray.length != 0 && (
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
              data={galleryArray}
              extraData={refreshFlatlist}
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
                      item.hasOwnProperty('attachment_id')
                        ? {uri: item.url}
                        : {
                            uri:
                              Platform.OS == 'ios' ? item.sourceURL : item.path,
                          }
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
                        <TouchableOpacity
                          onPress={() => deleteSingleImage(index)}>
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
          <Text style={styles.inputHeading}>{Translation.addPortfoliosUploadDocuments}</Text>
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
              onPress={() => pickDocumentfromDevice()}
              buttonTitle={Translation.globalSelectFile}
              backgroundColor={Constant.greenColor}
              textColor={Constant.whiteColor}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={documentsArray}
            style={{marginVertical: 10}}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.profileSettingProjectListView,
                  {paddingVertical: 15},
                ]}>
                <View style={{marginLeft: 10, width: '80%'}}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.profileSettingFAQList,
                      {color: Constant.fontColor, marginBottom: 0},
                    ]}>
                    {item.name}
                  </Text>
                  {!item.hasOwnProperty("attachment_id") &&
                    <Text
                    numberOfLines={1}
                    style={[
                      styles.profileSettingFAQList,
                      {fontFamily: Constant.primaryFontRegular},
                    ]}>
                    {Translation.addPortfoliosFileSize}{(item.size / 1024).toFixed(2)} KB
                  </Text>}
                </View>
                <TouchableOpacity onPress={() => deleteDocument(index)}>
                  <Feather
                    style={{marginRight: 10}}
                    name={'x'}
                    color={Constant.fontColor}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {/* <Text style={styles.saveButtonDesc}>
            Update all the latest changes made by you, by just clicking on 
            “{Translation.globalSaveUpdate}” button.
          </Text> */}
          <Text style={styles.saveButtonDesc}>
            {Translation.globalSaveUpdateDesc}{' '}
            <Text style={{fontFamily: Constant.secondryFontSemiBold}}>
              "{Translation.globalSaveUpdate}"
            </Text>{' '}
            {Translation.globalSaveUpdateDescEnd}
          </Text>
          <FormButton
            onPress={() => addPortfolio()}
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

export default AddPortfolios;
