/*
 * Lightbox window
 */
import { Component } from 'react';
import '../scss/app.scss';

class MetaWindow extends Component {
	state = {
		content: '',
		shown: false,
	};

	constructor(props) {
		super(props);
		console.log(`${this.constructor.name}: init`);
	}

	setContent = (html) => {
		console.log(`${this.constructor.name}: setContent`);
		this.setState({ content: html });
		this.show();
	};

	show = () => {
		this.setState({ shown: true });
	};

	hide = () => {
		this.setState({ shown: false });
	};

	getHtml = () => {
		return { __html: this.state.content };
	};

	render() {
		const className =
			'meta-lightbox-overlay meta-lightbox-theme-default meta-lightbox-effect-fade ' +
			(this.state.shown ? 'meta-lightbox-open' : '');

		return (
			<div className={className}>
				<div
					className="meta-lightbox-close fas fa fa-times a"
					onClick={this.hide}
				>
					<span className="sr-only">Close</span>
				</div>
				<div className="meta-lightbox-content">
					<div
						className="meta-lightbox-wrap"
						dangerouslySetInnerHTML={this.getHtml()}
					></div>
				</div>
			</div>
		);
	}
}

export default MetaWindow;
