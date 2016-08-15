/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import WebPreview from 'components/web-preview';
import designPreview from 'my-sites/design-preview';
import urlPreview from 'blocks/url-preview';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import { getCurrentPreviewType } from 'state/ui/preview/selectors';

class SitePreview extends Component {
	constructor( props ) {
		super( props );
		this.getPreviewComponent = this.getPreviewComponent.bind( this );
	}

	getPreviewComponent() {
		switch ( this.props.currentPreviewType ) {
			case 'design-preview':
				const DesignPreview = designPreview( WebPreview );
				return <DesignPreview showPreview={ this.props.showPreview } />;
			case 'site-preview':
				const UrlPreview = urlPreview( WebPreview );
				return <UrlPreview showPreview={ this.props.showPreview } />;
		}
		return null;
	}

	render() {
		return this.getPreviewComponent();
	}
}

SitePreview.propTypes = {
	currentPreviewType: PropTypes.string,
	showPreview: PropTypes.bool,
};

SitePreview.defaultProps = {
	currentPreviewType: 'site-preview',
	showPreview: false,
};

function mapStateToProps( state ) {
	return {
		currentPreviewType: getCurrentPreviewType( state ),
		showPreview: getCurrentLayoutFocus( state ) === 'preview',
	};
}

export default connect( mapStateToProps )( SitePreview );
