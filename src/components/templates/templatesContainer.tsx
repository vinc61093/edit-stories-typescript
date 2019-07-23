import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { fetchTemplatesStartAction, fetchTemplateByIdAction, fetchAccountsStartAction, selectedTemplateListAction } from './actions';
import { MembersPage } from './page';

const mapStateToProps = (state: State) => ({
  templates: state.templates,
  template: state.template
});

const mapDispatchToProps = (dispatch) => ({
  fetchTemplates: () => dispatch(fetchTemplatesStartAction()),
  fetchAccounts: () => dispatch(fetchAccountsStartAction()),
  fetchTemplatesById: (id: number) => dispatch(fetchTemplateByIdAction(id)),
  selectedTemplateList: (list: any) => dispatch(selectedTemplateListAction(list))
});

export const TemplatesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MembersPage);
