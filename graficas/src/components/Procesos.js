import React, {Component} from 'react';
//import { Line } from 'react-chartjs-2';
//import BorderWrapper from 'react-border-wrapper';
import "bootstrap/dist/css/bootstrap.min.css";

class Procesos extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }
    render(){
        this.state.data = this.props.data;
        return(
            <div>
                <div>
                <h1>Top 3, Departamentos con mas casos</h1>
                </div>
                <div>
                    <table className="table">
                        <thead className="bg-info">
                            <tr>
                                <th>Departamento</th>
                                <th>No. Casos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{this.props.pdepartamento[0]}</th>
                                <th>{this.props.pcantidad[0]}</th>
                            </tr>
                            <tr>
                                <th>{this.props.pdepartamento[1]}</th>
                                <th>{this.props.pcantidad[1]}</th>
                            </tr>
                            <tr>
                                <th>{this.props.pdepartamento[2]}</th>
                                <th>{this.props.pcantidad[2]}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

}

export default Procesos