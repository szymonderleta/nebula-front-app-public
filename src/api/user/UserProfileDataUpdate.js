import {APP_REQUEST_URL} from '../../data/Credentials';
import DateTimeUtil from "../../util/DateTimeUtil";
import PATCHRequest from "../method/PATCHRequest";

async function UserProfileDataUpdate(profileData) {
    const url = APP_REQUEST_URL + '/users/profile';
    const formData = await createFormData(profileData);
    return await PATCHRequest(url, formData);
}

async function createFormData(profileData) {
    let timestampBirthdate = DateTimeUtil.transformToTimestamp(profileData.birthDate);
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
