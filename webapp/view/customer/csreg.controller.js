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
                .getRoute("CUSTOMER REGISTRATION")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            window.oController = this;
            const oArgs = oEvent.getParameter("arguments");

            const id = oArgs.id;
            const name = oArgs.name;

            console.log("ID:", id);
            console.log("Name:", name);

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

            oCSRegModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oCSRegModel, "csregModel");
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