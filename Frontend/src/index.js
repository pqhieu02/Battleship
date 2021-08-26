/* eslint-disable */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import App from "./App.js";

library.add(fab, fas, far);
ReactDOM.render(<App />, document.getElementById("screen"));

