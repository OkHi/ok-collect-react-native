export interface OkHiLocation {
  id?: string;
  placeId?: string;
  plusCode?: string;
  propertyName?: string;
  streetName?: string;
  title?: string;
  subtitle?: string;
  directions?: string;
  otherInformation?: string;
  url?: string;
  createdAt?: string;
  photo?: string;
  geoPoint?: {
    lat: number;
    lon: number;
  };
  streetView?: {
    panoId: string;
    url: string;
  };
}
