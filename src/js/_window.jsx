/*
 * Lightbox window
 */
import { Component } from 'react';
import styles from '../scss/_window.scss';

import Embed, { defaultProviders } from 'react-tiny-oembed';

const InstagramProvider = {
	provider_name: 'Instagram',
	provider_url: 'https://instagram.com',
	endpoints: [
		{
			schemes: [
				'http://instagram.com/*/p/*,',
				'http://www.instagram.com/*/p/*,',
				'https://instagram.com/*/p/*,',
				'https://www.instagram.com/*/p/*,',
				'http://instagram.com/p/*',
				'http://instagr.am/p/*',
				'http://www.instagram.com/p/*',
				'http://www.instagr.am/p/*',
				'https://instagram.com/p/*',
				'https://instagr.am/p/*',
				'https://www.instagram.com/p/*',
				'https://www.instagr.am/p/*',
				'http://instagram.com/tv/*',
				'http://instagr.am/tv/*',
				'http://www.instagram.com/tv/*',
				'http://www.instagr.am/tv/*',
				'https://instagram.com/tv/*',
				'https://instagr.am/tv/*',
				'https://www.instagram.com/tv/*',
				'https://www.instagr.am/tv/*',
			],
			url: 'https://graph.facebook.com/v9.0/instagram_oembed',
			formats: ['json'],
		},
		{
			schemes: [
				'http://instagram.com/*/p/*,',
				'http://www.instagram.com/*/p/*,',
				'https://instagram.com/*/p/*,',
				'https://www.instagram.com/*/p/*,',
				'http://instagram.com/p/*',
				'http://instagr.am/p/*',
				'http://www.instagram.com/p/*',
				'http://www.instagr.am/p/*',
				'https://instagram.com/p/*',
				'https://instagr.am/p/*',
				'https://www.instagram.com/p/*',
				'https://www.instagr.am/p/*',
				'http://instagram.com/tv/*',
				'http://instagr.am/tv/*',
				'http://www.instagram.com/tv/*',
				'http://www.instagr.am/tv/*',
				'https://instagram.com/tv/*',
				'https://instagr.am/tv/*',
				'https://www.instagram.com/tv/*',
				'https://www.instagr.am/tv/*',
			],
			url: 'https://api.instagram.com/oembed',
			formats: ['json'],
		},
	],
};

const axios = require('axios');

class MetaWindow extends Component {
	state = {
		content: '',
		type: [],
		shown: false,
		loading: false,
		error: false,
		embed: false,
		collections: [],
		current: null,
	};

	constructor(props) {
		super(props);

		const ui = this;
		ui.name = ui.constructor.name;
		console.log(`${ui.name}: init`);

		ui.axios = axios;

		document.querySelectorAll('[data-toggle="lightbox"]').forEach((el) => {
			// collections
			const gallery = el.getAttribute('data-gallery');
			if (gallery) {
				ui.state.collections[gallery] = [];
				document
					.querySelectorAll(
						`[data-toggle="lightbox"][data-gallery="${gallery}"]`,
					)
					.forEach((el) => {
						ui.state.collections[gallery].push(el);
					});
			}

			// click handler
			el.addEventListener('click', (e) => {
				e.preventDefault();

				const el = e.currentTarget;
				const link =
					el.getAttribute('href') || el.getAttribute('data-href');

				const embed = el.getAttribute('data-embed');
				ui.state.current = el;

				if (embed) {
					ui.embed(link);
				} else {
					ui.load(link);
				}
			});
		});
	}

	_currIndex = () => {
		const ui = this;
		const el = ui.state.current;
		const gallery = el.getAttribute('data-gallery');

		return ui.state.collections[gallery].indexOf(el);
	};

	next = () => {
		const ui = this;
		const el = ui.state.current;
		const gallery = el.getAttribute('data-gallery');

		let i = ui._currIndex();
		if (i < ui.state.collections[gallery].length - 1) {
			i++;
		} else {
			i = 0;
		}

		ui.state.collections[gallery][i].click();
	};

	prev = () => {
		const ui = this;
		const el = ui.state.current;
		const gallery = el.getAttribute('data-gallery');

		let i = ui._currIndex();
		if (i > 0) {
			i--;
		} else {
			i = ui.state.collections[gallery].length - 1;
		}

		ui.state.collections[gallery][i].click();
	};

	reset = () => {
		const ui = this;

		ui.setState({
			content: '',
			type: [],
			shown: false,
			loading: false,
			error: false,
			embed: false,
		});
	};

	embed = (link) => {
		const ui = this;
		console.log(`${ui.name}: embed`);

		ui.reset();
		ui.setState({
			embed: link,
			loading: false,
			type: ['embed', 'video'],
		});
		ui.show();
	};

