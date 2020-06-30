import React, { Component, Fragment } from 'react';
import Header from './components/Header'
import PizzaForm from './components/PizzaForm'
import PizzaList from './containers/PizzaList'

const URL = "http://localhost:3000/pizzas"
class App extends Component {
  state = {
    pizzas: [],
    topping: "",
    size: "small",
    vegetarian: true,
    id:"",
    currentPizza:""
  }

fetch = () => {
  fetch(URL)
  .then(resp => resp.json())
  .then(data => {
    this.setState({
      pizzas: data
    })
  })
}

  componentDidMount(){
    this.fetch()
  }

  handleForm = (event, pizza) => {
    event.preventDefault()
    // console.log("this is the id", pizza)
    this.setState({
      topping: pizza.topping,
      size: pizza.size,
      vegetarian: pizza.vegetarian,
      id: pizza.id,
      currentPizza: pizza
    })
  }

  handleChange = (event) => {
    let {name, value, type, checked} = event.target
    let radioValue = value === "Vegetarian" ? true : false
    type === "radio" ? this.setState({ [name]: radioValue }) : this.setState({ [name]: value })
}

handleEdit = (event) => {
  event.preventDefault();
// console.log("handle Edit", this.state );
if(!this.state.id){this.handleNew()}else {
  let{id, topping, size, vegetarian} = this.state
fetch(URL +"/"+ id, {
  method: "PATCH",
  headers: {"Content-Type": "application/json", "Accepts": "application/json"},
    body: JSON.stringify({
       id: id,
    topping: topping,
    size: size,
    vegetarian: vegetarian})
})
.then(resp => resp.json())
.then(pizza => {
  let newPizzas = this.state.pizzas.map(p => {
    if(p.id === pizza.id) {
      //  p.topping = pizza.topping,
      //  p.size = pizza.size,
      //  p.vegetarian = pizza.vegetarian
      return pizza
    }
    return p
  })
  this.setState({
    pizzas: newPizzas,
    topping: "",
    size: "small",
    vegetarian: true,
    id:"",
    currentPizza:""
  })
})
}

}

handleNew = () => {
  

let{id, topping, size, vegetarian} = this.state
fetch(URL, {
  method: "POST",
  headers: {"Content-Type": "application/json", "Accepts": "application/json"},
    body: JSON.stringify({
       id: id,
    topping: topping,
    size: size,
    vegetarian: vegetarian})
})
.then(resp => resp.json())
.then(pizza => {
  let newPizzas = [pizza, ...this.state.pizzas]
  this.setState({
    pizzas: newPizzas,
    topping: "",
    size: "small",
    vegetarian: true,
    id:"",
    currentPizza:""
  })
})
}


  render() {
    return (
      <Fragment>
        <Header/>
        <PizzaForm topping={this.state.topping} size={this.state.size} vegetarian={this.state.vegetarian} change={this.handleChange} handleEdit={this.handleEdit}/>
        <PizzaList pizzas={this.state.pizzas}  edit={this.handleForm}/>
      </Fragment>
    );
  }
}

export default App;
