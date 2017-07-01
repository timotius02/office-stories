import * as React from "react";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import Webcam from "./react-webcam";
import { processPurple, processSepia, processGreyscale } from "./filter";

import * as firebase from "firebase";

export interface CameraButtonProps {
  name: string;
}

export interface CameraButtonState {
  showModal: boolean;
  editing: boolean;
  activeFilter: number;
}

export class CameraButton extends React.Component<
  CameraButtonProps,
  CameraButtonState
> {
  private webcam: Webcam;
  private modalContainer: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private canvasPurple: HTMLCanvasElement;
  private canvasGreyscale: HTMLCanvasElement;
  private canvasSepia: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private input: HTMLInputElement;
  private self: any;
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      editing: false,
      activeFilter: 0
    };

    this.self = this;

    this._showCamera = this._showCamera.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._capture = this._capture.bind(this);
    this._nextFilter = this._nextFilter.bind(this);
    this._prevFilter = this._prevFilter.bind(this);
    this._send = this._send.bind(this);
    this._uploadFile = this._uploadFile.bind(this);
    this._onSubmitUpload = this._onSubmitUpload.bind(this);
    this._processImage = this._processImage.bind(this);
  }

  private _processImage(image, options = { cover: false }) {
    this.canvas.width = this.modalContainer.offsetWidth;
    this.canvas.height = this.modalContainer.offsetHeight;

    this.canvasPurple.width = this.modalContainer.offsetWidth;
    this.canvasPurple.height = this.modalContainer.offsetHeight;

    this.canvasGreyscale.width = this.modalContainer.offsetWidth;
    this.canvasGreyscale.height = this.modalContainer.offsetHeight;

    this.canvasSepia.width = this.modalContainer.offsetWidth;
    this.canvasSepia.height = this.modalContainer.offsetHeight;

    this.ctx = this.canvas.getContext("2d");

    let newWidth, newHeight, x, y;
    if (options.cover) {
      // scale to match height
      newWidth = this.canvas.height * (image.width / image.height);
      newHeight = this.canvas.height;

      x = (this.canvas.width - image.width) * 0.5;
      y = (this.canvas.height - image.height) * 0.5;
    } else {
      const testWidth = this.canvas.height * (image.width / image.height);
      const testHeight = this.canvas.width * (image.height / image.width);

      // scale to height fits
      if (testWidth <= this.canvas.width) {
        newWidth = testWidth;
        newHeight = this.canvas.height;
      } else {
        // scale to width fits
        newWidth = this.canvas.width;
        newHeight = testHeight;
      }

      x = this.canvas.width / 2 - newWidth / 2;
      y = this.canvas.height / 2 - newHeight / 2;
    }

    this.ctx.drawImage(image, x, y, newWidth, newHeight);

    const ctxPurple = this.canvasPurple.getContext("2d");
    ctxPurple.drawImage(image, x, y, newWidth, newHeight);
    processPurple(ctxPurple, this.canvasPurple);

    const ctxGreyscale = this.canvasGreyscale.getContext("2d");
    ctxGreyscale.drawImage(image, x, y, newWidth, newHeight);
    processGreyscale(ctxGreyscale, this.canvasGreyscale);

    const ctxSepia = this.canvasSepia.getContext("2d");
    ctxSepia.drawImage(image, x, y, newWidth, newHeight);
    processSepia(ctxSepia, this.canvasSepia);
  }
  private _capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    var image = new Image();
    image.onload = () => {
      this._processImage(image, { cover: true });
    };
    image.src = imageSrc;
    this.setState({ editing: true });
  };
  private _uploadFile() {
    this.input.click();
  }

  private _onSubmitUpload() {
    var file = this.input.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var image = new Image();
      image.onload = () => {
        this.setState({ editing: true }, () => {
          this._processImage(image, { cover: false });
        });
      };
      image.src = reader.result;
    };
    reader.onerror = error => {
      console.log("Error: ", error);
    };
  }
  private _showCamera(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }
  private _prevFilter() {
    // TODO: NOT Hardcore number of filters
    if (this.state.activeFilter - 1 < 0) {
      this.setState({ activeFilter: 3 });
    } else {
      this.setState({ activeFilter: this.state.activeFilter - 1 });
    }
  }
  private _nextFilter() {
    // TODO: NOT Hardcore number of filters
    if (this.state.activeFilter + 1 >= 4) {
      this.setState({ activeFilter: 0 });
    } else {
      this.setState({ activeFilter: this.state.activeFilter + 1 });
    }
  }
  private _send() {
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    const imageRefName = user.uid + "/" + Date.now() + ".png";
    const imageRef = storageRef.child(imageRefName);

    let dataURL;

    switch (this.state.activeFilter) {
      case 0:
        dataURL = this.canvas.toDataURL();
        break;
      case 1:
        dataURL = this.canvasPurple.toDataURL();
        break;
      case 2:
        dataURL = this.canvasGreyscale.toDataURL();
        break;
      case 3:
        dataURL = this.canvasSepia.toDataURL();
        break;
    }

    imageRef.putString(dataURL, "data_url").then(() => {
      firebase
        .database()
        .ref("users/" + user.uid + "/images")
        .push(imageRefName);
      this.closeModal();
    });
  }
  closeModal() {
    this.setState({ showModal: false, editing: false, activeFilter: 0 });
  }
  render() {
    const { name } = this.props;
    const { showModal, editing, activeFilter } = this.state;

    const filters = [
      canvas => {
        this.canvas = canvas;
      },
      canvas => {
        this.canvasPurple = canvas;
      },
      canvas => {
        this.canvasGreyscale = canvas;
      },
      canvas => {
        this.canvasSepia = canvas;
      }
    ].map((func, index) => {
      return (
        <canvas
          className="editor"
          key={"canvas" + index}
          ref={func}
          style={{ zIndex: activeFilter === index ? 1 : -1 }}
        />
      );
    });

    return (
      <div>
        <a onClick={this._showCamera}>
          <div className="camera-button">
            <i
              className="ms-Icon ms-Icon--Camera ms-font-xxl ms-fontColor-neutralPrimary "
              aria-hidden="true"
            />
          </div>
          <Label className="fontSize-xs">{name}</Label>
        </a>
        <Modal
          isOpen={showModal}
          isBlocking={false}
          onDismiss={this.closeModal}
          containerClassName="camera-modal ms-u-slideUpIn10"
        >
          <div
            className="camera-container"
            ref={container => {
              this.modalContainer = container;
            }}
          >
            <div className="webcam-cancel" onClick={this.closeModal}>
              <i
                className="ms-Icon ms-Icon--Cancel ms-font-xl ms-fontColor-white"
                aria-hidden="true"
              />
            </div>

            {editing
              ? <div className="editor-prev" onClick={this._prevFilter}>
                  <i
                    className="ms-Icon ms-Icon--ChevronLeft ms-font-xxl ms-fontColor-white "
                    aria-hidden="true"
                  />
                </div>
              : null}
            {editing
              ? <div className="editor-next" onClick={this._nextFilter}>
                  <i
                    className="ms-Icon ms-Icon--ChevronRight ms-font-xxl ms-fontColor-white "
                    aria-hidden="true"
                  />
                </div>
              : null}

            {editing
              ? null
              : <div className="webcam-upload" onClick={this._uploadFile}>
                  <i
                    className="ms-Icon ms-Icon--Upload ms-font-xxl ms-fontColor-white "
                    aria-hidden="true"
                  />
                  <input
                    type="file"
                    ref={input => (this.input = input)}
                    style={{ visibility: "hidden" }}
                    onChange={this._onSubmitUpload.bind(this)}
                  />
                </div>}

            {editing
              ? null
              : <div className="webcam-button" onClick={this._capture}>
                  <i
                    className="ms-Icon ms-Icon--Camera ms-font-xxl ms-fontColor-white "
                    aria-hidden="true"
                  />
                </div>}

            {editing
              ? <div className="editor-send" onClick={this._send}>
                  <i
                    className="ms-Icon ms-Icon--CheckMark ms-font-xxl ms-fontColor-white "
                    aria-hidden="true"
                  />
                </div>
              : null}

            {editing
              ? filters
              : <Webcam
                  audio={false}
                  height={582}
                  ref={webcam => {
                    this.webcam = webcam;
                  }}
                  screenshotFormat="image/jpeg"
                  width={330}
                  className="webcam"
                  mirror={true}
                />}
          </div>
        </Modal>
      </div>
    );
  }
}
