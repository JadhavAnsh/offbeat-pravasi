import { View } from 'react-native';

type BrandMarkProps = {
  size?: number;
  inverted?: boolean;
};

export function BrandMark({ size = 72, inverted = false }: BrandMarkProps) {
  const ink = inverted ? '#F8F3E8' : '#173D2B';
  const sun = '#F28C5B';

  return (
    <View
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: inverted ? 'rgba(248,243,232,0.12)' : '#E6EFE8',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: size,
          backgroundColor: sun,
          right: size * 0.18,
          top: size * 0.15,
        }}
      />
      <View
        style={{
          width: size * 0.58,
          height: size * 0.36,
          borderLeftWidth: size * 0.09,
          borderTopWidth: size * 0.09,
          borderColor: ink,
          transform: [{ rotate: '45deg' }],
          borderTopLeftRadius: size * 0.05,
          marginTop: size * 0.25,
        }}
      />
    </View>
  );
}
