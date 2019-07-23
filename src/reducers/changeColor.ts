import { actionTypes } from '../common/constants/actionTypes';

const initialState = {
    color: ""
}

export const changeColorReducer = (state = {}, action) => {
    // switch (action.type) {
    //     case actionTypes.CHANGE_COLOR:
    //         return handleChangeColorCompleted(state, action.payload);
    // }
    return state;
};

const handleChangeColorCompleted = (state: any, payload: any) => {
    return {...state, color: payload};
};
