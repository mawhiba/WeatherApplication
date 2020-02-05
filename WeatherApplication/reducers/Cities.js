import { AddCity, DeleteCity, cityInfo } from '../constants';

function Cities(state = [], action) {
    switch (action.type) {
        case AddCity:
            return [...state, action.city];
        case DeleteCity:
            // let filteredCities = state.filter((city, index) => index != action.cityIndex)
            // state = filteredCities
            // return state;
        case cityInfo:
            console.log(Item)
            return state;
        default:
            return state
    }
}

export default Cities;