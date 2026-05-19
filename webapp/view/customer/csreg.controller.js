sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("joshi.project1trial.view.customer.csreg", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("CSREG")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            window.oController = this;
            const oArgs = oEvent.getParameter("arguments");
            var oCSRegModel = new sap.ui.model.json.JSONModel({
                Customerid: "",
                Id: "AADHAR",
                Idnumber: "",
                Zfirstname: "HARSH",
                Zlastname: "JOSHI",
                Age: "",
                Religion: "",
                Email: "",
                Phonenumber: "",
                Homeadd: "",
                Remarks: ""
            }
            );
            debugger;
            var oModel = this.getView().getModel("sapModel");
            oModel.read("/CustomeTileSet", {
                success: function (oData, oResponse) {
                    oController.Formid = oData.results[0].Formid;
                    oCSRegModel.setData(oData.results[0]);
                    oCSRegModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                    this.getView().setModel(oCSRegModel, "csregModel");
                    MessageToast.success("Customer ID created successfully!");
                }.bind(this),
                error: function (oError, oResponse) {
                }.bind(this)
            }
            );


            oCSRegModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oCSRegModel, "csregModel");


        },
        onNavigateToHome: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView");
        },
        fnStepActivate: function () {
            MessageToast.show("Step 2 Activated");
        },
        fnStep1Complete: function () {
            var oModel = this.getView().getModel("sapModel");
            var regModel = this.getView().getModel("csregModel").getData();
            regModel.Customerid = +regModel.Customerid;
            regModel.Phonenumber = +regModel.Phonenumber;
            regModel.Age = +regModel.Age;
            regModel.Idnumber = +regModel.Idnumber;
            regModel.Formid = oController.Formid.toString();
            oModel.create("/CustomeTileSet", this.getView().getModel("csregModel").getData(), {
                success: function (oData, oResponse) {
                    MessageBox.success("Customer ID created successfully!");
                }.bind(this),
                error: function (oError, oResponse) {
                    try {
                        var oErrorResponse = JSON.parse(oError.responseText);

                        if (oErrorResponse &&
                            oErrorResponse.error &&
                            oErrorResponse.error.message &&
                            oErrorResponse.error.message.value) {

                            var sMessage = oErrorResponse.error.message.value;
                        }
                    } catch (ex) {
                        sMessage = "Failed to parse error response";
                    }


                    sap.m.MessageBox.error(sMessage, {
                        title: "Service Error",
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (oAction) {

                        }
                    });
                }.bind(this)
            }
            );
        },
    });
});