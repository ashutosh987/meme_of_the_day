import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../actions/profile";
//import Web3 from "web3";
import "./App.css";
//import Meme from "../abis/Meme.json";

//const ipfsClient = require("ipfs-http-client");
import ipfs from "./ipfs";
/*const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
}); // leaving out the arguments will default to these values
*/
const App = ({ getCurrentProfie, auth, profile }) => {
  useEffect(() => {
    getCurrentProfie();
  }, []);
  var state = { buffer: null };
  /*
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
*/

  const captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  const onSubmit = event => {
    event.preventDefault();
    console.log("Submitting file to ipfs...");
    console.log("buffer", this.state.buffer);
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      /*   this.state.contract.methods
        .set(result[0].hash)
        .send({ from: this.state.account })
        .then(r => {
          return this.setState({ memeHash: result[0].hash });
        });
      */
      const va = result[0].hash;
      console.log("Ipfs result", va);
    });
  };

  return (
    <div>
      <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
        <a
          className='navbar-brand col-sm-3 col-md-2 mr-0'
          href='http://www.dappuniversity.com/bootcamp'
          target='_blank'
          rel='noopener noreferrer'
        >
          Meme of the Day
        </a>
      </nav>
      <div className='container-fluid mt-5'>
        <div className='row'>
          <main role='main' className='col-lg-12 d-flex text-center'>
            <div className='content mr-auto ml-auto'>
              <a
                href='http://www.dappuniversity.com/bootcamp'
                target='_blank'
                rel='noopener noreferrer'
              ></a>
              <p>&nbsp;</p>

              <h2>Change Meme</h2>
              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  getCurrentProfie: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(App);
