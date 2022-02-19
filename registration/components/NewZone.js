import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Icon, Button, Text, Picker, Form } from 'native-base';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { withNavigation } from 'react-navigation';
import SnowFlake from './../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function NewZone({ navigation }) {
    const [ currentUser, setCurrentUser ] = useState('');
    const [ friendlyZoneNames, setFriendlyZoneNames ] = useState([]);
    const [ zone1Active, setZone1Active ] = useState(false);
    const [ zone2Active, setZone2Active ] = useState(false);
    const [ zone3Active, setZone3Active ] = useState(false);
    const [ zone4Active, setZone4Active ] = useState(false);
    const [ zone1Name, setZone1Name ] = useState('');
    const [ zone2Name, setZone2Name ] = useState('');
    const [ zone3Name, setZone3Name ] = useState('');
    const [ zone4Name, setZone4Name ] = useState('');
    const [ selectedZoneName, setSelectedZoneName ] = useState('');
    const [ macAddress, setMacAddress ] = useState('');

    useEffect(() => {
        const user = firebase.auth().currentUser.email;
        setCurrentUser(user);
        
        const dbMac = database().ref('devices');
        dbMac.orderByChild('EMAIL').equalTo(user).on('value', function(snapshot) {
           
            let zones = [];
            snapshot.forEach((child) => {
                
                // Make sure at least one zone is set to active
                if (child.val().ZONE1.ACTIVE || child.val().ZONE2.ACTIVE || child.val().ZONE3.ACTIVE || child.val().ZONE4.ACTIVE) {

                    if (child.val().ZONE1) {
                        setZone1Active(child.val().ZONE1.ACTIVE);
                        setZone1Name(child.val().ZONE1.NAME);    
                    }

                    if (child.val().ZONE2) {
                        setZone2Active(child.val().ZONE2.ACTIVE);
                        setZone2Name(child.val().ZONE2.NAME);    
                    }

                    if (child.val().ZONE3) {
                        setZone3Active(child.val().ZONE3.ACTIVE);
                        setZone3Name(child.val().ZONE3.NAME);    
                    }

                    if (child.val().ZONE4) {
                        setZone4Active(child.val().ZONE4.ACTIVE);
                        setZone4Name(child.val().ZONE4.NAME);
                    }
                    
                } else {
                    // No zones set to active.  Let customer know they need to contact their installer to setup a zone.
                    alert('No zones have been setup for this device.  Please contact your authroized Snow Controller installer for assistance.');
                    navigation.navigate('Main');
                }
                
                zones.push({
                    _key: child.key
                })

            });

            if (zones.length > 1) {
                
                // Code to handle more than one device
                
            }             
            
            setMacAddress(zones[0]._key);
            getFriendlyListOfZones();

        });
    }, []);

    handleLogout = () => {
        firebase.auth().signOut()
        .then(() => navigation.navigate('Login'))
        .catch(error => setErrorMessage(error.errorMessage))
    }

    modifyZone = () => {

        const db = database().ref('devices');
        db.orderByChild('EMAIL').equalTo(currentUser).on('child_added', function(snapshot) {
            const zoneListRef = db.child(macAddress);
            const zone1ListRef = zoneListRef.child('ZONE1');
            const zone2ListRef = zoneListRef.child('ZONE2');
            const zone3ListRef = zoneListRef.child('ZONE3');
            const zone4ListRef = zoneListRef.child('ZONE4');
            
            
            if (zone1Name && zone2Name && zone3Name && zone4Name) {
                zone1ListRef.update({
                    NAME: zone1Name
                });
                zone2ListRef.update({
                    NAME: zone2Name
                });
                zone3ListRef.update({
                    NAME: zone3Name
                });
                zone4ListRef.update({
                    NAME: zone4Name
                });

                Alert.alert('Zones Successfully Updated ', 'Zone Names: ' + zone1Name + ' ' + zone2Name + ' ' + zone3Name + ' ' + zone4Name, [{
                    text: "OK",
                    onPress: () => navigation.navigate('Main')
                }])

                return;
            }

            if (zone1Name && zone2Name && zone3Name) {
                zone1ListRef.update({
                    NAME: zone1Name,
                });
                zone2ListRef.update({
                    NAME: zone2Name
                });
                zone3ListRef.update({
                    NAME: zone3Name
                });

                Alert.alert('Zones Successfully Updated ', 'Zone Names: ' + zone1Name + ' ' + zone2Name + ' ' + zone3Name, [{
                    text: "OK",
                    onPress: () => navigation.navigate('Main')
                }])

                return;
            }

            if (zone1Name && zone2Name) {
                zone1ListRef.update({
                    NAME: zone1Name
                });
                zone2ListRef.update({
                    NAME: zone2Name
                });

                Alert.alert('Zones Successfully Updated ', 'Zone Names: ' + zone1Name + ' ' + zone2Name, [{
                    text: "OK",
                    onPress: () => navigation.navigate('Main')
                }])
                return;
            }

            if (zone1Name) {
                zone1ListRef.update({
                    NAME: zone1Name
                });
                
                Alert.alert('Zone Successfully Updated ', 'Zone Name: ' + zone1Name, [{
                    text: "OK",
                    onPress: () => navigation.navigate('Main')
                }])
                return;
            } 

            return;

        });
    }

    getFriendlyListOfZones = () => {
        database().ref('zones').once('value', function
        (snapshot) {
            setFriendlyZoneNames(snapshot.val())
        });
    }

    setSelectedZone = (zoneName) => {
        setSelectedZoneName(zoneName);
    }

    if (zone1Active == 'INACTIVE' && zone2Active == 'INACTIVE' && zone3Active == 'INACTIVE' && zone4Active == 'INACTIVE') {
        return (
            <Container style={styles.container}>
                <Image
                    style={styles.headerImage}
                    source={ require('../../assets/images/snow_controller_logo_wt.png') }
                />
                <Text style={styles.titleText}>No zones have been setup.  Please contact your authorized Snow Controller installer for assistance.</Text>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
            {zone1Name ? (
                <View style={styles.addRow}>
                    <Text style={styles.addDeviceText}>
                        To modify a Zone name, please use the dropdown menus.  Once the new name is chosen, use the confirm button below.
                    </Text>
                </View>
            ) : (
                <View style={styles.addRow}>
                    <Text style={styles.addDeviceText}>Almost Done.  Lastly, we need to setup your new zone.  
                        Please confirm a name for your new zone below:
                    </Text>
                </View>
            )}

                <Form>
                    <View style={styles.zoneRows}>
                        <Text style={styles.zoneLabel}>Zone 1:</Text>
                        <Picker
                                style={styles.picker}
                                Header="Zone Name"
                                mode="dropdown"
                                placeholder='Select Zone'
                                selectedValue={zone1Name}
                                onValueChange={(value) => setZone1Name(value)}
                                >
                                {friendlyZoneNames.map((zones, i) => {
                                    return (
                                    <Picker.Item label={zones} value={zones} key={i} />
                                    );
                                }
                                )}
                        </Picker>
                    </View>
                    {zone2Active ? (
                        <View style={styles.zoneRows}>
                            <Text style={styles.zoneLabel}>Zone 2:</Text>
                            <Picker
                                    style={styles.picker}
                                    Header="Zone Name"
                                    mode="dropdown"
                                    placeholder='Select Zone'
                                    selectedValue={zone2Name}
                                    onValueChange={(value) => setZone2Name(value)}
                                    >
                                    {friendlyZoneNames.map((zones, i) => {
                                        return (
                                        <Picker.Item label={zones} value={zones} key={i} />
                                        );
                                    }
                                    )}
                            </Picker>
                        </View>
                    ) : (null)}
                    {zone3Active ? (
                        <View style={styles.zoneRows}>
                            <Text style={styles.zoneLabel}>Zone 3:</Text>
                            <Picker
                                    style={styles.picker}
                                    Header="Zone Name"
                                    mode="dropdown"
                                    placeholder='Select Zone'
                                    selectedValue={zone3Name}
                                    onValueChange={(value) => setZone3Name(value)}
                                    >
                                    {friendlyZoneNames.map((zones, i) => {
                                        return (
                                        <Picker.Item label={zones} value={zones} key={i} />
                                        );
                                    }
                                    )}
                            </Picker>
                        </View>
                    ) : (null)}
                    {zone4Active ? (
                        <View style={styles.zoneRows}>
                            <Text style={styles.zoneLabel}>Zone 4:</Text>
                            <Picker
                                    style={styles.picker}
                                    Header="Zone Name"
                                    mode="dropdown"
                                    placeholder='Select Zone'
                                    selectedValue={zone4Name}
                                    onValueChange={(value) => setZone4Name(value)}
                                    >
                                    {friendlyZoneNames.map((zones, i) => {
                                        return (
                                        <Picker.Item label={zones} value={zones} key={i} />
                                        );
                                    }
                                    )}
                            </Picker>
                        </View>
                    ) : (null)}
                    <View style={styles.buttonRow}>
                        <Button 
                            light
                            rounded
                            onPress={ modifyZone }
                        >
                            <Text style={styles.buttonText}>Confirm Zone Name Change</Text>
                            <Icon type='FontAwesome5' name='fire' />
                        </Button>
                    </View>
                </Form>
            <View style={styles.addRow}>
                <TouchableOpacity onPress={ handleLogout }>
                    <Text style={styles.navigationText}>Log out ></Text>
                </TouchableOpacity>
            </View>  
        </Container>
    );
}

export default withNavigation(NewZone);

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
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    addDeviceText: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center'
    },
    addRow: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 5,
        alignItems: 'center'
    },
    zoneRows: {
        flexDirection: 'row',
        width: '65%',
        marginTop: 20,
        marginLeft: 5,
        alignItems: 'center'
    },
    picker: {
        width: '100%', 
        height: 40, 
        color: '#fff'
    },
    navigationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10 
    },
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '3%'
    },
    zoneLabel: {
        color: '#fff',
        marginLeft: 10,
        marginRight: 10
    }
});