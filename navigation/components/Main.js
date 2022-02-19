import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import { Container, Icon, Button, Text } from 'native-base';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { withNavigation } from 'react-navigation';
import Snowflake from '../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function Main({ navigation }) {
    const [ currentUser, setCurrentUser ] = useState('');
    const [ macAddress, setMacAddress ] = useState('');
    const [ zone1, setZone1 ] = useState('');
    const [ zone2, setZone2 ] = useState('');
    const [ zone3, setZone3 ] = useState('');
    const [ zone4, setZone4 ] = useState('');
    const [ zone1Image, setZone1Image ] = useState(null);
    const [ zone2Image, setZone2Image ] = useState(null);
    const [ zone3Image, setZone3Image ] = useState(null);
    const [ zone4Image, setZone4Image ] = useState(null);
    const [ zone1Active, setZone1Active ] = useState('');
    const [ zone2Active, setZone2Active ] = useState('');
    const [ zone3Active, setZone3Active ] = useState('');
    const [ zone4Active, setZone4Active ] = useState('');
    
    //const zone = navigation.getParam('zone1Name');

    useEffect(() => {
        const user = firebase.auth().currentUser.email;
        setCurrentUser(user);

        // Add check to see if snapshot exists.  If not, then no devices setup for the user
        // Alert them to call their local Snow Controller Installer

        const dbMac = database().ref('devices');
        dbMac.orderByChild('EMAIL').equalTo(user).on('value', function(snapshot) {
                       
            let zones = [];
            let commonZones = ['Driveway', 'Walkway', 'Roof', 'Sidewalk'];
            let commonZoneCounter = 0;

            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    zones.push({
                        _key: child.key,
                        zone1Name: child.val().ZONE1.NAME,
                        zone1PreheatStatus: child.val().ZONE1.PREHEAT_STATUS,
                        zone1BypassStatus: child.val().ZONE1.BYPASS_STATUS,
                        zone1Active: child.val().ZONE1.ACTIVE,
                        zone2Name: child.val().ZONE2.NAME,
                        zone2PreheatStatus: child.val().ZONE2.PREHEAT_STATUS,
                        zone2BypassStatus: child.val().ZONE2.BYPASS_STATUS,
                        zone2Active: child.val().ZONE2.ACTIVE,
                        zone3Name: child.val().ZONE3.NAME,
                        zone3PreheatStatus: child.val().ZONE3.PREHEAT_STATUS,
                        zone3BypassStatus: child.val().ZONE3.BYPASS_STATUS,
                        zone3Active: child.val().ZONE3.ACTIVE,
                        zone4Name: child.val().ZONE4.NAME,
                        zone4PreheatStatus: child.val().ZONE4.PREHEAT_STATUS,
                        zone4BypassStatus: child.val().ZONE4.BYPASS_STATUS,
                        zone4Active: child.val().ZONE4.ACTIVE
                    })
                });
    
                if (zones.length > 1) {
                    
                    // Code to handle more than one device
                    
                }             
                
                setMacAddress(zones[0]._key);
    
                // Populate the preheat buttons based on the existing zones setup.
                // If there are less zones than buttons, (cuurently 4) use the most common zones as marketing and raise an alert
    
                if (zones[0].zone1Name) {
                    setZone1(zones[0].zone1Name);
                    setZone1Active(zones[0].zone1Active);
                    if (commonZones.includes(zones[0].zone1Name)) {
                        commonZones = commonZones.filter(e => e != zones[0].zone1Name)
                    }
                    if (zones[0].zone1PreheatStatus == 'ON') {
                        setZone1Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#f00'}} />);
                    }
                    if (zones[0].zone1BypassStatus == 'ON') {
                        setZone1Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#0160bc'}} />);
                    }
                } else {
                    setZone1(commonZones[commonZoneCounter]);
                    commonZoneCounter += 1;
                }
    
                if (zones[0].zone2Name) {
                    setZone2(zones[0].zone2Name);
                    setZone2Active(zones[0].zone2Active);
                    if (commonZones.includes(zones[0].zone2Name)) {
                        commonZones = commonZones.filter(e => e != zones[0].zone2Name)
                    }
                    if (zones[0].zone2PreheatStatus == 'ON') {
                        setZone2Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#f00'}} />);
                    }
                    if (zones[0].zone2BypassStatus == 'ON') {
                        setZone2Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#0160bc'}} />);
                    }
                } else {
                    setZone2(commonZones[commonZoneCounter]);
                    commonZoneCounter += 1;
                }
    
                if (zones[0].zone3Name) {
                    setZone3(zones[0].zone3Name);
                    setZone3Active(zones[0].zone3Active);
                    if (commonZones.includes(zones[0].zone3Name)) {
                        commonZones = commonZones.filter(e => e != zones[0].zone3Name)
                    }
                    if (zones[0].zone3PreheatStatus == 'ON') {
                        setZone3Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#f00'}} />);
                    }
                    if (zones[0].zone3BypassStatus == 'ON') {
                        setZone1Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#0160bc'}} />);
                    }
                } else {
                    setZone3(commonZones[commonZoneCounter]);
                    commonZoneCounter += 1;
                }
    
                if (zones[0].zone4Name) {
                    setZone4(zones[0].zone4Name);
                    setZone4Active(zones[0].zone4Active);
                    if (zones[0].zone4PreheatStatus == 'ON') {
                        setZone4Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#f00'}} />);
                    }
                    if (zones[0].zone4BypassStatus == 'ON') {
                        setZone1Image(<Icon type='FontAwesome5' name='stopwatch' style={{color: '#0160bc'}} />);
                    }
                } else {
                    setZone4(commonZones[commonZoneCounter]);
                }
            } else {
                alert('No device found for your account. Please contact your authorized SnowController installer for help.');
                handleLogout();
            }
        });
    }, []);

    handleLogout = () => {
        auth().signOut()
        .then(() => navigation.navigate('Login'))
        .catch(error => setErrorMessage(error.errorMessage))
    }

    bypassPreHeat = (zoneName) => {
        // Check to see if the selected zone is already setup and navigate to the appropriate view
        // If the selected zone is not setup, alert the customer to call their installer

        switch(zoneName) {
            case zone1:
                if (zone1Active) {
                    navigation.navigate('BypassPreheat', {zoneName: zoneName});
                } else {
                    zoneAlert(zoneName);
                }
                break;
            case zone2:
                if (zone2Active) {
                    navigation.navigate('BypassPreheat', {zoneName: zoneName});
                } else {
                    zoneAlert(zoneName);
                }
                break;
            case zone3:
                if (zone3Active) {
                    navigation.navigate('BypassPreheat', {zoneName: zoneName});
                } else {
                    zoneAlert(zoneName);
                }
                break;
            case zone4:
                if (zone4Active) {
                    navigation.navigate('BypassPreheat', {zoneName: zoneName});
                } else {
                    zoneAlert(zoneName);
                }
                break;
            default:
                console.log('Zone names did not match up.');
        }
        
        setZone1Image(null);
        setZone2Image(null);
        setZone2Image(null);
        setZone2Image(null);

    }

    zoneAlert = (zoneName) => {
        alert('Please contact your SnowController approved installer to setup your new heated: ' + zoneName);
    }

    return (
        <Container style={styles.container}>
            <TopHeader />
            <Snowflake />
            <View style={styles.buttonRow}>
                <Button rounded light style={styles.controlButton} onPress={() => bypassPreHeat(zone1)}>
                    <Text style={styles.buttonText}>{zone1}</Text>
                    {zone1Image}
                </Button>
            </View>
            <View style={styles.buttonRow}>
                <Button rounded light style={styles.controlButton} onPress={() => bypassPreHeat(zone2)}>
                    <Text style={styles.buttonText}>{zone2}</Text>
                    {zone2Image}
                </Button>
            </View>
            <View style={styles.buttonRow}>
                <Button rounded light style={styles.controlButton} onPress={() => bypassPreHeat(zone3)}>
                    <Text style={styles.buttonText}>{zone3}</Text>
                    {zone3Image}
                </Button>
            </View>
            <View style={styles.buttonRow}>
                <Button rounded light style={styles.controlButton} onPress={() => bypassPreHeat(zone4)}>
                    <Text style={styles.buttonText}>{zone4}</Text>
                    {zone4Image}
                </Button>
            </View>                
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    style={styles.controlButton}
                    onPress={() => navigation.navigate('EmailSupport')}>
                    <Text style={styles.buttonText}>Schedule Service</Text>
                    <Icon type='FontAwesome5' name='mail-bulk' />
                </Button>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    style={styles.controlButton}
                    onPress={() => navigation.navigate('PhoneSupport')}>
                    <Text style={styles.buttonText}>Call for Service</Text>
                    <Icon type='FontAwesome5' name='phone' />
                </Button>
            </View>
            <TouchableNativeFeedback onPress={() => navigation.navigate('Zone')}>
                <Text style={styles.addZoneText}>Change Zone Name ></Text>                
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => handleLogout()}>
                <Text style={styles.logOutText}>Log out ></Text>
            </TouchableNativeFeedback>

        </Container>
    );
}

export default withNavigation(Main);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    textInput: {
        width: '90%',
        color: '#fff'
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    bypassbuttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
    },
    supportButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        marginBottom: '5%'
    },
    addDeviceText: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 18,
        color: '#000'
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
    logOutText: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'      
    },
    addZoneText: {
        position: 'absolute',
        bottom: 10,
        marginLeft: 10,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    controlButton: {
        width: '90%',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});