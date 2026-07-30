import { nanoid } from "nanoid";

const DEVICE_ID_KEY = "device_id";

export const getDeviceId = (): string => {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if(!deviceId) {
        deviceId = nanoid();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
};