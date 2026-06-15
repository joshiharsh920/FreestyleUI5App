sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, UIComponent, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("joshi.project1trial.controller.MainView", {
        onInit() {
            window.oController = this;
            // sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
            // this.getRouter().initialize();
        },

        onBeforeRendering() {
            var oModel = this.getView().getModel("sapModel");

            var oTabsModel = this.getView().getModel("tabsModel");

            if (oTabsModel && oTabsModel.getData().length > 0) {
                return;
            }

            oModel.read("/ZITBDATASet", {
                urlParameters: {
                    "$expand": "ZTILESETSet"
                },
                success: function (oData) {
                    var oJson = new sap.ui.model.json.JSONModel(oData.results);
                    this.getView().setModel(oJson, "tabsModel");
                    this.onTabSelect();
                }.bind(this),
                error: function (oError) {
                    sap.m.MessageToast.show("Error occurred while fetching data");
                }.bind(this)
            });
        },

        onTabSelect: function (oEvent) {
            if (oEvent)
                var sKey = oEvent.getParameter("key");
            else
                var sKey = "1001";

            var aTabs = this.getView().getModel("tabsModel").getData();

            var oSelectedTab = aTabs.find(function (tab) {
                return tab.ObjectId === sKey;
            });

            oSelectedTab.ZTILESETSet.results.forEach(function (item) {
                if (item.Icon) {
                    item.Icon = item.Icon.toLowerCase().replace('sap-icon://'.toUpperCase(), 'sap-icon://');
                }
            });
            // Set tiles for selected tab
            var oTileModel = new sap.ui.model.json.JSONModel(
                oSelectedTab.ZTILESETSet.results
            );

            this.getView().setModel(oTileModel, "tileModel");
        },

        onAfterRendering() {
            // var oModel = this.getView().getModel("sapModel");

            // oModel.read("/ZTESTHARSHDemo", {
            //     success: function (oData) {

            //         // FIX: flatten structure
            //         var oJSONModel = new sap.ui.model.json.JSONModel();
            //         oJSONModel.setData({
            //             results: oData.results
            //         });

            //         this.getView().setModel(oJSONModel, "orders");
            //     }.bind(this)
            // });
        },

      
        onCreate: function () {

            var oDialog = this._oDialog;
            var oData = oDialog.getModel("new").getData();

            var oModel = this.getView().getModel("sapModel");

            oModel.create("/ZTESTHARSHDemo", oData, {

                success: function (oData, oResponse) {
                    sap.m.MessageToast.show("Created successfully");

                    oDialog.close();

                    // refresh data
                    this._loadData();

                }.bind(this),

                error: function (oError, oResponse) {
                    sap.m.MessageBox.error("Create failed");
                }

            });
        },

        _loadData: function () {

            var oModel = this.getView().getModel("sapModel");

            oModel.read("/ZTESTHARSHDemo", {
                success: function (oData) {

                    var oJSONModel = new sap.ui.model.json.JSONModel();
                    oJSONModel.setData({
                        results: oData.results
                    });

                    this.getView().setModel(oJSONModel, "orders");

                }.bind(this)
            });
        },

        onTilePress: function (oEvent) {
            var oTile = oEvent.getSource();
            var sTitle = oTile.getHeader();

            if (sTitle == "CUSTOMER REGISTRATION") {
                var oModel = this.getView().getModel("sapModel");

                oModel.read("/ZFORMDATASet", {
                    success: function (oData) {
                        oController.stepNo = oData.results[0].Stepno;
                        oController.formType = oData.results[0].Formtype;
                        oController.Formid = oData.results[0].Formid;

                        sTitle = oController.formType;
                        this.getOwnerComponent().getRouter().navTo(sTitle, {
                            formId: oController.Formid
                        });

                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("Error occurred while fetching data");
                    }.bind(this)
                });

            } else {
                this.getOwnerComponent().getRouter().navTo("CAPService");
            }
        },

    });
});