var cdt = cdt || {};

var global = global || {};

// Globals ---------------------------------------------
global.userId = "IFSAPP";
global.ifsVersion = "";
global.transactionDescription = "";
global.site = "1";
global.deviceId = "demo";
global.warehouse = "MAIN";


//global.serviceUrl =  "http://192.168.2.203/ifs/api/api.aspx/";
//global.serviceUrl =  "http://localhost:50668/api.aspx/";
global.serviceUrl =  "http://192.168.4.134/CdtWebApi/api.aspx/";


//global.serviceUrl = "http://localhost:50668/api.aspx/";

// Constants -------------------------------------------
cdt.EmptyString = "";


cdt.template = function () {
    // private members

    // support methods

    // interface 
    return {
        // properties 

        // methods
    };
};

cdt.configuration = function () {
    // private members
    var hostUrl = cdt.EmptyString;
    var model;

    // support methods
    var load = function () {

        var setDefault = false;

        model.set("hostUrl", window.localStorage.getItem("hostUrl"));

        if (model.hostUrl == null || model.hostUrl == cdt.EmptyString) {
            model.set("hostUrl", global.serviceUrl);
            setDefault = true;
            cdt.Diagnostics.writeLine("Load default for hostUrl");
        }

        return setDefault;
    };

    var save = function () {

        window.localStorage.setItem("hostUrl", model.get("hostUrl"));
    };

    var dialogSave = function () {
        save();
        dialogClose();
    };
    
    var dialogClose = function () {
        $("#configurationModalView").kendoMobileModalView("close");
        $("#popupMenu").kendoMobilePopOver("close");
    };

    // interface 
    model = kendo.observable({
        // properties 
        hostUrl: hostUrl,
        // methods
        load: load,
        save: save,
        dialogSave: dialogSave,
        dialogClose: dialogClose
        
    });

    // do initial load 
    if (load()) {
        save();
    }


    return model;
};


// support class  ------------------------------------------
cdt.customEvent = function (_eventName) {
    // private members
    var eventName = _eventName;
    var eventHandlers = [];
    var deleteHandlers = [];
    var isFiringEvents = false;

    // support methods
    var subscribe = function (_eventHandler) {
        eventHandlers.push(_eventHandler);
    };

    var unsubscribe = function (_eventHandler) {
        deleteHandlers.push(_eventHandler);
        if (isFiringEvents == false)
            cleanEventHandlers();
    };

    var cleanEventHandlers = function () {
        cdt.Utilities.arrayForEach(deleteHandlers, function (_eventHandler) {
            var index = eventHandlers.indexOf(_eventHandler);
            if (index >= 0)
                eventHandlers.splice(index, 1);
        });

        deleteHandlers = [];
    };

    var clear = function () {
        cdt.Utilities.arrayForEach(eventHandlers, function (_eventHandler) {
            deleteHandlers.push(_eventHandler);
        });
        if (isFiringEvents == false)
            cleanEventHandlers();
    };

    var fire = function (_sender, _eventArgs) {
        isFiringEvents = true;
        cdt.Utilities.arrayForEach(eventHandlers, function (_eventHandler) {
            _eventHandler(_sender, _eventArgs);
        });
        isFiringEvents = false;

        cleanEventHandlers();
    };

    // interface 
    return {
        // methods
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        clear: clear,
        fire: fire
    };
};
// Utilities  ------------------------------------------
cdt.Utilities = (function() {
 var generateGuid = function() {        
    var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };

     var arrayForEach = function (array, action) {
         for (var i = 0, j = array.length; i < j; i++)
             action(array[i]);
     };

     var arrayIndexOf = function (array, item) {
         if (typeof Array.prototype.indexOf == "function")
             return Array.prototype.indexOf.call(array, item);
         for (var i = 0, j = array.length; i < j; i++)
             if (array[i] === item)
                 return i;
         return -1;
     };

     var arrayFirst = function (array, predicate, predicateOwner) {
         for (var i = 0, j = array.length; i < j; i++)
             if (predicate.call(predicateOwner, array[i]))
                 return array[i];
         return null;
     };

     var arrayRemoveItem = function (array, itemToRemove) {
         var index = cdt.Utilities.arrayIndexOf(array, itemToRemove);
         if (index >= 0)
             array.splice(index, 1);
     };

     var arrayGetDistinctValues = function (array) {
         array = array || [];
         var result = [];
         for (var i = 0, j = array.length; i < j; i++) {
             if (cdt.Utilities.arrayIndexOf(result, array[i]) < 0)
                 result.push(array[i]);
         }
         return result;
     };

     var arrayMap = function (array, mapping) {
         array = array || [];
         var result = [];
         for (var i = 0, j = array.length; i < j; i++)
             result.push(mapping(array[i]));
         return result;
     };

     var arrayFilter = function (array, predicate) {
         array = array || [];
         var result = [];
         for (var i = 0, j = array.length; i < j; i++)
             if (predicate(array[i]))
                 result.push(array[i]);
         return result;
     };

     var toJSONString = function (obj) {
         var wrapper = kendo.observable(obj);
         return JSON.stringify(wrapper.toJSON());
     };

     var hideKeyboard = function (element) {

         //alert("HideKeyboard");

         element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
         element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
         setTimeout(function () {
             element.blur();  //actually close the keyboard
             // Remove readonly attribute after keyboard is hidden.
             element.removeAttr('readonly');
             element.removeAttr('disabled');
         }, 100);
     };

     var endsWith = function (_str, _suffix) {
             return _str.indexOf(_suffix, _str.length - _suffix.length) !== -1;
     };

    return {
        generateGuid: generateGuid,
        arrayForEach: arrayForEach,
        arrayIndexOf: arrayIndexOf,
        arrayFirst: arrayFirst,
        arrayRemoveItem: arrayRemoveItem,
        arrayGetDistinctValues: arrayGetDistinctValues,
        arrayMap: arrayMap,
        arrayFilter: arrayFilter,
        toJSONString: toJSONString,
        hideKeyboard: hideKeyboard,
        endsWith: endsWith
    };
})();

// Resource Manager -------------------------------------------
cdt.Diagnostics = (function () {
    // private members

    // support methods
    var writeLine = function (message) {
        if (window.console) {
            console.log(message);
        }
    };

    // interface 
    return {
        // properties 

        // methods
        writeLine: writeLine
    };
})();


