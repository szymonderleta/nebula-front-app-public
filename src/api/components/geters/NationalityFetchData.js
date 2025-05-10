import {APP_REQUEST_URL} from '../../../data/Credentials';
import '../../../resource/style/FormDefault.css';
import useFetchSortedData from "../UseFetchSortedData";

function NationalityFetchData({onChange}) {
    const url = APP_REQUEST_URL + '/nationalities';
    const {data, selected, setSelected} = useFetchSortedData(
        url,
        (a, b) => a.name.localeCompare(b.name)
    );

    const handleSelectChange = (selectedId) => {
        setSelected(selectedId);
        onChange(selectedId);
    };

    return (
        <div className={'div-component'}>
            <label className={'label-default'}>
                Nationality:
                <select
                    value={selected}
                    onChange={e => handleSelectChange(e.target.value)}
                    className={'input-default'}>
                    <option value="">Select</option>
                    {data.map(nationality => (
                        <option key={nationality.id} value={nationality.id}>
                            {nationality.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default NationalityFetchData;
