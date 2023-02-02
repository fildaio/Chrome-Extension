import React, { useEffect, useState } from "react";
import { globalUtils } from "../libs/globalUtils";
import { god } from "../libs/god";
import { safeController } from "../libs/safeController";
import { walletsListUpdater } from "../libs/walletsListUpdater";
import { web3Controller } from "../libs/web3Controller";
import { Modal } from "./Modal";

export const WalletList = ({
	walletsGiven = [],
	handleConnect = () => { },
	handleDelete = () => { },
	handleAdd = () => { },
	handleSync = () => { }
}) => {
	const [wallets, setWallets] = useState(walletsGiven);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");

	useEffect(() => {
		walletsListUpdater.clientCall = setWallets;
	}, []);
	console.debug("WalletList里的props.wallets", walletsGiven, wallets);

	// useEffect(() => {
	// 	setWallets([...walletsGiven]);
	// }, [walletsGiven])

	const handleCloseModal = () => {
		god.closeModal();
	};

	const handleChangeName = event => {
		setName(event.currentTarget.value.trim());
	};

	const handleChangeAddress = event => {
		setAddress(event.currentTarget.value.trim());
	};

	const handleImport = _ => {
		if (!web3Controller.isAddress(address)) {
			window.alert(god.getLocaleString("enterValidAddress"));
			setAddress("");
			return;
		}

		safeController.isOwner(address, "", isOwner => {
			if (isOwner) {
				handleAdd({ name, address });
			} else {
				window.alert(god.getLocaleString("notMultiSigWallet"));
				setAddress("");
			}
		});
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

			<div className="walletListInput">
				<input
					type="text"
					className="name"
					placeholder={globalUtils.constants.NAME}
					maxLength={10}
					onChange={handleChangeName} />

				<input
					style={{ width: "100%" }}
					type="text"
					className="address"
					placeholder={globalUtils.constants.MULTISIG_WALLET_ADDRESS}
					onChange={handleChangeAddress} />

				<button
					className="smallButton"
					onClick={handleImport}
					disabled={!name || !address}>
					{god.getLocaleString("add")}
				</button>
			</div>

			<div className="modalButtons">
				<button
					className="smallButton"
					onClick={handleSync}>
					{god.getLocaleString("syncWithWebsite")}
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