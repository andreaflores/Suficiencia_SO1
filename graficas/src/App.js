import React, {Component} from 'react';
import Graficas from './components/Graficas';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import Procesos from './components/Procesos';
import Rango from './components/Rango';

export default class App extends Component{

  constructor(props){
      super(props);
      this.urlG = "35.226.217.95";
      this.state = {
            arregloDepartamentos : [],
            arregloCantidad : [],
            pdepartamento: [],
            pcantidad: []
      }
      this.PDepartamento = [];
      this.PCantidad = [];
      this.ArregloDepartamentos = [];
      this.ArregloCantidad = [];
  }

  async USAGE_RAM(){
      var url = "http://".concat(this.urlG,":3001","/ram");
      fetch(url)
      .then(res => res.json())
      .then((data) => {
          this.RamTotal = data.Total;
          this.RamLibre = data.Total-data.Libre;
          this.RamUsada = data.Usada;
      })
      /*var arregloRamA1 = this.state.arregloRamA;
      arregloRamA1[4] = arregloRamA1[3];
      arregloRamA1[3] = arregloRamA1[2];
      arregloRamA1[2] = arregloRamA1[1];
      arregloRamA1[1] = arregloRamA1[0];
      arregloRamA1[0] = parseInt(this.RamUsada, 10);
      var result = arregloRamA1.map((arregloRamA1)=>arregloRamA1*1);
      this.setState({arregloRamA:result, ramA: arregloRamA1[0]}); 
      this.setState({arregloRamA:result, ramB: this.RamTotal}); 
      this.setState({arregloRamA:result, ramC: this.RamLibre});*/
  }

  async USAGE_DEPARTAMENTOS(){
    var url = "http://".concat(this.urlG,":3001","/departamento")
    fetch(url)
      .then(res => res.json())
      .then((data) => {
          //console.log(data);
          this.arregloDepartamentos = data;
          //this.setDepartamentos(data);
      })
      //this.setState({arregloDepartamentos: this.ArregloDepartamentos});
      //this.setState({arregloCantidad: this.ArregloCantidad});
      this.setState({arregloDepartamentos: this.arregloDepartamentos}) 
}

    async USAGE_TOPDEPARTAMENTOS(){
        var url = "http://".concat(this.urlG,":3001","/topDepartamentos")
        fetch(url)
        .then(res => res.json())
        .then((data) => {
            this.getData(data);
        })
        this.setState({pdepartamento: this.PDepartamento});
        this.setState({pcantidad: this.PCantidad});
    }

  componentWillMount(){
      setInterval(() => {
          //this.USAGE_RAM();
          this.USAGE_DEPARTAMENTOS();
          this.USAGE_TOPDEPARTAMENTOS();
      }, 5000);
  }

  getData(Padre = []) {
    let i = 0;
    let j = 0;
    while(i<Padre.length){
        this.PDepartamento[j]=Padre[i].departamento;
        this.PCantidad[j]=Padre[i].cantidad;
        j = j + 1;
        i = i + 1;
    }
  }

  setDepartamentos(Padre = []) {
    let i = 0;
    let j = 0;
    while(i<Padre.length){
        this.ArregloDepartamentos[j] = Padre[i].departamento;
        this.ArregloCantidad[j] = Padre[i].cantidad;
        i = i + 1;
        j = j + 1;
    }
  }

  render(){
      return(
          <Router>
              <div className="App">
                  <Navbar >
                  </Navbar>
                  <Switch>
                      <Route path= "/departamento">
                          <Graficas   arregloDepartamentos={this.state.arregloDepartamentos}
                                      arregloCantidad={this.state.arregloCantidad}/>
                      </Route>
                      <Route path="/rango">
                          <Rango/>
                      </Route>
                      <Route path="/top">
                          <Procesos pdepartamento={this.state.pdepartamento} pcantidad={this.state.pcantidad} />
                      </Route>
                  </Switch>
              </div>
          </Router>
      )
  }
}
