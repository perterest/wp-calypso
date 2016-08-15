/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import WebPreview from 'components/web-preview';
import { fetchPreviewMarkup, undoCustomization, clearCustomizations } from 'state/preview/actions';
import accept from 'lib/accept';
import { updatePreviewWithChanges } from 'lib/design-preview';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import { getPreviewUrl } from 'state/ui/preview/selectors';
import { getSiteOption } from 'state/sites/selectors';
import { getPreviewMarkup, getPreviewCustomizations, isPreviewUnsaved } from 'state/preview/selectors';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';

const debug = debugFactory( 'calypso:design-preview' );

const DesignPreview = React.createClass( {
	propTypes: {
		// Any additional classNames to set on this wrapper
		className: React.PropTypes.string,
		// True to show the preview; same as WebPreview.
		showPreview: React.PropTypes.bool,
		// These are all provided by the state
		selectedSiteUrl: React.PropTypes.string,
		selectedSite: React.PropTypes.object,
		selectedSiteId: React.PropTypes.number,
		previewUrl: React.PropTypes.string,
		previewMarkup: React.PropTypes.string,
		customizations: React.PropTypes.object,
		isUnsaved: React.PropTypes.bool,
		fetchPreviewMarkup: React.PropTypes.func.isRequired,
		undoCustomization: React.PropTypes.func.isRequired,
		clearCustomizations: React.PropTypes.func.isRequired,
	},

	getDefaultProps() {
		return {
			showPreview: false,
			customizations: {},
			isUnsaved: false,
		};
	},

	componentDidMount() {
		this.loadPreview();
	},

	componentDidUpdate( prevProps ) {
		// If there is no markup or the site has changed, fetch it
		if ( ! this.props.previewMarkup || this.props.selectedSiteId !== prevProps.selectedSiteId ) {
			this.loadPreview();
		}
		// Refresh the preview when it is being shown (since this component is
		// always present but not always visible, this is similar to loading the
		// preview when mounting).
		if ( this.props.showPreview && ! prevProps.showPreview ) {
			this.loadPreview();
		}
		// If the customizations have been removed, restore the original markup
		if ( this.haveCustomizationsBeenRemoved( prevProps ) ) {
			// Force the initial markup to be restored because the DOM may have been
			// changed, and simply not applying customizations will not restore it.
			debug( 'restoring original markup' );
			this.loadPreview();
		}
		// Apply customizations
		if ( this.props.customizations && this.previewDocument ) {
			debug( 'updating preview with customizations', this.props.customizations );
			updatePreviewWithChanges( this.previewDocument, this.props.customizations );
		}
	},

	haveCustomizationsBeenRemoved( prevProps ) {
		return ( this.props.previewMarkup &&
			this.props.customizations &&
			this.props.previewMarkup === prevProps.previewMarkup &&
			prevProps.customizations &&
			Object.keys( this.props.customizations ).length === 0 &&
			Object.keys( prevProps.customizations ).length > 0
		);
	},

	loadPreview() {
		if ( ! this.props.selectedSite ) {
			return;
		}
		debug( 'loading preview with customizations', this.props.customizations );
		this.props.fetchPreviewMarkup( this.props.selectedSiteId, this.props.previewUrl, this.props.customizations );
	},

	undoCustomization() {
		this.props.undoCustomization( this.props.selectedSiteId );
	},

	onLoad( previewDocument ) {
		this.previewDocument = previewDocument;
		previewDocument.body.onclick = this.onPreviewClick;
	},

	onClosePreview() {
		if ( this.props.customizations && this.props.isUnsaved ) {
			return accept( this.translate( 'You have unsaved changes. Are you sure you want to close the preview?' ), accepted => {
				if ( accepted ) {
					this.cleanAndClosePreview();
				}
			} );
		}
		this.cleanAndClosePreview();
	},

	cleanAndClosePreview() {
		this.props.clearCustomizations( this.props.selectedSiteId );
		this.props.setLayoutFocus( 'sidebar' );
	},

	onPreviewClick( event ) {
		debug( 'click detected for element', event.target );
		if ( ! event.target.href ) {
			return;
		}
		event.preventDefault();
	},

	render() {
		if ( ! this.props.selectedSite || ! this.props.selectedSite.is_previewable ) {
			debug( 'a preview is not available for this site' );
			return null;
		}

		return (
			<WebPreview
				className={ this.props.className }
				showPreview={ this.props.showPreview }
				showExternal={ false }
				showClose={ false }
				hasSidebar={ true }
				previewMarkup={ this.props.previewMarkup }
				onClose={ this.onClosePreview }
				onLoad={ this.onLoad }
			/>
		);
	}
} );

function mapStateToProps( state ) {
	const selectedSite = getSelectedSite( state );
	const selectedSiteId = getSelectedSiteId( state );

	return {
		selectedSite,
		selectedSiteId,
		selectedSiteUrl: getSiteOption( state, selectedSiteId, 'unmapped_url' ),
		previewUrl: getPreviewUrl( state ),
		previewMarkup: getPreviewMarkup( state, selectedSiteId ),
		customizations: getPreviewCustomizations( state, selectedSiteId ),
		isUnsaved: isPreviewUnsaved( state, selectedSiteId ),
	};
}

export default connect(
	mapStateToProps,
	{ fetchPreviewMarkup, undoCustomization, clearCustomizations, setLayoutFocus }
)( DesignPreview );