// Resource Manager -------------------------------------------

cdt.cultureItem = function (_cultureId, _name, _imageSource) {
    // private members
    var cultureId = _cultureId;
    var name = _name;
    var imageSource = _imageSource;
    // support methods

    // interface 
    return {
        // properties 
        cultureId: cultureId,
        name: name,
        imageSource: imageSource
        // methods
    };
};

// Network Manager -------------------------------------------

//cdt.ValidationAction = Object.freeze({ "Default": 0, "PromptForAction": 1, "ReturnToPrompt": 2, "IgnoreAndContinue": 3 });
cdt.ValidationAction = { "Default": 0, "PromptForAction": 1, "ReturnToPrompt": 2, "IgnoreAndContinue": 3 };


cdt.NetworkManager = (function () {
    // private members
    var validationSequence = 0;
    var transactionSequence = 0;

    // support methods
    var getValidationSequence = function () {

        return ++validationSequence;
    };

    var getTransactionSequence = function () {

        return ++transactionSequence;
    };
     
    // interface 
    return {
        // properties 
        // methods
        getValidationSequence: getValidationSequence,
        getTransactionSequence: getTransactionSequence
    };
})();


// Variable Manager -------------------------------------------

cdt.VariableManager = (function () {
    // private members
    var locals = new Object();
    var globals = new Object();
    var currentNamespace = cdt.EmptyString;

    var setNamespace = function (_namespace) {
        currentNamespace = _namespace;

        locals[currentNamespace] = new Object(); 
    };

    var getVariable = function (_namespace, _variableName) {

        var namespaceVariable = locals[namespace];

        if (namespaceVariable != null)
            return namespaceVariable[_variableName];

        return cdt.EmptyString;
    };

    var setVariable = function (_namespace, _variableName, _value) {

        var namespaceVariable = locals[namespace];

        if (namespaceVariable != null)
            return namespaceVariable[_variableName] = _value;
    };

    var getLocalVariable = function (_variableName) {

        var namespaceVariable = locals[currentNamespace];

        if (namespaceVariable != null)
            return namespaceVariable[_variableName];

        return cdt.EmptyString;
    };

    var setLocalVariable = function (_variableName, _value) {

        var namespaceVariable = locals[currentNamespace];

        if (namespaceVariable != null)
            return namespaceVariable[_variableName] = _value;
    };

    var getGlobalVariable = function (_variableName) {
        
        return globals[_variableName];
    };

    var setGlobalVariable = function (_variableName, _value) {

        return globals[_variableName] = _value;
    };

    // interface 
    return {
        // properties 
        locals: locals,
        globals: globals,
        // methods
        setNamespace: setNamespace,
        getVariable: getVariable,
        setVariable: setVariable,
        getLocalVariable: getLocalVariable,
        setLocalVariable: setLocalVariable,
        getGlobalVariable: getGlobalVariable,
        setGlobalVariable: setGlobalVariable
    };
})();


cdt.ResourceManager = (function (_defaultCultureId, _popupId) { kendo.observable()
    {
        // private members
        var defaultCultureId = _defaultCultureId; // this is the neutral culture
        var currentCultureId = _defaultCultureId;
        var popupId = _popupId;
        var cultureList = [];
        var cultureChanged = new cdt.customEvent("CultureChanged");
        var title = cdt.EmptyString;
        var model;

        // support methods
        var getString = function (_key) {
            // find key in current culture
            if (currentCultureId != defaultCultureId)
                return _key + "-" + currentCultureId;

            return _key;
        };

        var chooseCulture = function (_culture) {
            $('#' + popupId).popup('open');
        };

        var selectedCulture = function (_cultureItem) {
            currentCultureId = _cultureItem.cultureId;
            title(getString("ChooseCulture"));
            cultureChanged.fire(this, currentCultureId);
            //alert(ko.toJSON(_cultureItem));
        };

        var addCulture = function (_cultureItem) {
            cultureList.push(_cultureItem);
        };

        var setCulture = function (_cultureId) {
            currenntCultureId = _cultureId;
            title(getString("ChooseCulture"));
            cultureChanged.fire(this, _cultureItem);
            //alert(ko.toJSON(_cultureId));
        };


        // interface
        model = kendo.observable( {
            // properties
            cultureList: cultureList,
            currentCultureId: currentCultureId,
            cultureChanged: cultureChanged,
            title: getString("ChooseCulture"),

            // methods
            getString: getString, // Get string based off current culture 
            chooseCulture: chooseCulture, // Show popup menu 
            selectedCulture: selectedCulture, // Result from popup menu
            addCulture: addCulture,
            setCulture: setCulture // Set culture by Id
        });

        return model;
    }
})("en-US", "cultureMenu");


// Menu --------------------------------------------------------------------

// Menu Enums
//cdt.MenuType = Object.freeze({ "Form": 0, "Menu": 1 });
cdt.MenuType = { "Form": 0, "Menu": 1 };

cdt.menu = function (_captionId, _menuItems) {
    // private members
    var captionId = _captionId; // show at the top of the page
    var menuItems = _menuItems; // array of menu items to show in list
    var caption = cdt.ResourceManager.getString(captionId);  //ko.observable(cdt.ResourceManager.getString(captionId));
    var model;

    // support methods
    var selectCulture = function (_culture) {
        cdt.Utilities.arrayForEach(menuItems, function (menu) {
            menu.selectCulture(_culture);
        });
    };

    var getMenuItemCount = function () {
        if (menuItems != null) {
            return menuItems.length;
        }
        return 0;
    };

    //var menuItemCount = ko.computed(function () {
    //    return getMenuItemCount();
    //}, this);

    // interface 
    model = kendo.observable( {
        // properties
        caption: caption,
        captionId: captionId,
        menuItems: menuItems,
        
        // methods
        menuItemCount: menuItemCount
    });

    return model;
};

cdt.menuItem = function (_captionId, _view, _type, _menu) {
    // private members
    var captionId = _captionId;
    var caption = cdt.ResourceManager.getString(captionId); // show in menu item list
    var type = _type;
    var menu = _menu;
    var view = _view;
    var relation = (type == cdt.MenuType.Form) ? "external" : cdt.EmptyString;
    var model;

    // support methods
    var selectCulture = function (_culure) {
        // request title from the resource manager 
        model.set("caption", cdt.ResourceManager.getString(captionId));
    };

    var menuItemCount = function () {
        if (menu != null)
            return menu.menuItemCount();

        return 0;
    };

    // interface 
    model = kendo.observable( {
        // properties
        caption: caption,
        captionId: captionId,
        selectCulture: selectCulture,
        type: type,
        view: view,
        menu: menu,
        relation: relation,

        // methods
        menuItemCount: menuItemCount
    });

    return model;
};

