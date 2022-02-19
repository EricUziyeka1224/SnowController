import React, { Component, useState, useEffect } from 'react';
import { Alert, StyleSheet, ImageBackground, TouchableNativeFeedback } from 'react-native';
import { Container, Content, Form, Input, Item, Button, Label, Text, Icon, Picker } from 'native-base';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import csc from 'country-state-city';
import { withNavigation } from 'react-navigation';


function SignUp({ navigation }) {
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirm, setConfirm ] = useState('');
    const [ name, setName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ stateProvince, setStateProvince ] = useState('');
    const [ stateProvinceList, setStateProvinceList ] = useState([]);
    const [ postalCode, setPostalCode ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ ownerInstaller, setOwnerInstaller ] = useState('');
    const [ pwdIcon, setPwdIcon ] = useState('eye-off');
    const [ pwdShow, setPwdShow ] = useState(true);
    
    const [ help, setHelp ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');

    let listOfStates = [];
    let listOfProvinces = [];
    let states = [];
    let provinces = [];
    let stateProvinces = [];

    useEffect(() => {
        // Retrieve the list of states and provinces. Country code 231 is for USA, Country code 38 is for Canada.
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
    
    useEffect(() => {
        if (errorMessage) {
            Alert.alert('Create Account - Error ', errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (password == confirm) {
            setHelp('');
        } else if (password && confirm && password != confirm) {
            setHelp('Passwords do not match.')
        }
    }, [password, confirm]);

    async function handleSignUp() {        
        setLoading(true);
        setErrorMessage('');
        await firebase
                .auth()
                .createUserWithEmailAndPassword(email.trim().toLowerCase(), password)
                .then(() => addNewUserToDB())
                .catch(error => {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            setErrorMessage('Please enter a valid email address.');
                            break;
                        case 'auth/user-disabled':
                            setErrorMessage('This account has been disabled.');
                            break;
                        case 'auth/user-not-found':
                        case 'auth/wrong-password':
                            setErrorMessage('No user found or wrong password.');
                            break;
                        default:
                            console.error(error.message);
                            break;
                    }
                })
            
        setLoading(false);

    }

    addNewUserToDB = () => {
        let customerRef = firebase.database().ref('customers');
        let newCustomerRef = customerRef.push();
        newCustomerRef.set({
            'name'          : name,
            'address'       : address,
            'city'          : city,
            'state'         : stateProvince,
            'postalCode'    : postalCode,
            'phone'         : phone,
            'email'         : email.trim().toLowerCase(),
            'ownerInstaller': ownerInstaller
        })
        .then(() => {
            navigation.navigate('Home');
        })
        .catch(function(error) {
            console.error('Error adding new document: ', error.message);
        });  
    }

    changeIcon = () => {
        (pwdIcon == 'eye-off' ? setPwdIcon('eye') : setPwdIcon('eye-off'));
        (pwdShow == true ? setPwdShow(false) : setPwdShow(true));
    }

    return (
        <Container>
            <ImageBackground style={styles.imgBackground}
                source={require('../../assets/images/heated_walkway_faded_w_logo.jpg')}
                resizeMode='cover'>
                <Content>  
                        <Text style={styles.headerText}>Radiant System Control from Anywhere</Text>
                        <Text style={styles.thankYouText}>Thank You for Purchasing the SnowController</Text>
                        <TouchableNativeFeedback onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.alreadyAccountText}>Already have an account, Log in ></Text>            
                        </TouchableNativeFeedback>
                        <Form>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Name</Label>
                                <Input style={styles.textInput} onChangeText={name => setName(name)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Email</Label>
                                <Input style={styles.textInput} onChangeText={email => setEmail(email)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Password</Label>
                                <Input style={styles.textInput} secureTextEntry={pwdShow} onChangeText={password => setPassword(password)}/>
                                <Icon style={styles.forgotPasswordIcon} name={pwdIcon} onPress={changeIcon}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Confirm Password</Label>
                                <Input style={styles.textInput} secureTextEntry={pwdShow} onChangeText={password => setConfirm(password)}/>
                                <Icon style={styles.forgotPasswordIcon} name={pwdIcon} onPress={changeIcon}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Address</Label>
                                <Input style={styles.textInput} onChangeText={address => setAddress(address)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>City</Label>
                                <Input style={styles.textInput} onChangeText={city => setCity(city)}/>
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
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Zip / Postal Code</Label>
                                <Input style={styles.textInput} onChangeText={postalCode => setPostalCode(postalCode)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label style={styles.textInput}>Phone</Label>
                                <Input style={styles.textInput} onChangeText={phone => setPhone(phone)}/>
                            </Item>
                            <Item picker>
                                <Picker style={styles.picker}
                                    mode='dropdown'
                                    placeholder='Owner of Installer'
                                    selectedValue={ownerInstaller}
                                    onValueChange={(itemValue) =>
                                    setOwnerInstaller(itemValue)}
                                >
                                    <Picker.Item label='Owner or Installer' value='0' />
                                    <Picker.Item label='Owner' value='Owner' />
                                    <Picker.Item label='Installer' value='Installer' />
                                </Picker>
                            </Item>
                            <Text style={styles.errorTextStyle}>
                                {help}
                            </Text>
                            <Button 
                                loading={loading}
                                block style={styles.loginButton} 
                                disabled={!name || !email || !password || !confirm || !address || !city || !stateProvince || !postalCode || !phone || !ownerInstaller || !!help}
                                onPress={() => (loading ? null : handleSignUp())}
                            >
                                <Text>{loading ? 'Creating Account' : 'Create Account'}</Text>
                            </Button> 
                        </Form> 

                        { /* Owner wants to leave out Social Media registration for now

                            <Text style={styles.signInText}>Or Sign up with</Text> 
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
                        */ }  
                        
                </Content>
            </ImageBackground>
        </Container>
    );
}

export default withNavigation(SignUp);

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
        marginTop: '5%'
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
    alreadyAccountText: {
        fontSize: 19,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
    },
    loginButton: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
    },
    signInText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
        marginTop: 20
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
    loginText: {
        color: '#fff',
        position: 'absolute',
        bottom: 10,
        marginLeft: 10
    },
    picker: {
        color: '#fff',
        marginTop: 20
    },
    forgotPasswordIcon: {
        color: '#fff'
    },
    errorTextStyle: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#fff',
        marginTop: 20,
        marginLeft: 10
    }
}); 