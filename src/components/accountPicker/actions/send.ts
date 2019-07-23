import { actionTypes } from '../../../common/constants/actionTypes';

export const sendToPlanoly = (accountId: number) => ({
  type: actionTypes.SEND_TO_PLANOLY,
  id: accountId
});
  
export const sendToPlanolyCompleted = (json: any) => ({
  type: actionTypes.SEND_TO_PLANOLY_COMPLETED,
  json: json
});