	load = (link) => {
		const ui = this;
		const axios = ui.axios;

		ui.reset();
		ui.setState({ loading: true });
		ui.show();

		axios
			.get(link, {
				responseType: 'arraybuffer',
			})
			.then((resp) => {
				// handle success
				console.log(
					`${ui.name}: response content-type: ${resp.headers['content-type']}`,
				);

				switch (resp.headers['content-type']) {
					case 'image/jpeg':
					case 'image/png':
					case 'image/svg+xml':
					case 'image/bmp':
					case 'image/gif':
					case 'image/tiff':
					case 'image/webp':
					// irregular types:
					case 'image/jpg':
					case 'image/svg':
						ui.setContent(
							`<img src="data:${
								resp.headers['content-type']
							};base64,${ui._imageEncode(resp.data)}" />`,
							'image',
						);
						break;
					case 'application/json':
					case 'application/ld+json':
					// irregular types:
					case 'application/json; charset=UTF-8':
						const json = JSON.parse(ui._abToString(resp.data));
						ui.setContent(`${json['Content']}`, 'text html json');

						break;
					case 'text/html':
					case 'application/xhtml+xml':
					case 'text/plain':
					// irregular types:
					case 'text/html; charset=UTF-8':
					case 'application/xhtml+xml; charset=UTF-8':
					case 'text/plain; charset=UTF-8':
						ui.setContent(
							ui._abToString(resp.data),
							'text html pajax',
						);
						break;
					default:
						console.warn(
							`${ui.name}: Unknown response content-type!`,
						);
						break;
				}
			})
			.catch((error) => {
				console.error(error);

				let msg = '';

				if (error.response) {
					switch (error.response.status) {
						case 404:
							msg = 'Not Found.';
							break;
						case 500:
							msg = 'Server issue, please try again latter.';
							break;
						default:
							msg = 'Something went wrong.';
							break;
					}
				} else if (error.request) {
					msg = 'No response received';
				} else {
					console.warn('Error', error.message);
				}

				ui.setState({ error: msg });
			})
			.then(() => {
				ui.setState({ loading: false });
			});
	};

	_abToString = (arrayBuffer) => {
		return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
	};

	_imageEncode = (arrayBuffer) => {
		let u8 = new Uint8Array(arrayBuffer);
		let b64encoded = btoa(
			[].reduce.call(
				new Uint8Array(arrayBuffer),
				function (p, c) {
					return p + String.fromCharCode(c);
				},
				'',
			),
		);

		return b64encoded;
	};

	setContent = (html, type) => {
		const ui = this;
		console.log(`${ui.name}: setContent`);

		let typeArr = type ? type : ['html', 'text'];
		if (!Array.isArray(typeArr)) {
			typeArr = type.split(' ');
		}

		ui.setState({ content: html, type: typeArr });
	};

	show = () => {
		const ui = this;
		console.log(`${ui.name}: show`);

		ui.setState({ shown: true });
	};

	hide = () => {
		const ui = this;

		console.log(`${ui.name}: hide`);
		ui.setState({ shown: false });
	};

	getHtml = () => {
		const ui = this;
		return { __html: ui.state.content };
	};

	render() {
		const ui = this;
		const name = ui.name;

		let navs = null;
		const el = ui.state.current;
		if (el) {
			const gallery = el.getAttribute('data-gallery');
			if (gallery && ui.state.collections[gallery].length > 1) {
				navs = (
					<nav className="meta-navs">
						<button
							className="meta-nav meta-nav-arrow meta-nav-arrow__prev a"
							onClick={ui.prev}
						>
							<i className="fa fas fa-chevron-left"></i>
							<span className="sr-only">Previous</span>
						</button>
						<button
							className="meta-nav meta-nav-arrow meta-nav-arrow__next a"
							onClick={ui.next}
						>
							<i className="fa fas fa-chevron-right"></i>
							<span className="sr-only">Next</span>
						</button>
					</nav>
				);
			}
		}

		const content = ui.state.embed ? (
			<section className="meta-wrap typography">
				<Embed
					url={ui.state.embed}
					providers={[...defaultProviders, InstagramProvider]}
					LoadingFallbackElement=<div className="meta-spinner_embed">
						... Loading ...
					</div>
				/>
			</section>
		) : (
			<section
				className="meta-wrap typography"
				dangerouslySetInnerHTML={ui.getHtml()}
			></section>
		);

		const className = `meta-${name} meta-${name}__${ui.state.type.join(
			` meta-${name}__`,
		)}`;

		const overlayClassName = `meta-${name}-overlay${
			ui.state.shown ? ` meta-${name}-overlay__open` : ''
		}${ui.state.loading ? ` meta-${name}-overlay__loading` : ''}${
			ui.state.error ? ` meta-${name}-overlay__error` : ''
		}`;

		return (
			<div className={className}>
				<div className={overlayClassName}>
					<article className="meta-content">
						{navs}
						<button
							className="meta-nav meta-close a"
							onClick={ui.hide}
						>
							<i className="fa fas fa-times"></i>
							<span className="sr-only">Close</span>
						</button>

						<div className="meta-spinner">... Loading ...</div>
						<div className="meta-error alert alert-danger">
							{ui.state.error}
						</div>

						{content}
					</article>
				</div>
			</div>
		);
	}
}

export default MetaWindow;
