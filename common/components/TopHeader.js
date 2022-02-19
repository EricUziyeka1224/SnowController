import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Button, Header, Title, Left, Right, Body } from 'native-base';
import { withNavigation } from 'react-navigation'; 

function TopHeader({ navigation }) {

    return (
        <Header noShadow style={styles.header}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon type='FontAwesome5' name='angle-left' />
                </Button>
            </Left>
            <Body>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate('Profile')}>
                <Icon type='FontAwesome5' name='user-alt' />
                </Button>
            </Right>
        </Header>
    );
}

export default withNavigation(TopHeader);

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0160bc',
        borderBottomWidth: 0,
    },
    headerText: {
        alignSelf: 'center',
        marginLeft: 80
    }
});