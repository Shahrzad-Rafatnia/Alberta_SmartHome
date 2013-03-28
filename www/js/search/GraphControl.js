/**
 * GraphControl. Manages interface and controls of one graph.
 */
define([
    'jquery',
    'underscore',
    './Graph',
    'utils/TemplateManager'],

function ($, _, Graph, TemplateManager) {
    "use strict";

    var tman = new TemplateManager(),

        /* Create the graph-group element and bind all of its events. */
        makeGraphGroup,

        /* Element renderers. */
        renderOptGroups,
        renderControlAxes,
        renderControlDateTime,
        renderControlApartments,
        renderControlDisplayType,

        /* Element fetchers. */
        fetchAxes,
        fetchAparements,
        fetchDateTime,

        /* Binds events for the elements. */
        bindWeirdDateEvents,
        bindSelectAlls;


    /** Creates a new GraphControl. A GraphController has data. */
    function GraphControl(graphManager, data) {
        var id, element, graph, self = this;

        id = _.uniqueId('graph');
        element = $(makeGraphGroup(id, data));

        /** The GraphManager. */
        this.manager = graphManager;
        this.data = data;

        /* TEMPRORARY */
        element.find('a[href=#query]').click(function (evt) {
            evt.preventDefault();

            self.getQuery();
        });

        /** The following are shortcuts to jQuery of elements. */
        this.el = {};
        this.element = element;
        /** The control panel. */
        this.el.controls = element.find('.graph-controls');
        /** The graph panel. */
        this.el.graph = element.find('.graph-container');

        /* This should actually put a placeholder there until the
         * data is valid. */
        //this.graph = new Graph(this.el.graph, function (newRequest) {
        //    self.onGranularityChange(newRequest);
        //});
        this.graph = undefined;

        this.id = id;

    }



    /*
     * Parsing and retrieving data.
     */

    /**
     * Given a graph HTML thing (ID? Element?) will
     * parse its HTML controller and return the
     * data need to pass to process.php.
     */
    GraphControl.prototype.getQuery = function () {
        var query = {}, fetches;

        fetches = [
            fetchAxes(this.element, this.data.values), // Get the axes info.
        ];

        _.each(fetches, function (partial) {
            _(query).extend(partial);
        });

        console.log("Asserting whether the query is valid: ",
                GraphControl.validateGraphRequest(query));
        console.log(query);

        return query;
    };

    /**
     * Gets the graph type from the graph controls.
     */
    GraphControl.prototype.getGraphType = function () {
        var checkedRadio = this.el.controls.find('input[type=radio]:checked');

        return checkedRadio.val();
    };



    /*
     * Updating the view.
     */

    /**
     * This is to be called when the graph thinks its parameters has changed
     * (e.g., when it has been clicked).
     */
    GraphControl.prototype.onGranularityChange = function (newRequest) {
        var requestFromPicker, fullRequest;

        requestFromPicker = this.getQuery();
        fullRequest = _(requestFromPicker).extend(newRequest);

        this.makeRequest(fullRequest);
    };


    /** Politely asks the manager to fetch new data for us. */
    GraphControl.prototype.makeRequest = function (newData) {
        this.manager.makeRequest(this, newData);
    };

    /**
     * Should be called (probably by the GraphManager) when new
     * plottable data arrives.
     */
    GraphControl.prototype.onNewData = function  (newData) {
        /* Delegate this to update the data on the graph. */
        var withGraphType = _(newData).extend(this.getGraphType());

        this.graph.update(withGraphType);
    };



    /*
     * Template Rendering and element preparation.
     */

    /**
     * Vaguely complete graph group creating function.
     * DATA: not sure what this will be yet. Right now, it's just a x
     * category and a y category, plus apartment numbers.
     *
     * Returns a graph group jQuery element.
     */
    makeGraphGroup = function (graphID, data) {
        var elements,
            asText,
            renderedElements,
            rendered;

        /* Make all of the elements. */
        elements = [
            {
                header: 'Axes',
                content:  renderControlAxes(data.x, data.y)
            },
            {
                header: 'Date/Time',
                content:  renderControlDateTime()
            },
            {
                header: 'Apartments',
                content:  renderControlApartments(data.apartments)
            },
            {
                header: 'Graph Type',
                content:  renderControlDisplayType()
            }
        ];

        /* Place 'em in the appropriate container. */
        renderedElements = _.map(elements, function (params) {
            return tman.render('graph-control-li', params);
        }).join('');

        /* Render the ENTIRE graph group. */
        asText = tman.render('graph-group', {
            graphID: graphID,
            graphControls: renderedElements
        });

        /* Create a temporary div to convert the text element into a jQuery
         * element. */
        rendered = $('<div>').html(asText).children().first();

        bindWeirdDateEvents(rendered);
        bindSelectAlls(rendered);


        return rendered;

    };



    /**
     * Given a categories object, returns an HTML string that makes
     * <option>/<optgroup> elements out of it.
     */
    renderOptGroups = function (categories) {
        return tman.render('graph-optgroup', {categories : categories });
    };

    /**
     * Creates the content for the axes graph controls thing.
     *
     * Needs data to make the axes optgroups.
     */
    renderControlAxes = function (x, y) {
        return tman.render('graph-control-axes', {
            /* The content is just the two optgroups appended. */
            xAxis: renderOptGroups(x),
            yAxis: renderOptGroups(y)
        });
    };

    /** Creates the content for the date time controller thing. */
    renderControlDateTime = function () {
        /* This one takes no parameters... for now. */
        return tman.render('graph-control-datetime', {});
    };

    /** Creates the content for the appartment picker. */
    renderControlApartments = function (apartments) {
        return tman.render('graph-control-apartments', {
            apartments: apartments
        });
    };

    /** Creates the content for the graph type picker. */
    renderControlDisplayType = function () {
        return tman.render('graph-control-types', {});
    };

    /**
     * Graph controller is a jQuery which we can bind events to.
     * Yay!
     */
    bindWeirdDateEvents = function (graphController) {
        var dateThing, granularityChooser, hideAll, onChange;

        /* Get the date div and the drop down that will find the proper
         * granularity. */
        dateThing = graphController .find('.graph-controls-datetime').first();
        granularityChooser = dateThing.find('[name=granularity]');

        /* Hides all of the date/time category things. */
        hideAll = function () {
            dateThing.children('div').hide();
        };

        /* This will show only the proper granularity selector thing. */
        onChange = function () {
            var granularity = granularityChooser.val().toLowerCase();
            hideAll();
            dateThing.children('.graph-controls-' + granularity).show();
        };

        granularityChooser.change(onChange);

        /* Pretend it change for the first time. */
        onChange();
    };

    /* Binds select all. Doesn't really work yet. */
    bindSelectAlls = function (element) {
        var selectToggler = element.find('[data-select-all]'),
            parent = selectToggler.parent(),
            checkboxes = parent.children('input[type=checkbox]');

        // TODO: Should find parent with checkboxes.

        selectToggler.click(function (event) {
            event.preventDefault();
        });

    };


    /**
     * Fetches the partial query for X and Y information from the
     * '.graph-control-axes-{x,y}' elements contained within the given
     * subelement.
     */
    fetchAxes = function (controlElement, values) {
        var partialQuery =  {};

        // The  "v" is for "variable variable"! 
        _.each(['x', 'y'], function (v) {
            var select = controlElement.find('graph-control-axes-' + v),
                valueID,
                valueTuple;

            /* Assumes a single select. */
            valueID = select.val();
            valueTuple = values[valueID];

            /* Set the values in the partial tuple. */
            partialQuery[v + 'type'] = valueTuple.type;
            partialQuery[v + 'values'] = valueTuple.values

        });
        
        return partialQuery;
    };

    /*
     * "Public static methods"
     * These functions are exported, but are useless on a single
     * instance. Regardless, they belong to this "class".
     */

    /**
     * Returns whether or not the graph request contains all the keys
     * it needs in order to make process.php happy. This is mostly for
     * debug and sanity checking.
     */
    GraphControl.validateGraphRequest = function (graphRequest) {
        var requiredKeys = [
            "startdate", "enddate", "xaxis", "x", "xtype", "yaxis", "y",
            "ytype", "period", "apartments"
        ];

        return _.all(requiredKeys, function (key) {
            return _(graphRequest).has(key);
        });
    };

    /* Export the class. */
    return GraphControl;

});
