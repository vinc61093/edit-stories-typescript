
import * as React from 'react'
import { State } from '../../reducers';
import { connect } from 'react-redux';

import './templatesection.css'

interface IProps {
	templates: any;
	onClick(value: any): any;
}

class TemplateSection extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		var rows = [];
		{this.props.templates ? this.props.templates.forEach(element => {
			rows.push(<img className="img-style" key={element.id} src={element.templateThumb} onClick={() => this.props.onClick(element.id)} />);
		}) : null }
		return (
			<div>{rows}</div>
		);
	}
}

const mapStateToProps = (state: State) => ({
	templates: state.templates
});

export default connect(mapStateToProps)(TemplateSection);