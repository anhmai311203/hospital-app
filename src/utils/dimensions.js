import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  width,
  height,
  padding: 16,
  margin: 16,
  radius: 8,
  headerHeight: 60,
  bottomTabHeight: 60,
  buttonHeight: 50,
  inputHeight: 50,
  smallIcon: 16,
  mediumIcon: 24,
  largeIcon: 32
};