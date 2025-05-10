import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  useColorScheme,
  Platform
} from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  let backgroundColor;
  let textColor;
  let borderColor;
  
  switch (variant) {
    case 'primary':
      backgroundColor = colors.primary;
      textColor = '#FFFFFF';
      borderColor = 'transparent';
      break;
    case 'secondary':
      backgroundColor = colors.secondary;
      textColor = '#FFFFFF';
      borderColor = 'transparent';
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = colors.primary;
      borderColor = colors.primary;
      break;
    case 'danger':
      backgroundColor = colors.error;
      textColor = '#FFFFFF';
      borderColor = 'transparent';
      break;
  }
  
  if (disabled) {
    backgroundColor = colorScheme === 'dark' ? '#3A3A3C' : '#E5E5EA';
    textColor = colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC';
    borderColor = 'transparent';
  }
  
  let paddingVertical;
  let paddingHorizontal;
  let fontSize;
  
  switch (size) {
    case 'small':
      paddingVertical = 8;
      paddingHorizontal = 16;
      fontSize = 14;
      break;
    case 'medium':
      paddingVertical = 12;
      paddingHorizontal = 24;
      fontSize = 16;
      break;
    case 'large':
      paddingVertical = 16;
      paddingHorizontal = 32;
      fontSize = 18;
      break;
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          paddingVertical,
          paddingHorizontal,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize,
                marginLeft: icon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});