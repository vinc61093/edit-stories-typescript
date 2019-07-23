
import * as React from 'react'
import { State } from '../../reducers';
import { connect } from 'react-redux';

const PlusPng = require('../../images/Plus_sign.jpg');
import './activetemplateselector.css'

interface IProps {
  selectedTemplateList: any;
  onClick(value: any): any;
}

class ActiveTemplateSelector extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('fabricCanvas2222')
  }

  render() {
    var rows = [];
    {
      Object.keys(this.props.selectedTemplateList).length > 0 ? this.props.selectedTemplateList.forEach(element => {
        rows.push(<img className="img-style-list" key={element.id} src={element.templateThumb} onClick={() => this.props.onClick(element.id)} />);
      }) : null
    }
    return (
      <div>{Object.keys(this.props.selectedTemplateList).length > 0 ? < div >{rows} <img className="img-style-list" src={PlusPng} /></div> : null}</div>
    );
  }
}

const mapStateToProps = (state: State) => ({
  selectedTemplateList: state.selectedTemplateList
});

export default connect(mapStateToProps)(ActiveTemplateSelector);