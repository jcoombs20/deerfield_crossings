L.Control.downLoadFile = L.Control.extend({
    options: {
        position: 'topright',
        text: 'Download',
        collapsed: true
    },

    onAdd: function (map) {
        this._map = map;
        var className = 'leaflet-control-downLoadFile';
        var container = this._container = L.DomUtil.create('div', className);

        L.DomEvent.disableClickPropagation(container);

        var form = this._form = L.DomUtil.create('form', className + '-form');
        form.id = "dlForm";

        var dlTitle = this._input = L.DomUtil.create('h5', className + '-h5', form);
        dlTitle.innerHTML = "Download Map Features";
        
        this._input = L.DomUtil.create('hr', className + '-hr', form);

        var crossDiv = this._input = L.DomUtil.create('div', className + '-div', form);

        var crossings = this._input = L.DomUtil.create('input', className + '-input', crossDiv);
        crossings.type = 'radio';
        crossings.value = "crossings";
        crossings.name = "layer";
        crossings.checked = true;

        var crossLabel = this._input = L.DomUtil.create('label', className + '-label', crossDiv);
        crossLabel.innerHTML = "Crossings";

        var streamDiv = this._input = L.DomUtil.create('div', className + '-div', form);

        var streams = this._input = L.DomUtil.create('input', className + '-input', streamDiv);
        streams.type = 'radio';
        streams.value = "streams";
        streams.name = "layer";

        var streamLabel = this._input = L.DomUtil.create('label', className + '-label', streamDiv);
        streamLabel.innerHTML = "Streams";

        var catchDiv = this._input = L.DomUtil.create('div', className + '-div', form);

        var catchments = this._input = L.DomUtil.create('input', className + '-input', catchDiv);
        catchments.type = 'radio';
        catchments.value = "catchments";
        catchments.name = "layer";

        var catchLabel = this._input = L.DomUtil.create('label', className + '-label', catchDiv);
        catchLabel.innerHTML = "Catchments";

        this._input = L.DomUtil.create('hr', className + '-hr', form);

        //******Output select box
        var dlSelectDiv = this._input = L.DomUtil.create('div', className + '-dlSelectDiv', form);

        var dlSelect = this._input = L.DomUtil.create('select', className + '-dlSelect', dlSelectDiv);
        dlSelect.id = "dlSelect";
        dlSelect.title = "Select the format for the output file";

        var dlCSV = this._input = L.DomUtil.create('option', className + '-dlOption', dlSelect);
        dlCSV.value = "csv";
        dlCSV.text = "CSV";

        var dlShape = this._input = L.DomUtil.create('option', className + '-dlOption', dlSelect);
        dlShape.value = "zip";
        dlShape.text = "Shapefile";

        var dlGeo = this._input = L.DomUtil.create('option', className + '-dlOption', dlSelect);
        dlGeo.value = "json";
        dlGeo.text = "GeoJSON";

	 var submit = this._input = L.DomUtil.create('a', className + '-a', form);
	 submit.id = "dlButton";
        submit.href = "#";
        submit.onclick = this._downLoadFile;
        submit.innerHTML = "Download";
        submit.title = "Download attributes of displayed map features for the selected layer above to the specified output format";

        form.appendChild(submit);

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

    _downLoadFile: function(event) {
        var outLayer = document.querySelector('input[name=layer]:checked').value;
        
        var outData = topos[outLayer].filter.featureid.top(Infinity);
        
        if (outData.length > 0) {
          //******CSV output
          if (d3.select("#dlSelect").node().value == "csv") {
            var outKeys = d3.keys(outData[0]);
            var titleKeys = [];
            outKeys.forEach(function(key) { titleKeys.push(topos[outLayer].title[key]); });

            if (outLayer == "crossings") {
              var strOutData = titleKeys.join() + ",Longitude,Latitude" + String.fromCharCode(13);
              var tmpData = d3.selectAll(".crossings").data();
              var tmpID = tmpData.map(function(d) {return d["properties"][topos.crossings.uniqueID];});
            }
            else {
              var strOutData = titleKeys.join() + String.fromCharCode(13);
            }

            outData.forEach(function(row) { 
              var lineData = [];
              outKeys.forEach(function(key) { lineData.push(row[key]); });
              if (outLayer == "crossings") {
                var tmpPoint = tmpData[tmpID.indexOf(row[topos.crossings.uniqueID])].geometry.coordinates;
                lineData.push(tmpPoint[0]);
                lineData.push(tmpPoint[1]);
              }
              strOutData += lineData.join() + String.fromCharCode(13);
            });

            var blob = new Blob([strOutData], {type: "text/plain"});
          }

          //******Shapefile and geoJSON output
          else {           
            var tmpData = d3.selectAll("." + outLayer).data();
            var tmpIDs = outData.map(function(d) { return d[topos[outLayer].uniqueID]; });

            var strOutData = {};
            strOutData.type = 'FeatureCollection';
            strOutData.features = [];

            tmpArray = tmpData.filter(function(d) { if(tmpIDs.indexOf(d.properties[topos[outLayer].uniqueID]) != -1) { strOutData.features.push(d); } });

            //******Shapefile output
            if (d3.select("#dlSelect").node().value == "zip") {
              var shpwrite = require('shp-write');

              var options = {
                folder: outLayer,
                types: {
                  point: outLayer,
                  polygon: outLayer,
                  line: outLayer,
                  polyline: outLayer
                }
              }

              //shpwrite.download(strOutData, options);
              //return;

              var byteString = shpwrite.zip(strOutData, options);

              var byteCharacters = window.atob(byteString);

              var byteNumbers = new Array(byteCharacters.length);
              for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }

              var byteArray = new Uint8Array(byteNumbers);

              var blob = new Blob([byteArray], {type: 'application/zip'});             
            }

            //******GeoJSON output
            else {
              strOutData = JSON.stringify(strOutData);
              var blob = new Blob([strOutData], {type: "text/plain"});
            }
          }       

          //*******Add to download link
          //var blob = new Blob([strOutData], {type: "text/plain"});
          var url = URL.createObjectURL(blob);
          var a = d3.select("#dlButton");
          a.property("download", outLayer + "." + d3.select("#dlSelect").node().value);
          a.property("href", url);
        }
        else {
          alert("No data selected to output");
        }
    },


    _expand: function () {
        L.DomUtil.addClass(this._container, 'leaflet-control-downLoadFile-expanded');
    },

    _collapse: function () {
        L.DomUtil.removeClass(this._container, 'leaflet-control-downLoadFile-expanded');
    }

});

L.control.downLoadFile = function (options) {
    return new L.Control.downLoadFile(options);
};
