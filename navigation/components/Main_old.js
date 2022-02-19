import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Card, CardItem, Icon, Title, CheckBox } from 'native-base';
import firebase from 'react-native-firebase';

export default function Main() {

    const [ currentUser, setCurrentUser ] = useState('');

    useEffect(() => {
        const { currentUser } = firebase.auth()
        setCurrentUser(currentUser)
    });

    handleLogout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => navigation.navigate('Login'))
            .catch(error => setErrorMessage(error.errorMessage))
    }
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title style={{ alignSelf: 'center', marginLeft: '35%' }}>My Heaters</Title>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon name='menu' />
                    </Button>
                </Right>
            </Header>
            <Card>
                <CardItem style={styles.containerRow}>
                    <View>
                        <Image 
                            style={{ width: 100, height: 100}}
                            source={ require('../../assets/images/radiator_sm.jpg') }
                        />
                        <Text style={styles.titleText}>Main Driveway</Text>                    
                    </View>
                    <View style={ styles.listview }>
                        <View style={styles.relayRow}>
                            <Text>Relay One:   </Text> 
                            <CheckBox checked />
                        </View>
                        <View style={styles.relayRow}>
                            <Text>Relay Two:  </Text> 
                            <CheckBox checked />
                        </View>      
                        <View style={styles.relayRow}>
                            <Text>Relay Three:</Text> 
                            <CheckBox checked />
                        </View>              
                        <View style={styles.relayRow}>
                            <Text>Relay Four:  </Text> 
                            <CheckBox checked />
                        </View>                                                                  
                    </View>
                    <View style={styles.tempFrame}>
                        <Text>Sensor Temperature</Text>
                        <Text style={styles.temperatureText}>27 &deg; F</Text>
                    </View>                         
                </CardItem>
            </Card>
            <View style={styles.addRow}>
                <Text style={styles.addText}>Add New Heater  </Text>
                <Icon type='FontAwesome5' name='plus' style={{marginRight: 5}}/>
            </View>
            <View style={styles.addRow}>
                <TouchableOpacity onPress={ handleLogout }>
                    <Text style={{marginRight: 5}}>Log out ></Text>
                </TouchableOpacity>
            </View>            
      </Container>
    );
}

const styles = StyleSheet.create({
    containerRow: {
        flexDirection: 'row'
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    addText: {
        fontSize: 18,
        fontWeight: 'bold'
    },  
    relayRow: {
        flexDirection: 'row',
        marginLeft: '5%',
        paddingTop: 2,
        paddingBottom: 2,
    },
    listview: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        width: '40%'
      },
      checkbox: {
        marginLeft: 'auto',
        marginRight: 5
      },
      titleText: {
          alignSelf: 'center',
          fontSize: 16,
          fontWeight: 'bold'
      },
      tempFrame: {
        borderRadius: 2,
        borderColor: 'grey',
        backgroundColor: '#F5F5F5'
      },
      temperatureText: {
          fontSize: 40,
          alignSelf: 'center'
      }
});