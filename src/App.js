import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import classNames from 'classnames';
import Timer from 'timer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence: [],
      playerSequence: [],
      padsEnabled: true,
      selected: [false, false, false, false],
      gamedStarted: false,
      fail: false,
      count: 0
    }

    this.colorEnum = {
      red: 0,
      blue: 1,
      yellow: 2,
      green: 3
    };
  }

  getRandomNum = () => {
    return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
  }

  doGame(num) {
      //sequence set to first element => play tones
      // player presses button
      //check if length matches and arrays match
      //if so incremement and enable pads
      //play equence
      const userInput = [...this.state.playerSequence];
      userInput.push(num);

      const correct = userInput.toString() === this.state.sequence.toString();
      const sequenceCountMatches = userInput.length === this.state.sequence.length;
      
      if (correct) {  //steps match, increment the steps and let user play the next steps
        const updatedSequence = [...this.state.sequence];
        updatedSequence.push(this.getRandomNum());
        const count = updatedSequence.length;

        if(count == 21){
          this.setState({ 
              playerSequence: [],
              padsEnabled: false,
              sequence: [],
              count: "WON!"
          });
        }
        else {
            this.setState({ 
            playerSequence: [],
            padsEnabled: true,
            sequence: updatedSequence,
            count: count
          });
          setTimeout(function () {this.playSequence(updatedSequence);}.bind(this), 1500);
        }
        
       
      }
      else if(sequenceCountMatches && this.state.strict)
        {
          this.start();
        }
      else if(sequenceCountMatches) //user guessed wrong
      { 
        this.setState({ 
          playerSequence: [],
          padsEnabled: true,
          count: 0
        });
        this.playSequence(this.state.sequence);
      }
      else{ //still more presses to finish the sequence
         this.setState({ 
          padsEnabled: true,
          playerSequence: userInput
        });
      }
  }

  indicateFail() {
    this.setState({ fail: true });
  }

  toneAndFlash(num, order) {
    this.playTone(num, order);
    this.flash(num, order);
  }

  flash = (num, order) => {
    const selectedTrue = { ...this.state.selected };
    selectedTrue[num] = true;
    const selectedFalse = { ...this.state.selected };
    selectedFalse[num] = false;
    const seconds = 1000 * order;

    setTimeout(function () {this.setState({ selected: selectedTrue })}.bind(this), seconds-500);
    setTimeout(function () {this.setState({ selected: selectedFalse })}.bind(this), seconds);

  }

  playTone(num, order) {
    const tones = [
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')];

    setTimeout(() => {
      tones[num].play();
    }, (1000 * order) - 500);
  }

  playSequence = (sequence) => {
   console.log(sequence);
   console.log(this.state.padsEnabled);
    let order = 1;
    sequence.forEach(function (num) {
      this.toneAndFlash(num, order);
      order++;
    }, this);
    
  }

  handleBlue = () => {
    if (this.state.padsEnabled) {
      this.toneAndFlash(this.colorEnum.blue, 1);
      this.doGame(this.colorEnum.blue);
    }
  }

  handleGreen = () => {
    if (this.state.padsEnabled) {
      this.toneAndFlash(this.colorEnum.green, 1);
      this.doGame(this.colorEnum.green);
    }
  }

  handleRed = () => {
    if (this.state.padsEnabled) {
      this.toneAndFlash(this.colorEnum.red, 1);
      this.doGame(this.colorEnum.red);
    }
  }

  handleYellow = () => {
    if (this.state.padsEnabled) {
      this.toneAndFlash(this.colorEnum.yellow, 1);
      this.doGame(this.colorEnum.yellow);
    }
  }

  incrementSequence = () => {
    const newState = [...this.state.sequence];
    newState.push(this.getRandomNum());
    this.setState({ sequence: newState });
  }

  start = () => {
    //add new step
    const firstButtonFlash = [];
    firstButtonFlash.push(this.getRandomNum());

    this.playSequence(firstButtonFlash);
    console.log(this.state.sequence);
    this.setState({ 
      gamedStarted: true,
       padsEnabled: true,
       sequence: firstButtonFlash,
       userInput: []
     });
  }

  setStrict = () =>{
    this.setState({strict: true});
  }

  render() {

    const classes = [
      classNames('green-pad', 'quarter', { "selected": this.state.selected[this.colorEnum.green] }),
      classNames('red-pad', 'quarter', { "selected": this.state.selected[this.colorEnum.red] }),
      classNames('yellow-pad', 'quarter', { "selected": this.state.selected[this.colorEnum.yellow] }),
      classNames('blue-pad', 'quarter', { "selected": this.state.selected[this.colorEnum.blue] })
    ];

    
    return (
      <div className="container">
        <div className={classes[0]} onClick={this.handleGreen}></div>
        <div className={classes[1]} onClick={this.handleRed}></div>
        <div className={classes[2]} onClick={this.handleYellow}></div>
        <div className={classes[3]} onClick={this.handleBlue}></div>
        <div className="control-panel">
          <div className="count">{this.state.count}</div>
          <button onClick={this.start} disabled={this.state.gameStarted}>Start</button>
          <button onClick={this.setStrict}>Strict</button>
          {this.state.fail && <span>failed</span>}
        </div>

      </div>
    );
  }
}

export default App;
