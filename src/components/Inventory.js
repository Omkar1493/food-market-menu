import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';
class Inventory extends React.Component{
	constructor(){
		super();
		this.renderInventory=this.renderInventory.bind(this)
		this.handleChange=this.handleChange.bind(this)
		this.renderlogin=this.renderlogin.bind(this)//alternative is to do renderlogin=()=>{};
		this.authenticate=this.authenticate.bind(this)
		this.authHandler=this.authHandler.bind(this)
		this.logout=this.logout.bind(this)
		//again here we can use only set instead of this.setstate
		this.state={
			uid: null,
			owner: null
		}
	}


	componentDidMount(){
		base.onAuth((user)=>{
			if(user){
				this.authHandler(null,{user})
			}
		})
	}

	handleChange(e,key)
	{
		const fish= this.props.fishes[key];

		const updatedFish={
			...fish,
			[e.target.name]:e.target.value
		}
		this.props.updateFish(key,updatedFish);
	}



	authenticate(provider){
		console.log(`Trying to login with ${provider}`);
		base.authWithOAuthPopup(provider,this.authHandler)
	}
	logout(){
		base.unauth();
		this.setState({uid:null});
	}
	authHandler(err,authData){
		console.log(authData);
		if(err){
			console.error(err);
			return;
		}
		//grab the store info by accesing firebase db to get the state/strucutre
		const storeRef=base.database().ref(this.props.storeId)

		//query the firebase for thr storedata
		storeRef.once('value',(snapshot)=>{
			const data = snapshot.val() || {}
		//claim it as our own if no owner
			if(!data.owner){
				storeRef.set({owner: authData.user.uid
				});
		}
		this.setState({
			uid: authData.user.uid,
			owner: data.owner || authData.user.uid
		});
		});



	}

	renderlogin()
	{
		return(
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to your store's Inventory</p>
				<button className="github" onClick={()=> this.authenticate('github')}>Login with github</button>
				<button className="facebook" onClick={()=> this.authenticate('facebook')}>Login with facebook</button>
			</nav>
			)
	}


	renderInventory(key){

		const fish=this.props.fishes[key];
		return(
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish Name"
				onChange={(e)=>this.handleChange(e,key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish Price"
				onChange={(e)=>this.handleChange(e,key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish status"
				onChange={(e)=>this.handleChange(e,key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold out</option>
				</select>


				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc"
				onChange={(e)=>this.handleChange(e,key)}></textarea>
				<input type="text" name="image" value={fish.value} placeholder="Fish Image"
				onChange={(e)=>this.handleChange(e,key)}/>
				<button onClick={()=>this.props.removeFish(key)}>Remove Fish</button>
			</div>

			)
	}




	render(){
		const logout= <button onClick={this.logout}>Log out</button>

		//check if they are not logged in
		if(!this.state.uid){
			return <div>{this.renderlogin()}</div>
		}

		if(this.state.uid!==this.state.owner){
			return (

				<div>
					<p>Sorry you are not the owner</p>
					{logout}
				</div>

			)
		}
	return (
		<div>
			<h2>Inventory</h2>
			{logout}
			{Object.keys(this.props.fishes).map(this.renderInventory)}
			<AddFishForm addFish={this.props.addFish}/>
			<button onClick={this.props.loadSamples}>Load Sample fishes</button>s
		</div>

		)
}
}


Inventory.propTypes={
	fishes: React.PropTypes.object.isRequired,
	updateFish:React.PropTypes.func.isRequired,
	removeFish:React.PropTypes.func.isRequired,
	addFish:React.PropTypes.func.isRequired,
	loadSamples:React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired,
};

export default Inventory;