// Popup Menu    -------------------------------------------
cdt.OptionsPopupMenu = function (_id, _previousClick, _resetClick, _abortClick) {
    var name = "OptionsPopupMenu";
    var id = _id;
    var previousClick = _previousClick;
    var resetClick = _resetClick;
    var abortClick = _abortClick;
    var clickedAction = null;


    var initialize = function () {

        this.uiPopupMenu = $("#popupMenu");
    };

    var onPopupClosed = function (event, ui) {
        var thisObject = event.data;
        cdt.Diagnostics.writeLine("popup closed");
    };

    var onPopupOpened = function (event, ui) {
        var thisObject = event.data;
        cdt.Diagnostics.writeLine("popup opened");
    };

    var onPreviousClicked = function (event, ui) {
        var thisObject = event.data;

        //thisObject.clickedAction = thisObject.previousClick;
        thisObject.uiPopupMenu.popup('close');

        if (thisObject.previousClick != null)
            thisObject.previousClick();

        return false;
    };

    var onResetClicked = function (event, ui) {
        var thisObject = event.data;

        //thisObject.clickedAction = thisObject.resetClick;
        thisObject.uiPopupMenu.popup('close');

        if (thisObject.resetClick != null)
            thisObject.resetClick();

        return false;
    };

    var onAbortClicked = function (event, ui) {
        var thisObject = event.data;

        //thisObject.clickedAction = thisObject.previousClick;
        thisObject.uiPopupMenu.popup('close');

        if (thisObject.abortClick != null)
            thisObject.abortClick();

        return false;
    };

    return {
        name: "IOptionsPopupMenu",
        initialize: initialize,
        previousClick: previousClick,
        resetClick: resetClick,
        abortClick: abortClick
    };
};

// Advanced Text -------------------------------------------

// Text Enums
//cdt.InputType = Object.freeze({ "AlphaNumeric": 0, "Mask": 1, "Numeric": 2 });
cdt.InputType = { "AlphaNumeric": 0, "Mask": 1, "Numeric": 2 };

cdt.textControl = function (_name, _captionId) {

    var id = "TextControl";
    // private members
    var name = _name;
    var captionId = _captionId;
    var caption = cdt.EmptyString; //ko.observable(cdt.EmptyString);
    var toUpper = false; //ko.observable(false);
    var text = cdt.EmptyString; //ko.observable("").extend({ toUpper: toUpper });
    var uiTextControl = null;
    var hasFocus = false;
    var validAction = null;
    var errorAction = null;
    var focusCount = 0;
    var toUpperStyle = cdt.EmptyString;
    var model;


    var setValidAction = function (_action) {
        validAction = _action;
    };

    var setErrorAction = function (_action) {
        errorAction = _action;
    };

    // support methods
    var loadResources = function () {
        caption(cdt.ResourceManager.getString(captionId));
    };

    var internalReset = function () {
        hasFocus = false;
        model.set("text",cdt.EmptyString);
    };

    var getHasFocus = function () {
        return hasFocus;
    };

    var setHasFocus = function (_value) {
        hasFocus = _value;
    };

    var blur = function () {
        uiTextControl.blur();
    };

    var focus = function (_secondsWaited) {
        var secondsWaited = _secondsWaited;
        secondsWaited += 100;
        //cdt.Diagnostics.writeLine("checking focus:" + hasFocus);

        if (hasFocus == false && secondsWaited < 2000) {
            uiTextControl.focus();
            //cdt.Diagnostics.writeLine("setting timeout!");
            setTimeout("cdt.Application.getCurrentViewModel().promptControl.getCurrentControl().focus(" + secondsWaited + ")", 100);
        }
        else if (focusCount < 2 && secondsWaited < 2000) {
            uiTextControl.focus();
            //cdt.Diagnostics.writeLine("setting Focus again!");
            setTimeout("cdt.Application.getCurrentViewModel().promptControl.getCurrentControl().focus(" + secondsWaited + ")", 100);
        }
    };

    var configureForPrompt = function (_prompt) {
        model.set("caption",_prompt.get("caption"));
        model.set("text",_prompt.getSavedText());
        model.set("toUpper", _prompt.get("toUpper"));
        model.set("toUpperStyle", _prompt.toUpper ? "uppercase" : "");
    };

    var initialize = function () {
        uiTextControl = $("#" + name);

        uiTextControl.focusin(function () {
            hasFocus = true;
            //cdt.Diagnostics.writeLine("has focus");
            focusCount++;
            //alert("Focus in");
        });

        uiTextControl.focusout(function () {
            hasFocus = false;
            //cdt.Diagnostics.writeLine("lost focus");
            focusCount = 0;
            //alert("Focus out");
        });

    };

    var getText = function () {
        if (model.toUpper) {
            return model.get("text").toUpperCase();
        }

        return model.get("text");
    };
    

    // interface 
    model = kendo.observable( {
        id: "ITextControl",
        // properties 
        name: name,
        caption: caption,
        text: text,
        toUpperStyle: toUpperStyle,
        // events
        validAction: validAction,
        errorAction: errorAction,
        // methods
        loadResources: loadResources,
        internalReset: internalReset,
        configureForPrompt: configureForPrompt,
        focus: focus,
        blur: blur,
        getHasFocus: getHasFocus,
        setHasFocus: setHasFocus,
        initialize: initialize,
        getText: getText
    });

    return model;
};


