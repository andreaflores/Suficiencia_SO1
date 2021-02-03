import React, {Component} from 'react';
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints =[];


class Graficas extends Component{
    

    render(){
        const options = {
			theme: "light2",
			title: {
				text: "Cantidad de Casos por Departamento"
			},
			data: [{
				type: "pie",
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
		fetch('http://localhost:3001/departamento')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				dataPoints.push({
					label: data[i].departamento,
					y: data[i].cantidad
				});
			}
			chart.render();
		});
	}

}

export default Graficas