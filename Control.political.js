L.Control.political = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-political');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        var controlUI = L.DomUtil.create('div', 'leaflet-control-political-interior', controlDiv);
        controlUI.id = "polFilterControl";
        controlUI.title = 'Click to show filter window';
        return controlDiv;
    }
});

L.control.political = function (options) {
    return new L.Control.political(options);
};