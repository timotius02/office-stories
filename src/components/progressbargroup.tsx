import * as React from "react";
import { ProgressBar } from "./progressbar";

export interface ProgressBarGroupProps {
  numImages: number;
  onFinishProgress?: { (): void };
  onNext?: { (): void };
}

export class ProgressBarGroup extends React.Component<
  ProgressBarGroupProps,
  any
> {
  private _progressbars: HTMLDivElement;
  private _activebar: ProgressBar;
  constructor(props, context) {
    super(props, context);

    this.state = {
      barWidth: 100,
      activeIndex: 0
    };
    this.nextBar = this.nextBar.bind(this);
  }
  nextBar() {
    if (this.state.activeIndex < this.props.numImages - 1) {
      if (this.props.onNext) {
        this.props.onNext();
      }
      this.setState({ activeIndex: this.state.activeIndex + 1 });
    } else {
      this._activebar.cleanUp();
      if (this.props.onFinishProgress) {
        this.props.onFinishProgress();
      }
    }
  }
  componentDidMount() {
    const { numImages } = this.props;
    this.setState({
      barWidth: (this._progressbars.offsetWidth - 4 * numImages) / numImages
    });
  }
  render() {
    const { barWidth, activeIndex } = this.state;
    const { numImages } = this.props;

    const bars = [];

    for (let i = 0; i < numImages; i++) {
      bars.push(
        i === activeIndex
          ? <div
              key={"progressbar" + i}
              style={{ width: barWidth, marginRight: 4 }}
            >
              <ProgressBar
                active={true}
                ref={activeBar => (this._activebar = activeBar)}
                increment={0.04}
                onComplete={this.nextBar}
              />
            </div>
          : <div
              key={"progressbar" + i}
              style={{ width: barWidth, marginRight: 4 }}
            >
              <ProgressBar
                active={false}
                increment={0.04}
                onComplete={this.nextBar}
              />
            </div>
      );
    }

    return (
      <div
        className="progressbar-group"
        ref={progressbars => {
          this._progressbars = progressbars;
        }}
      >
        {bars}
      </div>
    );
  }
}
