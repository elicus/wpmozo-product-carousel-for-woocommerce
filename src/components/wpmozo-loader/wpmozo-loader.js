const { Component } = wp.element;
const { compose } = wp.compose;
const { hooks } = wp;

class WpmozoLoader extends Component{

	render () {

		const { column, margin } = this.props;
		let loader = (
			<div className="ph-item" style={{marginRight: margin}}>
                <div className="ph-col-12">
                    <div className="ph-picture"></div>
                    <div className="ph-row">
                        <div className="ph-col-8"></div>
                        <div className="ph-col-4 empty"></div>
                        <div className="ph-col-4"></div>
                        <div className="ph-col-8 empty"></div>
                        <div className="ph-col-12 empty"></div>
                        <div className="ph-col-6 big"></div>
                        <div className="ph-col-6 empty"></div>
                    </div>
                </div>
            </div>
		),
        html = [];

	    for (var i = 0; i < column; i++) {
	        html.push(loader);
	    }
	            
	    return html;

	}
}

export default compose()( WpmozoLoader );