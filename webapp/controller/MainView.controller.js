sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("joshi.project1trial.controller.MainView", {
        onInit() {
            let oThis = this;
        },
        onCreatePress(oEvent) {
            const oView = this.getView();

            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    "joshi.project1trial.fragment.CreateBusinessPartner",
                    this
                );
                oView.addDependent(this._oDialog);
            }

            this._oDialog.open();
        },

        onCreateCancel() {
            this._oDialog.close();
        },

        async onCreateSubmit() {
            const oModel = this.getView().getModel();
            const addressUUID = crypto.randomUUID().replace(/-/g, "");
            // const oPayload = {
            //     BP_ID: this.byId("bpId").getValue(),
            //     COMPANY_NAME: this.byId("companyName").getValue(),
            //     EMAIL_ADDRESS: this.byId("email").getValue(),
            //     PHONE_NUMBER: this.byId("phone").getValue(),

            //     ADDRESS_GUID: {
            //         CITY: this.byId("city").getValue(),
            //         COUNTRY: this.byId("country").getValue(),
            //         STREET: this.byId("street").getValue()
            //     }
            // };

            // // V4 correct create
            // const oListBinding = oModel.bindList("/BusinessPartnerSet");

            // oListBinding.create(oPayload).created().then(() => {
            //     sap.m.MessageToast.show("Record created successfully");

            //     // close dialog
            //     this._oDialog.close();

            //     // refresh table
            //     this.byId("bpTable").getBinding("items").refresh();
            // }).catch((oError) => {
            //     sap.m.MessageToast.show("Create failed");
            //     console.error(oError);
            // });



            // await oModel.bindList("/BusinessPartnerSet").create({
            //     BP_ID: crypto.randomUUID().replace(/-/g, ""),
            //     COMPANY_NAME: this.byId("companyName").getValue(),
            //     EMAIL_ADDRESS: this.byId("email").getValue(),
            //     PHONE_NUMBER: this.byId("phone").getValue(),

            //     ADDRESS_GUID: {
            //         NODE_KEY: addressUUID,
            //         CITY: this.byId("city").getValue(),
            //         COUNTRY: this.byId("country").getValue(),
            //         STREET: this.byId("street").getValue()
            //     }
            // }).created().then(() => {
            //     // Success Logic
            //     console.log("Success!");
            // })
            //     .catch((oError) => {
            //         // Error Logic
            //         console.error("Error happened", oError);
            //     });

            // 1. Create the Address
            const oAddressBinding = oModel.bindList("/AddressSet");
            const oAddrContext = oAddressBinding.create({
                NODE_KEY: crypto.randomUUID().replace(/-/g, ""),
                CITY: this.byId("city").getValue(),
                STREET: this.byId("street").getValue(),
                COUNTRY: this.byId("country").getValue()
            });

            await oAddrContext.created();
            const sNewAddrKey = oAddrContext.getProperty("NODE_KEY");

            // 2. Create the Business Partner using the flat key name
            const oBPBinding = oModel.bindList("/BusinessPartnerSet");
            await oBPBinding.create({
                NODE_KEY: crypto.randomUUID().replace(/-/g, ""),
                BP_ID: this.byId("bpId").getValue(),
                COMPANY_NAME: this.byId("companyName").getValue(),
                // Use the flattened foreign key property name
                ADDRESS_GUID_NODE_KEY: sNewAddrKey
            }).created().then(() => {
                console.log('Business Partner created successfully');
                this._oDialog.close();
                this.byId("bpTable").getBinding("items").refresh();
            }
            ).catch((oError) => {
                console.error("Error creating Business Partner", oError);
            });
        },
        onSearch: function (oEvent) {
            // 1. Get the search query
            const sQuery = oEvent.getParameter("query");

            // 2. Get the table and its binding
            const oTable = this.byId("bpTable");
            const oBinding = oTable.getBinding("items");

            let aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // 3. Create filters for different columns
                // Note: To search in expanded entities, use the path 'Association/Property'
                const oFilterCompany = new Filter("COMPANY_NAME", FilterOperator.Contains, sQuery);
                const oFilterCity = new Filter("ADDRESS_GUID/CITY", FilterOperator.Contains, sQuery);
                const oFilterID = new Filter("BP_ID", FilterOperator.Contains, sQuery);

                // 4. Combine filters with "OR" (false means OR, true means AND)
                aFilters = new Filter({
                    filters: [oFilterCompany, oFilterCity, oFilterID],
                    and: false
                });
            }

            // 5. Apply the filter to the binding
            oBinding.filter(aFilters);
        },
        onDeletePress: function (oEvent) {
            // 1. Get the context of the specific row
            var oContext = oEvent.getSource().getBindingContext();

            sap.m.MessageBox.confirm("Are you sure you want to delete this partner?", {
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        // 2. Trigger the delete
                        oContext.delete().then(function () {
                            sap.m.MessageToast.show("Record deleted successfully.");
                        }).catch(function (oError) {
                            sap.m.MessageBox.error(oError.message);
                        });
                    }
                }
            });
        },
        onEditPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();

            if (!this._oEditDialog) {
                this._oEditDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "joshi.project1trial.fragment.createBusinessPartner",
                    this
                );
                this.getView().addDependent(this._oEditDialog);
            }
            this._oEditDialog.open();

            this.byId("bpId").setValue(oContext.getProperty("BP_ID"));
            this.byId("companyName").setValue(oContext.getProperty("COMPANY_NAME"));
            this.byId("email").setValue(oContext.getProperty("EMAIL_ADDRESS"));
            this.byId("phone").setValue(oContext.getProperty("PHONE_NUMBER"));
            this.byId("city").setValue(oContext.getProperty("ADDRESS_GUID/CITY"));
            this.byId("country").setValue(oContext.getProperty("ADDRESS_GUID/COUNTRY"));
            this.byId("street").setValue(oContext.getProperty("ADDRESS_GUID/STREET"));

            this._oEditContext = oContext;
        }

    });
});