import * as React from "react";
import { Label } from "office-ui-fabric-react/lib/Label";

export interface StorylinesProps {
  name: string;
  image: string;
}

export class Storyline extends React.Component<StorylinesProps, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name, image } = this.props;

    const trunc = (name, len) => {
      return name.length > len ? name.substr(0, len - 1) + "..." : name;
    };

    const displayName = trunc(name, 16);

    const divStyle = {
      backgroundImage: `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.5)
    ), url(${image})`
    };

    return (
      <div>
        <a href="#">
          <div className="storyline-bg" style={divStyle}>
            <Label>{displayName}</Label>
          </div>
        </a>
      </div>
    );
  }
}
