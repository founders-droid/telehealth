import { View, Text, Image } from 'react-native';
import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({
  imageUrl,
  firstName = '',
  lastName = '',
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeStyles = {
    sm: { container: 'w-8 h-8', text: 'text-xs' },
    md: { container: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'w-16 h-16', text: 'text-xl' },
    xl: { container: 'w-24 h-24', text: 'text-3xl' },
  };

  const initials = getInitials(firstName, lastName);

  return (
    <View
      className={`
        ${sizeStyles[size].container}
        rounded-full overflow-hidden bg-primary-100 items-center justify-center
        ${className}
      `}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className={`${sizeStyles[size].text} font-semibold text-primary-700`}>
          {initials}
        </Text>
      )}
    </View>
  );
}
