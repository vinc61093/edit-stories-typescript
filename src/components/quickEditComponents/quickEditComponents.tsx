
import * as React from 'react'

interface IProps {
	onclick: (e, value: string) => void,
	template: any
}

export default class QuickEditComponents extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
	}
	public render() {
		const { onclick } = this.props;
		return (
			<div className="tabpan-top">
				<div className="row align-items-center">
					<div className="col">
						<a id="addText" className={this.props.template.sectionSelect == 'addText' ? 'tagselection active' : 'tagselection'} onClick={(e) => onclick(e, "addText")}>
							<button>
								<img src={require('../../images/text-new.svg')} width="30" />
							</button>
							<span className="tagename">TEXT</span>
						</a>
					</div>
					<div className="col">
						<a id="addShapes" className={this.props.template.sectionSelect == 'addShapes' ? 'tagselection active' : 'tagselection'} onClick={(e) => onclick(e, "addShapes")}>
							<button>
								<img src={require('../../images/shapes-new.svg')} width="30" />
							</button>
							<span className="tagename">SHAPES</span>
						</a>
					</div>
					<div className="col">
						<a id="addBackground" className={this.props.template.sectionSelect == 'addBackground' ? 'tagselection active' : 'tagselection'} onClick={(e) => onclick(e, "addBackground")}>
							<button>
								<img src={require('../../images/bg-color.svg')} width="30" />
							</button>
							<span className="tagename">BACKGROUND</span>
						</a>
					</div>
					<div className="col">
						<a id="addBackground" className={this.props.template.sectionSelect == 'addImage' ? 'tagselection active' : 'tagselection'} onClick={(e) => onclick(e, "addImage")}>
							<button>
								<img src={require('../../images/image.svg')} width="30" />
							</button>
							<span className="tagename">IMAGE</span>
						</a>
					</div>
				</div>
			</div >
		)
	}
}
