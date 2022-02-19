import React, { Component, useState } from 'react';
import { StyleSheet, TouchableNativeFeedback} from 'react-native';
import { Container, Content, Text, Button, Form, Input, Item, Label, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase from '@react-native-firebase/app';
import SnowFlake from './../../common/components/SnowFlake';
import TopHeader from '../../common/components/TopHeader';

function NewWireless({ navigation }) {

    //const macAddress = navigation.getParam('macAddress');
    //console.log('Here is the passed Mac Address: ', macAddress);

    const [ customerEmail, setCustomerEmail ] = useState('');
    const [ ssid, setSSID ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ pwdIcon, setPwdIcon ] = useState('eye-off');
    const [ pwdShow, setPwdShow ] = useState(true);

    setupWireless = () => {
        if (customerEmail) {
            navigation.navigate('Device', {customerEmail: customerEmail.toLowerCase(), ssid: ssid, password: password});
        } else {
            alert('Please enter a valid customer email address.');
        }
    }

    changeIcon = () => {
        (pwdIcon == 'eye-off' ? setPwdIcon('eye') : setPwdIcon('eye-off'));
        (pwdShow == true ? setPwdShow(false) : setPwdShow(true));
    }

    return(
        <Container style={styles.container}>
            <TopHeader />
            <Content>
                <SnowFlake />
                <Text style={styles.addDeviceText}>First, we need to gather the customer and wireless information.  
                    Please have the customer help fill in the information.
                </Text>
                <Form>
                    <Item floatingLabel>
                        <Label style={styles.textInput}>Customer's Email Address</Label>
                        <Input style={styles.textInput} onChangeText={custEmail => setCustomerEmail(custEmail)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label style={styles.textInput}>SSID (Wireless Router Name)</Label>
                        <Input style={styles.textInput} onChangeText={ssid => setSSID(ssid)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label style={styles.textInput}>Wireless Password</Label>
                        <Input style={styles.textInput} secureTextEntry={pwdShow} onChangeText={password => setPassword(password)}/>
                        <Icon style={styles.forgotPasswordIcon} name={pwdIcon} onPress={changeIcon}/>
                    </Item>
                    <Button bordered light style={styles.setupButton} onPress={() => setupWireless() }>
                        <Text style={styles.setupWifiText}>Setup Wifi</Text>
                    </Button> 
                </Form>
            </Content> 
            <TouchableNativeFeedback >
                    <Text style={styles.modifyDevice}>Modify Existing Setup/Device ></Text>            
            </TouchableNativeFeedback>
        </Container>
    );
}

export default withNavigation(NewWireless);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    titleText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        color: '#fff'
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    addDeviceText: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        fontSize: 18,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    textInput: {
        width: '90%',
        color: '#fff'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    setupButton: {
        marginTop: 30,
        marginRight: 10,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: '30%'
    },
    navigationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10 
    },
    setupWifiText: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '3%'
    },
    modifyDevice: {
        color: '#fff',
        marginLeft: '2%',
        marginBottom: '2%'
    },
    forgotPasswordIcon: {
        color: '#fff'
    }
});