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
    .append("h4")
    .attr("class", "legTitle")
    .attr("id", "attrSelectTitle")
    .text("Attribute Selection")
    .property("title", "Select attributes to make them available as options for mapping in the 'Layers' window and graphing in the 'Charts' window")
    .append("span")
    .html('<span id="attTT" class="glyphicon glyphicon-info-sign help-tooltip" data-toggle="tooltip" data-placement="auto right" data-container="body" data-html="true" title="<p><u><b><center>Attribute Selection</center></b></u></p><p>Enables the user to select which attributes are active and available as options for mapping in the \'Legend\' window and filtering in the \'Charts\' window.<br><br>The layout also tries to convey the data hierarchy for the Crossing attributes, attempting to show that attributes under \'Combined Scores\' are derived from lower order attributes.</p>"></span>');

  d3.select("#attrSelectDiv")
    .append("div")
    .attr("id", "attrSelectInfo")
    .append("p")
    .text("Selecting an attribute makes it available as a dropdown option for mapping in the 'Layers' window and graphing in the 'Charts' window")
    .property("title", "Selecting an attribute makes it available as a dropdown option for mapping in the 'Layers' window and graphing in the 'Charts' window");

  //******Add in div for Crossings layer
  d3.select("#attrSelectDiv")
    .append("div")
    .attr("id", "attrSelectLayersDiv")
    .append("div")
    .attr("id", "attrSelectCrossings")
    .append("div")
    .attr("id", "attrSelectCrossingsHeader")
    .append("h5")
    .attr("class", "attrSelectLayerTitle")
    .text("Crossings")
    .property("title", "Crossings feature layer")
    .style("margin-bottom", "0px");

  d3.select("#attrSelectCrossings")
    .append("div")
    .attr("id", "attrSelectCrossingsOptions");

  //******Add in div for Streams & Catchments layers
  d3.select("#attrSelectLayersDiv")
    .append("div")
    .attr("id", "attrSelectStreamsCatchments");

  ["Streams", "Catchments"].forEach(function(layer) {
    d3.select("#attrSelectStreamsCatchments")
      .append("div")
      .attr("id", "attrSelect" + layer)
      .style("margin-bottom", "100px")
      .append("h5")
      .attr("class", "attrSelectLayerTitle")
      .text(layer)
      .property("title", layer + " feature layer");

    d3.select("#attrSelect" + layer)
      .append("div")
      .attr("id", "attrSelect" + layer + "Options");
  });



  //******Add crossing attributes
  d3.select("#attrSelectCrossingsOptions")
    .html('</div><div id="column1"></div><div id="column2"></div>');

  //******Add Core Components
  //******Add Combined attributes
  d3.select("#column1")
    .append("p")
    .attr("class", "priorTitle")
    .text("Combined Scores");

  //******Add Crossing Prioritization Score
  d3.select("#column1")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", topos.crossings.tooltip.cross_prior)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_cross_prior" type="checkbox" class="combCheck" value="cross_prior" checked></input><span>' + topos.crossings.title.cross_prior + '</span><p class="attrSubHead">(Transportation Vulnerability & Ecological Disruption)</p>');

  //******Add Transportation Connectivity Score
  d3.select("#column1")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", topos.crossings.tooltip.trans_vuln)
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_trans_vuln" type="checkbox" class="combCheck" value="trans_vuln" checked></input><span>' + topos.crossings.title.trans_vuln + '</span><p class="attrSubHead">(Overall EMS Delay & Overall Risk of Failure)</p>');




  //******Add Ecological Disruption
  d3.select("#column1")
    .append("p")
    .attr("class", "priorTitle")
    .text("Ecological Disruption");

  //******Add Ecological Disruption attributes
  ["eco_dis", "impass", "deltaln", "effectln", "anad_rest"].forEach(function(d) {
    d3.select("#column1")
      .append("div")
      .attr("class", "attrDiv")
      .property("title", topos.crossings.tooltip[d])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + d + '" type="checkbox" class="ecoCheck" value="' + d + '"></input><span>' + topos.crossings.title[d] + '</span>');

    d3.select("#chk_" + d)
      .property("checked", function() { return topos.crossings.display[d] == "yes"; });
  });

  //******Add in Coldwater Restoration options
  d3.select("#column1")
    .append("p")
    .attr("class", "priorSubTitle")
    .style("color", "lightseagreen")
    .text("Coldwater Restoration");

  //******Coldwater Current
  d3.select("#column1")
    .append("div")
    .attr("id", "coldCurrent")
    .append("p")
    .attr("class", "horListTitle")
    .property("title", "Restoration potential based on current water temperatures")
    .text("Current");
  
  //******Current temps
  ["16","18","20","22"].forEach(function(d) {
    d3.select("#coldCurrent")
      .append("div")
      .attr("class", "horListDiv")
      .property("title", topos.crossings.tooltip["effln" + d + "Cur"])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_effln' + d + 'Cur" type="checkbox" class="ecoCheck" value="effln' + d + 'Cur"></input><span>' + d + '\xB0 C</span>');
  });

  //******Coldwater Future
  d3.select("#column1")
    .append("div")
    .attr("id", "coldFuture")
    .append("p")
    .attr("class", "horListTitle")
    .property("title", "Restoration potential based on future water temperatures assumning a 2 degree celsius increase over current water temperatures")
    .html('<span style="margin-right:7px;">Future</span>');

  //******Future temps
  ["16","18","20","22"].forEach(function(d) {
    d3.select("#coldFuture")
      .append("div")
      .attr("class", "horListDiv")
      .property("title", topos.crossings.tooltip["effln" + d + "Fut"])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_effln' + d + 'Fut" type="checkbox" class="ecoCheck" value="effln' + d + 'Fut"></input><span>' + d + '\xB0 C</span>');
  });
 
  //******Add in Select All Div
  d3.select("#column1")
    .append("div")
    .attr("class", "selectAllDiv attrDiv")
    .property("title", "Check to select all 'Ecological Disruption' attributes")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_eco" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');







  //******Add EMS Disruptions Vulnerability
  d3.select("#column1")
    .append("p")
    .attr("class", "priorTitle")
    .text("Emergency Services Disruption");

  //******Add Ecological Disruption attributes
  ["int_del", "ave_del", "aff_del", "max_del"].forEach(function(d) {
    d3.select("#column1")
      .append("div")
      .attr("class", "attrDiv")
      .property("title", topos.crossings.tooltip[d])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + d + '" type="checkbox" class="emsCheck" value="' + d + '"></input><span>' + topos.crossings.title[d] + '</span>');

    d3.select("#chk_" + d)
      .property("checked", function() { return topos.crossings.display[d] == "yes"; });
  });

  //******Add in Select All Div
  d3.select("#column1")
    .append("div")
    .attr("class", "selectAllDiv attrDiv")
    .property("title", "Check to select all 'Emergency Services Disruption' attributes")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_ems" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');







  //******Add Risk of Failure
  d3.select("#column2")
    .append("p")
    .attr("class", "priorTitle")
    .text("Risk of Failure");

  //******Add Risk of Failure attributes
  ["max_rof", "struct_rof", "geo_rof"].forEach(function(d) {
    d3.select("#column2")
      .append("div")
      .attr("class", "attrDiv")
      .property("title", topos.crossings.tooltip[d])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + d + '" type="checkbox" class="rofCheck" value="' + d + '"></input><span>' + topos.crossings.title[d] + '</span>');

    d3.select("#chk_" + d)
      .property("checked", function() { return topos.crossings.display[d] == "yes"; });
  });

  //******Add in Hydraulic ROF options
  d3.select("#column2")
    .append("label")
    .attr("class", "priorSubTitle")
    .style("color", "lightseagreen")
    .text("Hydraulic Risk Models");

  //******Hydraulic ROF Current
  d3.select("#column2")
    .append("div")
    .attr("id", "hydROFCurrent")
    .append("p")
    .attr("class", "horListTitle")
    .property("title", "Current hydraulic risk models")
    .html('<span style="margin-right:28px;">Current</span>');
  
  //******Current models
  var hydModel = ["All","Physical","Statististical"];
  ["hydCurAll","hydCurPhys","hydCurStat"].forEach(function(d,i) {
    d3.select("#hydROFCurrent")
      .append("div")
      .attr("class", "horListDiv")
      .property("title", topos.crossings.tooltip[d])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + d + '" type="checkbox" class="rofCheck" value="' + d + '"></input><span>' + hydModel[i] + '</span>');
  });


  //******Hydraulic ROF Mid-century
  d3.select("#column2")
    .append("div")
    .attr("id", "hydROFFuture")
    .append("p")
    .attr("class", "horListTitle")
    .property("title", "Mid-century hydraulic risk models")
    .text("Mid-Century");
  
  //******Mid-century temps
  var hydModel = ["All","Physical"];
  ["hydMCAll","hydMCPhys"].forEach(function(d,i) {
    d3.select("#hydROFFuture")
      .append("div")
      .attr("class", "horListDiv")
      .property("title", topos.crossings.tooltip[d])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + d + '" type="checkbox" class="rofCheck" value="' + d + '"></input><span>' + hydModel[i] + '</span>');
  });

  //******Add in Select All Div
  d3.select("#column2")
    .append("div")
    .attr("class", "selectAllDiv attrDiv")
    .property("title", "Check to select all 'Risk of Failure' attributes")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_rof" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');









  //******Additional Crossing Attributes
  d3.select("#column2")
    .append("p")
    .attr("class", "priorTitle")
    .text("Additional Attributes")
    .property("title", "Additional crossing attributes available for selection");

  d3.select("#column2")
    .append("div")
    .attr("id", "attrSelDivCrossingsAdd");   

  var tmpAdd = [];
  topos.crossings.keys.forEach(function(key) {
    if (topos.crossings.cfGroup[key] == "additional") {
      tmpAdd.push(key);
    }
  });

  var tmpDiv = d3.select("#attrSelDivCrossingsAdd");
  tmpAdd.forEach(function(key) {
    tmpDiv.append("div")
      .attr("class", "attrDiv")
      .property("title", topos.crossings.tooltip[key])
      .append("label")
      .attr("class", "priorLabel")
      .html('<input id="chk_' + key + '" type="checkbox" class="addCheck" value="' + key + '"></input><span>' + topos.crossings.title[key] + '</span>')
      .on("click", function() { var tmpChk = d3.select("#chk_" + key); if(tmpChk.property("checked") == true) {topos.crossings.display[tmpChk.property("value")] = "yes"; } else {topos.crossings.display[tmpChk.property("value")] = "no"; } });
  });

  //******Add in Select All Div
  d3.select("#column2")
    .append("div")
    .attr("class", "selectAllDiv attrDiv")
    .property("title", "Check to select all 'Additional Attributes'")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_add" type="checkbox" class="allCheck" value="all"></input><span>Select All</span>');



  //******Updating elements
  d3.select("#attrSelectCrossings").selectAll(".combCheck,.ecoCheck,.emsCheck,.rofCheck,.priorCheck,.attrCheck,.addCheck,.allCheck")
    .on("click", function() {
      var tmpVal = this.value;
      var tmpSel = d3.select("#crossingsSelect").node().value;
      var tmpChk = d3.select(this); 
      if(tmpChk.classed("allCheck")) {
        switch(tmpChk.attr("id")) {
          case "chk_all_add":
            var allChk = d3.selectAll(".addCheck");
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
    });








  //******Add in stream attributes
  d3.select("#attrSelectStreamsOptions")
    .append("div")
    .attr("id", "attrStreams")
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

  //******Add in select all option
  d3.select("#attrStreams")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", "Check to select all above attributes")
    .style("margin-top", "10px")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_streams" type="checkbox" class="allCheck" value="all" checked></input><span>Select All</span>');



  d3.select("#attrSelectStreams").selectAll(".streamCheck,.allCheck")
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
    });






  //******Add in catchment attributes
  d3.select("#attrSelectCatchmentsOptions")
    .append("div")
    .attr("id", "attrCatchments")
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


  //******Add select all option
  d3.select("#attrCatchments")
    .append("div")
    .attr("class", "attrDiv")
    .property("title", "Check to select all above attributes")
    .style("margin-top", "10px")
    .append("label")
    .attr("class", "priorLabel")
    .html('<input id="chk_all_catchments" type="checkbox" class="allCheck" value="all" checked></input><span>Select All</span>');


  d3.select("#attrSelectCatchments").selectAll(".catchmentCheck,.allCheck")
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
    });

  //******Update feature attributes window
  d3.select("#attrSelectDiv").selectAll("input")
    .on("change", function() { updateAttributes(); d3.select("#attrSelectButton").text("Continue with Current Selections"); });



  //******Add Continue button
  d3.select("#attrSelectDiv")
    .append("div")
    .style({"width":"100%","text-align":"center","padding-top":"5px"})
    .append("button")
    .attr("id", "attrSelectButton")
    .attr("class", "btn legendBtn")
    .attr("data-toggle", "modal")
    .attr("data-target", "#attrSelectModal")
    .property("title", "Click to continue using the selected attributes. This window can be reopened anytime by clicking the 'Select Attributes' button located on the top menu.")
    .text("Continue with Default Selections")
    .on("click", function() { if(localStorage.getItem('doneTour') != "yeah!" && disableTutorialSession != true) {startIntro();} });
}





