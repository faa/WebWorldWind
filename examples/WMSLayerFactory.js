/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['../src/WorldWind',
        './LayerManager',
        '../src/layer/LayerFactory'],
    function (ww,
              LayerManager,
              LayerFactory) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Standard World Wind layers
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Create layer factory to create WMS Layer
        var layerFactory = new LayerFactory();

        // Create WMS Layer and use Error-first callback to handle errors
        layerFactory.createFromWms(
            "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0",
            "MOD_LSTD_CLIM_M",
            function callback(err, layer) {
                if(err) {
                    console.log("WMS layer creation failed " + err);
                    return;
                }
                // Add the layer to WorldWind and update the layer manager
                wwd.addLayer(layer);
                layerManger.synchronizeLayerList();
                console.log("WMS layer creation succeeded");
            }
        );
    });