cdt.listControl = function (_name, _captionId, _selected) {

    var id = "ListControl";
    // private members
    var name = _name;
    var captionId = _captionId;
    var caption = cdt.EmptyString; 
    var dataSource;
    var items = [];
    var uiListControl = null;
    var validAction;
    var errorAction;
    var selectedAction = _selected;
    var model;

    var setValidAction = function (_action) {
        validAction = _action;
    };

    var setErrorAction = function (_action) {
        errorAction = _action;
    };

    // support methods
    var loadResources = function () {
        model.set("caption", cdt.ResourceManager.getString(captionId));
    };

    var internalReset = function () {
        items.length = 0;
    };

    var configureForPrompt = function (_prompt) {
        //model.set("caption",_prompt.get("caption"));
        //model.set("items",_prompt.getItems());

        var listView = uiListControl.data().kendoMobileListView;

        layout = _prompt.getLayout();

        if (layout != null) {
            listView.template = layout;
        }

        dataSource = _prompt.getDataSource();

        if (dataSource != null) {

            listView.setDataSource(dataSource);
            //listView.setDataSource(new kendo.data.DataSource({ data: dataSource }));
        }

    };

    var selected = function (_value, _completeAction) {

        if (_completeAction != null) {
            _completeAction(true);
        }
        
    }

    var initialize = function () {
        uiListControl = $("#" + name);

        var listView = uiListControl.data().kendoMobileListView;

        // notifiy Prompt control row was selected 
        listView.setOptions({
            click: selectedAction
        });


    };

    // interface 
    model = kendo.observable( {

        id: "IListControl",
        // properties 
        name: name,
        caption: caption,
        items: items,
        // events
        validAction: validAction,
        errorAction: errorAction,
        // methods
        loadResources: loadResources,
        internalReset: internalReset,
        configureForPrompt: configureForPrompt,
        initialize: initialize
    });

    return model;
};



// Prompt History Item -------------------------------------------
cdt.historyItem = function (_caption, _text, _detailList) {
    // private members
    var caption = _caption;
    var text = _text;
    var detailList = _detailList;
    var model;
    // support methods
    var buildString = function () {

        return caption + text;
    };

    // interface 
    model = kendo.observable( {
        // properties 
        caption: caption,
        text: text,
        detailList: detailList,
        // methods
        buildString: buildString
    });

    return model;
};



// Prompt Control -------------------------------------------

//cdt.PromptControlType = Object.freeze({ "None": 0, "Text": 1, "List": 2, "Password": 3 });
cdt.PromptControlType = { "None": 0, "Text": 1, "List": 2, "Password": 3 };

