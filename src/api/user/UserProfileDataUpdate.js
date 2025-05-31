import {APP_REQUEST_URL} from '../../data/Credentials';
import DateTimeUtils from "../../util/DateTimeUtils";
import {PATCHRequest} from "../handler/handlerTokenRefresh";

async function UserProfileDataUpdate(profileData) {
    const url = APP_REQUEST_URL + '/users/profile';
    const formData = await createFormData(profileData);
    return await PATCHRequest(url, formData);
}

async function createFormData(profileData) {
    let timestampBirthdate = DateTimeUtils.transformToTimestamp(profileData.birthDate);
    return {
        userId: profileData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        birthdate: timestampBirthdate,
        nationalityId: profileData.nationality.id,
        genderId: profileData.gender.id
    };
}

export default UserProfileDataUpdate;
