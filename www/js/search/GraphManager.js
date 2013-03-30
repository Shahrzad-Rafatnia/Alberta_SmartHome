/**
 * GraphManager. Manages a whole bunch of graphs.
 */
define([
    'jquery',
    'underscore',
    'search/defines',
    './GraphControl'],

function ($, _, D, GraphControl) {
    "use strict";

    /**
     * Instantiate a new GraphManager, using the given element to place graphs
     * in, and the data (x, y, values, apartments, etc.).
     */
    function GraphManager(element, data) {
        /** Graphs are appended in the given element. */
        this.masterGraphList = $(element);
        this.data = data;
        this.values = data.values;

        /** List of managed graphs. */
        this.graphs = {};

        window.graphs = this.graphs;
    }

    /** Adds a new graph and returns its ID. */
    GraphManager.prototype.add = function () {
        var newGraph = new GraphControl(this, this.data),
            graphID = newGraph.id;

        /* Start tracking the given graph. */
        this.graphs[graphID] = newGraph;

        /* Append the element to the div. */
        this.masterGraphList.append(newGraph.element);

        return graphID;
    };

    /**
     * Stops tracking the given Graph ID. Intended to be used by a
     * GraphController to signify that it has been destroyed.
     */
    GraphManager.prototype.untrack = function (id) {
        delete this.graphs[id];
    };

    /** Request to remove the given graph from the manager. */
    GraphManager.prototype.remove = function (id) {
        this.graphs[id].destroy();
    };

    /** Makes a request an AJAX request immediately. */
    GraphManager.prototype._makeImmediateRequest = function (control, newRequest) {
        $.ajax({
            url: D.uri.process,
            type: 'GET',
            data: newRequest,
            success: function (newData) {
                control.onNewData(newData);
            },
            error: function () {
                console.log("Error fetching info from process.");
           }
        });

        // DEBUG!
        //setTimeout(function () {
        //    control.onNewData(D.exampleProcessResponse);
        //}, 0);

    };

    /**
     * Makes an AJAX request, but no more than once every
     * MinRequestDelay miliseconds. 
     */
    GraphManager.prototype.makeRequest = _.debounce(
        GraphManager.prototype._makeImmediateRequest,
        D.MinRequestDelay
    );

    /**
     * Takes that category array and converts it into things
     * that can be converted into optgroups for x and y.
     *
     * Also, creates an object that maps arbitrary value IDs to a
     * metadata object that contains the information needed to
     * send to process.php.
     *
     * Returns {
     *      x: { 'group1' : { "Display Name": "1" },
     *      y: { 'group1' : { "Display Name": "1" },
     *      values: { "1": {type: 'sensorarray', values: ["One value"]} }
     * }
     */
    GraphManager.makeCategories = function (categories) {
        var x = {}, y = {}, values = {};


        /* Parse the category names. */
        _.each(categories, function (elements, catName) {
            var valueType = D.categoryNameToType[catName];

            /* Initialize the category. */
            x[catName] = {};
            y[catName] = {};

            _.each(elements, function (info, name) {
                var displayName, value, valueID, forX, forY;

                /* Assume the value is applicable for both axes. */
                forX = true;
                forY = true;

                if (_.isString(info)) {
                    /* Use the defaults with this as the display name. */
                    displayName = info;
                    value = [name];

                } else {
                    /* It's a big scary object. */

                    displayName = info.displayName;

                    /* Check if it has multiple values, else just use the
                     * name as the value. */
                    value = (info.hasOwnProperty('multiple'))
                        ? info.multiple
                        : [name];

                    if (info.hasOwnProperty('applicableAxes')) {
                        forX = /x/.test(info.applicableAxes);
                        forY =  /y/.test(info.applicableAxes);
                    }
                }

                /* Create a value ID for the value and insert it into
                 * the value array thing. */
                valueID = _.uniqueId();
                values[valueID] = {
                    type: valueType,
                    values: value
                };

                /* Make sure we add to the applicable axes! */
                if (forX) {
                    x[catName][displayName] = valueID;
                }

                if (forY) {
                    y[catName][displayName] = valueID;
                }

            });

        });

        return { x: x, y: y, values: values };

    };



    /* Export the class. */
    return GraphManager;
});
