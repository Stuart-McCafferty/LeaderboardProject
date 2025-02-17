import React, { useState, useEffect, useRef } from 'react';
// import axios from "axios";
import { StyleSheet, Text, View, Button, Image, TextInput, Dimensions, Switch, ScrollView, Alert, TouchableOpacity, Pressable } from 'react-native';
import * as FaceDetector from 'expo-face-detector';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';  
import { ceil } from 'react-native-reanimated';
import {Picker} from '@react-native-picker/picker';
import { COLOR_PRIMARY } from "../components/styles";
import { postMethodFetch } from "../functions";
import GLOBAL from "../GLOBAL";

export default function FeedScreen({ route, navigation, props }) {
    const {image} = route.params; //POST
    const {imageobj} = route.params; //POST
    const {image64} = route.params; //POST
    const {long} = route.params; //POST
    const {lat} = route.params; //POST
    let latShort = parseFloat(lat).toFixed(4); 
    let lonShort = parseFloat(long).toFixed(4);
    const {subregion} = route.params; //POST
    const {region} = route.params; //POST
    const {country} = route.params; //POST
    const [face, faceExists] = useState(false); //POST

    const [captionText, onChangeCaption] = React.useState(''); //POST
    const [challenge, onChangeChallenge] = useState(); //POST
    const [tag, onChangeTag] = React.useState(''); //POST



    const [shouldShow, setShouldShow] = useState(true);
    const [shouldShowBut, setShouldShowBut] = useState(true);
    const [exactLocation, setExactLocation] = useState(true); //POST
    const toggleSwitch = () => setExactLocation(previousState => !previousState);



    

    /*
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + myApiKey)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            this.setState({ country : JSON.stringify(responseJson.results.address_components.long_name)});
              })
*/



//To post: image*, lat/latShort, long/longShort, subregion, region*, country*,  captionText, challenge, face

const postPhoto = () => {

  const submission = {
    caption:captionText.captionText,
    poster: GLOBAL.USERNAME,
    location: "",
    hashtags: tag.tag,
    key: GLOBAL.KEY,
  }; 

  if (image64) {
    console.log("IMAGE OBJECT");
    console.log(submission);
    console.log(image64.base64.length);
    pushFrames(submission, image64.base64)
  }
  else {
    console.log("IMAGE IS NULL");
  }

};

const pushFrames = (postData, image) => {


  image = "data:image/jpeg;base64," + image;
  console.log("POST DATA");
  console.log(postData);

  const frames = chunkText(image);

  postMethodFetch(postData, "/post/include-post-data", response => {
    console.log(response);
    if (response && response.success) {

      console.log("POST DATA SENT SUCCESSFULLY");
      ////// show alert box saying "Image being uploaded" //////
      Alert.alert(
        "UPLOADING",
        "Please Wait",
        [
          {
            text: "Cancel Upload",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      )  

      frames.forEach((chunk, index) => {

	const submission = { sourceUser: postData.poster, index, chunk };

	postMethodFetch(submission, "/post/push-frame", res => {
	  
	  if (res.completed) {
	    console.log("IMAGE HAS BEEN SUCCESSFULL UPLOADED");
	    console.log(res);
	    ////// image has been uploaded //////
	    ////// hide alert box - or change to "Image Uploaded" //////
      Alert.alert(
        "IMAGE UPLOADED",
        "",
        [
          {
            text: "Return",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      )
	  }
  

	});

      });
    }
    else {
  
      ////// show alert box saying error trying to upload image //////

    }
  });


};

const chunkText = (text) => {
  const chunkSize = 20000;
  const chunks = new Array();
  for (let i = 0; i <= text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  chunks.push("#");
  return chunks;
};


//submit post
const submitButton = async () => {
  console.log(imageobj); 
  if (face == true) {
    console.log("No, bad!2"); 

    Alert.alert(
      "We think we see a person.",
      "Eden is a service for sharing photos of things you find out in the world. This does not include humans. By pressing 'Post Anyway', you confirm that this image does not contain any people. If it does, your photo will be removed.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Post anyway", onPress: () => postPhoto }
      ],
      { cancelable: false }
    )              
  }
  else {postPhoto;}
};



// face detection
useEffect(() => {
  (async () => {
  const options = { mode: FaceDetector.Constants.Mode.fast };
  const isFace = await FaceDetector.detectFacesAsync(image, options);
  console.log(isFace);

  if( isFace.faces.length === 0){
    console.log("no faces!!! :)");
    await setShouldShow(shouldShow);
    await setShouldShowBut(shouldShowBut);
    faceExists(false);
    console.log('face is ' + face);
    // console.log(image64);

  }
  else{
    console.log('fACE >:(');
    await setShouldShow(!shouldShow);
    await setShouldShowBut(!shouldShowBut);
    faceExists(true);
    console.log('face is ' + face);

  }
})();
}, []);

    
    return (
      <View>
    <ScrollView  contentContainerStyle={{justifyContent: 'space-between', }}>  
    <View style={{flex:2, backgroundColor:'white', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <View style={{elevation:1, width: Dimensions.get('window').width, height: Dimensions.get('window').height*.4, alignItems: 'center', backgroundColor: 'black'}}>{/*image container */}
        {<Image source={{ uri: image }} resizeMode={'contain'} style={{ width: '100%', height: '100%', maxHeight: Dimensions.get('window').height*.4, maxWidth: Dimensions.get('window').width*.9 }}/>}
      </View>

      <View style={styles.container}>
        {/*Here we will return the view when state is true 
        and will return false if state is false*/}
        {shouldShow ?  <View style={{
            width: Dimensions.get('window').width,
            height: 30,
            backgroundColor: 'white',
            fontSize: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          </View> : (
          <View style={{
            width: Dimensions.get('window').width,
            height: 30,
            backgroundColor: 'crimson',
            fontSize: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{color: 'white'}}>⚠️ Face Detected</Text>
          </View>
        ) }
      </View>

      <View style={{flex:1,  alignSelf: 'center', }}>

      </View>


      <View style={{flex:1.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent:'center'}}>
            <MaterialIcons name="my-location" size={30}  style={{padding: 20}} color="black" /> 
            <Text style={{color: "black", fontSize: 24}}>{subregion},</Text>
            <Text style={{color:'rgb(170,170,170)', fontSize: 24}}> {country}</Text> 
      </View>
      

      {exactLocation ?  
          <View style={{flex:1,flexDirection:'row', }}>
            <View style={{flex:0.5, flexDirection:'column', marginLeft:80}}>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={{color:'rgb(170,170,170)', fontSize: 20}}>Lat: </Text> 
                  <Text style={{color: "black", fontSize: 20}}>{latShort}</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={{color:'rgb(170,170,170)', fontSize: 20}}>Lon: </Text> 
                  <Text style={{color: "black", fontSize: 20}}>{lonShort}</Text>
                </View>
            </View>
            <View style={{flex:0.2, flexDirection:'column'}}> 
              <Switch
              
              onValueChange={toggleSwitch}
              value={exactLocation}     
              />
            </View>
          </View> 
          : (
          <View style={{flex:1,flexDirection:'row', }}>
            <View style={{flex:0.5, flexDirection:'column', marginLeft:80}}>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={{color:'rgb(170,170,170)', fontSize: 20}}>Lat: </Text> 
                  <Text style={{color: "lightgray", fontSize: 20, textDecorationLine: 'line-through'}}>{latShort}</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={{color:'rgb(170,170,170)', fontSize: 20}}>Lon: </Text> 
                  <Text style={{color: "lightgray", fontSize: 20, textDecorationLine: 'line-through'}}>{lonShort}</Text>
                </View>
            </View>
            <View style={{flex:0.2, flexDirection:'column'}}> 
              <Switch
              onValueChange={toggleSwitch}
              value={exactLocation}     
              />
            </View>
          </View>
        ) }





        <View style={{flex:1,}}> 
          <View style={{flex:1, flexDirection: 'row', alignItems: 'center', alignContent: 'flex-end'}}>
                <MaterialIcons name="text-fields" size={30} style={{padding: 20}} color="black" /> 

                <TextInput
                  style={{borderBottomWidth:1, fontSize: 20, width: Dimensions.get('window').width*0.7, }}
                  placeholder={'Caption'}
                  value={captionText}
                  onChangeText={captionText => onChangeCaption({ captionText })}
                />
          </View>
      </View> 
      <View style={{flex:1,}}>
          <View style={{flex:1, flexDirection: 'row', alignItems: 'center', alignContent: 'flex-end'}}>
                <MaterialCommunityIcons name="trophy-outline" size={30} style={{padding: 20}} color="black" />
                <Picker
                  style={{ width: Dimensions.get('window').width*0.4, postion: 'absolute', transform: [{scaleX: 1.3}, {scaleY: 1.3}], left: 15,}}
                  selectedValue={challenge}
                  onValueChange={(itemValue, itemIndex) =>
                    onChangeChallenge(itemValue)
                  }>
                  <Picker.Item label="Challenge" value="none" />
                  <Picker.Item label="Birds" value="birds" />
                  <Picker.Item label="Slug" value="slug" />
                  <Picker.Item label="Buildings" value="building" />
                </Picker>

          </View>
      </View>
      <View style={{flex:1,}}>
          <View style={{flex:1, flexDirection: 'row', alignItems: 'center', alignContent: 'flex-end'}}>
                <MaterialCommunityIcons name="tag-outline" size={24} size={30} style={{padding: 20}} color="black" />
                <TextInput
                  style={{borderBottomWidth:1, fontSize: 20, width: Dimensions.get('window').width*0.7, }}
                  placeholder={'Comma-separated hashtags'}
                  value={tag}
                  onChangeText={tag => onChangeTag({ tag })}
                />
          </View>
      </View>


    
    </View>
    
    </ScrollView>
    {shouldShowBut ?              
        <Pressable
            activeOpacity={0.7}
            onPress={postPhoto}
            style={{
              position: 'absolute',
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
              right: 10,
              bottom: 10,
              
              borderRadius: 50,
              backgroundColor: COLOR_PRIMARY,
              alignSelf: 'flex-end',
              
            }}>
              <MaterialIcons name="send" size={28} color="white" />
      </Pressable> : (
      <Pressable
            activeOpacity={0.7}
            onPress={submitButton}
            style={{
              position: 'absolute',
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
              right: 10,
              bottom: 10,
              
              borderRadius: 50,
              backgroundColor: 'crimson',
              alignSelf: 'flex-end',
              
            }}>
              <MaterialIcons name="send" size={28} color="white" />
      </Pressable>
        ) }
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.35,
  },
});
