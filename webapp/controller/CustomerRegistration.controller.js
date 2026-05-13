sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("joshi.project1trial.controller.CustomerRegistration", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("CustomerRegistration")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            debugger;
            const oArgs = oEvent.getParameter("arguments");

            const id = oArgs.id;
            const name = oArgs.name;

            console.log("ID:", id);
            console.log("Name:", name);
        },
    });
});