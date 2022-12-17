import React, { useEffect, useState } from "react";
import { globalUtils } from "../libs/globalUtils";
import { god } from "../libs/god";
import { modalStyles } from "../styles/modalStyles";
import { web3Controller } from "../libs/web3Controller";
import { safeController } from "../libs/safeController";

export const AddView = ({ web3 = null }) => {
	const [step, setStep] = useState(globalUtils.AddSteps.IDLE);
	const [account, setAccount] = useState("");
	const [addOption, setAddOption] = useState(-1);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");

	useEffect(() => {
		god.init();

		if (god.walletConnected === globalUtils.WalletConnected.IDLE) {
			setStep(globalUtils.AddSteps.CONNECT_WALLET);
		}
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
			window.alert(god.getLocaleString("metaMaskNotInstalled"));
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
			return window.alert(god.getLocaleString("enterValidAddress"));
		}

		safeController.isOwner(address, account, result => {
			if (result) {
				var editorExtensionId = document.getElementById(globalUtils.constants.SHOW_ADD_VIEW).className;
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
				window.alert(god.getLocaleString("notMultiSigWallet"));
			}
		});
	};

	return <div style={modalStyles.modal}>
		<h1 style={modalStyles.modalTitle}>{globalUtils.constants.APP_TITLE}</h1>

		{step === globalUtils.AddSteps.CONNECT_WALLET && <div>
			<button onClick={handleConnectMetamask}>Metamask</button>
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
						{god.getLocaleString(option.label)}
					</label>
				</div>
			})}

			<button onClick={handleNext}>{god.getLocaleString("next")}</button>
		</div>}

		{step === globalUtils.AddSteps.CREAT && <div></div>}

		{step === globalUtils.AddSteps.RESTORE && <div>
			<input
				type="text"
				placeholder={god.getLocaleString("name")}
				onChange={handleInputName} />

			<input
				type="text"
				placeholder={god.getLocaleString("address")}
				onChange={handleInputAddress} />

			<button onClick={handleRestore}>{god.getLocaleString("ok")}</button>
		</div>}
	</div>
};