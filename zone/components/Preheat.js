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
    const [ buttonText, setButtonText ] = useState('');
    const [ timerValue, setTimerValue ] = useState('2');
    const [ affectedZone, setAffectedZone ] = useState('');
    const [ startDate, setStartDate ] = useState(new Date());
    const [ lastPreheatDateTime, setLastPreheatDateTime ] = useState('');
    const [ lastPreheatHours, setLastPreheatHours ] = useState('');
 
    useEffect(() => {
        const user = firebase.auth().currentUser.email;
        setCurrentUser(user);

        const zone = navigation.getParam('zoneName');
        setZoneName(zone);
        
        const dbMac = database().ref('devices');
        dbMac.orderByChild('EMAIL').equalTo(user).on('value', function(snapshot) {
                       
            let zones = [];
            snapshot.forEach((child) => {

                // Make sure at least one zone is set as the selected preheated zone
                if (child.val().ZONE1.NAME == zone || child.val().ZONE2.NAME == zone || child.val().ZONE3.NAME == zone || child.val().ZONE4.NAME == zone) {
                    
                    if (child.val().ZONE1.NAME == zone) {
                        if (child.val().ZONE1.PREHEAT_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                            setButtonText('Cancel Preheat');
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                            setButtonText('Preheat ' + zone); 
                        }
                        setZoneStatus(child.val().ZONE1.PREHEAT_STATUS);
                        setZoneRelay(child.val().ZONE1.RELAY_USED);
                        setAffectedZone('ZONE1');
                    }

                    if (child.val().ZONE2.NAME == zone) {
                        if (child.val().ZONE2.PREHEAT_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                            setButtonText('Cancel Preheat');
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                            setButtonText('Preheat ' + zone); 
                        }
                        setZoneStatus(child.val().ZONE2.PREHEAT_STATUS);
                        setZoneRelay(child.val().ZONE2.RELAY_USED);
                        setAffectedZone('ZONE2');
                    }

                    if (child.val().ZONE3.NAME == zone) {
                        if (child.val().ZONE3.PREHEAT_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                            setButtonText('Cancel Preheat');
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                            setButtonText('Preheat ' + zone); 
                        }
                        setZoneStatus(child.val().ZONE3.PREHEAT_STATUS);
                        setZoneRelay(child.val().ZONE3.RELAY_USED);
                        setAffectedZone('ZONE3');
                    }

                    if (child.val().ZONE4.NAME == zone) {
                        if (child.val().ZONE4.PREHEAT_STATUS == 'ON') {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/green_light_sm.png')}/>)
                            setButtonText('Cancel Preheat');
                        } else {
                            setZoneImage(<Image style={{width: 100, height: 100}} source={require('../../assets/images/red_light_sm.png')}/>)
                            setButtonText('Preheat ' + zone); 
                        }
                        setZoneStatus(child.val().ZONE4.PREHEAT_STATUS);
                        setZoneRelay(child.val().ZONE4.RELAY_USED);
                        setAffectedZone('ZONE4');
                    }

                } else {
                    // Something went wrong, throw and error alert to contact their installer
                    alert('No active zones found, please contact your installer for assistance.');
                }
                
                zones.push({
                    _key: child.key
                })

                setLastPreheatDateTime(child.val().LAST_PREHEAT.DATE_TIME);
                setLastPreheatHours(child.val().LAST_PREHEAT.HOURS);

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

        // If the date passed is already in the desired format, return it as is
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

    preheatZone = () => {
        const zoneToChange = affectedZone + '_STATUS';
        const newStatus = (zoneStatus == 'ON' ? 'OFF' : 'ON');

        switch(zoneToChange) {
            
            case 'ZONE1_STATUS':
                const dbZone1 = database().ref('devices/' + macAddress + '/ZONE1/');
                dbZone1.update({
                    PREHEAT_STATUS: newStatus,
                    BYPASS_STATUS: 'OFF'
                }, function bubbleUpError(error) {
                    // The Zone write failed
                });
                const dbRelay1 = database().ref('devices/' + macAddress + '/' + zoneRelay);
                dbRelay1.update({
                    STATUS: newStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });
                break;
            
            case 'ZONE2_STATUS':
                const dbZone2 = database().ref('devices/' + macAddress + '/ZONE2/');
                dbZone2.update({
                    PREHEAT_STATUS: newStatus,
                    BYPASS_STATUS: 'OFF'
                }, function bubbleUpError(error) {
                    // The write failed
                });
                const dbRelay2 = database().ref('devices/' + macAddress + '/' + zoneRelay);
                dbRelay2.update({
                    STATUS: newStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });     
                break;

            case 'ZONE3_STATUS':
                const dbZone3 = database().ref('devices/' + macAddress + '/ZONE3/');
                dbZone3.update({
                    PREHEAT_STATUS: newStatus,
                    BYPASS_STATUS: 'OFF'
                }, function bubbleUpError(error) {
                    // The write failed
                });
                const dbRelay3 = database().ref('devices/' + macAddress + '/' + zoneRelay);
                dbRelay3.update({
                    STATUS: newStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });     
                break;
            
            case 'ZONE4_STATUS':
                const dbZone4 = database().ref('devices/' + macAddress + '/ZONE4/');
                dbZone4.update({
                    PREHEAT_STATUS: newStatus,
                    BYPASS_STATUS: 'OFF'
                }, function bubbleUpError(error) {
                    // The write failed
                });
                const dbRelay4 = database().ref('devices/' + macAddress + '/' + zoneRelay);
                dbRelay4.update({
                    STATUS: newStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });     
                break;
            
            default:
                alert('Zone to change was not found.  Please contact your Snow Controller installer for assistance.');
        }

        // Set the relay to turn the device on
        setPreheatRelays(newStatus);
        updateLastPreheat();

        // If Bypass is on, override the bypass and turn it off

        if (newStatus == 'ON') {
            Alert.alert(zoneName + ' is now set to preheat on ' + formatDate(startDate) + ' for: ', timerValue + ' hours.', [{
                text: "OK",
                onPress: () => navigation.navigate('Main')
            }])
        } else {
            Alert.alert(zoneName + ' preheat was cancelled.', 'To preheat the ' + zoneName + ' again, click the ' + zoneName + ' button.', [{
                text: "OK",
                onPress: () => navigation.navigate('Main')
            }]) 
        }
        
    }

    setPreheatRelays = (newStatus) => {
        // Relays for Preheat and Bypass are bound together.  Below are the business rules for preheating relays:
        // Preheat ON:
        // If relay 1 is ON, then relay 5 must be OFF
        // If relay 2 is ON, then relay 6 must be OFF
        // If relay 3 is ON, then relay 7 must be OFF
        // If relay 4 is ON, then relay 8 must be OFF

        const dbRelay = database().ref('devices/' + macAddress + '/' + zoneRelay);
                dbRelay.update({
                    STATUS: newStatus
                }, function bubbleUpError(error) {
                    // The Relay write failed
                });

        if (newStatus == 'ON') {
            // Turn off the related relay
            switch(zoneRelay) {
                case 'RELAY1':
                    const dbRelay5 = database().ref('devices/' + macAddress + '/RELAY5');                
                    dbRelay5.update({
                        STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The Relay write failed
                    });
                    break;
                case 'RELAY2':
                    const dbRelay6 = database().ref('devices/' + macAddress + '/RELAY6');
                    dbRelay6.update({
                        STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The Relay write failed
                    });
                    break;
                case 'RELAY3':
                    const dbRelay7 = database().ref('devices/' + macAddress + '/RELAY7');
                    dbRelay7.update({
                        STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The Relay write failed
                    });
                    break;
                case 'RELAY4':
                    const dbRelay8 = database().ref('devices/' + macAddress + '/RELAY8');
                    dbRelay8.update({
                        STATUS: 'OFF'
                    }, function bubbleUpError(error) {
                        // The Relay write failed
                    });
                    break;
                default: // No relays found
                    console.log('No relays found.');
            }
        }
    }

    turnOffBypass = () => {

    }

    updateLastPreheat = () => {
        const dbPreheat = database().ref('devices/' + macAddress + '/LAST_PREHEAT');
        dbPreheat.update({
            DATE_TIME: formatDate(startDate),
            HOURS: timerValue
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
                            Make sure your {zoneName} is <Text style={styles.stormTextRed}>Pre-Heated </Text> prior to an event.
                        </Text>
                        <Text style={styles.stormTextBottom}>
                            The Colder it is outside, or the more snow that is expected to fall, the more time that Is required.
                        </Text>
                    </Body>
                </CardItem>
                <View style={styles.addRow}>
                    <CardItem style={styles.statusLayout}>
                        <Text style={styles.statusText}>Current Status:</Text>
                        <Text style={styles.statusOnOff}>{zoneStatus}</Text>
                    </CardItem>
                    <CardItem style={styles.stopLightImage}>
                        {zoneImage}
                    </CardItem>
                </View>
                {zoneStatus == 'OFF' ? (
                    <View>
                        <CardItem>
                            <Label>Preheat on:</Label>
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
                            <Label>Preheat for:</Label>
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
                            </Picker>
                        </CardItem>
                </View>
                ) : (
                    <CardItem style={styles.bypassTextRow}>
                        <Text style={styles.preheatText}>
                            Preheat was last set to turn ON at: 
                        </Text>
                        <Text style={styles.preheatText}>
                            {lastPreheatDateTime} for {lastPreheatHours} hours.
                        </Text>
                    </CardItem>
                )}
                <CardItem style={styles.buttonRow}>
                    <Button rounded style={styles.controlButton} onPress={() => preheatZone()}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </Button>
                </CardItem>
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
    preheatText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    stormText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '1%',
        marginBottom: '1%'
    },
    stormTextBottom: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '2%'
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
    statusOnOff: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    picker: {
        width: 275, 
        height: 40,
        
    }
});