import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ActivityIndicator, MD2Colors } from "react-native-paper";

const SplashView = ({ onFinish }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ]),
      Animated.delay(500),
      Animated.timing(fade, { toValue: 0, duration: 4000, useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  useEffect(() => {
    const id = setTimeout(() => {
      onFinish("login");
    }, 10000);
    return () => clearTimeout(id);
  }, [onFinish]);

  return (
    <SafeAreaView style={styles.splash}>
      <Animated.View
        style={[
          styles.splash,
          { opacity: fade, transform: [{ scale }] },
        ]}
      >
        {/* Exibe o GIF via URL */}
        <Image
          source={{
            uri:
              "https://pfcardapio.com.br/public/images/template/59dfcf9c6c60f1ce9011f4abc7e9720e05c0ad25.gif",
          }}
          style={styles.gif}
        />

        <Text style={styles.title}>WendelDog´s</Text>
        

        <ActivityIndicator animating={true} color={MD2Colors.red800} size={120} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    padding: 15,
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 8,
    padding: 10,
    color: "#fff",
  },
});

export default SplashView;
