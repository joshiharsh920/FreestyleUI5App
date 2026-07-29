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
                }.bind(this),
                error: function (oError, oResponse) {
                }.bind(this)
            }
            );


            oCSRegModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oCSRegModel, "csregModel");

            var oAdhaarModel = new sap.ui.model.json.JSONModel();
            oAdhaarModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oAdhaarModel, "adhaarModel");
            var oReviewModel = new sap.ui.model.json.JSONModel();
            oReviewModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oReviewModel, "reviewModel");
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
            if (stepNo === "3") {
                delete this.getView().getModel("adhaarModel").oData.__metadata;
                regModel.setData(this.getView().getModel("adhaarModel").getData());
                regModel.oData.Customerid = +regModel.oData.Customerid;
                // regModel.oData.Adhaarno = +regModel.oData.Adhaarno;
                regModel.oData.Phonenumber = +regModel.oData.Phonenumber;
                regModel.oData.Age = +regModel.oData.Age;
            }
            if (stepNo === "4") {
                delete this.getView().getModel("reviewModel").oData.__metadata;
                regModel.setData(this.getView().getModel("reviewModel").getData());
                regModel.getData().Customerid = oController.getView().getModel('csregModel').oData.Customerid
            }
            regModel.getData().Formid = +oController.Formid;
            regModel.getData().Stepno = this.getView().byId("CreateProductWizard2").getCurrentStep().split('CustomerStep')[1];
            if (stepNo === "3") {
                regModel.getData().Stepno = "3";
            }
            oModel.create("/FORMRULES001Set", regModel.getData(), {
                success: function (oData, oResponse) {
                    const oData1 = oData;
                    if (oData.Formstatus === "SUBMITTED") {
                        sap.m.MessageBox.success("Form submitted successfully!", {
                            title: "Success",
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === sap.m.MessageBox.Action.OK) {

                                    // Navigation to home route
                                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                    oRouter.navTo("RouteMainView"); // use your route name

                                }
                            }.bind(this)
                        });
                    }
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
                    if (oData.Stepno === "3") {
                        var oReviewData = {
                            Zfirstname: oData.Zfirstname,
                            Zlastname: oData.Zlastname,
                            Age: oData.Age,
                            Religion: oData.Religion,
                            Email: oData.Email,
                            Phonenumber: oData.Phonenumber,
                            Homeadd: oData.Homeadd,
                            Remarks: oData.Remarks,

                            Accno: oData.Accno,
                            Bankname: oData.Bankname,
                            Acctype: oData.Acctype,
                            Annualincome: oData.Annualincome,
                            Accholderfirstname: oData.Accholderfirstname,
                            Accholderlastname: oData.Accholderlastname,
                            Accholderaddress: oData.Accholderaddress
                        };
                        var oReviewModel = new sap.ui.model.json.JSONModel();
                        oReviewModel.setData(oReviewData);
                        this.getView().setModel(oReviewModel, "reviewModel");
                    }
                    if (oData.Stepno === "2") {
                        const {
                            Adhaarno,
                            Adhaarfname,
                            Aadharlname,
                            Address,
                            Age,
                            Phonenumber,
                            Fathername,
                            Mothername,
                            Pincode,
                            Customerid
                        } = oData;

                        var oAdhaarModel = new sap.ui.model.json.JSONModel();

                        oAdhaarModel.setData({
                            Adhaarno,
                            Adhaarfname,
                            Aadharlname,
                            Address,
                            Age,
                            Phonenumber,
                            Fathername,
                            Mothername,
                            Pincode,
                            Customerid
                        });

                        oAdhaarModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

                        this.getView().setModel(oAdhaarModel, "adhaarModel");
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
        onFetchAdhaarData: function () {
            var oView = this.getView();
            var oAdhaarModel = oView.getModel("adhaarModel");
            var oModel = oView.getModel("sapModel"); // OData Model

            var that = this;
            // 🔥 Function Import Call
            oModel.callFunction("/getAdhaarData", {
                method: "GET",

                urlParameters: {
                    Customerid: this.getView().getModel("csregModel").getProperty("/Customerid").toString()  // MUST match backend parameter
                },

                success: function (oData) {
                    oData = oData.results[0];
                    // If backend returns structure
                    oAdhaarModel.setProperty("/Adhaarfname", oData.Adhaarfname);
                    oAdhaarModel.setProperty("/Aadharlname", oData.Aadharlname);
                    oAdhaarModel.setProperty("/Address", oData.Address);
                    oAdhaarModel.setProperty("/Age", oData.Age);
                    oAdhaarModel.setProperty("/Phonenumber", oData.Phonenumber);
                    oAdhaarModel.setProperty("/Fathername", oData.Fathername);
                    oAdhaarModel.setProperty("/Mothername", oData.Mothername);
                    oAdhaarModel.setProperty("/Pincode", oData.Pincode);
                    oAdhaarModel.setProperty("/Customerid", oData.Customerid);
                    oAdhaarModel.setProperty("/Adhaarno", oData.Adhaarno);

                    that.getView().setModel(oAdhaarModel, "adhaarModel");
                    that.getView().getModel('adhaarModel').refresh(true);

                    sap.m.MessageToast.show("Aadhaar Data Fetched");
                },

                error: function (oError) {
                    var sMsg = "Error occurred";

                    try {
                        sMsg = JSON.parse(oError.responseText).error.message.value;
                    } catch (e) { }

                    sap.m.MessageBox.error(sMsg);
                }
            });
        },
        fnStep1Complete: function () {
            this.stepComplete("1");
        },
        fnStep2Complete: function () {
            this.stepComplete("2");
        },
        fnAdhaarComplete: function () {
            this.stepComplete("3");
        },
        fnReviewComplete: function () {
            this.stepComplete("4");
        }
    });
});