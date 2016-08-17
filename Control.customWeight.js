L.Control.customWeight = L.Control.extend({
    options: {
        position: 'topright',
        text: 'Create',
        collapsed: true
    },

    onAdd: function (map) {
        this._map = map;
        var className = 'leaflet-control-customWeight';
        var container = this._container = L.DomUtil.create('div', className);

        L.DomEvent.disableClickPropagation(container);

        var form = this._form = L.DomUtil.create('form', className + '-form');

        var rofDiv = this._input = L.DomUtil.create('div', className + '-div', form);

        var rofTitle = this._input = L.DomUtil.create('h5', className + '-h5', rofDiv);
        rofTitle.innerHTML = "Crossing Condition Weights";
        rofTitle.title = "Create a custom-weighted crossing condition attribute for use in prioritization decisions";
        
        this._input = L.DomUtil.create('hr', className + '-hr', rofDiv);

        var hydroDiv = this._input = L.DomUtil.create('div', className + '-div', rofDiv);

        var hydroLabel = this._input = L.DomUtil.create('label', className + '-label', hydroDiv);
        hydroLabel.innerHTML = "Hydrologic";

        var hydroROF = this._input = L.DomUtil.create('input', className + '-input', hydroDiv);
        hydroROF.type = 'input';
        hydroROF.value = 1;
        hydroROF.name = "ROF";
        hydroROF.id = "hydroROF";
        hydroROF.size = 2;
        hydroROF.title = "Relative weight of hydrologic condition value in creation of custom attribute";

        var structDiv = this._input = L.DomUtil.create('div', className + '-div', rofDiv);

        var structLabel = this._input = L.DomUtil.create('label', className + '-label', structDiv);
        structLabel.innerHTML = "Structural";

        var structROF = this._input = L.DomUtil.create('input', className + '-input', structDiv);
        structROF.type = 'input';
        structROF.value = 1;
        structROF.name = "ROF";
        structROF.id = "structROF";
        structROF.size = 2;
        structROF.title = "Relative weight of structural condition value in creation of custom attribute";

        var geomorphDiv = this._input = L.DomUtil.create('div', className + '-div', rofDiv);

        var geomorphLabel = this._input = L.DomUtil.create('label', className + '-label', geomorphDiv);
        geomorphLabel.innerHTML = "Geomorphic";

        var geomorphROF = this._input = L.DomUtil.create('input', className + '-input', geomorphDiv);
        geomorphROF.type = 'input';
        geomorphROF.value = 1;
        geomorphROF.name = "ROF";
        geomorphROF.id = "geomorphROF";
        geomorphROF.size = 2;
        geomorphROF.title = "Relative weight of geomorphic condition value in creation of custom attribute";

        this._input = L.DomUtil.create('hr', className + '-hr', rofDiv);

        var submit = this._createButton(className, this.options.text);
        submit.title = "Click to create a custom crossing condition attribute using the relative weights specified above";
        form.appendChild(submit);

        L.DomEvent.on(submit, 'click', this._customWeight, this);

        if (this.options.collapsed) {
            L.DomEvent.on(container, 'mouseover', this._expand, this);
            L.DomEvent.on(container, 'mouseout', this._collapse, this);

            var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
            link.href = '#';
            link.title = 'File Downloader';

            L.DomEvent.on(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

            this._map.on('movestart', this._collapse, this);
        } else {
            this._expand();
        }

        container.appendChild(form);

        return container;
    },

    _createButton: function(css, text) {
        var btn = '<button type="button" class="' + css + '-button" />' + text + '</button>';

        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = btn;

        return radioFragment.firstChild;
    },

    _customWeight: function(event) {
        //get weights
        var hROF = Number(d3.select("#hydroROF").property("value"));
        var sROF = Number(d3.select("#structROF").property("value"));
        var gROF = Number(d3.select("#geomorphROF").property("value"));

        //******Add weighted ROF variable option to keys, legend select box, and histogram select box
        var tmpKey = "ROF_" + hROF + "-" + sROF + "-" + gROF;
        if (topos.crossings.keys.indexOf(tmpKey) == -1) {
          topos.crossings.keys.push(tmpKey);
          topos.crossings.title[tmpKey] = "Condition " + hROF + ":" + sROF + ":" + gROF;
          topos.crossings.unit[tmpKey] = "";
          topos.crossings.tooltip[tmpKey] = "Combined condition score (0 = Poor, 1 = Good) for stream crossing with hydrologic, structural, and geomorphic weightings of " + hROF + ", " + sROF + ", and " + gROF; 
          topos.crossings.direction[tmpKey] = "forward";
          topos.crossings.covType[tmpKey] = "number";

          d3.select("#crossingsSelect")
            .append("option")
            .attr("value", tmpKey)
            .text(topos.crossings.title[tmpKey]);
 
          if (d3.select("#layerFilterSelect").node().value == "crossings") {
            d3.select("#attributeFilterSelect")
              .append("option")
              .attr("value", tmpKey)
              .text(topos.crossings.title[tmpKey]);
          }
        }
        else {
          addAlert("This weighting combination has previously been used and is already present as an attribute option");
          return;
        }

        //******Calculate weighted ROF value
        var sumWeight = gROF + hROF + sROF;

        gROF = gROF/sumWeight;
        hROF = hROF/sumWeight;
        sROF = sROF/sumWeight;

        for (var i=0; i<crossingCov.length; i++) {
          crossingCov[i][tmpKey] = crossingCov[i].geo_rof*gROF + crossingCov[i].hydro_rof*hROF + crossingCov[i].struct_rof*sROF;
        };


        //******Add new weighted ROF to crossfilter
        cfDimension(topos.crossings, crossingCov);

        //******Add new weighted ROF to topoJSON
        var tmpMap = d3.map(crossingCov, function(d) {return d[topos.crossings.uniqueID];});

        topos.crossings.features.forEach(function(d) { 
          d.properties[tmpKey] = tmpMap.get(d.id)[tmpKey];
        });
        
        addAlert("A custom weighted condition attribute has been added to the 'Crossings' options in both the Legend and Charts windows");  
    },


    _expand: function () {
        L.DomUtil.addClass(this._container, 'leaflet-control-customWeight-expanded');
    },

    _collapse: function () {
        L.DomUtil.removeClass(this._container, 'leaflet-control-customWeight-expanded');
    }

});

L.control.customWeight = function (options) {
    return new L.Control.customWeight(options);
};

function addAlert(tmpText) {
  d3.select("body")
    .append("div")
    .attr("id", "addWeightContainer")
    .append("div")
    .attr("id", "addWeight")
    .append("p")
    .attr("id", "addWeightP")
    .text(tmpText);

  d3.select("#addWeight")
    .append("button")
    .attr("class", "addWeightButton")
    .text("OK")
    .on("click", function() { d3.select("#addWeightContainer").remove(); });
}