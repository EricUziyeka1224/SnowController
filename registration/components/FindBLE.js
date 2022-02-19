import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, PermissionsAndroid, FlatList } from 'react-native';
import { Container, Text, Title, Card, CardItem, Right, Badge, Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import Modal, { ModalContent, ModalTitle, SlideAnimation } from 'react-native-modals';
import base64 from 'react-native-base64'
import TopHeader from './../../common/components/TopHeader';
import SnowFlake from './../../common/components/SnowFlake';

function FindBLE({ navigation }) {

    const customerEmail = navigation.getParam('customerEmail');
    const ssid = navigation.getParam('ssid');
    const password = navigation.getParam('password');
    const manager = new BleManager();
    const [ listOfDevices, setListOfDevices ] = useState([]);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalText, setModalText ] = useState('');
    let devices = [];
    let existingDevices = [];
    let macFromBoard = '';
    const firebaseHost = 'snowmelt-test.firebaseio.com';
    const firebaseAuth = '0Nu6x0tSa0R4ztwqSgbofBYzJ4HeAETyyOHvJLAc'

    useEffect(() => {
        requestLocationPermission();
    }, [])

    async function requestLocationPermission () {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Need Location Permissions for BLE',
                    message: 'SnowController needs to access Locations for BLE.',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Ok'
                },
            );
            if (granted) {
                if (Platform.OS == 'ios') {
                    manager.onStateChange((state) => {
                        if (state == 'PoweredOn') {
                            scanAndConnect();
                        }
                    });
                } else {
                    scanAndConnect();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    scanAndConnect = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (device.name) {
                console.log('Found one!!!');
                console.log('Here is the device name: ', device.name);
                console.log('Here is the device id: ', device.id);
                console.log('Here is the signal strength: ', device.rssi);
                console.log('Here is the list of services: ', device.serviceUUIDs);
                if (!existingDevices.includes(device.name)) {
                    devices.push({
                        deviceID: device.id,
                        deviceName: device.name,
                        signalStrength: device.rssi
                    });
                    existingDevices.push(device.name);
                    setListOfDevices(null);
                    setListOfDevices(devices);
                }
            }
            if (error) {
                console.log('Something went wrong...', error.message);
            }
        });
    }

    connectToSensor = (macAddress) => {
        console.log('Here is the Mac Address passed into connectToSensor: ', macAddress)
        console.log('Here is the SSID passed in: ', ssid);
        manager.stopDeviceScan();
        setModalVisible(true);
        setModalText('Connecting to new device.');
        
        manager.connectToDevice(macAddress, {autoConnect: true})
        .then((device) => {
            console.log('Successfully connected to device: ', macAddress);
            device.discoverAllServicesAndCharacteristics()
            .then(async(device) => {
                getServicesAndCharacteristics(device);
                setModalText('Reading mac address from new device.');
                macFromBoard = await readMacAddress(device);
                setModalText('Writing wireless router information to new device.');
                const verifiedSSID = await writeSSID(device, ssid);
                const verifiedPassword = await writeSSIDPassword(device, password);
                setModalText('Writing DB information new device.');
                const verifiedFirebaseURL = await writeFirebaseURL(device, firebaseHost);
                const verifiedFirebasePwd = await writeFirebasePassword(device, firebaseAuth); 
                setModalVisible(false);  
                await navigation.navigate('Relay', {customerEmail : customerEmail, macAddress : macFromBoard})
            })
        }, (error) => {
            console.error(error.message);
        })
        .catch(error => {
            console.error('Error while connecting to new device. ', error.message);
        })
    }

    getServicesAndCharacteristics = (device) => {
        device.services()
        .then(services => {
            services.forEach((service) => {
                service.characteristics()
                .then(c => {
                    console.log('Here is a characteristic: ', c);
                })
            })
        })
    }

    // Each of the three(3) characteristics holds 20 characters.
    // If the SSID, Password, Firebase Host or Auth is longer than 20 characters/bytes, 
    // Break it down into 20 byte/character chunks. Return an array up to three elements with the value.
    async function formatLongStrings(longString) {
        const twentyCharArray = [];
        const stringToFormat = new String(longString);

        if (stringToFormat.length <= 20) {
            console.log('Value less than or equal to 20 chars.');
            // Leave the string as is and pass it back
            twentyCharArray.push(stringToFormat);
        } else {
            console.log('Value greater than 20 chars.');
            // Break up the string into 20 character strings
            if (stringToFormat.length <= 40) {
                const first20 = stringToFormat.substring(0, 20);
                const second20 = stringToFormat.substring(20, 40);
                twentyCharArray.push(first20, second20);
            }
            else {
                const first20 = stringToFormat.substring(0, 20);
                const second20 = stringToFormat.substring(20, 40);
                const third20 = stringToFormat.substring(40, 60);
                twentyCharArray.push(first20, second20, third20);
            }
        }
        console.log('Here is the twentyCharArray: ', twentyCharArray);
        return twentyCharArray;
    }

    // Write the SSID to the characteristics. Each of the three(3) characteristics holds 20 characters.
    async function writeSSID(device, ssid) {
        const SSIDArray = await formatLongStrings(ssid);
        const SSIDArrayLength = SSIDArray.length;
        const charArray = [];
        
        switch(SSIDArrayLength) {
            case 1:
            // One SSID element in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a0-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[0]))
                    .then(c => {
                        console.log('Here is the first SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the SSID used: ', SSIDArray[0]);
                    })
                break;
            case 2:
            // Two SSID elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a0-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[0]))
                    .then(c => {
                        console.log('Here is the first SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the SSID used: ', SSIDArray[0]);
                    })    
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a1-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[1]))
                    .then(c => {
                        console.log('Here is the second SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of the SSID used: ', SSIDArray[1]);
                    })
                break;
            case 3:
            // Three SSID elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a0-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[0]))
                    .then(c => {
                        console.log('Here is the first SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the SSID used: ', SSIDArray[0]);
                    })   
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a1-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[1])) 
                    .then(c => {
                        console.log('Here is the second SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of the SSID used: ', SSIDArray[1]);
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36a2-4688-b7f5-ea07361b26a8', base64.encode(SSIDArray[2]))
                    then(c => {
                        console.log('Here is the third SSID confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the third 20 character section of the SSID used: ', SSIDArray[2]);
                    })
                break;
            default:
                // SSID array was empty. Return empty array
                console.error('SSID array was empty');    
        }

        return charArray;
    }

    // Write the password to the characteristics. Each of the three(3) characteristics holds 20 characters.
    async function writeSSIDPassword(device, password) {
        const passwordArray = await formatLongStrings(password);
        const passwordArrayLength = passwordArray.length;
        const charArray = [];

        switch(passwordArrayLength) {
            case 1:
            // One password element in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b0-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[0]))
                    .then(c => {
                        console.log('Here is the first Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the Wifi password used: ', passwordArray[0]);
                    })
                break;
            case 2:
            // Two password elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b0-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[0]))
                    .then(c => {
                        console.log('Here is the first Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the Wifi password used: ', passwordArray[0]);
                    })    
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b1-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[1]))
                    .then(c => {
                        console.log('Here is the second Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of the Wifi password used: ', passwordArray[1]);
                    })
                break;
            case 3:
            // Three password elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b0-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[0]))
                    .then(c => {
                        console.log('Here is the first Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of the Wifi password used: ', passwordArray[0]);
                    })   
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b1-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[1]))
                    .then(c => {
                        console.log('Here is the second Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of the Wifi password used: ', passwordArray[1]);
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36b2-4688-b7f5-ea07361b26a8', base64.encode(passwordArray[2]))
                    .then(c => {
                        console.log('Here is the third Wifi password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the third 20 character section of the Wifi password used: ', passwordArray[2]);
                    })
                break;
            default:
                // Password array was empty. Return empty array.
                console.error('Password array was empty.');
        }

        return charArray;
    }

    // Write the Firebase URL to the characteristics. Each of the three(3) characteristics holds 20 characters.
    async function writeFirebaseURL(device, URL) {
        const urlArray = await formatLongStrings(URL);
        const urlArrayLength = urlArray.length;
        const charArray = [];

        switch(urlArrayLength) {
            case 1:
            // One url element in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c0-4688-b7f5-ea07361b26a8', base64.encode(urlArray[0]))
                .then(c => {
                    console.log('Here is the first Firebase URL confirmation: ', c);
                    charArray.push(c);
                    console.log('Here is the first 20 character section of Firebase URL used: ', urlArray[0]);
                })
                break;
            case 2:
            // Two url elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c0-4688-b7f5-ea07361b26a8', base64.encode(urlArray[0]))
                .then(c => {
                    console.log('Here is the first Firebase URL confirmation: ', c);
                    charArray.push(c);
                    console.log('Here is the first 20 character section of Firebase URL used: ', urlArray[0]);
                })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c1-4688-b7f5-ea07361b26a8', base64.encode(urlArray[1]))
                .then(c => {
                    console.log('Here is the second Firebase URL confirmation: ', c);
                    charArray.push(c);
                    console.log('Here is the second 20 character section of Firebase URL used: ', urlArray[1]);
                })
                break;
            case 3:
                // Three url elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c0-4688-b7f5-ea07361b26a8', base64.encode(urlArray[0]))
                    .then(c => {
                        console.log('Here is the first Firebase URL confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of Firebase URL used: ', urlArray[0]);  
                    })    
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c1-4688-b7f5-ea07361b26a8', base64.encode(urlArray[1]))
                    .then(c => {
                        console.log('Here is the second Firebase URL confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of Firebase URL used: ', urlArray[1]);  
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36c2-4688-b7f5-ea07361b26a8', base64.encode(urlArray[2]))
                    .then(c => {
                        console.log('Here is the third Firebase URL confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the third 20 character section of Firebase URL used: ', urlArray[2]);
                    })
                break;

            default:
                // Firebase URL array was empty. Return empty array.
                console.error('Firebase URL array was empty.');
        }

        return charArray;
    }

    // Write the Firebase password to the characteristics. Each of the three(3) characteristics holds 20 characters.
    async function writeFirebasePassword(device, fbPassword) {
        const fbPwdArray = await formatLongStrings(fbPassword);
        const fbPwdArrayLength = fbPwdArray.length;
        const charArray = [];

        switch (fbPwdArrayLength) {
            case 1:
            // One Firebase password element in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d0-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[0]))
                    .then(c => {
                        console.log('Here is the first Firebase Password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of Firebase Password used: ', fbPwdArray[0]);
                    })
                break;
            case 2:
            // Two Firebase password elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d0-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[0]))
                    .then(c => {
                        console.log('Here is the first Firebase Password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of Firebase Password used: ', fbPwdArray[0]);
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d1-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[1]))
                    .then(c => {
                        console.log('Here is the second Firebase Password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of Firebase Password used: ', fbPwdArray[1]);  
                    })
                break;
            case 3:
            // Three Firebase password elements in the array
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d0-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[0]))
                    .then(c => {
                        console.log('Here is the first Firebase Password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the first 20 character section of Firebase Password used: ', fbPwdArray[0]);
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d1-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[1]))
                    .then(c => {
                        console.log('Here is the second Firebase Password confirmation: ', c);
                        charArray.push(c);
                        console.log('Here is the second 20 character section of Firebase Password used: ', fbPwdArray[1]);
                    })
                await device.writeCharacteristicWithResponseForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36d2-4688-b7f5-ea07361b26a8', base64.encode(fbPwdArray[2]))
                .then(c => {
                    console.log('Here is the third Firebase Password confirmation: ', c);
                    charArray.push(c);
                    console.log('Here is the third 20 character section of Firebase Password used: ', fbPwdArray[1]);
                })
            break;
            default:
                // Firebase password array was empty. Return empty array.
                console.error('Firebase password array was empty.');
        }

        return charArray;
    }

    async function readMacAddress(device) {
        const macCharacteristic = await device.readCharacteristicForService('beb5483e-3600-4688-b7f5-ea07361b26a8', 'beb5483e-36e0-4688-b7f5-ea07361b26a8')
        let decodedMacAddress = base64.decode(macCharacteristic.value);

        console.log('Here is the converted data: ', decodedMacAddress);
        
        return decodedMacAddress;
    }

    noItemDisplay = () => {
        return(
          <View style={styles.noData}>
            <Title>No Sensors Returned</Title>
            <Text>Please stand closer to the sensor.</Text>
          </View>
        );        
    }

    return(
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
                <Modal
                    visible={modalVisible}
                    modalTitle={<ModalTitle title="Setting Up SnowController Device" />}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    onSwipeOut={() => setModalVisible(false)}
                >
                    <ModalContent>
                        <View style={styles.modalContent}>
                            <Text>{modalText}</Text>
                        </View>
                    </ModalContent>
                </Modal>
                <Title>Searching for Snow Controller LLC. Device</Title>
                <Card style={styles.cardLayout}>
                    <FlatList
                        style={styles.list}
                        data={listOfDevices}
                        ListEmptyComponent={() => noItemDisplay()}
                        renderItem={({item}) => {
                            return (
                                <CardItem bordered>
                                <View style={styles.badgeFormatting}>
                                    <Badge>
                                        <Text style={styles.badgeText}>{item.signalStrength}</Text>
                                    </Badge>
                                </View>
                                <View style={styles.sensorFormatting}>
                                    <Text style={styles.deviceNameText}>{item.deviceName}</Text>
                                </View>
                                <View style={styles.connectFormatting}>
                                    <Button rounded style={styles.connectButton} onPress={() => connectToSensor(item.deviceID)}>
                                        <Text>Connect</Text>
                                    </Button>
                                </View>
                            </CardItem>    
                            );
                        }
                    }
                    keyExtractor={ item => item.deviceID}
                    />
                </Card>
        </Container>
    );

}

export default withNavigation(FindBLE);

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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%',
        marginBottom: '2%'
    },
    cardLayout: {
        marginLeft: '2%',
        marginRight: '2%',
        flex: 1
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
        marginTop: 20,
        marginRight: 10
    },
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '2%',
        marginBottom: '2%'
    },
    warmUpImage: {
        width: 150, 
        height: 150, 
        alignSelf: 'center',
        marginTop: '3%',
        marginBottom: '1%'
    },
    bypassImage: {
        width: 150, 
        height: 150, 
        alignSelf: 'center',
        marginTop: '3%',
        marginBottom: '5%'
    },
    badgeFormatting: {
        width: '15%',
    },
    sensorFormatting: {
        width: '50%'
    },
    connectFormatting: {
        width: '35%',
        alignItems: 'flex-end'
    },
    badgeText: {
        fontSize: 18
    },
    deviceNameText: {
        fontSize: 18,
        marginLeft: '2%'
    },
    connectButton: {
        backgroundColor: '#0160bc'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    noData: {
        alignItems: 'center',
        justifyContent: 'center'  
    }
});