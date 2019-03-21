import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

function PokeForm (props){
	return (
		<form onSubmit={props.onSubmit}>
			<input type = 'text' name = 'pokename' placeholder = 'Search Pokedex'/>
			<button>Submit</button>
		</form>
	);
}



class PokeDetails extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			data: [],
		}
	}
	
	componentDidMount() { // Perform get request for page of pokemon data
		const poke = this.props.searchPokeName;
		const page = this.props.page;
		const url = poke ? 
						page ? `https://intern-pokedex.myriadapps.com/api/v1/pokemon?name=${poke}&page=${page}` :
							   `https://intern-pokedex.myriadapps.com/api/v1/pokemon?name=${poke}` :
						page ? `https://intern-pokedex.myriadapps.com/api/v1/pokemon?page=${page}` :
							   `https://intern-pokedex.myriadapps.com/api/v1/pokemon`;
		axios.get(url).then( (res) => {
			let data = [];
			for (var i = 0; i < res.data.data.length; i++) {
				data.push(res.data.data[i]);
			}
			this.setState({ data });
		});
	}
		
	render() {
		let pokedata = this.state.data.map( (pokemon) => {
			return (
				<td> 
					<img src = {pokemon.image} alt = 'pokemon' /> 
					<p> {pokemon.name} </p>
				</td>
			);
		});
		return (
			<div>
				<table>
					<tbody>
						<tr>
							{pokedata[0]}
							{pokedata[1]}
							{pokedata[2]}
						</tr>
						<tr>
							{pokedata[3]}
							{pokedata[4]}
							{pokedata[5]}
						</tr>
						<tr>
							{pokedata[6]}
							{pokedata[7]}
							{pokedata[8]}
						</tr>
						<tr>
							{pokedata[9]}
							{pokedata[10]}
							{pokedata[11]}
						</tr>
						<tr>
							{pokedata[12]}
							{pokedata[13]}
							{pokedata[14]}
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}	


class PokePage extends React.Component {
	render() {
		return (
			<div>
				<PokeForm onSubmit={this.props.searchPokes}/>
				<PokeDetails searchPokeName={this.props.match.params.poke}
									   page={this.props.match.params.page}
				/>
			</div>
		);
	}
}

class App extends Component {
	
	// Not currently implemented
	// Need to use to direct to /name/${poke}
	searchPokes = (e) => {
		e.preventDefault();
		const poke = e.target.elements.pokename.value;
		axios.get(`https://intern-pokedex.myriadapps.com/api/v1/pokemon?name=${poke}`)
			.then((res) => {
				const pokes = res.data.data;
				console.log(pokes);
			})
	}

	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/name/:poke/page/:page' component={(props)=>
						<PokePage {...props} searchPokes={this.searchPokes}  />
					} />
					<Route path='/name/:poke' component={(props)=>
						<PokePage {...props} searchPokes={this.searchPokes}  />
					} />
					<Route path='/page/:page' component={(props)=>
						<PokePage {...props} searchPokes={this.searchPokes}  />
					} />
					<Route path='/' component={(props)=>
						<PokePage {...props} searchPokes={this.searchPokes}  />
					} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
