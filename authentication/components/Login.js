import React, { Component, useState } from 'react';
import { StyleSheet, Image, ImageBackground, TouchableNativeFeedback } from 'react-native';
import { Container, Content, Form, Input, Item, Button, Label, Text, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

function Login({ navigation }) {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ pwdIcon, setPwdIcon ] = useState('eye-off');
    const [ pwdShow, setPwdShow ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState('');

    handleLogin = () => {
        const formattedEmail = email.trim().toLowerCase();
        if (formattedEmail && password) {            
            auth().signInWithEmailAndPassword(formattedEmail, password)            
                .then(() => directUser(firebase.auth().currentUser.email))
                .catch(error => {
                    let errorMessage = error.message;
                    errorMessage = errorMessage.replace('[auth/wrong-password]', '');
                    errorMessage = errorMessage.replace('[auth/user-not-found]', '');
                    errorMessage = errorMessage.replace('[auth/unknown]', '');
                    setErrorMessage(errorMessage);
                }     
            );
        } else {
            alert('Please enter a valid email address and password to login');
        }
        
    }

    changeIcon = () => {
        (pwdIcon == 'eye-off' ? setPwdIcon('eye') : setPwdIcon('eye-off'));
        (pwdShow == true ? setPwdShow(false) : setPwdShow(true));
    }

    forgotPassword = () => {
        const formattedEmail = email.trim();
        if (formattedEmail) {
            auth().sendPasswordResetEmail(formattedEmail)
            .then(() => alert('An email was sent to your account instructing you to change your password.'))
            .catch(error => alert('Could not send password reset email. ', error.message))
        } else {
            alert('Please enter a valid email to reset your password');
        }
    }

    directUser = (email) => {
        
        // Check if the user is a customer or installer and direct them appropriately

        const dbCust = database().ref('customers');
            dbCust.orderByChild('email').equalTo(email).on('child_added', function(snapshot) {
                var customerInfo = snapshot.val();

                if (customerInfo.ownerInstaller == 'Owner') {
                    navigation.navigate('Main');
                } else {
                    navigation.navigate('Wireless');
                }
            });
        
        /*    dbMac.orderByChild('EMAIL').equalTo(email).on('value', function(snapshot) {
                snapshot.forEach((child) => {
                    if (child.val().ownerInstaller == "Owner") {
                        // Check if they have any zones setup and direct them appropriately
                        if (child.val().ZONE1.ACTIVE || child.val().ZONE2.ACTIVE || child.val().ZONE3.ACTIVE || child.val().ZONE4.ACTIVE) {
                            navigation.navigate('Main');
                        } else { // No zones setup
                            alert('Please let your certified SnowController installer know there are no zones setup.');
                        }
                    } else { // Installer setup
                        if (child.val().ZONE1.ACTIVE || child.val().ZONE2.ACTIVE || child.val().ZONE3.ACTIVE || child.val().ZONE4.ACTIVE) {
                            navigation.navigate('Device');
                        } else { // No zones setup
                            navigation.navigate('Device');
                        }
                    }
                    

                });
        }); 
        */  
    }

    return  (
        <Container>
            <ImageBackground style={styles.imgBackground}
                source={require('../../assets/images/heated_walkway_faded_w_logo.jpg')}
                resizeMode='cover'>
                <Content>  
                        <Text style={styles.headerText}>Radiant System Control from Anywhere</Text>
                        <Text style={styles.thankYouText}>Thank You for Purchasing the SnowController</Text>
                        <Form>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Email</Label>
                                <Input style={styles.textInput} onChangeText={email => setEmail(email)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Password</Label>
                                <Input style={styles.textInput} secureTextEntry={pwdShow} onChangeText={password => setPassword(password)}/>
                                <Icon style={styles.forgotPasswordIcon} name={pwdIcon} onPress={changeIcon}/>
                            </Item>
                            <Text style={styles.errorTextStyle}>
                                {errorMessage}
                            </Text>
                            <Button rounded style={styles.loginButton} onPress={ handleLogin }>
                                <Text style={styles.loginButtonText}>Login</Text>
                            </Button> 
                            <Text style={styles.versionText}>Version 1.0.17</Text>
                        </Form> 


                        { /* Owner request to temporarily remove social media sign-in capabilities 
                            <Text style={styles.signInText}>Or Sign in with</Text>
                            <Card style={{ backgroundColor: 'transparent' }}>
                                <CardItem style={{ backgroundColor: 'rgba(255, 255, 255, 0.0)', alignSelf: 'center'}}>
                                    <Button iconRight light style={ styles.googleButton} onPress={ handleLogin }>
                                        <Text style={{color: '#fff'}}>Google</Text>
                                        <Icon type='FontAwesome5' name='google' style={styles.socialIcon} />
                                    </Button>
                                    <Button iconRight light style={styles.facebookButton} onPress={ handleLogin }>
                                        <Text style={{color: '#fff'}}>Facebook</Text>
                                        <Icon type='FontAwesome5' name='facebook-f' style={styles.socialIcon} />
                                    </Button>
                                    <Button iconRight light style={styles.linkedInButton} onPress={ handleLogin }>
                                        <Text style={{color: '#fff'}}>LinkedIn</Text>
                                        <Icon type='FontAwesome5' name='linkedin-in' style={styles.socialIcon} />
                                    </Button>
                                </CardItem>
                            </Card>
                        */}   
                        
                </Content>
                <TouchableNativeFeedback onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.createAccountText}>Create Account ></Text>            
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => forgotPassword()}>
                    <Text style={styles.forgotPasswordText}>Forgot Password ></Text>            
                </TouchableNativeFeedback>
            </ImageBackground>
        </Container>     
    );
}

export default withNavigation(Login);

const styles = StyleSheet.create({
    textInput: {
      width: '90%',
      color: '#fff'
    },
    imgBackground: {
        width: '100%',
        height: '100%'
    },
    headerImage: {
        width: 296, 
        height: 85, 
        alignSelf: 'center', 
        marginTop: '15%'
    },
    headerText: {
        fontSize: 19,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: '40%'
    },
    thankYouText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
    },
    loginButton: {
        width: '90%',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    signInText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
        marginTop: 50
    },
    googleButton: {
        backgroundColor: '#db3236',
        marginRight: 10
    },
    socialIcon: {
        color: '#fff', 
        marginRight: 10
    },
    facebookButton: {
        backgroundColor: '#3C5A99',
        marginRight: 10
    },
    linkedInButton: {
        backgroundColor: '#0077B5'
    },
    createAccountText: {
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        marginLeft: 10
    },
    forgotPasswordText: {
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    forgotPasswordIcon: {
        color: '#fff'
    },
    versionText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginTop: '5%'
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorTextStyle: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#fff',
        marginTop: 20,
        marginLeft: 10
    }
});