cdt.promptControl = function (_resetCaptionId, _previousCaptionId, _abortCaptionId, _optionCaptionId,_controlPrefix) {
    var id = "PromptControl";

    // private Members
    var currentPrompt = null;
    var currentPromptType = cdt.PromptControlType.None; 
    var promptList = [];
    var promptHistoryList = [];
    var promptHistoryStack = new kendo.data.ObservableArray([]);
    var resetCaptionId = _resetCaptionId;
    var resetCaption = cdt.EmptyString;
    var resetEnabled = false; 
    var previousCaptionId = _previousCaptionId;
    var previousCaption = cdt.EmptyString;
    var previousEnabled = cdt.EmptyString;
    var abortCaptionId = _abortCaptionId;
    var abortCaption = cdt.EmptyString;
    var optionCaptionId = _optionCaptionId;
    var abortEnabled = false;
    var optionCaption = cdt.EmptyString;
    var controlPrefix = _controlPrefix;
    var textControl = new cdt.textControl(_controlPrefix + "-textInput", "");
    var passwordControl = new cdt.textControl(_controlPrefix + "-passwordInput", "");
    var validEvent = new cdt.customEvent("Valid");
    var cancelEvent;
    var model;
    var testItems = new kendo.data.ObservableArray([{ Test: "Hello" }, { Test: "world" }]);
    var historyListControl;
    var historyScroller;
    var historyScrollerHtml;

    var isCurrentPromptText = false;
    var isCurrentPromptPassword = false;
    var isCurrentPromptList = false;
    var isHistoryVisible = false;

    // support Methods
    var validateOnEnter = function (event) {

        var value;

        if (currentPrompt.promptControlType == cdt.PromptControlType.Text) {
            //textControl.blur();
            value = textControl.getText();
        } else if (currentPrompt.promptControlType == cdt.PromptControlType.Password) {
            //passwordControl.blur()
            value = passwordControl.getText();
        }

        // Validations are asynchronous so pass callback
        currentPrompt.validate(value, function (_success) {
            if (_success) {

                getCurrentControl().blur();

                setTimeout("cdt.Application.getCurrentViewModel().promptControl.showNextPrompt()", 100);

                //showNextPrompt();
            }
        });
    };

    var listControlSelect = function (e) {

        // Validations are asynchronous so pass callback
        currentPrompt.validate(e.dataItem, function (_success) {
            if (_success) {


                setTimeout("cdt.Application.getCurrentViewModel().promptControl.showNextPrompt()", 100);

                // showNextPrompt();
            }
        });
    };
    
    // Method must exist first so we can pass to control
    var listControl = new cdt.listControl(_controlPrefix + "-listControl", "", listControlSelect);


    var getCurrentPrompt = function () {
        return currentPrompt;
    };

    var getCurrentControl = function () {
        if (currentPrompt != null) {

            if (currentPrompt.promptControlType == cdt.PromptControlType.Text) {
                return textControl;
            } else if (currentPrompt.promptControlType == cdt.PromptControlType.Password) {
                return passwordControl;
            }
        }

        return null;
    };

    var setPromptItems = function (_promptName, _items) {

        var prompt = cdt.Utilities.arrayFirst(promptList, function (item) {
            return item.name == _promptName;
        });

        if (prompt != null) {
            prompt.setItems(_items);
        }
    };

    var addPrompt = function (_prompt) {
        _prompt.setParent(this);
        promptList.push(_prompt);
    };

    var showFirstPrompt = function (_useFocus) {
        if (promptList.length > 0)
            showPrompt(promptList[0], _useFocus);
    };

    var showNextPrompt = function () {

        var index = promptList.indexOf(currentPrompt);

        if (index + 1 < promptList.length)
            showPrompt(promptList[index + 1], true);
    };

    var showPreviousPrompt = function () {

        if (promptHistoryStack.length == 0) {
            // beep
        }

        if (currentPrompt != null) {
            currentPrompt.releasePromptControl();
            currentPrompt.reset();
            currentPrompt = null;
        }

        var previousPrompt = promptHistoryStack.pop();

        showPrompt(previousPrompt, true);
    };

    var showPrompt = function (_prompt, _useFocus) {

        if (currentPrompt != null) {

            if (_prompt == currentPrompt) {
                if (_useFocus == true) {
                    if (currentPromptType == cdt.PromptControlType.Password) {
                        // don't clear variable if defined
                        passwordControl.internalReset();
                        passwordControl.focus(0);
                    } else {
                        // don't clear variable if defined
                        textControl.internalReset();
                        textControl.focus(0);
                    }
                }

                cdt.Application.getCurrentViewModel().resetScroller();
                return;
            }

            currentPrompt.releasePromptControl();
            currentPrompt.setSavedText(getInputValue(false));

            if (currentPrompt.skipable) {
                if (currentPrompt.skip == false) {
                    currentPrompt.addHistoryText(currentPrompt.get("caption") + ":\t", getInputValue(true), false);
                    promptHistoryStack.push(currentPrompt);
                }
            } else {
                currentPrompt.addHistoryText(currentPrompt.get("caption") + ":\t", getInputValue(true), false);
                promptHistoryStack.push(currentPrompt);

                model.testItems.push({ Test: currentPrompt.getHistory() });
            }
        }

        // if prompt is passed by name then find it in the list
        if (typeof (_prompt) == "string") {
            currentPrompt = cdt.Utilities.arrayFirst(promptList, function (findPrompt) {
                return findPrompt.name == _prompt;
            });
        } else {
            currentPrompt = _prompt;
        }

        // this will cause the list or text control to show and hide
        currentPromptType = currentPrompt.promptControlType;
        model.set("currentPromptType", currentPromptType);
        model.set("isCurrentPromptText",currentPromptType == cdt.PromptControlType.Text);
        model.set("isCurrentPromptPassword", currentPromptType == cdt.PromptControlType.Password);
        model.set("isCurrentPromptList", currentPromptType == cdt.PromptControlType.List);
        model.set("isHistoryVisible", currentPromptType != cdt.PromptControlType.List)

        currentPrompt.configurePromptControl();

        // enable/disable navigation buttons
        if (currentPromptType == cdt.PromptControlType.List) {
            listControl.internalReset();
            listControl.configureForPrompt(currentPrompt);

        } else if (currentPromptType == cdt.PromptControlType.Password) {

            // don't clear variable if defined
            passwordControl.internalReset();

            passwordControl.configureForPrompt(currentPrompt);

            if (_useFocus) {
                passwordControl.focus(0);
            }
                

        } else {

            // don't clear variable if defined
            textControl.internalReset();
            textControl.configureForPrompt(currentPrompt);
            if (_useFocus) {
                textControl.focus(0);
            }
        }
        
        cdt.Application.getCurrentViewModel().resetScroller();

        var height = historyScrollerHtml.height();
        var scrollHeight = height - historyScroller.scrollHeight();

        if(scrollHeight < 0 ) {
            historyScroller.scrollTo(0, scrollHeight);
        }

    };

    var returnToPrompt = function (_promptName, _resetFirst, _resetHistory) {

        if (currentPrompt != null) {

            currentPrompt.releasePromptControl();
            currentPrompt.reset();
            currentPrompt = null;
        }

        while (promptHistoryStack.length > 0) {

            var prompt = promptHistoryStack.pop();

            if (prompt.name == _promptName) {
                if (_resetFirst) {

                    prompt.reset();
                }
                showPrompt(prompt, true);
                return;
            }

            if (_resetHistory) {
                prompt.reset();
            }
        }

        showFirstPrompt(true);
    };

    var reset = function (_useFocus) {

        while (promptHistoryStack.length > 0) {
            var prompt = promptHistoryStack.pop();
            prompt.reset();
        }

        if (currentPrompt != null) {
            currentPrompt.releasePromptControl();
            currentPrompt.reset();
            currentPrompt = null;
        }

        cdt.Utilities.arrayForEach(promptList, function (p) { p.reset() });

        historyScroller.reset();


        showFirstPrompt(_useFocus);
    };

    var resetText = function () {
        //cdt.Utilities.hideKeyboard($("#textInput"));
        //$("#textInput").blur();
        //$("#main").data('kendoMobileView').scroller.reset();
        //setTimeout(function() {
        //},100);
        //return;
        if (currentPromptType == cdt.PromptControlType.Password) {
            // don't clear variable if defined
            passwordControl.internalReset();
            passwordControl.focus(0);
        } else {
            // don't clear variable if defined
            textControl.internalReset();
            textControl.focus(0);
        }
    };

    var blur = function () {

        if (currentPromptType == cdt.PromptControlType.Password) {
            passwordControl.blur();
        } else if(currentPromptType == cdt.PromptControlType.Text) {
            // don't clear variable if defined
            textControl.blur();
        }

    };

    var onScan = function (_scan, _wasCancelled) {

        if (_wasCancelled == true) {
            textControl.focus(0);
            return;
        }

        textControl.set("text",_scan);

        // Validations are asynchronous so pass callback
        currentPrompt.validate(_scan, function (_success) {
            if (_success) {


                setTimeout("cdt.Application.getCurrentViewModel().promptControl.showNextPrompt()", 100);

                // showNextPrompt();
            }
        });

    };

    var abort = function () {

        //cdt.Diagnostics.writeLine("Prompt Control Abort");
        reset();
        kendo.history.navigate("#:back");
    };


    // UI Methods
    var loadResources = function () {

        // Load our resources 
        model.set("resetCaption",cdt.ResourceManager.getString(resetCaptionId));
        model.set("previousCaption",cdt.ResourceManager.getString(previousCaptionId));
        model.set("abortCaption",cdt.ResourceManager.getString(abortCaptionId));
        model.set("optionCaption",cdt.ResourceManager.getString(optionCaptionId));

        cdt.Utilities.arrayForEach(promptList, function (prompt) {
            prompt.loadResources();
        });

        if (currentPrompt != null && currentPrompt.promptControlType == cdt.PromptControlType.Text)
            textControl.set("caption",currentPrompt.caption());
    };

    var initialize = function () {

        popupMenu.initialize();
        textControl.initialize();
        passwordControl.initialize();
        listControl.initialize();

        historyListControl = $("#" + controlPrefix + "-historyList").data().kendoMobileListView.setDataSource(kendo.data.DataSource.create(promptHistoryStack));
        historyScrollerHtml = $("#" + controlPrefix + "-historyScroller");
        historyScroller = historyScrollerHtml.data().kendoMobileScroller;
    };

    var onActivate = function () {
        showFirstPrompt(true);
    };

    var addHistoryText = function (_promptName, _caption, _text, _clear) {

        var prompt = cdt.Utilities.arrayFirst(promptHistoryStack, function (item) {
            return item.name == _promptName;
        });

        if (prompt != null) {



        }

    };

    var addDetailText = function (_promptName, _text, _clear) {

    };


    var getInputValue = function (_hidePassword) {

        if (currentPromptType == cdt.PromptControlType.Text) {
            return textControl.getText();
        } else if (currentPromptType == cdt.PromptControlType.Password) {
            return _hidePassword ? "*****" : passwordControl.getText();
        }

        return cdt.EmptyString;
    };

    var setInputValue = function (_value) {

        if (currentPromptType == cdt.PromptControlType.Text) {
            textControl.set("text",_value);
        } else if (currentPromptType == cdt.PromptControlType.Password) {
            passwordControl.set("text",_value);
        }
    };

    var onResetClick = function () {

        if (currentPrompt.resetEnabled == false)
            return;


        reset(true);
    };

    var onPreviousClick = function () {

        if (currentPrompt.previousEnabled == false)
            return;


        showPreviousPrompt();
    };

    var onAbortClick = function () {


        if (currentPrompt.abortEnabled == false)
            return;


        abort();

    };

    //var isCurrentPromptText = function () {
    //    return currentPromptType == cdt.PromptControlType.Text;
    //};

    //var isCurrentPromptList = function () {
    //    return promptControl.currentPromptType == cdt.PromptControlType.List;
    //};

    //var isCurrentPromptPassword = function () {
    //    return currentPromptType == cdt.PromptControlType.Password;
    //};


    var popupMenu = new cdt.OptionsPopupMenu("menu", onPreviousClick, onResetClick, onAbortClick);

    // interface 
    model = kendo.observable( {
        id: "IPromptControl",
        // properties
        textControl: textControl,
        passwordControl: passwordControl,
        listControl: listControl,
        resetCaption: resetCaption,
        resetEnabled: resetEnabled,
        previousCaption: previousCaption,
        previousEnabled: previousEnabled,
        abortCaption: abortCaption,
        abortEnabled: abortEnabled,
        optionCaption: optionCaption,
        promptHistoryList: promptHistoryList,
        promptHistoryStack: promptHistoryStack,
        currentPromptType: currentPromptType,
        // methods 
        addPrompt: addPrompt,
        showFirstPrompt: showFirstPrompt,
        showNextPrompt: showNextPrompt,
        showPrompt: showPrompt,
        returnToPrompt: returnToPrompt,
        loadResources: loadResources,
        getCurrentPrompt: getCurrentPrompt,
        validateOnEnter: validateOnEnter,
        initialize: initialize,
        onResetClick: onResetClick,
        onPreviousClick: onPreviousClick,
        onAbortClick: onAbortClick,
        getCurrentControl: getCurrentControl,
        addHistoryText: addHistoryText,
        addDetailText: addDetailText,
        setPromptItems: setPromptItems,
        reset: reset,
        abort: abort,
        resetText: resetText,
        onScan: onScan,
        isCurrentPromptText: isCurrentPromptText,
        isCurrentPromptList: isCurrentPromptList,
        isCurrentPromptPassword: isCurrentPromptPassword,
        isHistoryVisible: isHistoryVisible,
        blur: blur,
        onActivate: onActivate,
        testItems: testItems

    });

    return model;
};


