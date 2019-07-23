import { actionTypes } from '../common/constants/actionTypes';
import { SelectedTemplateList } from '../model';

export const selectedTemplateListReducer = (state: SelectedTemplateList[] = [], action) => {
    switch (action.type) {
        case actionTypes.SELECTED_TEMPLATE_LIST:
            return action.payload
    }

    return state;
};
