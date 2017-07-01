import * as React from "react";
import { Spinner, SpinnerType } from "office-ui-fabric-react";

export interface ProgressProps {
  title: string;
  message: string;
}

export class Progress extends React.Component<ProgressProps, void> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <section className="ms-welcome__progress ms-u-fadeIn500">
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">
          {this.props.title}
        </h1>
        <Spinner type={SpinnerType.large} label={this.props.message} />
      </section>
    );
  }
}
