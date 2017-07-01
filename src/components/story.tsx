import * as React from "react";
import { Label } from "office-ui-fabric-react/lib/Label";
import * as firebase from "firebase";
import { ImageViewer } from "./imageViewer";

export interface StoryProps {
  name: string;
  self?: boolean;
}

export interface StoryState {
  showModal: boolean;
  images: string[];
}
export class Story extends React.Component<StoryProps, StoryState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      images: []
    };

    this._showStory = this._showStory.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  private _showStory(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  private _closeModal() {
    this.setState({ showModal: false });
  }
  componentDidMount() {
    const storageRef = firebase.storage().ref();
    if (this.props.self) {
      const user = firebase.auth().currentUser;
      const imagesRef = firebase
        .database()
        .ref("users/" + user.uid + "/images");

      imagesRef.on("child_added", data => {
        storageRef.child(data.val()).getDownloadURL().then(url => {
          this.setState({ images: this.state.images.concat([url]) });
        });
      });
    } else {
      this.setState({
        images: [
          "https://pbs.twimg.com/profile_images/872527202197295104/YU3gYtLj_400x400.jpg",
          "https://media-cdn.tripadvisor.com/media/photo-s/0e/9a/e3/1d/freedom-tower.jpg"
        ]
      });
    }
  }
  render() {
    const { name } = this.props;
    const { showModal } = this.state;
    let images = this.state.images;

    if (images.length === 0) {
      images = [
        "https://pbs.twimg.com/profile_images/872527202197295104/YU3gYtLj_400x400.jpg"
      ];
    }

    const trunc = (name, len) => {
      return name.length > len ? name.substr(0, len - 1) + "..." : name;
    };

    const displayName = trunc(name, 11);

    return (
      <div>
        <a onClick={this._showStory.bind(this)}>
          <div className="story-image-border">
            <img className="story-image" src={images[0]} />
          </div>
          <Label className="fontSize-xs">{displayName}</Label>
        </a>
        <ImageViewer
          images={images}
          showModal={showModal}
          close={this._closeModal}
          name={name}
        />
      </div>
    );
  }
}