cdt.prompt = function (_name, _captionId, _text,
			_resetEnabled, _previousEnabled, _abortEnabled,
			_showButton, _buttonCaptionId, _buttonClick,
			_showButton2, _button2CaptionId, _button2Click,
			_showButton3, _button3CaptionId, _button3Click,
			_resetClick, _previousClick, _abortClick,
			_skipable, _skip, _useHistory, _skipDefault,
            _toUpper,
            _validation, _validIfEmpty,
            _variableName,
            _validateAction,
            _promptControlType) {

    var id = "Prompt";
    // private members
    var parent;
    var name = _name;
    var captionId = _captionId;
    var caption = cdt.EmptyString; 
    var detailList = cdt.EmptyString; 
    var historyList = [];

    var resetEnabled = _resetEnabled;
    var defaultResetEnabled = _resetEnabled;
    var previousEnabled = _previousEnabled;
    var defaultPreviousEnabled = _previousEnabled;
    var abortEnabled = _abortEnabled;
    var defaultAbortEnabled = _abortEnabled;

    var buttonClick = _buttonClick;
    var buttonCaptionId = _buttonCaptionId;
    var buttonCaption = cdt.EmptyString; // ko.observable(cdt.EmptyString);
    var showButton = _showButton;

    var button2Click = _button2Click;
    var button2CaptionId = _button2CaptionId;
    var button2Caption = cdt.EmptyString; // ko.observable(cdt.EmptyString);
    var showButton2 = _showButton2;

    var button3Click = _button3Click;
    var button3CaptionId = _button3CaptionId;
    var button3Caption = cdt.EmptyString; //.observable(cdt.EmptyString);
    var showButton3 = _showButton3;

    var resetClick = _resetClick;
    var previousClick = _previousClick;
    var abortClick = _abortClick;

    var skipable = _skipable
    var skip = _skip;
    var useHistory = _useHistory;
    var skipDefault = _skipDefault;

    var toUpper = _toUpper;

    var validation = _validation;
    var validIfEmpty = _validIfEmpty;
    var variableName = _variableName;
    var validateAction = _validateAction;


    var promptControlType = _promptControlType;

    // list control
    var layoutTemplate;
    var dataSource;

    // text control
    var initialSavedText = _text;
    var savedText = _text;
    var validateAction;
    var items = [];
    var model;

    // support methods
    var setValidateAction = function (_validate) {
        validateAction = _validate;
    };

    var validate = function (_value, _callback) {

        if (model.variableName != null) {
            cdt.VariableManager.setLocalVariable(model.variableName,_value);
        }

        if (validateAction != null) {
            validateAction(_value, _callback);
        }
        else {
            _callback(true);
        }
    };

    var reset = function () {
        detailList.length = 0;
        historyList.length = 0;
        savedText = initialSavedText;
        items = [];

        if (model.variableName != null) {
            cdt.VariableManager.locals[model.variableName] = null;
        }

        resetEnabled = defaultResetEnabled;
        abortEnabled = defaultAbortEnabled;
        previousEnabled = defaultPreviousEnabled;
    };

    var addHistoryText = function (_caption, _text) {

        var historyItem = new cdt.historyItem(_caption, _text);

        historyList.push(historyItem);
    };

    var clearHistoryText = function () {
        // clear it this way so it will update UI
        while (historyList().length > 0)
            historyList.pop();
    };

    var addDetailText = function (_text) {

        var historyItem = new cdt.historyItem(null, _text);

        detailList.push(historyItem);
    };

    var clearDetailText = function () {
        // clear it this way so it will update UI
        while (detailList().length > 0)
            detailList.pop();
    };

    var getHistory = function () {

        return historyList[0];

        //var historyString = cdt.EmptyString;
        //cdt.Utilities.arrayForEach(historyList, function (h) {
        //    historyString += (h.buildString() + "<br />");
        //});

        //return historyString;
    };

    var configurePromptControl = function () {
        // clear history & detail text
        historyList.length = 0;
        detailList.length = 0;

        if (skipable && skip)
            return;

        // Update bindings to html elements
    };

    var setSavedText = function (_text) {
        savedText = _text;
    };

    var getSavedText = function () {
        return savedText;
    };

    var setItems = function (_items) {
        items = _items;
    };

    var getItems = function () {
        return items;
    };

    var releasePromptControl = function () {

        // Clean up binding mad in configure prompt control

    };

    var loadResources = function () {
        model.set("caption",cdt.ResourceManager.getString(captionId));
        model.set("buttonCaption",cdt.ResourceManager.getString(buttonCaptionId));
        model.set("button2Caption",cdt.ResourceManager.getString(button2CaptionId));
        model.set("button3Caption",cdt.ResourceManager.getString(button3CaptionId));
    };

    var setParent = function (_parent) {
        parent = _parent;
    };

    // ListPrompt methods
    var setLayout = function (_template) {
        layoutTemplate = _template;
    };

    var getLayout = function () {
        return layoutTemplate;
    }

    var setDataSource = function (_dataSource) {
        dataSource = _dataSource;
    };

    var getDataSource = function () {
        return dataSource;
    }

    // interface 
    model = kendo.observable( {
        id: "IPrompt",
        // properties
        promptControlType: promptControlType,
        name: name,
        caption: caption,
        resetEnabled: resetEnabled,
        previousEnabled: previousEnabled,
        abortEnabled: abortEnabled,
        buttonCaption: buttonCaption,
        button2Caption: button2Caption,
        button3Caption: button3Caption,
        showButton: showButton,
        showButton2: showButton2,
        showButton3: showButton3,
        buttonClick: buttonClick,
        button2Click: button2Click,
        button3Click: button3Click,
        resetClick: resetClick,
        previousClick: previousClick,
        abortClick: abortClick,
        skip: skip,
        skipable: skipable,
        skipDefault: skipDefault,
        useHistory: useHistory,
        historyList: historyList,
        detailList: detailList,
        toUpper: toUpper,
        validation: validation,
        validIfEmpty: validIfEmpty,
        variableName: variableName,
        validateAction: validateAction,
        // text control
        setSavedText: setSavedText,
        getSavedText: getSavedText,

        // list control
        getItems: getItems,
        setItems: setItems,
        setLayout: setLayout,
        setDataSource: setDataSource,
        getDataSource: getDataSource,
        getLayout: getLayout,

        // methods
        reset: reset,
        setValidateAction: setValidateAction,
        validate: validate,
        addHistoryText: addHistoryText,
        clearHistoryText: clearHistoryText,
        addDetailText: addDetailText,
        clearDetailText: clearDetailText,
        configurePromptControl: configurePromptControl,
        releasePromptControl: releasePromptControl,
        loadResources: loadResources,
        setParent: setParent,
        getHistory: getHistory
    });

    return model;
};

