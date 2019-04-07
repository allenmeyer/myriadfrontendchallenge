import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './style/pokedexstyle.css'

function PokeForm (props){
	return (
		<form onSubmit={props.onSubmit}>
			<input type = 'text' name = 'pokename'
			placeholder = 'Pokedex' id="PokeFormInput"/>
			<br />
			<button>Submit</button>
		</form>
	);
}

function arrayToString(array) {
	var arrayData = "";
	for (var i = 0; i < array.length-1; i++) {
		arrayData += capitalizeWords(array[i]) + ', ';
	}
	arrayData += capitalizeWords(array[array.length-1]);
	return arrayData;
}

function capitalizeWords(word) {
	for (var i = 0; i < word.length; i++) {
		if (word.charAt(i) === '-') {
			word = word.slice(0, i+1) + word.charAt(i+1).toUpperCase() + word.slice(i+2);
		}
	}
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function createStatStyle(stat) {
	var styles = {
		'main': 
				{
					width: stat / 2.55 + '%',
					backgroundColor: 'SeaGreen',
				},
		'filler':
				{
					width: (255-stat) / 2.55 + '%',
					backgroundColor : '#DFFFE4',
				},
	};
	return styles;
}

function getStatsStyles(stats) {
	var hp_styles = createStatStyle(stats['hp']);
	var att_styles = createStatStyle(stats['attack']);
	var def_styles = createStatStyle(stats['defense']);
	var spatt_styles = createStatStyle(stats['special-attack']);
	var spdef_styles = createStatStyle(stats['special-defense']);
	var speed_styles = createStatStyle(stats['speed']);
	
	var styles = {
		'hpstyle': hp_styles['main'],
		'hpfiller' : hp_styles['filler'],
		'attstyle': att_styles['main'],
		'attfiller' : att_styles['filler'],
		'defstyle' : def_styles['main'],
		'deffiller': def_styles['filler'],
		'spattstyle' : spatt_styles['main'],
		'spattfiller' : spatt_styles['filler'],
		'spdefstyle' : spdef_styles['main'],
		'spdeffiller' : spdef_styles['filler'],
		'speedstyle' : speed_styles['main'],
		'speedfiller' : speed_styles['filler'],
	}
	return styles;
}

class PokeDetails extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			data: '',
		}
	}
	
	printStats(stats) {
		var statStyles = getStatsStyles(stats);

		return (
			<div className="PokemonStatsDiv">
				Stats <br />
				<label> HP: {stats['hp']} </label> <br />
				<span className='PokemonStats' style={statStyles['hpstyle']}> </span>
				<span className='PokemonStats' style={statStyles['hpfiller']}> </span> 
				<br />
				<label> Attack: {stats['attack']} </label> <br />
				<span className='PokemonStats' style={statStyles['attstyle']}> </span>
				<span className='PokemonStats' style={statStyles['attfiller']}> </span>
				<br />
				<label> Defense: {stats['defense']} </label> <br />
				<span className='PokemonStats' style={statStyles['defstyle']}> </span>
				<span className='PokemonStats' style={statStyles['deffiller']}> </span>
				<br />
				<label> SpAttack: {stats['special-attack']} </label> <br />
				<span className='PokemonStats' style={statStyles['spattstyle']}> </span>
				<span className='PokemonStats' style={statStyles['spattfiller']}> </span>
				<br />
				<label> SpDefense: {stats['special-defense']} </label> <br />
				<span className='PokemonStats' style={statStyles['spdefstyle']}> </span>
				<span className='PokemonStats' style={statStyles['spdeffiller']}> </span>
				<br />
				<label> Speed: {stats['speed']} </label> <br />
				<span className='PokemonStats' style={statStyles['speedstyle']}> </span>
				<span className='PokemonStats' style={statStyles['speedfiller']}> </span>
			</div>
		);
	}
	
	renderData = () => {
		if (this.state.data !== '') {
			let pokedata = this.state.data;
			
			let type_list = [];
		
			for (var i = 0; i < pokedata.types.length; i++) {
				type_list.push(<span key={i} className={pokedata.types[i] + " pokemontype"}>{pokedata.types[i].toUpperCase()}</span>);
			}
			return (
				<div className="PokemonDetailsDiv">
					<p> {pokedata.name}, the {pokedata.genus}  #{pokedata.id} </p>
					<img src = {pokedata.image} alt = 'Pokemon' /> <br />
					<span> {type_list} </span> <br /> <br />
					{pokedata.description}					
					<p id = 'DetailsHeader'> Details </p>
					<p> Abilities: {arrayToString(pokedata.abilities)} </p>
					<p> Height: {pokedata.height} m </p>
					<p> Weight: {pokedata.weight} kg </p>
					<p> Egg Groups: {arrayToString(pokedata.egg_groups)} </p>
					<p> Genus: {capitalizeWords(pokedata.genus)} </p>
					<br />
					{this.printStats(pokedata.stats)}
				</div>
			);
		}
		return <div> </div>;
	}
	
	componentDidMount() { // Retrieve pokemon data
		const id = this.props.match.params.id;
		const url = `https://intern-pokedex.myriadapps.com/api/v1/pokemon/${id}`;
		axios.get(url).then( (res) => {
			let data = res.data.data;
			this.setState({data});
		});
	}
	
	render() {
		return (
			<div>
				<br />
				<button onClick={this.props.history.goBack}> Go Back </button>
				{this.renderData()}
			</div>
		);
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
	
	renderData = () => {
		let num_per_row = window.innerWidth >= 900 ? 3 :
						  window.innerWidth >= 500 ? 2 : 1;
		let num_rows = Math.ceil(15 / num_per_row);
		let pokedata = this.state.data.map( (pokemon) => {
			let type_list = [];
		
			for (var i = 0; i < pokemon.types.length; i++) {
				type_list.push(
				<span 
					className={pokemon.types[i] + " pokemontype"}
					key={i}>
					{pokemon.types[i].toUpperCase()}
				</span>);
			}
			return (
				<td onClick={() => this.viewPokemonDetails(pokemon.id)}
					className="PokemonListItem"
					key = {pokemon.id}> 
					<p> {pokemon.name} </p>
					<img src = {pokemon.image} alt = 'Pokemon' /> <br /> 
					<span> {type_list} </span>
				</td>
			);
		});
		let pokemon_list = [];
		
		for (var i = 0; i < num_rows; i++) {
			let pokemon_row = [];
			for (var j = 0; j < num_per_row; j++) {
				pokemon_row.push(pokedata[(i*num_per_row)+j]);
			}
			pokemon_list.push(<tr className="PokemonListRow" key={i}>{pokemon_row}</tr>);
		}
		return pokemon_list;
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
		return (
			<div className="PokemonListDiv"> 
				<table className="PokemonListTable">
					<tbody>
						{this.renderData()} 
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
		if (poke !== '') {
			window.location.href = `/name/${poke}/`;
		}
	}
	
	navButtons() {
		if (this.props.match.params.page > 1 ) {
			return (
				<div>
					<button onClick={() => this.viewPreviousPage()}> Previous Page </button>
					<button onClick={() => this.viewHomePage()}> Home </button>
					<button onClick={() => this.viewNextPage()}> Next Page </button>						
				</div>
			);
		} else {
			return (
				<div>
					<button onClick={() => this.viewHomePage()}> Home </button>
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
	
	viewHomePage = () => {
		window.location.href = '/';
	}
	
	render() {
		return (
			<div>
				<PokeForm onSubmit={this.searchPokes}/>
				<br />
				{this.navButtons()}
				<PokeList search_name={this.props.match.params.poke}
								 page={this.props.match.params.page}
				/>
				{this.navButtons()}
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
