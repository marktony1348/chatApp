import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

// import permissions, imagePicker and Location
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

export default class CustomActions extends React.Component {
  // allows to pick and upload an image from the device's library
  pickImage = async () => {
    // first ask user for permission to access their media library
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    try {
      // if permission is granted, let user pick an image from library by calling launchImageLibraryAsync
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          // only images are allowed
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));

        // if the user cancel the process and doesn't pick a file 
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // allows to take a photo with the device's camera
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY_WRITE_ONLY);

    try {
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // allows to send the device's current geo-location
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    try {
      if (status === 'granted') {
        // getCurrentPositionAsync reads current location data and returns object with coordinates of location
        let result = await Location.getCurrentPositionAsync({})
          .catch(error => console.log(erorr));

        if (result) {
          // update the state location
          this.props.onSend({
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // uploads images to firebase as blob
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      // create new XMLHttpRequest and set its response type to blob
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      // opens the connection to retrieve the URI's data (the image)
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // create a reference to the storage
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    // use put to store the content retrieved from the AJAX request
    const snapshot = await ref.put(blob);

    // close the connection
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  // when onActionPress is called, an ActionSheet that displays a set of defined actions is created
  onActionPress = () => {
    // strings to be displayed in the ActionSheet
    const options = [
      'Choose from Library',
      'Take Picture',
      'Send Location',
      'Cancel'
    ];
    // determine position of cancel button in ActionSheet, which closes the view
    const cancelButtonIndex = options.length - 1;
    // used to hand down data (the options to display) to the ActionSheet component
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
        }
      }
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={this.onActionPress}
        accessbile={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});