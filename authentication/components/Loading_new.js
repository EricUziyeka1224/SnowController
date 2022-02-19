import React, { Component, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { withNavigation } from 'react-navigation';

function Loading({ navigation }) {
    // Set an initilizing state whilst Firebase connects
    const [initilizing, setInitilizing] = useState(true);
    const [user, setUser] = useState();
    
    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initilizing) setInitilizing(false);
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if (!user) {
        console.log('User not present.'); //navigation.navigate('Login');
    } else {
        navigation.navigate('Device');
    }

    return (
        <View style={styles.container}>
            <Image
                style={{ width: 84, height: 84 }}
                source={ require('../../assets/images/new_icon.png') }
            />
            <Text>Loading</Text>
            <ActivityIndicator size="large" color='#465f9b' />
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