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

function arrayToString(array) {
	var arrayData = "";
	for (var i = 0; i < array.length; i++) {
		arrayData += array[i] + ' '
	}
	return arrayData;
}

class PokeDetails extends React.Component {
	
	constructor (props) {
		super(props);
		this.state = {
			data: [],
		}
	}
	
	printStats(stats) {
		return (
			<div>
				<p> Attack: {stats['attack']}, Defense: {stats['defense']} </p>
				<p> SpAttack: {stats['special-attack']}, SpDefense: {stats['special-defense']} </p> 
				<p> Health: {stats['hp']}, Speed: {stats['speed']} </p>
			</div>
		);
	}
	
	componentDidMount() {
		const id = this.props.match.params.id;
		const url = `https://intern-pokedex.myriadapps.com/api/v1/pokemon/${id}`;
		axios.get(url).then( (res) => {
			let data = [];
			data.push(res.data.data);
			this.setState({data});
		});
	}
	
	render() {
		let pokedata = this.state.data.map((pokemon) => {
			return (
				<div>
					<button onClick={this.props.history.goBack}> Go Back </button> 
					<p> {pokemon.name}, the {pokemon.genus} </p>
					<img src = {pokemon.image} alt = 'Pokemon' />
					<p> {arrayToString(pokemon.types)} </p>
					<p> Abilities: {arrayToString(pokemon.abilities)} </p>
					{pokemon.description}
					{this.printStats(pokemon.stats)}
				</div>
			);
		});
		return <div>{pokedata[0]}</div>;
	}
}

class PokeList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			data: [],
		}
	}
	
	viewPokemonDetails = (id) => {
		window.location.href = `/viewPokemon/${id}`;
	}
	
	componentDidMount() { // Perform get request for page of pokemon data
		const poke = this.props.search_name;
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
				<td onClick={() => this.viewPokemonDetails(pokemon.id)}> 
					<img src = {pokemon.image} alt = 'Pokemon' /> 
					<p> {pokemon.name} </p>
					<p> {arrayToString(pokemon.types)} </p>
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
	
	searchPokes = (e) => {
		e.preventDefault();
		const poke = e.target.elements.pokename.value;
		window.location.href = `/name/${poke}/`;
	}
	
	navButtons() {
		if (this.props.match.params.page > 1 ) {
			return (
				<div>
					<button onClick={() => this.viewPreviousPage()}> Previous Page </button>
					<button onClick={() => this.viewNextPage()}> Next Page </button>						
				</div>
			);
		} else {
			return (
				<div>
					<button onClick={() => this.viewNextPage()}> Next Page </button>
				</div>
			);
		}
	}
	
	viewNextPage = () => {
		const poke = this.props.match.params.poke;
		const page = parseInt(this.props.match.params.page,10) + 1;
		const url = poke ? 
						page ? `/name/${poke}/page/${page}/` :
							   `/name/${poke}/page/${2}/` :
						page ? `/page/${page}/` :
							   `/page/${2}/`;
		window.location.href = url;
	}
	
	viewPreviousPage = () => {
		const poke = this.props.match.params.poke;
		const page = this.props.match.params.page - 1;
		const url = poke ? `/name/${poke}/page/${page}/` :
						   `/page/${page}/`;
		window.location.href = url;
	}
	
	render() {
		return (
			<div>
				<PokeForm onSubmit={this.searchPokes}/>
				{this.navButtons()}
				<PokeList search_name={this.props.match.params.poke}
								 page={this.props.match.params.page}
				/>
			</div>
		);
	}
}

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/name/:poke/page/:page' component={(props)=>
						<PokePage {...props}  />
					} />
					<Route path='/page/:page/name/:poke' component={(props)=>
						<PokePage {...props}  />
					} />
					<Route path='/name/:poke' component={(props)=>
						<PokePage {...props}  />
					} />
					<Route path='/page/:page' component={(props)=>
						<PokePage {...props}  />
					} />
					<Route path='/viewPokemon/:id' component={(props)=>
						<PokeDetails {...props} />
					} />
					<Route path='/' component={(props)=>
						<PokePage {...props}  />
					} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
