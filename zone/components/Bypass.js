import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, Alert } from 'react-native';
import { Container, Body, Button, Card, CardItem, Label, Picker } from 'native-base';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import DatePicker from 'react-native-datepicker';
import { withNavigation } from 'react-navigation';
import SnowFlake from './../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function Preheat({ navigation}) {

    const [ currentUser, setCurrentUser ] = useState('');
    const [ macAddress, setMacAddress ] = useState('');
    const [ zoneName, setZoneName ] = useState('');
    const [ zoneStatus, setZoneStatus ] = useState('OFF');
    const [ zoneImage, setZoneImage ] = useState(null);
    const [ zoneRelay, setZoneRelay ] = useState('');
    const [ bypassStatus, setBypassStatus ] = useState('');
    const [ zoneBypassRelay, setZoneBypassRelay ] = useState('');
    const [ lastBypassDateTime, setLastBypassDateTime ] = useState('');
    const [ lastBypassHours, setLastBypassHours ] = useState('');
    const [ timerValue, setTimerValue ] = useState('2');
    const [ affectedZone, setAffectedZone ] = useState('');
    const [ startDate, setStartDate ] = useState(new Date());
 
    useEffect(() => {
        const user = firebase.auth().currentUser.email;
        setCurrentUser(user);

        const zone = navigation.getParam('zoneName');
        setZoneName(zone);
        
        const dbMac = database().ref('devices');
        dbMac.orderByChild('EMAIL').equalTo(user).on('value', function(snapshot) {
                       
            let zones = [];
            let bypassRelay;
            snapshot.forEach((child) => {

                // Make sure at least one zone is set as the selected preheated zone
                if (child.val().ZONE1.NAME == zone || child.val().ZONE2.NAME == zone || child.val().ZONE3.NAME == zone || child.val().ZONE4.NAME == zone) {
                    
                    if (child.val().ZONE1.NAME == zone) {
                        if (child.val().ZONE1.BYPASS_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                        }
                        setZoneStatus(child.val().ZONE1.BYPASS_STATUS);
                        setZoneRelay(child.val().ZONE1.RELAY_USED);
                        bypassRelay = translateBypassRelay(child.val().ZONE1.RELAY_USED);
                        setZoneBypassRelay(bypassRelay);
                        setAffectedZone('ZONE1');
                    }

                    if (child.val().ZONE2.NAME == zone) {
                        if (child.val().ZONE2.BYPASS_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                        }
                        setZoneStatus(child.val().ZONE2.BYPASS_STATUS);
                        setZoneRelay(child.val().ZONE2.RELAY_USED);
                        bypassRelay = translateBypassRelay(child.val().ZONE2.RELAY_USED);
                        setZoneBypassRelay(bypassRelay);
                        setAffectedZone('ZONE2');
                    }

                    if (child.val().ZONE3.NAME == zone) {
                        if (child.val().ZONE3.BYPASS_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>) 
                        }
                        setZoneStatus(child.val().ZONE3.BYPASS_STATUS);
                        setZoneRelay(child.val().ZONE3.RELAY_USED);
                        bypassRelay = translateBypassRelay(child.val().ZONE3.RELAY_USED);
                        setZoneBypassRelay(bypassRelay);
                        setAffectedZone('ZONE3');
                    }

                    if (child.val().ZONE4.NAME == zone) {
                        if (child.val().ZONE4.BYPASS_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                        }
                        setZoneStatus(child.val().ZONE4.BYPASS_STATUS);
                        setZoneRelay(child.val().ZONE4.RELAY_USED);
                        bypassRelay = translateBypassRelay(child.val().ZONE4.RELAY_USED);
                        setZoneBypassRelay(bypassRelay);
                        setAffectedZone('ZONE4');
                    }

                } else {
                    // Something went wrong, throw and error alert to contact their installer
                    alert('No active zones found, please contact your installer for assistance.');
                }
                
                zones.push({
                    _key: child.key
                })

                setLastBypassDateTime(child.val().LAST_BYPASS.DATE_TIME);
                setLastBypassHours(child.val().LAST_BYPASS.HOURS);
                setBypassStatus(child.val().LAST_BYPASS.STATUS);

            });

            if (zones.length > 1) {
                
                // Code to handle more than one device
                
            }             
            
            setMacAddress(zones[0]._key);

        });
    }, []);

    timerChange = (preheatTime) => {
        setTimerValue(preheatTime);
    }

    formatDate = (date) => {

        if (Date.parse(date)) {
            const monthNames = [
                'January', 'February', 'March',
                'April', 'May', 'June', 'July',
                'August', 'September', 'October',
                'November', 'December'
              ];
            
              const day = date.getDate();
              const monthIndex = date.getMonth();
              const year = date.getFullYear();
              const hour = date.getHours();
              const minute = date.getMinutes();
            
              return monthNames[monthIndex] + ' ' + day + ', ' + year + ' ' + hour + ':' + minute;
        }

        return date;
        
    }

    handleLogout = () => {
        auth().signOut()
        .then(() => navigation.navigate('Login'))
        .catch(error => setErrorMessage(error.errorMessage))
    }

    bypassZone = (bypassStatus, cancel) => {
        
        const zoneToChange = affectedZone + '_STATUS';
        
        switch(zoneToChange) {
            
            case 'ZONE1_STATUS':
                const dbZone1 = database().ref('devices/' + macAddress + '/ZONE1/');
                if (cancel) {
                    dbZone1.update({
                        BYPASS_STATUS: 'OFF',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                } else {
                    dbZone1.update({
                        BYPASS_STATUS: 'ON',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });

                }
                const dbRelay1 = database().ref('devices/' + macAddress + '/' + zoneBypassRelay);
                dbRelay1.update({
                    STATUS: bypassStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });
                updateLastBypass(bypassStatus);
                break;
            
            case 'ZONE2_STATUS':
                const dbZone2 = database().ref('devices/' + macAddress + '/ZONE2/');
                if (cancel) {
                    dbZone2.update({
                        BYPASS_STATUS: 'OFF',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                } else {
                    dbZone2.update({
                        BYPASS_STATUS: 'ON',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                }
                const dbRelay2 = database().ref('devices/' + macAddress + '/' + zoneBypassRelay);
                dbRelay2.update({
                    STATUS: bypassStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                }); 
                updateLastBypass(bypassStatus);  
                break;

            case 'ZONE3_STATUS':
                const dbZone3 = database().ref('devices/' + macAddress + '/ZONE3/');
                if (cancel) {
                    dbZone3.update({
                        BYPASS_STATUS: 'OFF',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                } else {
                    dbZone3.update({
                        BYPASS_STATUS: 'ON',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                }
                const dbRelay3 = database().ref('devices/' + macAddress + '/' + zoneBypassRelay);
                dbRelay3.update({
                    STATUS: bypassStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });     
                updateLastBypass(bypassStatus); 
                break;
            
            case 'ZONE4_STATUS':
                const dbZone4 = database().ref('devices/' + macAddress + '/ZONE4/');
                if (cancel) {
                    dbZone4.update({
                        BYPASS_STATUS: 'OFF',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                } else {
                    dbZone4.update({
                        BYPASS_STATUS: 'ON',
                        PREHEAT_STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The write failed
                    });
                }
                const dbRelay4 = database().ref('devices/' + macAddress + '/' + zoneBypassRelay);
                dbRelay4.update({
                    STATUS: bypassStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });   
                updateLastBypass(bypassStatus);    
                break;
            
            default:
                alert('Zone to change was not found.  Please contact your Snow Controller installer for assistance.');
        }

        if (cancel) {
            Alert.alert(zoneName + ' Bypass was cancelled.', 'To bypass the ' + zoneName + ' again, click the ' + zoneName + ' button.', [{
                text: "OK",
                onPress: () => navigation.navigate('Main')
            }]) 
        } else {
            Alert.alert('Bypass for ' + zoneName + ' is now set turn ' + bypassStatus + ' at ' + formatDate(startDate) + ' for ', timerValue + ' hours.', [{
                text: "OK",
                onPress: () => navigation.navigate('Main')
            }])
        }
        
    }

    translateBypassRelay = (zoneRelay) => {
        
        let bypassRelay;

        switch(zoneRelay) {
            case 'RELAY1':
                bypassRelay = 'RELAY5';
                break;
            case 'RELAY2':
                bypassRelay = 'RELAY6';
                break;
            case 'RELAY3':
                bypassRelay = 'RELAY7';
                break;
            case 'RELAY4':
                bypassRelay = 'RELAY8';
                break;
            default:
                console.log('No relays found for Bypass Relay.');
        }

        return bypassRelay;

    }

    updateLastBypass = (bypassStatus) => {
        const dbBypass = database().ref('devices/' + macAddress + '/LAST_BYPASS');
        dbBypass.update({
            DATE_TIME: formatDate(startDate),
            HOURS: timerValue,
            STATUS: bypassStatus
        });
    }

    return (
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
            <Card style={styles.cardLayout}>
                <CardItem bordered>
                    <Body>
                        <Text style={styles.stormText}>
                            Not going to be home? <Text style={styles.stormTextRed}>Bypass</Text> your {zoneName}'s Snow Sensor Below.
                        </Text>
                    </Body>
                </CardItem>
                <View style={styles.addRow}>
                    <CardItem style={styles.statusLayout}>
                        <Text style={styles.statusText}>Bypass Status:</Text>
                        <Text style={styles.statusOnOff}>{zoneStatus}</Text>
                    </CardItem>
                    <CardItem style={styles.stopLightImage}>
                        {zoneImage}
                    </CardItem>
                </View>
                {zoneStatus == 'OFF' ? (
                    <View>
                        <CardItem style={styles.bypassCalendar}>
                            <Label style={styles.labelText}>Bypass system on:</Label>
                            <DatePicker
                                style={{width: 200}}
                                date={startDate}
                                mode='datetime'
                                is24Hour={false}
                                placeholder='select date and time'
                                format='MM-DD-YYYY  hh:mm a'
                                minDate={startDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                },
                                // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {setStartDate(date)}}
                            />
                        </CardItem>
                        <CardItem style={styles.picker}>
                            <Label>Bypass for:</Label>
                            <Picker
                                note
                                mode="dropdown"    
                                selectedValue={timerValue}   
                                onValueChange={(value) => timerChange(value)}                  
                            >
                                <Picker.Item label="2 Hours" value='2' />
                                <Picker.Item label="3 Hours" value='3' />
                                <Picker.Item label="4 Hours" value='4' />
                                <Picker.Item label="5 Hours" value='5' />
                                <Picker.Item label="6 Hours" value='6' />
                                <Picker.Item label="7 Hours" value='7' />
                                <Picker.Item label="8 Hours" value='8' />
                                <Picker.Item label="9 Hours" value='9' />
                                <Picker.Item label="10 Hours" value='10' />
                                <Picker.Item label="11 Hours" value='11' />
                                <Picker.Item label="12 Hours" value='12' />
                                <Picker.Item label="13 Hours" value='13' />
                                <Picker.Item label="14 Hours" value='14' />
                                <Picker.Item label="15 Hours" value='15' />
                                <Picker.Item label="16 Hours" value='16' />
                                <Picker.Item label="17 Hours" value='17' />
                                <Picker.Item label="18 Hours" value='18' />
                                <Picker.Item label="19 Hours" value='19' />
                                <Picker.Item label="20 Hours" value='20' />
                                <Picker.Item label="21 Hours" value='21' />
                                <Picker.Item label="22 Hours" value='22' />
                                <Picker.Item label="23 Hours" value='23' />
                                <Picker.Item label="24 Hours" value='24' />
                            </Picker>
                        </CardItem>
                        <CardItem style={styles.buttonRow}>
                            <Button rounded style={styles.controlButton} onPress={() => bypassZone('ON', false)}>
                                <Text style={styles.buttonText}>Bypass Sensor</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={styles.buttonRow}>
                            <Button rounded style={styles.controlButton} onPress={() => bypassZone('OFF', false)}>
                                <Text style={styles.buttonText}>Cancel Bypass</Text>
                            </Button>
                        </CardItem>
                </View>
                ) : (
                    <View>
                        <CardItem style={styles.bypassTextRow}>
                            <Text style={styles.stormText}>
                                Bypass was last set to turn {bypassStatus} at: 
                            </Text>
                            <Text style={styles.stormText}>
                                {lastBypassDateTime} for {lastBypassHours} hours.
                            </Text>
                        </CardItem>
                        <CardItem style={styles.buttonRow}>
                            <Button rounded style={styles.controlButton} onPress={() => bypassZone('OFF', true)}>
                                <Text style={styles.buttonText}>Cancel Bypass</Text>
                            </Button>
                        </CardItem>
                    </View>
                )}
            </Card> 
        </Container>
    );
}

export default withNavigation(Preheat);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    cardLayout: {
        marginLeft: '2%',
        marginRight: '2%',
        flex: 1
    },  
    titleText: {
        textAlign: 'center',
        
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '2%'
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
    bypassCalendar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bypassTextRow: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%'
    },
    bypassbuttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
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
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '2%'
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
        justifyContent: 'center',
        backgroundColor: '#0160bc'
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    stopLightImage: {
        flexDirection: 'row',
        marginLeft: '5%'
    },
    stormText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    stormTextRed: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff0000'
    },
    statusLayout: {
        flexDirection: 'column',
        marginLeft: '5%'
    },
    statusText: {
        fontSize: 20
    },
    labelText: {
        marginBottom: 10
    },
    statusOnOff: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    picker: {
        width: 275, 
        height: 40,
        
    }
});