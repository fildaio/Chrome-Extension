import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { globalUtils } from "../libs/globalUtils";
import { god } from "../libs/god";

export const PopupView = ({ }) => {
	const [wallets, setWallets] = useState([]);
	const [currentWallet, setCurrentWallet] = useState(null);

	const getWallets = wallets => {
		setWallets(wallets);
	};

	useEffect(() => {
		god.init(getWallets);
	}, []);

	const handleOpenCreateView = () => {
		god.openAddView();
	};

	const handleConnect = event => {
		const idx = parseInt(event.currentTarget.id);
		const multisigWallet = wallets[idx];
		setCurrentWallet(multisigWallet);
		god.saveCurrentWallet(multisigWallet, null);
		god.connectCurrentWallet(multisigWallet);
	};

	return <div>
		<h1>{globalUtils.constants.APP_TITLE}</h1>

		{wallets.length === 0 && <Button
			label={god.getLocaleString("add") + "/" + god.getLocaleString("import")}
			handleClick={handleOpenCreateView} />}

		{!currentWallet && wallets.map((item, index) => {
			return <div
				key={item.address}>
				<div>{item.name}</div>

				<div>{item.address}</div>

				<div>
					<button id={item.name}>
						{god.getLocaleString("delete")}
					</button>

					<button
						id={index}
						onClick={handleConnect}>
						{god.getLocaleString("connect")}
					</button>
				</div>
			</div>
		})}

		{currentWallet && <div>
			<h2>{currentWallet.name}</h2>
			<div>{currentWallet.address}</div>
		</div>}
	</div>
}