// View Model ---------------------------------------------------
cdt.viewModel = function (_captionId, _promptControl, _viewId) {
    var id = "ViewModel";

    // private members
    var isStartView = false;
    var captionId = _captionId;
    var caption = cdt.EmptyString;
    var promptControl = _promptControl;
    var isMenuVisible = false;
    var isMenuOpen = false;
    var isLoggedIn = false;
    var isLoggedOut = true;
    var overviewVisible = false;
    var currentUser;
    var viewId = _viewId;
    var view;
    var isInitialized = false;

    var customerLogo = "images/customerLogo.png";
    var radleyLogo = "images/radleyLogo.png";


    var model;


    // support methods
    var initialize = function () {

        if (isInitialized == false) {
            isInitialized = true;

            cdt.ResourceManager.cultureChanged.subscribe(onCultureChanged);
            loadResources();

            promptControl.initialize();
        }

        if (window.location.hash == "#main")
            return;

        // Are we already at this view?
        if (cdt.Application.getCurrentViewModel() == model) {
            return;
        }

        cdt.Application.setCurrentViewModel(model);
        cdt.VariableManager.setNamespace(model.viewId);

        if (model.get("isLoggedIn") == false) {
            promptControl.onActivate();
        }
    };

    var loadResources = function () {
        model.set("caption",cdt.ResourceManager.getString(captionId));
        promptControl.loadResources();
    };

    var uninitialize = function () {
        cdt.ResourceManager.cultureChanged.subscribe(onCultureChanged);
    };

    var onCultureChanged = function () {
        loadResources();
    };

    var logIn = function (_user) {

        resetScroller();
        model.set("currentUser", _user);
        model.set("isLoggedIn", true);
        model.set("isLoggedOut", false);
        model.set("isMenuVisible", true);
    }

    var logOut = function () {

        if (model.get("isMenuOpen") == true)
            return;

        model.set("currentUser", cdt.EmptyString);
        model.set("isLoggedIn", false);
        model.set("isLoggedOut", true);
        model.set("isMenuVisible", false);
        promptControl.reset(true);
    }

    var setIsMenuOpen = function (_menuState) {

        model.set("isMenuOpen", _menuState);
        
    }

    var resetScroller = function () {

        if (view == null) {

            view = $("#" + viewId).data();
            if (!view.hasOwnProperty("kendoMobileView")) {
                view = null;
                return;
            }
        }

        view.kendoMobileView.scroller.reset();
        
    }

    var showOverview = function (_show) {

        model.set("overviewVisible", _show);
    }

    var setCustomerLogo = function (_logo) {

        model.set("customerLogo", _logo);
    }

    var setRadleyLogo = function (_logo) {
        model.set("radleyLogo", _logo);
    }

    // interface 
    model = kendo.observable( {
        id: "IViewModel",

        // properties 
        isStartView: isStartView,
        captionId: captionId,
        caption: caption,
        promptControl: promptControl,
        isMenuVisible: isMenuVisible,
        isMenuOpen: isMenuOpen,
        overviewVisible: overviewVisible,
        isLoggedIn: isLoggedIn,
        isLoggedOut: isLoggedOut,
        currentUser: currentUser,
        viewId: viewId,
        customerLogo: customerLogo,
        radleyLogo: radleyLogo,
        // methods
        initialize: initialize,
        uninitialize: uninitialize,
        logIn: logIn,
        logOut: logOut,
        setIsMenuOpen: setIsMenuOpen,
        resetScroller: resetScroller,
        showOverview: showOverview,
        setCustomerLogo: setCustomerLogo,
        setRadleyLogo: setRadleyLogo,
        

    });

    return model;

};

