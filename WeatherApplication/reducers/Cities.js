import { AddCity, DeleteCity, cityInfo } from '../constants';

function Cities(state = [], action) {
    switch (action.type) {
        case AddCity:
            return [...state, {
                cityName: action.cityInfo.city,
                cityTemp: action.cityInfo.temp
            }];
        case DeleteCity:
            let filteredCities = state.filter((city, index) => city.cityName != action.city)
            state = filteredCities
            return state;
        case cityInfo:
            console.log(Item)
            return state;
        default:
            return state
    }
}

export default Cities;