import { actionTypes } from '../common/constants/actionTypes';
import { Account } from '../model';

export const accountsReducer = (state: Account[] = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_ACCOUNTS_END:
      return action.accounts;
  }

  return state;
};
