/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import DesignPreview from 'my-sites/design-preview';
import DesignSidebar from 'blocks/design-sidebar';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import { getCurrentPreviewType } from 'state/ui/preview/selectors';

class SitePreview extends Component {
	constructor( props ) {
		super( props );
	}

	getSidebarComponent( { currentPreviewType, showPreview } ) {
		switch ( currentPreviewType ) {
			case 'paladin':
				return (
					<DesignSidebar
						isVisible={ showPreview }
					/>
				);
		}
		return null;
	}

	getPreviewComponent( { currentPreviewType, showPreview } ) {
		switch ( currentPreviewType ) {
			case 'paladin':
				return (
					<DesignPreview
						showSidebar={ true }
						showPreview={ showPreview }
					/>
				);
			case 'site-preview':
				return (
					<DesignPreview
						showPreview={ showPreview }
					/>
				);
		}
		return null;
	}

	render() {
		const Sidebar = this.getSidebarComponent( this.props );
		const Preview = this.getPreviewComponent( this.props );
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
