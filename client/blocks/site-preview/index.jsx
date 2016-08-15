/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import DesignSidebar from 'blocks/design-sidebar';
import DesignPreview from 'my-sites/design-preview';
import UrlPreview from 'blocks/url-preview';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import { getCurrentPreviewType } from 'state/ui/preview/selectors';

class SitePreview extends Component {
	constructor( props ) {
		super( props );
		this.getSidebarComponent = this.getPreviewComponent.bind( this );
		this.getPreviewComponent = this.getPreviewComponent.bind( this );
	}

	getSidebarComponent() {
		switch ( this.props.currentPreviewType ) {
			case 'design-preview':
				return (
					<DesignSidebar
						isVisible={ this.props.showPreview }
					/>
				);
		}
		return null;
	}

	getPreviewComponent() {
		switch ( this.props.currentPreviewType ) {
			case 'design-preview':
				return <DesignPreview showPreview={ this.props.showPreview } />;
			case 'site-preview':
				return <UrlPreview showPreview={ this.props.showPreview } />;
		}
		return null;
	}

	render() {
		const Sidebar = this.getSidebarComponent();
		const Preview = this.getPreviewComponent();
		return (
			<div className="site-preview">
				{ Sidebar }
				{ Preview }
			</div>
		);
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
