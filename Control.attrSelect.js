L.Control.attrSelect = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-attrSelect');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

        var controlUI = L.DomUtil.create('div', 'leaflet-control-attrSelect-interior', controlDiv);
        controlUI.id = "attrSelectControl";
        controlUI.title = 'Click to show attribute selection window';
        return controlDiv;
    }
});

L.control.attrSelect = function (options) {
    return new L.Control.attrSelect(options);
};


//******Add prioritization html elements
function completeAttrSelect() {

  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
  });


  //******Add in header div
  d3.select("#attrSelectDiv")
    .append("div")
    .attr("id", "attrSelectHeader")
    .html('<img class="pull-left header_icon" src="../images/checkmark.png" ondblclick="toolWindowToggle(&quot;attrSelect&quot;)" title="Double click to hide attribute selection window"></img>');

  d3.select("#attrSelectHeader")
    .append("h4")
    .attr("class", "legTitle")
    .attr("id", "attrSelectTitle")
    .text("Attribute Selection")
    .property("title", "Select attributes to make them available for mapping and graphing")
    .append("span")
    .html('<span id="attTT" class="glyphicon glyphicon-info-sign help-tooltip pull-right" data-toggle="tooltip" data-placement="auto right" data-container="body" data-html="true" title="<p><u><b><center>Attribute Selection</center></b></u></p><p>Enables the user to select which attributes are active and available for mapping in the \'Legend\' window and filtering in the \'Charts\' window.</p>"></span>');

  d3.select("#attrSelectTitle")
    .append("span")
    .attr("class", "glyphicon glyphicon-remove-sign pull-right minimize-button")
    .property("title", "Click to hide attribute selection window")
    .on("click", function() { toolWindowToggle("attrSelect"); });



  //******Add in divs for layers
  layers.forEach(function(layer) {
    //***Add layer header div
    d3.select("#attrSelectDiv")
      .append("div")
      .attr("id", "attrSelectDiv_" + layer)
      .append("div")
      .attr("id", "attrSelectDiv_" + layer + "Header");

      d3.select("#attrSelectDiv_" + layer + "Header")
        .append("div")
        .attr("class", "horBorder")
        .append("h5")
        .attr("id", "attrSelectDiv_" + layer + "Title")
        .attr("class", "legTitle")
        .text(layer.charAt(0).toUpperCase() + layer.slice(1))
        .append("span")
        .html('<span class="glyphicon glyphicon-info-sign help-tooltip pull-right" data-toggle="tooltip" data-placement="auto right" data-container="body" data-html="true" title="<p><u><b><center>' + layer.charAt(0).toUpperCase() + layer.slice(1,-1) + ' Attributes</center></b></u></p><p>Checked attributes are available for mapping in the \'Legend\' window and filtering in the \'Charts\' window.</p>"></span>');

      d3.select("#attrSelectDiv_" + layer + "Title")
        .append("span")
        .attr("class", "glyphicon glyphicon-minus-sign pull-right minimize-button")
        .attr("id", "attrSelectGlyph_" + layer)
        .attr("data-toggle", "collapse")
        .attr("data-target", "#attrSelectDiv_" + layer + "Options")
        .property("title", "Click to collapse " + layer + " attributes")
        .on("click", function() { changeGlyph(this); });

    d3.select("#attrSelectDiv_" + layer)
      .append("div")
      .attr("id", "attrSelectDiv_" + layer + "Options")
      .attr("class", "collapse in");
  });
      


  //******Add crossing attributes
  d3.select("#attrSelectDiv_crossingsOptions")
    .html('</div><div id="core"></div><div id="attr"></div>');

  //******Add Core Components
  d3.select("#core")
    .append("div")
    .attr("id", "coreComp")
    .append("div")
    .attr("class", "priorHeader1")
    .style("border-right", "1px solid black")
    .property("title", "Select which ecological disruption and transportation system vulnerability measures are available for use with the 'Legend' and 'Charts' windows")
    .append("h5")
    .attr("class", "priorTitle")
    .text("Core Attributes");

  //******Add Crossing Prioritization Score
  d3.select("#core")
    .append("div")
    .attr("id", "crossPrior")
    .append("div")
    .attr("class", "priorHeader2")
    .style("border-right", "1px solid black")
    .property("title", topos.crossings.tooltip.cross_prior)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_cross_prior" type="checkbox" class="priorCheck" value="cross_prior" checked></input><span>' + topos.crossings.title.cross_prior + '</span>');

  //******Add ecological connectivity
  d3.select("#crossPrior")
    .append("div")
    .attr("id", "midLevel")
    .append("div")
    .attr("id", "eco")
    .append("div")
    .attr("class", "priorHeader4")
    .attr("id", "connectEco")
    .property("title", "Options related to ecological disruption score available to view and filter")
    .append("label")
    .attr("class", "priorLabel")
    .html('<span>Ecological Disruption</span>')

  d3.select("#eco")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_eco" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');

  d3.select("#eco")
    .append("div")
    .attr("id", "ecoDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.int_eco_dis)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_int_eco_dis" type="checkbox" class="ecoCheck" value="int_eco_dis" checked></input><span>' + topos.crossings.title.int_eco_dis + '</span>');

  d3.select("#ecoDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.impassability)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_impassability" type="checkbox" class="ecoCheck" value="impassability"></input><span>' + topos.crossings.title.impassability + '</span>');

  d3.select("#ecoDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.delta_scaled)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_delta_scaled" type="checkbox" class="ecoCheck" value="delta_scaled"></input><span>' + topos.crossings.title.delta_scaled + '</span>');

  d3.select("#ecoDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.effect_scaled)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_effect_scaled" type="checkbox" class="ecoCheck" value="effect_scaled"></input><span>Connectivity Restoration</span>');

  d3.select("#ecoDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", "Potential for improved aquatic connectivity of coldwater streams via crossing replacement")
    .append("label")
    .attr("class", "priorLabel")
    .html('<span id="chk_water_temp" type="checkbox" class="attrCheck glyphicon glyphicon-plus-sign" value="water_temp" data-toggle="collapse" data-target="#coldWaterDiv" onclick="changeGlyph(this)" title="Click to open panel"></span><span>Coldwater Restoration</span>');

  d3.select("#ecoDiv")
    .append("div")
    .attr("id", "coldWaterDiv")
    .attr("class", "collapse")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.effect_scaled_16)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_effect_scaled_16" type="checkbox" class="ecoCheck" value="effect_scaled_16"></input><span>16\xB0 C</span>');

  d3.select("#coldWaterDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.effect_scaled_18)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_effect_scaled_18" type="checkbox" class="ecoCheck" value="effect_scaled_18"></input><span>18\xB0 C</span>');

  d3.select("#coldWaterDiv")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.effect_scaled_20)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_effect_scaled_20" type="checkbox" class="ecoCheck" value="effect_scaled_20"></input><span>20\xB0 C</span>');
  





  //******Transportation Connectivity
  d3.select("#midLevel")
    .append("div")
    .attr("id", "transport")
    .append("div")
    .attr("class", "priorHeader3")
    .attr("id", "connectTrans")
    .property("title", topos.crossings.tooltip.trans_vuln)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_trans_vuln" type="checkbox" class="priorCheck" value="trans_vuln" checked></input><span>' + topos.crossings.title.trans_vuln + '</span>');


  //******Disruption
  d3.select("#transport")
    .append("div")
    .attr("id", "transDiv")
    .append("div")
    .attr("id", "disrupt")
    .append("div")
    .property("title", "Options related to emergency service disruption score available to view and filter")
    .attr("class", "priorHeader4")
    .append("label")
    .attr("class", "priorLabel")
    .html('<span>Emergency Service Disruption</span>');

  d3.select("#disrupt")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_ems" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');

  d3.select("#disrupt")
    .append("div")
    .attr("id", "disruptInput")
    .append("div")
    .attr("id", "disruptComposite")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.ln_comp_del)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_ln_comp_del" type="checkbox" class="emsCheck" value="ln_comp_del" checked></input><span>' + topos.crossings.title.ln_comp_del + '</span>');
  
  d3.select("#disruptInput")
    .append("div")
    .attr("id", "disruptMax")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.max_del)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_max_del" type="checkbox" class="emsCheck" value="max_del"></input><span>' + topos.crossings.title.max_del + '</span>');

  d3.select("#disruptInput")
    .append("div")
    .attr("id", "disruptAve")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.ave_del)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_ave_del" type="checkbox" class="emsCheck" value="ave_del"></input><span>' + topos.crossings.title.ave_del + '</span>');

  d3.select("#disruptInput")
    .append("div")
    .attr("id", "disruptAveAff")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.ave_aff_del)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_ave_aff_del" type="checkbox" class="emsCheck" value="ave_aff_del"></input><span>' + topos.crossings.title.ave_aff_del + '</span>');




  //******Risk of Failure
  d3.select("#transDiv")
    .append("div")
    .attr("id", "rof")
    .append("div")
    .property("title", "Options related to crossing risk of failure score available to view and filter")
    .attr("class", "priorHeader4")
    .append("label")
    .attr("class", "priorLabel")
    .html('<span>Crossing Risk of Failure</span>');

  d3.select("#rof")
    .append("div")
    .attr("class", "priorDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_rof" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');

  d3.select("#rof")
    .append("div")
    .attr("id", "rofInput")
    .append("div")
    .attr("id", "rofInputMax")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.max_rof)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_max_rof" type="checkbox" class="rofCheck" value="max_rof" checked></input><span>' + topos.crossings.title.max_rof + '</span>');

  d3.select("#rofInput")
    .append("div")
    .attr("id", "rofInputStruct")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.struct_rof)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_struct_rof" type="checkbox" class="rofCheck" value="struct_rof"></input><span>' + topos.crossings.title.struct_rof + '</span>');

  d3.select("#rofInput")
    .append("div")
    .attr("id", "rofInputHydro")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.hydro_rof)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_hydro_rof" type="checkbox" class="rofCheck" value="hydro_rof"></input><span>' + topos.crossings.title.hydro_rof + '</span>');

  d3.select("#rofInput")
    .append("div")
    .attr("id", "rofInputGeo")
    .attr("class", "priorDiv")
    .property("title", topos.crossings.tooltip.geo_rof)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_geo_rof" type="checkbox" class="rofCheck" value="geo_rof"></input><span>' + topos.crossings.title.geo_rof + '</span>');



  //******Attribute selection
  d3.select("#attr")
    .append("div")
    .attr("class", "priorHeader1")
    .append("h5")
    .attr("class", "priorTitle")
    .text("Additional Attributes")
    .property("title", "Choose additional crossing attributes to be available for use with the 'Legend' and 'Charts' windows");

  d3.select("#attr")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_extra" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');

  d3.select("#attr")
    .append("div")
    .attr("id", "attrSelDiv");
    //.on("mousewheel", function() { d3.event.stopPropagation(); });
   

  var noDisplay = [];
  topos.crossings.keys.forEach(function(key) {
    if (topos.crossings.display[key] == "no") {
      noDisplay.push(key);
    }
  });

  var tmpDiv = d3.select("#attrSelDiv");
  noDisplay.forEach(function(key) {
    tmpDiv.append("div")
      .attr("class", "attrDiv")
      .property("title", topos.crossings.tooltip[key])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + key + '" type="checkbox" class="extraCheck" value="' + key + '"></input><span>' + topos.crossings.title[key] + '</span>')
      .on("click", function() { var tmpChk = d3.select("#chk_" + key); if(tmpChk.property("checked") == true) {topos.crossings.display[tmpChk.property("value")] = "yes"; } else {topos.crossings.display[tmpChk.property("value")] = "no"; } });
  });



  //******Updating elements
  d3.select("#attrSelectDiv_crossings").selectAll(".ecoCheck,.emsCheck,.rofCheck,.priorCheck,.attrCheck,.extraCheck,.allCheck")
    .on("click", function() {
      var tmpVal = this.value;
      var tmpSel = d3.select("#crossingsSelect").node().value;
      var tmpChk = d3.select(this); 
      if(tmpChk.classed("allCheck")) {
        switch(tmpChk.attr("id")) {
          case "chk_all_extra":
            var allChk = d3.selectAll(".extraCheck");
            break;
          case "chk_all_eco":
            var allChk = d3.selectAll(".ecoCheck");
            break;
          case "chk_all_ems":
            var allChk = d3.selectAll(".emsCheck");
            break;
          case "chk_all_rof":
            var allChk = d3.selectAll(".rofCheck");
            break;
        }
        if (this.checked == true) {
          allChk.property("checked", true);
          allChk[0].forEach(function(d) { topos.crossings.display[d.value] = "yes"; });
        } 
        else {
          allChk.property("checked", false);
          allChk[0].forEach(function(d) { topos.crossings.display[d.value] = "no"; });
        }
      }
      else {
        if(tmpChk.property("checked") == true) {
          topos.crossings.display[tmpChk.property("value")] = "yes";
        } 
        else {
          topos.crossings.display[tmpChk.property("value")] = "no";
          var tmpClass = tmpChk.attr("class").split("Check")[0];
          d3.select("#chk_all_" + tmpClass).property("checked", false); 
        }
      }

      updateLegends(topos.crossings);

      //******Change selected index to checked attribute
      var tmpSelect = d3.select("#crossingsSelect");
      var setOpt = tmpSelect.selectAll("option")[0].map(function(d) { return d.value; });
      var tmpIndex = setOpt.indexOf(tmpVal);
      if (tmpIndex > -1) {
        tmpSelect.property("selectedIndex", function() {return tmpIndex;});
      }
      else {
        if (setOpt.length > 1) {
          tmpIndex = setOpt.indexOf(tmpSel);
          if (tmpIndex > -1 && tmpSel != "...") {
            tmpSelect.property("selectedIndex", function() {return tmpIndex;});
          }
          else {
            tmpSelect.property("selectedIndex", function() {return 1;});
          }
        }
        changeStyle(tmpSelect.node().value, topos.crossings);
      }
    });





  //******Add in stream attributes
  d3.select("#attrSelectDiv_streamsOptions")
    .append("div")
    .attr("id", "attrStreams")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_streams" type="checkbox" class="allCheck" value="all" checked></input><span>Select All</span>');

  d3.select("#attrStreams")
    .append("div")
    .attr("id", "attrSelDivStreams");

  var display = [];
  topos.streams.keys.forEach(function(key) {
    if (topos.streams.display[key] == "yes") {
      display.push(key);
    }
  });

  var tmpDiv = d3.select("#attrSelDivStreams");
  display.forEach(function(key) {
    tmpDiv.append("div")
      .attr("class", "attrDiv")
      .property("title", topos.streams.tooltip[key])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + key + '" type="checkbox" class="streamCheck" value="' + key + '" checked></input><span>' + topos.streams.title[key] + '</span>')
      .on("click", function() { var tmpChk = d3.select("#chk_" + key); if(tmpChk.property("checked") == true) {topos.streams.display[tmpChk.property("value")] = "yes"; } else {topos.streams.display[tmpChk.property("value")] = "no"; } });
  });


  d3.select("#attrSelectDiv_streams").selectAll(".streamCheck,.allCheck")
    .on("click", function() { 
      var tmpVal = this.value;
      var tmpSel = d3.select("#streamsSelect").node().value;
      var tmpChk = d3.select(this); 
      if(tmpChk.classed("allCheck")) {
        switch(tmpChk.attr("id")) {
          case "chk_all_streams":
            var allChk = d3.selectAll(".streamCheck");
            break;
        }
        if (this.checked == true) {
          allChk.property("checked", true);
          allChk[0].forEach(function(d) { topos.streams.display[d.value] = "yes"; });
        } 
        else {
          allChk.property("checked", false);
          allChk[0].forEach(function(d) { topos.streams.display[d.value] = "no"; });
        }
      }
      else {
        if(tmpChk.property("checked") == true) {
          topos.streams.display[tmpChk.property("value")] = "yes";
        } 
        else {
          topos.streams.display[tmpChk.property("value")] = "no"; 
          d3.select("#chk_all_streams").property("checked", false); 
        }
      }

      updateLegends(topos.streams);

      //******Change selected index to checked attribute
      var tmpSelect = d3.select("#streamsSelect");
      var setOpt = tmpSelect.selectAll("option")[0].map(function(d) { return d.value; });
      var tmpIndex = setOpt.indexOf(tmpVal);
      if (tmpIndex > -1) {
        tmpSelect.property("selectedIndex", function() {return tmpIndex;});
      }
      else {
        if (setOpt.length > 1) {
          tmpIndex = setOpt.indexOf(tmpSel);
          if (tmpIndex > -1 && tmpSel != "...") {
            tmpSelect.property("selectedIndex", function() {return tmpIndex;});
          }
          else {
            tmpSelect.property("selectedIndex", function() {return 1;});
          }
        }
        changeStyle(tmpSelect.node().value, topos.streams);
      }
    });






  //******Add in catchment attributes
  d3.select("#attrSelectDiv_catchmentsOptions")
    .append("div")
    .attr("id", "attrCatchments")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", "Check to select all below attributes")
    .style("border-bottom", "1px solid black")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_catchments" type="checkbox" class="allCheck" value="all" checked></input><span>Select All</span>');

  d3.select("#attrCatchments")
    .append("div")
    .attr("id", "attrSelDivCatchments");

  var display = [];
  topos.catchments.keys.forEach(function(key) {
    if (topos.catchments.display[key] == "yes") {
      display.push(key);
    }
  });

  var tmpDiv = d3.select("#attrSelDivCatchments");
  display.forEach(function(key) {
    tmpDiv.append("div")
      .attr("class", "attrDiv")
      .property("title", topos.catchments.tooltip[key])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + key + '" type="checkbox" class="catchmentCheck" value="' + key + '" checked></input><span>' + topos.catchments.title[key] + '</span>')
      .on("click", function() { var tmpChk = d3.select("#chk_" + key); if(tmpChk.property("checked") == true) {topos.catchments.display[tmpChk.property("value")] = "yes"; } else {topos.catchments.display[tmpChk.property("value")] = "no"; } });
  });


  d3.select("#attrSelectDiv_catchments").selectAll(".catchmentCheck,.allCheck")
    .on("click", function() { 
      var tmpVal = this.value;
      var tmpSel = d3.select("#catchmentsSelect").node().value;
      var tmpChk = d3.select(this); 
      if(tmpChk.classed("allCheck")) {
        switch(tmpChk.attr("id")) {
          case "chk_all_catchments":
            var allChk = d3.selectAll(".catchmentCheck");
            break;
        }
        if (this.checked == true) {
          allChk.property("checked", true);
          allChk[0].forEach(function(d) { topos.catchments.display[d.value] = "yes"; });
        } 
        else {
          allChk.property("checked", false);
          allChk[0].forEach(function(d) { topos.catchments.display[d.value] = "no"; });
        }
      }
      else {
        if(tmpChk.property("checked") == true) {
          topos.catchments.display[tmpChk.property("value")] = "yes";
        } 
        else {
          topos.catchments.display[tmpChk.property("value")] = "no";
          d3.select("#chk_all_catchments").property("checked", false); 
        }
      }

      updateLegends(topos.catchments);

      //******Change selected index to checked attribute
      var tmpSelect = d3.select("#catchmentsSelect");
      var setOpt = tmpSelect.selectAll("option")[0].map(function(d) { return d.value; });
      var tmpIndex = setOpt.indexOf(tmpVal);
      if (tmpIndex > -1) {
        tmpSelect.property("selectedIndex", function() {return tmpIndex;});
      }
      else {
        if (setOpt.length > 1) {
          tmpIndex = setOpt.indexOf(tmpSel);
          if (tmpIndex > -1 && tmpSel != "...") {
            tmpSelect.property("selectedIndex", function() {return tmpIndex;});
          }
          else {
            tmpSelect.property("selectedIndex", function() {return 1;});
          }
        }
        changeStyle(tmpSelect.node().value, topos.catchments);
      }
    });
}





