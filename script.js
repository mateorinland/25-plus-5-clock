const audio = document.getElementById("beep");

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.interval = undefined;
    this.state = {
      breakLength: 5, //in minutes
      sessionLength: 25, //in minutes
      isRunning: false,
      phase: "Session",
      timer: 25 * 60 //in seconds, starts at 1500s = 25min
    };
    this.getFormattedTimer = this.getFormattedTimer.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.reset = this.reset.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
    this.modifyLength = this.modifyLength.bind(this);
  }
  
  getFormattedTimer() { //converts timer into mm:ss format
    if (this.state.timer < 0) return "00:00";
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }
  
  toggleTimer() {
    if (this.state.isRunning) {
      this.setState({
        isRunning: false
      });
      if (this.interval) {
        clearInterval(this.interval);
      }
    } else {
      this.setState({
        isRunning: true
      });        
      this.startCountdown();
    }
  }
  
  startCountdown() {
    this.interval = setInterval(() => {
      const {
        timer,
        phase,
        breakLength,
        sessionLength
      } = this.state;
       if(timer === 0) {
         this.setState({
           phase: (phase === "Session") ? "Break" : "Session",
           timer: (phase === "Session") ? (breakLength * 60) : (sessionLength * 60)
         });
         audio.play();
       } else {
        this.setState ({
          timer: timer - 1
        });
       }
    }, 1000)
  }
  
  reset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      isRunning: false,
      phase: "Session",
      timer: 1500,
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
    audio.pause();
    audio.currentTime = 0;
  }
  
  setBreakLength(event) {
    this.modifyLength(
      "breakLength",
      event.currentTarget.value,
      this.state.breakLength,
      "Session"
    );
  }
  setSessionLength(event) {
    this.modifyLength(
      "sessionLength",
      event.currentTarget.value,
      this.state.sessionLength,
      "Break"
    );
  }
  modifyLength(propToModify, operation, currentLength, phase) {
    if (this.state.isRunning) {
      return;
    }
    if (this.state.phase === phase) {
      if (operation === '-' && currentLength !== 1) {
        this.setState({ [propToModify]: currentLength - 1 });
      } else if (operation === '+' && currentLength !== 60) {
        this.setState({ [propToModify]: currentLength + 1 });
      }
    } else if (operation === '-' && currentLength !== 1) {
      this.setState({
        [propToModify]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (operation === '+' && currentLength !== 60) {
      this.setState({
        [propToModify]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }
  
  render() {
    return (
      <div>
        <h1>25 + 5 Clock</h1>
        <LengthController
          lengthID="session-length"
          incrementID="session-increment"
          decrementID="session-decrement"
          length={this.state.sessionLength}
          onClick={this.setSessionLength}
          title="Session Length"
          titleID="session-label"
        />
        <LengthController
          lengthID="break-length"
          incrementID="break-increment"
          decrementID="break-decrement"
          length={this.state.breakLength}
          onClick={this.setBreakLength}
          title="Break Length"
          titleID="break-label"
        />
        <div className="timer">
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.phase}</div>
            <div id="time-left">{this.getFormattedTimer()}</div>
            <div className="buttons">
              <button id="start_stop" onClick={this.toggleTimer}>
                <i className="fas fa-play fa-2x"/>
                <i className="fas fa-pause fa-2x"/>
              </button>
              <button id="reset" onClick={this.reset}>
                <i className="fas fa-refresh fa-2x"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class LengthController extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>{this.props.title}</div>
        <button
          className="aligned-button"
          id={this.props.decrementID}
          onClick={this.props.onClick}
          value="-">
          <i className="fas fa-arrow-down fa-2x"/>
        </button>
        <div
          className="aligned-button central-button"
          id={this.props.lengthID}>
          {this.props.length}
        </div>
        <button
          className="aligned-button"
          id={this.props.incrementID}
          onClick={this.props.onClick}
          value="+">
          <i className="fas fa-arrow-up fa-2x"/>
        </button>
      </div>
    );
  }
}
          
ReactDOM.render(<Timer/>, document.getElementById("root"));
