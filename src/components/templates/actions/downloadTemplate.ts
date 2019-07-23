import { actionTypes } from '../../../common/constants/actionTypes';

export const downloadTemplateCompletedAction = (url) => (
    {
        type: actionTypes.DOWNLOAD_TEMPLATE_PREPARE,
        imageURL: url,
    }
);