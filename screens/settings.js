import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { logoutUser, settingsUser } from '../redux/ActionCreators';
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
  settingsUser: (userid, dataForm) => dispatch(settingsUser(userid, dataForm)),
});

const Settings = (props) => {
  const [dataForm, setDataForm] = useState({
    firstname: '',
    lastname: '',
    phrase: '',
    status: '',
  });
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => {
    setDataForm((prevProps) => ({
      ...prevProps,
      status: !dataForm.status,
    }));
  };

  useEffect(() => {
    let user = !props.user ? null : props.user.user;
    let status = !user ? false : user.publicStatus;
    let modalStatus = !user
      ? null
      : user.firstname === '' && user.lastname === ''
      ? true
      : false;
    setDataForm((prevState) => ({
      ...prevState,
      status: status,
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const controlState = (e) => {
  //   let name = e.target.name;
  //   if (name === 'status') {
  //     setDataForm((prevProps) => ({
  //       ...prevProps,
  //       status: !dataForm.status,
  //     }));
  //   } else {
  //     setDataForm((prevProps) => ({
  //       ...prevProps,
  //       [name]: e.target.value,
  //     }));
  //   }
  // };
  const handleSubmit = () => {
    const userid = props.user.user._id;
    props.settingsUser(userid, dataForm).then(() => {
      props.navigation.navigate('Profile');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameContent}>
        <Text style={styles.name}>Set your info</Text>
      </View>
      <View>
        <View>
          <TextInput
            type="email"
            style={styles.allinputs}
            placeholder="Name"
            onChangeText={(text) =>
              setDataForm((prevProps) => ({
                ...prevProps,
                firstname: text,
              }))
            }
          />

          <TextInput
            style={styles.allinputs}
            placeholder="Lastname"
            onChangeText={(text) =>
              setDataForm((prevProps) => ({
                ...prevProps,
                lastname: text,
              }))
            }
          />

          <TextInput
            style={styles.allinputs}
            placeholder="Phrase"
            onChangeText={(text) =>
              setDataForm((prevProps) => ({
                ...prevProps,
                phrase: text,
              }))
            }
          />

          <View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={dataForm.status}
            />
            <Text>
              {dataForm.status ? 'PRIVATE PROFILE' : 'PUBLIC PROFILE'}
            </Text>
          </View>
        </View>
        <View>
          <Button color="green" title="Send" onPress={handleSubmit} />
        </View>
      </View>
      <View style={styles.logoutContent}>
        <View>
          <Text style={styles.name}>Log Out</Text>
        </View>
        <View>
          <MaterialCommunityIcons
            name="logout"
            size={35}
            color={'green'}
            onPress={props.logoutUser}
          />
        </View>
      </View>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  name: {
    fontSize: 30,
  },
  allinputs: {
    marginTop: 10,
    marginBottom: 10,
    height: 30,
    color: '#444',
    textAlign: 'left',
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  logoutContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  arrowBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