//******Update legend and chart select boxes
function updateLegends(topo) {
  var display = [];
  topo.keys.forEach(function(key) {
    if (topo.display[key] == "yes") {
      display.push(key);
    }
  });

  var tmpOpts = d3.select("#" + topo.class + "Select").selectAll("option")
    .data(display);

  //tmpOpts.splice(0,0, "...");

  tmpOpts.exit()
    .remove();
  tmpOpts.enter()
    .append("option")
  tmpOpts
    .attr("value", function(d) { return d; })
    .text(function(d) { return topo.title[d]; });

  d3.select("#" + topo.class + "Select")
    .insert("option", ":first-child")
    .attr("value", "...")
    .text("...");

  changeStyle(d3.select("#" + topo.class + "Select").node().value, topo);


 
  if (d3.select("#layerFilterSelect").node().value == topo.class) {
    display.splice(0,0, "...");
    tmpOpts = d3.select("#attributeFilterSelect").selectAll("option")
      .data(display);
      
    tmpOpts.exit()
      .remove();
    tmpOpts.enter()
      .append("option")
    tmpOpts
      .attr("value", function(d) { return d; })
      .text(function(d) { return topo.title[d]; });
  }

  //***Edit filter select if attribute graphed is removed
  graphs.forEach(function(graph) {
    if (display.indexOf(graph.split("-")[1]) == -1 && graph.split("-")[0] == topo.class) {
      removeFilter(graph, topo, 1);
    }
  });

  d3.select("#attributeFilterSelect").property("selectedIndex", function() {return 0;})
}
