import React from "react";
import ReactDOM from "react-dom";
import { AddView } from "./views/AddView";

const main = () => {
	const div = document.createElement("div");
	div.style = "width: 100vw; height: 100vh; position: absolute; left: 0; top: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;"
	document.body.appendChild(div);

	const closeModal = () => {
		ReactDOM.unmountComponentAtNode(div);
		document.body.removeChild(div);
	};

	const theView = <AddView onClose={closeModal} />

	ReactDOM.render(theView, div);
};

main();