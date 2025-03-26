import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'black';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  icon, 
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    // Base button style
    let buttonStyle: Array<any> = [styles.button];
    
    // Add variant styles
    switch (variant) {
      case 'outline':
        buttonStyle.push(styles.buttonOutline);
        break;
      case 'secondary':
        buttonStyle.push(styles.buttonSecondary);
        break;
      case 'black':
        buttonStyle.push(styles.buttonBlack);
        break;
      default:
        buttonStyle.push(styles.buttonDefault);
    }
    
    // Add size styles
    switch (size) {
      case 'sm':
        buttonStyle.push(styles.buttonSmall);
        break;
      case 'lg':
        buttonStyle.push(styles.buttonLarge);
        break;
    }
    
    // Add disabled style
    if (disabled || loading) {
      buttonStyle.push(styles.buttonDisabled);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    // Base text style
    let textStyle: Array<any> = [styles.buttonText];
    
    // Add variant text styles
    switch (variant) {
      case 'outline':
        textStyle.push(styles.buttonOutlineText);
        break;
      case 'secondary':
        textStyle.push(styles.buttonSecondaryText);
        break;
      case 'black':
        textStyle.push(styles.buttonBlackText);
        break;
      default:
        textStyle.push(styles.buttonDefaultText);
    }
    
    // Add size text styles
    switch (size) {
      case 'sm':
        textStyle.push(styles.buttonSmallText);
        break;
      case 'lg':
        textStyle.push(styles.buttonLargeText);
        break;
    }
    
    // Add disabled text style
    if (disabled || loading) {
      textStyle.push(styles.buttonDisabledText);
    }
    
    return textStyle;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'default' ? '#222222' : '#FFCC00'} 
          size="small" 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <Ionicons 
              name={icon as any} 
              size={18} 
              color={
                variant === 'default' ? '#222222' : 
                variant === 'black' ? '#FFFFFF' : '#222222'
              } 
              style={styles.buttonIcon} 
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  // Variants
  buttonDefault: {
    backgroundColor: '#FFCC00',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFCC00',
  },
  buttonSecondary: {
    backgroundColor: '#EEEEEE',
  },
  buttonBlack: {
    backgroundColor: '#222222',
  },
  // Text variants
  buttonDefaultText: {
    color: '#222222',
  },
  buttonOutlineText: {
    color: '#222222',
  },
  buttonSecondaryText: {
    color: '#222222',
  },
  buttonBlackText: {
    color: '#FFFFFF',
  },
  // Sizes
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonSmallText: {
    fontSize: 14,
  },
  buttonLargeText: {
    fontSize: 18,
  },
  // Disabled
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonDisabledText: {
    opacity: 0.8,
  },
});

export default Button;