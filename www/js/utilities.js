﻿function closeParentPopover(e) {

    var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');
    popover.close();
};

var showMenu = function () {
    var mm = $("#mainMenuContainer");

    if (mm.is(":visible")) {
        //         kendo.history.navigate("#:back");
        kendo.history.navigate("logon.html");
    } else {
        kendo.history.navigate("#main");
    }
};

var showScanner = function () {

    var scanner = window.plugins.barcodeScanner;
    if (scanner == null) {

        alert("Unable to initialize scanner!");
        return;
    }
    try{
        scanner.scan(function (result) {
            cdt.Application.getCurrentViewModel().promptControl.onScan(result.text, result.cancelled);
        }, function (error) {
            alert("Scanning failed: " + error);
            cdt.Application.getCurrentViewModel().promptControl.onScan(result.text, true);
        }
                );
    }
    catch (ex) {
        alert(ex);
    }
};

var showView = undefined;

var menuItemSelected = function (e) {

    // alert("Menu Item Selected:" + e.dataItem.view);
    // Get History Cleared
    showView = e.dataItem.view;
    kendo.history.navigate("#:back");
};

$(window).bind("hashchange", function (e) {
    var url = window.location.hash;
    var mm = $("#mainMenuContainer");

    if (cdt.Application.getCurrentViewModel() == null)
        return;

    var main = $("#" + cdt.Application.getCurrentViewModel().viewId);

    // alert("ViewChanged:" + url + "\r\current:" + cdt.Application.getCurrentViewModel().viewId);

    if (url == "" && cdt.Application.getCurrentViewModel().viewId !=  "main") {
        
        // alert("Abort called!");
        return;
    }

    if (url == "#main") {
        // alert("Show main");
        main.animate({ left: '+=300' }, 200, function () { cdt.Application.getCurrentViewModel().setIsMenuOpen(true); });
        mm.show(0);
        mm.css("left", -300);
        mm.animate({ left: '+=300' }, 200);
    } else if (url == cdt.Application.getStartView() || url == "") {

        if (showView == undefined) {

            // alert("Not a menu selection");

            if (main.css("left") != "0px") {

                // alert("Adjusting Menu");

                main.animate({ left: '-=300' }, 400);
                mm.animate({ left: '-=300' }, 400, function () { mm.data().kendoMobileScroller.reset(); mm.hide(0); cdt.Application.getCurrentViewModel().setIsMenuOpen(false); });

                
            }
        } else {
            //main.css("left", 0);
            //mm.data().kendoMobileScroller.reset();
            //mm.hide(0);
            //kendo.history.navigate(showView);
            //showView = undefined;


            // alert("Show new view:" + showView);

            main.animate({ left: '-=300' }, 400);
            mm.animate({ left: '-=300' }, 400, function () {

                cdt.Application.getCurrentViewModel().setIsMenuOpen(false);
                mm.data().kendoMobileScroller.reset();
                mm.hide(0);
                kendo.history.navigate(showView);
                showView = undefined;
            });

        }
    }
});
