import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { postMethodFetch } from "../functions";
import { rem } from "../global-variables";
import { flexbox, text } from "./styles";
import GLOBAL from "../GLOBAL";

function Comment(props) {

  return (
    <View style={flexbox}>
      <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { username: props.data.poster })}><Text style={styles.poster}>{props.data.poster}</Text></TouchableOpacity>
      <Text style={styles.comment}>{props.data.comment}</Text>
    </View>
  );

}

const styles = StyleSheet.create({
  poster: {
    ...text,
    fontWeight: "700"
  },
  comment: {
    ...text,
    marginLeft: 0.2 * rem
  }
});

export default Comment;
