/**
 * @author Furqaan Afzal <furqaan_afzal@outlook.com>
 */
define(['../WorldWind',
        '../error/ArgumentError'],
    function (wwd,
              ArgumentError) {
        "use strict";

        /**
         * LayorFactory's empty constructor
         *
         * @constructor
         */
        var LayerFactory = function () {
        };

        /**
         * The function below creates a WMS layer asynchronously.
         * It checks for argument errors and issues a callback once the layer is created
         * If there is an error, it calls the callback and passes in the exception
         *
         * @param serviceAddress
         * @param layerNames
         * @param callback
         */
        LayerFactory.prototype.createFromWms = function (serviceAddress, layerNames, callback) {
            // Check if serviceAddress is null
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWms", "missingServiceAddress"));
            }

            /*
             * Since Javascript does not allow method overloading,
             * this check allows a string to be passed in and converts
             * the string to a singleton array.
             */
            if (typeof layerNames == 'string') {
                var temp = layerNames;
                layerNames = [];
                layerNames.push(temp);
            }

            // Check if layerNames is null or empty
            if ((!layerNames) || layerNames.length == 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWms", "missingLayerNames"));
            }

            // Check if callback is null
            if (!callback) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWms", "missingCallback"));
            }

            // Get a handle on the current object
            var layerFactory = this;

            /*
             * Initiate a request for retrieval
             * If the request is successful, it proceeds to call the createFromWmsAsync function
             * Otherwise, it calls the callback and passes in the exception
             */
            $.get(serviceAddress)
                .done(function (xmlDom) {
                    layerFactory.createFromWmsAsync(xmlDom, serviceAddress, layerNames, callback);
                })
                .fail(function (jqXhr, text, exception) {
                    callback(exception);
                });
        };

        /**
         * The function below creates a WMS layer from layerCapabilities
         * It checks the arguments and then calls the createWmsLayer function
         *
         * @param layerCapabilities
         * @param callback
         */
        LayerFactory.prototype.createFromWmsLayerCapabilities = function (layerCapabilities, callback) {
            /**
             * Instead of method overloading,
             * it allows a string to be passed in and creates
             * a singleton array
             */
            if (typeof layerCapabilities == 'string') {
                var temp = layerCapabilities;
                layerCapabilities = [];
                layerCapabilities.push(temp);
            }

            // Check if layerCapabilities is null or empty
            if ((!layerCapabilities) || layerCapabilities.length == 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmsLayerCapabilities", "missing layers"));
            }

            // Checksif callback is null
            if (!callback) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmsLayerCapabilities", "missingCallback"));
            }

            // Call createWmsLayer to create the layer
            this.createWmsLayer(layerCapabilities, callback);
        };

        /**
         * The function below creates a WMTS layer asynchronously.
         * It checks for argument errors and issues a callback once the layer is created
         * If there is an error, it calls the callback and passes in the exception
         *
         * @param serviceAddress
         * @param layerIdentifier
         * @param callback
         */
        LayerFactory.prototype.createFromWmts = function (serviceAddress, layerIdentifier, callback) {
            // Check if serviceAddress is null
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmts", "missingServiceAddress"));
            }

            // Check if layerIdentifier is null
            if (!layerIdentifier) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmts", "missingLayerIdentifier"));
            }

            // Check if callback is null
            if (!callback) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmts", "missingCallback"));
            }

            // Get a handle on the current object
            var layerFactory = this;

            /*
             * Initiate a request for retrieval
             * If the request is successful, it proceeds to call the createFromWmsAsync function
             * Otherwise, it calls the callback and passes in the exception
             */
            $.get(serviceAddress)
                .done(function (xmlDom) {
                    layerFactory.createFromWmtsAsync(xmlDom, serviceAddress, layerIdentifier, callback);
                })
                .fail(function (jqXhr, text, exception) {
                    callback(exception);
                });
        };

        /**
         * The function below creates a WMTS layer from wmtsLayerCapabilities
         * It checks the arguments and calls the createWmtsLayer function
         *
         * @param wmtsLayer
         * @param callback
         */
        LayerFactory.prototype.createFromWmtsLayer = function (wmtsLayer, callback) {
            // Check if wmtsLayer is null
            if (!wmtsLayer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmtsLayer", "missing layer"));
            }

            // Check if callback is null
            if (!callback) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.ERROR, "LayerFactory", "createFromWmtsLayer", "missingCallback"));
            }

            // Call createWmtsLayer to create the layer
            this.createWmtsLayer(wmtsLayer, callback);
        };

        /**
         * The function below gets the wmsCapabilities using the xmlDom
         * It adds each layer capability into a list and then calls
         * the createWmsLayer function
         *
         * @param xmlDom
         * @param serviceAddress
         * @param layerNames
         * @param callback
         */
        LayerFactory.prototype.createFromWmsAsync = function (xmlDom, serviceAddress, layerNames, callback) {
            // Create wmsCapabilities object from xmlDom
            var wmsCapabilities = new WorldWind.WmsCapabilities(xmlDom);
            var layerCapabilities = [];
            for (var i in layerNames) {
                var layerCaps = wmsCapabilities.getNamedLayer(layerNames[i]);
                if (layerCaps) {
                    layerCapabilities.push(layerCaps);
                }
            }

            // Check if layerCapabilities is empty
            if (layerCapabilities.length == 0) {
                console.error("Provided layers did not match available layers");
            }

            // Call createWmsLayer function to create the layer
            this.createWmsLayer(layerCapabilities, callback);
        };

        /**
         * The function below gets the wmtsCapabilities from the xmlDom
         * It creates a wmtsLayer and then calls the createWmtsLayer function
         *
         * @param xmlDom
         * @param serviceAddress
         * @param layerIdentifier
         * @param callback
         */
        LayerFactory.prototype.createFromWmtsAsync = function (xmlDom, serviceAddress, layerIdentifier, callback) {
            // Create wmtsCapabilities object from xmlDom
            var wmtsCapabilities = new WorldWind.WmtsCapabilities(xmlDom);

            var wmtsLayer = wmtsCapabilities.getLayer(layerIdentifier);
            if (!wmtsLayer) {
                console.error("The layer identifier specified was not found");
            }

            // Call createWmtsLayer function to create the layer
            this.createWmtsLayer(wmtsLayer, callback);
        };

        /**
         * The function below creates the WMS layer
         *
         * @param layerCapabilities
         * @param callback
         */
        LayerFactory.prototype.createWmsLayer = function (layerCapabilities, callback) {
            var wmsCapabilities = layerCapabilities[0].capability.capsDoc;
            var layerLimit = wmsCapabilities.service.layerLimit;
            if ((layerLimit) && layerLimit < layerCapabilities.length) {
                console.error("The number of layers specified exceeds the services limit");
            }

            var wmsConfig = this.getLayerConfigFromWmsCapabilities(layerCapabilities);
            var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
            callback(null, wmsLayer);
        };

        /**
         * The function below creates the WMTS layer
         *
         * @param wmtsLayer
         * @param callback
         */
        LayerFactory.prototype.createWmtsLayer = function (wmtsLayer, callback) {
            var wmtsConfig = WorldWind.WmtsLayer.formLayerConfiguration(wmtsLayer);
            var wmtsLayer = new WorldWind.WmtsLayer(wmtsConfig);
            callback(null, wmtsLayer);
        };

        /**
         * The function below gets the WMS config
         * This function can be used to add anything to the WMS config
         *
         * @param wmsLayers
         * @returns {{}}
         */
        LayerFactory.prototype.getLayerConfigFromWmsCapabilities = function (wmsLayers) {
            var config = WorldWind.WmsLayer.formLayerConfiguration(wmsLayers[0]);
            config.title = "Average Surface Temp";

            for (var i = 1; i < wmsLayers.length; i++) {
                var layerName = wmsLayers[i].name;
                config.layerNames += ",";
                config.layerNames += layerName;
            }

            return config;
        };

        return LayerFactory;
    }
);