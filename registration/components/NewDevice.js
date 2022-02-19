import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Container, Icon, Text, Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase from '@react-native-firebase/app';
import SnowFlake from './../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function NewDevice ({ navigation }) {

    const customerEmail = navigation.getParam('customerEmail');
    const ssid = navigation.getParam('ssid');
    const password = navigation.getParam('password');

    const [ currentUser, setCurrentUser ] = useState('');

    useEffect(() => {
        const { currentUser } = firebase.auth()
        setCurrentUser(currentUser);
        if (!customerEmail || !ssid || !password) {
            alert('Customer email address or wireless information was missing, returning to wireless setup.');
            navigation.navigate('Wireless');
        }
        
        console.log('Here is the customer email: ', customerEmail);
        console.log('Here is the SSID: ', ssid);
        console.log('Here is the password: ', password);

    }, []);

    return(
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
            <Text style={styles.titleText}>Thank You for Installing{'\n'}The SnowController</Text>
            <View style={styles.addRow}>
                <Text style={styles.addDeviceText}> 
                    Now we need to connect to the device.{'\n\n'}
                    Please click the bluetooth button on the box three times very quickly, (within 1 second) and press "Add New Device" below to get started.
                </Text>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    onPress={() => (navigation.navigate('FindBLE', {customerEmail: customerEmail, ssid: ssid, password: password}))}
                >
                    <Text style={styles.buttonText}>Add New Device</Text>
                    <Icon type='FontAwesome5' name='rss' />
                </Button>
            </View>
        </Container>
    );
}

export default withNavigation(NewDevice);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    titleText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 22,
        color: '#fff'
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    addDeviceText: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 20,
        color: '#fff'
    },
    addRow: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 5,
        alignItems: 'center'
    },
    addText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: 40,
        marginRight: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    navigationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10, 
    },
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '3%'
    }
});