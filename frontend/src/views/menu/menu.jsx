/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuHeader from "./menuHeader/MenuHeader";
import API from "../../API";
import ProfileSettings from "./profileOptions/ProfileSettings";
import jsreport from '@jsreport/browser-client';

export default function Menu(props) {
	const openMenuSettings = () => {
		document
			.getElementsByClassName("MenuSettings__main-container")[0]
			.classList.remove("MenuSettings__hidden");
	};

	const openProfileSettings = () => {
		document
			.getElementsByClassName("profileSettings_container")[0]
			.classList.remove("profileSettings__hidden");
	};

	const reportGenerator = async () => {
		const data = await API.fetchResources();
		const payload = {
			"data": data
		};
		console.log(payload)

		jsreport.serverUrl = 'http://localhost:5488'
		const report = await jsreport.render({
			template: {
				name: 'Test1'
			},
			data: JSON.stringify(payload)
		});

		report.openInWindow({ title: 'myreport' });
	};

	return (
		<div
			className={
				window.matchMedia("(max-width:1100px)").matches
					? "profile-menu-mobile"
					: "profile-menu-desktop"
			}
		>
			<MenuHeader
				backTo={() => {
					props.handleCloseMenu();
				}}
			/>
			<ul>
				<li>
					<a
						onClick={() => {
							openProfileSettings();
						}}
					>
						PROFILE
					</a>
					<ProfileSettings />
				</li>
				<li>
					<a
						onClick={() => {
							openMenuSettings();
						}}
					>
						Settings
					</a>
					<MenuSettings />
				</li>
				<li>
					<a onClick={(event) => {
						event.preventDefault();
						window.location.href = "http://localhost:3002"
					}
					}>Help</a>
				</li>
				<li>
					<a onClick={() => { reportGenerator() }}>Report</a>
				</li>
				<li>
					<a onClick={API.logout}>Log out</a>
				</li>
			</ul>
		</div>
	);
}
