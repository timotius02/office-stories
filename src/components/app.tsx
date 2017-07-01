import * as React from "react";
import { Header } from "./header";
import { Story } from "./story";
import { Storyline } from "./storylines";
import { CameraButton } from "./camerabutton";
import { TextField, ITextField } from "office-ui-fabric-react/lib/TextField";
import * as firebase from "firebase";

import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";

export interface AppProps {
  title: string;
}

export interface AppState {
  user: any;
  signup: boolean;
}

export class App extends React.Component<AppProps, AppState> {
  private email: ITextField;
  private password: ITextField;
  private password2: ITextField;
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: null,
      signup: false
    };

    this._signup = this._signup.bind(this);
    this._login = this._login.bind(this);
    this._getErrorMessage = this._getErrorMessage.bind(this);
  }

  click = async () => {
    await Word.run(async context => {
      /**
             * Insert your Word code here
             */
      await context.sync();
    });
  };
  private _signup(): void {
    if (!this.state.signup) {
      this.setState({ signup: true });
    } else {
      const email = this.email.value;
      const password = this.password.value;

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          this.setState({ user });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorName = error.name;
          var errorMessage = error.message;

          console.error(errorName, errorMessage);
        });
    }
  }
  private _login(): void {
    if (this.state.signup) {
      this.setState({ signup: false });
    } else {
      const email = this.email.value;
      const password = this.password.value;

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          this.setState({ user });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorName = error.name;
          var errorMessage = error.message;
          console.error(errorName, errorMessage);
        });
    }
  }
  private _getErrorMessage(value: string): string {
    return value === this.password.value ? "" : `The passwords must match. `;
  }

  componentDidMount(): void {
    const user = firebase.auth().currentUser;

    // Check if there's already a logged in user
    if (user) {
      this.setState({ user });
    }
  }
  render() {
    const { user, signup } = this.state;
    return user
      ? <div>
          <Header title={"Stories"} />
          <section className="my-stories">
            <h1 className="ms-font-xl ">My Stories</h1>
            <div className="stories">
              <CameraButton name="Take Picture" />
              <Story name="My Story" self />
              <Story name="John Doe" />
              <Story name="John Doe" />
              <Story name="Timotius Sitorus" />
              <Story name="Timotius Sitorus" />
              <Story name="Timotius Sitorus" />
            </div>
          </section>
          <section className="featured-stories">
            <h1 className="ms-font-xl ">Featured Stories</h1>
            <div className="storylines">
              <Storyline
                name="MHacks"
                image="https://mhacks.org/36cbd119fd0d11f8c2e6d34e328adf98.png"
              />
              <Storyline
                name="New York City"
                image="https://media-cdn.tripadvisor.com/media/photo-s/0e/9a/e3/1d/freedom-tower.jpg"
              />
              <Storyline
                name="Timotius Sitorus"
                image="http://timsitorus.com/blog/public/pic.jpg"
              />
              <Storyline
                name="MHacks"
                image="https://mhacks.org/36cbd119fd0d11f8c2e6d34e328adf98.png"
              />
            </div>
          </section>
        </div>
      : <div>
          <Header title={"Stories"} />
          <section className="my-stories">

            <TextField
              label="Email"
              required={true}
              placeholder="coostories@bro.xyz"
              componentRef={email => {
                this.email = email;
              }}
            />
            <TextField
              required={true}
              label="Password"
              type="password"
              placeholder="**********"
              componentRef={password => {
                this.password = password;
              }}
            />
            {signup
              ? <TextField
                  label="Re-Enter Password"
                  type="password"
                  required={true}
                  placeholder="**********"
                  onGetErrorMessage={this._getErrorMessage}
                  componentRef={password2 => {
                    this.password2 = password2;
                  }}
                />
              : null}
            <div className="login-buttons">
              <PrimaryButton
                text="Login"
                style={{
                  backgroundColor: signup ? "#f4f4f4" : "#00B294",
                  color: signup ? "#333" : "#fff"
                }}
                onClick={this._login}
              />
              <DefaultButton
                iconProps={{ iconName: "Add" }}
                description="Click to create an account"
                text="Create account"
                style={{
                  backgroundColor: signup ? "#00B294" : "#f4f4f4",
                  color: signup ? "#fff" : "#333"
                }}
                onClick={this._signup}
              />
            </div>

          </section>
        </div>;
  }
}
