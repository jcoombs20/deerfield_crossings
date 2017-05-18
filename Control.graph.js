L.Control.graph = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-graph');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        var controlUI = L.DomUtil.create('div', 'leaflet-control-graph-interior', controlDiv);
        controlUI.id = "chartsControl";
        controlUI.title = 'Click to show charts window';
        return controlDiv;
    }
});

L.control.graph = function (options) {
    return new L.Control.graph(options);
};