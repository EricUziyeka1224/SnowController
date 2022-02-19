import React, { Component, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { withNavigation } from 'react-navigation';

function Loading({ navigation }) {
    
    useEffect(() => {
        auth().onAuthStateChanged(user => {
            if (user) {
                const userEmail = firebase.auth().currentUser.email;
                const dbCust = database().ref('customers');
                dbCust.orderByChild('email').equalTo(userEmail).on('child_added', function(snapshot) {
                    var customerInfo = snapshot.val();
                    if (customerInfo.ownerInstaller == 'Owner') {
                        navigation.replace('Main');
                    } else {
                        navigation.replace('Wireless');
                    }
                });
            } else {
                navigation.replace('Login');
            }
        })
    }, []);

    moveForward = () => {
        navigation.navigate('Wireless');
    }

    return (
        <View style={styles.container}>
            <Image
                style={{ width: 84, height: 84 }}
                source={ require('../../assets/images/new_icon.png') }
            />
            <Text>Loading</Text>
            <ActivityIndicator size="large" color='#465f9b' />
            <View>
                <Button onPress={() => moveForward()} title='Stuck'><Text>Stuck >>></Text></Button>
            </View>
        </View>
    );
}
 
export default withNavigation(Loading);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});