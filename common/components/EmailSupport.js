import React, { Component } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Linking } from 'react-native';
import { Container, Icon, Item, Button, Text, Label, Input, Form } from 'native-base';
import { withNavigation } from 'react-navigation';
import SnowFlake from './SnowFlake';
import TopHeader from './TopHeader';

function Support({ withNavigation }) {

    return(
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
            <Text style={styles.headerText}>Radiant System Control from Anywhere</Text>
            <Text style={styles.thankYouText}>Thank You for Purchasing The SnowController</Text>
            <View style={styles.addRow}>
                <Text style={styles.addDeviceText}> If you need help with your heated device at anytime, 
                    please feel free to email our support staff below:
                </Text>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    light
                    rounded
                    onPress={() => Linking.openURL('mailto:ScheduleService@SnowMeltInc.com?subject=Support&body=Driveway')}
                >
                    <Text style={styles.buttonText}>Email Support</Text>
                    <Icon type='FontAwesome5' name='mail-bulk' />
                </Button>
            </View> 
        </Container>
    );

}

export default withNavigation(Support);

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
    headerText: {
        fontSize: 19,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
    },
    thankYouText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
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
        marginTop: 50,
        marginRight: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    logoutText: {
        color: '#fff',
        marginLeft: 10
    }
});