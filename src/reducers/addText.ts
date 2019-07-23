import { actionTypes } from '../common/constants/actionTypes';

export const addTextReducer = (state = {}, action) => {
    // switch (action.type) {
    //     case actionTypes.ADD_TEXT:
    //         return handleAddText(state, action.payload);
    // }
    return state;
};

const handleAddText = (state: any, payload: any) => {
    return {...state, text: payload};
};