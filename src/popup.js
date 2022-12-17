import React from "react";
import ReactDOM from "react-dom";
import { PopupView } from "./views/PopupView";

window.onload = () => {
	ReactDOM.render(<PopupView />, document.getElementById("popupWindow"));
};