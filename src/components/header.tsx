import * as React from "react";

export interface HeaderProps {
  title: string;
}

export class Header extends React.Component<HeaderProps, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <section className="header ms-bgColor-tealLight ms-u-fadeIn500">
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-white">
          {this.props.title}
        </h1>
      </section>
    );
  }
}
