import React from "react";
import { god } from "../libs/god";

export const Tabs = ({
	name = "tabs",
	options = []
}) => {
	return <div className="tabs">
		{options.map(option => {
			return <div
				key={option.id}
				className="tab">
				<input
					type="radio"
					name={name}
					id={option.id} />

				<label for={option.id}>
					{god.getLocaleString(option.label)}
				</label>
			</div>
		})}
	</div>
};