import { actionTypes } from '../../../common/constants/actionTypes';
import { Account } from '../../../model';

export const fetchAccountsStartAction = () => (
  {
    type: actionTypes.FETCH_ACCOUNTS_START,
  }
);

export const fetchAccountsCompletedAction = (accounts: Account[]) => (
  {
    type: actionTypes.FETCH_ACCOUNTS_END,
    accounts: accounts
  }
);