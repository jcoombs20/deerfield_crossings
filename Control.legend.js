L.Control.legend = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-legend');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        var controlUI = L.DomUtil.create('div', 'leaflet-control-legend-interior', controlDiv);
        controlUI.id = "legendControl";
        controlUI.title = 'Click to hide legend window';
        return controlDiv;
    }
});

L.control.legend = function (options) {
    return new L.Control.legend(options);
};