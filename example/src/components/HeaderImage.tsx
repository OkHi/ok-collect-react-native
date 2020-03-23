import React from 'react';
import {Image} from 'react-native';

export default function HeaderImage() {
  const imageStyles = {width: 70, height: 50};
  return (
    <Image
      source={{
        uri:
          'https://storage.googleapis.com/okhi-cdn/images/logos/okhi-logo-white.png',
      }}
      style={imageStyles}
      resizeMode="contain"
    />
  );
}
