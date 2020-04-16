import axios from 'axios';
import RNBackgroundGeofencing, {
  configureWebhook,
  RNGeofenceWebhookConfig,
  RNGeofence,
} from 'react-native-background-geofencing';
import OkHiCore, {
  OkHiException,
  OkHiErrorCodes,
  OkHiErrorMessages,
  OkHiAccessScope,
  OkHiMode,
} from '@okhi/core';

interface OkVerifyGeofenceConfiguration {
  radius: number;
  expiration: number;
  notification_responsiveness: number;
  set_initial_triggers: boolean;
  register_on_device_restart: boolean;
  set_dwell_transition_type: boolean;
  loitering_delay: number;
}

const DEV_TRANSIT_URL = 'https://dev-api.okhi.io/v5/users/transits';
const SANDBOX_TRANSIT_URL = 'https://sandbox-api.okhi.io/v5/users/transits';
const PROD_TRANSIT_URL = 'https://api.okhi.io/v5/users/transits';

const DEV_CONFIG_URL = 'https://dev-api.okhi.io/v5/verify/config';
const SANDBOX_CONFIG_URL = 'https://sandbox-api.okhi.io/v5/verify/config';
const PROD_CONFIG_URL = 'https://api.okhi.io/v5/verify/config';
const scopes: Array<OkHiAccessScope> = ['verify'];

export const start = async (
  core: OkHiCore,
  user: {phone?: string; userId?: string},
  location: {id: string; geoPoint: {lat: number; lon: number}},
) => {
  let TRANSIT_URL: string;
  let CONFIG_URL: string;
  let webhookConfiguration: RNGeofenceWebhookConfig;
  let token: string = '';
  try {
    if (!core) {
      throw new OkHiException({
        code: OkHiErrorCodes.invalid_configuration,
        message: OkHiErrorMessages.invalid_configuration,
      });
    }
    if (!user.phone && !user.userId) {
      throw new OkHiException({
        code: OkHiErrorCodes.invalid_configuration,
        message: OkHiErrorMessages.invalid_configuration,
      });
    }
    if (
      !location.id ||
      !location.geoPoint ||
      !location.geoPoint.lat ||
      !location.geoPoint.lon
    ) {
      throw new OkHiException({
        code: OkHiErrorCodes.invalid_configuration,
        message: OkHiErrorMessages.invalid_configuration,
      });
    }
    if (core.getContext().mode === OkHiMode.DEV) {
      TRANSIT_URL = DEV_TRANSIT_URL;
      CONFIG_URL = DEV_CONFIG_URL;
    } else if (core.getContext().mode === OkHiMode.PROD) {
      TRANSIT_URL = PROD_TRANSIT_URL;
      CONFIG_URL = PROD_CONFIG_URL;
    } else {
      TRANSIT_URL = SANDBOX_TRANSIT_URL;
      CONFIG_URL = SANDBOX_CONFIG_URL;
    }
    if (!token) {
      console.log('webhook not configured..starting configuration');
      if (!token && user.userId) {
        token = await core.user.anonymousSignInWithUserId(user.userId, scopes);
      }
      if (!token && user.phone) {
        token = await core.user.anonymousSignWithPhoneNumber(
          user.phone,
          scopes,
        );
      }
      webhookConfiguration = {
        url: TRANSIT_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await configureWebhook(webhookConfiguration);
      console.log('webhook configured!');
    }
    const geofenceConfig = await getGeofenceConfiguration(core, CONFIG_URL);
    const geofence: RNGeofence = {
      ...geofenceConfig,
      id: location.id,
      lat: location.geoPoint.lat,
      lng: location.geoPoint.lon,
    };
    return await RNBackgroundGeofencing.add(geofence);
  } catch (error) {
    if (error.code && error.message) {
      throw new OkHiException({
        code: error.code,
        message: error.message,
      });
    }
    throw new OkHiException({
      code: OkHiErrorCodes.unknown_error,
      message: OkHiErrorMessages.unknown_error,
    });
  }
};
export const stop = async (locationId: string) => {
  try {
    RNBackgroundGeofencing.remove(locationId);
    return locationId;
  } catch (error) {
    if (error.code && error.message) {
      throw new OkHiException({
        code: error.code,
        message: error.message,
      });
    }
    throw new OkHiException({
      code: OkHiErrorCodes.unknown_error,
      message: OkHiErrorMessages.unknown_error,
    });
  }
};
const getGeofenceConfiguration = async (core: OkHiCore, URL: string) => {
  try {
    const {data} = await axios.get<OkVerifyGeofenceConfiguration>(URL, {
      headers: {
        Authorization: `Token ${core.getAccessToken()}`,
      },
    });
    return data;
  } catch (error) {
    if (!error.response || !error.response.status) {
      throw new OkHiException({
        code: OkHiErrorCodes.network_error,
        message: OkHiErrorMessages.network_error,
      });
    } else {
      throw new OkHiException({
        code: OkHiErrorCodes.unauthorized,
        message: OkHiErrorCodes.unauthorized,
      });
    }
  }
};