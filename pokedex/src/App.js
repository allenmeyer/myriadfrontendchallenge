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
	displayPoke = (data) => {
		
	}
	async getPokemon(url) {
		const res = await axios.get(url);
		console.log(res);
		return res;
	}
		
	render() {
		const poke = this.props.searchPokeName;
		const page = this.props.page;
		const url = poke ? 
						page ? `https://intern-pokedex.myriadapps.com/api/v1/pokemon?name=${poke}&page=${page}` :
							   `https://intern-pokedex.myriadapps.com/api/v1/pokemon?name=${poke}` :
						page ? `https://intern-pokedex.myriadapps.com/api/v1/pokemon?page=${page}` :
							   `https://intern-pokedex.myriadapps.com/api/v1/pokemon`;
		const pokedata = this.getPokemon(url);
		return <p>placeholder</p>
	}
}	


class PokePage extends React.Component {
	render() {
		console.log(this.props);
		return (
			<div>
				<PokeForm onSubmit={this.props.searchPokes}/>
				<PokeDetails getPokesFn={this.props.searchPokes} 
					searchPokeName={this.props.match.params.poke}
					page={this.props.match.params.page}
				/>
			</div>
		);
	}
}

class App extends Component {
	
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
					<Route path='/name/:poke/' component={(props)=>
						<PokePage {...props} searchPokes={this.searchPokes}  />
					} />
					<Route path='/page/:page/' component={(props)=>
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
