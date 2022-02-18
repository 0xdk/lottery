import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    winner: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.showPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const winner = await lottery.methods.winner().call();

    this.setState({ manager, players, balance, winner });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          Manager of this contract {this.state.manager}. Number of people
          entered in this contract {this.state.players.length}, winning amount
          is {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Lottery contract</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
        <p>winner of this lottery {this.state.winner}.</p>
      </div>
    );
  }
}
export default App;
