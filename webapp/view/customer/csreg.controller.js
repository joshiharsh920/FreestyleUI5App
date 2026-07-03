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
            if (!oArgs.stepNo) {
                oArgs.stepNo = "1";
            }
            var oCSRegModel = new sap.ui.model.json.JSONModel();
            var oModel = this.getView().getModel("sapModel");
            var aFilters = [
                new sap.ui.model.Filter("Stepno", sap.ui.model.FilterOperator.EQ, oArgs.stepNo)
            ];
            oModel.read("/FORMRULES001Set", {
                filters: aFilters,
                success: function (oData, oResponse) {
                    oController.Formid = oData.results[0].Formid;
                    const data = oData.results[0];

                    const {
                        Customerid,
                        Id,
                        Idnumber,
                        Zfirstname,
                        Zlastname,
                        Age,
                        Religion,
                        Email,
                        Phonenumber,
                        Homeadd,
                        Remarks
                    } = data;

                    oCSRegModel.setData({
                        Customerid,
                        Id,
                        Idnumber,
                        Zfirstname,
                        Zlastname,
                        Age,
                        Religion,
                        Email,
                        Phonenumber,
                        Homeadd,
                        Remarks
                    });
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

            var financeModel = new sap.ui.model.json.JSONModel();
            financeModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(financeModel, "financeModel");
            this.getView().byId('CreateProductWizard2').discardProgress(this.getView().byId('CreateProductWizard2').getSteps()[0]);
            this.getView().byId('CreateProductWizard2').goToStep(this.getView().byId('CreateProductWizard2').getSteps()[0]);

        },
        onNavigateToHome: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView");
        },
        fnStepActivate: function () {
            MessageToast.show("Step 2 Activated");
        },
        fnStep1Activate: function () {

        },
        stepComplete: function (stepNo) {
            var oModel = this.getView().getModel("sapModel");

            var regModel = new sap.ui.model.json.JSONModel();
            if (stepNo === "1") {
                delete this.getView().getModel("csregModel").oData.__metadata;
                regModel.setData(this.getView().getModel("csregModel").getData());
                regModel.oData.Customerid = +regModel.oData.Customerid;
                regModel.oData.Phonenumber = +regModel.oData.Phonenumber;
                regModel.oData.Age = +regModel.oData.Age;
                regModel.oData.Idnumber = +regModel.oData.Idnumber;
            }
            if (stepNo === "2") {
                delete this.getView().getModel("financeModel").oData.__metadata;
                regModel.setData(this.getView().getModel("financeModel").getData());
                regModel.oData.Customerid = +regModel.oData.Customerid;
                regModel.oData.Accno = +regModel.oData.Accno;
                regModel.oData.Annualincome = +regModel.oData.Annualincome;
                regModel.oData.Accno = +regModel.oData.Accno;
            }

            regModel.getData().Formid = +oController.Formid;
            regModel.getData().Stepno = this.getView().byId("CreateProductWizard2").getCurrentStep().split('CustomerStep')[1];
            oModel.create("/FORMRULES001Set", regModel.getData(), {
                success: function (oData, oResponse) {
                    const oData1 = oData;
                    if (oData.Stepno === "1") {
                        const {
                            Customerid,
                            Accno,
                            Accholderfirstname,
                            Accholderlastname,
                            Accholderaddress,
                            Bankname,
                            Acctype,
                            Annualincome
                        } = oData1;
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData({
                            Customerid,
                            Accno,
                            Accholderfirstname,
                            Accholderlastname,
                            Accholderaddress,
                            Bankname,
                            Acctype,
                            Annualincome
                        });
                        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                        this.getView().setModel(oModel, "financeModel");
                    }
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
            });

        },
        fnStep1Complete: function () {
            this.stepComplete("1");
        },
        fnStep2Complete: function () {
            this.stepComplete("2");
        },
    });
});