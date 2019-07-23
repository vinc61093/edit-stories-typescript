import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { sendToPlanoly } from './actions/send';
import { Account } from '../../model/account';

import './account-picker.css';
import { changeOjbect } from '../sideDrawer/actions';

interface IProps {
  accounts: Account[];
  template: any;
  sendToPlanoly: (accountId: number) => void;
  changeOjbect: (value: any) => void;
}

interface IState {
  currentAccount: Account;
}

class AccountPicker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { currentAccount: null }
  }

  cancel() {    
    this.props.template.showAccountPicker = false;
    this.props.changeOjbect(this.props.template);
  }

  check(account) {
    this.setState({
      currentAccount: account
    });
  }

  send() {
    if (!this.state.currentAccount) {
      return;
    }
    
    this.props.template.sendToPlanoly = true;
    this.props.template.currentAccount = this.state.currentAccount;
    this.props.template.showSpinner = true;
    this.props.template.showAccountPicker = false;
    this.props.changeOjbect(this.props.template);    
  }

  public render() {
    const { currentAccount } = this.state;
    return (
      <div className="account-list">
        <div className="account-container">
          <div className="header">Select an Account</div>
          <ul>
            {
              this.props.accounts.map(account => {
                return (
                  <li onClick={this.check.bind(this, account)} key={account.id} className={currentAccount && currentAccount.id === account.id ? 'selected' : ''}>
                    <span className="img"><img src={account.pic} /></span>
                    <span className="username">{account.username}</span>
                    {
                      currentAccount && currentAccount.id === account.id ? (<i className="fa fa-check"></i>) : null
                    }                    
                  </li>
                )
              })
            }
          </ul>
          <div className="footer">
            <a className="btn-cancel button" onClick={this.cancel.bind(this)}>Cancel</a>
            <a className={currentAccount ? 'btn-send button' : 'btn-send button disabled'} onClick={this.send.bind(this)}>Send</a>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: State) => ({
  accounts: state.accounts,
  template: state.template
});

const mapDispatchToProps = (dispatch) => ({
  sendToPlanoly: (id: number) => dispatch(sendToPlanoly(id)),
  changeOjbect: (data: string) => dispatch(changeOjbect(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountPicker);