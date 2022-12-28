import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Button } from 'react-native';
import Animated, { Keyframe, Easing  } from 'react-native-reanimated';

export const Animation = () => {
    const [show, setShow] = useState(false);
    // const [width, setWidth] = useState(0);
    // const ref = useRef();
    // useEffect(() => {
    //     setWidth(ref.current.width);
    // console.log(ref.current.setWidth);
    //   }, [ref]);
    const {width} = Dimensions.get('window')
  const enteringAnimation = new Keyframe({
    0: {
     width: 0
    },
    // 30: {
    //   originX: 10,
    //   transform: [{ rotate: '-90deg' }],
    // },
    100: {
        width: width,
      easing: Easing.quad,
    },
  }).duration(10000);

 
  
  return (
    <View style={{ flexDirection: 'column-reverse' }}>
      <Button
        title="animate"
        onPress={() => {
          setShow((last) => !last);
        }}
      />
      <View
        style={{ backgroundColor: 'yellow',
        opacity: 0.5,
        flexGrow: 1,
        height: 5,
        marginRight: 2,
        marginLeft: 2,
        position: 'relative',
        borderRadius: 5,
        width: width}}>
        {show && (
            <Animated.View
              entering={enteringAnimation}
              style={{
                height: '100%',
                width:0,
    backgroundColor: 'black',
    zIndex:10
              }}
              
            />
        )}
        <View></View>
      </View>
    </View>
  );
}