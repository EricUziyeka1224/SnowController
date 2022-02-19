import React, { Component } from 'react';
import { StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';

function SnowFlake() {
    
    openURL = () => {
        Linking.canOpenURL('http://snowmelt.pro/').then(supported => {
            if (supported) {
                Linking.openURL('http://snowmelt.pro/');
            } else {
                alert('Cannot open website: snowmelt.pro');
            }
        });
    }

    return (
        <TouchableOpacity onPress={openURL}>
            <Image
                style={styles.headerImage}
                source={ require('../../assets/images/SC_Logo_BLUEWHITE.png') }
            />
        </TouchableOpacity>                 
    );
}

export default SnowFlake;

const styles = StyleSheet.create({
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center',
        marginTop: '2%',
        marginBottom: '2%'
    }
});