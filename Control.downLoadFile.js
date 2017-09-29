L.Control.downLoadFile = L.Control.extend({
    options: {
        position: 'topleft',
        collapsed: true
    },

    onAdd: function (map) {
        this._map = map;
        var className = 'leaflet-control-downLoadFile';
        var container = this._container = L.DomUtil.create('div', className);
        container.id = "download";
        L.DomEvent.disableClickPropagation(container);

        var dlFile = L.DomUtil.create('div', className + '-div');
        dlFile.id = "downloadFile";

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

        container.appendChild(dlFile);

        return container;
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





//******Add download html elements
function completeDownload(tmpLayers) {
  d3.select("#downloadDiv")
    .append("div")
    .attr("id", "dlLayersDiv");
    
  tmpLayers.forEach(function(layer) {
    var Layer = layer.charAt(0).toUpperCase() + layer.slice(1);
    d3.select("#dlLayersDiv")
      .append("div")
      .attr("id", "dl" + Layer)
      .append("input")
      .attr({type: "radio", name: "layer", value: layer, id: "dl" + Layer + "Radio", class: "dlOptions"})
      .property("title", "Download visible features from " + layer + " layer");

    d3.select("#dl" + Layer)
      .append("label")
      .text(layer.charAt(0).toUpperCase() + layer.slice(1))
      .property("title", "Download visible features from " + layer + " layer")
      .attr("class", "dlLabel")
      .attr("for", "dl" + layer.charAt(0).toUpperCase() + layer.slice(1) + "Radio");
  });

  //***Check first radio
  d3.select("#dlLayersDiv").select("input").attr("checked", true);

  //***Add select for download file format
  d3.select("#dlLayersDiv")
    .append("select")
    .attr("id", "dlSelect")
    .attr("class", "filterAttrList")
    .style({"width":"100%", "margin":"10px 0px"})
    .property("title", "Select the download file format");

  d3.select("#dlSelect")
    .append("option")
    .attr("value", "csv")
    .text("CSV")
    .property("title", "Comma Separated Values");
    
  d3.select("#dlSelect")
    .append("option")
    .attr("value", "zip")
    .text("Shapefile")
    .property("title", "ESRI Shapefile");

  d3.select("#dlSelect")
    .append("option")
    .attr("value", "json")
    .text("GeoJSON")
    .property("title", "Geo Javascript Object Notation");

  d3.select("#downloadDiv")
    .append("div")
    .attr("class", "legendBtn")
    .property("title", "Save attributes of visible map features for the selected layer to the specified output format")
    .style({"text-align":"center","margin-top":"10px"})
    .append("a")
    .attr("id", "dlButton")
    .text("Download")
    .property("href", "#")
    .on("click", function() { downloadFile(); });
}




//*******Attach to download button
function downloadFile() {
  var outLayer = document.querySelector('input[name=layer]:checked').value;

  if(topos[outLayer].cfGroup["featureid"] == "both") {
    var tmpGroup = topos[outLayer].cfGroup.all[0];
  }
  else {
    var tmpGroup = topos[outLayer].cfGroup["featureid"];
  }

  //***Get identifier data of filtered features
  var filtData = topos[outLayer][tmpGroup].filter.featureid.top(Infinity);
  var filtIDs = filtData.map(function(d) { return d[topos[outLayer].uniqueID]; });
  

  //***Get all data for filtered features
  var tmpData = d3.selectAll("." + outLayer).data();
  var tmpDataProps = tmpData.map(function(d) { return d.properties; });
  var outData = tmpDataProps.filter(function(d) { return filtIDs.indexOf(d[topos[outLayer].uniqueID]) > -1; });


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
        outKeys.forEach(function(key) { 
          var tmpVal = backTransformData(topos[outLayer]["scale"][key], [row[key]], topos[outLayer]["max"][key]);
          if (topos[outLayer]["data_type"][key] == "date" & tmpVal != -9999) {
            var formatDate = d3.time.format("%-m/%-d/%Y");
            lineData.push(formatDate(new Date(parseFloat(tmpVal))));
          }
          else {
            lineData.push(tmpVal);
          }
        });
        
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

      tmpData.forEach(function(d) { if(tmpIDs.indexOf(d.properties[topos[outLayer].uniqueID]) != -1) { strOutData.features.push(d); } });
      
      //******Convert utm dates to string
      var formatDate = d3.time.format("%-m/%-d/%Y");
      strOutData = JSON.parse(JSON.stringify(strOutData));

      strOutData.features.forEach(function(d) {
        d3.keys(d.properties).forEach(function(key) { if (topos[outLayer]["data_type"][key] == "date") {
          if(parseFloat(d.properties[key]) != -9999) {
            d.properties[key] = formatDate(new Date(parseFloat(d.properties[key])));
          }
          else {
            d.properties[key] = d.properties[key].toString();
          }
        }});
      });

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
}