import React from "react";
import { god } from "../libs/god";
import { Modal } from "./Modal";

export const WalletList = ({
	wallets = [],
	handleConnect = () => { },
	handleDelete = () => { },
	handleAdd = () => { }
}) => {
	const handleCloseModal = () => {
		god.closeModal();
	};

	return <Modal>
		<div className="modalLayout">
			<div className="modalTitle">
				{god.getLocaleString("wallets")}
			</div>

			{wallets.map((item, index) => {
				return <div
					key={item.address}
					className="walletListItem">
					<div className="name">{item.name}</div>

					<div className="address">{item.address}</div>

					<div className="buttons">
						<button
							id={index}
							onClick={handleDelete}
							className="smallButton">
							{god.getLocaleString("delete")}
						</button>

						<button
							id={index}
							onClick={handleConnect}
							className="smallButton">
							{god.getLocaleString("open")}
						</button>
					</div>
				</div>
			})}

			<div className="modalButtons">
				<button
					className="smallButton"
					onClick={handleAdd}>
					{god.getLocaleString("add") + " / " + god.getLocaleString("import")}
				</button>

				<button
					className="smallButton"
					onClick={handleCloseModal}>
					{god.getLocaleString("close")}
				</button>
			</div>
		</div>
	</Modal>
};