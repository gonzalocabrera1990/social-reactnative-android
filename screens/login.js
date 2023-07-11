import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { createStackNavigator } from 'react-navigation'
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
// import { WebBrowser } from 'expo';
import { connect } from 'react-redux';
import { loginUser } from '../redux/ActionCreators';
// import { MonoText } from '../components/StyledText';
import { baseUrl } from '../shared/baseurl';
// import UserPage from './UserpageComponent';
import { StackActions } from '@react-navigation/native';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
});
/*const MenuNavigator = createStackNavigator({

  REDSOCIAL: { screen: REDSOCIAL}
},{
  initialRouteName: "Red Social",
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#085f08'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: '#fff'
    }
  }
})*/

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  static navigationOptions = {
    tabBarVisible: false,
    //title: 'Sign' //NOMBRE EN LA VISTA DEL TABNAVIGATION
  };

  handleChange = (text) => {
    this.setState({
      username: text,
    });
  };
  handleChangePassword = (text) => {
    this.setState({
      password: text,
    });
  };
  handleLogin = () => {
    const creds = {
      username: this.state.username,
      password: this.state.password,
    };

    this.props.loginUser(creds)
    .then(resp =>{
      // if(resp) this.props.navigation.navigate("Settings")
      if(resp){
      this.props.navigation.navigate('Settings', {
        screen: 'UserSettings'
      })
    }
    })
  };

  map = (a) => {};
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <View style={styles.imgContent}>
            <Image
              style={styles.img}
              source={require('../shared/assets/images/login.png')}
            />
          </View>
          <View>
            <TextInput
              style={styles.allinputs}
              type="email"
              placeholder="Email"
              onChangeText={(text) => this.handleChange(text)}
            />
            <TextInput
              style={styles.allinputs}
              placeholder="Contraseña"
              onChangeText={(text) => this.handleChangePassword(text)}
            />
          </View>
          <View>
            <Button color="green" title="SIGN IN" onPress={this.handleLogin} />
          </View>
          <View style={styles.singUpContainer}>
            <Text style={styles.singUpText}>
              You don't have an account yet?
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={(styles.singUpText, { color: 'blue' })}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3ecb3',
  },
  contentContainer: {
    paddingTop: 80,
    margin: 30,
  },
  imgContent: {
    flex: 3,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    width: 300,
  },
  img: {
    height: 100,
    width: 300,
  },
  allinputs: {
    marginBottom: 10,
    paddingLeft: 10,
    color: '#444',
    textAlign: 'left',
    borderBottomColor: '#C5C5C5',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  singUpContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: 100,
  },
  singUpText: {
    fontSize: 15,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});
//export default HomeScreen;
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
