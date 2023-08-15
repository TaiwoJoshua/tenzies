import React from 'react';
import Die from './components/Die';
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti';
import SweetAlert2 from 'sweetalert2-react';

export default function App() {
  const [swalProps, setSwalProps] = React.useState({});

  function convertTime(timer){
    const seconds = (timer % 60).toString().padStart(2, "0");
    let minutes = Math.floor(timer / 60).toString().padStart(2, "0");
    const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
    if(hours > 0){
      minutes = (minutes % 60).toString().padStart(2, "0");
    }
    return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
  }

  function allNewDice(){
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({id: nanoid(), value: Math.floor(Math.random() * 6 + 1), isHeld: false});
    }
    return newDice;
  }

  const [timer, setTimer] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(convertTime(parseInt(localStorage.getItem("tenziesTime") || 0)));
  const [count, setCount] = React.useState(0);
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const displayTime = convertTime(timer);

  function rollDice(){
    setDice(oldDice => {
      return oldDice.map(die => {
        return die.isHeld ? die : {...die, value: Math.floor(Math.random() * 6 + 1)};
      });
    });

    setCount(oldCount => oldCount + 1);
  }

  function holdDice(id){
    setDice(oldDice => {
      return oldDice.map(dice => {
        return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice;
      })
    })
  }

  function newGame(){
      setTenzies(false);
      setTimer(0);
      setCount(0);
      setBestTime(convertTime(parseInt(localStorage.getItem("tenziesTime") || 0)));
      setDice(allNewDice);
  }

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const allSame = dice.every(die => die.value === dice[0].value);
    if(allHeld && allSame){
      setTenzies(true);
      if(localStorage.getItem("tenziesTime")){
        if(parseInt(localStorage.getItem("tenziesTime")) > timer){
          localStorage.setItem("tenziesTime", timer.toString());
          setSwalProps({
            show: true,
            icon: "success",
            title: "New Time Record",
            text: `Setting a new best time! ${displayTime} acheived!`
          });
        }
      }else{
        localStorage.setItem("tenziesTime", timer.toString());
      }
    }
    return () => setSwalProps({});
  }, [dice, timer, displayTime]);

  React.useEffect(() => {
    let interval = null;
    if(!tenzies){
      interval = setInterval(() => {
        setTimer(oldTimer => oldTimer + 1);
      }, 1000);
    }else{
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [tenzies]);

  const diceComponent = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} handleClick={() => holdDice(die.id)} />);

  return (
    <div className="App">
      <main>
        <h1 className='die-heading'>Tenzies</h1>
        <p className='die-text'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='die-wrapper'>
          {diceComponent}
        </div>
        <button className='roll-btn' onClick={tenzies ? newGame : rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        {count > 0 && !tenzies && <button className='roll-btn new-game-btn' onClick={newGame}>Restart</button>}
        <div className='die-rolls'>Rolls: {count}</div>
        <div className='die-timer'>{displayTime}</div>
        <div className='die-besttime'>Best Time: {bestTime}</div>
      </main>
      {tenzies && <Confetti />}

      <SweetAlert2 {...swalProps} />
    </div>
  );
}