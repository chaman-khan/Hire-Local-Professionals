import {Image, Text, View,ImageBackground, TouchableOpacity} from 'react-native';
import React,{useState} from 'react';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';

const AddonsServiceCard = ({item,index,editAddons,deleteAddons}) => {
 
  return (
    <>
      <View style={styles.projectProposalCardView}>
        
      <Text style={styles.jobCardMainHeading}>
      {item.title}
      </Text>
      <View style={[styles.jobCardInfoListMain,{width:"100%"}]}>
        <View style={styles.jobCardNameView}>
          <ImageBackground
            // imageStyle={{borderRadius: 25 / 2}}
            style={styles.jobCardInfoListImage}
            source={require('../../assets/images/dollarCoin.png')}
          />
          <Text style={styles.jobCardInfoListHeading}>{Translation.addonsServiceStartingFrom}</Text>
        </View>
        <Text style={styles.jobCardInfoListHeadingValue}>{decode(item.price_formated)}</Text>
      </View>
      <View style={[styles.jobCardInfoListMain,{width:"100%"}]}>
        <View style={styles.jobCardNameView}>
          <ImageBackground
            // imageStyle={{borderRadius: 25 / 2}}
            style={styles.jobCardInfoListImage}
            source={require('../../assets/images/serviceStatus.png')}
          />
          <Text style={styles.jobCardInfoListHeading}>{Translation.addonsServiceServiceStatus}</Text>
        </View>
        <Text style={styles.jobCardInfoListHeadingValue}>{item.status}</Text>
      </View>
       
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
        onPress={()=> editAddons(item)}
          style={styles.addonsServiceCardLeftButton}>
          <Text
            style={styles.addonsServiceCardLeftButtonText}>
            {Translation.globalEdit}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => deleteAddons(item.ID,index)}
          style={styles.addonsServiceCardRightButton}>
          <Text
            style={styles.addonsServiceCardRightButtonText}>
            {Translation.globalDelete}
          </Text>
        </TouchableOpacity>
      </View>
    
    </>
  )
}

export default AddonsServiceCard