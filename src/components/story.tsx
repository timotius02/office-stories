import * as React from "react";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { ProgressBarGroup } from "./progressbargroup";

export interface StoryProps {
  name: string;
}

export class Story extends React.Component<StoryProps, any> {
  private modal: Modal;
  private progressBarGroup: ProgressBarGroup;
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      images: [
        "https://pbs.twimg.com/profile_images/872527202197295104/YU3gYtLj_400x400.jpg",
        "https://media-cdn.tripadvisor.com/media/photo-s/0e/9a/e3/1d/freedom-tower.jpg"
      ],
      activeIndex: 0
    };

    this._showStory = this._showStory.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._nextImage = this._nextImage.bind(this);
    this._resetIndex = this._resetIndex.bind(this);
  }

  private _showStory(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  private _nextImage() {
    this.setState({ activeIndex: this.state.activeIndex + 1 });
  }
  closeModal() {
    this.setState({ showModal: false });
  }
  _resetIndex() {
    this.setState({ activeIndex: 0 });
  }
  render() {
    const { name } = this.props;
    const { showModal, images, activeIndex } = this.state;

    const trunc = (name, len) => {
      return name.length > len ? name.substr(0, len - 1) + "..." : name;
    };

    const displayName = trunc(name, 11);

    const backgroundImage = {
      backgroundImage: `url(${images[activeIndex]})`
    };

    return (
      <div>
        <a onClick={this._showStory.bind(this)}>
          <div className="story-image-border">
            <img className="story-image" src={images[activeIndex]} />
          </div>
          <Label className="fontSize-xs">{displayName}</Label>
        </a>
        <Modal
          isOpen={showModal}
          onDismissed={this._resetIndex}
          isBlocking={false}
          containerClassName="modal ms-u-slideUpIn10"
          ref={modal => (this.modal = modal)}
        >
          <div
            className="modal-container"
            style={backgroundImage}
            onClick={() => this.progressBarGroup.nextBar()}
          >
            <div className="modal-header">
              <ProgressBarGroup
                ref={barGroup => (this.progressBarGroup = barGroup)}
                numImages={images.length}
                onFinishProgress={this.closeModal}
                onNext={this._nextImage}
              />
              <p className="ms-font-m ms-fontColor-neutralLighter ms-fontWeight-semibold">
                {name}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
