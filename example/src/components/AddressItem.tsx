import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import {OkHiLocation} from '../lib/okcollect-online';
import secrets from '../secrets';

export default function AddressItem(props: {address: OkHiLocation}) {
  const imageStyle = {
    backgroundColor: '#e0e0e0',
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  };

  const {address} = props;

  const {title, directions, otherInformation, geoPoint, streetView} = address;

  let photo = address.photo;

  if (!photo && streetView && streetView.url) {
    photo = streetView.url;
  }

  if (!photo && geoPoint) {
    // eslint-disable-next-line prettier/prettier
    photo = `https://maps.googleapis.com/maps/api/staticmap?center=${geoPoint.lat},${geoPoint.lon}&zoom=15&size=300x300&markers=size:tiny%7Ccolor:blue%7C${geoPoint.lat},${geoPoint.lon}&key=${secrets.googleMapsAPIKey}`;
  }

  return (
    <Container>
      {title ? <Title>{title}</Title> : null}
      {otherInformation || directions ? (
        <Subtitle>{otherInformation || directions}</Subtitle>
      ) : null}
      <Image
        style={imageStyle}
        source={{uri: photo || 'https://via.placeholder.com/300x300'}}
        resizeMode="cover"
      />
    </Container>
  );
}

const Container = styled.View`
  padding: 15px;
`;

const Title = styled.Text`
  font-size: 16px;
  color: #333;
`;

const Subtitle = styled.Text`
  color: #616161;
  margin-top: 3px;
`;
