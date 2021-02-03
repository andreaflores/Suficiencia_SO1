import React, {Component} from 'react';
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints =[];


class Rango extends Component{
    

    render(){
        const options = {
			theme: "light2",
			title: {
				text: "Cantidad de Casos por Rango de Edad"
			},
			data: [{
				type: "column",
				dataPoints: dataPoints
			}]
		}
        return (
            <div>
                <CanvasJSChart options = {options} 
                     onRef={ref => this.chart = ref}
                />
                {}
            </div>
            );
    }

    componentDidMount(){
		var chart = this.chart;
		fetch('http://localhost:3001/edad')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				dataPoints.push({
					label: data[i].rango_edades,
					y: data[i].cantidad
				});
			}
			chart.render();
		});
	}

}

export default Rango