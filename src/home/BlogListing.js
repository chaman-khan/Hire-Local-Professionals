import { View, Text , FlatList , TouchableOpacity , SafeAreaView , Image} from 'react-native'
import React , {useEffect  , useState} from 'react'
import ServiceListSkeleton from './ServiceListSkeleton';
import BlogCard from './BlogCard';
import * as Constant from '../constants/globalConstant';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import BlogListSkeleton from './BlogListSkeleton';

const BlogListing = ({navigation}) => {
  const [blogList, setBlogList] = useState([]);
  const [countryJobsSpinner, setCountryJobsSpinner] = useState(true);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileImage = useSelector(state => state.value.profileImage);

    useEffect(() => {
        getBlogs();
    }, [])

    const getBlogs = async () => {
        return fetch(
          Constant.BaseUrl +
            'blog/blog_post_listings?user_id=' +
            userInfo.id +
            '&show_posts=5&page_number=1',
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
          .then(response => response.json())
          .then(responseJson => {
            setCountryJobsSpinner(false);
            setBlogList(responseJson.posts);
          })
          .catch(error => {
            setLoader(false);
            console.error(error);
          });
      };
    
  return (
    <SafeAreaView style={styles.globalContainer}>
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
          <Text
            style={[
              styles.serviceDetailTitleStyle,
              {fontFamily: Constant.primaryFontMedium, fontSize: 15},
            ]}>
            Blog listing
          </Text>
        </TouchableOpacity>
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
     <View style={{marginBottom:50}}>
            {countryJobsSpinner ? (
              <>
                <BlogListSkeleton />
                <BlogListSkeleton />
                <BlogListSkeleton />
                <BlogListSkeleton />
                <BlogListSkeleton />
                <BlogListSkeleton />
              </>
            ) : (
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={blogList}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                  style={{marginHorizontal:10 , marginVertical:5}}
                    onPress={() =>
                      navigation.navigate('BlogDetail', {
                        item: item,
                        edit: false,
                      })
                    }>
                    <BlogCard width={"100%"} item={item} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
    </SafeAreaView>
  )
}

export default BlogListing