var cdt = cdt || {};

cdt.controls = cdt.controls || {};


cdt.controls.DATABINDING = "dataBinding";
cdt.controls.DATABOUND = "dataBound";
cdt.controls.CHANGE = "change";

// Custom Bindings
kendo.data.binders.widget.title = kendo.data.Binder.extend({
	init: function (widget, bindings, options) {
		kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
	},
	refresh: function () {
		var value = this.bindings["title"].get();
		$(this.element).data("kendoDataRepeater").setTitle(value);
	},
	change: function () {

		// Listen for changes off of UI element and then call set() on binding
		//this.bindings //contains all bindings for the current element
		//this.element //reference the to the DOM element
	}
});


(function ($) {

	var kendo = window.kendo,
		ui = kendo.mobile.ui,
		ListView = ui.ListView

	var CustomListView = ListView.extend({

		selected: 0,

		init: function (element, options) {

			var that = this;
			ListView.fn.init.call(that, element, options);
			//that.template = kendo.template(that.options.template || "<ul><strong>#= data #</strong></ul>", { useWithBlock: false });

			//// append the element that will be the auto complete
			//var headerElement = $("<div><h2><span></span></h2></div>");
			//that.header = headerElement.find("span");
			//that.element.append(headerElement);

			//var scrollerElement = $("<div></div>");
			//scrollerElement.css("height", "400px");
			//that.element.append(scrollerElement);
			//var listViewElement = $("<div></div>");
			//scrollerElement.append(listViewElement);
			//that.listView = listViewElement.kendoMobileListView({
			//	dataSource: that.options.dataSource,
			//	template: that.options.dataTemplate
			//});

			//that.scroller = scrollerElement.kendoMobileScroller();
		},
		refresh: function () {
			ListView.fn.refresh.call(this);

			$(this.element.children()[this.selected]).css("background-color","red")

		},
		_click: function(e) {
			ListView.fn._click.call(this,e);

		
		},
		options: {
			name: "CustomListView",
			autoBind: true,
			dataTemplate: "",
			dataSource: null,
			caption: "Add Caption"
		}
	});

	ui.plugin(CustomListView);

})(jQuery);




(function ($) {

	var kendo = window.kendo,
		ui = kendo.ui,
		Widget = ui.Widget

	var DataRepeater = Widget.extend({

		init: function (element, options) {

			var that = this;
			Widget.fn.init.call(that, element, options);
			that.template = kendo.template(that.options.template || "<ul><strong>#= data #</strong></ul>", { useWithBlock: false });

			// append the element that will be the auto complete
			var headerElement = $("<div><h2><span></span></h2></div>");
			that.header = headerElement.find("span");
			that.element.append(headerElement);

			var scrollerElement = $("<div></div>");
			scrollerElement.css("height", "400px");
			that.element.append(scrollerElement);
			var listViewElement = $("<div></div>");
			scrollerElement.append(listViewElement);
			that.listView = listViewElement.kendoMobileListView({
				dataSource: that.options.dataSource,
				template: that.options.dataTemplate
			});

			that.scroller = scrollerElement.kendoMobileScroller();

			that.setTitle(options.title);

			//that._dataSource();

		},
		setTitle: function (_title) {
			this.header.text(_title);
		},
		options: {

			name: "DataRepeater",
			autoBind: true,
			dataTemplate: "",
			dataSource: null,
			caption: "Add Caption"
		},
		events: [
			cdt.controls.DATABINDING,
			cdt.controls.DATABOUND
		],

		items: function () {

			return this.element.children();
		},

		setDataSource: function (dataSource) {

			this.options.dataSource = dataSource;

			this._dataSource();
		},

		refresh: function () {
			var that = this,
			view = that.dataSource.view();
			html = kendo.render(that.template, view);
			// bodyHtml = that.bodyTemplate( { header: "hello world!", template: "<ul><strong>#= data.Id #</strong></ul>", detail: parts });

			that.trigger(cdt.controls.DATABINDING);

			that.element.html(html);

			that.trigger(cdt.controls.DATABOUND);
		},

		_dataSource: function () {
			var that = this;

			if (that.dataSource && that._refreshHandler) {
				that.dataSource.unbind(CHANGE, that._refreshHandler);
			}
			else {
				that._refreshHandler = $.proxy(that.refresh, that);
			}

			that.dataSource = kendo.data.DataSource.create(that.options.dataSource);
			// bind to the change event to refresh the widget
			that.dataSource.bind(CHANGE, that._refreshHandler);

			if (that.options.autoBind) {
				that.dataSource.fetch();
			}
		}

	});

	ui.plugin(DataRepeater);

})(jQuery);