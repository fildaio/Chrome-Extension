import React, { useEffect, useState } from "react";
import { globalUtils } from "../libs/globalUtils";
import { web3Controller } from "../libs/web3Controller";
import { safeController } from "../libs/safeController";
import { jesus } from "../libs/Jesus";

export const AddView = ({ onClose = null }) => {
	const [extensionId, setExtensionId] = useState("");
	const [step, setStep] = useState(globalUtils.AddSteps.IDLE);
	const [account, setAccount] = useState("");
	const [addOption, setAddOption] = useState(-1);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [ownerAddress, setOwnerAddress] = useState("");
	const [owners, setOwners] = useState([]);
	const [requiredConfirmations, setRequiredConfirmations] = useState(1);
	const [dailyLimit, setDailyLimit] = useState(0);

	useEffect(() => {
		if (jesus.walletConnected === globalUtils.WalletConnected.IDLE) {
			setStep(globalUtils.AddSteps.CONNECT_WALLET);
		}

		setExtensionId(document.getElementById(globalUtils.constants.SHOW_ADD_VIEW).className);
	}, []);

	const handleConnectMetamask = _ => {
		if (window.ethereum) {
			web3Controller.connect(
				globalUtils.WalletTitle.METAMASK,
				window.ethereum,
				(web3Bundle) => {
					setAccount(web3Bundle.account);
					setStep(globalUtils.AddSteps.ADD_OPTIONS);
					safeController.init(web3Bundle.web3);
				}
			);
		} else {
			window.alert(jesus.getLocaleString("metaMaskNotInstalled"));
		}
	};

	const handleChoiceAddOption = event => {
		setAddOption(parseInt(event.target.id));
	};

	const handleNext = _ => {
		if (addOption === 0) {
			setStep(globalUtils.AddSteps.CREAT);
		}

		if (addOption === 1) {
			setStep(globalUtils.AddSteps.RESTORE);
		}
	};

	const handleInputName = event => {
		setName(event.currentTarget.value);
	};

	const handleInputAddress = event => {
		setAddress(event.currentTarget.value);
	};

	const sendAddedMessage = (name, address) => {
		let editorExtensionId = extensionId;
		if (!editorExtensionId) {
			editorExtensionId = document.getElementById(globalUtils.constants.SHOW_ADD_VIEW).className;
		}

		chrome.runtime.sendMessage(editorExtensionId, {
			message: globalUtils.messages.RESTORED,
			data: {
				name,
				address
			}
		}, response => {
			setName("");
			setAddress("");
			setStep(globalUtils.AddSteps.ADD_OPTIONS);
		});
	};

	const handleDeploy = () => {
		const ownerAddresses = [account];
		owners.map(owner => {
			ownerAddresses.push(owner.address);
		});

		safeController.deploy(
			ownerAddresses,
			requiredConfirmations,
			dailyLimit,
			account,
			deployed => {
				sendAddedMessage(name, deployed);
			}
		);
	};

	const handleRestore = _ => {
		if (!web3Controller.isAddress(address)) {
			return window.alert(jesus.getLocaleString("enterValidAddress"));
		}

		safeController.isOwner(address, account, result => {
			if (result) {
				sendAddedMessage(name, address);
			} else {
				window.alert(jesus.getLocaleString("notMultiSigWallet"));
			}
		});
	};

	const handleRemoveOwner = event => {
		const idx = parseInt(event.currentTarget.id);
		owners.splice(idx, 1);
		setOwners([...owners]);
	};

	const handleInputOwnerName = event => {
		setOwnerName(event.currentTarget.value);
	};

	const handleInputOwnerAddress = event => {
		const val = event.currentTarget.value;

		if (val.toLocaleLowerCase() === account.toLocaleLowerCase()) {
			return window.alert(jesus.getLocaleString("enterValidAddress"));
		}

		setOwnerAddress(val);
	};

	const handleAddOwner = () => {
		if (!web3Controller.isAddress(ownerAddress)) {
			return window.alert(jesus.getLocaleString("enterValidAddress"));
		}

		owners.push({
			name: ownerName,
			address: ownerAddress
		});
		setOwners([...owners]);
	};

	const handleChangeRequiredConfirmations = event => {
		const val = parseInt(event.currentTarget.value);
		if (!isNaN(val)) {
			setRequiredConfirmations(val);
		}
	};

	const handleChangeDailyLimit = event => {
		const val = parseInt(event.currentTarget.value);
		if (!isNaN(val)) {
			setDailyLimit(val);
		}
	};

	return <div className="fmwe_modal">
		<h1 className="modalTitle">{globalUtils.constants.APP_TITLE}</h1>

		{step === globalUtils.AddSteps.CONNECT_WALLET && <div>
			<div className="h2">{jesus.getLocaleString("connectWallet")}</div>

			<button
				className="fmwe_button"
				onClick={handleConnectMetamask}>
				<div className="button_content">
					{extensionId && <span>
						<img src={"chrome-extension://" + extensionId + "/images/metamask.png"} />
					</span>}

					<span>Metamask</span>
				</div>
			</button>
		</div>}

		{step === globalUtils.AddSteps.ADD_OPTIONS && <div>
			<div className="h2">{jesus.getLocaleString("addWallet")}</div>

			{globalUtils.addTabs.map(option => {
				return <div>
					<input
						type="radio"
						name={globalUtils.constants.ADD_OPTIONS}
						id={option.value}
						onChange={handleChoiceAddOption} />

					<label
						for={option.id}
						className="fmwe_label">
						{jesus.getLocaleString(option.label)}
					</label>
				</div>
			})}
		</div>}

		{step === globalUtils.AddSteps.CREAT && <div>
			<div className="h2">{jesus.getLocaleString("deployNewWallet")}</div>

			<div className="fmwe_inputs">
				<input
					type="text"
					placeholder={jesus.getLocaleString("name")}
					onChange={handleInputName} />

				<input
					type="number"
					min={1}
					step={1}
					defaultValue={1}
					placeholder={jesus.getLocaleString("requiredConfirmations")}
					onChange={handleChangeRequiredConfirmations} />

				<input
					type="number"
					min={0}
					step={1}
					defaultValue={0}
					placeholder={jesus.getLocaleString("dailyLimit") + "(" + globalUtils.constants.CURRENCY_SYMBOL + ")"}
					onChange={handleChangeDailyLimit} />

				<table className="fmwe_table">
					<caption>
						{jesus.getLocaleString("owners")}
					</caption>

					<thead>
						<tr>
							<th>{jesus.getLocaleString("name")}</th>
							<th>{jesus.getLocaleString("address")}</th>
							<th>{jesus.getLocaleString("action")}</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{jesus.getLocaleString("myAccount")}</td>
							<td>{account}</td>
							<td></td>
						</tr>

						{owners.map((owner, index) => {
							return <tr>
								<td>{owner.name}</td>

								<td>{owner.address}</td>

								<td>
									<button
										id={index}
										className="fmwe_small_button"
										onClick={handleRemoveOwner}>
										{jesus.getLocaleString("remove")}
									</button>
								</td>
							</tr>
						})}

						<tr>
							<td>
								<input
									type="text"
									placeholder={jesus.getLocaleString("name")}
									onChange={handleInputOwnerName} />
							</td>

							<td>
								<input
									type="text"
									placeholder={jesus.getLocaleString("address")}
									onChange={handleInputOwnerAddress} />
							</td>

							<td>
								<button
									className="fmwe_small_button"
									onClick={handleAddOwner}
									disabled={!ownerName || !ownerAddress}>
									{jesus.getLocaleString("add")}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>}

		{step === globalUtils.AddSteps.RESTORE && <div>
			<div className="h2">{jesus.getLocaleString("restoreDeployedWallet")}</div>

			<div className="fmwe_inputs">
				<input
					type="text"
					placeholder={jesus.getLocaleString("name")}
					onChange={handleInputName} />

				<input
					type="text"
					placeholder={jesus.getLocaleString("address")}
					onChange={handleInputAddress} />
			</div>
		</div>}

		<div className="buttons">
			{step === globalUtils.AddSteps.ADD_OPTIONS && <button
				className="fmwe_small_button"
				onClick={handleNext}>
				{jesus.getLocaleString("next")}
			</button>}

			{step === globalUtils.AddSteps.RESTORE && <button
				className="fmwe_small_button"
				onClick={handleRestore}>
				{jesus.getLocaleString("restore")}
			</button>}

			{step === globalUtils.AddSteps.CREAT && <button
				className="fmwe_small_button"
				onClick={handleDeploy}
				disabled={!name}>
				{jesus.getLocaleString("deploy")}
			</button>}

			<button
				className="fmwe_small_button"
				onClick={onClose}>
				{jesus.getLocaleString("close")}
			</button>

			{/* <button
				className="fmwe_small_button"
				onClick={event => {
					console.log("chrome:", chrome);
					console.log("chrome.action:", chrome.action);
				}}>弹出</button> */}
		</div>
	</div>
};