import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Content, Picker, Text, Icon, Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import SnowFlake from './../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function Relay ({ navigation }) {

    const custEmail = navigation.getParam('customerEmail');
    const macAddress = navigation.getParam('macAddress');

    const [ installerEmail, setInstallerEmail ] = useState(firebase.auth().currentUser.email);
    const [ zoneExists, setZoneExists ] = useState(false);
    const [ friendlyZoneNames, setFriendlyZoneNames ] = useState([]);
    const [ zoneName, setZoneName ] = useState('Driveway');
    const [ selectedRelay, setSelectedRelay ] = useState('RELAY1');

    useEffect(() => {
        
        console.log('Here is the customer email address: ', custEmail);
        console.log('Here is the mac address: ', macAddress);
        console.log('Here is the installer/logged in user email address: ', installerEmail);

        const dbMac = database().ref('devices');
        dbMac.orderByChild('INSTALLER_EMAIL').equalTo(installerEmail).on('value', function(snapshot) {
            if (snapshot.val()) {
                console.log('Data exists: ', snapshot.val());
                snapshot.forEach((child) => {
                    console.log('Here is the Mac Address: ', child.key);
                    if (macAddress == child.key) {
                        console.log('Existing zone exists for this Mac Address.');
                        setZoneExists(true);
                    }
                });
            } else {  // New installer, first device setup
                console.log('NO data exists.');
            }
        });

        getFriendlyListOfZones();

    }, []);

    getFriendlyListOfZones = () => {
        database().ref('zones').once('value', function
        (snapshot) {
            setFriendlyZoneNames(snapshot.val())
        });
    }

    setupNewDevice = () => {
        console.log('Entered the setupNewDevice function.');
        if (zoneExists) {
            console.log('Mac Address already exists, setting up additional zones.');
            alert('Zone already exists for this device, please contact support to setup a new zone.');
        } else {
            console.log('Mac Address DOES NOT exist, setting up new device.');

            const deviceRef = firebase.database().ref('devices/' + macAddress);
            deviceRef.set({ 
                EMAIL           : custEmail,
                INPUT1          : { STATUS: 'OPEN' },
                INPUT2          : { STATUS: 'OPEN' },
                INPUT3          : { STATUS: 'OPEN' },
                INSTALLER_EMAIL : installerEmail,
                LAST_BYPASS     : { DATE_TIME: '', HOURS: '', STATUS: 'OFF' },
                LAST_PREHEAT    : { DATE_TIME: '', HOURS: '' },
                RELAY1          : { STATUS: 'OFF' },
                RELAY2          : { STATUS: 'OFF' },
                RELAY3          : { STATUS: 'OFF' },
                RELAY4          : { STATUS: 'OFF' },
                RELAY5          : { STATUS: 'OFF' },
                RELAY6          : { STATUS: 'OFF' },
                RELAY7          : { STATUS: 'OFF' },
                RELAY8          : { STATUS: 'OFF' },
                TAMPER_SWITCH   : { DATE_TIME: '', STATUS: 'OPEN' },
                ZONE1           : { ACTIVE: true, BYPASS_STATUS: 'OFF', NAME: zoneName, PREHEAT_STATUS: 'OFF', RELAY_USED: selectedRelay, STATUS: 'OFF' },
                ZONE2           : { ACTIVE: false, BYPASS_STATUS: 'OFF', PREHEAT_STATUS: 'OFF', RELAY_USED: '', STATUS: 'OFF' },
                ZONE3           : { ACTIVE: false, BYPASS_STATUS: 'OFF', PREHEAT_STATUS: 'OFF', RELAY_USED: '', STATUS: 'OFF' },
                ZONE4           : { ACTIVE: false, BYPASS_STATUS: 'OFF', PREHEAT_STATUS: 'OFF', RELAY_USED: '', STATUS: 'OFF' }
            });
        }
        setupRelay();
    }

    handleLogout = () => {
            firebase.auth().signOut()
            .then(() => navigation.navigate('Login'))
            .catch(error => setErrorMessage(error.message))
    }

    setupRelay = () => {
        alert('Zone 1 now tied to ' + selectedRelay);
        alert('Thank you for setting up the new zone.');
        navigation.navigate('Wireless');
    }

    return(
        <Container style={styles.container}>
            <Content>
            <TopHeader />
            <SnowFlake />
            <View style={styles.addRow}>
                <Text style={styles.relayText}> 
                    Lastly, we need to connect the relay(s) you wired earlier, to the new zone.
                </Text>
            </View>
            <Text style={styles.zoneText}>Zone 1</Text>            
                <Picker
                    note
                    mode="dropdown"
                    style={styles.picker}
                    placeholder='Select Relay'
                    selectedValue={selectedRelay}
                    onValueChange={(value) => setSelectedRelay(value)}          
                >
                    <Picker.Item label="Relay 1" value="RELAY1" />
                    <Picker.Item label="Relay 2" value="RELAY2" />
                    <Picker.Item label="Relay 3" value="RELAY3" />
                    <Picker.Item label="Relay 4" value="RELAY4" />
                </Picker>
            <Text style={styles.friendlyLabel}>Select a Friendly Name for the New Zone</Text>
                <Picker
                    style={styles.picker}
                    Header="Zone Name"
                    mode="dropdown"
                    placeholder='Select Zone'
                    selectedValue={zoneName}
                    onValueChange={(value) => setZoneName(value)}
                    >
                    {friendlyZoneNames.map((zones, i) => {
                        return (
                        <Picker.Item label={zones} value={zones} key={i} />
                        );
                    }
                    )}
            </Picker>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    onPress={() => setupNewDevice()}
                >
                    <Text style={styles.buttonText}>Add New Relay</Text>
                    <Icon type='FontAwesome5' name='plug' />
                </Button>
            </View>
            <View style={styles.addRow}>
                <TouchableOpacity onPress={ handleLogout }>
                    <Text style={styles.navigationText}>Log out ></Text>
                </TouchableOpacity>
            </View>  
            </Content>
        </Container>
    );
}

export default withNavigation(Relay);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    relayText: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        fontSize: 20,
        color: '#fff'
    },
    zoneText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 30,
        color: '#fff'
    },
    friendlyLabel: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 17,
        color: '#fff'
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
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
    picker: {
        color: '#fff',
        marginTop: 20,
        width: 200
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