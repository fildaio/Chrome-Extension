import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { globalUtils } from "../libs/globalUtils";
import { god } from "../libs/god";
import { WalletList } from "./WalletList";
import { web3Controller } from "../libs/web3Controller";
import BigNumber from "bignumber.js";
import { Tabs } from "../components/Tabs";
import { safeController } from "../libs/safeController";
import { walletsListUpdater } from "../libs/walletsListUpdater";

let currentTabUrlOrigin = "";

export const PopupView = ({ }) => {
	const extensionId = chrome.runtime.id;
	const [wallets, setWallets] = useState([]);
	const [currentWallet, setCurrentWallet] = useState(null);
	const [balance, setBalance] = useState(new BigNumber(0));
	const [web3, setWeb3] = useState(null);
	const [currentTabUrl, setCurrentTabUrl] = useState("");
	const [isOriginProviderSelected, setIsOriginProviderSelected] = useState(true);
	const [indexOfTab, setIndexOfTab] = useState(0);
	const [transactions, setTransactions] = useState([]);

	const getWallets = wallets => {
		console.debug("更新popupView的wallets", wallets);
		setWallets(wallets);
		walletsListUpdater.update(wallets);
	};

	const checkCurrentTab = async () => {
		const tab = await god.getCurrentTab();
		currentTabUrlOrigin = (new URL(tab.url)).origin;

		if (currentTabUrlOrigin.indexOf("chrome://extensions") < 0 && currentTabUrlOrigin.indexOf("chrome://newtab") < 0) {
			setCurrentTabUrl(currentTabUrlOrigin.replace("http://", "").replace("https://", ""));

			god.getItemFromLocalStorage(globalUtils.constants.PROVIDER_SELECTED, providers => {
				setIsOriginProviderSelected(!providers[currentTabUrlOrigin]);
			});
		}
	};

	useEffect(() => {
		god.init(getWallets);

		god.loadCurrentWallet(res => {
			setCurrentWallet(res);
			// god.connectCurrentWallet(res);
		});

		web3Controller.initWithRpc(globalUtils.web3.rpc, web3Bundle => {
			setWeb3(web3Bundle.web3);
			safeController.init(web3Bundle.web3);
		});

		checkCurrentTab();
	}, []);

	useEffect(() => {
		if (!web3 || !currentWallet) {
			return;
		}

		web3Controller.getBalance(currentWallet.address, bal => {
			setBalance(BigNumber(bal));
		});
	}, [web3, currentWallet]);

	const handleImport = walletObj => {
		console.debug("准备添加钱包", walletObj);
		god.pushWallet(walletObj.name, walletObj.address, null);
	};

	const handleOpenCreateView = () => {
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
			walletsListUpdater.update(newWallets);
		});
	};

	const openWalletListModal = () => {
		god.openModal(<WalletList
			walletsGiven={wallets}
			handleConnect={handleConnect}
			handleDelete={handleDelete}
			handleAdd={handleImport}
			handleSync={handleOpenCreateView} />);
	};

	const handleChangeProvider = event => {
		const isMultiSigProvider = event.target.value === globalUtils.constants.PROVIDER_INJECTED;

		chrome.runtime.sendMessage(null, {
			message: globalUtils.messages.SELECT_MULTISIG_PROVIDER,
			data: {
				isMultiSigProvider,
				url: currentTabUrlOrigin
			}
		});

		const toSave = {};
		toSave[currentTabUrlOrigin] = isMultiSigProvider;
		god.setItemInLocalStorage(globalUtils.constants.PROVIDER_SELECTED, toSave, success => {
			setIsOriginProviderSelected(!isMultiSigProvider);
		});
	};

	const handleDeposit = event => {
		// 
	};

	const handleSwitchTab = indexOfItem => {
		setIndexOfTab(indexOfItem);

		if (indexOfItem === 1) {
			safeController.getTransactions(currentWallet.address, async res => {
				const transactionsArray = await safeController.getPagingTransactions(currentWallet.address, res);
				setTransactions(transactionsArray);
			});
		}
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
			<div>
				<img
					src={"chrome-extension://" + extensionId + "/images/link-solid.svg"}
					width="16px" />

				<span>&nbsp;{currentTabUrl}</span>
			</div>

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
					<button
						className="smallButton"
						onClick={handleDeposit}>
						{god.getLocaleString("deposit")}
					</button>
				</div>
			</div>

			<Tabs
				name="accountTabs"
				options={globalUtils.accountTabs}
				onSwitchTab={handleSwitchTab} />

			<div className="tabContent">
				{indexOfTab === 1 && <div>
					asdfasd
				</div>}
			</div>
		</div>}
	</div>
}