//******Update legend and chart select boxes
function updateLegends(topo) {
  //***Store current mapped attribute
  var tmpAttr = d3.select("#" + topo.class + "Select").property("value");

  var display = [];
  topo.keys.forEach(function(key) {
    if (topo.display[key] == "yes") {
      display.push(key);
    }
  });

  var valArray = [];
  var tmpOpts = d3.select("#" + topo.class + "Select").selectAll("option")
    .data(display);

  tmpOpts.exit()
    .remove();
  tmpOpts.enter()
    .append("option")
  tmpOpts
    .attr("value", function(d) { valArray.push(d); return d; })
    .text(function(d) { return topo.title[d]; });

  d3.select("#" + topo.class + "Select")
    .insert("option", ":first-child")
    .attr("value", "...")
    .text("...");

  valArray.unshift("...");
  var i = valArray.indexOf(tmpAttr);

  if(i > 0) {
    d3.select("#" + topo.class + "Select")
      .property("selectedIndex", i)
      .property("value", valArray[i]);
  }
  else if(valArray.length > 1) {
    d3.select("#" + topo.class + "Select")
      .property("selectedIndex", 1)
      .property("value", valArray[1]);
  }
  else {
    d3.select("#" + topo.class + "Select")
      .property("selectedIndex", 0)
      .property("value", valArray[0]);
  }
    
  changeStyle(d3.select("#" + topo.class + "Select").property("value"), topo);


  //******Update charts dropdowns
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
