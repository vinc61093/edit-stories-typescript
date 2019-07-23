import { actionTypes } from '../../../common/constants/actionTypes';
import { memberAPI } from '../../../api/member';
import { trackPromise } from 'react-promise-tracker';
import {SelectedTemplateEntity} from '../../../model/selectedTemplate';

export const fetchTemplateByIdAction = (id: number) => (dispatch) => {
  trackPromise(
    memberAPI.fetchSelectedTemplate(id)
      .then((template) => {
        dispatch(fetchTemplateIdCompleted(template));
      })
  );
};

const fetchTemplateIdCompleted = (template: SelectedTemplateEntity[]) => ({
  type: actionTypes.FETCH_SELECTED_TEMPLATE_END,
  payload: template[0],
});
