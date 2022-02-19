import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import { Container, Text, Item, Label, Input, Form, Picker, Header, Title, Left, Right, Body, Icon, Content } from 'native-base';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { withNavigation } from 'react-navigation';
import csc from 'country-state-city';
import SnowFlake from '../../common/components/SnowFlake';


function Profile ({ navigation }) {

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState(firebase.auth().currentUser.email);
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ stateProvince, setStateProvince ] = useState('');
    const [ stateProvinceList, setStateProvinceList ] = useState([]);
    const [ postalCode, setPostalCode ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ key, setKey ] = useState('');

    let listOfStates = [];
    let listOfProvinces = [];
    let states = [];
    let provinces = [];
    let stateProvinces = [];

    useEffect(() => {
        const dbCust = database().ref('customers');
        dbCust.orderByChild('email').equalTo(email).on('child_added', function(snapshot) {
            var userInfo = snapshot.val();
            setName(userInfo.name);
            setAddress(userInfo.address);
            setCity(userInfo.city);
            setStateProvince(userInfo.state);
            setPostalCode(userInfo.postalCode);
            setPhone(userInfo.phone);
            setKey(snapshot.key);
        });

        listOfStates = csc.getStatesOfCountry('231');
        listOfProvinces = csc.getStatesOfCountry('38');
        states = listOfStates.map(function(item) {
            return {
                value : item.name
            }
        });
        provinces = listOfProvinces.map(function(item) {
            return {
                value : item.name
            }
        });
        // Combine states and provinces and sort alphabetically
        stateProvinces = [ ...states, ...provinces ];
        stateProvinces.sort(function(a, b) {
            if(a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
            if(a.value.toLowerCase() > b.value.toLowerCase()) { return 1; }
            return 0;
        })
        setStateProvinceList(stateProvinces);

    }, []);

    saveUserData = () => {
        let customerRef = firebase.database().ref('customers/' + key);

        customerRef.update({
            'name'          : name,
            'address'       : address,
            'city'          : city,
            'state'         : stateProvince,
            'postalCode'    : postalCode,
            'phone'         : phone
        }).then(alert('Profile Successfully Updated'));

        navigation.navigate('Main');

    }

    handleLogout = () => {
        firebase.auth().signOut()
        .then(() => navigation.navigate('Login'))
        .catch(error => setErrorMessage(error.errorMessage))
    }

    return (
        <Container style={styles.container}>
            <Content>
                <Header noShadow style={styles.header}>
                <Left>
                    <TouchableNativeFeedback onPress={() => navigation.goBack()}>
                        <View style={styles.titleRow}>
                            <Icon type='FontAwesome5' name='angle-left' style={{color: '#fff'}} />
                            <Text style={styles.titleText}> Cancel</Text>
                        </View>
                    </TouchableNativeFeedback>
                </Left>
                <Body>
                    <Title style={styles.headerText}>{navigation.state.routeName}</Title>
                </Body>
                <Right>
                    <TouchableNativeFeedback onPress={() => saveUserData()}>
                        <View style={styles.titleRow}>
                            <Text style={styles.titleText}>Save </Text>
                            <Icon type='FontAwesome5' name='angle-right' style={{color: '#fff'}} />
                        </View>
                    </TouchableNativeFeedback>
                </Right>
                </Header>
                <SnowFlake />
                <Form>
                    <Item stackedLabel>
                        <Label style={styles.textInput}>Name</Label>
                        <Input style={styles.textInput} onChangeText={name => setName(name)}>
                            {name}
                        </Input>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.textInput}>Address</Label>
                        <Input style={styles.textInput} onChangeText={address => setAddress(address)}>
                            {address}
                        </Input>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.textInput}>City</Label>
                        <Input style={styles.textInput} onChangeText={city => setCity(city)}>
                            {city}
                        </Input>
                    </Item>
                    <Item picker>
                        <Picker style={styles.picker}
                            mode='dropdown'
                            placeholder='Select State/Province'
                            selectedValue={stateProvince}
                            onValueChange={(itemValue) =>
                            setStateProvince(itemValue)}
                        >
                            <Picker.Item label='Select State/Province' value='0' />
                            { stateProvinceList.map((s) => {
                                return <Picker.Item key={s.value} label={s.value} value={s.value} />
                            }) }
                        </Picker>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.textInput}>Zip / Postal Code</Label>
                        <Input style={styles.textInput} onChangeText={postalCode => setPostalCode(postalCode)}>
                            {postalCode}
                        </Input>
                    </Item>
                    <Item stackedLabel>
                        <Label style={styles.textInput}>Phone</Label>
                        <Input style={styles.textInput} onChangeText={phone => setPhone(phone)}>
                            {phone}
                        </Input>
                    </Item>
                </Form>
            </Content>
            <View style={styles.addRow}>
                    <TouchableNativeFeedback onPress={ handleLogout }>
                        <Text style={styles.navigationText}>Log out ></Text>
                    </TouchableNativeFeedback>
            </View>
        </Container>
    )
}

export default withNavigation(Profile);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0160bc'
    },
    header: {
        backgroundColor: '#0160bc',
        borderBottomWidth: 0,
    },
    headerText: {
        alignSelf: 'center',
        marginLeft: 80
    },
    titleText: {
        color: '#fff'
    },
    subTitleBody: {
        alignItems: 'center'
    },
    subTitleText: {
        textAlign: 'center',
        marginTop: '3%',
        fontSize: 22
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center'
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
    picker: {
        color: '#fff',
        marginTop: 20,
        width: 200
    },
    navigationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10 
    }
});