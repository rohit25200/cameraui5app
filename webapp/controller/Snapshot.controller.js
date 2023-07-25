/*eslint-disable no-console, no-alert ,no-debugger*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"CameraFunctionality/libs/Download",
	"sap/m/MessageToast"

], function (Controller, Dialog, Button, Download, MessageToast) {
	"use strict";

	return Controller.extend("CameraFunctionality.controller.Snapshot", {
		onInit: function () {},
		capturePic: function () {
			var that = this;
			this.cameraDialog = new Dialog({
				title: "Click on Capture to take a photo",
				beginButton: new Button({
					text: "Capture",
					press: function (oEvent) {
						that.imageValue = document.getElementById("player");
						var oButton = oEvent.getSource();
						that.imageText = oButton.getParent().getContent()[1].getValue();
						that.cameraDialog.close();
					}
				}),
				content: [
					new sap.ui.core.HTML({
						content: "<video id='player' autoplay></video>"
					}),
					new sap.m.Input({
						placeholder: "Please input image text here",
						required: true
					})
				],
				endButton: new Button({
					text: "Cancel",
					press: function () {
						that.cameraDialog.close();
					}
				})

			});
			this.getView().addDependent(this.cameraDialog);
			this.cameraDialog.open();
			this.cameraDialog.attachBeforeClose(this.setImage, this);
			if (navigator.mdeiaDevices) {
				navigator.mediaDevices.getUserMedia({
					video: true
				}).then(function (stream) {
					player.srcObject = stream;
				});
			}
		},

		setImage: function () {
			var oVBox = this.getView().byId("vBox1");
			var oItems = oVBox.getItems();
			var imageId = 'archie-' + oItems.length;
			var fileName = this.imageText;
			var imageValue = this.imageValue;
			if (imageValue == null) {
				MessageToast.show("No image captured");
			} else {

				var oCanvas = new sap.ui.core.HTML({
					content: "<canvas id='" + imageId + "' width='320px' height='320px' " +
						" style='2px solid red'></canvas> "
				});
				var snapShotCanvas;

				oVBox.addItem(oCanvas);
				oCanvas.addEventDelegate({
					onAfterRendering: function () {
						snapShotCanvas = document.getElementById(imageId);
						var oContext = snapShotCanvas.getContext('2d');
						oContext.drawImage(imageValue, 0, 0, snapShotCanvas.width, snapShotCanvas.height);
						var imageData = snapShotCanvas.toDataURL('image/png');
						var imageBase64 = imageData.substring(imageData.indexOf(",") + 1);
						//	window.open(imageData);  --Use this if you dont want to use third party download.js file 
						download(imageData, fileName + ".png", "image/png");

					}
				});

			}
		}
	});
});