//cdt.MessageBoxButton = Object.freeze({ "Ok": 0, "OkCancel": 1, "YesNo": 2 });
//cdt.MessageBoxResult = Object.freeze({ "Cancel": 0, "Ok": 1, "Yes": 2, "No":3 });
cdt.MessageBoxButton = { "Ok": 0, "OkCancel": 1, "YesNo": 2 };
cdt.MessageBoxResult = { "Cancel": 0, "Ok": 1, "Yes": 2, "No": 3 };

// Message Box ---------------------------------------------------
cdt.MessageBox = (function () {
    // private members
    var id = "MessageBox";
    var okVisible = false;
    var okOnly = false;
    var cancelVisible = false;
    var yesNoVisible = false;
    var title = cdt.EmptyString;
    var text = cdt.EmptyString;
    var okSelected = false;
    var okCancelSelected = false;
    var yesNoSelected = false;
    var completeAction = null;
    var dialogResult = cdt.MessageBoxResult.Cancel;
    var messageBoxButton;
    var model;

    // support methods
    var show = function (_title, _text, _messageBoxButton, _completeAction) {

        messageBoxbutton = _messageBoxButton;
        completeAction = _completeAction;
        model.set("title",_title);
        model.set("text",_text);

        model.set("okSelected",false);
        model.set("okCancelSelected",false);
        model.set("yesNoSelected",false);
        model.set("okVisible",false);
        model.set("cancelVisible",false);
        model.set("yesNoVisible",false);
        model.set("okOnly", false);

        if (_messageBoxButton == cdt.MessageBoxButton.Ok) {
            model.set("okOnly", true);
        } else if (_messageBoxButton == cdt.MessageBoxButton.OkCancel) {
            model.set("okVisible",true);
            model.set("cancelVisible",true);
        } else {
            model.set("yesNoVisible",true);
        }

        //cdt.Application.app.view().scroller.reset();

        $("#messageBoxDialog").kendoMobileModalView("open");
    };

    var closeDialog = function () {
        $("#messageBoxDialog").kendoMobileModalView("close");
        if (completeAction != null) {
            completeAction(cdt.MessageBox.getDialogResult());
        }
    };

    var okClicked = function (_event) {
        dialogResult = cdt.MessageBoxResult.Ok;
        closeDialog();
    };

    var yesClicked = function (_event) {
        dialogResult = cdt.MessageBoxResult.Yes;
        closeDialog();
    };

    var cancelClicked = function () {
        dialogResult = cdt.MessageBoxResult.Cancel;
        closeDialog();
    };

    var noClicked = function () {
        dialogResult = cdt.MessageBoxResult.No;
        closeDialog();
    };

    var getDialogResult = function () {
        return dialogResult;
    };

    var okMargin = function () {

        if (messageBoxButton == cdt.MessageBoxButton.Ok)
            return "40px";
        else
            return "0";
    }

    // interface 
    model = kendo.observable( {
        // properties 
        id: "IMessageBox",
        okVisible: okVisible,
        okOnly: okOnly,
        cancelVisible: cancelVisible,
        yesNoVisible: yesNoVisible,
        okSelected: okSelected,
        okCancelSelected: okCancelSelected,
        yesNoSelected: yesNoSelected,
        title: title,
        text: text,
        completeAction: completeAction,
        getDialogResult: getDialogResult,
        // methods
        show: show,
        okClicked: okClicked,
        yesClicked: yesClicked,
        cancelClicked: cancelClicked,
        noClicked: noClicked,
        okMargin: okMargin
    });
    return model;
})();


cdt.Application = (function () {

    var currentViewModel;
    var kendoApp;
    var configuration = new cdt.configuration();
    var startView;

    var initialize = function (_app) {
        kendoApp = _app;
    };

    var getKendoApp = function () {
        return kendoApp;
    };

    var getStartView = function () {

        if (startView == undefined) {
            startView = "#" + kendoApp.options.initial;
        }

        return startView;
    };

    var getCurrentViewModel = function () {
        return currentViewModel;
    };

    var setCurrentViewModel = function (_viewModel) {
        currentViewModel = _viewModel;
    };

    var onPopupItemClick = function (e) {

        $("#popupMenu").kendoMobilePopOver("close");

        if (currentViewModel.isLoggedIn) {
            currentViewModel.logOut();
            return;
        }

        if (e.target[0].id == "resetPopup") {
           currentViewModel.promptControl.onResetClick();
        } else if (e.target[0].id == "previousPopup") {
           currentViewModel.promptControl.onPreviousClick();
        } else if (e.target[0].id == "abortPopup") {
           currentViewModel.promptControl.onAbortClick();
        }
    };

    $(document).bind("keypress", function (e) {
        if (e.keyCode == kendo.keys.ENTER) {
            if (cdt.Utilities.endsWith(e.target.id, "Input")) {
                cdt.Application.getCurrentViewModel().promptControl.validateOnEnter();
            }
        }
    });

    return  {
        getKendoApp: getKendoApp,
        initialize: initialize,
        configuration: configuration,
        getStartView: getStartView,
        getCurrentViewModel: getCurrentViewModel,
        setCurrentViewModel: setCurrentViewModel,
        onPopupItemClick: onPopupItemClick
    };

})();



