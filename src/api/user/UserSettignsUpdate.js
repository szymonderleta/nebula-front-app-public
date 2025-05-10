import {APP_REQUEST_URL} from '../../data/Credentials';
import PUTRequest from "../method/PUTRequest";

async function UserSettingsUpdate(generalSettings, soundSettings) {
    const url = APP_REQUEST_URL + '/users/settings';
    const formData = await createFormData(generalSettings, soundSettings);
    return await PUTRequest(url, formData);
}

async function createFormData(generalSettings, soundSettings) {
    return {
        userId: generalSettings.userId,
        general: {
            userId: generalSettings.userId,
            theme: {
                id: generalSettings.theme.id,
                name: generalSettings.theme.name,
            },
        },
        sound: {
            userId: soundSettings.userId,
            muted: soundSettings.muted,
            battleCry: soundSettings.battleCry,
            volumeMaster: soundSettings.volumeMaster,
            volumeMusic: soundSettings.volumeMusic,
            volumeEffects: soundSettings.volumeEffects,
            volumeVoices: soundSettings.volumeVoices,
        }
    };
}

export default UserSettingsUpdate;
