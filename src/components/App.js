import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';
class App extends React.Component{
	constructor(){
		super();
		this.addFish= this.addFish.bind(this);
		this.loadSamples= this.loadSamples.bind(this);
		this.updateFish=this.updateFish.bind(this);
		this.removeFish=this.removeFish.bind(this);
		this.addToOrder=this.addToOrder.bind(this);
		this.removeFromOrder=this.removeFromOrder.bind(this);
		
		this.state={
			fishes:{},
			order:{}
		};
	}
	componentWillMount(){

		//this will run right before the app is rendered 
		this.ref=base.syncState(`${this.props.params.storeId}/fishes}`
			,{
				context: this,
				state: 'fishes'
			});

		//check if there is any app in local storage

		const localStorageRef=localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef){
			//update our app component order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnMount(){
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps,nextState){
		localStorage.setItem(`order-${this.props.params.storeId}`,JSON.stringify(nextState.order));

	}

	addFish(fish)
	{
		//update our state
		const fishes={...this.state.fishes}
		//add our new fish
		const timestamp=Date.now();
		fishes[`fish-${timestamp}`]=fish;
		//set our new state
		this.setState=({fishes});
		console.log({fishes})
	}

	updateFish(key,updatedFish)
	{
		const fishes={...this.state.fishes};
		fishes[key]=updatedFish;
		this.setState({fishes});
	}

	removeFish(key)
	{
	const fishes={...this.state.fishes};
	fishes[key]=null;
	this.setState({fishes});	
	}
	loadSamples(){
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key){
		//upadte the state
		const order={...this.state.order}
		order[key]=order[key]+1||1;
		this.setState({order});
	}

	removeFromOrder(key){
		const order={...this.state.order}
		delete order[key];
		this.setState({order});
			
	}

	render(){

		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Vegetable Market" />
				<ul className="list-of-fishes">
					{
						Object
							.keys(this.state.fishes)
							.map(key=><Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
					}
				</ul>
				</div>
				<Order fishes={this.state.fishes}
				 	   order={this.state.order}
				 	   params={this.state.params}
				 	   removeFromOrder={this.removeFromOrder}/>
				<Inventory addFish={this.addFish} 
				loadSamples={this.loadSamples} 
				fishes={this.state.fishes}
				updateFish={this.updateFish}
				removeFish={this.removeFish}
				storeId={this.props.params.storeId} //making it avalilble to inventory compnnert
				/>
			</div>
		)
	}
}


App.propTypes={
	params: React.PropTypes.object.isRequired
}


export default App;


