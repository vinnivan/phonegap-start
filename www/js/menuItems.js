var rootMenu = [
    { name: "PO Arrival", view: "frmPOReceiptArrival.html", description: "Acknowledge arrival of items.", url: "images/inbox_download.png", group: "Receive" },

    { name: "Inquiry", view: "frmInvInq.html", description: "Find information of item in stock.", url: "images/magnifier.png", group: "Inventory" },
    { name: "Transfer", view: "frmInvTransfer.html", description: "Transfer item from one location to another.", url: "images/walk.png", group: "Inventory" },
    { name: "Count", view: "frmInvCount.html", description: "Perform a physical count of an item.", url: "images/calculator_edit.png", group: "Inventory" },
    { name: "Profit", view: "frmInvProfit.html", description: "Receive items into stock.", url: "images/server_components.png", group: "Inventory" },
    { name: "Loss", view: "frmInvLoss.html", description: "Remove item from in stock.", url: "images/paintcan.png", group: "Inventory" },
    { name: "Item Label Reprint", view: "frmItemLabel.html", description: "Reprint labels for item in stock.", url: "images/printer.png", group: "Inventory" },
    { name: "Tag Counting", view: "frmTagCounting.html", description: "Perform a physical count of tagged items.", url: "images/tag_blue_add.png", group: "Inventory" },

    { name: "Product Arrival", view: "frmProdArrival.html", description: "Acknowledge arrival of product.", url: "images/lorry_add.png", group: "Manufacturing" },
    { name: "Product Picking", view: "frmProductionPickList.html", description: "Pick items for production.", url: "images/basket_put.png", group: "Manufacturing" },
    { name: "BOM Finish", view: "frmBOMFinish.html", description: "Update Bill of Materials with details.", url: "images/report_edit.png", group: "Manufacturing" },

    { name: "Shipment Picking", view: "frmSalesPickingRoute.html", description: "Sales picking route.", url: "images/cart_add.png", group: "Shipping" },
    { name: "Load Shipment", view: "frmLoadShipment.html", description: "Load Shipment.", url: "images/forklift.png", group: "Shipping" }
];
