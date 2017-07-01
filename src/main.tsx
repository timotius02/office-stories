import * as React from "react";
import { render } from "react-dom";
import { App } from "./components/app";
import { Progress } from "./components/progress";
import "./assets/styles/global.scss";
import config from "./config";
import * as firebase from "firebase";

(() => {
  const title = "Stories";
  const container = document.querySelector("#container");

  /* Render application after Office initializes */
  Office.initialize = () => {
    firebase.initializeApp(config);
    render(<App title={title} />, container);
  };

  /* Initial render showing a progress bar */
  render(
    <Progress
      title={title}
      message="Please sideload your addin to see app body."
    />,
    container
  );
})();
