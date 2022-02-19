import React, { Component, useState } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Linking } from 'react-native';
import { Container, Text, Body, Button, Card, CardItem, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
import TopHeader from './../../common/components/TopHeader';
import SnowFlake from './../../common/components/SnowFlake';

function BypassPreheat({ navigation }) {

    const zone = navigation.getParam('zoneName');

    preheatOrBypass = (view) => {
        if (view == 'preheat') {
            navigation.navigate('Preheat', {zoneName: zone});
        } else {
            navigation.navigate('Bypass', {zoneName: zone});
        }
    }

    return(
        <Container style={styles.container}>
            <TopHeader />
            <SnowFlake />
            <Card style={styles.cardLayout}>
                <CardItem bordered>
                    <Body style={styles.subTitleBody}>
                        <TouchableOpacity onPress={() => preheatOrBypass('preheat')}>
                            <Text style={styles.subTitleText}>
                                Preheat {zone}
                            </Text>
                            <Image
                                style={styles.warmUpImage}
                                source={ require('../../assets/images/red_timer_sm.png') }
                            />
                        </TouchableOpacity>
                    </Body>
                </CardItem>
                <CardItem bordered>
                    <Body style={styles.subTitleBody}>
                        <TouchableOpacity onPress={() => preheatOrBypass('bypass')}>
                            <Text style={styles.subTitleText}>
                                Bypass {zone}
                            </Text>
                            <Image
                                style={styles.bypassImage}
                                source={ require('../../assets/images/blue_timer_sm.png') }
                            />
                        </TouchableOpacity>
                    </Body>
                </CardItem>
            </Card>
        </Container>
    );

}

export default withNavigation(BypassPreheat);

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
    subTitleBody: {
        alignItems: 'center'
    },
    subTitleText: {
        textAlign: 'center',
        marginTop: '3%',
        fontSize: 22
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
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
    logoutText: {
        color: '#fff',
        marginLeft: 10
    }
});