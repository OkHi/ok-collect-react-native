import axios from 'axios';
import RNBackgroundGeofencing, {
  RNGeofenceWebhook,
  RNGeofenceNotification,
  RNGeofence,
} from '@okhi/react-native-background-geofencing';
import OkHiCore, {
  OkHiException,
  OkHiErrorCodes,
  OkHiErrorMessages,
  OkHiAccessScope,
  OkHiMode,
} from '@okhi/core';
import manifest from './manifest.json';

interface OkVerifyGeofenceConfiguration {
  radius: number;
  expiration: number;
  notification_responsiveness: number;
  set_initial_triggers: boolean;
  register_on_device_restart: boolean;
  set_dwell_transition_type: boolean;
  loitering_delay: number;
}

interface OkVerifyGeofenceConfig {
  radius: number;
  expiration: number;
  notificationResponsiveness: number;
  loiteringDelay: number;
  setDwellTransitionType: boolean;
  registerOnDeviceRestart: boolean;
  setInitialTriggers: boolean;
}

const DEV_TRANSIT_URL = 'https://dev-api.okhi.io/v5/users/transits';
const SANDBOX_TRANSIT_URL = 'https://sandbox-api.okhi.io/v5/users/transits';
const PROD_TRANSIT_URL = 'https://api.okhi.io/v5/users/transits';

const DEV_CONFIG_URL = 'https://dev-api.okhi.io/v5/verify/config';
const SANDBOX_CONFIG_URL = 'https://sandbox-api.okhi.io/v5/verify/config';
const PROD_CONFIG_URL = 'https://api.okhi.io/v5/verify/config';
const scopes: Array<OkHiAccessScope> = ['verify'];

const DEFAULT_GEOFENCE_CONFIG: OkVerifyGeofenceConfig = {
  radius: 300,
  expiration: -1,
  notificationResponsiveness: 300000,
  setInitialTriggers: true,
  registerOnDeviceRestart: true,
  setDwellTransitionType: true,
  loiteringDelay: 1800000,
};

export const start = async (
  core: OkHiCore,
  user: { phone?: string; userId?: string },
  location: { id: string; geoPoint: { lat: number; lon: number } },
  notification: RNGeofenceNotification
) => {
  let TRANSIT_URL: string;
  let CONFIG_URL: string;
  let webhookConfiguration: RNGeofenceWebhook;
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
      if (!token && user.userId) {
        token = await core.user.anonymousSignInWithUserId(user.userId, scopes);
      }
      if (!token && user.phone) {
        token = await core.user.anonymousSignWithPhoneNumber(
          user.phone,
          scopes
        );
      }
      webhookConfiguration = {
        url: TRANSIT_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        meta: {
          lib: {
            name: 'okVerifyMobileReactNative',
            version: manifest.version,
          },
        },
      };
      await RNBackgroundGeofencing.configure({
        notification: notification || null,
        webhook: webhookConfiguration,
      });
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

const getGeofenceConfiguration = async (
  core: OkHiCore,
  URL: string
): Promise<OkVerifyGeofenceConfig> => {
  try {
    const { data } = await axios.get<OkVerifyGeofenceConfiguration>(URL, {
      headers: {
        Authorization: `Token ${core.getAccessToken()}`,
      },
      timeout: 30000,
    });
    const {
      radius,
      expiration,
      notification_responsiveness,
      loitering_delay,
      set_dwell_transition_type,
      register_on_device_restart,
      set_initial_triggers,
    } = data;
    return {
      radius,
      expiration,
      notificationResponsiveness: notification_responsiveness,
      loiteringDelay: loitering_delay,
      setDwellTransitionType: set_dwell_transition_type,
      registerOnDeviceRestart: register_on_device_restart,
      setInitialTriggers: set_initial_triggers,
    };
  } catch (error) {
    return DEFAULT_GEOFENCE_CONFIG;
  }
};
