/*
 * Defines for the search page.
 *
 * Includes jQuery selectors (sel), AJAX URIs (uri), and other debug stuff.
 */
define({

    uri: {
        /* URI to retrieve new graph data. */
        process: '/search/process.php'
    }
    
    /*
     * This is an example of how the sensors will look. It's in simple
     * JSON so that we can move this to a simple file if need be. If
     * the value is a string, that is its display name. Otherwise,
     * the value is an object that must contain the display name. It
     * may also contain any axis constraints (by default, 'xy'), in
     * "applicableAxes". Multiple values are specified as an array of
     * value strings.
     */
    exampleCategories: {
        "Time": {
            "time": {
                "displayName": "Time",
                "applicableAxes": "x"
            }
        },

        "Sensors": {
            "CO2": "Carbon Dioxide (PPM)",
            "all_electricity": {
                "multiple": [
                    "Mains (Phase A)",
                    "Bedroom and hot water tank (Phase A)",
                    "Oven (Phase A) and range hood",
                    "Microwave and ERV controller",
                    "Electrical duct heating",
                    "Kitchen plugs (Phase A) and bathroom lighting",
                    "Energy recovery ventilation",
                    "Mains (Phase B)",
                    "Kitchen plugs (Phase B) and kitchen counter",
                    "Oven (Phase B)",
                    "Bathroom",
                    "Living room and balcony",
                    "Hot water tank (Phase B)",
                    "Refrigerator"],
                "applicableAxes": "y",
                "displayName": "All electricity"
            }
        },

        "Formulae": {
            "waffles": "Waffles"
        }
    },

    /* This data structure is what Devin wants! */
    exampleProcessParamaters: {
        "startdate": "2012-03-01", /* Includes this! */
        "enddate": "2012-03-02", /* Goes up to this! */
        /* This is the display name of the independent variable. */
        "xaxis": "CO2 (ppm)",
        /* This is either the formula name or the sensor name. This field
         * doesn't matter when xtype is time. */
        "x": "CO2",
        /* Type of the independent variable. Can be "time", "sensorarray", or
         * "formula". */
        "xtype": "sensorarray",
        /* This is the display name...? of the dependent variables. */
        "yaxis": "Water_Usage",
        /* This is the list of depenedent variables. */
        "y": ["Total_Water", "Hot_Water"],
        /* Can be "sensorarray" or "formula" */
        "ytype": "sensorarray", 
        /* The granularity. */
        "period": "Daily",
        /* The selected apartments. */
        "apartments": [1, 2]
    },


});
