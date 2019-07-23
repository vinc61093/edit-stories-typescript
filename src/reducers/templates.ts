import { actionTypes } from '../common/constants/actionTypes';
import { TemplateEntity } from '../model';

export const templatesReducer = (state: TemplateEntity[] = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_TEMPLATE_REQUEST_COMPLETED:
      return handleFetchTemplatesStartedSaga(state, action.payload);
  }

  return state;
};

const handleFetchTemplatesStartedSaga = (state: TemplateEntity[], payload: TemplateEntity[]) => {
  return payload;
};
