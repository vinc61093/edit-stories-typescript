import { actionTypes } from '../../../common/constants/actionTypes';
import { SelectedTemplateList } from '../../../model';

export const selectedTemplateListAction = (SelectedTemplateList: SelectedTemplateList[]) => ({
  type: actionTypes.SELECTED_TEMPLATE_LIST,
  payload: SelectedTemplateList
}
);