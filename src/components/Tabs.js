import React, { useState } from "react";
import { god } from "../libs/god";

export const Tabs = ({
	name = "tabs",
	options = [],
	onSwitchTab = () => { }
}) => {
	const [indexOfItemSelected, setIndexOfItemSelected] = useState(0);

	const handleSwitchTab = event => {
		const idx = parseInt(event.target.value);
		setIndexOfItemSelected(idx);
		onSwitchTab(idx);
	};

	return <div className="tabs">
		{options.map(option => {
			return <div
				key={option.id}
				className="tab">
				<input
					type="radio"
					name={name}
					id={option.id}
					value={option.value}
					onChange={handleSwitchTab} />

				<label for={option.id}>
					{god.getLocaleString(option.label)}
				</label>
			</div>
		})}
	</div>
};