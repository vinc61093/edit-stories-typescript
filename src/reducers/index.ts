import { combineReducers } from 'redux';
import { TemplateEntity, Account, SelectedTemplateList } from '../model';
import { templatesReducer } from './templates';
import { templateReducer } from './template';
import { changeColorReducer } from './changeColor';
import { addTextReducer } from './addText';
import { accountsReducer } from './accounts';
import { selectedTemplateListReducer } from './selectedTemplateList';

export interface State {
  templates: TemplateEntity[];
  template: any;
  color: any;
  text: any;
  currentAccount: Account;
  accounts: Account[];
  selectedTemplateList: any;
};

export const state = combineReducers<State>({
  templates: templatesReducer,
  template: templateReducer,
  color: changeColorReducer,
  text: addTextReducer,
  accounts: accountsReducer,
  currentAccount: null,
  selectedTemplateList: selectedTemplateListReducer
});
