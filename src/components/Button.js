import React from "react";

export const Button = ({
	label = "",
	handleClick = () => { }
}) => {
	return <div className="button">
		<button onClick={handleClick}>{label}</button>
	</div>
};