import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Svg, { Ellipse } from 'react-native-svg';
import Constants from 'expo-constants';

export const Poster = () => {
    return (
        <View style={styles.container}>
            <Svg
                width="80"
                height="80"
                viewBox="0 0 640 480"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                style={styles.ico}>
                <Ellipse
                    rx="185.035562"
                    ry="179.573258"
                    transform="matrix(1.309963 0 0 
                        1.302294 314.537695 240)"
                    fill="#fff"
                />
                <Ellipse
                    rx="71.692745"
                    ry="69.644382"
                    transform="translate(314.537695 240)"
                    fill="#176e14"
                    strokeWidth="0"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
    ico: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -50,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: -40,
        fill: '#28a745',
    },
});
