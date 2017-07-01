import * as React from "react";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { ProgressBarGroup } from "./progressbargroup";

export interface ImageViewerProps {
  images: string[];
  showModal: boolean;
  close: { (): void };
  name: string;
}

export interface ImageViewerState {
  activeIndex: number;
}

export class ImageViewer extends React.Component<
  ImageViewerProps,
  ImageViewerState
> {
  private progressBarGroup: ProgressBarGroup;
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeIndex: 0
    };

    this._nextImage = this._nextImage.bind(this);
    this._close = this._close.bind(this);
  }

  private _nextImage() {
    this.setState({ activeIndex: this.state.activeIndex + 1 });
  }

  private _close() {
    this.props.close();
    setTimeout(() => {
      this.setState({
        activeIndex: 0
      });
    }, 500);
  }
  render() {
    const { showModal, images, name } = this.props;
    const { activeIndex } = this.state;

    const backgroundImage = {
      backgroundImage: showModal ? `url(${images[activeIndex]})` : ""
    };

    return (
      <Modal
        isOpen={showModal}
        isBlocking={false}
        containerClassName="modal ms-u-slideUpIn10"
      >
        <div
          className="modal-container"
          onClick={() => this.progressBarGroup.nextBar()}
        >
          <div className="modal-header">
            <ProgressBarGroup
              ref={barGroup => (this.progressBarGroup = barGroup)}
              numImages={images.length}
              onFinishProgress={this._close}
              onNext={this._nextImage}
            />
            <p className="ms-font-m ms-fontColor-neutralLighter ms-fontWeight-semibold">
              {name}
            </p>
          </div>
          <img src={images[activeIndex]} alt="image" />
        </div>
      </Modal>
    );
  }
}
