import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image } from "react-native";
//import Constants from "expo-constants";
//import * as Permissions from "expo-permissions";
import Icon from 'native-base';
import Fire from "../utils/fire";
//import * as ImagePicker from "expo-image-picker";
import {
    Asset,
    Constants,
    FileSystem,
    Permissions,
    ImagePicker
  } from 'react-native-unimodules';

const firebase = require("firebase");
require("firebase/firestore");

class PostScreen extends React.PureComponent {
    state = {
        text: "",
        id: "3",
        name: "userName/displayName",
        text: "",
        timestamp: "",
        from: "Select",
        to: "Select",
        date: "Select",
        time: "Select",
        freeSpots: "Select",
        spotsNeeded: "Select",
        avatar: null
    };

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    handlePost = () => {
        Fire.shared
            .addPost({ text: this.state.text.trim(), localUri: this.state.avatar })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error); 
            });
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ avatar: result.uri });
        }        
        

    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                     <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                     <Text>Back</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                 <View style={styles.inputContainer}>
                    <Image source={require("../resurces/guy.png")} style={styles.avatar}></Image>
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo}  onPress={this.pickImage}>
                    <Text> Slika </Text>
                </TouchableOpacity>
                 
                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                </View> 
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});

export default  PostScreen;