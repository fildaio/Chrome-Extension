import React, { useEffect, useState } from "react";
import { globalUtils } from "../libs/globalUtils";
import { web3Controller } from "../libs/web3Controller";
import { safeController } from "../libs/safeController";
import { jesus } from "../libs/Jesus";

export const AddView = ({ web3 = null }) => {
	const [extensionId, setExtensionId] = useState("");
	const [step, setStep] = useState(globalUtils.AddSteps.IDLE);
	const [account, setAccount] = useState("");
	const [addOption, setAddOption] = useState(-1);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");

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

	const handleRestore = _ => {
		if (!web3Controller.isAddress(address)) {
			return window.alert(jesus.getLocaleString("enterValidAddress"));
		}

		safeController.isOwner(address, account, result => {
			if (result) {
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
					window.alert("添加好了！");
				});
			} else {
				window.alert(jesus.getLocaleString("notMultiSigWallet"));
			}
		});
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
			{globalUtils.addTabs.map(option => {
				return <div>
					<input
						type="radio"
						name={globalUtils.constants.ADD_OPTIONS}
						id={option.value}
						onChange={handleChoiceAddOption} />

					<label for={option.id}>
						{jesus.getLocaleString(option.label)}
					</label>
				</div>
			})}

			<button onClick={handleNext}>{jesus.getLocaleString("next")}</button>
		</div>}

		{step === globalUtils.AddSteps.CREAT && <div></div>}

		{step === globalUtils.AddSteps.RESTORE && <div>
			<input
				type="text"
				placeholder={jesus.getLocaleString("name")}
				onChange={handleInputName} />

			<input
				type="text"
				placeholder={jesus.getLocaleString("address")}
				onChange={handleInputAddress} />

			<button onClick={handleRestore}>{jesus.getLocaleString("ok")}</button>
		</div>}
	</div>
};