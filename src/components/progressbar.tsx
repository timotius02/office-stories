import * as React from "react";
import { ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import { Async } from "office-ui-fabric-react/lib/Utilities";

export interface ProgressBarProps {
  active: boolean;
  delay?: number;
  increment?: number;
  onComplete?: { (): void };
}
let INTERVAL_DELAY: number;
let INTERVAL_INCREMENT: number;

export class ProgressBar extends React.Component<ProgressBarProps, any> {
  private _interval: number;
  private _async: Async;
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      percentComplete: 0,
      completed: false
    };

    this._async = new Async(this);
    INTERVAL_DELAY = this.props.delay ? this.props.delay : 100;
    INTERVAL_INCREMENT = this.props.increment ? this.props.increment : 0.01;

    this._startProgress = this._startProgress.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }
  private _startProgress() {
    // reset the demo
    this.setState({
      percentComplete: 0
    });

    // update progress
    this._interval = this._async.setInterval(() => {
      let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;

      // once complete, exit the modal
      if (percentComplete >= 1.0) {
        percentComplete = 1.0;
        this._async.clearInterval(this._interval);
        this.setState({ completed: true }, () => {
          if (this.props.onComplete) {
            this.props.onComplete();
          }
        });
      }
      this.setState({
        percentComplete: percentComplete
      });
    }, INTERVAL_DELAY);
  }
  shouldComponentUpdate(nextProps) {
    const { percentComplete } = this.state;
    // Skipping this image
    if (this.props.active && !nextProps.active && percentComplete < 1.0) {
      this._async.clearInterval(this._interval);
      this.setState({
        percentComplete: 100,
        completed: true
      });
      return false;
    }
    if (!this.props.active && nextProps.active) {
      this._startProgress();
      return false;
    }
    return true;
  }
  componentDidMount() {
    const { active } = this.props;
    if (active) {
      this._startProgress();
    }
  }
  cleanUp() {
    this._async.clearInterval(this._interval);
  }
  render() {
    return <ProgressIndicator percentComplete={this.state.percentComplete} />;
  }
}
