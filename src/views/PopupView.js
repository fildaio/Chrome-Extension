import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { globalUtils } from "../libs/globalUtils";
import { god } from "../libs/god";
import { WalletList } from "./WalletList";
import { web3Controller } from "../libs/web3Controller";
import BigNumber from "bignumber.js";
import { Tabs } from "../components/Tabs";

export const PopupView = ({ }) => {
	const [wallets, setWallets] = useState([]);
	const [currentWallet, setCurrentWallet] = useState(null);
	const [balance, setBalance] = useState(new BigNumber(0));
	const [web3, setWeb3] = useState(null);
	const [currentTabUrl, setCurrentTabUrl] = useState("");
	const [isOriginProviderSelected, setIsOriginProviderSelected] = useState(true);

	const getWallets = wallets => {
		setWallets(wallets);
	};

	useEffect(() => {
		god.init(getWallets);

		god.loadCurrentWallet(res => {
			setCurrentWallet(res);
			// god.connectCurrentWallet(res);
		});

		web3Controller.initWithRpc(globalUtils.web3.rpc, web3Bundle => {
			setWeb3(web3Bundle.web3);
		});

		god.getItemFromLocalStorage(globalUtils.constants.CURRENT_TAB_URL, res => {
			setCurrentTabUrl(res.replace("http://", "").replace("https://", ""));

			god.getItemFromLocalStorage(globalUtils.constants.PROVIDER_SELECTED, providers => {
				setIsOriginProviderSelected(!providers[res]);
			});
		});
	}, []);

	useEffect(() => {
		if (!web3 || !currentWallet) {
			return;
		}

		web3Controller.getBalance(currentWallet.address, bal => {
			setBalance(BigNumber(bal));
		});
	}, [web3, currentWallet]);

	const handleOpenCreateView = () => {
		// god.openAddView();
		god.syncFromWalletWebsite();
	};

	const handleConnect = event => {
		const idx = parseInt(event.currentTarget.id);
		const multisigWallet = wallets[idx];
		setCurrentWallet(multisigWallet);
		god.saveCurrentWallet(multisigWallet, null);
		god.connectCurrentWallet(multisigWallet);
		god.closeModal();
	};

	const handleDelete = event => {
		const idx = parseInt(event.currentTarget.id);
		god.spliceWallet(idx, newWallets => {
			setWallets(newWallets);
		});
	};

	const openWalletListModal = () => {
		god.openModal(<WalletList
			wallets={wallets}
			handleConnect={handleConnect}
			handleDelete={handleDelete}
			handleAdd={handleOpenCreateView}
			handleSync={handleOpenCreateView} />);
	};

	const handleChangeProvider = event => {
		chrome.runtime.sendMessage(null, {
			message: globalUtils.messages.SELECT_MULTISIG_PROVIDER,
			data: event.target.value === globalUtils.constants.PROVIDER_INJECTED
		});
	};

	return <div>
		<div className="titleBar">
			<img src="/images/logo32.png" />

			<div className="accountMenu">
				<div className="networkLabel">Elastos</div>

				{currentWallet && <button
					className="smallButton"
					onClick={openWalletListModal}>
					{globalUtils.stringShorten(currentWallet.name, 5)}&nbsp;▾
				</button>}
			</div>
		</div>

		{currentTabUrl && <div className="connectStatusBar">
			<div>{currentTabUrl + " " + god.getLocaleString("connected")}&nbsp;</div>

			<select className="options" onChange={handleChangeProvider}>
				<option
					value={globalUtils.constants.ORIGIN_PROVIDER}
					selected={isOriginProviderSelected}>
					{god.getLocaleString("originProvider")}
				</option>

				<option
					value={globalUtils.constants.PROVIDER_INJECTED}
					selected={!isOriginProviderSelected}>
					{god.getLocaleString("multisigProvider")}
				</option>
			</select>
		</div>}

		{wallets.length === 0 && <div className="coverLayout">
			<div style={{ height: "250px" }} />

			<Button
				label={god.getLocaleString("add") + " / " + god.getLocaleString("import")}
				handleClick={handleOpenCreateView} />
		</div>}

		{/* {!currentWallet && openWalletListModal()} */}

		{wallets.length > 0 && currentWallet && <div className="mainContent">
			<div className="nameBar">
				<div className="name">
					{currentWallet.name}
				</div>

				<div className="address">
					{globalUtils.stringShorten(currentWallet.address, 5, 4)}
				</div>
			</div>

			<div className="balanceBlock">
				<div>
					{globalUtils.formatBigNumber(balance, globalUtils.currency.decimals, globalUtils.currency.fraction, true) + " " + globalUtils.constants.CURRENCY_SYMBOL}
				</div>

				<div className="actions">
					<button className="smallButton">
						{god.getLocaleString("send")}
					</button>
				</div>
			</div>

			<Tabs
				name="accountTabs"
				options={globalUtils.accountTabs} />

			<div className="tabContent"></div>
		</div>}
	</div>
}