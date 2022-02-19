import React, { Component } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Linking } from 'react-native';
import { Container, Icon, Item, Button, Text, Label, Input, Form } from 'native-base';
import { withNavigation } from 'react-navigation';

function Support({ withNavigation }) {

    return(
        <Container style={styles.container}>
            <Text style={styles.titleText}>Thank You for Purchasing SnowController</Text>
            <View style={styles.addRow}>
                <Text style={styles.addDeviceText}> If you need help with your heated device at anytime, 
                    please feel free to call or email our support staff below:
                </Text>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    onPress={() => Linking.openURL('mailto:ScheduleService@SnowMeltInc.com?subject=Support&body=Driveway')}
                >
                    <Text>Email Support</Text>
                    <Icon type='FontAwesome5' name='mail-bulk' />
                </Button>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    onPress={() => Linking.openURL('tel:9737285745')}
                >
                    <Text>Phone Support</Text>
                    <Icon type='FontAwesome5' name='phone' />
                </Button>
            </View>
            <View style={styles.addRow}>
                <TouchableOpacity onPress={ handleLogout }>
                    <Text style={{marginRight: 5}}>Log out ></Text>
                </TouchableOpacity>
            </View>  
        </Container>
    );

}

export default withNavigation(Support);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2980b6'
    },
    titleText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 22,
        color: '#000'
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
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginRight: 10
    }
});