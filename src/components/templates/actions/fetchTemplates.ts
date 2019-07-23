import { actionTypes } from '../../../common/constants/actionTypes';
import { TemplateEntity } from '../../../model';

export const fetchTemplatesStartAction = () => (
  {
    type: actionTypes.FETCH_TEMPLATE_REQUEST_START,
  }
);

export const fetchTemplatesCompletedAction = (members: TemplateEntity[]) => (
  {
    type: actionTypes.FETCH_TEMPLATE_REQUEST_COMPLETED,
    payload: members,
  }
);

