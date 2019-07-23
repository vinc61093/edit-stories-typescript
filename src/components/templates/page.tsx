import * as React from 'react';
import SideDrawer from '../sideDrawer/SideDrawer';
import CanvasSection from '../canvasSection/CanvasSection';
import AccountPicker from '../accountPicker/AccountPicker';

import "bootstrap/dist/css/bootstrap.css";
import './page.css'

interface Props {
  template: any;
  templates: any;
  fetchTemplates(): void;
  fetchAccounts(): void;
  fetchTemplatesById: (id: number) => void;
  selectedTemplateList: (list: any) => void;
}

export class MembersPage extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
    this.state = {
    };
  }

  public componentDidMount() {
    this.props.fetchTemplates();
    this.props.fetchAccounts();
  }

  public handleClick(data: any) {
    let listArray = []
    this.props.templates.forEach(element => {
      if (element.id == data) {
        listArray.push(element)
        this.props.selectedTemplateList(listArray)
      }
    });
    this.props.fetchTemplatesById(data)
  }

  public render() {
    return (
      <div className="main-content">
        <div className="row mr-0 ml-0">
          <SideDrawer onClick={this.handleClick} />
          <CanvasSection />
        </div>
        {
          this.props.template.showAccountPicker ? <AccountPicker /> : null
        }
      </div>
    );
  }
};
