import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
const { width } = Dimensions.get('window');
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import SelectDropdown from 'react-native-select-dropdown';
import { useFocusEffect } from '@react-navigation/native';

import { Countries } from '../shared/countries';
import { Gender } from '../shared/gender';

import { signupUser } from '../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    signup: state.signup,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signupUser: (data) => dispatch(signupUser(data)),
});

export const Signup = ({ navigation, signup, signupUser }) => {
  const [messageResponse, setMessageResponse] = useState(null);
  const [dataForm, setDataForm] = useState({
    username: '',
    password: '',
    repeatpassword: '',
    gender: '',
    country: '',
    date: '',
  });

  const [isLodaing, setIsloading] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    username: false,
  });
  useEffect(() => {
    if (signup.errMess) {
      setMessageResponse(signup.errMess);
      setIsloading(false);
    }
    if (signup.successMess) {
      setMessageResponse(signup.successMess);
      setIsloading(false);
    }
  }, [signup]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        setMessageResponse(null);
      };
    }, [])
  );
  //  const countries = [
  //   'Egypt',
  //   'Canada',
  //   'Australia',
  //   'Ireland',
  //   'Brazil',
  //   'England',
  //   'Dubai',
  //   'Argentina',
  //   'Germany',
  //   'Saudi Arabia',
  //   'France',
  //   'India',
  // ];

  const handleBlur = (field) => (e) => {
    setTouched((prevProps) => ({
      ...prevProps,
      [field]: true,
    }));
  };

  const validar = (
    username,
    password,
    repeatpassword,
    gender,
    date,
    country
  ) => {
    const error = {
      password: { err: '', valid: false },
      repeatpassword: { err: '', valid: false },
      username: { err: '', valid: false },
      gender: false,
      date: false,
      country: false,
    };

    const expreg = /^(\w{3,})@(gmail|hotmail|outlook).\b(com|info|web)\b/;

    if (touched.password && password.length < 4) {
      error.password.err =
        'La contraseña es DEBIL. Debe ser mayor a 4 caracteres. Recomendamos alternar numeros y letras';
    } else if (touched.password && password.length > 10) {
      error.password.err =
        'El contraseña debe ser menor o igual a 10 caracteres. Recomendamos alternar numeros y letras';
    } else if (password !== '') {
      error.password.valid = true;
    }

    if (touched.repeatpassword && repeatpassword !== password) {
      error.repeatpassword.err =
        'CONTRASEÑA Y REPETIR CONTRASEÑA NO COINCIDEN. POR FAVOR, VALIDA ESTE COMPO DE TEXTO';
    } else if (touched.repeatpassword && repeatpassword.length > 10) {
      error.repeatpassword.err =
        'El contraseña debe ser menor o igual a 10 caracteres. Recomendamos alternar numeros y letras';
    } else if (repeatpassword !== '') {
      error.repeatpassword.valid = true;
    }
    if (touched.username && !expreg.test(username)) {
      error.username.err =
        'Debe cumplir el formato de email. Ej: exampe@mail.com';
    } else if (username !== '') {
      error.username.valid = true;
    }

    if (gender !== '') {
      error.gender = true;
    }

    if (date !== '') {
      error.date = true;
    }
    if (country !== '') {
      error.country = true;
    }
    return error;
  };

  const onSubmit = () => {
    setIsloading(true);
    signupUser(dataForm);
  };

  const error = validar(
    dataForm.username,
    dataForm.password,
    dataForm.repeatpassword,
    dataForm.gender,
    dataForm.date,
    dataForm.country
  );
  const enableButton =
    error.username.valid &&
    error.password.valid &&
    error.repeatpassword.valid &&
    error.gender &&
    error.date &&
    error.country
      ? false
      : true;

  return (
    <View style={styles.container}>
      {isLodaing ? (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : messageResponse ? (
        <View>
          <Text>{messageResponse}</Text>
          <View>
            <TouchableOpacity>
              <Button
                color="green"
                title="GO BACK"
                onPress={() => navigation.navigate('LogIn')}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.nameContent}>
            <Text style={styles.name}>REGISTER</Text>
          </View>
          <View>
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  type="email"
                  style={styles.allinputs}
                  placeholder="E-mail"
                  onChangeText={(text) =>
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      username: text,
                    }))
                  }
                  onBlur={handleBlur('username')}
                />
                <Text style={styles.errorForm}>{error.username.err}</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={(text) =>
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      password: text,
                    }))
                  }
                  style={styles.allinputs}
                  placeholder="Password"
                  onBlur={handleBlur('password')}
                />
                <Text style={styles.errorForm}>{error.password.err}</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={(text) =>
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      repeatpassword: text,
                    }))
                  }
                  style={styles.allinputs}
                  placeholder="Repeat password"
                  onBlur={handleBlur('repeatpassword')}
                />
                <Text style={styles.errorForm}>{error.repeatpassword.err}</Text>
              </View>
              <View style={styles.inputContainer}>
                <SelectDropdown
                  data={Gender}
                  // defaultValueByIndex={1}
                  // defaultValue={'Egypt'}
                  onSelect={(selectedItem, index) => {
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      gender: selectedItem,
                    }));
                  }}
                  defaultButtonText={'Select gender'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdown1BtnStyle}
                  buttonTextStyle={styles.dropdown1BtnTxtStyle}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <MaterialCommunityIcons
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown1DropdownStyle}
                  rowStyle={styles.dropdown1RowStyle}
                  rowTextStyle={styles.dropdown1RowTxtStyle}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={(text) =>
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      date: text,
                    }))
                  }
                  style={styles.allinputs}
                  placeholder="Birth Ej: 01/01/1900"
                />
              </View>
              <View style={styles.inputContainer}>
                <SelectDropdown
                  data={Countries}
                  // defaultValueByIndex={1}
                  // defaultValue={'Egypt'}
                  onSelect={(selectedItem, index) => {
                    setDataForm((prevProps) => ({
                      ...prevProps,
                      country: selectedItem,
                    }));
                  }}
                  defaultButtonText={'Select country'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdown1BtnStyle}
                  buttonTextStyle={styles.dropdown1BtnTxtStyle}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <MaterialCommunityIcons
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown1DropdownStyle}
                  rowStyle={styles.dropdown1RowStyle}
                  rowTextStyle={styles.dropdown1RowTxtStyle}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity disabled={enableButton}>
                <Button
                  color="green"
                  title="SIGN UP"
                  onPress={() => {
                    onSubmit();
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3ecb3',
    justifyContent: 'center',
  },
  nameContent: {
    marginBottom: 15,
  },
  name: {
    fontSize: 30,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
  inputContainer: {
    height: 50,
    marginBottom: 10,
  },
  errorForm: {
    height: 15,
    color: 'red',
    margin: 0,
    padding: 0,
  },
  allinputs: {
    paddingLeft: 10,
    color: '#444',
    textAlign: 'left',
    borderBottomColor: '#C5C5C5',
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
