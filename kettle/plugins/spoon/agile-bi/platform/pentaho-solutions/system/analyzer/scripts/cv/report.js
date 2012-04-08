dojo.mixin(cvConst,{MAX_FILTER_EXPRESSIONS:10,MAX_FILTER_MEMBERS:200,dndAcceptedTypes:{"measures":["V","VM"],"columnAttributes":["L","T","LC","TC","LR","TR"],"rowAttributes":["L","T","LC","TC","LR","TR"],"filters":["V","L","T","VM","LC","TC","LR","TR"],"reportArea":["V","L","T","VM","LC","TC","LR","TR"],"trashcan":["VM","LC","TC","LR","TR","FT"]},dndTypes:{"measures":"M","columnAttributes":"C","rowAttributes":"R","filters":"FT"},TYPE_ATTRIBUTE:0,TYPE_METRIC:1,TYPE_FILTER:4,defaultGemTypes:{rowAttributes:0,columnAttributes:0,measures:1,filters:4},defaultFormatExp:"Case\nWhen [Measures].CurrentMember > 0\nThen '|#,##0|arrow=up'\nWhen [Measures].CurrentMember < 0\nThen '|#,##0|arrow=down'\nElse '|#,##0'\nEnd"});
dojo.mixin(cv.prefs,{chartOption:"VERTICAL_BAR",autoRefresh:true,manyReportItems:8000,maxReportItems:15000,maxFilterValues:3000,maxColumnFields:4,numProgressImg:1,fieldListView:"cmdViewCategory"});
dojo.mixin(cvCatalog,{emptyReportAreaHTML:"<div class='reportEmpty'><img src='images/icon_%{2}.png'><br>%{1}<br><br>"+"<div id=\"%{0}GettingStarted\" style=\"cursor:pointer; margin:auto; width: 300px; height: 29px; background-image: url(&quot;images/report_create_getting_started_middle.gif&quot;); background-repeat: repeat-x; vertical-align: middle;\">"+"<img align=\"left\" src=\"images/report_create_getting_started_left.gif\">"+"<img align=\"right\" src=\"images/report_create_getting_started_right.gif\">"+"<div id=\"reportContextHelp\" style=\"font-size: 0.7em; color: black; padding-top: 6px;\">"+cvCatalog["reportHelpGettingStarted"]+"</div></div></div>",filterTemplateSingleLine:"<div formula='%{0}' id='%{1}' class='filterItem'><div class='filterIndent'>"+"<img class='filterAction' id='remove_%{1}' title='Remove filter' onclick='cv.getActiveReport().removeFilter(\"%{1}\")' src='images/report/Remove.png'>"+"<img class='filterAction EDIT_Only' id='edit_%{1}' title='Edit filter' onclick='cv.getActiveReport().filterDlg.show(\"%{1}\")' src='images/report/editFilter.png'>"+"&nbsp;</div><span><b>%{2}</b>&nbsp;%{3}</span><img class='lockImg' title='Filter locked' src='images/icons/locked.gif'></div>",filterTemplateMultiLine:"<div class='filterItem filterLine'><div class='filterIndent'>&nbsp;</div>"+"<span><b>%{0}</b> is restricted as following:</span><img class='lockImg' title='Filter locked' src='images/icons/locked.gif'></div>",filterTemplateAttr:"<div formula='%{0}' id='%{1}' class='filterItem'><div class='filterIndent2'>"+"<img class='filterAction' id='remove_%{1}' title='Remove filter' onclick='cv.getActiveReport().removeFilter(\"%{1}\")' src='images/report/Remove.png'>"+"<img class='filterAction EDIT_Only' id='edit_%{1}' title='Edit filter' onclick='cv.getActiveReport().filterDlg.show(\"%{1}\")' src='images/report/editFilter.png'>"+"&nbsp;</div><span>%{2}</span></div>",filterTemplateMetric:"<div formula='%{0}' id='filter_metric_0' class='filterItem'><div class='filterIndent'>"+"<img class='' id='remove_filter_metric' title='Remove filter' onclick='cv.getActiveReport().removeCurrentGem()' src='images/report/Remove.png'>"+"<img class='EDIT_Only' id='edit_filter_metric' title='Edit filter' onclick='cv.getActiveReport().filterDlg.showMetricFilter()' src='images/report/editFilter.png'>"+"&nbsp;</div><div style='float:left;'>%{1}</div></div>",filterConditionEdit:"<table><tr><td width=10></td><td width=210><select id='FT_condMetric' style='width:98%;' size=1></select></td>"+"<td width=160><select id='FT_condOp' size=1>"+"<option value='GREATER_THAN' selected>%{GT}</option><option value='LESS_THAN'>%{LT}</option>"+"<option value='GREATER_THAN_EQUAL'>%{GTE}</option><option value='LESS_THAN_EQUAL'>%{LTE}</option>"+"<option value='EQUAL'>%{E}</option><option value='NOT_EQUAL'>%{NE}</option><option value='BETWEEN'>%{B}</option>"+"<option value='IS_NOT_EMPTY'>%{NE}</option></select></td>"+"<td width=105><input id='FT_condOp1' style='width:95px' type='text' class='inputNum'>"+"<span> and <input id='FT_condOp2' style='width:95px' type='text' class='inputNum'></span></td>"+"<td width=16 class='filterConditionDelete' id='FT_remove_{%id}' title='Delete condition'></td><td width=16></td></tr></table>",filterConditionStatic:"<table><tr><td width=10></td><td width=210>%{metric}</td><td width=160>%{op}</td>"+"<td width=105><span>%{op1}</span><span class='%{op2Css}'> and <span>%{op2}</span></span></td>"+"<td width=16 class='filterConditionDelete' id='FT_remove_{%id}' title='Delete condition'></td><td width=16></td></tr></table>",reportNoDataMsgHTML:"<div class='noData'><span class='noDataHeader'>%{0}</span><span class='noDataHint'>Your current combination of "+"<a class='appCmdLink' href='#' onclick='return cv.getActiveReport().manager.onToggleReportPane(\"cmdLayout\");'>Fields</a> and "+"<a class='appCmdLink' href='#' onclick='return cv.getActiveReport().manager.onToggleReportPane(\"cmdFilters\");'>Filters</a> did not generate any data. "+"<a class='appCmdLink helpLinkReportNoData' href='#'>View Help</a> to learn more.<p><a class='appCmdLink' href='#' onclick='cv.getActiveReport().history.undo();return false;'>Undo</a> your last action.</span></div>",reportSuccessMsgHTML:"<div class='noData'><span class='noDataHeader'>%{0}</span></div>",refreshPanelCancel:"<div class='refreshPaneCanceledMode'>%{0}</div>",refreshPanelComplete:"<div class='refreshPaneComplete'>&nbsp;&nbsp;%{0}&nbsp;</div>"});
cv.io={maxConnectionTries:3,ajaxLoad:function(_1,_2,_3,_4){
var _5=null;
_2.stok=cv.securityToken;
dojo.io.bind({url:cv.contextPath+_1,content:_2,handle:function(_6,_7,_8){
if(_3&&_6=="load"){
_5=_7;
}else{
if(!_3&&_6=="load"){
_4(_7);
}
}
},method:"POST",mimetype:"text/plain",sync:_3,encoding:"utf8"});
if(_3){
return _5;
}
},initAsyncRequest:function(_9){
if(_9.prevId==null){
_9.prevId="";
}
return this.ajaxLoad("ajax/initRequest",_9,true);
},cancelAsyncRequest:function(_a){
if(!_a){
return;
}
this.ajaxLoad("ajax/cancelRequest",{requestId:_a},false);
},refreshReport:function(_b){
var _c=(new Date).getTime();
_b.showProgressPane("reportRefreshing");
if(_b.refreshRequest){
_b.refreshRequest.abort();
}
_b.refreshRequestErrorCounter=0;
var id=this.initAsyncRequest({reportXML:_b.getReportXml(),prevId:_b.refreshRequestId,format:"HTML",action:"REFRESH",dirtyFlag:_b.isDirty(),newFields:_b.newFields.toString()});
_b.newFields="";
if(!id){
_b.handleReportMsg({type:"exception",initId:id});
return true;
}
var _d=_b.handleReportMsg(id);
if(_d&&(_c>=_b.refreshTimeStamp)){
_b.refreshRequestId=_d.text;
_b.refreshTimeStamp=_c;
this.getReportHTML(_b);
return true;
}
return false;
},getReportHTML:function(_e,id,_f){
if(!_e.refreshRequestId||(id&&id!=_e.refreshRequestId)){
return;
}
if(!id){
id=_e.refreshRequestId;
}
if(_e.refreshRequest){
_e.refreshRequest.abort();
_e.refreshRequest=null;
}
if(!_f){
_f=3;
}
var _10=this;
_e.refreshRequest=dojo.io.bind({url:cv.contextPath+"ajax/getReportHTML",content:{requestId:id,timeout:_f,reportViewWidth:_e.reportWidth,reportViewHeight:_e.reportHeight,stok:cv.securityToken},handle:function(_11,_12,evt){
var _13=true;
if(_11=="load"){
if(_12){
_13=false;
_e.loadReportHTML(_12);
}
}else{
if(!_10._retryConnection(_12,_e.refreshRequestErrorCounter)){
_e.handleReportMsg({type:"exception",message:_12.message});
_13=false;
}else{
_e.refreshRequestErrorCounter++;
}
}
if(_13){
dojo.lang.setTimeout(_10,"getReportHTML",3000,_e,id,1);
}
},method:"POST",mimetype:"text/plain",sync:false});
},getReportInFormat:function(_14,_15,_16,_17,_18){
var _19=this.initAsyncRequest({reportXML:_14,action:"REFRESH",format:_15,dirtyFlag:_18,prevId:""});
if(!_19){
return;
}
var _1a=dojo.dom.createDocumentFromText(_14);
var _1b=_1a.documentElement.selectSingleNode("cv:commonStorageAttributes/cv:path");
var _1c=_1a.documentElement.getElementsByTagName("path")[0].getAttribute("name");
var url=cv.contextPath+"ajax/getReportInFormat?requestId="+_19+"&format="+_15+"&stok="+cv.securityToken;
if(_16){
url=url+"&includeSubtotals="+_16;
}
if(_17){
url=url+"&formatNumbers="+_17;
}
if(_1c!=null&&_1c!=""){
url=url+"&reportName="+encodeURIComponent(_1c);
}
window.open(url);
},getReportDrillCSV:function(_1d,_1e,_1f,_20){
var _21=this.initAsyncRequest({reportXML:_1d,action:"REFRESH",format:"CSV",dirtyFlag:_20,prevId:""});
if(!_21){
return;
}
var url=cv.contextPath+"drill/getReportDrillCSV?requestId="+_21+"&colIndex="+_1e+"&rowIndex="+_1f;
window.open(url);
},_retryConnection:function(_22,_23){
if(_23<this.maxConnectionTries&&_22&&_22.message){
_22=_22.message;
var reg=/XMLHttpTransport\sError:\s(12\d\d\d)/;
var _24=reg.exec(_22);
if(_24&&_24[1]){
switch(_24[1]){
case "12002":
case "12029":
case "12030":
case "12031":
case "12152":
return true;
}
}
}
return false;
}};
dojo.declare("cv.Report",null,function(_25){
this.id=_25.id;
this.mode=_25.mode;
this.manager=_25.manager;
this.containerNode=_25.containerNode;
this.systemActionsNode=_25.systemActionsNode;
this.progressPaneId=_25.progressPaneId;
this.createPAA=_25.createPAA;
this.history=new cv.History(this,_25.manager,_25.uiController);
if(_25.reportDoc){
this.reportDoc=_25.reportDoc;
}else{
this.reportDoc=new cv.ReportDocument();
this.reportDoc.initialize(_25.reportXml);
}
if(_25.cube&&_25.catalog){
this.cube=_25.cube;
this.catalog=_25.catalog;
this.reportDoc.setReportOption("cube",this.cube);
this.reportDoc.setReportOption("catalog",this.catalog);
}else{
this.cube=this.reportDoc.getReportOption("cube");
this.catalog=this.reportDoc.getReportOption("catalog");
}
this.currentSelection=null;
this.gemList=new dojo.collections.Dictionary();
this.badFields=[];
this.badFilters=false;
},{MIN_REPORT_HEIGHT:100,HISTORY_ACTION_LIST:"",reportBeCanceled:false,byId:function(id){
if(id.indexOf(this.id)!=0){
id=this.id+id;
}
return dojo.byId(id);
},byClass:function(_26){
return cv.util.getFirstChildByClass(this.domNode,_26);
},createNode:function(tag,id,css,_27){
var _28=document.createElement(tag);
if(id){
_28.id=this.id+id;
}
if(css){
dojo.html.setClass(_28,css);
}
if(_27){
_27.appendChild(_28);
}
return _28;
},init:function(){
window.name="cvrpt"+this.id;
if(this.mode=="EDIT"){
if(dojo.lang.isUndefined(cv.rptDlgWidget)){
rptTooltip=cv.util.getDojoWidget("theRptInfoTooltip");
}
}
this._initDom();
this.reportStatus=null;
this.timeUnlimited=true;
this.refreshRequestId="";
this.progressImgId=0;
this.isReportPropsDirty=false;
this.actionLog=[];
this.pendingActionLen=0;
this.newFields="ALL";
this.topPaneId="";
this.reportHeight=300;
this.reportWidth=500;
this.refreshTimeStamp=null;
this.isInitialized=false;
this.pivotReportLoaded=false;
this.chartLoaded=false;
this.rptDlg=new cv.ReportDialog(this);
this.filterDlg=new cv.FilterDialog(this);
this.linkDlg=new cv.LinkDialog(this);
this.chartOptionsDlg=new cv.ChartOptionsDialog(this);
this.resizer=new cv.ReportResizer();
this.reportHeaders=null;
this.isResizing=false;
this.rowFieldWidths=new Array();
this.columnDataFieldWidths=new Array();
dojo.dnd.dragManager.nestedTargets=true;
this.dropTargets={measures:new cv.DataZoneDropTarget(this.byId("measures"),cvConst.dndAcceptedTypes["measures"],cvConst.dndTypes["measures"],this),columnAttributes:new cv.DataZoneDropTarget(this.byId("columnAttributes"),cvConst.dndAcceptedTypes["columnAttributes"],cvConst.dndTypes["columnAttributes"],this),rowAttributes:new cv.DataZoneDropTarget(this.byId("rowAttributes"),cvConst.dndAcceptedTypes["rowAttributes"],cvConst.dndTypes["rowAttributes"],this),reportArea:new cv.ReportDropTarget(this.byId("ReportArea"),cvConst.dndAcceptedTypes["reportArea"],this),trashcan:new cv.TrashAreaDropTarget(this.byId("Trashcan"),cvConst.dndAcceptedTypes["trashcan"],this)};
if(this.mode=="EDIT"){
this.dropTargets.filters=new cv.FilterPaneDropTarget(this.byId("filters"),cvConst.dndAcceptedTypes["filters"],cvConst.dndTypes["filters"],this);
this.dropTargets.filterPaneTitle=new cv.FilterPaneDropTarget(this.byId("FilterPaneTitle"),cvConst.dndAcceptedTypes["filters"],cvConst.dndTypes["filters"],this);
dojo.event.connect(this.nodeFilters,"ondblclick",this,"showFilterDlg");
dojo.event.connect(this.byId("CmdShowPivot"),"onclick",this,"toggleReportFormat");
dojo.event.connect(this.byId("CmdShowChart"),"onclick",this,"toggleReportFormat");
this.setAutoRefresh(this.reportDoc.getReportOption("autoRefresh")=="true"?true:false);
dojo.event.connect(this.byId("CmdToggleRefresh"),"onclick",this,"toggleAutoRefresh");
dojo.event.connect(this.byId("CmdSelectChartType"),"onclick",this,"toggleChartTypePopupMenu");
}else{
if(this.mode=="VIEW"||this.mode=="MINI"){
dojo.event.connect(this.byId("CmdActions"),"onclick",this,"toggleActionsPopupMenu");
}
}
dojo.event.connect(this.byId("FilterPaneTitle"),"onclick",this,"onToggleReportPane");
dojo.event.connect(this.byId("HideLayoutPane"),"onclick",this,"onToggleReportPane");
dojo.event.connect(this.byId("HideFilterPane"),"onclick",this,"onToggleReportPane");
dojo.event.connect(this.nodeFilters,"onmousemove",this,"onMouseOverFilters");
dojo.event.connect(dojo.byId("closeRowTruncate"),"onclick",this,"hideTruncateMessage");
dojo.event.connect(dojo.byId("closeColTruncate"),"onclick",this,"hideTruncateMessage");
cv.util.setHelpTopics([this.id+"HelpLayoutPane","CV/Business_User/working_with_fields.html#arranging_fields",this.id+"HelpFilterPane","CV/Business_User/working_with_filters.html"]);
cv.util.show(this.domNode);
var _29=this;
cv.formatRptInfoTooltip=function(){
if(!rptTooltip.loadRptProps()){
return;
}
var _2a=_29.getReportProperties();
for(var x in _2a){
var _2b=dojo.byId(x);
if(!_2b){
continue;
}
if(_2b.tagName=="INPUT"||_2b.tagName=="TEXTAREA"){
_2b.value=_2a[x];
}else{
_2b.innerHTML=dojo.string.escape("html",_2a[x]);
}
if(x=="description"&&_2a[x]==""){
if(_2b.tagName=="INPUT"||_2b.tagName=="TEXTAREA"){
_2b.value="No Description";
}else{
_2b.innerHTML=dojo.string.escape("html","No Description");
}
}
if(x=="created"||x=="update"){
if(_2a[x]!=null&&_2a[x]!=""){
var _2c=cv.util.formatDateString(_2a[x]);
_2b.innerHTML=dojo.string.escape("html",_2c);
}
}
if(x=="folder"){
if(_2a[x].substring(0,1)=="/"){
_2b.innerHTML=_2a[x].substring(1);
}
}
}
dojo.byId("refreshDates_2").innerHTML=dojo.byId("refreshDates").innerHTML;
var _2d=_29.reportDoc.getReportProperty("name");
if(!_29.manager.isReportWritable){
dojo.html.addClass(dojo.byId("editNameButton"),"hidden");
}
if(rptTooltip.loadStatus){
_29.showReportStatus(rptTooltip.loadStatus);
return;
}
};
},_initDom:function(){
this.domNode=this.createNode("DIV","ReportMain","reportMain pentaho-panel-insetglow "+this.mode);
this.containerNode.appendChild(this.domNode);
var _2e=this.createNode("DIV","ReportTitle","pentaho-titled-toolbar",this.domNode);
if(this.mode=="EDIT"){
_2e.innerHTML="<div id='"+this.id+"ReportFormatCmdDiv' class='reportFormatDiv'><img src='images/report/button_view_chart_pulldown.png' id='"+this.id+"CmdSelectChartType' class='selectChartType' height='23px' title='"+cvCatalog["ttChartType"]+"'>"+"<img id='"+this.id+"CmdShowChart' src='images/report/button_view_chart.png' class='reportDisplayFormat' valign='middle' title='"+cvCatalog["ttSwitchToChart"]+"'>"+"<img id='"+this.id+"CmdShowPivot' src='images/report/button_view_table.png' class='reportDisplayFormat' valign='middle' title='"+cvCatalog["ttSwitchToTable"]+"'>"+"<div class='EDIT_Only' style='float:right;padding-top:2px;padding-right:10px'>"+cvCatalog["reportViewAs"]+"</div>"+"<img id='"+this.id+"CmdToggleRefresh' style='padding-right:10px' src='images/report/button_view_autoRefresh.png' class='reportDisplayFormat' valign='middle' title='"+cvCatalog["ttDisableAutoRefresh"]+"'>"+"</div>"+"<div class='reportTitle pentaho-titled-toolbar-label'><a href='#' id='"+this.id+"TitleLink' class='titleLink'><img class='EDIT_Only' src='images/report/about.png'></a>"+"<a href='#' id='"+this.id+"TitleLinkDynamic' class='titleLink'><h2 id='"+this.id+"ReportName'>"+cvCatalog["reportNewName"]+"</h2></a>"+"</div>";
rptTooltip.addConnectNode(dojo.byId(this.id+"TitleLinkDynamic"),true);
rptTooltip.addConnectNode(dojo.byId(this.id+"TitleLink"),true);
}else{
_2e.innerHTML="<div id='"+this.id+"ReportFormatCmdDiv' class='reportFormatShowDiv' style='height:23px;'>"+"<div title='Report Actions' id='"+this.id+"CmdActions' class='cmdActionsBtn'><span>"+cvCatalog["reportDashboardActions"]+"</span></div>"+"</div><div class='titleLink'><h2 id='"+this.id+"ReportName' style='cursor:default'>"+cvCatalog["reportNewName"]+"</h2></div>";
}
_2e=this.createNode("DIV","ReportSummary","reportSummary clearfix",this.domNode);
_2e.innerHTML="<div id=\""+this.id+"StatusBar\" class=\"statusBar\"></div><div id=\"progressPane\" class=\"progressPaneDiv hidden\"></div><div class=\"filterSummary\" id=\""+this.id+"FilterPaneTitle\"><div id=\""+this.id+"FilterPaneToggle\" class=\"filterPaneToggle\" title=\""+cvCatalog["ttShowHideFilters"]+"\">&nbsp;</div>"+"<span id=\""+this.id+"FilterCountLabel\" title=\""+cvCatalog["ttShowHideFilters"]+"\" style=\"padding-top:5px;\">No Filter in use</span>";
if(this.systemActionsNode){
_2e.appendChild(this.systemActionsNode);
dojo.html.removeClass(this.systemActionsNode,"hidden");
}
this.nodeLayout=this.createNode("DIV","Layout","reportLayout clearfix hidden",this.domNode);
this.nodeLayout.innerHTML="<table><tbody><tr><td id=\""+this.id+"RowZoneLabel\" class=\"dropZoneLabel\">Row Labels&nbsp;"+"<img style=\"vertical-align:middle;\" src=\"images/row.gif\"></td><td width=\"*\"><div id=\""+this.id+"rowAttributes\" class=\"dropZoneAttributes\"></div></td><td width=\"42\"><img id=\""+this.id+"HideLayoutPane\" src=\"images/report/Close_over.png\" class=\"hideLayoutPane\" title=\"Hide layout pane\"><img id=\""+this.id+"HelpLayoutPane\" class=\"helpIcon\" title=\"Help on Fields\" style=\"float:right;\" src=\"images/help_link.png\"></td></tr>"+"<tr><td id=\""+this.id+"ColZoneLabel\" class=\"dropZoneLabel\">Col Headers&nbsp;"+"<img style=\"vertical-align:middle;\" src=\"images/col.gif\"></td><td width=\"*\"><div id=\""+this.id+"columnAttributes\" class=\"dropZoneAttributes\"></div></td><td>&nbsp;</td></tr><tr><td id=\""+this.id+"NumZoneLabel\" class=\"dropZoneLabel\">Numbers&nbsp;<img style=\"vertical-align: middle;\" src=\"images/data.gif\"></td>"+"<td width=\"*\"><div id=\""+this.id+"measures\" class=\"dropZoneMeasures\"></div></td><td>&nbsp;</td></tr></tbody></table>";
this.nodeFilter=this.createNode("DIV","Filter","reportFilter clearfix hidden",this.domNode);
this.nodeFilter.innerHTML="<img id=\""+this.id+"HideFilterPane\" src=\"images/report/Close_over.png\" class=\"closeBox\" style=\"float:right;\" title=\"Hide filter pane\">"+"<img id=\""+this.id+"HelpFilterPane\" class=\"helpIcon\" title=\"Help on Filters\" style=\"float:right;\" src=\"images/help_link.png\">"+"<div id=\""+this.id+"filters\" class=\"filters\"><div class=\"filterPaneHint\">To add a new filter, drag a field from Available Fields to this area.</div></div>";
this.nodeRowTruncate=this.createNode("DIV","RowTruncateInfo","rowTruncate hidden",this.domNode);
this.nodeRowTruncate.innerHTML="<img src=\"images/report/button_close.gif\" id=\"closeRowTruncate\" style=\"float:right;cursor:pointer;\"><br><img src=\"images/icons/info.gif\">&nbsp;Showing <span id=\""+this.id+"RowTruncateMsg\"></span>&nbsp;rows. Add more filters to reduce the number of rows.<br>To see all rows, download the report to Excel or PDF files.";
this.nodeColTruncate=this.createNode("DIV","ColTruncateInfo","colTruncate hidden",this.domNode);
this.nodeColTruncate.innerHTML="<img src=\"images/report/button_close.gif\" id=\"closeColTruncate\" style=\"float:right;cursor:pointer;\"><br><img src=\"images/icons/info.gif\">&nbsp;Showing <span id=\""+this.id+"ColTruncateMsg\"></span>&nbsp;columns. Add more filters to reduce the number of columns.<br>To see all columns, download the report to Excel or PDF files.";
this.nodeReportRefresh=this.createNode("DIV","ReportRefresh","reportRefresh",this.domNode);
this.nodeReportRefresh.innerHTML="<div style=\"float: left;\"><img src=\"images/icons/warn.png\" style=\"vertical-align: middle;\">"+cvCatalog["warnAutoRefreshPanel"]+"</div><button id=\"cmdRefreshBtn\" style=\"float: right; margin-right: 10px;padding: 2px 5px 4px;\" class=\"pentaho-button\">"+cvCatalog["refreshButton"]+"</button>";
cv.util.initDivButton(dojo.byId("cmdRefreshBtn"),null,function(){
if(!cv.getActiveReport().history.isStateRefreshed()){
cv.getActiveReport().refreshReport(true);
}
});
cv.util.hide(this.nodeReportRefresh);
this.nodeReportArea=this.createNode("DIV","ReportArea","reportArea",this.domNode);
this.nodeTrash=this.createNode("DIV","Trashcan","trashcan hidden",this.domNode);
this.nodeFilters=this.byId("filters");
this.statusBar=this.byId("StatusBar");
this.closeTruncateStatus="None";
},postCreate:function(){
var _2f="";
if(this.reportDoc.isEmpty()){
this.newFields="";
}else{
_2f="actionOpenReport";
}
this.history.add(new cv.ReportState(_2f));
this.history.setSaved();
this.openReport(null,false);
if(this.badFields.length>0){
this.history.current().reportXml=dojo.dom.innerXML(this.reportDoc.getReportNode());
}
this.history.setRefreshed(false);
this.successState=this.history.current();
this.isInitialized=true;
},destroy:function(){
if(this.mode=="EDIT"){
dojo.event.disconnect(this.nodeFilters,"ondblclick",this,"showFilterDlg");
}
if(this.cmdReportXml){
dojo.event.disconnect(this.cmdReportXml,"onclick",this.rptDlg,"showReportDefinition");
}
if(this.mode=="EDIT"){
dojo.event.disconnect(this.byId("FilterPaneTitle"),"onclick",this,"onToggleReportPane");
dojo.event.disconnect(this.nodeFilters,"onmousemove",this,"onMouseOverFilters");
dojo.event.disconnect(this.byId("CmdShowPivot"),"onclick",this,"toggleReportFormat");
dojo.event.disconnect(this.byId("CmdToggleRefresh"),"onclick",this,"toggleAutoRefresh");
dojo.event.disconnect(this.byId("CmdShowChart"),"onclick",this,"toggleReportFormat");
dojo.event.disconnect(this.byId("CmdSelectChartType"),"onclick",this,"toggleChartTypePopupMenu");
}else{
if(this.mode=="VIEW"||this.mode=="MINI"){
dojo.event.disconnect(this.byId("CmdActions"),"onclick",this,"toggleActionsPopupMenu");
}
}
this.rptDlg.destroy();
this.filterDlg.destroy();
this.resizer.destroy();
cv.util.destroyDojoWidgets();
this.rptDlg=null;
this.filterDlg=null;
this.resizer=null;
this.reportDoc=null;
this.reportHeaders=null;
this.reportStatus=null;
this.statusBar=null;
this.nodeColTruncate=null;
this.nodeRowTruncate=null;
this.nodeLayout=null;
this.nodeFilter=null;
cv.util.TRACE("_EXIT");
},setReportPropsDirty:function(_30){
this.isReportPropsDirty=_30;
},showReportDescription:function(_31){
var id=_31.currentTarget.id;
var _32=dojo.byId(id);
_32.setAttribute("title",this.getReportProperties().description);
},openReport:function(_33,_34){
if(_33){
this.reportDoc.replaceReportNode(_33);
this.reportDoc.setReportOption("autoRefresh",cv.prefs.autoRefresh?"true":"false");
}
this._initDisplay();
this.cube=this.reportDoc.getReportOption("cube");
var _35=this.reportDoc.getReportProperty("name");
var _36=this.reportDoc.getReportProperty("folder");
if(_35){
this.byId("ReportName").innerHTML=dojo.string.escape("html",_35);
document.title=_35;
}else{
this.byId("ReportName").innerHTML=dojo.string.escape("html",cvCatalog.reportNewName);
document.title=cvCatalog.reportNewName;
this.setReportPropsDirty(true);
var _37=cv.util.getURLQueryValue("autoRefresh");
if(!_33&&_37=="false"){
this.setAutoRefresh(false);
}
}
if(!_34){
this.refreshReport();
}
},destroyReport:function(){
if(this.reportHeaders!=null){
this.reportHeaders.disconnect();
this.reportHeaders=null;
}
var tbl=this.byClass("pivotTable");
if(tbl){
tbl.innerHTML="";
dojo.event.disconnect(tbl,"oncontextmenu",this,"toggleInReportPopupMenu");
cv.util.hide(this.nodeColTruncate,this.nodeRowTruncate);
}
},loadReportResizeParams:function(){
if(this.rowFieldWidths.length>0||this.columnDataFieldWidths.length>0){
return;
}
var _38="cv:uiAttributes/cv:rowFieldWidths/cv:labelWidth";
var _39=this.reportDoc.reportRecord.documentElement.selectNodes(_38);
for(var i=0;i<_39.length;++i){
this.rowFieldWidths[_39[i].attributes[0].value]=dojo.dom.textContent(_39[i].selectSingleNode("cv:width"))-0;
}
_38="cv:uiAttributes/cv:columnDataFieldWidths/cv:labelWidth";
var _3a=this.reportDoc.reportRecord.documentElement.selectNodes(_38);
for(var i=0;i<_3a.length;++i){
this.columnDataFieldWidths[_3a[i].attributes[0].value]=dojo.dom.textContent(_3a[i].selectSingleNode("cv:width"))-0;
}
},updateReportResizeParams:function(_3b,_3c,_3d,_3e){
if(_3b=="remove"){
if(_3e=="measure"){
for(var i=_3c;i<this.columnDataFieldWidths.length;++i){
this.columnDataFieldWidths[i]=this.columnDataFieldWidths[i+1];
}
}else{
for(var i=_3c;i<this.rowFieldWidths.length;++i){
this.rowFieldWidths[i]=this.rowFieldWidths[i+1];
}
}
}else{
if(_3b=="add"){
if(_3d=="before"){
if(_3e=="measure"){
for(var i=this.columnDataFieldWidths.length;i>_3c;i--){
this.columnDataFieldWidths[i]=this.columnDataFieldWidths[i-1];
}
this.columnDataFieldWidths[_3c]=null;
}else{
for(var i=this.rowFieldWidths.length;i>_3c;i--){
this.rowFieldWidths[i]=this.rowFieldWidths[i-1];
}
this.rowFieldWidths[_3c]=null;
}
}
}else{
}
}
},saveReportResizeParams:function(){
var _3f=this.reportDoc.reportRecord.documentElement.selectSingleNode("cv:uiAttributes");
var _40;
var _41;
if(_3f==null){
_3f=dojo.dom.createDocumentFromText("<uiAttributes xmlns=\"http://www.pentaho.com\"><rowFieldWidths></rowFieldWidths><columnDataFieldWidths></columnDataFieldWidths></uiAttributes>").documentElement;
if(dojo.render.html.ie){
_40=_3f.selectSingleNode("rowFieldWidths");
_41=_3f.selectSingleNode("columnDataFieldWidths");
}else{
_40=_3f.selectSingleNode("cv:rowFieldWidths");
_41=_3f.selectSingleNode("cv:columnDataFieldWidths");
}
}else{
dojo.dom.removeChildren(_3f.selectSingleNode("cv:rowFieldWidths"));
dojo.dom.removeChildren(_3f.selectSingleNode("cv:columnDataFieldWidths"));
_40=_3f.selectSingleNode("cv:rowFieldWidths");
_41=_3f.selectSingleNode("cv:columnDataFieldWidths");
}
for(i=0;i<this.rowFieldWidths.length;++i){
if(typeof this.rowFieldWidths[i]!="undefined"&&this.rowFieldWidths[i]!=null){
var _42=dojo.dom.createDocumentFromText("<labelWidth xmlns=\"http://www.pentaho.com\" index='"+i+"'><width>"+parseInt(this.rowFieldWidths[i])+"</width></labelWidth>").documentElement;
_40.appendChild(_42.cloneNode(true));
}
}
for(i=0;i<this.columnDataFieldWidths.length;++i){
if(typeof this.columnDataFieldWidths[i]!="undefined"&&this.columnDataFieldWidths[i]!=null){
var _42=dojo.dom.createDocumentFromText("<labelWidth xmlns=\"http://www.pentaho.com\" index='"+i+"'><width>"+parseInt(this.columnDataFieldWidths[i])+"</width></labelWidth>").documentElement;
_41.appendChild(_42.cloneNode(true));
}
}
if(this.reportDoc.reportRecord.documentElement.selectSingleNode("cv:uiAttributes")!=null){
dojo.dom.removeChildren(this.reportDoc.reportRecord.documentElement.selectSingleNode("cv:uiAttributes"));
this.reportDoc.reportRecord.documentElement.selectSingleNode("cv:uiAttributes").appendChild(_40);
this.reportDoc.reportRecord.documentElement.selectSingleNode("cv:uiAttributes").appendChild(_41);
}else{
this.reportDoc.reportRecord.documentElement.appendChild(_3f.cloneNode(true));
}
},loadReportHTML:function(_43){
this.refreshRequest=null;
this.refreshRequestId=null;
this.hideProgressPane();
var msg=this.handleReportMsg(_43);
if(msg){
if(msg.type=="success"){
this.showReportStatus(null);
if(msg.id!="successGenerateReport"){
if(msg.id=="reportNoDataMsg"){
_43=dojo.string.substituteParams(cvCatalog.reportNoDataMsgHTML,cvCatalog[msg.id]);
}else{
_43=dojo.string.substituteParams(cvCatalog.reportSuccessMsgHTML,cvCatalog[msg.id]);
}
}
}else{
this.showReportStatus(msg.details?msg.details:msg.id,msg.type);
}
this.loadReportResizeParams();
this.displayReport(_43,msg);
}
},log:function(_44,_45){
if(_44){
if(this.manager.cmdUndo){
if(_44=="UNDO"&&this){
_44=this.manager.cmdUndo.title;
}else{
if(_44=="REDO"){
_44=this.manager.cmdRedo.title;
}
}
}
var id=_44.indexOf(" (Ctrl+");
if(id>0){
_44=_44.substring(0,id);
}
this.actionLog.push(_44);
}
if(_45){
this.pendingActionLen=this.actionLog.length;
}
},handleReportMsg:function(_46){
if(!_46){
return null;
}
var msg=dojo.lang.isObject(_46)?_46:cv.util.parseAjaxMsg(_46);
if(msg){
switch(msg.type){
case "exception":
if((!dojo.lang.isUndefined(msg.message)&&(msg.message.indexOf("Component returned failure code: 0x80040111")>=0||msg.message.indexOf("XMLHttpTransport Error: 0")>=0))||(!dojo.lang.isUndefined(msg.initId)&&msg.initId==null)){
return null;
}
this.showReportStatus("exceptionGenerateReport");
var _47="<img class='reportMsgIcon' src='images/icons/exception_l.gif'><div class='reportMsgText'>"+(msg.ticket?dojo.string.substituteParams(cvCatalog.reportErrorTicket,msg.ticket+"",msg.id):cvCatalog.reportErrorMsg)+"</div>";
if(msg.text){
_47+=msg.text;
}
this.hideProgressPane();
this.displayReport(_47,null,"exception");
return null;
case "error":
this.showReportStatus(this.successState?"errorGenerateReport":"errorLoadReport");
this.rptDlg.showError(msg.details);
this._revertToLastSuccessState();
this.hideProgressPane();
return null;
case "confirm":
var _48=this;
this.refreshRequestId=msg.text;
if(msg.id=="Incompatible.fields"){
this.rptDlg.showConfirm(msg.details,"CV/Business_User/working_with_fields.html#incompatible_fields",{srcFunc:function(){
cv.io.getReportHTML(_48);
}},{srcObj:this,srcFunc:"cancelReport"});
}else{
this.rptDlg.showConfirm(msg.details,null,{srcFunc:function(){
cv.io.getReportHTML(_48);
}},{srcObj:this,srcFunc:"cancelReport"});
}
return null;
case "warn":
if(msg.id=="Incompatible.fields"){
this.rptDlg.showWarning(msg.details,"CV/Business_User/working_with_fields.html#incompatible_fields",false,false,null);
}else{
if(!cv.prefs.suppressMsg[msg.id]){
this.rptDlg.showWarning(msg.details,null,false,false,msg.id);
}
}
return msg;
case "sessionExpired":
return null;
default:
return msg;
}
}else{
return {type:"success",id:"successGenerateReport",text:_46};
}
},displayReport:function(_49,msg,_4a){
cv.util.TRACE("_START");
var _4b=this.getReportFormat();
if(!_49){
return;
}
this.destroyReport();
cv.util.TRACE("set report HTML");
this.nodeReportArea.innerHTML=_49;
if(msg&&msg.id=="reportNoDataMsg"){
cv.util.setHelpTopics([cv.util.getFirstChildByClass(this.nodeReportArea,"helpLinkReportNoData"),"CV/Business_User/working_with_filters.html#when_the_report_returns_no_data"]);
}else{
if(_4b=="PIVOT"){
var tbl=this.byClass("pivotTable");
if(tbl){
var _4c=tbl.getAttribute("rowcount"),_4d=tbl.getAttribute("columncount");
if(msg){
if(msg.truncate){
tbl.truncateType=msg.truncate;
}
switch(msg.truncate){
case "ROW":
_4c=dojo.string.substituteParams(cvCatalog.reportTableCountValue,_4c,msg.rows);
tbl.rowMsg=_4c;
break;
case "COL":
_4d=dojo.string.substituteParams(cvCatalog.reportTableCountValue,_4d,msg.cols);
tbl.colMsg=_4d;
break;
case "BOTH":
_4c=dojo.string.substituteParams(cvCatalog.reportTableCountValue,_4c,msg.rows);
tbl.rowMsg=_4c;
_4d=dojo.string.substituteParams(cvCatalog.reportTableCountValue,_4d,msg.cols);
tbl.colMsg=_4d;
break;
case "NONE":
default:
break;
}
}
this.statusBar.innerHTML=dojo.string.substituteParams(cvCatalog["reportTableCount"],_4c,_4d);
cv.util.TRACE("Update layout");
this.reportHeaders=new cv.ReportHeaders(this,tbl);
var _4e=0;
var _4f=dojo.html.getElementsByClass("resize",this.reportHeaders.rowLabelHeaderContainer);
for(var x=0;x<_4f.length;++x){
if(x!=0){
this.reportHeaders.attachResizeNode(_4f[x],"Label","before",_4e++);
}
this.reportHeaders.attachResizeNode(_4f[x],"Label","after",_4e++);
dojo.html.setStyle(_4f[x],"position","relative");
}
var _50=dojo.html.getElementsByClass("resize",this.reportHeaders.columnHeaderContainer);
for(var x=0;x<_50.length;++x){
if(_50[x].parentNode.getAttribute("type")=="measure"){
this.reportHeaders.attachResizeNode(_50[x],"Column","before",_4e++);
this.reportHeaders.attachResizeNode(_50[x],"Column","after",_4e++);
dojo.html.setStyle(_50[x],"position","relative");
}
}
this.reportHeaders.resizeLabels=_4f;
this.reportHeaders.resizeColumns=_50;
this.closeTruncateStatus="None";
this.resizeContainer();
this.reportHeaders.updateLayout();
dojo.event.connect(tbl,"oncontextmenu",this,"toggleInReportPopupMenu");
var _51=cv.util.getDojoWidget("memberPopMenu");
if(_51&&_51.domNode){
_51.domNode.memberId=null;
}
}
}else{
if(_4b=="CHART"){
dojo.lfx.html.fadeShow(this.nodeReportArea,cv.prefs.fadeTime).play();
}
}
}
if(!msg&&this.reportDoc.getReportNode().selectNodes("cv:measures/cv:measure").length==0){
this.showReportStatus("infoAddNumberField");
}
this.dropTargets.reportArea.init(_4b);
this.successState=this.history.current();
if(_4a!="exception"){
if(_4b=="PIVOT"){
this.pivotReportLoaded=true;
}else{
this.chartLoaded=true;
}
}
cv.util.TRACE("_END");
},refreshReport:function(_52){
this.updateMultiChartGemCSS();
if(!_52&&!this.autoRefresh()){
return true;
}
cv.util.hide(this.nodeReportRefresh);
this.history.setRefreshed(false);
this.statusBar.innerHTML="";
if(this.reportDoc.isEmpty()){
this.hideProgressPane();
if(this.refreshRequest){
this.refreshRequest.abort();
}
if(this.refreshRequestId){
cv.io.cancelAsyncRequest(this.refreshRequestId);
}
this.refreshRequest=this.refreshRequestId=null;
this.destroyReport();
var _53=this.getReportFormat();
if(_53=="PIVOT"||_53=="CHART"){
if(_53=="PIVOT"){
this.nodeReportArea.innerHTML=dojo.string.substituteParams(cvCatalog["emptyReportAreaHTML"],this.id,cvCatalog["emptyPivotTableArea"],"report_abstract");
}else{
this.nodeReportArea.innerHTML=dojo.string.substituteParams(cvCatalog["emptyReportAreaHTML"],this.id,cvCatalog["emptyChartArea"],"chart_abstract");
}
cv.util.setHelpTopics([this.id+"GettingStarted","CV/Business_User/creating_a_new_report.html#start_adding_fields_and_filters"]);
}
this.dropTargets.reportArea.init(_53);
this.showReportStatus(null);
this.successState=this.history.current();
return true;
}
this.pivotReportLoaded=false;
this.chartLoaded=false;
this.refreshTimeStamp=(new Date()).getTime();
return cv.io.refreshReport(this);
},cancelReport:function(){
this.reportBeCanceled=true;
this.hideProgressPane();
if(!this.refreshRequestId){
return;
}
if(this.refreshRequest){
this.refreshRequest.abort();
}
cv.io.cancelAsyncRequest(this.refreshRequestId);
this.refreshRequest=this.refreshRequestId=null;
this.showReportStatus("infoCancelReportRefresh");
this._revertToLastSuccessState();
},getReportXml:function(){
return this.reportDoc.getXml();
},getReportFormat:function(){
return this.reportDoc.getReportOption("reportTypeEnum");
},getReportPDF:function(){
cv.io.getReportInFormat(this.getReportXml(),"PDF",null,null,this.isDirty());
},getReportExcel:function(){
cv.io.getReportInFormat(this.getReportXml(),"EXCEL",null,null,this.isDirty());
},getReportDrillCSV:function(_54,_55){
cv.io.getReportDrillCSV(this.getReportXml(),_54,_55,this.isDirty());
},showReportStatus:function(_56,_57){
this.reportStatus=_56;
this.manager.showStatus(_56,_57);
},showProgressPane:function(_58){
var _59=dojo.byId(this.progressPaneId);
var _5a="<img src='images/report/refreshing.gif' style='vertical-align:middle;'>&nbsp;&nbsp;"+"Refreshing"+"&nbsp;&nbsp;<img id='progressPaneCancel' src='images/report/button_cancel.png' style='vertical-align:middle;cursor:pointer;'>";
_59.innerHTML=_5a;
cv.util.show(_59);
var _5b=cv.util.getFirstChildByClass(dojo.byId("refreshTooltip"),"progressPaneHeaderLabel");
if(_5b!=null){
_5b.innerHTML="<img src='images/report/refreshing.gif' style='vertical-align:middle;'>&nbsp;&nbsp;<b>Refreshing</b>";
}
dojo.event.connect(dojo.byId("progressPaneCancel"),"onclick",this,"cancelReport");
dojo.html.addClass(dojo.byId("refreshHeader"),"progressPaneUp");
dojo.html.addClass(dojo.byId("refreshAction"),"progressPaneContent");
dojo.html.addClass(dojo.byId("refreshFooter"),"progressPaneDown");
var pos=dojo.html.getAbsolutePosition(_59,true);
var _5c=cv.util.getDojoWidget("refreshTooltip");
var _5d=null;
_5c.addConnectNode(_59,pos.x+88,pos.y-8);
_5d=cv.util.getFirstChildByClass(_5c.domNode,"progressPaneContent");
var _5e=dojo.html.getViewport();
if(this.mode=="VIEW"||this.mode=="MINI"){
dojo.html.setStyle(_5c.domNode,"top","25px");
dojo.html.setStyle(_5c.domNode,"left",(_5e.width-320)+"px");
}
_5c._thisShow();
this.HISTORY_ACTION_LIST="";
for(var x=this.pendingActionLen;x<this.actionLog.length;++x){
this.HISTORY_ACTION_LIST+="<div style='font-size:11px;width:210px;'>"+this.actionLog[x]+"</div>";
}
if(_5d){
_5d.innerHTML=this.HISTORY_ACTION_LIST;
}
this.reportBeCanceled=false;
},_fadeInRefreshReport:function(){
dojo.lfx.html.fadeShow(this.nodeReportArea,3*cv.prefs.fadeTime).play();
},hideProgressPane:function(){
this.log(null,true);
var _5f=null;
var _60=dojo.byId(this.progressPaneId);
var _61=cv.util.getDojoWidget("refreshTooltip");
_61.close();
_61.removeConnectNode(_60);
if(this.mode=="VIEW"||this.mode=="MINI"){
_5f=this.reportBeCanceled?dojo.string.substituteParams(cvCatalog["refreshPanelCancel"],cvCatalog["refreshPanelCancelMsg"]):"";
}else{
_5f=this.reportBeCanceled?dojo.string.substituteParams(cvCatalog["refreshPanelCancel"],cvCatalog["refreshPanelCancelMsg"]):dojo.string.substituteParams(cvCatalog["refreshPanelComplete"],cvCatalog["refreshPanelCompleteMsg"]);
}
_60.innerHTML=_5f;
},getReportProperties:function(){
var _62={};
for(var x=0;x<this.reportDoc.reportProps.length;++x){
var _63=this.reportDoc.reportProps[x];
_62[_63]=this.reportDoc.getReportProperty(_63);
if(_62[_63]==null){
_62[_63]="";
}
}
return _62;
},setReportProperties:function(_64){
for(var x in _64){
this.reportDoc.setReportProperty(x,_64[x]);
}
this.setReportPropsDirty(true);
},toggleActionsPopupMenu:function(e){
if(!cv.util.getDojoWidget("reportFormatMenu")){
return;
}
var _65=cv.util.getDojoWidget("actionsMenu");
if(!_65){
return;
}
if(this.getReportFormat()=="PIVOT"){
cv.util.setMenuItem("PIVOT","checked");
cv.util.setMenuItem(this.chartOption,"none");
}else{
cv.util.setMenuItem(this.chartOption,"checked");
cv.util.setMenuItem("PIVOT","none");
}
cv.util.setMenuItem("cmdGrandTotalRow",this.reportDoc.getReportOption("showRowGrandTotal")=="true"?"checked":"none");
cv.util.setMenuItem("cmdGrandTotalCol",this.reportDoc.getReportOption("showColumnGrandTotal")=="true"?"checked":"none");
var _66=this.byId("CmdActions");
var pos=dojo.html.getAbsolutePosition(_66,true);
_65.open(pos.x+60,pos.y+13,_66);
},toggleGrandTotalRow:function(){
this.reportDoc.setReportOption("showRowGrandTotal",(this.reportDoc.getReportOption("showRowGrandTotal")=="true")?"false":"true");
this.history.add(new cv.ReportState("actionReportOptions"));
this.refreshReport();
},toggleGrandTotalCol:function(){
this.reportDoc.setReportOption("showColumnGrandTotal",(this.reportDoc.getReportOption("showColumnGrandTotal")=="true")?"false":"true");
this.history.add(new cv.ReportState("actionReportOptions"));
this.refreshReport();
},toggleChartTypePopupMenu:function(e){
var _67=cv.util.getDojoWidget("chartTypeMenu");
if(!_67){
return;
}
cv.util.setMenuItem(this.chartOption,"checked");
var _68=this.byId("CmdSelectChartType");
var pos=dojo.html.getAbsolutePosition(_68,true);
_67.open(pos.x+5,pos.y+13,_68);
},toggleReportFormat:function(e){
var act,_69=this.getReportFormat();
var _6a=null;
if(e&&e.target){
_6a=e.target;
while(!_6a.id){
_6a=_6a.parentNode;
}
}
if(_69=="PIVOT"){
if(_6a&&_6a.id.indexOf("CmdShowPivot")>=0){
return;
}
if(!this.chartOption){
this.chartOption=cv.prefs.chartOption;
}
this._initDisplay("CHART",this.chartOption);
act="actionShowChart";
}else{
if(_6a&&_6a.id.indexOf("CmdShowChart")>=0){
return;
}
this._initDisplay("PIVOT");
act="actionShowPivot";
}
this.history.add(new cv.ReportState(act));
this.refreshReport();
},toggleMultiChart:function(e){
var _6b=this.reportDoc.getChartOption("showMultiChart")=="true"?true:false;
if(e.target.id=="CmdToggleMultiChart"&&_6b){
return;
}
if(e.target.id=="CmdToggleSingleChart"&&!_6b){
return;
}
this.setShowMultiChart(!_6b);
if(!_6b){
this.history.add(new cv.ReportState("Switch to multi-charts"));
}else{
this.history.add(new cv.ReportState("Switch to single chart"));
}
this.refreshReport();
},setShowMultiChart:function(_6c){
this.reportDoc.setChartOption("showMultiChart",_6c?"true":"false");
if(_6c){
dojo.byId("CmdToggleSingleChart").src="images/report/single_chart_off.png";
dojo.byId("CmdToggleSingleChart").title="Switch to single chart";
dojo.byId("CmdToggleMultiChart").src="images/report/multi_chart_on.png";
dojo.byId("CmdToggleMultiChart").title="Switch to multi-chart";
}else{
dojo.byId("CmdToggleSingleChart").src="images/report/single_chart_on.png";
dojo.byId("CmdToggleSingleChart").title="Switch to single charts";
dojo.byId("CmdToggleMultiChart").src="images/report/multi_chart_off.png";
dojo.byId("CmdToggleMultiChart").title="Switch to multi-charts";
}
},toggleAutoRefresh:function(e){
var _6d=!cv.prefs.autoRefresh;
this.setAutoRefresh(_6d);
if(_6d&&!this.history.isStateRefreshed()){
this.refreshReport(true);
}
},setAutoRefresh:function(_6e){
cv.prefs.autoRefresh=_6e;
this.reportDoc.setReportOption("autoRefresh",_6e?"true":"false");
if(_6e){
this.byId("CmdToggleRefresh").src="images/report/button_view_autoRefresh.png";
this.byId("CmdToggleRefresh").title=cvCatalog["disableAutoRefresh"];
}else{
this.byId("CmdToggleRefresh").src="images/report/button_view_autoRefreshS.png";
this.byId("CmdToggleRefresh").title=cvCatalog["enableAutoRefresh"];
if(this.topPaneId!="layoutPane"&&this.isInitialized){
this.onToggleReportPane("cmdLayout");
}
}
},populateDropZone:function(_6f){
var _70=this.reportDoc.getChildMembers(_6f);
var _71=this.byId(_6f);
_71.innerHTML="";
for(var x=0;_70&&x<_70.length;++x){
var gem=this.createGemDomNode(_70[x],_6f);
if(gem){
_71.appendChild(gem.domNode);
}
}
if(_71.childNodes.length==0){
_71.innerHTML=cvCatalog["emptyDropZone"];
}
},populateFilters:function(){
var _72=this.reportDoc.getChildMembers("filters");
var _73=0;
this.timeUnlimited=true;
if(!_72||_72.length==0){
this.nodeFilters.innerHTML=cvCatalog[this.createPAA?"filterSummZoneHint":"filterSummZoneNone"];
}else{
dojo.dom.removeChildren(this.nodeFilters);
var x,gem,_74=[],_75=[];
for(x=0;x<_72.length;++x){
if(!_72[x].selectSingleNode("cv:predicates/cv:predicate")){
this.reportDoc.removeEmptyFilter(_72[x]);
}else{
gem=this.createGemDomNode(_72[x],"filters");
if(gem){
cv.getFieldHelp().isTimeAttribute(gem.getFormula(),true)?_74.push(gem):_75.push(gem);
}
}
}
if(_74.length>0){
this.timeUnlimited=false;
for(x=0;x<_74.length;++x){
this.nodeFilters.appendChild(_74[x].domNode);
_73+=_74[x].itemCount;
}
}
if(_75.length>0){
for(x=0;x<_75.length;++x){
this.nodeFilters.appendChild(_75[x].domNode);
_73+=_75[x].itemCount;
}
}
gem=this.createMetricFilterGem();
if(gem){
this.nodeFilters.appendChild(gem.domNode);
++_73;
}
}
this.byId("FilterCountLabel").innerHTML=_73==0?cvCatalog.filterTitleNone:dojo.string.substituteParams(_73>1?cvCatalog.filterTitlePlural:cvCatalog.filterTitleSingular,_73+"");
},showEditDialogOnColumnHeader:function(e){
if(this.mode=="EDIT"){
var _76=e.target.parentNode.attributes;
var _77=null;
for(var x=0;x<_76.length;++x){
var _78=_76.item(x);
if(_78.nodeName=="metrictype"||_78.nodeName=="type"){
_77=_78.nodeValue;
break;
}
}
this.currentSelection=this.getGem(e.target.parentNode.getAttribute("formula"));
if(_77=="EXPRESSION"){
this.rptDlg.showEditArithMeasure();
}else{
if(_77=="PCTOF"||_77=="RANK"||_77=="RSUM"||_77=="PCTRSUM"){
this.rptDlg.showEditSummaryMeasure();
}else{
if(_77=="VALUE"){
this.rptDlg.showEditColumn();
}else{
if(_77=="attribute"){
this.rptDlg.showEditColumn();
}else{
if(_77=="TREND"){
this.rptDlg.showEditTrendMeasure();
}
}
}
}
}
}
},showHelpDlg:function(){
var _79=(!this.currentSelection.metricType||this.currentSelection.metricType=="VALUE")?this.currentSelection.getFormula():this.currentSelection.getBaseFieldFormula();
if(_79&&_79.indexOf("[MEASURE:")!=0){
cv.getFieldHelp().showDlg(_79);
}
},showPropHelpDlg:function(){
this.rptDlg.show("show","propHelp");
},resize:function(_7a,_7b){
this.domNode.style.width=_7a+"px";
this.domNode.style.height=_7b+"px";
var _7c=_7b-dojo.html.getBorderBox(this.byId("ReportTitle")).height-dojo.html.getBorderBox(this.byId("ReportSummary")).height-(this.topPaneId=="layoutPane"?dojo.html.getBorderBox(this.nodeLayout).height:(this.topPaneId=="filterPane"?dojo.html.getBorderBox(this.nodeFilter).height:0));
if(_7c<=0){
return false;
}
if(this.reportWidth==_7a&&this.reportHeight==_7c){
return false;
}
this.reportWidth=_7a;
this.reportHeight=_7c;
this.nodeReportArea.style.width=_7a+"px";
this.nodeReportArea.style.height=_7c+"px";
var _7d=this.byId("ReportEmpty");
if(_7d){
_7d.style.height=_7c+"px";
}
if(this.reportHeaders){
this.reportHeaders.updateLayout();
}
var _7e=this.byId("Trashcan");
if(_7e){
dojo.lang.setTimeout(function(){
_7e.style.top=(_7b-140)+"px";
_7e.style.left=(_7a-130)+"px";
},200);
}
return true;
},resizeContainer:function(){
return this.manager.resize();
},addOptionsForAllMeasures:function(_7f,_80,_81,_82){
var _83=[],m2=[],x,id,_84,_85={};
var _86=this.reportDoc.getMetrics();
var _87=0;
var _88={};
for(x=0;x<_86.length;++x){
var _89=_86[x].getAttribute("measureTypeEnum");
if(_89=="VALUE"){
id=_86[x].getAttribute("formula");
_88[id]=_82?false:true;
}else{
id=_86[x].getAttribute("id");
if(_81&&id==_81){
++_87;
continue;
}
}
_83.push(id);
}
var _8a={};
function _8b(str,id){
if(_85[id]){
return _85[id];
}
if(!_8a[str]){
_8a[str]=1;
return str;
}
return _8b(str+"_"+(++_8a[str]),id);
};
var _8c=_86.length-_87;
var fh=cv.getFieldHelp();
_86=fh.getMeasureList();
for(x=0;x<_86.length;++x){
_84=_86[x].getAttribute("formula");
if(!fh.isHidden(_86[x])&&!_88[_84]){
m2.push(_84);
_85[_84]=_8b(this.getFieldLabel(_84,true),_84);
}
}
if(_83.length==0&&m2.length==0){
return false;
}
var _8d=this;
function _8e(a,b){
return _85[a]>_85[b]?1:(_85[a]<_85[b]?-1:0);
};
m2.sort(_8e);
_83=_83.concat(m2);
_7f.innerHTML="";
for(x=0;x<_83.length;++x){
if(x==_8c&&_82){
var _8f=new Option("---------------------------------------------------------------","");
cv.addOption(_7f,_8f);
}
var _90=(x<_8c)?_8b(this.getFieldLabel(_83[x],true),_83[x]):_85[_83[x]];
if(_80){
_90=_90.replace(/\]/g,"\\]");
}
var _8f=new Option(_90,_83[x]);
_8f.setAttribute("title",_90);
cv.addOption(_7f,_8f);
}
return true;
},addOptionsForAttributes:function(_91,_92){
var _93=[],x;
var _94=_92?1:0;
var _95=this.reportDoc.getChildMembers("columnAttributes");
for(x=0;x<_95.length-_94;++x){
_93.push(_95[x]);
}
_95=this.reportDoc.getChildMembers("rowAttributes");
for(x=0;x<_95.length-_94;++x){
_93.push(_95[x]);
}
if(_93.length==0){
return false;
}
_91.innerHTML="";
var _96=false;
for(x=_93.length-1;x>=0;--x){
var _97=_93[x].getAttribute("formula");
var _98=this.getFieldLabel(_97,true);
var _99=new Option(_98,_97);
_99.setAttribute("title",_98);
cv.addOption(_91,_99);
if(!_96){
_96=true;
}
}
return _96;
},addToCheckFieldList:function(_9a,_9b){
if(!_9a||this.newFields=="ALL"||(!_9b&&this.getGem(_9a))||this.getGem("filter_"+_9a)||this.reportDoc.isUsedByMetricFilter(_9a)){
return;
}
_9a=_9a.replace(",","&comma;");
if(!this.newFields){
this.newFields=_9a;
}else{
if(!dojo.lang.isArray(this.newFields)){
this.newFields=[this.newFields];
}
for(var x=0;x<this.newFields.length;++x){
if(this.newFields[x]==_9a){
return;
}
}
this.newFields.push(_9a);
}
},showFilterDlg:function(){
var sel=this.currentSelection;
if(!sel){
return;
}
var id=sel.id;
var _9c;
if(sel.getAttribute){
_9c=sel.getAttribute("formula");
}else{
if(sel.getFormula){
_9c=sel.getFormula();
}
}
if(!id&&!_9c){
_9c=sel.parentNode.getAttribute("formula");
if(_9c){
this.rptDlg.showFilterList(_9c);
}
}else{
if(id&&id.indexOf("filter_")==0){
this.filterDlg.show(id);
}else{
if(_9c){
this.rptDlg.showFilterList(_9c);
}
}
}
},showNewFilterDlg:function(){
var sel=this.currentSelection;
if(!sel){
return;
}
var gem=this.getGem(sel.parentNode.id);
if(!gem){
return;
}
this.filterDlg.show(gem.getFormula());
},showFilterDlgCondition:function(){
var sel=this.currentSelection;
if(sel){
this.filterDlg.showMetricFilter(sel.getFormula(),"CONDITIONS");
}
},showFilterDlgRank:function(){
var sel=this.currentSelection;
if(sel){
this.filterDlg.showMetricFilter(sel.getFormula(),"RANK");
}
},isDirty:function(){
return this.isReportPropsDirty||this.history.isStateDirty();
},isEmpty:function(){
return this.reportDoc.isEmpty();
},_revertToLastSuccessState:function(){
this.history.setTo(this.successState);
if(this.successState){
this.successState.exec(true);
}
if(cv.prefs.autoRefresh){
this.history.setRefreshed(false);
}
if(!this.history.isStateRefreshed()){
cv.util.show(this.nodeReportRefresh);
}
this.log(cvCatalog.actionCancel,true);
},_initDisplay:function(_9d,_9e){
var _9f=this.reportDoc;
var _a0=this.getReportFormat();
if(!_9d){
_9d=_a0;
}else{
if(_9d==_a0&&(_9d!="CHART"||_9e==_9f.getChartOption("chartType"))){
return false;
}
_9f.setReportOption("reportTypeEnum",_9d);
}
if(_9d=="CHART"){
if(this.mode=="EDIT"){
this.byId("CmdShowChart").src="images/report/button_view_chartS.png";
this.byId("CmdShowPivot").src="images/report/button_view_table.png";
this.byId("CmdSelectChartType").title=cvCatalog["titleSwitchChartTypeTT"];
cv.util.getDojoWidget("chartTypeMenu");
}else{
if(this.mode=="VIEW"){
cv.util.getDojoWidget("reportFormatMenu");
}
}
var _a1=_9e?_9e:_9f.getChartOption("chartType");
var _a2=cvCatalog["dropZoneLabels_"+_a1+"_ROW"];
if(_a1!="MULTIPLE_PIE"){
_a2="<img id='CmdToggleSingleChart' class='multiChartCmdButton' src='images/report/single_chart_off.png'><img id='CmdToggleMultiChart' style='padding-right: 5px;' class='multiChartCmdButton' src='images/report/multi_chart_on.png'> "+_a2;
}
this.byId("RowZoneLabel").innerHTML=_a2;
this.byId("ColZoneLabel").innerHTML=cvCatalog["dropZoneLabels_"+_a1+"_COL"];
this.byId("NumZoneLabel").innerHTML=cvCatalog["dropZoneLabels_"+_a1+"_NUM"];
if(dojo.byId("CmdToggleMultiChart")){
dojo.event.connect(dojo.byId("CmdToggleSingleChart"),"onclick",this,"toggleMultiChart");
dojo.event.connect(dojo.byId("CmdToggleMultiChart"),"onclick",this,"toggleMultiChart");
this.setShowMultiChart(this.reportDoc.getChartOption("showMultiChart")=="true"?true:false);
}
cv.util.setMenuItem(this.chartOption,"none");
this.chartOption=_a1;
_9f.setChartOption("chartType",_a1);
_9f.status=null;
if(_9f.status){
this.showReportStatus(_9f.status);
}
this.disableMetricGems(true);
}else{
if(_9d=="PIVOT"){
if(this.mode=="EDIT"){
this.byId("CmdShowChart").src="images/report/button_view_chart.png";
this.byId("CmdShowPivot").src="images/report/button_view_tableS.png";
this.byId("CmdSelectChartType").title=cvCatalog["titleShowChartTypeTT"];
}
this.byId("RowZoneLabel").innerHTML=cvCatalog["dropZoneLabels_"+_9d+"_ROW"];
this.byId("ColZoneLabel").innerHTML=cvCatalog["dropZoneLabels_"+_9d+"_COL"];
this.byId("NumZoneLabel").innerHTML=cvCatalog["dropZoneLabels_"+_9d+"_NUM"];
this.disableMetricGems(false);
}
}
this.clearGemList();
this.populateDropZone("measures");
this.populateDropZone("rowAttributes");
this.populateDropZone("columnAttributes");
this.populateFilters();
if(this.badFields.length>0){
var _a3="";
for(var x=0,len=this.badFields.length;x<len;++x){
_a3+="\t"+this.badFields[x]+"\n";
}
alert(dojo.string.substituteParams(cvCatalog.warnMissingFields,_a3));
this.setReportPropsDirty(true);
}
return true;
},onGemToggleInChart:function(){
var gem=this.currentSelection;
if(!gem){
return;
}
var _a4=gem.isHideInChart()?"false":"true";
gem.xmlNode.setAttribute("hideInChart",_a4);
var _a5=this.getReportFormat()=="CHART";
gem.disable(_a4=="true"&&_a5);
this.history.add(new cv.ReportState((_a4=="true"?"actionHide":"actionShow"),gem.getDisplayLabel(true)));
if(_a5){
this.refreshReport();
}
},onGemSortDesc:function(){
this.setSortOrder(null,"DESC",true);
},onGemSortAsc:function(){
this.setSortOrder(null,"ASC",true);
},onGemConditionalFormatting:function(_a6){
var gem=this.currentSelection;
if(!gem){
return;
}
var _a7=gem.getNumberFormat();
var _a8;
if(_a7.formatShortcut==_a6){
gem.setNumberFormat({formatShortcut:"NONE"});
_a8="actionRemoveCondFormat";
}else{
gem.setNumberFormat({formatShortcut:_a6});
_a8="actionAddCondFormat";
}
this.history.add(new cv.ReportState(_a8,gem.getDisplayLabel(true)));
this.refreshReport();
},onGemToggleSubtotal:function(){
var gem=this.currentSelection;
if(!gem){
return;
}
var val=(gem.xmlNode.getAttribute("showSubtotal")=="true")?"false":"true";
gem.xmlNode.setAttribute("showSubtotal",val);
this.history.add(new cv.ReportState((val=="true"?"actionShowSubtotal":"actionHideSubtotal"),gem.getDisplayLabel(true)));
this.refreshReport();
},onRptExclude:function(){
this.updateInTableFilter("EXCLUDE");
this.setReportPropsDirty(true);
},onRptKeep:function(){
this.updateInTableFilter("KEEP");
this.setReportPropsDirty(true);
},onRptDrillDown:function(){
this.updateInTableFilter("KEEP_AND_DRILL");
this.setReportPropsDirty(true);
},onRptShowAll:function(){
this.updateInTableFilter("SHOW_ALL");
this.setReportPropsDirty(true);
},onRptNonVisualTotal:function(){
this.reportDoc.setReportOption("useNonVisualTotals",(this.reportDoc.getReportOption("useNonVisualTotals")=="true")?"false":"true");
this.history.add(new cv.ReportState("actionNonVisual"));
this.refreshReport();
},onRptHideGrandTotal:function(){
var obj=this.currentSelection;
while(obj&&obj.tagName!="DIV"&&obj.id!="pivotTableColumnHeaderContainer"&&obj.id!="pivotTableRowHeaderContainer"){
obj=obj.parentNode;
}
if(!obj){
return;
}
if(obj.id=="pivotTableColumnHeaderContainer"){
this.reportDoc.setReportOption("showRowGrandTotal","false");
}else{
this.reportDoc.setReportOption("showColumnGrandTotal","false");
}
this.history.add(new cv.ReportState("actionHideGrandTotal"));
this.refreshReport();
},onNewReport:function(){
var _a9=this;
if(this.isDirty()){
return this.rptDlg.showConfirm("promptDirtyReport",null,{srcFunc:function(){
_a9.history.setSaved();
_a9.setReportPropsDirty(false);
_a9.onNewReport();
}});
}
this.reportDoc.initialize();
var _aa="editor?command=new&catalog="+this.catalog+"&cube="+this.cube;
dojo.lang.setTimeout(function(){
window.location=_aa;
},0);
},onNewReportArea:function(){
var _ab=this;
if(this.isDirty()){
return this.rptDlg.showConfirm("promptDirtyReport",null,{srcFunc:function(){
_ab.history.setSaved();
_ab.setReportPropsDirty(false);
_ab.onNewReportArea();
}});
}
window.location="./select_area.jsf";
},onResetColumnSize:function(){
this.columnDataFieldWidths=new Array();
this.rowFieldWidths=new Array();
this.reportHeaders.updateLayout();
this.isReportPropsDirty=true;
var _ac=new cv.ReportState("Reset Column Sizes");
_ac.resizeData={rowFieldWidths:this.rowFieldWidths.slice(0,this.rowFieldWidths.length),columnDataFieldWidths:this.columnDataFieldWidths.slice(0,this.columnDataFieldWidths.length)};
var _ad=this.history.isStateRefreshed();
this.history.add(_ac);
if(_ad){
this.history.setRefreshed(true);
}
},onReset:function(){
if(dojo.html.hasClass(dojo.byId("cmdResetBtn"),"disabled")){
return;
}
cv.util.goToURL(window.location);
},onShowRenameRpt:function(){
rptTooltip.showRenameRpt();
},onToggleReportPane:function(e){
var _ae;
if(dojo.lang.isObject(e)){
_ae=e.target;
while(!_ae.id){
_ae=_ae.parentNode;
}
_ae=_ae.id.substring(this.id.length);
}else{
_ae=e;
}
return this.manager.onToggleReportPane(_ae);
},hideTruncateMessage:function(e){
if(e.target.id=="closeRowTruncate"){
cv.util.hide(this.nodeRowTruncate);
this.closeTruncateStatus=="None"?this.closeTruncateStatus="RowClose":this.closeTruncateStatus="BothClose";
}else{
if(e.target.id=="closeColTruncate"){
cv.util.hide(this.nodeColTruncate);
this.closeTruncateStatus=="None"?this.closeTruncateStatus="ColClose":this.closeTruncateStatus="BothClose";
}
}
}});
dojo.declare("cv.ReportState",null,function(_af,_b0){
if(_af&&cvCatalog[_af]){
_af=cvCatalog[_af];
}
this.action=(_af&&_b0)?dojo.string.substituteParams(_af,_b0):_af;
},{resizeData:{},init:function(_b1){
this.report=_b1;
if(!this.reportXml){
this.reportXml=dojo.dom.innerXML(_b1.reportDoc.getReportNode());
}
this.resizeData.rowFieldWidths=this.report.rowFieldWidths.slice(0,this.report.rowFieldWidths.length);
this.resizeData.columnDataFieldWidths=this.report.columnDataFieldWidths.slice(0,this.report.columnDataFieldWidths.length);
if(this.action!="Column Resize"){
_b1.log(this.action);
}
},checkRefresh:function(){
if(cv.prefs.autoRefresh){
this.report.history.setRefreshed();
}else{
this.report.refreshReport();
}
},exec:function(_b2,_b3){
var doc=dojo.dom.createDocumentFromText(this.reportXml);
if(doc&&doc.documentElement){
if(this.report.manager.cmdUndo!=null&&this.report.manager.cmdUndo.title.indexOf("Column Resize")>-1&&_b3=="UNDO"){
this.report.reportHeaders.updateLayout(this.resizeData.index,-this.resizeData.dx,this.resizeData.colspan);
this.checkRefresh();
}else{
if(this.report.manager.cmdUndo!=null&&this.report.manager.cmdRedo.title.indexOf("Column Resize")>-1&&_b3=="REDO"){
this.report.reportHeaders.updateLayout(this.resizeData.index,this.resizeData.dx,this.resizeData.colspan);
this.checkRefresh();
}else{
if(this.report.manager.cmdUndo!=null&&(this.report.manager.cmdUndo.title.indexOf("Reset Column")>-1||this.report.manager.cmdRedo.title.indexOf("Reset Column")>-1)){
this.report.columnDataFieldWidths=this.resizeData.columnDataFieldWidths.slice(0,this.resizeData.columnDataFieldWidths.length);
this.report.rowFieldWidths=this.resizeData.rowFieldWidths.slice(0,this.resizeData.rowFieldWidths.length);
this.checkRefresh();
}else{
this.report.columnDataFieldWidths=this.resizeData.columnDataFieldWidths.slice(0,this.resizeData.columnDataFieldWidths.length);
this.report.rowFieldWidths=this.resizeData.rowFieldWidths.slice(0,this.resizeData.rowFieldWidths.length);
this.report.openReport(doc.documentElement,_b2);
}
}
}
}
},back:function(_b4){
if(this.report.manager.cmdUndo.title.indexOf("Column")<0){
this.report.log("UNDO");
}
this.exec(_b4,"UNDO");
},forward:function(_b5){
if(this.report.manager.cmdRedo.title.indexOf("Column")<0){
this.report.log("REDO");
}
this.exec(_b5,"REDO");
},copy:function(_b6){
this.reportXml=_b6.reportXml;
}});
dojo.extend(cv.Report,{appendGem:function(_b7){
if(!this.checkDuplicateGem(_b7)){
return false;
}
if(this._getGemsInHierarchy(_b7)){
return this.insertGemInHierarchy(_b7,"actionAdd");
}else{
return this.insertGem(_b7,cv.getFieldHelp().getDndType(_b7)=="V"?"measures":"rowAttributes","append","actionAdd");
}
},checkColumns:function(_b8){
if(this.reportDoc.getChildMembers("columnAttributes").length+_b8<=cv.prefs.maxColumnFields){
return true;
}
var _b9=(this.getReportFormat()=="PIVOT")?"PIVOT_FULL":this.reportDoc.getChartOption("chartType");
dojo.lang.setTimeout(this.rptDlg,"showError",500,["errorTooManyFields",cv.prefs.maxColumnFields,cvCatalog["dropZoneLabels_"+_b9+"_COL"]]);
return false;
},checkDuplicateGem:function(_ba){
var gem,_bb=this.gemList.getKeyList();
if(!_bb||_bb.length==0){
return true;
}
for(var x=0;x<_bb.length;++x){
var _bc=this.gemList.item(_bb[x]);
if(_bb[x]==_ba||(_bc.type==cvConst.TYPE_METRIC&&_bc.metricType=="VALUE"&&_bc.getFormula()==_ba)){
gem=_bc;
break;
}
}
if(gem){
this.rptDlg.showError(["errorDuplicateItemInReport",gem.getDisplayLabel()],"CV/Business_User/working_with_fields.html");
return false;
}
return true;
},checkGemHierarchy:function(_bd,_be,_bf){
if(_bd=="rowAttributes"||_bd=="columnAttributes"){
var _c0=_be.getAttribute("formula");
var _c1=this.getFieldLabel(_be);
var _c2=this._getGemsInHierarchy(_c0);
if(!_c2||_c2[0].getZoneId()==_bd){
return true;
}
if(_bf){
var _c3="",_c4=[];
for(var x=0;x<_c2.length;++x){
if(x>0){
_c3+=", ";
}
_c3+=_c2[x].getDisplayLabel();
_c4.push(_c2[x]);
}
_c4.push(this.getGem(_c0));
this.pendingAction={func:"moveHierarchy",params:{list:_c4,zoneId:_bd,refId:_bf.refId,pos:_bf.pos}};
this.rptDlg.showConfirm(["promptMoveFieldHierarchy",_c1,_c3],"CV/Business_User/working_with_fields.html#about_field_hierarchies",{srcObj:this,srcFunc:"moveHierarchy"});
}else{
this.rptDlg.showError(["errorBreakFieldHierarchy",_c1,_c2[0].domNode.title],"CV/Business_User/working_with_fields.html#about_field_hierarchies");
}
return false;
}
return true;
},clearGemList:function(){
this.currentSelection=null;
this.gemList.clear();
this.badFields=[];
this.badFilters=false;
},createGem:function(_c5){
if(_c5.gemType==cvConst.TYPE_METRIC&&_c5.metricType!="VALUE"&&_c5.metricType!="EXPRESSION"){
var _c6=this.getGem(_c5.formula);
if(_c6){
var _c7=_c6.xmlNode.selectSingleNode("cv:displayLabels/cv:displayLabel");
if(_c7&&_c7.getAttribute("label")){
_c5.label=dojo.string.substituteParams(cvCatalog["metric"+_c5.metricType],_c7.getAttribute("label"));
_c5.locale=_c7.getAttribute("locale");
}
}
}else{
if(_c5.zoneId=="measures"&&!_c5.metricType){
_c5.metricType="VALUE";
}
}
var _c8=this.reportDoc.createNode(_c5);
return this.createGemDomNode(_c8,_c5.zoneId);
},createGemDomNode:function(_c9,_ca){
var gem;
switch(cvConst.defaultGemTypes[_ca]){
case cvConst.TYPE_ATTRIBUTE:
gem=new cv.AttributeGem(_c9,this);
break;
case cvConst.TYPE_METRIC:
gem=new cv.MetricGem(_c9,this);
break;
case cvConst.TYPE_FILTER:
gem=new cv.FilterGem(_c9,this,false);
break;
default:
return null;
}
if(gem.bad){
return null;
}
if(_ca){
gem.setZone(_ca);
}
gem.createDomNode();
this.gemList.add(gem.getId(),gem);
return gem;
},createMetricFilterGem:function(){
var _cb=this.reportDoc.getMetricFilterNode();
if(!_cb){
return null;
}
var gem=new cv.FilterGem(_cb,this,true);
if(gem.bad){
return null;
}
gem.setZone("filters");
gem.createDomNode();
this.gemList.add(gem.getId(),gem);
return gem;
},createSpecialMetricGem:function(_cc){
_cc.gemType=cvConst.TYPE_METRIC;
var gem=this.createGem(_cc);
this.insertGem(gem,_cc.refGem,"after",null,true);
return gem;
},disableMetricGems:function(_cd){
var _ce=this.gemList.getKeyList();
if(!_ce||_ce.length==0){
return;
}
for(var x=0;x<_ce.length;++x){
var gem=this.gemList.item(_ce[x]);
if(gem.metricType){
gem.disable(_cd&&gem.isHideInChart());
}
}
},getFieldLabel:function(obj,_cf){
if(!obj){
return "";
}
var _d0=null,_d1=null;
if(dojo.lang.isString(obj)){
_d0=obj;
}else{
if(dojo.lang.isObject(obj)){
if(obj.id&&this.gemList.item(obj.id)){
_d1=this.gemList.item(obj.id).getDisplayLabel(true);
}else{
_d0=obj.getAttribute("formula");
}
}
}
if(!_d1){
if(!_d0){
return "";
}
var gem=this.getGem(_d0);
_d1=gem?gem.getDisplayLabel(true):cv.getFieldHelp().get(_d0,"displayLabel");
}
if(!_d1){
_d1=cv.util.parseMDXExpression(_d0,false);
}
return _cf?_d1:dojo.string.escape("html",_d1);
},getFieldLabelPlural:function(obj,_d2){
if(!obj){
return "";
}
var _d3=null,_d4=null;
if(dojo.lang.isString(obj)){
_d3=obj;
}else{
if(dojo.lang.isObject(obj)){
if(obj.id&&this.gemList.item(obj.id)){
_d4=this.gemList.item(obj.id).getDisplayLabelPlural(true);
}else{
_d3=obj.getAttribute("formula");
}
}
}
if(!_d4){
if(!_d3){
return "";
}
var gem=this.getGem(_d3);
_d4=gem?gem.getDisplayLabelPlural(true):cv.getFieldHelp().get(_d3,"displayLabelPlural");
}
return (!_d4||_d2)?_d4:dojo.string.escape("html",_d4);
},getGem:function(key,_d5){
if(!key){
return null;
}
if(dojo.lang.isString(key)){
if(this.gemList.contains(key)){
return this.gemList.item(key);
}
if(!_d5){
_d5="VALUE";
}
}else{
if(!key.xmlNode){
return null;
}
}
var _d6=this.gemList.getKeyList();
if(!_d6||_d6.length==0){
return null;
}
for(var x=0;x<_d6.length;++x){
var gem=this.gemList.item(_d6[x]);
if(gem&&((key.xmlNode&&gem.xmlNode==key.xmlNode)||(gem.getFormula()==key&&gem.metricType==_d5))){
return gem;
}
}
return null;
},getGemFromDomNode:function(_d7){
if(!_d7){
return null;
}
if(_d7.id){
var gem=this.getGem(_d7.id);
if(gem){
return gem;
}
}
if(_d7.getAttribute("type")=="measure"){
return this.getGem(_d7.getAttribute("formula"),_d7.getAttribute("metrictype"));
}else{
return this.getGem(_d7.getAttribute("formula"));
}
},_getGemsInHierarchy:function(_d8){
var _d9=cv.getFieldHelp().getHierarchy(_d8);
var _da=[];
for(var x=0;_d9&&x<_d9.length;++x){
var id=_d9[x];
var _db;
if(id!=_d8){
_db=this.getGem(id);
if(_db){
_da.push(_db);
}
}
}
return (_da.length==0)?null:_da;
},getSummaryFacet:function(_dc,_dd){
var gem=this.getGem(_dc,_dd);
return gem?gem.getMetricFacet():null;
},getTrendNumberOnAncestors:function(_de){
var _df=cv.getFieldHelp().getHierarchy(_de);
if(!_df){
return null;
}
for(var x=0;x<_df.length;++x){
var id=_df[x];
if(id==_de){
break;
}
var _e0=this.reportDoc.getNode("cv:report/cv:measures/cv:measure/cv:trendFacet[@trendAttributeFormula=\""+id+"\"]");
if(_e0){
return {ancestor:id,trend:this.getGem({xmlNode:_e0.parentNode})};
}
}
return null;
},updateMultiChartGemCSS:function(){
var _e1=false;
if(this.reportDoc.getReportOption("reportTypeEnum")=="CHART"&&this.reportDoc.getChartOption("chartType")!="MULTIPLE_PIE"&&this.reportDoc.getChartOption("showMultiChart")=="true"){
_e1=true;
}
var _e2=this.byId("rowAttributes").childNodes;
for(var i=0;i<_e2.length;++i){
if(i==0&&_e1){
dojo.html.removeClass(_e2[i],"attributeItem");
dojo.html.addClass(_e2[i],"attributeMultiChartItem");
this.getGemFromDomNode(_e2[i]).cssClassHover="attributeMultiChartItemHover";
}else{
dojo.html.addClass(_e2[i],"attributeItem");
dojo.html.removeClass(_e2[i],"attributeMultiChartItem");
this.getGemFromDomNode(_e2[i]).cssClassHover="attributeItemHover";
}
}
var _e3=this.byId("columnAttributes").childNodes;
for(var i=0;i<_e3.length;++i){
dojo.html.removeClass(_e3[i],"attributeMultiChartItem");
dojo.html.addClass(_e3[i],"attributeItem");
this.getGemFromDomNode(_e3[i]).cssClassHover="attributeItemHover";
}
},insertGem:function(_e4,_e5,_e6,_e7,_e8){
var gem,_e9,_ea;
var _eb=dojo.lang.isObject(_e5)?_e5:this.getGem(_e5);
if(_eb){
_e9=_eb.getZoneId();
_ea=_eb.domNode;
}else{
_e9=_e5;
if(_e9.indexOf(this.id)==0){
_e9=_e9.substring(this.id.length);
}
_ea=this.byId(_e9);
_eb=this.reportDoc.getReportZoneNode(_e9);
}
gem=dojo.lang.isObject(_e4)?_e4:this.getGem(_e4);
if(!(gem&&gem.getZoneId()==_e9)&&_e9=="columnAttributes"&&!this.checkColumns(1)){
return null;
}
if(!gem){
gem=this.createGem({zoneId:_e9,formula:_e4});
}
var _ec=dojo.html.getElementsByClass("gemLabel",gem.zone);
var _ed=_ec.length-1;
if(_e6!="append"){
for(var i=0;i<_ec.length;++i){
if(dojo.dom.textContent(_ea)==dojo.dom.textContent(_ec[i])){
_ed=i;
break;
}
}
if(gem.metricType=="VALUE"){
this.updateReportResizeParams("add",_ed,_e6,"measure");
}else{
this.updateReportResizeParams("add",_ed,_e6);
}
}else{
if(gem.metricType=="VALUE"&&this.reportHeaders!=null&&this.reportHeaders.columnHeaderContainer.getElementsByTagName("COL").length>_ec.length){
this.updateReportResizeParams("add",_ec.length,"before","measure");
}
}
var ok=true;
if(_e6=="before"){
dojo.dom.insertBefore(gem.xmlNode,_eb.xmlNode);
ok=dojo.html.insertBefore(gem.domNode,_ea);
}else{
if(_e6=="after"){
dojo.dom.insertAfter(gem.xmlNode,_eb.xmlNode);
ok=dojo.html.insertAfter(gem.domNode,_ea);
}else{
if(_e6=="append"){
_eb.appendChild(gem.xmlNode);
if(_ea.innerHTML==cvCatalog["emptyDropZone"]){
_ea.innerHTML="";
}
_ea.appendChild(gem.domNode);
}
}
}
if(_e7){
this.history.add(new cv.ReportState(_e7,gem.getDisplayLabel(true)));
if(_e7=="actionAdd"){
this.addToCheckFieldList(gem.getFormula(),true);
}
}
this.resizeContainer();
if(!_e8){
this.refreshReport();
}
return gem;
},insertGemInHierarchy:function(_ee,_ef,_f0){
var _f1=cv.getFieldHelp().getHierarchy(_ee);
if(!_f1){
return null;
}
var _f2=null,_f3=null;
for(var x=0;x<_f1.length;++x){
var id=_f1[x];
if(id==_ee){
if(_f2){
_f3="after";
break;
}
_f3="before";
}else{
var gem=this.getGem(id);
if(gem){
_f2=gem;
if(_f2&&_f3){
break;
}
}
}
}
if(!_f2||!_f3){
return null;
}
return this.insertGem(_ee,_f2,_f3,_ef,_f0);
},moveHierarchy:function(){
if(!this.pendingAction||this.pendingAction.func!="moveHierarchy"){
return;
}
var _f4=this.pendingAction.params;
if(_f4.zoneId=="columnAttributes"&&!this.checkColumns(_f4.list.length)){
return;
}
for(var x=0;x<_f4.list.length;++x){
var gem=_f4.list[x];
var _f5=gem.getFormula();
var _f6=gem.getSortOrder();
this.removeGem(gem,true,null,true);
if(x==0){
gem=this.insertGem(_f5,_f4.refId,_f4.pos,null,true);
}else{
gem=this.insertGemInHierarchy(_f5,null,true);
}
if(gem){
gem.setSortOrder(_f6);
}
}
this.history.add(new cv.ReportState("actionMoveHierarchy"));
this.refreshReport();
},onMouseOverFilters:function(e){
var _f7=cv.util.getAncestorByClass(e.target,"filterItem");
if(!_f7||_f7!=this.currentSelection){
this._setFilterSelected(this.currentSelection,false);
this.currentSelection=_f7;
}
if(!_f7){
return;
}
this._setFilterSelected(_f7,true);
},removeFilter:function(_f8){
var reg=/^(filter_.+)_(\d)$/;
var _f9=reg.exec(_f8);
if(!_f9){
return false;
}
var gem=this.getGem(_f9[1]);
if(!gem){
return false;
}
if(gem.isNumeric){
cv.util.removeNode(this.reportDoc.getNode("cv:report/cv:filters/cv:filter/cv:conditions"));
cv.util.removeNode(this.reportDoc.getNode("cv:report/cv:filters/cv:filter/cv:topBottom"));
this.reportDoc.removeEmptyFilter(gem.xmlNode);
this.gemList.remove(gem.getId());
}else{
if(!this.reportDoc.removeFilterPredicate(gem.xmlNode,_f9[2])){
this.gemList.remove(gem.getId());
}
}
if(cv.dlgWidget&&cv.dlgWidget.isShowing()){
var _fa=_f9[1];
var _fb=this.getGem(_fa);
if(!_fb){
cv.dlgWidget.hide();
}else{
if(!this.rptDlg.load(this.getFieldLabel(_fa.substring(7)),dojo.string.escape("HTML",_fa.substring(7)))){
cv.dlgWidget.hide();
}
var _fc=this.rptDlg.byId("predicateList");
dojo.html.addClass(_fc,"unlocked");
dojo.html.addClass(_fc,"filterGroup");
dojo.dom.removeChildren(_fc);
_fc.innerHTML=_fb.createSummary(true);
}
}
this.populateFilters();
this.currentSelection=null;
if(gem.isNumeric){
this.history.add(new cv.ReportState("actionRemoveNumericFilter"));
}else{
this.history.add(new cv.ReportState("actionRemoveFilter",gem.getDisplayLabel(true)));
}
this.resizeContainer();
this.refreshReport();
},removeCurrentGem:function(_fd){
if(_fd){
this.currentSelection=this.getGemFromDomNode(_fd);
}
var sel=this.currentSelection;
if(!sel){
return;
}
if(!(sel instanceof cv.BaseGem)){
var id=sel.id;
if(id&&id.indexOf("filter_")==0){
this.removeFilter(id);
}
return;
}
var _fe=sel.getZoneId();
if(_fe=="rowAttributes"||_fe=="columnAttributes"){
var _ff=sel.getFormula();
var _100=sel.getDisplayLabel();
var _101=this.reportDoc.getNode("cv:report/cv:measures/cv:measure/cv:summaryFacet[@breakAttributeFormula='"+_ff+"']");
if(_101){
_101=this.getGem({xmlNode:_101.parentNode});
if(_101){
return this.rptDlg.showError(["errorUsedByMetric",_100,_101.getDisplayLabel()]);
}
}
if(this.reportDoc.isUsedByMetricFilter(_ff)){
return this.rptDlg.showConfirm(["promptUsedByFilter",_100],"CV/Business_User/working_with_filters.html#numeric_filters_larger_than",{srcObj:this,srcFunc:"removeGem"});
}
var _102=this.reportDoc.getNode("cv:report/cv:measures/cv:measure/cv:trendFacet[@trendAttributeFormula=\""+_ff+"\"]");
if(_102){
_102=this.getGem({xmlNode:_102.parentNode});
}
var heir=cv.getFieldHelp().getHierarchy(_ff,false);
if(heir){
var _103=false;
for(var x=0,_104=false;x<heir.length;++x){
if(heir[x]==_ff){
_104=true;
}else{
if(_104){
if(this.getGem(heir[x])){
_103=true;
break;
}
}
}
}
if(_103){
_102=null;
}else{
if(!_102){
var _105=this.reportDoc.getMetrics("TREND");
if(_105.length>0){
var _106=dojo.lang.indexOf(heir,_ff);
for(var x=0;!_102&&x<_105.length;++x){
var attr=_105[x].selectSingleNode("cv:trendFacet").getAttribute("trendAttributeFormula");
var id=dojo.lang.indexOf(heir,attr);
if(id<0||id>_106){
continue;
}
_102=_105[x];
if(this.getGem("filter_"+_ff)){
return this.rptDlg.showError(["errorRemoveWithTrendOnAncestor",_100,this.getFieldLabel(attr),this.getGem({xmlNode:_102}).getDisplayLabel()]);
}
for(var y=id;y<_106;++y){
if(this.getGem(heir[y])){
_102=null;
break;
}
}
}
}
if(_102){
return this.rptDlg.showError(["errorUsedByTrendMetric",_100,this.getGem({xmlNode:_102}).getDisplayLabel()]);
}
}
}
}
if(_102){
return this.rptDlg.showError(["errorUsedByTrendMetric",_100,_102.getDisplayLabel()]);
}
}else{
if(_fe=="measures"&&sel.metricType!="VALUE"){
var id=sel.getFormula();
var _101=this.reportDoc.getFirstMetricDependent(id);
if(_101){
_101=this.getGem({xmlNode:_101});
if(_101){
return this.rptDlg.showError(["errorUsedByMetric",sel.getDisplayLabel(),_101.getDisplayLabel()]);
}
}
if(this.reportDoc.isUsedByMetricFilter(id)){
return this.rptDlg.showConfirm(["promptUsedByFilter",sel.getDisplayLabel()],"CV/Business_User/working_with_filters.html#numeric_filters_larger_than",{srcObj:this,srcFunc:"removeGem"});
}
}
}
this.removeGem(sel,true,"actionRemove");
},removeGem:function(gem,_107,_108,_109){
if(gem&&!dojo.lang.has(gem,"getFormula")){
gem=this.currentSelection;
_108="actionRemove";
}
if(!gem){
return;
}
var _10a=dojo.html.getElementsByClass("gemLabel",gem.zone);
for(var i=0;i<_10a.length;++i){
if(dojo.dom.textContent(gem.domNode)==dojo.dom.textContent(_10a[i])){
if(gem.metricType=="VALUE"){
this.updateReportResizeParams("remove",i,"","measure");
}else{
this.updateReportResizeParams("remove",i);
}
break;
}
}
if(!_107){
if(this.reportDoc.removeFromMetricFilter(gem.getFormula())){
this.populateFilters();
}
}
this.gemList.remove(gem.getId());
cv.util.removeNode(gem.xmlNode);
gem.zone.removeChild(gem.domNode);
if(gem.zone.innerHTML==""){
gem.zone.innerHTML=cvCatalog["emptyDropZone"];
}
this.currentSelection=null;
if(_108){
this.history.add(new cv.ReportState(_108,gem.getDisplayLabel(true)));
}
this.resizeContainer();
if(!_109){
this.refreshReport();
}
},removeCurrentProp:function(){
var name=this.currentSelection.getAttribute("name");
var _10b=this.currentSelection.getAttribute("formula");
var gem=this.getGem(_10b);
gem.removeProperty(name);
},_setFilterSelected:function(node,_10c){
if(_10c){
dojo.html.addClass(node,"filterItemMouseOver");
}else{
dojo.html.removeClass(node,"filterItemMouseOver");
}
},setSortOrder:function(gem,_10d,_10e,_10f){
if(gem&&dojo.lang.isString(gem)){
gem=this.getGem(gem);
}else{
if(!gem){
gem=this.currentSelection;
}
}
if(!gem){
return;
}
var _110=gem.getZoneId()=="rowAttributes"&&gem.isLast();
if(_10d==gem.getSortOrder()&&!(_110&&this.reportDoc.getSortedMetric())){
return;
}
gem.setSortOrder(_10d);
if(gem.metricType||_110){
var _111=this.gemList.getKeyList();
for(var x=0;_111&&x<_111.length;++x){
var agem=this.gemList.item(_111[x]);
if(agem&&agem.metricType&&agem.getId()!=gem.getId()){
agem.setSortOrder("NONE");
}
}
}
if(_10e){
if(gem.metricType){
var rows=this.reportDoc.getChildMembers("rowAttributes");
this.history.add(new cv.ReportState("actionSort",gem.getDisplayLabel(true)));
if(rows.length>=2){
this.rptDlg.showWarning(["warnSortMetric",this.getFieldLabel(rows[rows.length-1]),gem.getDisplayLabel(),this.getFieldLabel(rows[rows.length-2])],null,null,null,null,this);
}else{
this.refreshReport();
}
}else{
this.history.add(new cv.ReportState("actionSort",gem.getDisplayLabel(true)));
this.refreshReport();
}
}
},sortMembers:function(a,b){
if(a==b){
return 0;
}
var aa=a.caption;
var bb=b.caption;
if(aa==bb){
return a>b?1:-1;
}
return aa>bb?1:-1;
},toggleFilterLock:function(){
if(!this.currentSelection){
return;
}
var gem=this.getGem(this.currentSelection.parentNode.id);
if(!gem){
return;
}
gem.setViewType(gem.isLocked()?"MULTIPLE":"NONE");
},toggleInReportPopupMenu:function(e){
var obj=e.target;
if(obj.className=="resize"){
obj=obj.parentNode;
}
while(obj&&obj.tagName!="TD"){
obj=obj.parentNode;
}
if(!obj){
return;
}
var type=obj.getAttribute("type");
var menu=cv.util.getDojoWidget(type+"PopMenu"),_112=false;
this.currentSelection=null;
switch(type){
case "measure":
case "attribute":
this.currentSelection=this.getGem(obj.getAttribute("formula"));
if(this.currentSelection!=null){
this.currentSelection.updatePopupMenu();
}
break;
case "prop":
this.currentSelection=obj;
break;
case "member":
this.currentSelection=obj;
var _113=this.currentSelection.getAttribute("member");
var _114=this.currentSelection.getAttribute("formula");
var _115=this.getGem("filter_"+_114);
var _116=_115&&_115.isLocked(true);
var _117=cv.getFieldHelp().getDirectChild(_114);
if(menu){
if(menu.domNode&&menu.domNode.memberId==_113){
break;
}
cv.util.disconnectPopupMenu(this,[{id:"PM:membEXCLUDE",handler:"onRptExclude"},{id:"PM:membKEEP",handler:"onRptKeep"},{id:"PM:membKEEP_AND_DRILL",handler:"onRptDrillDown"},{id:"PM:membSHOW_ALL",handler:"onRptShowAll"}]);
menu.destroyChildren();
}else{
menu=dojo.widget.createWidget("PopupMenu2",{id:"memberPopMenu"},null);
document.body.appendChild(menu.domNode);
}
menu.domNode.memberId=_113;
_113=dojo.dom.textContent(obj.firstChild);
if(_116){
var mi=dojo.widget.createWidget("MenuItem2",{id:"PM:membLocked",caption:dojo.string.substituteParams(cvCatalog.menuMembLocked,this.getFieldLabel(_114))});
menu.addChild(mi);
}else{
var mi=dojo.widget.createWidget("MenuItem2",{id:"PM:membEXCLUDE",caption:dojo.string.substituteParams(cvCatalog.menuMembEXCLUDE,_113)});
menu.addChild(mi);
dojo.event.connect(mi,"onClick",this,"onRptExclude");
mi=dojo.widget.createWidget("MenuItem2",{id:"PM:membKEEP",caption:dojo.string.substituteParams(cvCatalog.menuMembKEEP,_113)});
menu.addChild(mi);
dojo.event.connect(mi,"onClick",this,"onRptKeep");
if(_117){
mi=dojo.widget.createWidget("MenuItem2",{id:"PM:membKEEP_AND_DRILL",caption:dojo.string.substituteParams(cvCatalog.menuMembKEEP_AND_DRILL,_113,this.getFieldLabel(_117))});
menu.addChild(mi);
dojo.event.connect(mi,"onClick",this,"onRptDrillDown");
}
if(_115){
mi=dojo.widget.createWidget("MenuItem2",{id:"PM:membSHOW_ALL",caption:dojo.string.substituteParams(cvCatalog.menuMembSHOW_ALL,this.getFieldLabel(_114))});
menu.addChild(mi);
dojo.event.connect(mi,"onClick",this,"onRptShowAll");
}
}
_112=true;
break;
case "grandTotal":
this.currentSelection=obj;
cv.util.setMenuItem("PM:totalNonVisual",this.reportDoc.getReportOption("useNonVisualTotals")=="true"?"checked":"none",this.createPAA?"enabled":"disabled");
cv.util.updateMenuItemCaption("PM:totalHide",dojo.dom.getFirstAncestorByTag(obj,"TABLE").id=="ZONE_columnAttributes"?"menuHideGrandTotalRow":"menuHideGrandTotalCol");
break;
default:
return;
}
if(this.currentSelection!=null){
menu.open(e.clientX,e.clientY,this.currentSelection);
}
e.preventDefault();
e.stopPropagation();
},updateFilterProps:function(_118,pred,_119){
var _11a=_118.predicates,_11b=null;
if(pred.members){
pred.members.sort(this.sortMembers);
}
var _11c=_11a.getKeyList();
if(pred.op=="CONTAIN"||pred.op=="NOT_CONTAIN"||((pred.op=="EQUAL"||pred.op=="NOT_EQUAL")&&!pred.preset)){
for(var i=0;i<_11c.length;++i){
var _11d=_11a.item(_11c[i]);
for(var j=0;j<_11d.length;j++){
var pd=_11d[j];
if(pd.op!=pred.op||pd.preset){
continue;
}
if(pd.ordinal==pred.ordinal){
break;
}
if(!_119){
alert(dojo.string.substituteParams(cvCatalog.infoMergeFilter,cvCatalog["filterOpString_"+pred.op],this.getFieldLabel(_118.formula)));
}
if(pred.op=="CONTAIN"||pred.op=="NOT_CONTAIN"){
var expx=pd.exp,expy=pred.exp;
var lenx=expx.length,leny=expy.length;
for(var y=0;y<leny;++y){
for(var x=0;x<lenx;++x){
if(expy[y]==expx[x]){
break;
}
}
if(x>=lenx){
expx.push(expy[y]);
}
}
}else{
pd.members.sort(this.sortMembers);
var memx=pd.members,memy=pred.members;
var x=0,y=0,lenx=memx.length,leny=memy.length,mem=[],flag;
while(x<lenx||y<leny){
if(x>=lenx){
while(y<leny){
mem.push(memy[y++]);
}
}else{
if(y>=leny){
while(x<lenx){
mem.push(memx[x++]);
}
}else{
flag=this.sortMembers(memx[x],memy[y]);
if(flag==0){
mem.push(memx[x++]);
++y;
}else{
if(flag>0){
mem.push(memy[y++]);
}else{
mem.push(memx[x++]);
}
}
}
}
}
pd.members=mem;
}
_11b=pd;
_11b.ordinal=i+1;
break;
}
if(_11b){
if(_11a.contains(pred.ordinal)){
_11a.remove(pred.ordinal);
}
break;
}
}
}
if(!_11b){
_11b=pred;
var ord=_11b.ordinal;
if(!ord){
for(var x=0;x<_11a.getKeyList().length;x++){
if(_11a.getKeyList()[x]>ord){
ord=_11a.getKeyList()[x];
}
}
ord=ord+1;
}
var _11e=[];
_11e.push(_11b);
_11a.add(ord,_11e);
}
return _11b;
},updateRelativeFilterProps:function(_11f,_120){
var ord=_120[0].ordinal;
var _121=_11f.predicates;
var _122=_121.getKeyList();
if(!ord){
for(var x=0;x<_122.length;x++){
if(parseInt(_122[x])>=ord){
ord=parseInt(_122[x])+1;
}
}
}
for(var x=0;x<_120.length;x++){
if(!_120[x].ordinal){
_120[x].ordinal=ord;
}else{
break;
}
}
var _123={"EQUAL":0,"TIME_YAGO":1,"TIME_RANGE_PREV":2,"TIME_RANGE_NEXT":3,"TIME_AGO":4,"TIME_AHEAD":5};
_120.sort(function(a,b){
if(a.op==b.op){
return 0;
}
return _123[a.op]>_123[b.op]?1:-1;
});
_121.add(ord,_120);
},updateInTableFilter:function(type,_124,_125){
var _126;
var _127;
if(_124){
_126=_124.formula;
_127={"formula":_124.member,"caption":_124.caption};
}else{
_126=this.currentSelection.getAttribute("formula");
_127={"formula":this.currentSelection.getAttribute("member"),"caption":dojo.dom.textContent(this.currentSelection.firstChild)};
}
var _128=this.getGem("filter_"+_126);
var _129=null;
if(_128&&_128.isLocked(true)){
return;
}
if(type=="SHOW_ALL"){
if(!_128){
return;
}
cv.util.removeNode(_128.xmlNode.selectSingleNode("cv:predicates"));
if(_128.xmlNode.childNodes.length==0){
this.removeGem(_128,true);
}
_129=dojo.string.substituteParams(cvCatalog.actionSHOW_ALL,this.getFieldLabel(_126,true));
}else{
var _12a=_127.caption;
var _12b;
if(_128){
_12b=this.reportDoc.getFilterProps(_128.xmlNode);
}else{
_12b={formula:_126,viewFilterEnum:"MULTIPLE"};
}
switch(type){
case "EXCLUDE":
if(!_12b.predicates){
var _12c=new dojo.collections.Dictionary();
var _12d=[];
_12d.push({ordinal:1,op:"NOT_EQUAL",members:[_127]});
_12c.add(1,_12d);
_12b.predicates=_12c;
}else{
var _12e=_12b.predicates.getKeyList();
var _12f=false;
var pred;
var _130;
for(var x=0;x<_12e.length;x++){
var _131=_12b.predicates.item(_12e[x]);
for(var j=0;j<_131.length;j++){
pred=_131[j];
if(pred.ordinal>_130){
_130=pred.ordinal+1;
}
if(pred.op=="NOT_EQUAL"){
pred.members.push(_127);
_12f=true;
break;
}
}
if(_12f){
break;
}
}
if(!_12f){
var _12d=[];
_12c=_12b.predicates;
var _132=_12b.predicates.getKeyList().length+1;
_12d.push({ordinal:_130,op:"NOT_EQUAL",members:[_127]});
_12c.add(_130,_12d);
}else{
if(pred.members.length>cvConst.MAX_FILTER_MEMBERS){
this.rptDlg.showError(["errprFilterMaxMembers",cvConst.MAX_FILTER_MEMBERS]);
return;
}
}
}
_129=dojo.string.substituteParams(cvCatalog.actionEXCLUDE,_12a);
break;
case "KEEP":
var _12c=new dojo.collections.Dictionary();
var _12d=[];
_12d.push({ordinal:1,op:"EQUAL",members:[_127]});
_12c.add(1,_12d);
_12b.predicates=_12c;
_129=dojo.string.substituteParams(cvCatalog.actionKEEP,_12a);
break;
case "KEEP_AND_DRILL":
var _133=cv.getFieldHelp().getDirectChild(_126);
if(_133){
var _12c=new dojo.collections.Dictionary();
var _12d=[];
_12d.push({ordinal:1,op:"EQUAL",members:[_127]});
_12c.add(1,_12d);
_12b.predicates=_12c;
this.insertGemInHierarchy(_133,null,true);
_129=dojo.string.substituteParams(cvCatalog.actionKEEP_AND_DRILL,_12a,this.getFieldLabel(_133,true));
}
break;
default:
return;
}
this.reportDoc.updateFilter(_12b);
}
if(!_125){
this.history.add(new cv.ReportState(_129));
this.openReport();
}
return _129;
},validateField:function(_134){
if(_134.indexOf("[MEASURE:")==0){
return true;
}
var _135=cv.getFieldHelp().get(_134);
if(!_135||cv.getFieldHelp().isHidden(_135)){
var i,_136=this.getFieldLabel(_134);
for(i=0;i<this.badFields.length;++i){
if(this.badFields[i]==_136){
break;
}
}
if(i==this.badFields.length){
this.badFields.push(_136);
}
return false;
}
return true;
},autoRefresh:function(){
if(this.mode=="VIEW"||this.mode=="MINI"){
return true;
}
if(this.history.isEmpty()){
return true;
}
if(!cv.prefs.autoRefresh){
if(this.nodeReportArea.lastChild.className!="autoRefreshDirtyPane"){
cv.util.show(this.nodeReportRefresh);
var div=document.createElement("div");
div.className="autoRefreshDirtyPane";
this.nodeReportArea.appendChild(div);
var _137=dojo.byId(this.progressPaneId);
cv.util.hide(_137);
this.statusBar.innerHTML="";
}
if(this.history.isStateRefreshed()){
this.nodeReportArea.removeChild(this.nodeReportArea.lastChild);
cv.util.hide(this.nodeReportRefresh);
}
}
return cv.prefs.autoRefresh;
},clickChart:function(_138){
for(var x=0;x<_138.length;x++){
var obj=_138[x];
if(obj.action=="KEEP"){
this.updateInTableFilter("KEEP",obj,true);
}else{
this.updateInTableFilter("KEEP_AND_DRILL",obj,true);
this.removeGem(this.getGem(obj.formula),null,null,true);
}
}
this.history.add(new cv.ReportState("Click on Chart"));
this.openReport();
}});
dojo.declare("cv.BaseGem",null,function(_139,_13a){
this.report=_13a;
},{type:null,htmlTemplate:null,commonCssClass:"dropZoneItem",cssClass:null,cssClassHover:null,popMenu:null,label:null,xmlNode:null,domNode:null,zone:null,getFormula:function(){
return this.xmlNode.getAttribute("formula");
},getUniqueId:function(){
return this.getFormula();
},getId:function(){
return this.domNode.id;
},getXmlAttributes:function(){
return this.xmlNode.attributes;
},getTagName:function(){
return this.xmlNode.tagName;
},getZoneId:function(){
return this.zone.id.substring(this.report.id.length);
},getName:function(_13b){
var _13c=cv.getFieldHelp().get(this.getFormula(),"displayLabel");
if(!_13c){
return "";
}
return _13b?_13c:dojo.string.escape("html",_13c);
},getNamePlural:function(_13d){
var _13e=cv.getFieldHelp().get(this.getFormula(),"displayLabelPlural");
if(!_13e){
return "";
}
return _13d?_13e:dojo.string.escape("html",_13e);
},getDisplayLabel:function(_13f,_140){
var node=_140?this.xmlNode.selectSingleNode("cv:displayLabels/cv:displayLabel[locale='"+_140+"']"):this.xmlNode.selectSingleNode("cv:displayLabels/cv:displayLabel");
var _141=(node&&node.getAttribute("label"))?node.getAttribute("label"):this.getName(true);
if(!_141){
return "";
}
return _13f?_141:dojo.string.escape("html",_141);
},getDisplayLabelPlural:function(_142,_143){
var node=_143?this.xmlNode.selectSingleNode("cv:displayLabels/cv:displayLabel[locale='"+_143+"']"):this.xmlNode.selectSingleNode("cv:displayLabels/cv:displayLabel");
var _144=(node&&node.getAttribute("labelPlural"))?node.getAttribute("labelPlural"):this.getNamePlural(true);
if(!_144){
return "";
}
return _142?_144:dojo.string.escape("html",_144);
},setDisplayLabel:function(_145,_146,_147){
this.report.reportDoc.updateDisplayLabel(this.xmlNode,_145,_146,_147);
this.updateDomNode();
},getCalculateSubtotalsUsingFormula:function(){
return this.xmlNode.getAttribute("calculateSubtotalsUsingFormula");
},setCalculateSubtotalsUsingFormula:function(_148){
this.report.reportDoc.updateCalculateSubtotalsUsingFormula(_148,this.xmlNode);
},isLast:function(){
var _149=this.xmlNode.parentNode.selectNodes("cv:"+this.xmlNode.tagName);
return _149[_149.length-1]==this.xmlNode;
},setXmlNode:function(_14a){
this.xmlNode=_14a;
if(_14a.parentNode){
this.zone=this.report.byId(_14a.parentNode.tagName);
}
},setSortOrder:function(_14b){
this.xmlNode.setAttribute("sortOrderEnum",(_14b=="ASC"||_14b=="DESC")?_14b:"NONE");
},getSortOrder:function(){
return this.xmlNode.getAttribute("sortOrderEnum");
},setZone:function(zone){
this.zone=dojo.lang.isString(zone)?this.report.byId(zone):zone;
},createDomNode:function(){
var node=document.createElement("div");
node.setAttribute("formula",this.getFormula());
node.id=this.getUniqueId();
dojo.html.addClass(node,this.commonCssClass);
dojo.html.addClass(node,this.cssClass);
dojo.event.connect(node,"oncontextmenu",this,"onContextMenu");
dojo.event.connect(node,"onmouseover",this,"onMouseOver");
dojo.event.connect(node,"onmouseout",this,"onMouseOut");
dojo.event.connect(node,"onclick",this,"onClick");
this.domNode=node;
this.updateDomNode();
},destroy:function(){
dojo.event.disconnect(this.domNode,"oncontextmenu",this,"onContextMenu");
dojo.event.disconnect(this.domNode,"onmouseover",this,"onMouseOver");
dojo.event.disconnect(this.domNode,"onmouseout",this,"onMouseOut");
dojo.event.disconnect(this.domNode,"onclick",this,"onClick");
this.domNode=null;
},update:function(){
},updateDomNode:function(){
var _14c=this.getDisplayLabel(true);
if(!_14c){
this.domNode.innerHTML=cvCatalog.missingFieldLabel;
return this.report.rptDlg.showError(["errorOutdatedReport",this.getFormula()]);
}
this.domNode.setAttribute("title",_14c);
this.domNode.innerHTML=dojo.string.substituteParams(this.htmlTemplate,dojo.string.escape("html",dojo.string.summary(_14c,16)));
},onContextMenu:function(e){
this.report.currentSelection=this;
var menu=cv.util.getDojoWidget(this.popMenu);
if(!menu){
return;
}
this.updatePopupMenu();
menu.open(e.clientX,e.clientY,this);
e.preventDefault();
e.stopPropagation();
},onMouseOver:function(e){
if(this.cssClassHover){
dojo.html.addClass(this.domNode,this.cssClassHover);
}
},onMouseOut:function(e){
if(this.cssClassHover){
dojo.html.removeClass(this.domNode,this.cssClassHover);
}
},onClick:function(e){
if(dojo.widget.PopupManager.currentMenu){
dojo.widget.PopupManager.currentMenu.close();
}
},updatePopupMenu:function(){
}});
currentGem=null;
dojo.declare("cv.AttributeGem",cv.BaseGem,function(_14d,_14e){
this.bad=!this.report.validateField(_14d.getAttribute("formula"));
if(this.bad){
cv.util.removeNode(_14d);
}else{
this.setXmlNode(_14d);
}
},{type:cvConst.TYPE_ATTRIBUTE,htmlTemplate:"<div class='gemLabel'>%{0}</div>",cssClass:"attributeItem",cssClassHover:"attributeItemHover",popMenu:"attributePopMenu",dndType:null,setZone:function(zone){
this.zone=dojo.lang.isString(zone)?this.report.byId(zone):zone;
if(this.domNode){
this.domNode.dndObj.type=this.dndType+this.report.dropTargets[this.getZoneId()].dndSuffix;
}
},createDomNode:function(){
cv.BaseGem.prototype.createDomNode.call(this);
this.dndType=cv.getFieldHelp().getDndType(this.getFormula());
this.domNode.dndObj=new dojo.dnd.HtmlDragSource(this.domNode,this.dndType+this.report.dropTargets[this.getZoneId()].dndSuffix);
},updatePopupMenu:function(){
var _14f=this.getSortOrder();
var _150=this.getFormula();
if(this.report.reportDoc.getSortedMetric()&&this.getZoneId()=="rowAttributes"&&this.isLast()){
_14f="NONE";
}
var _151=this.report.getGem("filter_"+_150);
cv.util.setMenuItem("PM:attrFilter",_151?"checked":"none",_151&&_151.isLocked(true)?"disabled":"enabled");
cv.util.setMenuItem("PM:attrFilterRank",this.report.reportDoc.isUsedByMetricFilter(_150,"RANK")?"checked":"none");
cv.util.setMenuItem("PM:attrSortAZ",_14f=="ASC"?"checked":"none");
cv.util.setMenuItem("PM:attrSortZA",_14f=="DESC"?"checked":"none");
var _152=!this.isLast();
cv.util.setMenuItem("PM:attrShowSub",_152&&this.xmlNode.getAttribute("showSubtotal")=="true"?"checked":"none",_152?"enabled":"disabled");
this._createHierarchyMenu();
this._createPropertiesMenu();
},_createHierarchyMenu:function(){
var _153=this.getFormula();
var heir=cv.getFieldHelp().getHierarchy(_153);
if(!heir||heir.length<=1){
cv.util.getDojoWidget("PM:addHier").setDisabled(true);
return;
}else{
cv.util.getDojoWidget("PM:addHier").setDisabled(false);
}
var _154=this.getZoneId();
var menu=dojo.widget.byId("hierarchyPopMenu");
if(menu){
menu.destroy();
}
menu=dojo.widget.createWidget("PopupMenu2",{id:"hierarchyPopMenu"},null);
for(var x=0;x<heir.length;++x){
var form=heir[x];
var disp=this.report.getFieldLabel(form);
if(!form||!disp){
continue;
}
var _155=(form==_153);
var mi;
if(form==_153){
mi=dojo.widget.createWidget("MenuItem2",{id:"HierPop:"+form,caption:disp,disabled:true});
}else{
if(this.report.getGem(form)){
mi=dojo.widget.createWidget("MenuItem2",{id:"HierPop:"+form,caption:disp,iconSrc:cv.contextPath+"images/checkmark.png"});
}else{
mi=dojo.widget.createWidget("MenuItem2",{id:"HierPop:"+form,caption:disp});
eval("mi.onClick = function() { cv.getActiveReport().insertGemInHierarchy('"+form+"','actionAdd'); }");
}
}
menu.addChild(mi);
}
document.body.appendChild(menu.domNode);
},_createPropertiesMenu:function(){
var _156=this.getFormula();
var _157=cv.getFieldHelp().getProperties(_156);
if(!_157||_157.length<1){
cv.util.getDojoWidget("PM:addProp").setDisabled(true);
return;
}else{
cv.util.getDojoWidget("PM:addProp").setDisabled(false);
}
var menu=dojo.widget.byId("propertiesPopMenu");
if(menu){
menu.destroy();
}
menu=dojo.widget.createWidget("PopupMenu2",{id:"propertiesPopMenu"},null);
currentGem=this;
var mi=dojo.widget.createWidget("MenuItem2",{id:"PropPop:AllMemberProps",caption:cvCatalog["memberPropertiesAddProps"]});
eval("mi.onClick = function() { currentGem.addAllProperties(); }");
menu.addChild(mi);
mi=dojo.widget.createWidget("MenuSeparator2");
menu.addChild(mi);
var _158=this.getProperties();
for(var x=0;x<_157.length;++x){
var prop=_157[x];
if(_158[prop]){
mi=dojo.widget.createWidget("MenuItem2",{id:"PropPop:"+prop,caption:prop,iconSrc:cv.contextPath+"images/checkmark.png"});
eval("mi.onClick = function() { currentGem.removeProperty('"+prop+"'); }");
}else{
mi=dojo.widget.createWidget("MenuItem2",{id:"PropPop:"+prop,caption:prop});
eval("mi.onClick = function() { currentGem.addProperty('"+prop+"'); }");
}
menu.addChild(mi);
}
},getProperties:function(){
var _159=this.xmlNode.selectNodes("cv:property");
var map={};
for(var x=0;x<_159.length;++x){
var name=_159[x].getAttribute("name");
map[name]=name;
}
return map;
},addProperty:function(name){
var _15a=this.getProperties();
if(_15a[name]){
return;
}
this.report.reportDoc.addMemberProperty(this.xmlNode,name);
this.report.history.add(new cv.ReportState("actionAdd",name));
this.report.refreshReport();
},addAllProperties:function(){
var _15b=cv.getFieldHelp().getProperties(this.getFormula());
var _15c=this.getProperties();
var _15d=false;
for(var x=0;x<_15b.length;++x){
var prop=_15b[x];
if(_15c[prop]){
continue;
}
_15d=true;
this.report.reportDoc.addMemberProperty(this.xmlNode,prop);
}
if(_15d){
this.report.history.add(new cv.ReportState("actionAdd",cvCatalog["memberPropertiesAddProps"]));
this.report.refreshReport();
}
},removeProperty:function(name){
var node=this.xmlNode.selectSingleNode("cv:property[@name='"+name+"']");
if(!node){
return;
}
cv.util.removeNode(node);
this.report.history.add(new cv.ReportState("actionRemove",name));
this.report.refreshReport();
},getLink:function(){
return this.xmlNode.selectSingleNode("cv:link");
},setLink:function(_15e,_15f){
var node=this.xmlNode.selectSingleNode("cv:link");
if(node){
cv.util.removeNode(node);
}
this.report.reportDoc.addLink(this.xmlNode,_15e,_15f);
},removeLink:function(){
var node=this.xmlNode.selectSingleNode("cv:link");
if(node){
cv.util.removeNode(node);
}
}});
dojo.declare("cv.MetricGem",cv.BaseGem,function(_160,_161){
var _162=_160.getAttribute("formula");
this.bad=_162?!this.report.validateField(_162):false;
if(!this.bad){
this.metricType=_160.getAttribute("measureTypeEnum");
if(this.isSummaryMetric()){
var _163=_160.selectSingleNode("cv:summaryFacet");
if(!_163||(_163.getAttribute("summaryAcrossEnum")=="LABEL"&&!this.report.validateField(_163.getAttribute("breakAttributeFormula")))){
this.bad=true;
}
}else{
if(this.metricType=="EXPRESSION"){
var _164=_160.selectSingleNode("cv:expression");
if(!_164){
this.bad=true;
}else{
var _165=cv.textContent(_164).match(/\[Measures\]\.\[[^\]]+\]/g);
if(_165){
for(var i=0;i<_165.length;++i){
if(!this.report.validateField(_165[i])){
this.bad=true;
break;
}
}
}
}
}else{
if(this.metricType=="TREND"){
var _166=_160.selectSingleNode("cv:trendFacet");
if(!_166||!this.report.validateField(_166.getAttribute("trendAttributeFormula"))){
this.bad=true;
}
}
}
}
}
if(this.bad){
cv.util.removeNode(_160);
}else{
this.id=_160.getAttribute("id");
if(!this.id){
this.id=this.report.reportDoc.getNextMetricId();
_160.setAttribute("id",this.id);
}
this.setXmlNode(_160);
}
},{type:cvConst.TYPE_METRIC,htmlTemplate:"<div class='gemLabel'>%{0}</div>",cssClass:"metricItem",cssClassHover:"metricItemHover",popMenuOrigin:"measurePopMenu",id:null,metricType:null,createDomNode:function(){
cv.BaseGem.prototype.createDomNode.call(this);
this.disable(this.report.getReportFormat()=="CHART"&&this.isHideInChart());
this.domNode.dndObj=new dojo.dnd.HtmlDragSource(this.domNode,"VM");
this.domNode.setAttribute("metrictype",this.metricType);
this.popMenu="measurePopMenu";
},getFormula:function(){
return (this.metricType=="VALUE"?this.xmlNode.getAttribute("formula"):this.id);
},getBaseFieldFormula:function(){
return (this.metricType=="EXPRESSION"?null:this.xmlNode.getAttribute("formula"));
},getId:function(){
return this.id;
},getUniqueId:function(){
return this.id;
},getDisplayLabel:function(_167,_168){
if(this.metricType=="VALUE"){
return cv.BaseGem.prototype.getDisplayLabel.call(this,_167,_168);
}
var node=this.xmlNode.selectSingleNode(_168?"cv:displayLabels/cv:displayLabel[locale='"+_168+"']":"cv:displayLabels/cv:displayLabel");
if(node&&node.getAttribute("label")){
return node.getAttribute("label");
}
var name;
if(this.metricType=="EXPRESSION"){
name=this.id;
}else{
name=cv.getFieldHelp().get(this.xmlNode.getAttribute("formula"),"displayLabel",!_167);
if(!name){
name=cvCatalog.missingFieldLabel;
}
}
return dojo.string.substituteParams(cvCatalog["metric"+this.metricType],name);
},update:function(_169){
if(this.isSummaryMetric()){
var _16a=this.xmlNode.selectSingleNode("cv:summaryFacet");
if(!_16a){
return false;
}
_16a.setAttribute("summaryAcrossEnum",_169.sumAcross);
_16a.setAttribute("useNonVisualTotals",_169.sumTotal);
if(_169.sumAcross=="LABEL"){
_16a.setAttribute("breakAttributeFormula",_169.sumBreakBy);
}else{
_16a.removeAttribute("breakAttributeFormula");
}
}else{
if(this.metricType=="EXPRESSION"){
cv.textContent(this.getMetricFacet(),_169.expression);
}else{
if(this.metricType=="TREND"){
var _16b=this.getMetricFacet();
_16b.setAttribute("trendTypeEnum",_169.trendType);
_16b.setAttribute("amount",_169.trendAmount);
_16b.setAttribute("trendDirectionEnum",_169.trendDir);
_16b.setAttribute("trendAttributeFormula",_169.trendField);
}
}
}
if(_169.label){
this.report.reportDoc.updateDisplayLabel(this.xmlNode,_169.label);
}
if(_169.numberFormat){
this.setNumberFormat(_169.numberFormat);
}
this.updateDomNode();
},updatePopupMenu:function(){
var _16c=this.getSortOrder();
var _16d=this.getFormula();
cv.util.setMenuItem("PM:measSortLowHi",_16c=="ASC"?"checked":"none");
cv.util.setMenuItem("PM:measSortHiLow",_16c=="DESC"?"checked":"none");
cv.util.setMenuItem("PM:measFilterCond",this.report.reportDoc.isUsedByMetricFilter(_16d,"CONDITIONS")?"checked":"none");
cv.util.setMenuItem("PM:measFilterRank",this.report.reportDoc.isUsedByMetricFilter(_16d,"RANK")?"checked":"none");
cv.util.setMenuItem("PM:helpMetric",null,(this.metricType=="VALUE"?"enabled":"disabled"));
cv.util.updateMenuItemCaption("PM:inChartHideMetric",this.isHideInChart()?"menuShowOnChart":"menuHideFromChart");
cv.util.getDojoWidget("newNumberMenu");
cv.util.displayWidget("PM:editMeasureSummary",this.isSummaryMetric());
cv.util.displayWidget("PM:editMeasureArith",this.metricType=="EXPRESSION");
cv.util.displayWidget("PM:editMeasureTrend",this.metricType=="TREND");
cv.util.displayWidget("menuSeparator",this.isSummaryMetric()||this.metricType=="TREND"||this.metricType=="EXPRESSION");
cv.util.getDojoWidget("condFormatMenu");
var _16e=this.getNumberFormat();
var _16f=["COLOR_SCALE_G_Y_R","COLOR_SCALE_R_Y_G","COLOR_SCALE_B_Y_R","COLOR_SCALE_R_Y_B","DATA_BAR_RED","DATA_BAR_GREEN","DATA_BAR_BLUE","TREND_ARROW_GR","TREND_ARROW_RG"];
var x;
for(x in _16f){
this._initCondFormatPopupMenu(_16f[x],_16e.formatShortcut);
}
},_initCondFormatPopupMenu:function(_170,_171){
var mi=cv.util.getDojoWidget("PM:condFormat_"+_170);
eval("mi.onClick = function() { cv.getActiveReport().onGemConditionalFormatting('"+_170+"'); }");
cv.util.setMenuItem("PM:condFormat_"+_170,_171==_170?"checked":"none");
},getNumberFormat:function(){
var _172=this.report.reportDoc.getNumberFormat(this.xmlNode);
if(!_172){
if(this.metricType=="VALUE"){
_172=cv.getFieldHelp().get(this.xmlNode.getAttribute("formula"),"format");
}else{
if(this.metricType=="PCTOF"||this.metricType=="PCTRSUM"){
_172={formatCategory:"Percentage (%)",formatScale:"2"};
}else{
_172={formatCategory:"General Number",formatScale:"0"};
}
}
_172.formatExpression="";
_172.formatShortcut="NONE";
}
return _172;
},setNumberFormat:function(_173){
this.report.reportDoc.setNumberFormat(this.xmlNode,_173);
},isSummaryMetric:function(){
return dojo.lang.inArray(["PCTOF","RSUM","PCTRSUM","RANK"],this.metricType);
},getMetricFacet:function(){
if(this.isSummaryMetric()){
return this.xmlNode.selectSingleNode("cv:summaryFacet");
}else{
if(this.metricType=="TREND"){
return this.xmlNode.selectSingleNode("cv:trendFacet");
}else{
if(this.metricType=="EXPRESSION"){
return this.xmlNode.selectSingleNode("cv:expression");
}
}
}
return null;
},isHideInChart:function(){
return this.xmlNode.getAttribute("hideInChart")=="true";
},disable:function(flag){
if(flag){
dojo.html.addClass(this.domNode,"metricDisabled");
this.popMenu="measureDisabledPopMenu";
}else{
dojo.html.removeClass(this.domNode,"metricDisabled");
this.popMenu=this.popMenuOrigin;
}
}});
dojo.declare("cv.FilterGem",cv.BaseGem,function(_174,_175,_176){
this.isNumeric=_176;
this.bad=!_175.validateField(_174.getAttribute("formula"));
if(!this.bad){
if(this.isNumeric){
var node,_177=_174.selectNodes("cv:conditions/cv:condition");
var len=_177.length;
for(var i=0;_177&&i<_177.length;++i){
node=_177[i];
if(!_175.validateField(node.getAttribute("formula"))){
cv.util.removeNode(node);
--len;
}
}
if(len==0&&_177.length>0){
_174.removeChild(_174.selectSingleNode("cv:conditions"));
}
node=_174.selectSingleNode("cv:topBottom");
if(node&&!_175.validateField(node.getAttribute("formula"))){
_174.removeChild(node);
node=null;
}
if(!node&&len==0){
this.bad=true;
}
}else{
var _177=_174.selectNodes("cv:predicates/cv:predicate");
if(!_177||_177.length==0){
this.bad=true;
}
var _178=cv.getFieldHelp().isTimeAttribute(_174.getAttribute("formula"));
for(var x=0;x<_177.length;++x){
var op=_177[x].getAttribute("operatorEnum");
var _179=_177[x].getAttribute("preset");
if((_178&&(op=="CONTAIN"||op=="NOT_CONTAIN"))||(!_178&&(_179||op=="BETWEEN"||op=="BEFORE"||op=="AFTER"))){
this.bad=true;
}
}
if(this.bad){
_175.badFilters=true;
}
}
}
if(this.bad){
cv.util.removeNode(_174);
}else{
this.setXmlNode(_174);
}
},{type:cvConst.TYPE_FILTER,htmlTemplate:cvCatalog.filterTemplate,cssClass:"filterItem",cssClassHover:null,popMenu:"filterPopMenu",itemCount:0,getUniqueId:function(){
return "filter_"+(this.isNumeric?"metric":this.getFormula());
},createDomNode:function(){
this.domNode=dojo.html.createNodesFromText(this.htmlTemplate)[0];
this.domNode.id=this.getUniqueId();
this.domNode.setAttribute("formula",this.getFormula());
this.updateDomNode();
dojo.event.connect(this.domNode,"oncontextmenu",this,"onContextMenu");
},updateDomNode:function(){
var _17a=this.isLocked(true);
var _17b=dojo.html.createNodesFromText(this.createSummary());
if(_17b&&_17b.length>0){
var dnd=cvConst.dndTypes["filters"];
for(var x=0;x<_17b.length;++x){
var node=_17b[x];
if(!_17a&&node.id&&dojo.html.hasClass(node,this.cssClass)){
node.dndObj=new dojo.dnd.HtmlDragSource(node,dnd);
}
this.domNode.appendChild(node);
}
}
if(_17a){
this.domNode.title="";
dojo.html.addClass(this.domNode,"lockedForUser");
}else{
if(this.isLocked()){
dojo.html.removeClass(this.domNode,"unlocked");
}else{
dojo.html.addClass(this.domNode,"unlocked");
}
}
},onContextMenu:function(e){
if(!this.report.currentSelection){
return;
}
var menu=cv.util.getDojoWidget(this.popMenu);
if(!menu){
return;
}
this.updatePopupMenu();
menu.open(e.clientX,e.clientY,this);
e.preventDefault();
e.stopPropagation();
},updatePopupMenu:function(){
var _17c=this.report.getFieldLabel(this.getFormula());
cv.util.updateMenuItemCaption("PM:toggleFilterLock",this.isLocked()?"menuFilterUnlock":"menuFilterLock",_17c);
cv.util.updateMenuItemCaption("PM:addFilter","menuAddFilter",_17c);
var _17d=this.isLocked(true);
cv.util.setMenuItem("PM:editFilter",null,_17d?"disabled":"enabled");
cv.util.setMenuItem("PM:removeFilter",null,_17d?"disabled":"enabled");
cv.util.setMenuItem("PM:addFilter",null,_17d?"disabled":"enabled");
cv.util.setMenuItem("PM:toggleFilterLock",null,this.report.createPAA?"enabled":"disabled");
if(!_17d){
cv.util.setMenuItem("PM:removeFilter",null,this.report.currentSelection.id?"enabled":"disabled");
}
},getViewType:function(){
return this.xmlNode.getAttribute("viewFilterEnum");
},setViewType:function(type){
this.xmlNode.setAttribute("viewFilterEnum",type);
if(type!="NONE"){
dojo.html.addClass(this.domNode,"unlocked");
}else{
dojo.html.removeClass(this.domNode,"unlocked");
}
},isLocked:function(_17e){
return !(_17e&&this.report.createPAA)&&!this.isNumeric&&this.getViewType()=="NONE";
},createSummary:function(_17f){
var str="",attr=this.report.getFieldLabel(this.getFormula());
if(this.isNumeric){
this.itemCount=1;
var node,_180=this.xmlNode.selectNodes("cv:conditions/cv:condition");
for(var i=0;_180&&i<_180.length;++i){
node=_180[i];
str+="<div class='filterItemList'>"+dojo.string.substituteParams(cvCatalog["filterSummMetric"+node.getAttribute("operator")],{METRIC:this.report.getFieldLabel(node.getAttribute("formula")),OP1:node.getAttribute("op1"),OP2:node.getAttribute("op2"),ATTR:attr})+"</div>";
}
node=this.xmlNode.selectSingleNode("cv:topBottom");
if(node){
str+="<div class='filterItemList'>"+dojo.string.substituteParams(cvCatalog["filterSummMetric"+node.getAttribute("type")],{METRIC:this.report.getFieldLabel(node.getAttribute("formula")),COUNT:node.getAttribute("count"),ATTR:attr})+"</div>";
}
if(this.isNumeric){
str=dojo.string.substituteParams(cvCatalog.filterTemplateMetric,this.getFormula(),str);
}
}else{
var _180=this.xmlNode.selectNodes("cv:predicates/cv:predicate");
var _181=new dojo.collections.Dictionary();
var _182;
for(var x=0;x<_180.length;++x){
var _183=this._createPredicateSummary(_180[x]).split("`");
_182=_180[x].getAttribute("ordinal");
if(_181.contains(_182)){
for(var i=0;i<_183.length;++i){
_181.item(_182).labels.push(_183[i]);
}
}else{
_181.add(_182,{operatorEnum:_180[x].getAttribute("operatorEnum"),labels:_183});
}
}
var _184=_181.getKeyList();
var _185=_184.length;
this.itemCount=_185;
if(_180.length==0){
return cvCatalog.filterTemplateNone;
}
if(!_17f&&_185>1){
str+=dojo.string.substituteParams(cvCatalog.filterTemplateMultiLine,attr);
}
for(var x=0;x<_184.length;x++){
var _186="";
var _187=_181.item(_184[x]).labels;
for(var j=0;j<_187.length;j++){
if(j>0){
if(j==_187.length-1){
if(_186.indexOf("<a")>-1){
_186+=", "+_187[j].replace("includes","");
}else{
var _188=_181.item(_184[x]).operatorEnum;
var _189=" and ";
if(_188=="NOT_CONTAIN"||_188=="CONTAIN"){
_189=" or ";
}
_186+=_189+_187[j].replace("includes","");
}
}else{
_186+=", "+_187[j].replace("includes","");
}
}else{
_186=_187[j];
}
}
if(!_17f&&_185==1){
str+=dojo.string.substituteParams(cvCatalog.filterTemplateSingleLine,this.getFormula(),"filter_"+this.getFormula()+"_"+_184[x],attr,_186);
}else{
str+=dojo.string.substituteParams(cvCatalog.filterTemplateAttr,this.getFormula(),"filter_"+this.getFormula()+"_"+_184[x],_186);
}
}
}
return str;
},_createPredicateSummary:function(node){
var val="",val1="",op=node.getAttribute("operatorEnum");
var mems=node.selectNodes("cv:member");
var help=cv.getFieldHelp().get(this.getFormula());
var _18a;
for(var y=0;mems.length>0&&y<mems.length;++y){
var _18b=mems[y].getAttribute("formula");
if(!_18b){
if(y>0){
_18a+=","+mems[y].getAttribute("pos");
}else{
_18a=mems[y].getAttribute("pos");
}
}
}
switch(op){
case "EQUAL":
case "NOT_EQUAL":
if(_18a){
if(!help){
return "ERROR";
}
var _18c=cv.getFieldHelp().get(help,"type");
var apos=_18a.split(",");
for(var x=0;x<apos.length;++x){
if(x>0){
val+="`";
}
if(_18c=="TIME_DATE"){
val+=cvCatalog["filterPreset"+cv.getFieldHelp().get(help,"type")+"_"+apos[x].replace(",","a").replace("-","n")];
}else{
val+=cvCatalog["filterSummR_3_"+apos[x].replace("-","n")];
}
}
val=dojo.string.substituteParams(val,this.report.getFieldLabel(this.getFormula()));
}else{
if(mems.length==0){
return cvCatalog.filterTemplateNone;
}else{
if(mems.length<5){
for(var x=0;x<mems.length;++x){
val+=(x>0?"` ":"")+dojo.string.escape("HTML",mems[x].getAttribute("caption"));
}
}else{
val=dojo.string.substituteParams(cvCatalog.filterSummSimple,dojo.string.escape("js",this.getFormula()),node.getAttribute("ordinal"),mems.length);
}
}
}
break;
case "CONTAIN":
case "NOT_CONTAIN":
var exp=node.selectNodes("cv:containsExpression");
if(!exp||exp.length==0){
return cvCatalog.filterTemplateNone;
}else{
for(var x=0;x<exp.length;++x){
val+=(x>0?"` ":"")+dojo.string.escape("HTML",cv.textContent(exp[x]));
}
}
break;
case "BETWEEN":
val1=dojo.string.escape("HTML",mems[1].getAttribute("caption"));
case "BEFORE":
case "AFTER":
val=dojo.string.escape("HTML",mems[0].getAttribute("caption"));
break;
case "TIME_AHEAD":
case "TIME_AGO":
case "TIME_RANGE_NEXT":
case "TIME_RANGE_PREV":
val=_18a;
val1=this.report.getFieldLabel(this.getFormula());
break;
case "TIME_YAGO":
val1=this.report.getFieldLabel(this.getFormula());
return dojo.string.substituteParams(cvCatalog["filterSumm"+op],val1);
default:
val=dojo.string.escape("HTML",mems[0].getAttribute("caption"));
break;
}
return dojo.string.substituteParams(cvCatalog["filterSumm"+op],val,val1);
}});
dojo.declare("cv.ReportDialog",cv.Dialog,function(_18d){
this.report=_18d;
this.dlgTemplates={reportOpt_edit:"reportOptionsDlg.html",report_rename:"saveReportDlg.html",report_props:"reportPropsDlg.html",report_xml:"reportDefDlg.html",measures_subtotal:"measureDlg.html",measures_summaries:"summaryMetricsDlg.html",summary_new:"singleSummaryDlg.html",summary_edit:"singleSummaryDlg.html",measures_arith:"arithNumberDlg.html",measures_trend:"trendNumberDlg.html",arith_edit:"arithNumberDlg.html",trend_edit:"trendNumberDlg.html",gem_edit:"editGemDlg.html",filter_list:"filterListDlg.html",fieldHelp_show:"fieldHelpDlg.html",propHelp_show:"fieldHelpDlg.html",report_csv_download:"reportCSVDownloadDlg.html"};
this.prefixes={reportOpt_edit:"RO_",report_props:"RP_",report_xml:"RD_",measures_subtotal:"VF_",measures_summaries:"SM_",summary_edit:"SM_",summary_new:"SM_",measures_arith:"MA_",measures_trend:"MT_",arith_edit:"MA_",trend_edit:"MT_",gem_edit:"ED_",filter_list:"FT_",fieldHelp_show:"FH_",propHelp_show:"FH_",gadget_displaying:"GD_"};
this.helpTopics={reportOpt_edit:"CV/Business_User/setting_report_preferences.html",report_props:"",report_xml:"",measures_subtotal:"CV/Business_User/working_with_calculations.html#displaying_totals_as_averages_max",measures_summaries:"CV/Business_User/working_with_calculations.html#displaying_percent_rank_etc",summary_edit:"CV/Business_User/working_with_calculations.html#",summary_new:"CV/Business_User/working_with_calculations.html#",measures_arith:"CV/Business_User/working_with_calculations.html#",measures_trend:"CV/Business_User/working_with_calculations.html#",arith_edit:"CV/Business_User/working_with_calculations.html#",trend_edit:"CV/Business_User/working_with_calculations.html#",gem_edit:"CV/Business_User/working_with_fields.html#renaming_a_field",filter_list:"CV/Business_User/working_with_filters.html#filters_on_text_fields",fieldHelp_show:"CV/Business_User/working_with_fields.html#viewing_the_definition_of_a_field",gadget_displaying:""};
this.src=null;
this.dataSource=null;
},{destroy:function(){
this.src=null;
this.dataSource=null;
},show:function(_18e,src,_18f){
this.dataSource=this.report.currentSelection;
var _190=this.report.reportDoc;
if(src){
this.src=src;
}else{
if(this.dataSource&&this.dataSource.getZoneId){
this.src=this.dataSource.getZoneId();
}
}
this.type=this.src+"_"+_18e;
this.param=_18f;
this.prefix=this.prefixes[this.type];
this.dlgTemplate=this.dlgTemplates[this.type];
this.helpTopic=this.helpTopics[this.type];
this.defaultFocus=null;
var _191=this;
switch(this.type){
case "reportOpt_edit":
if(!this.load()){
break;
}
var attr=_190.getReportOptions();
for(var x=0,y=attr.length;attr!=null&&x<y;++x){
this.updateHtml(attr[x].name,attr[x].value);
}
if(!this.report.createPAA){
this.byId("useNonVisualTotals").disabled=true;
}
cv.util.setHelpTopics(["RO_helpNonVisualTotal","CV/Business_User/working_with_calculations.html#non_visual_totals"]);
this.defaultFocus=this.byId("showEmptyCells");
break;
case "report_props":
if(!this.loadRptProps()){
break;
}
var _192=this.report.getReportProperties();
for(var x in _192){
var node=this.byId(x);
if(!node){
continue;
}
if(node.tagName=="INPUT"||node.tagName=="TEXTAREA"){
node.value=_192[x];
}else{
node.innerHTML=dojo.string.escape("html",_192[x]);
}
if(x=="description"&&_192[x]==""){
if(node.tagName=="INPUT"||node.tagName=="TEXTAREA"){
node.value="No Description";
}else{
node.innerHTML=dojo.string.escape("html","No Description");
}
}
if(x=="created"||x=="update"){
if(_192[x]!=null&&_192[x]!=""){
var _193=cv.util.formatDateString(_192[x]);
node.innerHTML=dojo.string.escape("html",_193);
}
}
if(x=="folder"){
if(_192[x].substring(0,1)=="/"){
node.innerHTML=_192[x].substring(1);
}
}
}
break;
case "report_xml":
if(!this.load()){
break;
}
this.byId("reportDef").value=dojo.dom.innerXML(_190.getReportNode());
break;
case "measures_subtotal":
if(!this.dataSource){
return;
}
if(!this.load(this.dataSource.getDisplayLabel())){
break;
}
var attr=this.dataSource.getXmlAttributes();
for(var x=0,y=attr.length;attr!=null&&x<y;++x){
this.updateHtml(attr[x].name,attr[x].value);
}
this.defaultFocus=this.byId("showSum");
dojo.event.connect(this.byId("showSumTD"),"onclick",function(){
dojo.byId("VF_showSum").checked=!dojo.byId("VF_showSum").checked;
});
dojo.event.connect(this.byId("showAggregateTD"),"onclick",function(){
dojo.byId("VF_showAggregate").checked=!dojo.byId("VF_showAggregate").checked;
});
dojo.event.connect(this.byId("showAverageTD"),"onclick",function(){
dojo.byId("VF_showAverage").checked=!dojo.byId("VF_showAverage").checked;
});
dojo.event.connect(this.byId("showMaxTD"),"onclick",function(){
dojo.byId("VF_showMax").checked=!dojo.byId("VF_showMax").checked;
});
dojo.event.connect(this.byId("showMinTD"),"onclick",function(){
dojo.byId("VF_showMin").checked=!dojo.byId("VF_showMin").checked;
});
break;
case "measures_summaries":
if(!this.dataSource||!this.load(this.dataSource.getDisplayLabel())){
break;
}
if(this.param){
this.defaultFocus=this.byId(this.param);
}else{
this.defaultFocus=this.byId("PCTOF");
}
this.defaultFocus.checked=true;
break;
case "summary_new":
if(!this.dataSource){
return;
}
var _194=this.dataSource.getDisplayLabel();
if(!this.load(cvCatalog.summaryMetricTitle,_194)){
break;
}
var cat=this.byId("formatCategory"),_195=this.byId("formatScale");
this.byId("name").value=this._getUniqueLabel(dojo.string.substituteParams(cvCatalog["metric"+_18f],_194));
if(_18f=="PCTOF"||_18f=="PCTRSUM"||_18f=="RSUM"){
if(_18f=="RSUM"){
cat.value=this.dataSource.getNumberFormat().formatCategory;
}else{
cat.value="Percentage (%)";
}
_195.value="2";
}
dojo.html.setClass(this.byId(_18f),"summaryOption");
var _196=this.byId("field_"+_18f);
if(!this.report.addOptionsForAttributes(_196,true)){
_196.disabled=true;
this.byId("LABEL_"+_18f).disabled=true;
}
dojo.event.connect(dojo.byId("dlgBtnPrev"),"onclick",function(){
_191.show("summaries",null,_191.param);
});
if(_190.getReportOption("useNonVisualTotals")=="true"){
this.displayMsg(cvCatalog.dlgInfoNonvisualTotal);
}
this.helpTopic+=_18f;
this.defaultFocus=this.byId("ROWS_"+_18f);
break;
case "summary_edit":
if(!this.dataSource){
return;
}
var _197=this.dataSource.metricType;
var _198=this.dataSource.getDisplayLabel();
if(!this.load(cvCatalog.summaryMetricEditTitle,this.report.getFieldLabel(this.dataSource.getBaseFieldFormula()))){
break;
}
this.byId("name").value=_198;
this._updateNumberFormat(this.dataSource,true);
dojo.html.setClass(this.byId(_197),"summaryOption");
var _196=this.byId("field_"+_197);
if(!this.report.addOptionsForAttributes(_196,true)){
_196.disabled=true;
this.byId("LABEL_"+_197).disabled=true;
}
var _199=this.dataSource.getMetricFacet();
var _19a=_199.getAttribute("summaryAcrossEnum");
this.updateHtml("RD_"+_197,_19a);
if(_19a=="LABEL"){
this.updateHtml(_196,_199.getAttribute("breakAttributeFormula"));
}
if(_190.getReportOption("useNonVisualTotals")=="true"){
this.displayMsg(cvCatalog.dlgInfoNonvisualTotal);
}
this.helpTopic+=_197;
this.defaultFocus=this.byId("ROWS_"+_197);
var btn=dojo.byId("dlgBtnPrev");
if(btn){
dojo.html.hide(btn);
}
btn=dojo.byId("dlgBtnSave");
if(btn){
btn.innerHTML="OK";
}
break;
case "measures_arith":
case "arith_edit":
if(!this.load()){
break;
}
var _19b=this.byId("measures");
_19b.selectedIndex=-1;
var ops=this.byId("ops").childNodes;
var _19c=this.byId("content");
var _19d=false;
function _19e(obj,_19f){
var _1a0=0,end=0;
if(typeof (obj.selectionStart)=="number"){
_1a0=obj.selectionStart;
end=obj.selectionEnd;
obj.value=obj.value.slice(0,_1a0)+_19f+obj.value.slice(end);
}else{
if(document.selection){
if(!_19d){
var e=event.srcElement;
var r=obj.createTextRange();
r.moveStart("character",obj.value.length);
r.collapse(true);
r.select();
}
obj.focus();
var _1a1=document.selection.createRange();
_1a1.text=_19f;
}
}
};
function _1a2(e){
var src=e.target;
if(!src){
return true;
}
if(src.tagName=="INPUT"&&src.type=="button"){
if(src.value.length==1){
_19e(_19c,src.value);
}else{
if(src.id==_191.prefix+"clear"){
_19c.value="";
}
}
e.preventDefault();
}else{
if(src.id==_191.prefix+"measures"||src.id==_191.prefix+"addField"||src.tagName=="OPTION"){
if(_19b.options[_19b.selectedIndex].value!=""){
_19e(_19c,"["+_19b.options[_19b.selectedIndex].text+"]");
}
}else{
if(src.id==_191.prefix+"content"){
_19d=true;
}
}
}
_19c.focus();
return false;
};
for(var x=0;x<ops.length;++x){
if(ops[x].tagName=="INPUT"&&ops[x].type=="button"){
dojo.event.connect(ops[x],"onclick",_1a2);
}
}
dojo.event.connect(this.byId("addField"),"onclick",_1a2);
dojo.event.connect(_19b,"ondblclick",_1a2);
dojo.event.connect(this.byId("clear"),"onclick",_1a2);
dojo.event.connect(this.byId("content"),"onclick",_1a2);
cv.util.setHelpTopics(["helpCalculateSubtotals","CV/Business_User/working_with_calculations.html#subtotal_calculation"]);
this.helpTopic+="creating_new_numbers";
if(this.type=="arith_edit"){
this.dataSourceOrigin={};
this.report.addOptionsForAllMeasures(_19b,true,this.dataSource.getId(),true);
this.dataSourceOrigin.label=this.byId("name").value=this.dataSource.getDisplayLabel(true);
this.dataSourceOrigin.numberFormat=this._updateNumberFormat(this.dataSource,true);
this.dataSourceOrigin.expression=cv.textContent(this.dataSource.getMetricFacet());
_19c.value=this._transformArithExpression(this.dataSourceOrigin.expression,false);
this.byId("calculateSubtotalsUsingFormula").checked=(this.dataSource.getCalculateSubtotalsUsingFormula()=="true");
dojo.byId("dialogTitleText").innerHTML=cvCatalog.calculatedEditTitle;
}else{
this._updateNumberFormatAndDecimalPlacesDropdown();
dojo.byId("MA_name").value="";
this.report.addOptionsForAllMeasures(_19b,true,null,true);
_19b.value=this.dataSource.getFormula();
_19c.value+="["+_19b.options[_19b.selectedIndex].text+"]";
this.refGem=this.dataSource;
this.dataSource=null;
}
break;
case "measures_trend":
case "trend_edit":
if(!this.dataSource){
return;
}
var _1a3=this.report.reportDoc.getChildMembers("columnAttributes","rowAttributes"),_1a4=[];
if(_1a3){
for(var x=0;x<_1a3.length;++x){
var attr=_1a3[x].getAttribute("formula");
var hier=cv.getFieldHelp().getHierarchy(attr,false,true);
if(hier){
for(var y=0;y<hier.length;++y){
if(!dojo.lang.inArray(_1a4,hier[y])){
_1a4.push(hier[y]);
}
}
}else{
if(!dojo.lang.inArray(_1a4,attr)){
_1a4.push(attr);
}
}
}
}
if(_1a4.length==0){
this.showError("errorNoFieldForTrend");
return;
}
if(this.type=="trend_edit"){
if(!this.load(this.report.getFieldLabel(this.dataSource.getBaseFieldFormula()))){
break;
}
}else{
if(!this.load(this.dataSource.getDisplayLabel())){
break;
}
}
var _1a5=this.byId("trendFields");
_1a5.innerHTML="";
for(var x=0;x<_1a4.length;++x){
var f=_1a4[x];
cv.addOption(_1a5,new Option(this.report.getFieldLabel(f,true),f));
}
this._updateNumberFormat(this.dataSource,true);
if(this.type=="trend_edit"){
dojo.byId("dialogTitleText").innerHTML=cvCatalog.trendNumberEditTitle;
this.byId("name").value=this.dataSource.getDisplayLabel(true);
var _1a6=this.dataSource.getMetricFacet();
this.updateHtml("trendType",_1a6.getAttribute("trendTypeEnum"));
this.updateHtml("amount",_1a6.getAttribute("amount"));
this.updateHtml("trendFields",_1a6.getAttribute("trendAttributeFormula"));
}else{
this.baseGemFormat=this.dataSource.getNumberFormat().formatCategory;
this.byId("formatScale").value="2";
}
function _1a7(e){
var _1a8=_191.dataSource;
if(_191.type=="trend_edit"){
_1a8=_191.report.getGem(_191.dataSource.xmlNode.getAttribute("formula"));
}
_191.byId("formatCategory").value=(e.target.value=="PCT_CHANGE")?"Percentage (%)":_1a8.getNumberFormat().formatCategory;
};
dojo.event.connect(this.byId("trendType"),"onchange",_1a7);
break;
case "gem_edit":
if(!this.dataSource){
return;
}
var _198=this.dataSource.getDisplayLabel();
if(this.dataSource.metricType){
if(!this.load(cvCatalog.editColumn)){
break;
}
}else{
if(!this.load(_198)){
break;
}
}
this.byId("name").innerHTML=this.dataSource.getName();
var _1a9=this.byId("displayLabel");
_1a9.value=this.dataSource.getDisplayLabel(true);
if(this.dataSource.metricType){
cv.util.hide("ED_pluralNameRow");
cv.util.hide("ED_pluralLabelRow");
this.dataSourceOrigin={};
this.dataSourceOrigin.numberFormat=this._updateNumberFormat(this.dataSource,true);
this.byId("nameTD").style.width="150px";
if(this.dataSource.metricType!="VALUE"){
cv.util.hide("ED_nameRow");
cv.util.hide("blankRow");
}
function _1aa(e){
var _1ab=_191.byId("formatCategory");
if(_1ab.value=="Expression"){
_191.byId("formatScale").disabled=true;
var _1ac=_191.byId("formatExpression");
_1ac.disabled=false;
if(_1ac.value==""){
_1ac.value=cvConst.defaultFormatExp;
}
}else{
if(_1ab.value=="Default"){
_191.byId("formatScale").disabled=true;
_191.byId("formatExpression").disabled=true;
}else{
_191.byId("formatScale").disabled=false;
_191.byId("formatExpression").disabled=true;
}
}
};
dojo.event.connect(this.byId("formatCategory"),"onchange",_1aa);
_1aa();
}else{
this.byId("namePlural").innerHTML=this.dataSource.getNamePlural();
this.byId("displayLabelPlural").value=this.dataSource.getDisplayLabelPlural(true);
cv.util.hide("ED_formatRow","ED_formatExpRow");
}
this.defaultFocus=_1a9;
break;
case "filter_list":
var gem=this.report.getGem("filter_"+_18f);
if(!gem){
return this.report.filterDlg.show(_18f);
}
if(gem.itemCount==1){
return this.report.filterDlg.show(_18f,1);
}
if(!this.load(this.report.getFieldLabel(_18f),dojo.string.escape("HTML",_18f))){
break;
}
var list=this.byId("predicateList");
list.innerHTML=gem.createSummary(true);
break;
case "fieldHelp_show":
var fh=cv.getFieldHelp();
var node=fh.get(_18f);
var _1ad=fh.get(node,"displayLabelOriginal",true);
if(!_1ad){
_1ad="&nbsp;";
}
var _1ae=this.report.getFieldLabel(_18f);
var _198=fh.get(node,"displayLabel",true);
if(!this.load(_1ae,_198,_1ad)){
break;
}
if(_1ae!=_198){
cv.util.show("FH_customLabel");
}
if(_1ad!="nbsp;"&&_1ad!=_198&&cv.prefs.isAdmin){
cv.util.show("FH_name");
}
var desc=fh.get(node,"displayDescription",true);
if(desc){
this.updateHtml("displayDescription",desc);
}
this.updateHtml("formula",_18f);
this.updateHtml("type",cvCatalog["fieldTypes_"+fh.get(node,"type")]);
var _192=cv.getFieldHelp().getProperties(_18f);
if(_192&&_192.length>1){
var desc="";
cv.util.show("FH_memberProperties");
for(var x=0;x<_192.length;++x){
var prop=_192[x];
if(x!=0){
desc+=", ";
}
desc+=prop;
}
this.updateHtml("memberPropertiesDescription",desc);
}
break;
case "propHelp_show":
var _1af=this.dataSource.getAttribute("formula");
var name=this.dataSource.getAttribute("name");
var fh=cv.getFieldHelp();
var node=fh.get(_1af);
var _198=this.report.getFieldLabel(_1af);
if(!_198){
_198=fh.get(node,"displayLabel",true);
}
if(!this.load(name,name,name)){
break;
}
this.updateHtml("displayDescription",dojo.string.substituteParams(cvCatalog["memberPropertyHelp"],name,_198));
this.updateHtml("type",cvCatalog["fieldTypes_PROPERTY"]);
break;
case "report_csv_download":
if(!this.load()){
break;
}
break;
default:
return;
}
if(this.status){
this.report.showReportStatus(this.status);
return;
}
this.showDialog();
this.lastSaveTime=null;
},save:function(){
var _1b0=this.report.reportDoc;
var els=this.theForm.elements;
var _1b1=true;
switch(this.type){
case "reportOpt_edit":
for(var x=0;x<els.length;++x){
if(els[x].tagName=="INPUT"){
this.updateXml(_1b0.getReportNode(),els[x]);
}
}
this.report.history.add(new cv.ReportState("actionReportOptions"));
break;
case "report_props":
this.report.setReportProperties({description:this.byId("description").value});
_1b1=false;
break;
case "report_xml":
var doc=dojo.dom.createDocumentFromText(this.byId("reportDef").value);
if(!doc||!doc.documentElement||doc.documentElement.tagName!="report"){
return this.displayError(cvCatalog.errorReportDefinition);
}
try{
this.report.openReport(doc.documentElement,true);
}
catch(e){
this.report.history.current().exec(true);
return this.displayError(cvCatalog.errorReportDefinition);
}
this.report.history.add(new cv.ReportState("actionImport"));
break;
case "measures_subtotal":
for(var x=0;this.dataSource!=null&&x<els.length;++x){
if(els[x].tagName=="INPUT"){
this.updateXml(this.dataSource.xmlNode,els[x]);
}
}
this.report.history.add(new cv.ReportState("actionEdit",this.dataSource.getDisplayLabel(true)));
break;
case "measures_summaries":
var _1b2=this.getRadioGroupValue(this.prefix+"Group");
if(!_1b2){
_1b1=false;
break;
}
return this.show("new","summary",_1b2);
case "summary_new":
var _1b3=dojo.string.trim(this.byId("name").value);
var gem=this.report.createSpecialMetricGem({zoneId:"measures",formula:this.dataSource.getFormula(),metricType:this.param,sumAcross:this.getRadioGroupValue(this.prefix+"RD_"+this.param),sumTotal:"false",sumBreakBy:this.byId("field_"+this.param).value,refGem:this.dataSource});
this._updateNumberFormat(gem);
gem.setDisplayLabel(_1b3);
this.report.history.add(new cv.ReportState("actionAdd",_1b3));
break;
case "summary_edit":
var _1b3=dojo.string.trim(this.byId("name").value);
var _1b2=this.dataSource.metricType;
var _1b4=this.getRadioGroupValue(this.prefix+"RD_"+_1b2);
var _1b5={sumAcross:_1b4,sumBreakBy:this.byId("field_"+_1b2).value,sumTotal:"false"};
this.dataSource.update(_1b5);
this._updateNumberFormat(this.dataSource);
this.dataSource.setDisplayLabel(_1b3);
if(_1b0.isUsedByMetricFilter(this.dataSource.getFormula())){
this.report.populateFilters();
}
this.report.history.add(new cv.ReportState("actionEdit",_1b3));
break;
case "measures_arith":
case "arith_edit":
_1b3=dojo.string.trim(this.byId("name").value);
if(!this._validateName()){
return false;
}
if(!this._validateNumberFormatAndDecimalPlaces()){
return false;
}
var _1b6=this._transformArithExpression(this.byId("content").value,true);
if(this.dataSource){
this.dataSource.update({expression:_1b6});
}else{
this.dataSource=this.report.createSpecialMetricGem({zoneId:"measures",metricType:"EXPRESSION",formula:null,expression:_1b6,refGem:this.refGem});
}
this.dataSource.setDisplayLabel(_1b3);
this._updateNumberFormat(this.dataSource);
this.dataSource.setCalculateSubtotalsUsingFormula(this.byId("calculateSubtotalsUsingFormula").checked?"true":"false");
var msg=cv.util.parseAjaxMsg(cv.io.ajaxLoad("ajax/validateCalculatedMeasure",{reportXML:this.report.getReportXml(),measureId:this.dataSource.getId()},true));
if(msg&&msg.type=="error"){
return this.displayError(msg.details?msg.details:cvCatalog.dlgErrGeneric);
}
this.report.history.add(new cv.ReportState(this.type=="arith_edit"?"actionEdit":"actionAdd",_1b3));
this.report.addToCheckFieldList(this.dataSource.getId(),true);
if(this.type=="arith_edit"&&_1b0.isUsedByMetricFilter(this.dataSource.getFormula())){
this.report.populateFilters();
}
break;
case "measures_trend":
case "trend_edit":
var _1b5={zoneId:"measures",metricType:"TREND",formula:this.dataSource.getFormula(),trendType:this.byId("trendType").value,trendDir:this.byId("direction").value,trendAmount:this.byId("amount").value,trendField:this.byId("trendFields").value,refGem:this.dataSource};
var heir=cv.getFieldHelp().getHierarchy(_1b5.trendField);
if(heir){
for(var x=dojo.lang.indexOf(heir,_1b5.trendField)+1;x<heir.length;++x){
if(!this.report.getGem(heir[x])&&this.report.getGem("filter_"+heir[x])){
this.showError(["errorAddTrendWithFilterOnChild",this.report.getFieldLabel(heir[x]),this.report.getFieldLabel(_1b5.trendField)]);
return false;
}
}
}
if(!this._validateName()){
this.byId("name").focus();
return false;
}
var err=this._validateAmountField(_1b5.trendAmount);
if(err){
this.displayMsg(cvCatalog[err]);
this.byId("amount").focus();
return false;
}
var _1b7;
if(this.type=="trend_edit"){
this.dataSource.update(_1b5);
_1b7="actionEdit";
}else{
this.dataSource=this.report.createSpecialMetricGem(_1b5);
_1b7="actionAdd";
}
var _1b3=dojo.string.trim(this.byId("name").value);
this.dataSource.setDisplayLabel(_1b3);
this._updateNumberFormat(this.dataSource);
this.report.history.add(new cv.ReportState(_1b7,_1b3));
if(this.type=="trend_edit"&&_1b0.isUsedByMetricFilter(this.dataSource.getFormula())){
this.report.populateFilters();
}
break;
case "gem_edit":
if(this.dataSource.metricType){
this._updateNumberFormat(this.dataSource);
if(this.byId("formatCategory").value=="Expression"){
if(this.byId("formatExpression").value==""){
return this.displayError("Format expression cannot be empty.");
}
var msg=cv.util.parseAjaxMsg(cv.io.ajaxLoad("ajax/parseReport",{reportXML:this.report.getReportXml()},true));
if(msg&&msg.type=="error"){
return this.displayError(msg.details?msg.details:cvCatalog.dlgErrGeneric);
}
}
}
this.dataSource.setDisplayLabel(dojo.string.trim(this.byId("displayLabel").value),dojo.string.trim(this.byId("displayLabelPlural").value));
this.report.populateFilters();
this.report.history.add(new cv.ReportState("actionRename"));
break;
case "report_csv_download":
cv.io.getReportInFormat(this.report.getReportXml(),"CSV",dojo.byId("CSV_includeSubtotals").checked,dojo.byId("CSV_keepNumberFormatting").checked,this.report.isDirty());
_1b1=false;
break;
default:
_1b1=false;
break;
}
cv.dlgWidget.hide();
if(_1b1&&this.report.reportStatus!="errorReportDefinition"){
this.report.refreshReport();
}
},cancel:function(){
switch(this.type){
case "measures_arith":
if(this.dataSource){
this.report.gemList.remove(this.dataSource.getId());
cv.util.removeNode(this.dataSource.xmlNode);
this.dataSource.zone.removeChild(this.dataSource.domNode);
}
break;
case "arith_edit":
this.dataSource.update(this.dataSourceOrigin);
break;
case "gem_edit":
if(this.dataSource.metricType){
this.dataSource.setNumberFormat(this.dataSourceOrigin.numberFormat);
}
break;
}
cv.Dialog.prototype.cancel.call(this);
},showEditColumn:function(){
this.show("edit","gem");
},showEditSummaryMeasure:function(){
this.show("edit","summary");
},showEditArithMeasure:function(){
this.show("edit","arith");
},showEditTrendMeasure:function(){
this.show("edit","trend");
},showReplaceAttribute:function(){
this.show("replace","attribute");
},showSaveReport:function(){
this.show("save","report");
},showRenameReport:function(){
this.show("rename","report");
},showReportOptions:function(){
this.show("edit","reportOpt");
},showReportProps:function(){
this.show("props","report");
},loadRptProps:function(){
this.status=null;
if(!this.cache[this.type]){
var dlg=this;
dojo.io.bind({url:cv.contextPath+"templates/"+this.dlgTemplate,handle:function(type,data,evt){
if(type=="load"){
if(cv.util.parseAjaxMsg(data)){
this.status="errorDlgLoad";
return;
}
dlg.cache[dlg.type]=data;
}else{
dlg.status="errorDlgLoad";
}
},mimetype:"text/plain",method:"POST",sync:true});
}
if(this.status!=null){
return false;
}
var str=this.loadRptProps.arguments.length>0?dojo.string.substituteParams(this.cache[this.type],this.loadRptProps.arguments):this.cache[this.type];
if(dojo.lang.isUndefined(cv.dlgWidget)){
cv.dlgWidget=cv.util.getDojoWidget("theDialog");
}
cv.dlgWidget.setContent("<form id=\"theDialogForm\" action=\"\" onsubmit=\"return false\">"+str+"</form>");
this.defaultMsg=null;
this.theForm=dojo.byId("theDialogForm");
if(!cv.getActiveReport().createPAA||!cv.getActiveReport().manager.isReportWritable){
dojo.html.addClass(this.byId("editNameButton"),"hidden");
dojo.html.setStyle(this.byId("closeButton"),"padding-left","23px");
}
var _1b8=this.byId("editDescButton");
if(_1b8){
dojo.event.connect(_1b8,"onclick",this,"showEditDesc");
}
var _1b9=this.byId("editNameButton");
if(_1b9){
dojo.event.connect(_1b9,"onclick",this,"showRenameRpt");
}
if(this.byId("descBtnCancel")){
dojo.event.connect(this.byId("descBtnCancel"),"onclick",this,"hideEditDesc");
}
if(this.byId("descBtnSave")){
dojo.event.connect(this.byId("descBtnSave"),"onclick",this,"saveRptDesc");
}
if(this.byId("nameBtnCancel")){
dojo.event.connect(this.byId("nameBtnCancel"),"onclick",this,"hideRenameRpt");
}
if(this.byId("nameBtnSave")){
dojo.event.connect(this.byId("nameBtnSave"),"onclick",this,"renameReport");
}
if(this.byId("closeButton")){
dojo.event.connect(this.byId("closeButton"),"onclick",this,"cancel");
}
return true;
},showReportDefinition:function(){
this.show("xml","report");
},showSubtotals:function(){
this.show("subtotal");
},showNewSummaryOptions:function(){
this.show("summaries");
},showNewArithBuilder:function(){
this.show("arith");
},showNewTrendNumber:function(){
this.show("trend");
},showFilterList:function(_1ba){
this.show("list","filter",_1ba);
},showCSVDownload:function(_1bb){
this.show("csv_download","report",_1bb);
},remove:function(){
switch(this.type){
case "attribute_replace":
this.report.reportDoc.setReplaced(this.dataSource.getFormula(),null);
return;
default:
break;
}
},_transformArithExpression:function(str,_1bc){
var _1bd=this.byId("measures").options;
var map={};
var _1be={};
for(var x=0;x<_1bd.length;++x){
if(_1bc){
map["["+_1bd[x].text+"]"]=_1bd[x].value;
_1be[_1bd[x].value]="["+_1bd[x].text+"]";
}else{
map[_1bd[x].value]="["+_1bd[x].text+"]";
}
}
return str.replace(_1bc?/((\[Measures\]\.\[[^\]]+\])|(\[MEASURE[^\]]+\]))|(\[(\\\]|[^\]])+\])/g:/(\[Measures\]\.\[[^\]]+\])|(\[MEASURE[^\]]+\])/g,function(_1bf,key){
if(typeof (map[_1bf])!="undefined"&&map[_1bf]!=null){
return map[_1bf];
}else{
if(typeof (_1be[_1bf])!="undefined"&&_1be[_1bf]!=null&&_1bf.indexOf("[Measures].")>=0){
return _1bf;
}else{
if((typeof (_1be[_1bf])=="undefined"||_1be[_1bf]==null)&&(_1bf.indexOf("[Measures].")>=0||_1bf.indexOf("[MEASURES].")>=0)){
return _1bf.replace("[Measures].","");
}
}
}
return _1bf;
});
},_updateNumberFormat:function(gem,toUI){
var cat=this.byId("formatCategory"),_1c0=this.byId("formatScale"),exp=this.byId("formatExpression");
var _1c1;
if(toUI){
if(gem){
_1c1=gem.getNumberFormat();
if(_1c1.formatCategory){
cat.value=_1c1.formatCategory;
}
if(_1c1.formatScale){
_1c0.value=_1c1.formatScale;
}
if(exp){
exp.value=_1c1.formatExpression;
}
}else{
cat.selectedIndex=-1;
_1c0.selectedIndex=-1;
}
}else{
_1c1={formatCategory:cat.value,formatScale:_1c0.value};
if(exp){
_1c1.formatExpression=exp.value;
}
gem.setNumberFormat(_1c1);
}
return _1c1;
},_selectFolderInList:function(_1c2){
CookieLib.setCookieAttrib("cookie","report_selected_folder",this.byId("folder").value);
if(!_1c2||!dojo.lang.isString(_1c2)||_1c2.length<=1){
_1c2=this.byId("folder").value;
}else{
this.byId("folder").value=_1c2;
}
var _1c3=this;
dojo.io.bind({url:cv.contextPath+"ajax/getFolderContent",content:{path:_1c2,stok:cv.securityToken},handle:function(type,data,evt){
if(type=="load"){
if(data){
var msg=cv.util.parseAjaxMsg(data);
if(msg){
return _1c3.displayMsg(msg.details?msg.details:cvCatalog.dlgErrGeneric);
}
_1c3.byId("folderContent").innerHTML="<select id=\"SR_filesInFolder\" size=9 class=\"folderContent\">"+data+"</select>";
dojo.event.connect(_1c3.byId("filesInFolder"),"onchange",_1c3,"_selectReportInFolder");
}else{
_1c3.byId("folderContent").innerHTML="<select size=9 class=\"folderContent\"><option>&nbsp;</option></select>";
}
}else{
_1c3.report.showReportStatus("errorReportDefinition");
}
},mimetype:"text/plain",method:"POST",sync:false});
},_selectReportInFolder:function(){
this.byId("name").value=this.byId("filesInFolder").value;
},_validateAmountField:function(_1c4){
dojo.html.removeClass(dojo.byId("MT_amount"),"invalid");
if(!cv.util.checkNumber(_1c4)||parseInt(_1c4)<=0||(parseInt(_1c4)!=parseFloat(_1c4))){
this.report.filterDlg.setInvalidInputField("MT_amount");
return "dlgErrTrendNumberAmountNumberExpected";
}
return null;
},_getUniqueLabel:function(_1c5){
var _1c6=this.report.gemList,_1c7=_1c6.getKeyList();
if(!_1c7||_1c7.length==0){
return _1c5;
}
function _1c8(str){
for(var x=0;x<_1c7.length;++x){
var gem=_1c6.item(_1c7[x]);
if(gem.getDisplayLabel()==str){
return true;
}
}
return false;
};
if(!_1c8(_1c5)){
return _1c5;
}
var i=2,_1c9=_1c5+"_"+i;
while(_1c8(_1c9)){
_1c9=_1c5+"_"+(++i);
}
return _1c9;
},_validateNumberFormatAndDecimalPlaces:function(){
dojo.html.removeClass(this.byId("formatCategory"),"invalid");
dojo.html.removeClass(this.byId("formatScale"),"invalid");
var _1ca=true;
if(this.byId("formatCategory").value==cvCatalog["dlgNullSelection"]){
this.byId("formatCategory").focus();
dojo.html.addClass(this.byId("formatCategory"),"invalid");
_1ca=false;
}
if(this.byId("formatScale").value==cvCatalog["dlgNullSelection"]){
this.byId("formatScale").focus();
dojo.html.addClass(this.byId("formatScale"),"invalid");
_1ca=false;
}
if(!_1ca){
this.displayMsg(cvCatalog["dlgErrNumberFormatOrDecimalRequired"]);
}
return _1ca;
},_updateNumberFormatAndDecimalPlacesDropdown:function(){
var _1cb=document.createElement("option");
_1cb.setAttribute("value",cvCatalog["dlgNullSelection"]);
_1cb.innerHTML=cvCatalog["dlgNullSelection"];
this.byId("formatCategory").insertBefore(_1cb,this.byId("formatCategory").getElementsByTagName("option")[0]);
this.byId("formatCategory").value=cvCatalog["dlgNullSelection"];
this.byId("formatScale").value="2";
},_validateName:function(){
dojo.html.removeClass(this.byId("name"),"invalid");
if(this.byId("name").value==""){
dojo.html.addClass(this.byId("name"),"invalid");
this.displayMsg(cvCatalog["dlgErrNameRequired"]);
return false;
}
return true;
},showRenameRpt:function(){
var node=this.byId("nameDiv");
node.innerHTML="<input id=\"RP_hiddenRptName\" type=\"hidden\" value=\""+this.byId("name").innerHTML.replace(/(["])/gm,"////")+"\"><input id=\"RP_name\" style=\"width:430px;\" value=\""+this.byId("name").innerHTML.replace(/(["])/gm,"////")+"\">";
dojo.html.setStyle(node,"padding-top","0px");
var _1cc=this.byId("name").value.replace(/\/\/\/\//g,"\"");
this.byId("hiddenRptName").value=this.byId("name").value=_1cc;
this.byId("name").focus();
dojo.html.removeClass(this.byId("nameBtn"),"hidden");
dojo.html.addClass(this.byId("editNameButton"),"hidden");
dojo.html.addClass(this.byId("closeButton"),"hidden");
},hideRenameRpt:function(){
var node=this.byId("nameDiv");
node.innerHTML="<div id='RP_name' style='font-weight: bold;width:360px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'>"+dojo.string.escape("html",this.byId("hiddenRptName").value)+"</div>";
dojo.html.setStyle(node,"padding-top","0px");
dojo.html.addClass(this.byId("nameBtn"),"hidden");
dojo.html.removeClass(this.byId("editNameButton"),"hidden");
dojo.html.removeClass(this.byId("closeButton"),"hidden");
},showEditDesc:function(){
var node=this.byId("editDescTextArea");
dojo.html.removeClass(this.byId("editDescTextAreaTR"),"hidden");
dojo.html.addClass(this.byId("descDivTR"),"hidden");
if(cv.getActiveReport().reportDoc.getReportProperty("description")==""){
node.innerHTML="<input id=\"RP_hiddenDesc\" type=\"hidden\" value=\""+this.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"\"><textarea id=\"RP_description\" style=\"width:430px;\" rows=3></textarea>";
}else{
node.innerHTML="<input id=\"RP_hiddenDesc\" type=\"hidden\" value=\""+this.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"\"><textarea id=\"RP_description\" style=\"width:430px;\" rows=3>"+this.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"</textarea>";
}
dojo.html.removeClass(this.byId("descBtn"),"hidden");
this.byId("editDescDiv").innerHTML="";
this.byId("description").focus();
this.isEditDescHidden=false;
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},hideEditDesc:function(){
var node=this.byId("editDescDiv");
dojo.html.addClass(this.byId("editDescTextAreaTR"),"hidden");
dojo.html.removeClass(this.byId("descDivTR"),"hidden");
var _1cd=this.byId("hiddenDesc").value;
node.innerHTML="<div id='RP_description' style='word-break:break-all;overflow:auto;padding-left: 10px;'>"+this.byId("hiddenDesc").value+"</div>";
dojo.html.addClass(this.byId("descBtn"),"hidden");
this.byId("editDescTextArea").innerHTML="";
this.isEditDescHidden=true;
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},saveRptDesc:function(){
this.report.setReportProperties({description:this.byId("description").value});
var desc=this.byId("description").value;
this.byId("description").innerHTML=desc;
this.byId("hiddenDesc").value=this.byId("description").value;
this.hideEditDesc();
},renameReport:function(){
var name=dojo.string.trim(this.byId("name").value);
if(dojo.string.trim(this.byId("hiddenRptName").value)!=dojo.string.trim(this.byId("name").value)){
if(!name){
return cv.flex.showMessage("error",cvCatalog.dlgErrEmptyReportName);
}
cv.getActiveReport().byId("ReportName").innerHTML=dojo.string.escape("html",name);
document.title=name;
cv.getActiveReport().reportDoc.setReportProperty("name",name);
this.byId("hiddenRptName").value=this.byId("name").value;
}
this.hideRenameRpt();
}});
dojo.declare("cv.LinkDialog",cv.Dialog,function(_1ce){
this.report=_1ce;
this.dlgTemplate="linkDlg.html";
this.prefix="AL_";
this.dataSource=null;
this.linkTypes=["FILE","URL"];
},{performAction:function(_1cf){
var ctx;
for(var x=0;x<_1cf.length;x++){
if(_1cf[x]["clickLevel"]){
ctx=_1cf[x];
break;
}
}
var _1d0=cv.util.parseMDXExpression(ctx.formula,false);
var _1d1=cv.util.parseMDXExpression(ctx.member,false);
var gem=this.report.getGem(ctx.formula);
var link=gem.getLink();
var _1d2=link.getAttribute("target");
var type=link.getAttribute("type");
if(type=="URL"){
var url=link.getAttribute("url");
url=url.replace("{"+_1d0+"}",encodeURIComponent(_1d1));
this._openUrl(_1d2,url,_1d1);
}else{
if(type=="FILE"){
var _1d3=link.getAttribute("fileSolution");
var _1d4=link.getAttribute("filePath");
var _1d5=link.getAttribute("fileName");
var file=this._getSolutionFileXML(_1d3,_1d4,_1d5);
if(file==null){
alert(cvCatalog.linkFileOpenError);
return;
}
var url=file.getAttribute("url");
var _1d6=link.selectNodes("cv:linkParam");
var _1d7=file.getAttribute("param-service-url");
var _1d8=null;
if(_1d6.length>0&&_1d7){
var _1d7=file.getAttribute("param-service-url");
_1d8=this._getSolutionDocParams(_1d7);
}
for(var x=0;x<_1d6.length;++x){
var p=_1d6[x].getAttribute("name");
url=url+"&"+encodeURIComponent(p)+"=";
var v=_1d6[x].getAttribute("value");
v=this._substituteParam(v,_1cf);
if(_1d8){
var _1d9=_1d8.selectSingleNode("parameter[@name=\""+p+"\"]/values/value[@label=\""+v+"\"]");
if(_1d9){
v=_1d9.getAttribute("value");
}
}
url=url+encodeURIComponent(v);
}
this._openUrl(_1d2,url,_1d1);
}else{
if(type=="DASHBOARD"){
for(var x=0;x<_1cf.length;++x){
ctx=_1cf[x];
_1d1=cv.util.parseMDXExpression(ctx.member,false);
if(parent&&parent.Dashboards&&parent.encode_prepare){
parent.Dashboards.fireOutputParam(window,ctx.formula,parent.encode_prepare(_1d1));
}else{
alert("Unable to call Dashbords.fireChange on param "+ctx.formula+" with value "+_1d1);
return;
}
}
}
}
}
},_substituteParam:function(_1da,_1db){
for(var x=0;x<_1db.length;++x){
var ctx=_1db[x];
var _1dc=cv.util.parseMDXExpression(ctx.formula,false);
var _1dd=cv.util.parseMDXExpression(ctx.member,false);
if(_1da=="{"+_1dc+"}"){
return _1dd;
}
}
return _1da;
},_openUrl:function(_1de,url,_1df){
if(_1de=="NEW_TAB"){
if(window.parent&&window.parent.mantle_openTab){
window.parent.mantle_openTab(_1df,_1df,url);
return;
}
if(window.parent&&window.parent.parent&&window.parent.parent.mantle_openTab){
window.parent.parent.mantle_openTab(_1df,_1df,url);
return;
}
}
if(_1de=="CURRENT"){
window.location=url;
}else{
window.open(url);
}
},show:function(){
this.dataSource=this.report.currentSelection;
if(!this.dataSource){
return;
}
var _1e0=this.dataSource.getName();
if(!this.load(_1e0)){
return;
}
dojo.event.connect(this.byId("enableCheckbox"),"onclick",cv.util,"onToggleSectionCheckbox");
dojo.event.connectOnce(this.byId("linkType"),"onchange",this,"_changeType");
dojo.event.connectOnce(this.byId("filePicker"),"onclick",this,"_openGwtRepositoryBrowser");
var xml=this.dataSource.getLink();
if(xml){
var _1e1=this.byId("linkType");
var type=xml.getAttribute("type");
if(type=="URL"){
this.byId("urlInput").value=xml.getAttribute("url");
this.byId("urlToolTip").value=xml.getAttribute("toolTip");
cv.util.selectByValue(this.byId("urlTarget"),xml.getAttribute("target"));
}else{
if(type=="FILE"){
this.byId("fileLabel").value=xml.getAttribute("fileLabel");
this.byId("fileName").value=xml.getAttribute("fileName");
this.byId("filePath").value=xml.getAttribute("filePath");
this.byId("fileSolution").value=xml.getAttribute("fileSolution");
this.byId("fileToolTip").value=xml.getAttribute("toolTip");
cv.util.selectByValue(this.byId("fileTarget"),xml.getAttribute("target"));
this._populateParameters(xml.getAttribute("fileSolution"),xml.getAttribute("filePath"),xml.getAttribute("fileName"),xml.selectNodes("cv:linkParam"));
}
}
cv.util.selectByValue(this.byId("linkType"),xml.getAttribute("type"));
}else{
cv.util.setSectionCollapsed("AL_enableCheckbox");
}
this._changeType();
this.showDialog();
},save:function(){
if(dojo.byId("dlgBtnSave").disabled){
return;
}
if(this.byId("enableCheckbox").checked){
var type=this.byId("linkType").value;
if(!this._validateParameter(type)){
return;
}
if(type=="URL"){
var _1e2={type:type,url:this.byId("urlInput").value,toolTip:this.byId("urlToolTip").value,target:this.byId("urlTarget").value};
this.dataSource.setLink(_1e2);
this.report.history.add(new cv.ReportState("actionAdd","hyperlink"));
}else{
if(type=="FILE"){
var _1e2={type:type,fileLabel:this.byId("fileLabel").value,fileName:this.byId("fileName").value,filePath:this.byId("filePath").value,fileSolution:this.byId("fileSolution").value,toolTip:this.byId("fileToolTip").value,target:this.byId("fileTarget").value};
var rows=this.byId("linkParamsTable").rows;
var _1e3={};
for(var x=0;x<rows.length;++x){
if(!rows[x].lastChild.firstChild.checked){
continue;
}
var _1e4=rows[x].lastChild.lastChild;
_1e3[_1e4.name]=_1e4.value;
}
this.dataSource.setLink(_1e2,_1e3);
this.report.history.add(new cv.ReportState("actionAdd","hyperlink"));
}
}
}else{
this.dataSource.removeLink();
this.report.history.add(new cv.ReportState("actionRemove","hyperlink"));
}
cv.dlgWidget.hide();
if(this.report.reportStatus!="errorReportDefinition"){
this.report.refreshReport();
}
},_openGwtRepositoryBrowser:function(e){
zindex=dojo.html.getStyle(dojo.byId("theDialog"),"z-index");
dojo.html.setStyle(dojo.byId("theDialog"),"z-index","100");
var _1e5=this;
openFileChooserDialog({fileSelected:function(_1e6,_1e7,_1e8,_1e9){
_1e5.byId("fileLabel").value=_1e9;
_1e5.byId("fileSolution").value=_1e6;
_1e5.byId("filePath").value=_1e7;
_1e5.byId("fileName").value=_1e8;
_1e5._populateParameters(_1e6,_1e7,_1e8,null);
dojo.html.setStyle(dojo.byId("theDialog"),"z-index",zindex);
},dialogCanceled:function(){
dojo.html.setStyle(dojo.byId("theDialog"),"z-index",zindex);
}});
},_changeType:function(e){
var _1ea=this.byId("linkType");
for(var x=0;x<this.linkTypes.length;++x){
if(this.linkTypes[x]==_1ea.value){
cv.util.show(this.prefix+this.linkTypes[x]);
}else{
cv.util.hide(this.prefix+this.linkTypes[x]);
}
}
},_validateParameter:function(type){
if(type=="URL"){
if(!this.byId("urlInput").value){
this.displayError(cvCatalog.linkRequiredURL);
this.setInvalidInputField("AL_urlInput");
return false;
}
}else{
if(type=="FILE"){
if(!this.byId("fileName").value){
this.displayError(cvCatalog.linkRequiredFile);
this.setInvalidInputField("AL_fileLabel");
return false;
}
}
}
return true;
},_getSolutionDocParams:function(_1eb){
var xml=null;
dojo.io.bind({url:_1eb,handle:function(type,data,evt){
if(type=="load"){
xml=data;
}
},mimetype:"text/xml",method:"POST",sync:true});
return xml.documentElement;
},_populateParameters:function(_1ec,_1ed,_1ee,_1ef){
this.byId("fileLabelSpan").title=_1ec+_1ed+"/"+_1ee;
var _1f0=this.byId("linkParamsTable");
cv.util.hide("AL_linkParamsDiv");
while(_1f0.rows.length>0){
_1f0.deleteRow(0);
}
var file=this._getSolutionFileXML(_1ec,_1ed,_1ee);
if(file==null){
alert(cvCatalog.linkFileRemoved);
this.byId("fileLabel").value="";
this.byId("fileName").value="";
return;
}
var _1f1=file.getAttribute("param-service-url");
if(!_1f1){
return;
}
var _1f2=this._getSolutionDocParams(_1f1).selectNodes("parameter");
var _1f3=false;
for(var x=0;x<_1f2.length;++x){
var attr=_1f2[x].selectSingleNode("attribute[@name='parameter-group']");
if(attr&&(attr.getAttribute("value")=="system"||attr.getAttribute("value")=="subscription")){
continue;
}
_1f3=true;
var name=_1f2[x].getAttribute("name");
var _1f4=null;
attr=_1f2[x].selectSingleNode("attribute[@name='label']");
if(attr){
_1f4=attr.getAttribute("value");
}else{
_1f4=name;
}
var row=_1f0.insertRow(_1f0.rows.length);
var _1f5=null;
var _1f6=false;
if(_1ef){
for(var y=0;y<_1ef.length;++y){
if(_1ef[y].getAttribute("name")==name){
_1f5=_1ef[y].getAttribute("value");
_1f6=true;
break;
}
}
}
if(!_1f5){
if(_1f4==this.dataSource.getName()){
_1f5="{"+_1f4+"}";
_1f6=true;
}else{
_1f5="";
}
}
var cell=document.createElement("td");
cell.className="paramCell";
row.appendChild(cell);
cell.innerHTML=_1f4;
cell=document.createElement("td");
cell.className="valueCell";
row.appendChild(cell);
var _1f7=document.createElement("input");
_1f7.type="checkbox";
cell.appendChild(_1f7);
_1f7=document.createElement("input");
_1f7.name=name;
_1f7.type="text";
_1f7.size=40;
_1f7.value=_1f5;
cell.appendChild(_1f7);
if(_1f6){
row.lastChild.firstChild.checked=true;
}else{
row.lastChild.lastChild.disabled=true;
}
dojo.event.connectOnce(row.lastChild.firstChild,"onclick",this,"_toggleLinkParam");
}
if(_1f3){
cv.util.show("AL_linkParamsDiv");
}
},_toggleLinkParam:function(evt){
var cked=evt.target.checked;
var _1f8=evt.target.parentNode.lastChild;
if(!cked){
_1f8.value="";
_1f8.disabled=true;
}else{
_1f8.disabled=false;
_1f8.focus();
}
},_getSolutionFileXML:function(_1f9,_1fa,_1fb){
var xml=null;
dojo.io.bind({url:"../../SolutionRepositoryService?component=getSolutionRepositoryDoc",handle:function(type,data,evt){
if(type=="load"){
xml=data;
}
},mimetype:"text/xml",method:"POST",sync:true});
var file=xml.documentElement.selectSingleNode("file[@name=\""+_1f9+"\"]");
if(file==null){
return;
}
var _1fc=_1fa.split("/");
for(var x=0;x<_1fc.length;++x){
if(_1fc[x]==""){
continue;
}
file=file.selectSingleNode("file[@name=\""+_1fc[x]+"\"]");
if(file==null){
return;
}
}
file=file.selectSingleNode("file[@name=\""+_1fb+"\"]");
return file;
}});
dojo.declare("cv.ChartOptionsDialog",cv.Dialog,function(_1fd){
this.report=_1fd;
this.dlgTemplate="chartPropsDlg.html";
this.prefix="CP_";
this.originalOptions={};
this.applied=false;
this.lastScale=0;
},{show:function(){
if(!this.load()){
return;
}
var _1fe=this.report.reportDoc;
var attr=_1fe.getChartOptions().attributes;
for(var x=0,y=attr.length;attr!=null&&x<y;++x){
this.updateHtml(attr[x].name,attr[x].value);
this.originalOptions[attr[x].name]=attr[x].value;
}
this.toggleAutoRange();
dojo.event.connectOnce(this.byId("autoRange"),"onclick",this,"toggleAutoRange");
dojo.event.connectOnce(this.byId("labelColorDiv"),"onclick",this,"toggleColorPalette");
var _1ff=dojo.widget.createWidget("dojo:ColorPalette",{palette:"7x10"},dojo.byId("CP_labelColorPaletteWidget"));
dojo.event.connectOnce(_1ff,"onColorSelect",this,"selectColor");
dojo.html.setStyle(this.byId("labelColorDiv"),"background-color",_1fe.getChartOption("labelColor"));
dojo.event.connectOnce(this.byId("backgroundColorDiv"),"onclick",this,"toggleColorPalette");
_1ff=dojo.widget.createWidget("dojo:ColorPalette",{palette:"7x10"},dojo.byId("CP_backgroundColorPaletteWidget"));
dojo.event.connectOnce(_1ff,"onColorSelect",this,"selectColor");
dojo.html.setStyle(this.byId("backgroundColorDiv"),"background-color",_1fe.getChartOption("backgroundColor"));
dojo.event.connectOnce(this.byId("backgroundColorEndDiv"),"onclick",this,"toggleColorPalette");
_1ff=dojo.widget.createWidget("dojo:ColorPalette",{palette:"7x10"},dojo.byId("CP_backgroundColorEndPaletteWidget"));
dojo.event.connectOnce(_1ff,"onColorSelect",this,"selectColor");
dojo.html.setStyle(this.byId("backgroundColorEndDiv"),"background-color",_1fe.getChartOption("backgroundColorEnd"));
dojo.event.connectOnce(this.byId("legendColorDiv"),"onclick",this,"toggleColorPalette");
_1ff=dojo.widget.createWidget("dojo:ColorPalette",{palette:"7x10"},dojo.byId("CP_legendColorPaletteWidget"));
dojo.event.connectOnce(_1ff,"onColorSelect",this,"selectColor");
dojo.html.setStyle(this.byId("legendColorDiv"),"background-color",_1fe.getChartOption("legendColor"));
dojo.event.connectOnce(this.byId("legendBackgroundColorDiv"),"onclick",this,"toggleColorPalette");
_1ff=dojo.widget.createWidget("dojo:ColorPalette",{palette:"7x10"},dojo.byId("CP_legendBackgroundColorPaletteWidget"));
dojo.event.connectOnce(_1ff,"onColorSelect",this,"selectColor");
dojo.html.setStyle(this.byId("legendBackgroundColorDiv"),"background-color",_1fe.getChartOption("legendBackgroundColor"));
dojo.event.connect(dojo.byId("dlgBtnApply"),"onclick",this,"apply");
dojo.event.connectOnce(this.byId("backgroundFill"),"onchange",this,"toggleFillType");
this.toggleFillType();
this.lastScale=this.report.reportDoc.getChartOption("displayUnits");
this.lastScale=this.lastScale.substring(6);
dojo.event.connectOnce(this.byId("displayUnits"),"onchange",this,"toggleDisplayUnits");
dojo.event.connectOnce(dojo.byId("standardDialog"),"onclick",this,"hideColorPalettes");
this.showDialog();
},save:function(_200){
var _201=this.report.reportDoc;
var els=this.theForm.elements;
if(!dojo.byId("CP_autoRange").checked&&!cv.util.checkNumber(dojo.byId("CP_valueAxisLowerLimit").value)){
this.displayError(cvCatalog.dlgChartPropsAxisLimitError);
this.setInvalidInputField("CP_valueAxisLowerLimit");
dojo.byId("CP_valueAxisLowerLimit").focus();
return false;
}
if(!dojo.byId("CP_autoRange").checked&&!cv.util.checkNumber(dojo.byId("CP_valueAxisUpperLimit").value)){
this.displayError(cvCatalog.dlgChartPropsAxisLimitError);
this.setInvalidInputField("CP_valueAxisUpperLimit");
dojo.byId("CP_valueAxisUpperLimit").focus();
return false;
}
for(var x=0;x<els.length;++x){
if(els[x].tagName=="INPUT"||els[x].tagName=="SELECT"){
if((els[x].id=="CP_valueAxisLowerLimit"||els[x].id=="CP_valueAxisUpperLimit")&&els[x].value==""){
continue;
}
this.updateXml(_201.getChartOptions(),els[x]);
}
}
if(!_200){
this.report.history.add(new cv.ReportState("actionChartProps"));
cv.dlgWidget.hide();
}
if(this.report.reportStatus!="errorReportDefinition"){
this.report.refreshReport();
}
},toggleAutoRange:function(){
dojo.byId("CP_valueAxisLowerLimit").disabled=dojo.byId("CP_autoRange").checked;
dojo.byId("CP_valueAxisUpperLimit").disabled=dojo.byId("CP_autoRange").checked;
},toggleColorPalette:function(evt){
var _202=evt.target.id.replace("Div","Palette");
this.hideColorPalettes();
cv.util.show(_202);
evt.preventDefault();
evt.stopPropagation();
},toggleFillType:function(){
var type=dojo.byId("CP_backgroundFill").value;
if(type=="NONE"){
cv.util.hide("CP_backgroundColorWrapper");
cv.util.hide("CP_backgroundColorEndWrapper");
}else{
if(type=="SOLID"){
cv.util.show("CP_backgroundColorWrapper");
cv.util.hide("CP_backgroundColorEndWrapper");
}else{
if(type=="GRADIENT"){
cv.util.show("CP_backgroundColorWrapper");
cv.util.show("CP_backgroundColorEndWrapper");
}
}
}
},toggleDisplayUnits:function(){
var _203=dojo.byId("CP_displayUnits").value;
_203=_203.substring(6);
var _204=this.lastScale-_203;
this.lastScale=_203;
if(dojo.byId("CP_valueAxisLowerLimit").value){
dojo.byId("CP_valueAxisLowerLimit").value=dojo.byId("CP_valueAxisLowerLimit").value*Math.pow(10,_204);
}
if(dojo.byId("CP_valueAxisUpperLimit").value){
dojo.byId("CP_valueAxisUpperLimit").value=dojo.byId("CP_valueAxisUpperLimit").value*Math.pow(10,_204);
}
},selectColor:function(_205){
var _206;
if(!cv.util.isHidden("CP_labelColorPalette")){
_206="CP_labelColor";
}else{
if(!cv.util.isHidden("CP_backgroundColorPalette")){
_206="CP_backgroundColor";
}else{
if(!cv.util.isHidden("CP_backgroundColorEndPalette")){
_206="CP_backgroundColorEnd";
}else{
if(!cv.util.isHidden("CP_legendColorPalette")){
_206="CP_legendColor";
}else{
if(!cv.util.isHidden("CP_legendBackgroundColorPalette")){
_206="CP_legendBackgroundColor";
}
}
}
}
}
dojo.byId(_206).value=_205;
dojo.html.setStyle(dojo.byId(_206+"Div"),"background-color",_205);
cv.util.hide(_206+"Palette");
},hideColorPalettes:function(evt){
cv.util.hide("CP_labelColorPalette");
cv.util.hide("CP_backgroundColorPalette");
cv.util.hide("CP_backgroundColorEndPalette");
cv.util.hide("CP_legendBackgroundColorPalette");
cv.util.hide("CP_legendColorPalette");
},apply:function(){
this.save(true);
this.applied=true;
},cancel:function(){
if(this.applied){
var _207=this.report.reportDoc;
for(var prop in this.originalOptions){
_207.setChartOption(prop,this.originalOptions[prop]);
}
this.report.refreshReport();
}
cv.Dialog.prototype.cancel.call(this);
}});
dojo.declare("cv.FilterDialog",cv.Dialog,function(_208){
this.report=_208;
this.dlgTemplate=null;
this.prefix="FT_";
this.filterTypes=["FILTER_METRIC","FILTER_PICKLIST","FILTER_MATCH","FILTER_PRESET","FILTER_RANGE"];
},{destroy:function(){
this.clear();
},clear:function(){
this.gem=null;
this.type=null;
this.attribute=null;
this.attributeType=null;
this.isTimeAttribute=false;
this.metric=null;
this.ordinal=0;
this.filterProps=null;
this.parentFilterMsg=null;
this.asyncRequestId=null;
this.asyncMode=false;
this.searchCache=new Array(30);
this.searchCacheTopIndex=-1;
this.searchRequestId=null;
this.valueListNode=null;
this.search=null;
},show:function(_209,_20a){
if(dojo.lang.isString(_209)&&_209.indexOf("filter_metric")==0){
return this.showMetricFilter();
}else{
if(cv.getFieldHelp().get(_209,"type")=="NUMBER"||(dojo.lang.isString(_209)&&_209.indexOf("[MEASURE:")==0)){
return this.showMetricFilter(_209);
}
}
this.clear();
if(_209.indexOf("filter_")==0){
var reg=/^filter_(.+)_(\d)$/;
var _20b=reg.exec(_209);
if(!_20b){
return false;
}
this.attribute=_20b[1];
this.ordinal=_20b[2];
}else{
this.attribute=_209;
_20a=parseInt(_20a);
if(!isNaN(_20a)&&_20a>0){
this.ordinal=_20a;
}
}
this.attributeType=cv.getFieldHelp().get(this.attribute,"type");
if(!this.attributeType){
return;
}
this.isTimeAttribute=cv.getFieldHelp().isTimeAttribute(this.attribute);
this.gem=this.report.getGem("filter_"+this.attribute);
if(this.gem){
if(this.gem.isLocked(true)){
return;
}
this.filterProps=this.report.reportDoc.getFilterProps(this.gem.xmlNode);
}else{
if(!this.report.getGem(this.attribute)){
var _20c=this.report.getTrendNumberOnAncestors(this.attribute);
if(_20c){
this.showError(["errorAddFilterWithTrendOnAncestor",this.report.getFieldLabel(this.attribute),this.report.getFieldLabel(_20c.ancestor),_20c.trend.getDisplayLabel()]);
return false;
}
}
this.filterProps={type:this.type,formula:this.attribute,predicates:new dojo.collections.Dictionary()};
}
if(this.ordinal==0){
this.type=this.isTimeAttribute?"FILTER_PRESET":"FILTER_PICKLIST";
}else{
var pred=this.filterProps.predicates.item(this.ordinal)[0];
switch(pred.op){
case "CONTAIN":
case "NOT_CONTAIN":
this.type="FILTER_MATCH";
break;
case "BEFORE":
case "AFTER":
case "BETWEEN":
this.type="FILTER_RANGE";
break;
case "EQUAL":
case "NOT_EQUAL":
this.type=(this.isTimeAttribute&&pred.preset)?"FILTER_PRESET":"FILTER_PICKLIST";
break;
case "TIME_YAGO":
case "TIME_AHEAD":
case "TIME_AGO":
case "TIME_RANGE_NEXT":
case "TIME_RANGE_PREV":
this.type="FILTER_PRESET";
break;
default:
return;
}
}
this.dlgTemplate="filterPredicateDlg.html";
this.helpTopic="CV/Business_User/working_with_filters.html#filters_on_text_fields";
var _20d=this.report.getFieldLabel(this.attribute)?this.report.getFieldLabel(this.attribute):this.report.getFieldLabelPlural(this.attribute);
var _20e=cv.getFieldHelp().get(this.attribute,"type");
var _20f;
if(_20e=="TIME_DATE"){
_20f=this.load(_20d,"Today","Yesterday","Tomorrow");
}else{
_20f=this.load(_20d,"Current "+_20d,"Previous "+_20d,"Next "+_20d);
}
if(!_20f){
this.report.showReportStatus(this.status);
return;
}
var _210=dojo.byId(this.isTimeAttribute?"FT_filterTypeText":"FT_filterTypeTime");
cv.util.removeNode(_210);
_210=dojo.byId(this.isTimeAttribute?"FT_filterTypeTime":"FT_filterTypeText");
dojo.event.connectOnce(_210,"onclick",this,"_setFilterType");
this.valueListNode=dojo.byId("FT_valueList");
dojo.html.disableSelection(this.valueListNode);
if(!this.report.manager.applyReportContextInFilterDialog){
var heir=cv.getFieldHelp().getHierarchy(this.attribute);
if(heir){
var _211=null;
for(var x=0;heir&&x<heir.length;++x){
var id=heir[x];
if(id==this.attribute){
break;
}
if(this.report.getGem("filter_"+id)){
_211=id;
}
}
this.parentFilterMsg=_211?dojo.string.substituteParams(cvCatalog.dlgInfoFilterOnParent,this.report.getFieldLabel(_211)):null;
}
}
if(!this._setFilterType(this.type)){
return;
}
this.showDialog();
},save:function(){
if(dojo.byId("dlgBtnSave").disabled){
return;
}
if(!this._validateParameter()){
return;
}
var ok=false;
switch(this.type){
case "FILTER_METRIC":
ok=this._saveMetricFilter();
break;
case "FILTER_PICKLIST":
ok=this._savePicklistFilter(true);
break;
case "FILTER_MATCH":
ok=this._saveMatchFilter(true);
break;
case "FILTER_PRESET":
ok=this._savePresetFilter(true);
break;
case "FILTER_RANGE":
ok=this._saveRangeFilter(true);
break;
default:
return;
}
if(!ok){
return;
}
cv.dlgWidget.hide();
if(this.filterProps){
this.report.addToCheckFieldList(this.filterProps.formula);
this.report.reportDoc.updateFilter(this.filterProps);
this.report.populateFilters();
this.report.resizeContainer();
this.report.history.add(new cv.ReportState("actionEditFilter"));
if(this.report.reportStatus!="errorReportDefinition"){
this.report.refreshReport();
}
this.valueListNode=null;
}
},showAttrSelection:function(_212,_213,_214){
var gem=this.report.getGem("filter_"+_212);
if(!gem){
return;
}
if(!gem.isLocked(true)&&this.report.mode=="EDIT"){
return this.show(_212,_213);
}
this.type="filter_selection";
this.attribute=_212;
this.dlgTemplate="filterAttrViewDlg.html";
this.helpTopic=null;
if(!this.load(this.report.getFieldLabel(_212),_214)){
return;
}
var _215=dojo.byId("FT_memberList");
var _216=this.report.reportDoc.getFilterProps(gem.xmlNode);
_215.innerHTML=this._formatValueList(_216.predicates.item(_213)[0].members,"SELECTED");
this.showDialog();
},_setFilterType:function(e){
var ok=true,op=null;
if(dojo.lang.isString(e)&&e.indexOf("FILTER_")==0){
this.type=e;
this.updateHtml("filterType",e);
}else{
if(!e.target){
return;
}
if(e.target.tagName=="INPUT"){
this.type=this.getRadioGroupValue("FT_filterType");
}else{
if(e.target.tagName=="A"){
switch(e.target.id){
case "FT_filterOp_PRESET_EQUAL":
case "FT_filterOp_PRESET_NOT_EQUAL":
this.type="FILTER_PRESET";
op=e.target.id.substr(19);
break;
case "FT_filterOp_EQUAL":
case "FT_filterOp_NOT_EQUAL":
this.type="FILTER_PICKLIST";
op=e.target.id.substr(12);
break;
case "FT_filterOp_CONTAIN":
case "FT_filterOp_NOT_CONTAIN":
this.type="FILTER_MATCH";
op=e.target.id.substr(12);
break;
case "FT_filterOp_AFTER":
case "FT_filterOp_BEFORE":
case "FT_filterOp_BETWEEN":
this.type="FILTER_RANGE";
this.type="FILTER_RANGE";
op=e.target.id.substr(12);
break;
default:
return ok;
}
this.updateHtml("filterType",this.type);
}
}
}
this._showFilterTab();
switch(this.type){
case "FILTER_PICKLIST":
ok=this._initPicklistFilter(op);
break;
case "FILTER_MATCH":
ok=this._initMatchFilter(op);
break;
case "FILTER_PRESET":
ok=this._initPresetFilter(op);
break;
case "FILTER_RANGE":
ok=this._initRangeFilter(op);
break;
default:
}
return ok;
},_showFilterTab:function(){
for(var x=1;x<this.filterTypes.length;++x){
if(this.filterTypes[x]==this.type){
cv.util.show(this.prefix+this.filterTypes[x]);
}else{
cv.util.hide(this.prefix+this.filterTypes[x]);
}
}
},_initPresetFilter:function(op){
this.defaultMsg=null;
this.displayMsg();
var pred;
var opr;
var _217;
var _218,_219;
if(this.ordinal>0){
var _21a=this.filterProps.predicates.item(this.ordinal);
for(var j=0;j<_21a.length;j++){
pred=_21a[j];
opr=pred.op;
_217=pred.preset;
if(pred.parameterName){
this._setParameterName(pred.parameterName);
}
if(!_217&&opr!="TIME_YAGO"){
continue;
}
switch(opr){
case "EQUAL":
var apos=_217.split(",");
for(var x=0;x<apos.length;++x){
if(apos[x]=="-1"){
_218=dojo.byId("FT_PREVIOUS_TIME");
}else{
if(apos[x]=="0"){
_218=dojo.byId("FT_CURRENT_TIME");
}else{
if(apos[x]=="-4"||apos[x]=="-12"){
_218=dojo.byId("FT_TIME_YAGO");
}else{
_218=dojo.byId("FT_NEXT_TIME");
}
}
}
_218.checked=true;
}
break;
case "TIME_YAGO":
dojo.byId("FT_TIME_YAGO").checked=true;
break;
case "TIME_RANGE_PREV":
dojo.byId("FT_TIME_RANGE_PREV").checked=true;
dojo.byId("FT_TIME_RANGE_PREV_NUM").value=_217;
break;
case "TIME_AGO":
dojo.byId("FT_TIME_AGO").checked=true;
dojo.byId("FT_TIME_AGO_NUM").value=_217;
break;
case "TIME_RANGE_NEXT":
dojo.byId("FT_TIME_RANGE_NEXT").checked=true;
dojo.byId("FT_TIME_RANGE_NEXT_NUM").value=_217;
break;
case "TIME_AHEAD":
dojo.byId("FT_TIME_AHEAD").checked=true;
dojo.byId("FT_TIME_AHEAD_NUM").value=_217;
break;
default:
}
}
}
_218=dojo.byId("FT_TIME_RANGE_PREV");
dojo.byId("FT_TIME_RANGE_PREV_NUM").disabled=!(_218.checked);
dojo.event.connectOnce(_218,"onclick",this,"_switchPreset");
_218=dojo.byId("FT_TIME_AGO");
dojo.byId("FT_TIME_AGO_NUM").disabled=!(_218.checked);
dojo.event.connectOnce(_218,"onclick",this,"_switchPreset");
_218=dojo.byId("FT_TIME_RANGE_NEXT");
dojo.byId("FT_TIME_RANGE_NEXT_NUM").disabled=!(_218.checked);
dojo.event.connectOnce(_218,"onclick",this,"_switchPreset");
_218=dojo.byId("FT_TIME_AHEAD");
dojo.byId("FT_TIME_AHEAD_NUM").disabled=!(_218.checked);
dojo.event.connectOnce(_218,"onclick",this,"_switchPreset");
cv.util.show("FT_PARAMETER");
dojo.event.connectOnce(dojo.byId("FT_PARAMETER_ENABLE"),"onclick",this,"_toggleParameterCheckbox");
if(this.attributeType=="TIME_YEAR"){
dojo.html.addClass(dojo.byId("TD_FT_TIME_YAGO"),"hidden");
}else{
dojo.html.removeClass(dojo.byId("TD_FT_TIME_YAGO"),"hidden");
}
return true;
},_switchPreset:function(evt){
var _21b=evt.target.id;
var cked=evt.target.checked;
var _21c;
switch(_21b){
case "FT_TIME_RANGE_PREV":
_21c=dojo.byId("FT_TIME_RANGE_PREV_NUM");
break;
case "FT_TIME_AGO":
_21c=dojo.byId("FT_TIME_AGO_NUM");
break;
case "FT_TIME_RANGE_NEXT":
_21c=dojo.byId("FT_TIME_RANGE_NEXT_NUM");
break;
case "FT_TIME_AHEAD":
_21c=dojo.byId("FT_TIME_AHEAD_NUM");
break;
}
if(!cked){
_21c.value="";
_21c.disabled=true;
dojo.html.removeClass(_21c,"inputNum invalid");
}else{
_21c.disabled=false;
_21c.focus();
}
},_savePresetFilter:function(){
if(dojo.byId("FT_TIME_RANGE_PREV").checked&&!this._validatePreset(dojo.byId("FT_TIME_RANGE_PREV_NUM").value)){
dojo.byId("FT_TIME_RANGE_PREV_NUM").focus();
dojo.html.addClass(dojo.byId("FT_TIME_RANGE_PREV_NUM"),"inputNum invalid");
return false;
}
if(dojo.byId("FT_TIME_AGO").checked&&!this._validatePreset(dojo.byId("FT_TIME_AGO_NUM").value)){
dojo.byId("FT_TIME_AGO_NUM").focus();
dojo.html.addClass(dojo.byId("FT_TIME_AGO_NUM"),"inputNum invalid");
return false;
}
if(dojo.byId("FT_TIME_RANGE_NEXT").checked&&!this._validatePreset(dojo.byId("FT_TIME_RANGE_NEXT_NUM").value)){
dojo.byId("FT_TIME_RANGE_NEXT_NUM").focus();
dojo.html.addClass(dojo.byId("FT_TIME_RANGE_NEXT_NUM"),"inputNum invalid");
return false;
}
if(dojo.byId("FT_TIME_AHEAD").checked&&!this._validatePreset(dojo.byId("FT_TIME_AHEAD_NUM").value)){
dojo.byId("FT_TIME_AHEAD_NUM").focus();
dojo.html.addClass(dojo.byId("FT_TIME_AHEAD_NUM"),"inputNum invalid");
return false;
}
if(!dojo.byId("FT_TIME_RANGE_PREV").checked&&!dojo.byId("FT_TIME_AGO").checked&&!dojo.byId("FT_TIME_RANGE_NEXT").checked&&!dojo.byId("FT_CURRENT_TIME").checked&&!dojo.byId("FT_PREVIOUS_TIME").checked&&!dojo.byId("FT_NEXT_TIME").checked&&!dojo.byId("FT_TIME_AHEAD").checked&&(dojo.html.getClass(dojo.byId("TD_FT_TIME_YAGO"))=="hidden"||(dojo.html.getClass(dojo.byId("TD_FT_TIME_YAGO"))!="hidden"&&!dojo.byId("FT_TIME_YAGO").checked))){
this.report.removeFilter("filter_"+this.filterProps.formula+"_"+this.ordinal);
return false;
}
var _21d;
if(dojo.byId("FT_PREVIOUS_TIME").checked){
_21d="-1";
}
if(dojo.byId("FT_CURRENT_TIME").checked){
_21d=_21d?_21d+",0":"0";
}
if(dojo.byId("FT_NEXT_TIME").checked){
_21d=_21d?_21d+",1":"1";
}
var _21e=[];
if(_21d){
_21e.push({ordinal:this.ordinal,op:"EQUAL",preset:_21d,rela_filter:1});
}
if(dojo.byId("FT_TIME_YAGO").checked){
_21e.push({ordinal:this.ordinal,op:dojo.byId("FT_TIME_YAGO").value,rela_filter:1});
}
if(dojo.byId("FT_TIME_RANGE_PREV").checked){
_21e.push({ordinal:this.ordinal,op:dojo.byId("FT_TIME_RANGE_PREV").value,preset:dojo.byId("FT_TIME_RANGE_PREV_NUM").value,rela_filter:1});
}
if(dojo.byId("FT_TIME_RANGE_NEXT").checked){
_21e.push({ordinal:this.ordinal,op:dojo.byId("FT_TIME_RANGE_NEXT").value,preset:dojo.byId("FT_TIME_RANGE_NEXT_NUM").value,rela_filter:1});
}
if(dojo.byId("FT_TIME_AGO").checked){
_21e.push({ordinal:this.ordinal,op:dojo.byId("FT_TIME_AGO").value,preset:dojo.byId("FT_TIME_AGO_NUM").value,rela_filter:1});
}
if(dojo.byId("FT_TIME_AHEAD").checked){
_21e.push({ordinal:this.ordinal,op:dojo.byId("FT_TIME_AHEAD").value,preset:dojo.byId("FT_TIME_AHEAD_NUM").value,rela_filter:1});
}
if(_21e.length>0){
_21e[0].parameterName=dojo.byId("FT_PARAMETER_NAME").value;
this.report.updateRelativeFilterProps(this.filterProps,_21e);
}
return true;
},_validatePreset:function(data){
if(!cv.util.checkNumber(data,false)||parseInt(data)<=0||parseInt(data)>180){
this.displayError("Please input a number between 1 and 180");
return false;
}
return true;
},_setPresetMenu:function(node){
if(node.childNodes.length>1){
return;
}
node.innerHTML="";
var _21f=cvCatalog["filterPreset"+this.attributeType];
for(var x in _21f){
cv.addOption(node,new Option(_21f[x],x));
}
node.childNodes[0].selected=true;
},_initRangeFilter:function(op){
cv.util.hide("FT_PARAMETER");
this.defaultMsg=this.parentFilterMsg;
this.displayMsg();
dojo.lang.setTimeout(this,"_loadRangeFilter",0,op);
return true;
},_loadRangeFilter:function(op){
this.asyncMode=true;
this._loadAttributeMembers();
var _220=dojo.byId("FT_rangeOp");
if(_220.disabled){
return;
}
var _221=dojo.byId("FT_range1"),_222=dojo.byId("FT_range2");
dojo.event.connectOnce(_220,"onchange",this,"_onChangeRangeOp");
var pred=(this.ordinal>0)?this.filterProps.predicates.item(this.ordinal)[0]:null;
if(pred&&(pred.op=="BETWEEN"||pred.op=="AFTER"||pred.op=="BEFORE")){
_220.value=pred.op;
_221.value=pred.members[0].formula;
if(pred.op=="BETWEEN"){
_222.value=pred.members[1].formula;
}else{
_222.options[_222.options.length-1].selected=true;
}
}else{
_221.options[0].selected=true;
_222.options[_222.options.length-1].selected=true;
}
if(op){
_220.value=op;
}
this._onChangeRangeOp();
},_saveRangeFilter:function(){
var op=dojo.byId("FT_rangeOp").value;
var _223=dojo.byId("FT_range1").options[dojo.byId("FT_range1").selectedIndex];
var _224=[{"formula":_223.value,"caption":_223.text}];
if(!_224[0]){
this.displayMsg(cvCatalog.dlgErrFilterInvalidValue);
return false;
}
if(op=="BETWEEN"){
_223=dojo.byId("FT_range2").options[dojo.byId("FT_range2").selectedIndex];
_224.push({"formula":_223.value,"caption":_223.text});
}
this.report.updateFilterProps(this.filterProps,{ordinal:this.ordinal,op:op,preset:null,members:_224});
return true;
},_onChangeRangeOp:function(){
if(!cv.util.isHidden("FT_range1_row")&&dojo.byId("FT_rangeOp").value=="BETWEEN"){
cv.util.show("FT_range2_row");
}else{
cv.util.hide("FT_range2_row");
}
},_initPicklistFilter:function(op){
this.defaultMsg=this.parentFilterMsg;
this.displayMsg();
this.memberListNode=dojo.byId("FT_memberList");
dojo.html.disableSelection(this.memberListNode);
this.search=dojo.byId("FT_searchText");
this.asyncMode=false;
this._loadAttributeMembers();
var _225=dojo.byId("FT_picklistOp");
dojo.event.connectOnce(_225,"onchange",this,"_onChangePicklistOp");
dojo.event.connectOnce(this.valueListNode,"onclick",this,"_onClickList");
dojo.event.connectOnce(this.valueListNode,"ondblclick",this,"_addMembers");
dojo.event.connectOnce(this.memberListNode,"onclick",this,"_onClickList");
dojo.event.connectOnce(this.memberListNode,"ondblclick",this,"_removeMembers");
dojo.event.connectOnce(dojo.byId("FT_searchBy"),"onclick",this,"_searchValueList");
dojo.event.connectOnce(dojo.byId("FT_select_add"),"onclick",this,"_addMembers");
dojo.event.connectOnce(dojo.byId("FT_select_addAll"),"onclick",this,"_addMembers");
dojo.event.connectOnce(dojo.byId("FT_select_remove"),"onclick",this,"_removeMembers");
dojo.event.connectOnce(dojo.byId("FT_select_removeAll"),"onclick",this,"_removeMembers");
dojo.event.connectOnce(dojo.byId("FT_PARAMETER_ENABLE"),"onclick",this,"_toggleParameterCheckbox");
cv.util.show("FT_PARAMETER");
var pred=(this.ordinal>0)?this.filterProps.predicates.item(this.ordinal)[0]:null;
if(pred&&(pred.op=="EQUAL"||pred.op=="NOT_EQUAL")&&!pred.preset){
_225.value=pred.op;
this.memberListNode.innerHTML=this._formatValueList(pred.members,"SELECTED");
if(pred.parameterName){
this._setParameterName(pred.parameterName);
}
}
if(op){
_225.value=op;
}
if(!_225.value){
_225.options[0].selected=true;
}
this._onChangePicklistOp();
return true;
},_savePicklistFilter:function(){
var _226=this._getSelectionList();
if(_226.count==0){
this.displayMsg(cvCatalog.dlgErrFilterNoSelection);
return false;
}
var _227=this.report.updateFilterProps(this.filterProps,{ordinal:this.ordinal,op:dojo.byId("FT_picklistOp").value,members:_226.toArray()});
_227.parameterName=dojo.byId("FT_PARAMETER_NAME").value;
if(_227.members.length>cvConst.MAX_FILTER_MEMBERS){
this.displayMsg(cvCatalog.dlgErrFilterMaxMembers,cvConst.MAX_FILTER_MEMBERS);
if(_227.ordinal>0&&_227.ordinal!=this.ordinal){
this.memberListNode.innerHTML=this._formatValueList(_227.members,"SELECTED");
this.ordinal=_227.ordinal;
}
return false;
}
return true;
},_onChangePicklistOp:function(){
dojo.html.removeClass(this.memberListNode,"excluded");
dojo.html.removeClass(this.memberListNode,"included");
var css=(dojo.byId("FT_picklistOp").value=="EQUAL")?"included":"excluded";
dojo.html.addClass(this.memberListNode,css);
},_addMembers:function(e){
if(!dojo.lang.isObject(this.searchCache[0])){
return;
}
var _228;
switch(e.target.id){
case "FT_select_add":
if(!this.valueListNode.selection){
return;
}
_228=this.valueListNode.selection.toArray();
break;
case "FT_select_addAll":
_228=this.valueListNode.getElementsByTagName("DIV");
break;
default:
if(e.target.id.indexOf("FT_AVA_")!=0){
return;
}
_228=[e.target];
break;
}
if(_228.length==0){
return;
}
var _229=this._getSelectionList();
var _22a=_229.count;
var _22b={};
for(var x=0;x<_22a;++x){
_22b[_229.item(x).formula]=true;
}
for(var x=0;x<_228.length;++x){
var node=_228[x];
if(!node.id){
continue;
}
var _22c=node.id.substring(7);
while(_22c&&_22c.indexOf("\"")>-1){
_22c=_22c.replace("\"","&quot;");
}
if(_22b[_22c]){
continue;
}
var _22d=dojo.html.createNodesFromText("<div id=\"FT_SEL_"+_22c+"\">"+node.innerHTML+"</div>");
this.memberListNode.appendChild(_22d[0]);
++_22a;
}
if(_22a>cvConst.MAX_FILTER_MEMBERS){
this.displayMsg(cvCatalog.dlgErrFilterMaxMembers,cvConst.MAX_FILTER_MEMBERS);
}
dojo.byId("FT_memberListStat").innerHTML=dojo.string.substituteParams(cvCatalog[_22a<=1?"filterSelectionSummarySingle":"filterSelectionSummaryAll"],_22a);
},_removeMembers:function(e){
var _22e=this.memberListNode.getElementsByTagName("DIV");
var _22f=_22e.length;
switch(e.target.id){
case "FT_select_remove":
if(!this.memberListNode.selection){
return;
}
var _22e=this.memberListNode.selection.toArray();
_22f-=_22e.length;
break;
case "FT_select_removeAll":
_22f=0;
break;
default:
if(e.target.id.indexOf("FT_SEL_")!=0){
return;
}
_22e=[e.target];
--_22f;
break;
}
if(_22e.length==0){
return false;
}
for(var x=_22e.length-1;x>=0;--x){
this.memberListNode.removeChild(_22e[x]);
if(this.memberListNode.selection){
this.memberListNode.selection.clear();
}
}
dojo.byId("FT_memberListStat").innerHTML=dojo.string.substituteParams(cvCatalog[_22f<=1?"filterSelectionSummarySingle":"filterSelectionSummaryAll"],_22f);
return false;
},_onClickList:function(e){
var node=e.target;
if(node.id=="FT_valueList"){
node.focus();
}
var list=cv.util.getAncestorByClass(node,"selectableList");
if(!list||list==node){
return;
}
if(list.selection){
for(var x=0,len=list.selection.count;x<len;++x){
dojo.html.removeClass(list.selection.item(x),"selected");
}
}
if(!list.selection||!(e.ctrlKey||e.shiftKey)){
if(!list.selection){
list.selection=new dojo.collections.ArrayList();
}else{
list.selection.clear();
}
list.selection.add(node);
}else{
if(e.ctrlKey){
if(list.selection.contains(node)){
list.selection.remove(node);
}else{
list.selection.add(node);
}
}else{
if(e.shiftKey){
var it=list.selection.item(0);
var _230,end;
if(dojo.html.abs(it).y>dojo.html.abs(node).y){
_230=node;
end=it;
}else{
_230=it;
end=node;
}
var divs=list.getElementsByTagName("DIV");
var add=false;
list.selection.clear();
list.selection.add(it);
for(var x=0,len=divs.length;x<len;++x){
if(divs[x]==_230){
add=true;
}
if(add&&divs[x]!=it){
list.selection.add(divs[x]);
dojo.html.addClass(node,"selected");
}
if(divs[x]==end){
break;
}
}
}
}
}
for(var x=0,len=list.selection.count;x<len;++x){
dojo.html.addClass(list.selection.item(x),"selected");
}
},_loadAttributeMembers:function(){
if(dojo.lang.isObject(this.searchCache[0])){
return;
}
this.valueListNode.innerHTML="<span style='margin-left:5px'><img src='images/indicator_circle_ball.gif'>&nbsp;"+cvCatalog.progressLoading+"</span>";
this.searchRequestId=this.asyncRequestId=this._initGetMembersRequest("");
if(this.asyncRequestId){
this._getMembers({requestId:this.asyncRequestId,timeout:1,search:""});
}
},_searchValueList:function(e){
var key=this.search.value;
var len=key?key.length:0;
if(key){
key=key.toLowerCase();
}
var _231=this.searchCache[len];
if(this.valueListNode.selection){
this.valueListNode.selection.clear();
}
if(_231&&(len==0||_231.key==key)){
this.valueListNode.innerHTML=this._formatValueList(_231.data,"AVAILABLE",_231.count);
}else{
if(this.searchCacheTopIndex==0||(this.searchCacheTopIndex>0&&key&&key.indexOf(this.searchCache[this.searchCacheTopIndex].key)>=0)){
var _232=this.searchCache[this.searchCacheTopIndex].data;
var _233=[];
for(var x=0,_234=_232.length;x<_234;++x){
if(dojo.string.escape("HTML",_232[x].caption).toLowerCase().indexOf(key)>=0){
_233.push(_232[x]);
}
}
this.searchCache[key.length]={key:key,data:_233};
this.valueListNode.innerHTML=this._formatValueList(_233,"AVAILABLE");
}else{
if(this.searchRequestId){
cv.io.cancelAsyncRequest(this.searchRequestId);
}
this.valueListNode.innerHTML="<span style='margin-left:5px'><img src='images/indicator_circle_ball.gif'>&nbsp;"+cvCatalog.progressLoading+"</span>";
this.searchRequestId=this._initGetMembersRequest(key);
if(this.searchRequestId){
this._getMembers({requestId:this.searchRequestId,timeout:1,search:key});
}
}
}
e.preventDefault();
e.stopPropagation();
return false;
},_initGetMembersRequest:function(_235){
return cv.io.initAsyncRequest({reportXML:this.report.getReportXml(),action:"MEMBERS",attribute:this.attribute,search:_235,newFields:""});
},_getMembers:function(_236){
var _237=this;
_236.stok=cv.securityToken;
this.asyncRequest=dojo.io.bind({url:cv.contextPath+"ajax/getMembers",content:_236,handle:function(type,data,evt){
if(!cv.dlgWidget.isShowing()){
return;
}
_237.status=null;
if(type=="load"){
if(_237.searchRequestId&&_237.searchRequestId!=_236.requestId){
return;
}
if(data){
_237.asyncRequestId=_237.asyncRequest=_237.searchRequestId=null;
_237.searchCacheTopIndex=(!data.count||data.values.length==data.count)?_236.search.length:-1;
if(_236.search.length>0){
_237.searchCache[_236.search.length]={key:_236.search,data:data.values,count:data.count};
}else{
_237.searchCache[0]={key:null,data:data.values,count:data.count};
if(_237.isTimeAttribute){
var _238=dojo.byId("FT_range1"),_239=dojo.byId("FT_range2");
_238.innerHTML=_239.innerHTML="";
cv.util.hide("FT_rangeLoading");
cv.util.show("FT_range1_row","FT_range2_row");
for(var x=0,len=data.values.length;x<len;++x){
var _23a=dojo.string.escape("HTML",data.values[x].caption);
var _23b=data.values[x].formula;
cv.addOption(_238,new Option(_23a,_23b));
cv.addOption(_239,new Option(_23a,_23b));
}
if(data.values.length<data.count){
cv.util.show("FT_rangeWarning");
dojo.byId("FT_rangeWarningText").innerHTML=dojo.string.substituteParams(cvCatalog["dlgAttributeFilterTooManyValues"],data.values.length);
}
}
}
_237.valueListNode.innerHTML=_237._formatValueList(data.values,"AVAILABLE",data.count);
}else{
_236.timeout=1;
_237.asyncRequest=null;
dojo.lang.setTimeout(_237,"_getMembers",5000,_236,1);
}
}else{
_237.asyncRequestId=_237.asyncRequest=_237.searchRequestId=null;
_237.status="dlgErrGeneric";
}
if(_237.status){
_237.displayMsg(cvCatalog[_237.status]);
}
},mimetype:"text/json",method:"POST",sync:this.asyncMode,encoding:"utf8"});
},_formatValueList:function(_23c,_23d,_23e){
var len=_23c?_23c.length:0;
var _23f,str="",_240;
if(_23d=="SELECTED"){
_23f=dojo.byId("FT_memberListStat");
_240="filterSelectionSummary";
}else{
_23f=dojo.byId("FT_valueListStat");
_240=(this.search&&this.search.value)?"filterMatchesSummary":"filterValuesSummary";
}
if(_23f){
if(!_23e||(_23e>=0&&_23e<=len)){
_23f.innerHTML=dojo.string.substituteParams(cvCatalog[_240+(len<=1?"Single":"All")],len);
}else{
_23f.innerHTML=dojo.string.substituteParams(cvCatalog[_240+(_23e==-1?"PartialFirst":"Partial")],len,_23e);
}
}
for(var x=0;x<len;++x){
var val=dojo.string.escape("HTML",_23c[x].formula);
var _241=dojo.string.escape("HTML",_23c[x].caption);
if(_23d=="SELECTED"){
str+="<div id=\"FT_SEL_"+val+"\">"+_241+"</div>";
}else{
if(_23d=="AVAILABLE"){
str+="<div id=\"FT_AVA_"+val+"\">"+_241+"</div>";
}else{
return "";
}
}
}
if(_23e>len){
str+="<div style='font-size:92%'>"+cvCatalog.filterHintForFind+"</div>";
}
return str;
},_getSelectionList:function(){
var _242=this.memberListNode.getElementsByTagName("DIV");
var _243=new dojo.collections.ArrayList();
for(var x=0,len=_242.length;x<len;++x){
_243.add({"formula":_242[x].id.substring(7),"caption":dojo.dom.textContent(_242[x])});
}
return _243;
},_initMatchFilter:function(op){
this.defaultMsg=null;
this.displayMsg();
var _244=dojo.byId("FT_matchOp");
var tbl=dojo.byId("FT_FILTER_MATCH");
dojo.event.connectOnce(tbl,"onclick",this,"_onClickMatchTbl");
dojo.event.connectOnce(dojo.byId("FT_exp_add"),"onclick",this,"_addExpressionItem");
dojo.event.connectOnce(dojo.byId("FT_PARAMETER_ENABLE"),"onclick",this,"_toggleParameterCheckbox");
cv.util.show("FT_PARAMETER");
this.defaultFocus=dojo.byId("FT_expression_0");
var pred=(this.ordinal>0)?this.filterProps.predicates.item(this.ordinal)[0]:null;
if(pred&&(pred.op=="CONTAIN"||pred.op=="NOT_CONTAIN")){
_244.value=pred.op;
if(pred.exp){
for(var x=0;x<pred.exp.length;++x){
this._createExpressionItem(pred.exp[x],x+"");
}
}
if(pred.parameterName){
this._setParameterName(pred.parameterName);
}
}
if(op){
_244.value=op;
}
if(!_244.value){
_244.options[0].selected=true;
}
return true;
},_saveMatchFilter:function(){
var list=this._getExpressionList();
if(list.length==0){
this.displayMsg(cvCatalog.dlgErrFilterRequiredExpression);
return false;
}
var _245=this.report.updateFilterProps(this.filterProps,{ordinal:this.ordinal,op:dojo.byId("FT_matchOp").value,exp:list});
_245.parameterName=dojo.byId("FT_PARAMETER_NAME").value;
if(_245.exp.length>cvConst.MAX_FILTER_EXPRESSIONS){
this.displayMsg(cvCatalog.dlgErrFilterMaxExpressions,cvConst.MAX_FILTER_EXPRESSIONS);
if(_245.ordinal>0&&_245.ordinal!=this.ordinal){
for(var x=0;x<cvConst.MAX_FILTER_EXPRESSIONS;++x){
this._createExpressionItem(_245.exp[x],x+"");
}
this.ordinal=_245.ordinal;
}
return false;
}
return true;
},_addExpressionItem:function(){
var tbl=dojo.byId("FT_FILTER_MATCH");
if(tbl.rows.length==cvConst.MAX_FILTER_EXPRESSIONS+1){
this.displayMsg(cvCatalog.dlgErrFilterMaxExpressions,cvConst.MAX_FILTER_EXPRESSIONS);
return;
}
this._createExpressionItem();
},_onClickMatchTbl:function(e){
if(!(e.target&&e.target.id)){
return;
}
var id=e.target.id;
if(id.indexOf("FT_exp_remove_")==0){
var tbl=dojo.byId("FT_FILTER_MATCH");
var len=tbl.rows.length;
if(len==2){
return;
}
id=parseInt(id.substr(14));
for(var x=id;x<len-2;++x){
dojo.byId("FT_expression_"+x).value=dojo.byId("FT_expression_"+(x+1)).value;
}
if(len==3){
dojo.html.removeClass(tbl,"FT_multiExp");
}
tbl.deleteRow(len-2);
}
},_getExpressionList:function(){
var list=[];
for(var x=0,len=dojo.byId("FT_FILTER_MATCH").rows.length-1;x<len;++x){
var val=dojo.byId("FT_expression_"+x).value;
if(val){
list.push(val);
}
}
return list;
},_createExpressionItem:function(exp,id){
var tbl=dojo.byId("FT_FILTER_MATCH");
if(id){
id=dojo.byId("FT_expression_"+id);
}
if(!id){
id=tbl.rows.length-1;
var tr=tbl.insertRow(id);
var td=tr.insertCell(0);
td.innerHTML=cvCatalog.filterTemplateExpressionOR;
dojo.html.setClass(td,"FT_expressionOR");
td=tr.insertCell(1);
td.innerHTML="<input type=\"text\" id=\"FT_expression_"+id+"\">";
dojo.html.setClass(td,"FT_expression");
td=tr.insertCell(2);
td.innerHTML="&nbsp;";
td.id="FT_exp_remove_"+id;
dojo.html.setClass(td,"FT_removeExp");
if(tbl.rows.length==3){
dojo.html.addClass(tbl,"FT_multiExp");
}
id=dojo.byId("FT_expression_"+id);
}
if(exp){
id.value=exp;
}
},_setParameterName:function(name){
dojo.byId("FT_PARAMETER_ENABLE").checked=true;
dojo.byId("FT_PARAMETER_NAME").disabled=false;
dojo.byId("FT_PARAMETER_NAME").value=name;
},_toggleParameterCheckbox:function(evt){
var cked=evt.target.checked;
var _246=dojo.byId("FT_PARAMETER_NAME");
if(!cked){
_246.value="";
_246.disabled=true;
dojo.html.removeClass(_246,"invalid");
}else{
_246.disabled=false;
_246.focus();
}
},_validateParameter:function(data){
if(this.type=="FILTER_METRIC"){
return true;
}
if(!dojo.byId("FT_PARAMETER_ENABLE").checked){
return true;
}
var text=dojo.byId("FT_PARAMETER_NAME");
if(text.value==""){
this.displayError("Please input a parameter name.");
text.focus();
dojo.html.addClass(text,"invalid");
return false;
}
return true;
}});
dojo.lang.extend(cv.FilterDialog,{showMetricFilter:function(_247,mode){
this.clear();
this.attributeType=this.type="FILTER_METRIC";
if(_247){
if(_247.indexOf("[MEASURE:")==0||cv.getFieldHelp().get(_247,"type")=="NUMBER"){
this.metric=_247;
}else{
this.attribute=_247;
}
}
if(!mode){
mode="CONDITIONS";
}
if(this._initMetricFilter(mode)){
this.showDialog();
}
},_initMetricFilter:function(mode){
this.helpTopic="CV/Business_User/working_with_filters.html#filters_on_number_fields";
if(!this.report.reportDoc.getNode("//cv:attribute")){
this.report.rptDlg.showError("errorNoAttributeInReport","CV/Business_User/working_with_filters.html#filters_on_number_fields");
return false;
}
this.type="FILTER_METRIC";
this.gem=this.report.getGem("filter_metric");
if(this.gem&&((this.attribute&&!this.report.reportDoc.isUsedByMetricFilter(this.attribute))||(this.metric&&!this.report.reportDoc.isUsedByMetricFilter(this.metric)))){
this.attribute=this.metric=null;
}
this.dlgTemplate="filterMetricDlg.html";
if(!this.load()){
this.report.showReportStatus(this.status);
return false;
}
this.filterProps=this.report.reportDoc.getMetricFilter();
this.rankCtrl=dojo.byId("FT_rank");
dojo.event.connect(this.rankCtrl,"onclick",cv.util,"onToggleSectionCheckbox");
var _248=dojo.byId("FT_rankMetric");
this.report.addOptionsForAllMeasures(_248);
if(this.filterProps){
this.attribute=this.filterProps.formula;
if(this.filterProps.rank){
_248.value=this.filterProps.rank.formula;
dojo.byId("FT_rankType").value=this.filterProps.rank.type;
dojo.byId("FT_rankCount").value=this.filterProps.rank.count;
}else{
if(mode!="RANK"){
cv.util.setSectionCollapsed("FT_rank");
}
}
}else{
if(this.metric){
_248.value=this.metric;
}
if(mode!="RANK"){
cv.util.setSectionCollapsed("FT_rank");
}
}
this.conditionsCtrl=dojo.byId("FT_conditions");
dojo.event.connect(this.conditionsCtrl,"onclick",cv.util,"onToggleSectionCheckbox");
dojo.event.connect(dojo.byId("FT_addCondition"),"onclick",this,"_editCondition");
dojo.event.connect(dojo.byId("FT_conditionsList"),"onclick",this,"_onClickConditionsList");
if(this.filterProps&&this.filterProps.conditions){
this.numConditions=this.filterProps.conditions.length;
for(var x=0;x<this.numConditions;++x){
this._updateCondition("FT_condition_"+x,true);
}
}else{
this.numConditions=1;
this._editCondition("FT_condition_0");
if(this.filterProps||mode=="RANK"){
cv.util.setSectionCollapsed("FT_conditions");
}
}
var _249=dojo.byId("FT_attribute");
this.report.addOptionsForAttributes(_249);
if(_249.options.length==1){
this.attribute=_249.options[0].value;
_249.parentNode.innerHTML=dojo.string.substituteParams(cvCatalog.filterMetricSubtitle,_249.options[0].innerHTML);
}else{
if(this.attribute){
_249.value=this.attribute;
}
dojo.event.connect(_249,"onchange",this,"_selectMetricFilterAttribute");
}
this._selectMetricFilterAttribute();
if(!this.filterProps){
this.filterProps={};
}
this.filterProps.type=this.type;
this.filterProps.old=this.attribute;
this.defaultFocus=dojo.byId(mode=="RANK"?"FT_rank":"FT_conditions");
return true;
},_saveMetricFilter:function(){
var _24a=dojo.byId("FT_attribute");
this.filterProps.formula=_24a?_24a.value:this.attribute;
if(this.conditionsCtrl.checked){
if(this.selectedItem&&!this._updateCondition()){
return false;
}
var _24b=this.filterProps.conditions;
for(var i=0;i<_24b.length;++i){
if(_24b[i]){
this.report.addToCheckFieldList(_24b[i].formula);
}
}
}else{
this.filterProps.conditions=null;
}
if(this.rankCtrl.checked){
var _24c={formula:dojo.byId("FT_rankMetric").value,type:dojo.byId("FT_rankType").value,count:dojo.byId("FT_rankCount").value};
var err=this._validateRank(_24c);
if(err){
this.displayMsg(cvCatalog[err]);
return false;
}
_24c.count=parseInt(_24c.count);
this.filterProps.rank=_24c;
this.report.setSortOrder(_24c.formula,_24c.type=="BOTTOM"?"ASC":"DESC",false,true);
this.report.addToCheckFieldList(_24c.formula);
}else{
this.filterProps.rank=null;
}
if(!this.filterProps.conditions&&!this.filterProps.rank){
this.report.removeFilter("filter_metric_0");
this.filterProps=null;
}
return true;
},_editCondition:function(_24d){
if(!this._updateCondition()){
return;
}
var id;
if(!dojo.lang.isString(_24d)){
id=this.filterProps.conditions.length;
++this.numConditions;
_24d="FT_condition_"+id;
}else{
id=parseInt(this._getListItemIndex(_24d));
}
var cond=dojo.byId(_24d);
if(!cond){
cond=document.createElement("div");
dojo.byId("FT_conditionsList").appendChild(cond);
dojo.html.addClass(cond,"filterCondition");
cond.id=_24d;
}
dojo.html.addClass(cond,"filterConditionSelected");
cond.innerHTML=dojo.string.substituteParams(cvCatalog.filterConditionEdit,{GT:cvCatalog["filterConditionOperators_GREATER_THAN"],GTE:cvCatalog["filterConditionOperators_GREATER_THAN_EQUAL"],LT:cvCatalog["filterConditionOperators_LESS_THAN"],LTE:cvCatalog["filterConditionOperators_LESS_THAN_EQUAL"],E:cvCatalog["filterConditionOperators_EQUAL"],NE:cvCatalog["filterConditionOperators_NOT_EQUAL"],B:cvCatalog["filterConditionOperators_BETWEEN"],NE:cvCatalog["filterConditionOperators_NOT_EQUAL"]});
var _24e=dojo.byId("FT_condMetric");
this.report.addOptionsForAllMeasures(_24e);
var op=dojo.byId("FT_condOp");
dojo.event.connect(op,"onchange",this,"_setConditionOperands");
if(this.filterProps&&this.filterProps.conditions&&this.filterProps.conditions[id]){
var val=this.filterProps.conditions[id];
_24e.value=val.formula;
op.value=val.operator;
dojo.byId("FT_condOp1").value=val.op1;
dojo.byId("FT_condOp2").value=val.op2?val.op2:"";
}else{
if(this.metric){
_24e.value=this.metric;
}
}
this._setConditionOperands();
this.selectedItem=_24d;
},_updateCondition:function(_24f,_250){
if(!_24f){
if(!this.selectedItem){
return true;
}
_24f=this.selectedItem;
}
var id=parseInt(this._getListItemIndex(_24f));
var cond=dojo.byId(_24f),_251;
if(!cond){
if(!_250){
return true;
}
cond=document.createElement("div");
dojo.byId("FT_conditionsList").appendChild(cond);
dojo.html.addClass(cond,"filterCondition");
cond.id=_24f;
_251=this.filterProps.conditions[id];
}else{
if(!this.filterProps.conditions){
this.filterProps.conditions=[];
}
if(id==this.filterProps.conditions.length){
this.filterProps.conditions.push({});
}
_251=this.filterProps.conditions[id];
_251.formula=dojo.byId("FT_condMetric").value;
_251.operator=dojo.byId("FT_condOp").value;
_251.op1=dojo.byId("FT_condOp1").value;
_251.op2=_251.operator!="BETWEEN"?null:dojo.byId("FT_condOp2").value;
}
var err=this._validateCondition(_251);
if(err){
this.displayMsg(cvCatalog[err]);
return false;
}else{
cond.innerHTML=dojo.string.substituteParams(cvCatalog.filterConditionStatic,{metric:this.report.getFieldLabel(_251.formula),op:cvCatalog["filterConditionOperators_"+_251.operator],op1:_251.op1?_251.op1:" ",op2:_251.op2?_251.op2:" ",op2Css:_251.op2?" ":"hidden"});
dojo.html.removeClass(cond,"filterConditionSelected");
this.selectedItem=null;
this.displayMsg();
return true;
}
},_onClickConditionsList:function(e){
var node=e.target;
var cond=cv.util.getAncestorByClass(node,"filterCondition");
if(!cond){
return this._updateCondition();
}
if(dojo.html.hasClass(node,"filterConditionDelete")){
if(this.numConditions==1){
return this.displayMsg(cvCatalog.dlgErrFilterLastCondition);
}
var id=this._getListItemIndex(cond.id);
this.filterProps.conditions[id]=null;
if(this.selectedItem==cond.id){
this.selectedItem=null;
}
cv.util.removeNode(cond);
--this.numConditions;
return;
}
if(cond.id==this.selectedItem){
return;
}
if(this._updateCondition()){
this._editCondition(cond.id);
}
},_selectMetricFilterAttribute:function(){
var attr=dojo.byId("FT_attribute");
dojo.byId("FT_rankAttribute").innerHTML=this.report.getFieldLabel(attr?attr.value:this.attribute);
},_setConditionOperands:function(){
var op=dojo.byId("FT_condOp").value,op1=dojo.byId("FT_condOp1"),op2=dojo.byId("FT_condOp2").parentNode;
if(op=="IS_NOT_EMPTY"){
cv.util.hide(op1,op2);
op1.value=op2.value="";
}else{
if(op=="BETWEEN"){
cv.util.show(op1,op2);
}else{
cv.util.show(op1);
cv.util.hide(op2);
op2.value="";
}
}
},_validateCondition:function(_252){
var op1=parseFloat(_252.op1),op2=parseFloat(_252.op2);
if(!_252.formula||!_252.operator){
return "dlgErrFilterConditionRequiredFields";
}
if(_252.operator!="IS_NOT_EMPTY"&&!cv.util.checkNumber(_252.op1)){
this.setInvalidInputField("FT_condOp1");
return "dlgErrFilterConditionNumberExpected";
}
if(_252.operator=="BETWEEN"&&!cv.util.checkNumber(_252.op2)){
this.setInvalidInputField("FT_condOp2");
return "dlgErrFilterConditionNumberExpected";
}
if(op1>=op2){
this.setInvalidInputField("FT_condOp1");
return "dlgErrFilterConditionOp2LTOp1";
}
return null;
},_validateRank:function(_253){
if(!cv.util.checkNumber(_253.count)||parseInt(_253.count)<=0||parseInt(_253.count)!=parseFloat(_253.count)){
this.setInvalidInputField("FT_rankCount");
return "dlgErrFilterRankNumberExpected";
}
if(!_253.formula||!_253.type){
return "dlgErrFilterRankRequiredFields";
}
},_getListItemIndex:function(_254){
return _254.substr(13);
}});
cv.ReportDocument=function(){
this.reportRecord=null;
this.status=null;
this.xmlTemplate="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><reportRecord xmlns=\"http://www.pentaho.com\" >\n"+"<commonStorageAttributes createdBy=\"\" updatedBy=\"\" description=\"\" created=\"\" update=\"\"><path folder=\"\" name=\"\"/></commonStorageAttributes>\n"+"<report cube=\"\" version=\"5\" autoRefresh=\"true\" freezeColumns=\"true\" freezeRows=\"true\" reportTypeEnum=\"PIVOT\" showDrillLinks=\"false\" showRowGrandTotal=\"false\" showColumnGrandTotal=\"false\" useNonVisualTotals=\"false\" showEmptyCells=\"false\" emptyCellDisplay=\"-\">\n"+"<title/><subtitle/>\n<measures/>\n<rowAttributes/><columnAttributes/><filters/>\n"+"</report></reportRecord>";
this.childTags={measures:"measure",columnAttributes:"attribute",rowAttributes:"attribute",filters:"filter"};
this.attributes={measure:{"showAggregate":"true","showSum":"false","showAverage":"false","showCount":"false","showMin":"false","showMax":"false","measureTypeEnum":"VALUE","sortOrderEnum":"NONE"},attribute:{"showSubtotal":"false","sortOrderEnum":"ASC"},filter:{"viewFilterEnum":"NONE"}};
this.reportProps=["name","folder","description","cube","reportTypeEnum","update","updatedBy","created","createdBy","title","subtitle"];
};
cv.ReportDocument.prototype={initialize:function(_255){
this.reportRecord=dojo.dom.createDocumentFromText(_255?_255:this.xmlTemplate);
cv.setDomDefaultNamespace(this.reportRecord);
if(_255){
this.status="reportOpenOK";
}
},getReportNode:function(){
return this.getNode("cv:report");
},getStorageNode:function(){
return this.getNode("cv:commonStorageAttributes");
},getXml:function(){
return dojo.dom.innerXML(this.reportRecord);
},replaceReportNode:function(node){
this.reportRecord.documentElement.replaceChild(node.cloneNode(true),this.getReportNode());
},replaceStorageNode:function(node){
this.reportRecord.documentElement.replaceChild(node.cloneNode(true),this.getStorageNode());
},getReportProperty:function(prop){
var val=null;
switch(prop){
case "catalog":
case "cube":
case "reportTypeEnum":
val=this.getReportNode().getAttribute(prop);
break;
case "title":
val=this.getReportTitle();
break;
case "subtitle":
val=this.getReportSubtitle();
break;
case "name":
case "folder":
val=this.getStoragePathNode().getAttribute(prop);
break;
default:
val=this.getStorageNode().getAttribute(prop);
break;
}
return val;
},setReportProperty:function(prop,val){
switch(prop){
case "catalog":
case "cube":
case "reportTypeEnum":
this.getReportNode().setAttribute(prop,val);
break;
case "title":
this.setReportTitle(val);
break;
case "subtitle":
this.setReportSubtitle(val);
break;
case "name":
case "folder":
this.getStoragePathNode().setAttribute(prop,val);
break;
default:
this.getStorageNode().setAttribute(prop,val);
break;
}
},getReportOptions:function(){
return this.getReportNode().attributes;
},getReportOption:function(key){
return this.getReportNode().getAttribute(key);
},setReportOption:function(key,_256){
this.getReportNode().setAttribute(key,_256);
},getStoragePathNode:function(){
return this.getNode("cv:commonStorageAttributes/cv:path");
},getReportTitle:function(){
var _257=this.getNode("cv:report/cv:title");
return _257?dojo.dom.textContent(_257):null;
},setReportTitle:function(str){
var _258=this.getNode("cv:report/cv:title");
if(!_258){
_258=this.reportRecord.createElement("title");
this.getReportNode().appendChild(_258);
}
cv.textContent(_258,str);
},getReportSubtitle:function(){
var st=this.getNode("cv:report/cv:subtitle");
return st?dojo.dom.textContent(st):null;
},setReportSubtitle:function(str){
var st=this.getNode("cv:report/cv:subtitle");
if(!st){
st=this.reportRecord.createElement("subtitle");
this.getReportNode().appendChild(st);
}
cv.textContent(st,str);
},setChartOption:function(name,_259){
var opts=this.getChartOptions();
opts.setAttribute(name,_259);
},getChartOption:function(name){
var opts=this.getChartOptions();
return opts.getAttribute(name);
},getChartOptions:function(){
var _25a=this.getNode("cv:report/cv:chartOptions");
if(!_25a){
_25a=this._createXmlNode("chartOptions",{"showLegend":"true","autoRange":"true","legendPosition":"RIGHT","legendBackgroundColor":"#ffffff","legendSize":12,"legendStyle":"PLAIN","legendColor":"#000000","legendFontFamily":"Default","displayUnits":"UNITS_0","lineWidth":2,"lineShape":"CIRCLE","maxValues":100,"backgroundColor":"#ffffff","backgroundColorEnd":"#ffffff","labelColor":"#000000","backgroundFill":"NONE","labelSize":12,"labelStyle":"PLAIN","labelFontFamily":"Default","maxChartsPerRow":3,"chartType":"VERTICAL_BAR"});
for(x in cv.prefs.chartOptions){
_25a.setAttribute(x,cv.prefs.chartOptions[x]);
}
this.getReportNode().appendChild(_25a);
}
return _25a;
},getReplaced:function(){
return this.getNode("cv:report/cv:attributeReplacement");
},setReplaced:function(_25b,opts){
var node=this.getReplaced();
if(node){
if(!opts){
cv.util.removeNode(node);
return;
}
dojo.dom.removeChildren(node);
}else{
node=this._createXmlNode("attributeReplacement");
this.getReportNode().appendChild(node);
}
node.setAttribute("formula",_25b);
for(var x=0;x<opts.length;++x){
var opt=this._createXmlNode("replacementOption");
cv.textContent(opt,opts[x]);
node.appendChild(opt);
}
},replaceAttribute:function(_25c){
var node=this.getReplaced();
if(!node){
return;
}
var cur=node.getAttribute("formula");
if(cur==_25c){
return;
}
node.setAttribute("formula",_25c);
var opts=node.selectNodes("cv:replacementOption");
for(var x=0;x<opts.length;++x){
if(cv.textContent(opts[x])==_25c){
cv.textContent(opts[x],cur);
break;
}
}
},isNew:function(){
return !this.getStorageNode().getAttribute("created");
},isEmpty:function(){
var _25d=this.getReportNode().selectNodes("cv:measures/cv:measure|*/cv:attribute");
return !_25d||_25d.length==0;
},getSortedMetric:function(){
return this.getNode("cv:report/cv:measures/cv:measure[@sortOrderEnum!='NONE']");
},createNode:function(_25e){
var node;
var _25f=this._createXmlNode(this.childTags[_25e.zoneId]);
if(_25e.formula){
_25f.setAttribute("formula",_25e.formula);
}
if(_25e.metricType){
if(dojo.lang.inArray(["PCTOF","RSUM","PCTRSUM","RANK"],_25e.metricType)){
node=this._createXmlNode("summaryFacet",{"summaryAcrossEnum":_25e.sumAcross,"useNonVisualTotals":_25e.sumTotal});
if(_25e.sumAcross=="LABEL"){
node.setAttribute("breakAttributeFormula",_25e.sumBreakBy);
}
}else{
if(_25e.metricType=="EXPRESSION"){
node=this._createXmlNode("expression");
cv.textContent(node,_25e.expression);
}else{
if(_25e.metricType=="TREND"){
node=this._createXmlNode("trendFacet",{"trendTypeEnum":_25e.trendType,"trendDirectionEnum":_25e.trendDir,"amount":_25e.trendAmount,"trendAttributeFormula":_25e.trendField});
}
}
}
_25f.setAttribute("measureTypeEnum",_25e.metricType);
if(node){
_25f.appendChild(node);
}
}
if(_25e.label){
node=this._createXmlNode("displayLabels");
_25f.appendChild(node);
node.appendChild(this._createXmlNode("displayLabel",{"label":_25e.label,"locale":_25e.locale}));
}
return _25f;
},getNode:function(_260,_261){
if(!_261){
_261=this.reportRecord.documentElement;
}
return _261.selectSingleNode(_260);
},getChildMembers:function(){
var path="";
for(var i=0;i<this.getChildMembers.arguments.length;++i){
if(i>0){
path+=" | ";
}
path+="cv:"+this.getChildMembers.arguments[i]+"/cv:"+this.childTags[this.getChildMembers.arguments[i]];
}
return this.getReportNode().selectNodes(path);
},getTimeAttributes:function(){
var _262=this.getReportNode().selectNodes("*/cv:attribute"),_263=null;
if(_262&&_262.length>0){
for(var x=0;x<_262.length;++x){
var _264=_262[x].getAttribute("formula");
if(cv.getFieldHelp().isTimeAttribute(_264,true)){
if(!_263){
_263=[_264];
}else{
_263.push(_264);
}
}
}
}
return _263;
},getReportZoneNode:function(zone){
return this.reportRecord.documentElement.selectSingleNode("cv:report/cv:"+zone);
},getFirstMetricDependent:function(id){
var _265=this.getReportNode().selectNodes("cv:measures/cv:measure[@measureTypeEnum!='VALUE' and @id!='"+id+"']");
for(var i=0;_265&&i<_265.length;++i){
var _266=_265[i];
if((_266.getAttribute("measureTypeEnum")=="EXPRESSION"&&cv.textContent(_266.selectSingleNode("cv:expression")).indexOf(id)>=0)||_266.getAttribute("formula")==id){
return _266;
}
}
return null;
},getMetrics:function(_267){
return this.getReportNode().selectNodes("cv:measures/cv:measure"+(_267?"[@measureTypeEnum='"+_267+"']":""));
},getNextMetricId:function(){
var id=0,_268=this.getNode("cv:report/cv:measures");
while(this.getNode("cv:measure[@id='[MEASURE:"+id+"]']",_268)){
++id;
}
return "[MEASURE:"+id+"]";
},getNumberFormat:function(_269){
var _26a;
if(dojo.lang.isString(_269)){
_26a=this.getNode("cv:report/cv:measures/cv:measure[@formula=\""+_269+"\"]/cv:numberFormat");
}else{
_26a=_269.selectSingleNode("cv:numberFormat");
}
var exp="";
if(_26a){
var _26b=_26a.selectSingleNode("cv:formatExpression");
if(_26b){
exp=cv.textContent(_26b);
}
}
return _26a?{formatCategory:_26a.getAttribute("formatCategory"),formatScale:_26a.getAttribute("formatScale"),formatExpression:exp,formatShortcut:_26a.getAttribute("formatShortcut")}:null;
},setNumberFormat:function(_26c,_26d){
if(dojo.lang.isString(_26c)){
_26e=this.getNode("cv:report/cv:measures/cv:measure[@formula=\""+_26c+"\"]/cv:numberFormat");
}
if(!_26c){
return false;
}
var _26e=_26c.selectSingleNode("cv:numberFormat");
if(!_26e){
_26e=this._createXmlNode("numberFormat");
_26c.appendChild(_26e);
_26e.setAttribute("formatShortcut","NONE");
_26e.setAttribute("formatCategory","Default");
_26e.setAttribute("formatScale","0");
}
if(_26d.formatCategory){
_26e.setAttribute("formatCategory",_26d.formatCategory);
}
if(_26d.formatScale){
_26e.setAttribute("formatScale",_26d.formatScale);
}
if(_26d.formatShortcut){
_26e.setAttribute("formatShortcut",_26d.formatShortcut);
}
var _26f=_26e.selectSingleNode("cv:formatExpression");
if(!_26f){
_26f=this._createXmlNode("formatExpression");
_26e.appendChild(_26f);
}
if(_26d.formatExpression){
cv.textContent(_26f,_26d.formatExpression);
}
},updateDisplayLabel:function(node,_270,_271,_272){
var _273=!_270&&!_271;
var _274=null,_275=node.selectSingleNode("cv:displayLabels");
if(!_275){
if(_273){
return;
}
_275=this._createXmlNode("displayLabels");
node.appendChild(_275);
}else{
_274=_275.selectSingleNode(_272?"cv:displayLabel[locale='"+_272+"']":"cv:displayLabel");
}
if(!_274){
if(_273){
return;
}
_274=this._createXmlNode("displayLabel");
_275.appendChild(_274);
}
if(_273){
_275.removeChild(_274);
if(!_275.selectSingleNode("cv:displayLabel")){
node.removeChild(_275);
}
return null;
}
_274.setAttribute("label",_270?_270:"");
_274.setAttribute("labelPlural",_271?_271:"");
_274.setAttribute("locale",_272?_272:"");
return _274;
},getFilters:function(_276){
var path="cv:report/cv:filters/cv:filter";
if(_276){
path+="[@viewFilterEnum='"+_276+"']";
}
return this.reportRecord.documentElement.selectNodes(path);
},getFilterProps:function(_277){
var _278={formula:_277.getAttribute("formula"),viewFilterEnum:_277.getAttribute("viewFilterEnum"),predicates:null};
var _279=_277.selectNodes("cv:predicates/cv:predicate");
if(!_279||_279.length==0){
return _278;
}
_278.predicates=new dojo.collections.Dictionary();
var _27a;
var _27b;
for(var x=0;x<_279.length;++x){
_27b=_279[x].getAttribute("ordinal");
var pred={ordinal:_27b,op:_279[x].getAttribute("operatorEnum"),preset:_279[x].getAttribute("preset"),parameterName:_279[x].getAttribute("parameterName")};
if(pred.op=="CONTAIN"||pred.op=="NOT_CONTAIN"){
var exp=_279[x].selectNodes("cv:containsExpression");
pred.exp=[];
for(var y=0,len=exp.length;len>0&&y<len;++y){
pred.exp.push(cv.textContent(exp[y]));
}
}else{
var mem=_279[x].selectNodes("cv:member");
var len=mem.length;
pred.members=[];
for(var y=0;len>0&&y<len;++y){
var _27c=mem[y].getAttribute("formula");
if(!_27c){
pred.members.push(parseInt(mem[y].getAttribute("pos")));
if(y>0){
_27a+=","+mem[y].getAttribute("pos");
}else{
_27a=mem[y].getAttribute("pos");
}
}else{
pred.members.push({"formula":_27c,"caption":mem[y].getAttribute("caption")});
}
}
if(_27a){
pred.preset=_27a;
}
_27a=null;
}
if(_278.predicates.contains(_27b)){
_278.predicates.item(_27b).push(pred);
}else{
var _27d=[];
_27d.push(pred);
_278.predicates.add(_27b,_27d);
}
}
return _278;
},removeFilterPredicate:function(_27e,_27f){
var _280=this.getFilterProps(_27e);
if(!_280){
return _27e;
}
_280.predicates.remove(_27f);
var _281=this.updateFilter(_280);
return _281&&_281.selectSingleNode("cv:predicates/cv:predicate")?_281:null;
},updateFilter:function(_282){
if(!_282.conditions&&!_282.rank&&!_282.predicates){
return null;
}
var _283=null,zone=this.getReportZoneNode("filters");
if(_282.type=="FILTER_METRIC"){
if(_282.old){
_283=this.getNode("cv:report/cv:filters/cv:filter[@formula=\""+_282.old+"\"]");
if(_283){
var _284=this.getNode("cv:conditions",_283);
if(_284){
_283.removeChild(_284);
}
_284=this.getNode("cv:topBottom",_283);
if(_284){
_283.removeChild(_284);
}
if(_282.old!=_282.formula&&_283.childNodes.length==0){
zone.removeChild(_283);
}
}
}
if(!_282.old||_282.old!=_282.formula){
_283=this.getNode("cv:report/cv:filters/cv:filter[@formula=\""+_282.formula+"\"]");
}
}else{
_283=this.getNode("cv:report/cv:filters/cv:filter[@formula=\""+_282.formula+"\"]");
if(_283){
cv.util.removeNode(this.getNode("cv:predicates",_283));
}
}
if(!_283){
_283=this._createXmlNode("filter",{"formula":_282.formula,"viewFilterEnum":"MULTIPLE"});
this.getReportZoneNode("filters").appendChild(_283);
}
if(_282.conditions){
var _285=this._createXmlNode("conditions");
for(var i=0;i<_282.conditions.length;++i){
if(!_282.conditions[i]){
continue;
}
var cond=this._createXmlNode("condition");
for(var x in _282.conditions[i]){
if(_282.conditions[i][x]){
cond.setAttribute(x,_282.conditions[i][x]);
}
}
_285.appendChild(cond);
}
_283.appendChild(_285);
}
if(_282.rank){
var rank=this._createXmlNode("topBottom");
for(var x in _282.rank){
if(_282.rank[x]){
rank.setAttribute(x,_282.rank[x]);
}
}
_283.appendChild(rank);
}
if(_282.predicates&&_282.predicates.getKeyList()&&_282.predicates.getKeyList().length>0){
var _286=_282.predicates.getKeyList();
var _287=[];
for(var x=0;x<_286.length;x++){
var _288=[];
var _289=_282.predicates.item(_286[x]);
if(_289.length>0){
var _28a=this.getOrderKey(_289);
if(_287.length>0){
var _28b=_287.length-1;
for(;_28b>=0;_28b--){
if(this.getOrderKey(_287[_28b])>_28a){
_288.push(_287.pop());
}else{
break;
}
}
_287.push(_289);
if(_288.length>0){
_287=_287.concat(_288.reverse());
}
}else{
_287.push(_289);
}
}
}
var _28c;
var _28d=this.getNode("cv:predicates",_283);
if(!_28d){
_28d=this._createXmlNode("predicates");
}
for(var i=0;i<_287.length;i++){
_28c=_287[i];
if(!_28c){
continue;
}
for(var j=0;j<_28c.length;j++){
var pred=_28c[j];
if(!pred){
continue;
}
var _28e=this._createXmlNode("predicate",{"ordinal":i+1,"operatorEnum":pred.op});
if(pred.preset){
pred.members=[];
var pos=pred.preset.split(",");
for(var x=0;x<pos.length;++x){
pred.members.push(parseInt(pos[x]));
}
}
var memb=pred.members;
for(var x=0;memb&&x<memb.length;++x){
var _28f=this._createXmlNode("member");
if(dojo.lang.isNumber(memb[x])){
_28f.setAttribute("pos",memb[x]);
}else{
_28f.setAttribute("pos","0");
_28f.setAttribute("formula",memb[x].formula);
_28f.setAttribute("caption",memb[x].caption);
}
_28e.appendChild(_28f);
}
if(pred.exp){
for(var x=0;x<pred.exp.length;++x){
var _290=this._createXmlNode("containsExpression");
_290.appendChild(this.reportRecord.createTextNode(pred.exp[x]));
_28e.appendChild(_290);
}
}
if(pred.parameterName){
_28e.setAttribute("parameterName",pred.parameterName);
}
_28d.appendChild(_28e);
}
}
_283.appendChild(_28d);
}
if(this.removeEmptyFilter(_283)){
return null;
}
if(_282.viewFilterEnum){
_283.setAttribute("viewFilterEnum",_282.viewFilterEnum);
}
return _283;
},getOrderKey:function(_291){
var _292=new dojo.collections.Dictionary();
_292.add("EQUAL",2);
_292.add("TIME_YAGO",2);
_292.add("TIME_RANGE_PREV",2);
_292.add("TIME_RANGE_NEXT",2);
_292.add("TIME_AGO",2);
_292.add("TIME_AHEAD",2);
_292.add("CONTAIN",3);
_292.add("BETWEEN",4);
_292.add("AFTER",5);
_292.add("BEFORE",6);
_292.add("NOT_EQUAL",7);
_292.add("NOT_CONTAIN",8);
var _293;
if(_291[0].op=="EQUAL"){
var mems=_291[0].members;
if(_291[0].preset||dojo.lang.isNumber(mems[0])){
_293=2;
}else{
_293=1;
}
}else{
_293=_292.item(_291[0].op);
}
return _293;
},getMetricFilter:function(){
var _294=null,cond=null;
var rank=this.getNode("cv:report/cv:filters/cv:filter/cv:topBottom");
if(rank){
_294=rank.parentNode;
cond=this.getNode("cv:conditions",_294);
}else{
cond=this.getNode("cv:report/cv:filters/cv:filter/cv:conditions");
if(cond){
_294=cond.parentNode;
}
}
if(!_294){
return null;
}
var _295={node:_294,formula:_294.getAttribute("formula"),conditions:null,rank:null};
if(rank){
_295.rank={};
var attr=rank.attributes;
for(var x=0;x<attr.length;++x){
_295.rank[attr[x].name]=attr[x].value;
}
}
if(cond){
conds=cond.getElementsByTagName("condition");
_295.conditions=new Array(conds.length);
for(var i=0;i<conds.length;++i){
var attr=conds[i].attributes;
_295.conditions[i]={};
for(var x=0;x<attr.length;++x){
_295.conditions[i][attr[x].name]=attr[x].value;
}
}
}
return _295;
},getMetricFilterNode:function(){
var node=this.getNode("cv:report/cv:filters/cv:filter/cv:conditions | cv:report/cv:filters/cv:filter/cv:topBottom");
return node?node.parentNode:null;
},isUsedByMetricFilter:function(id,_296){
var _297=this.getMetricFilter();
if(!_297){
return null;
}
if(_297.formula==id){
return (!_296||(_296=="RANK"&&_297.rank)||(_296=="CONDITIONS"&&_297.conditions))?_297.node:null;
}
if(_297.rank&&_297.rank["formula"]==id&&(!_296||_296=="RANK")){
return _297.node;
}
if(_297.conditions&&(!_296||_296=="CONDITIONS")){
for(var x=0;x<_297.conditions.length;++x){
if(_297.conditions[x]["formula"]==id){
return _297.node;
}
}
}
return null;
},removeFromMetricFilter:function(id){
var _298=this.isUsedByMetricFilter(id);
if(!_298){
return false;
}
var cond=this.getNode("cv:conditions",_298);
var rank=this.getNode("cv:topBottom",_298);
if(_298.getAttribute("formula")==id){
if(cond){
_298.removeChild(cond);
}
if(rank){
_298.removeChild(rank);
}
}else{
if(cond){
conds=cond.getElementsByTagName("condition");
var _299=conds.length;
for(var i=0;i<conds.length;++i){
if(conds[i].getAttribute("formula")==id){
cond.removeChild(conds[i]);
--_299;
}
}
if(_299==0){
_298.removeChild(cond);
}
}
if(rank&&rank.getAttribute("formula")==id){
_298.removeChild(rank);
}
}
this.removeEmptyFilter(_298);
return true;
},removeEmptyFilter:function(_29a){
if(_29a&&_29a.selectSingleNode("cv:conditions|cv:topBottom|cv:predicates/cv:predicate")){
return false;
}
cv.util.removeNode(_29a);
return true;
},updateCalculateSubtotalsUsingFormula:function(_29b,_29c){
return _29c.setAttribute("calculateSubtotalsUsingFormula",_29b);
},addMemberProperty:function(node,_29d){
var prop=this._createXmlNode("property",{"name":_29d});
node.appendChild(prop);
},addLink:function(node,_29e,_29f){
var link=this._createXmlNode("link",_29e);
if(_29f){
for(var x in _29f){
var _2a0=this._createXmlNode("linkParam",{name:x,value:_29f[x]});
link.appendChild(_2a0);
}
}
node.appendChild(link);
},_createXmlNode:function(_2a1,_2a2){
var _2a3=cv.createNode(this.reportRecord,_2a1);
var x,_2a4=this.attributes[_2a1];
for(x in _2a4){
_2a3.setAttribute(x,_2a4[x]);
}
for(x in _2a2){
_2a3.setAttribute(x,_2a2[x]);
}
return _2a3;
}};
dojo.declare("cv.ReportDropTarget",dojo.dnd.HtmlDropTarget,function(_2a5,_2a6,_2a7){
this.report=_2a7;
this.curItem=null;
this.dropIndicator=document.createElement("div");
with(this.dropIndicator.style){
position="absolute";
zIndex=999;
overflow="hidden";
fontSize="8px";
}
if(!dojo.html.hasParent(this.dropIndicator)){
document.body.appendChild(this.dropIndicator);
}
cv.util.hide(this.dropIndicator);
},{init:function(_2a8){
this.reportFormat=_2a8;
if(_2a8=="PIVOT"){
this.zones={measures:this.report.byClass("ZONE_measures"),rowAttributes:this.report.byClass("ZONE_rowAttributes"),columnAttributes:this.report.byClass("ZONE_columnAttributes")};
if(this.zones.rowAttributes&&this.zones.rowAttributes.getElementsByTagName("TD").length==0){
this.zones.rowAttributes=this.report.byClass("pivotTableRowLabelHeaderContainer");
}
if(this.zones.columnAttributes&&this.zones.columnAttributes.getElementsByTagName("TR").length==0){
this.zones.columnAttributes=this.report.byClass("pivotTableColumnHeaderSection");
}
}else{
this.zones=null;
this.childBoxes=[];
this.zoneId=null;
}
},onDragOver:function(e){
if(this.report.isResizing||!this.report.history.isStateRefreshed()){
return;
}
if(!this.accepts(e.dragObjects)){
if(e.target.style&&e.target.style.cursor&&(dojo.html.hasClass(e.target,"dropZoneItem")||dojo.html.hasClass(e.target,"gemLabel")||dojo.html.hasClass(e.target,"dragObj"))){
e.target.style.cursor="not-allowed";
}
return false;
}
if(e.target.style&&e.target.style.cursor){
e.target.style.cursor="move";
}
if(this.reportFormat!="PIVOT"){
return true;
}
this.childBoxes={measures:[],rowAttributes:[],columnAttributes:[]};
var i,_2a9=this.zones["measures"]?this.zones["measures"].getElementsByTagName("TD"):null;
var _2aa=this.report.byClass("pivotTable");
if(_2aa){
var _2ab=dojo.html.getAbsolutePosition(_2aa,true);
_2ab.x=_2ab.y+dojo.html.getBorderBox(_2aa).height;
var len=_2a9?_2a9.length:0;
if(len>20){
len=20;
}
for(i=0;i<len;++i){
if(_2a9[i].getAttribute("type")!="measure"){
continue;
}
var pos=dojo.html.getAbsolutePosition(_2a9[i],true);
this.childBoxes["measures"].push({top:_2ab.y,bottom:_2ab.x,left:pos.x,right:pos.x+dojo.html.getBorderBox(_2a9[i]).width,node:_2a9[i]});
}
_2a9=this.zones["rowAttributes"]?this.zones["rowAttributes"].getElementsByTagName("TD"):null;
var _2ac=null;
for(i=0;_2a9&&i<_2a9.length;++i){
var pos=dojo.html.getAbsolutePosition(_2a9[i],true);
if(_2a9[i].getAttribute("formula")==_2ac){
this.childBoxes["rowAttributes"][this.childBoxes["rowAttributes"].length-1]["right"]=pos.x+dojo.html.getBorderBox(_2a9[i]).width;
}else{
this.childBoxes["rowAttributes"].push({top:_2ab.y,bottom:_2ab.x,left:pos.x,right:pos.x+dojo.html.getBorderBox(_2a9[i]).width,node:_2a9[i]});
}
_2ac=_2a9[i].getAttribute("formula");
}
_2a9=this.zones["columnAttributes"]?this.zones["columnAttributes"].getElementsByTagName("TR"):null;
_2ac=null;
for(i=0;_2a9&&i<_2a9.length;++i){
var fc=_2a9[i].firstChild;
if(!fc||(fc.getAttribute("type")!="attribute"&&fc.getAttribute("type")!="prop")){
break;
}
var pos=dojo.html.getAbsolutePosition(_2a9[i],true);
var box=dojo.html.getBorderBox(_2a9[i]);
if(fc.getAttribute("formula")==_2ac){
this.childBoxes["columnAttributes"][this.childBoxes["columnAttributes"].length-1]["bottom"]=pos.y+box.height;
}else{
this.childBoxes["columnAttributes"].push({top:pos.y,bottom:pos.y+box.height,left:pos.x,right:pos.x+box.width,node:fc});
}
_2ac=fc.getAttribute("formula");
}
}
if(this.reportFormat=="PIVOT"){
cv.util.show(this.dropIndicator);
}
return true;
},onDragMove:function(e,_2ad){
if(this.report.isResizing){
return;
}
if(e.target.style&&e.target.style.cursor){
e.target.style.cursor="move";
}
if(this.reportFormat!="PIVOT"){
return;
}
this._getZoneIdForPivot(e,_2ad[0]);
this.position=this._getNodeUnderMouse(e);
var _2ae=this.childBoxes[this.zoneId];
var _2af=true;
if(this.position<0){
if(_2ae.length){
_2af=(dojo.html.gravity(_2ae[0].node,e)&this.gravity);
}
}else{
_2af=(dojo.html.gravity(_2ae[this.position].node,e)&this.gravity);
}
this.placeIndicator(e,_2ad,this.position,_2af);
},onDragOut:function(e){
if(e.target.style&&e.target.style.cursor){
e.target.style.cursor="move";
}
if(this.reportFormat=="PIVOT"&&this.dropIndicator){
cv.util.hide(this.dropIndicator);
}
if(this.hoverMetric){
dojo.html.removeClass(this.hoverMetric,"metricHover");
this.hoverMetric=null;
}
},onDrop:function(e){
this.onDragOut(e);
var type=e.dragObject.type;
var _2b0=e.dragObject.domNode;
var _2b1=_2b0.getAttribute("formula");
if(type.length==1&&this.reportFormat!="PIVOT"){
return this.report.appendGem(_2b1);
}
var _2b2,_2b3,_2b4,gem,ok=true;
this._getZoneIdForPivot(e,e.dragObject);
this.position=this._getNodeUnderMouse(e);
var _2b5=this.childBoxes[this.zoneId];
if(!_2b5){
return false;
}
if(this.position<0){
if(_2b5.length){
if(dojo.html.gravity(_2b5[0].node,e)&this.gravity){
_2b2=this.report.getGemFromDomNode(_2b5[0].node);
if(_2b2){
_2b3=_2b2.domNode;
_2b4="before";
}
}else{
_2b2=this.report.getGemFromDomNode(_2b5[_2b5.length-1].node);
if(_2b2){
_2b3=_2b2.domNode;
_2b4="after";
}
}
}else{
_2b3=this.report.byId(this.zoneId);
_2b4="append";
}
}else{
var node=_2b5[this.position].node;
_2b2=this.report.getGemFromDomNode(node);
if(_2b2){
_2b3=_2b2.domNode;
_2b4=dojo.html.gravity(node,e)&this.gravity?"before":"after";
}
}
if(!_2b4){
return false;
}
this.actionStr="";
if(type.length==1){
ok=this.report.checkDuplicateGem(_2b1);
if(ok){
ok=this.report.checkGemHierarchy(this.zoneId,_2b0);
}
if(!ok){
return false;
}
gem=this.report.createGem({zoneId:this.zoneId,formula:_2b1});
this.curItem=gem.domNode;
this.actionStr="actionAdd";
}else{
if(type.length==2){
gem=this.report.getGemFromDomNode(_2b0);
if(!this.report.checkGemHierarchy(this.zoneId,gem.domNode,{refId:_2b3.id,pos:_2b4})){
return true;
}
gem.setZone(_2b2?_2b2.zone:_2b3);
this.curItem=gem.domNode;
this.actionStr="actionMove";
}else{
return false;
}
}
ok=this.insert(e,_2b3,_2b4);
this.curItem=null;
return ok;
},_getNodeUnderMouse:function(e){
var _2b6=this.childBoxes[this.zoneId];
for(var i=0,_2b7;_2b6&&i<_2b6.length;++i){
with(_2b6[i]){
if(e.pageX>=left&&e.pageX<=right&&e.pageY>=top&&e.pageY<=bottom){
return i;
}
}
}
return -1;
},_getZoneIdForPivot:function(e,obj){
if(this.reportFormat!="PIVOT"){
return;
}
this.gravity=dojo.html.gravity.WEST;
if(obj.type=="V"||obj.type=="VM"){
this.zoneId="measures";
}else{
if(this.zones["rowAttributes"]&&dojo.html.overElement(this.zones["rowAttributes"],e)){
this.zoneId="rowAttributes";
}else{
if(this.zones["columnAttributes"]&&dojo.html.overElement(this.zones["columnAttributes"],e)){
this.zoneId="columnAttributes";
this.gravity=dojo.html.gravity.NORTH;
}else{
this.zoneId="rowAttributes";
}
}
}
},placeIndicator:function(e,_2b8,i,_2b9){
if(!this.zoneId){
return;
}
var _2ba=this.dropIndicator.style;
var _2bb=this.childBoxes[this.zoneId];
var len=_2bb.length;
var zone=this.zones[this.zoneId];
if(!zone){
zone=this.domNode;
}
if(this.gravity==dojo.html.gravity.NORTH){
var top,_2bc=dojo.html.getContentBoxWidth(this.domNode);
if(i<0){
if(len){
top=_2b9?_2bb[0].top:_2bb[len-1].bottom;
}else{
top=dojo.html.getAbsolutePosition(zone,true).y;
}
}else{
top=_2b9?_2bb[i].top:_2bb[i].bottom;
}
_2ba.width=(_2bc+15)+"px";
_2ba.height="28px";
_2ba.left=(dojo.html.getAbsolutePosition(this.domNode,true).x-14)+"px";
_2ba.top=(top-14)+"px";
this.dropIndicator.innerHTML="<div style='position:relative;top:6px;height:16px;width:14px;float:left;overflow:hidden;background:url(images/dnd_left_arrow.png) no-repeat;'></div>"+"<div style='position:relative;top:10px;height:12px;width:"+(_2bc-18)+"px;float:left;background:url(images/dnd_horz_line.png) repeat-x;'></div>"+"<div style='position:relative;top:6px;height:16px;width:14px;float:left;overflow:hidden;background:url(images/dnd_right_arrow.png) no-repeat;'></div>";
}else{
var left,_2bd=dojo.html.getContentBox(this.domNode).height;
if(this.zoneId=="measures"&&len){
if(i<0||i>=len){
i=(_2b9?0:len-1);
}
if(this.hoverMetric&&this.hoverMetric!=_2bb[i].node){
dojo.html.removeClass(this.hoverMetric,"metricHover");
}
this.hoverMetric=_2bb[i].node;
dojo.html.addClass(this.hoverMetric,"metricHover");
}
if(i<0){
if(len){
left=_2b9?_2bb[0].left:_2bb[len-1].right;
}else{
if(this.zoneId=="measures"&&this.zones.columnAttributes){
zone=this.zones.columnAttributes;
}
left=dojo.html.getAbsolutePosition(zone,true).x;
}
}else{
left=_2b9?_2bb[i].left:_2bb[i].right;
}
_2ba.left=(left-14)+"px";
_2ba.height=(_2bd+10)+"px";
_2ba.width="28px";
_2ba.top=(dojo.html.getAbsolutePosition(this.domNode,true).y-7)+"px";
this.dropIndicator.innerHTML="<div style='position:relative;left:6px;width:16px;height:14px;overflow:hidden;background:url(images/dnd_top_arrow.png);'></div>"+"<div style='position:relative;left:11px;width:7px;height:"+(_2bd-22)+"px;background:url(images/dnd_vert_line.png) repeat-y;'></div>"+"<div style='position:relative;left:6px;width:16px;height:14px;overflow:hidden;background:url(images/dnd_bottom_arrow.png);'></div>";
}
},insert:function(e,_2be,_2bf){
if(_2be==this.curItem){
return false;
}
return this.report.insertGem(this.curItem.id,_2be.id,_2bf,this.actionStr);
}});
dojo.declare("cv.DataZoneDropTarget",dojo.dnd.HtmlDropTarget,function(_2c0,_2c1,_2c2,_2c3){
this.report=_2c3;
this.dndSuffix=_2c2;
this.curItem=null;
},{onDragOver:function(e){
if(this.report.isResizing){
return;
}
if(!dojo.lang.inArray(this.acceptedTypes,e.dragObjects[0].type)){
if(e.target.style&&e.target.style.cursor&&(dojo.html.hasClass(e.target,"dropZoneItem")||dojo.html.hasClass(e.target,"gemLabel")||dojo.html.hasClass(e.target,"dragObj"))){
e.target.style.cursor="not-allowed";
}
return false;
}
cv.util.setDivActive(this.domNode,true);
return cv.DataZoneDropTarget.superclass.onDragOver.call(this,e);
},onDragOut:function(e){
if(e.target.style&&e.target.style.cursor&&e.target.style.cursor=="not-allowed"){
e.target.style.cursor="move";
}
cv.util.setDivActive(this.domNode,false);
return cv.DataZoneDropTarget.superclass.onDragOut.call(this,e);
},onDrop:function(e){
var type=e.dragObject.type;
var _2c4=e.dragObject.domNode;
var _2c5=_2c4.getAttribute("formula");
var _2c6=this.report.getFieldLabel(_2c4);
var _2c7=this.domNode.id.substring(this.report.id.length);
this.actionStr="";
this.onDragOut(e);
var ok=true;
var i=this._getNodeUnderMouse(e),_2c8,_2c9;
if(i<0){
if(this.childBoxes.length){
if(dojo.html.gravity(this.childBoxes[0].node,e)&dojo.html.gravity.WEST){
_2c9=this.childBoxes[0].node;
_2c8="before";
}else{
_2c9=this.childBoxes[this.childBoxes.length-1].node,_2c8="after";
}
}else{
_2c9=this.domNode;
_2c8="append";
}
}else{
_2c9=this.childBoxes[i].node;
_2c8=(dojo.html.gravity(_2c9,e)&dojo.html.gravity.WEST)?"before":"after";
}
if(type.length==1){
ok=this.report.checkDuplicateGem(_2c5);
if(ok){
ok=this.report.checkGemHierarchy(_2c7,_2c4);
}
if(!ok){
return false;
}
this.curItem=this.report.createGem({zoneId:_2c7,formula:_2c5});
this.actionStr="actionAdd";
}else{
if(type.length==2){
this.curItem=this.report.getGemFromDomNode(_2c4);
if(type.charAt(1)!=this.dndSuffix){
if(!this.report.checkGemHierarchy(_2c7,_2c4,{refId:_2c9.id,pos:_2c8})){
return true;
}
this.curItem.setZone(this.domNode);
}
this.actionStr="actionMove";
}
}
var bOk=false;
if(this.curItem){
bOk=this.insert(e,_2c9,_2c8);
this.curItem=null;
}
return bOk;
},onDragMove:function(e,_2ca){
if(this.report.isResizing){
return;
}
var i=this._getNodeUnderMouse(e);
if(!this.dropIndicator){
this.createDropIndicator();
}
if(i<0){
if(this.childBoxes.length){
var _2cb=(dojo.html.gravity(this.childBoxes[0].node,e)&dojo.html.gravity.WEST);
}else{
var _2cb=true;
}
}else{
var _2cc=this.childBoxes[i];
var _2cb=(dojo.html.gravity(_2cc.node,e)&dojo.html.gravity.WEST);
}
this.placeIndicator(e,_2ca,i,_2cb);
if(!dojo.html.hasParent(this.dropIndicator)){
document.body.appendChild(this.dropIndicator);
}
},placeIndicator:function(e,_2cd,_2ce,_2cf){
with(this.dropIndicator.style){
if(_2ce<0){
if(this.childBoxes.length){
left=(_2cf?this.childBoxes[0].left:this.childBoxes[this.childBoxes.length-1].right)+"px";
top=(_2cf?this.childBoxes[0].top:this.childBoxes[this.childBoxes.length-1].top)+"px";
}else{
var pos=dojo.html.getAbsolutePosition(this.domNode);
left=pos.x+"px";
top=(pos.y+2)+"px";
}
}else{
var _2d0=this.childBoxes[_2ce];
left=(_2cf?_2d0.left:_2d0.right)+"px";
top=_2d0.top+"px";
}
}
},createDropIndicator:function(){
this.dropIndicator=document.createElement("div");
with(this.dropIndicator.style){
position="absolute";
zIndex=900;
borderLeftWidth="2px";
borderLeftColor="red";
borderLeftStyle="solid";
height="22px";
width="2px";
}
},insert:function(e,_2d1,_2d2){
if(_2d1==this.curItem.domNode){
return false;
}
return this.report.insertGem(this.curItem,_2d1.id,_2d2,this.actionStr);
}});
dojo.declare("cv.FilterPaneDropTarget",dojo.dnd.HtmlDropTarget,function(_2d3,_2d4,_2d5,_2d6){
this.report=_2d6;
this.dndSuffix=_2d5;
this.curItem=null;
this.filterPane=_2d3;
dojo.event.connect(this,"onDrop",this,"afterDrop");
},{onDragOver:function(e){
if(this.report.isResizing){
return;
}
if(!dojo.lang.inArray(this.acceptedTypes,e.dragObjects[0].type)){
if(e.target.style&&e.target.style.cursor&&(dojo.html.hasClass(e.target,"dropZoneItem")||dojo.html.hasClass(e.target,"gemLabel")||dojo.html.hasClass(e.target,"dragObj"))){
e.target.style.cursor="not-allowed";
}
return false;
}
cv.util.setDivActive(this.filterPane,true);
return cv.FilterPaneDropTarget.superclass.onDragOver.call(this,e);
},onDragMove:function(e){
},onDragOut:function(e){
if(e.target.style&&e.target.style.cursor&&e.target.style.cursor=="not-allowed"){
e.target.style.cursor="move";
}
cv.util.setDivActive(this.filterPane,false);
return cv.FilterPaneDropTarget.superclass.onDragOut.call(this,e);
},onDrop:function(e){
this.curItem=e.dragObject.domNode;
return cv.FilterPaneDropTarget.superclass.onDrop.call(this,e);
},createDropIndicator:function(){
return;
},afterDrop:function(){
if(this.curItem){
this.report.filterDlg.show(this.curItem.getAttribute("formula"));
}
this.curItem=null;
},insert:function(e,_2d7,_2d8){
return true;
}});
dojo.declare("cv.TrashAreaDropTarget",dojo.dnd.HtmlDropTarget,function(_2d9,_2da,_2db){
this.report=_2db;
if(dojo.html.hasClass(this.domNode,"trashcan")){
dojo.event.connect(dojo.dnd.dragManager,"onMouseMove",this,"_onMouseMove");
dojo.event.connect(dojo.dnd.dragManager,"onMouseUp",this,"_onMouseUp");
}
},{onDragOver:function(e){
if(this.report.isResizing){
return;
}
if(!dojo.lang.inArray(this.acceptedTypes,e.dragObjects[0].type)){
if(e.target.style&&e.target.style.cursor&&(dojo.html.hasClass(e.target,"dropZoneItem")||dojo.html.hasClass(e.target,"gemLabel"))){
e.target.style.cursor="not-allowed";
}
return false;
}
this.childBoxes=[];
dojo.html.addClass(this.domNode,"trashActive");
return true;
},onDragMove:function(e){
},onDragOut:function(e){
if(e.target.style&&e.target.style.cursor&&e.target.style.cursor=="not-allowed"){
e.target.style.cursor="move";
}
dojo.html.removeClass(this.domNode,"trashActive");
return true;
},createDropIndicator:function(){
return;
},onDrop:function(e){
var id=e.dragObject.domNode.id;
if(id.indexOf("filter_")==0){
this.report.removeFilter(id);
}else{
this.report.removeCurrentGem(e.dragObject.domNode);
}
dojo.html.removeClass(this.domNode,"trashActive");
this.domNode.focus();
return true;
},_onMouseMove:function(e){
if(this.report.isResizing){
return;
}
if(dojo.widget.PopupManager.currentMenu){
dojo.widget.PopupManager.currentMenu.close();
}
var _2dc=dojo.dnd.dragManager.selectedSources;
if(_2dc.length==0||!dojo.lang.inArray(this.acceptedTypes,_2dc[0].type)){
return;
}
cv.util.show(this.domNode);
},_onMouseUp:function(e){
if(!cv.util.isHidden(this.domNode)){
cv.util.hide(this.domNode);
}
}});
dojo.declare("cv.FieldHelp",null,function(_2dd,_2de){
this.doc=dojo.dom.createDocumentFromText(_2dd);
cv.setDomDefaultNamespace(this.doc);
this.manager=_2de;
this.fieldListItems=null;
this.fieldListTree=null;
this.fieldListNodes=null;
this.selectedField=null;
this.searchField=null;
this.viewOptions={"cmdViewCategory":"businessGroup","cmdViewName":"displayLabel","cmdViewType":"type","cmdViewSchema":"schema"};
this.currentView=null;
},{destroy:function(){
this.fieldListItems=null;
if(!this.fieldListTree){
return;
}
if(this.fieldListNodes){
for(var x=0,len=this.fieldListNodes.length;x<len;++x){
if(this.fieldListNodes[x].dndObj){
this.fieldListNodes[x].dndObj=null;
}
}
}
dojo.event.disconnect(this.searchField,"onkeyup",this,"searchFields");
dojo.event.disconnect(this.fieldListTree,"onmouseover",this,"onMouseOver");
dojo.event.disconnect(this.fieldListTree,"onmousedown",this,"onMouseDown");
dojo.event.disconnect(this.fieldListTree,"ondblclick",this,"onDblClick");
dojo.event.disconnect(this.fieldListTree,"oncontextmenu",this,"onContextMenu");
dojo.event.disconnect(this.clearSearchField,"onclick",this,"onClearSearch");
dojo.event.disconnect(dojo.byId("viewFieldOptions"),"onclick",this,"onViewFieldOptions");
dojo.event.disconnect(dojo.byId("hideFieldList"),"onclick",this.manager,"onToggleReportPane");
this.doc=null;
this.fieldListTree=null;
this.fieldListNodes=null;
this.selectedField=null;
this.searchField=null;
},_getFieldListItems:function(){
var _2df=this.doc.documentElement.selectNodes("cv:attributeHelp|cv:measureHelp");
var _2e0=[];
for(x=0,len=_2df.length;x<len;++x){
if(!this.isHidden(_2df[x])){
_2e0.push(_2df[x]);
}
}
return _2e0;
},init:function(){
var x,len;
var _2e1=this.doc.documentElement.selectNodes("cv:attributeHelp|cv:measureHelp");
this.fieldListItems=this._getFieldListItems();
this.fieldCount=this.fieldListItems.length;
this.fieldListTree=dojo.byId("fieldListTree");
this.fieldListTreeContent=dojo.byId("fieldListTreeContent");
if(this.fieldListTree){
this.searchField=dojo.byId("searchField");
this.searchField.value="";
this.clearSearchField=dojo.byId("clearSearchField");
cv.util.getDojoWidget("fieldViewMenu");
this.sortFields(cv.prefs.fieldListView);
dojo.byId("fieldCount").innerHTML=this.fieldListItems.length;
this.updateFieldCount();
dojo.event.connect(this.searchField,"onkeyup",this,"searchFields");
dojo.event.connect(this.fieldListTree,"onmouseover",this,"onMouseOver");
dojo.event.connect(this.fieldListTree,"onmousedown",this,"onMouseDown");
dojo.event.connect(this.fieldListTree,"ondblclick",this,"onDblClick");
dojo.event.connect(this.fieldListTree,"oncontextmenu",this,"onContextMenu");
dojo.event.connect(this.clearSearchField,"onclick",this,"onClearSearch");
dojo.event.connect(dojo.byId("viewFieldOptions"),"onclick",this,"onViewFieldOptions");
dojo.event.connect(dojo.byId("hideFieldList"),"onclick",this.manager,"onToggleReportPane");
}
var _2e2=this;
cv.formatTooltip=function(_2e3,node){
if(dojo.html.hasClass(node,"field")){
_2e2.formatTooltip(_2e3,node);
}
};
},formatTooltip:function(_2e4,node){
var _2e5=this.get(node.getAttribute("formula"));
var desc=this.get(_2e5,"displayDescription",true);
var str=(desc?desc:cvCatalog.fieldTooltipNone)+"<div class='fieldTooltipFooter'><a id='showFieldHelpDlg' class='appCmdLink' style='float:right;text-decoration:none;' "+"href='#' onclick='cv.getFieldHelp().onFieldHelp();return false'>Tell me more...</a></div>";
_2e4.innerHTML=str;
},get:function(node,_2e6,_2e7){
if(dojo.lang.isString(node)){
node=this.doc.documentElement.selectSingleNode("*[@formula=\""+node+"\"]");
}
if(!node||!_2e6){
return node;
}
var _2e8=node.selectSingleNode("cv:presentationFieldHelp");
var _2e9=null;
switch(_2e6){
case "formula":
case "hierarchy":
_2e9=node.getAttribute(_2e6);
break;
case "type":
_2e9=(node.tagName=="measureHelp")?"NUMBER":_2e8.getAttribute("type");
break;
case "displayLabel":
_2e9=_2e8?_2e8.getAttribute(_2e6):null;
if(!_2e9){
_2e9="";
}
break;
case "displayLabelOriginal":
if(_2e8){
var _2ea=_2e8.selectSingleNode("cv:originalPresentationFieldHelp");
if(_2ea){
_2e9=_2ea.getAttribute("displayLabel");
break;
}
}
if(!_2e9){
_2e9="";
}
break;
case "format":
_2e9={formatCategory:"Default",formatScale:"0",formatExpression:"",formatShortcut:"NONE"};
break;
default:
_2e9=_2e8?_2e8.getAttribute(_2e6):null;
break;
}
if(!_2e9){
return _2e9;
}
return _2e7?dojo.string.escape("html",_2e9):_2e9;
},getAttributeList:function(){
return this.doc.documentElement.selectNodes("cv:attributeHelp");
},getMeasureList:function(){
return this.doc.documentElement.selectNodes("cv:measureHelp");
},getDndType:function(item){
if(dojo.lang.isString(item)){
item=this.get(item);
if(!item){
return null;
}
}
if(item.tagName=="measureHelp"){
return "V";
}else{
return (this.isTimeAttribute(item)?"T":"L");
}
},getDirectChild:function(_2eb){
var heir=this.getHierarchy(_2eb);
for(var x=0;heir&&x<heir.length;++x){
if(heir[x]==_2eb){
return x<heir.length-1?heir[x+1]:null;
}
}
return null;
},getHierarchy:function(_2ec,_2ed,_2ee){
var item=this.get(_2ec);
if(!item){
return null;
}
item=item.getAttribute("hierarchy");
if(!item){
return null;
}
var _2ef=this.doc.documentElement.selectNodes("cv:hierarchyInfo[@formula=\""+item+"\"]/cv:levelInfo");
var _2f0=[];
for(var i=0;i<_2ef.length;++i){
var _2f1=_2ef[i].getAttribute("formula");
if(_2ed||!this.isHidden(_2f1)){
_2f0.push(_2f1);
}
if(_2ee&&_2f1==_2ec){
break;
}
}
return _2f0;
},getProperties:function(_2f2){
var _2f3=this.doc.documentElement.selectNodes("cv:attributeHelp[@formula=\""+_2f2+"\"]/cv:presentationFieldHelp/cv:property");
var _2f4=[];
for(var i=0;i<_2f3.length;++i){
_2f4.push(_2f3[i].getAttribute("name"));
}
return _2f4;
},isHidden:function(_2f5){
return this.get(_2f5,"hidden")=="true";
},isTimeAttribute:function(_2f6,_2f7){
if(dojo.lang.isString(_2f6)){
_2f6=this.get(_2f6);
if(!_2f6){
return false;
}
}
var type=this.get(_2f6,"type");
return _2f6.tagName=="attributeHelp"&&(type=="TIME_YEAR"||type=="TIME_QUARTER"||type=="TIME_MONTH"||type=="TIME_WEEK"||type=="TIME_DATE"||(_2f7&&type=="TIME_CYCLICAL"));
},searchFields:function(key){
if(key&&key.keyCode==13){
if(this.fieldCount==1&&this.selectedField){
this.manager.report.appendGem(this.selectedField.getAttribute("formula"));
}
return;
}
if(!key||!dojo.lang.isString(key)){
key=this.searchField.value;
}
var len=this.fieldListNodes.length;
this.fieldCount=0;
var re=null;
if(key){
re=new RegExp(dojo.string.escape("regex",key),"i");
if(cv.util.isHidden(this.clearSearchField)){
cv.util.show(this.clearSearchField);
}
}else{
cv.util.hide(this.clearSearchField);
}
var _2f8=false,_2f9=null;
var _2fa=null;
for(var x=0;x<len;++x){
var node=this.fieldListNodes[x];
if(_2f9!=node.groupHeader){
_2f9=node.groupHeader;
_2f8=false;
if(_2f9&&dojo.html.isDisplayed(_2f9)){
cv.util.hide(_2f9);
}
}
if(!re||node.innerHTML.search(re)>=0){
cv.util.show(node);
if(dojo.html.isDisplayed(node)){
++this.fieldCount;
if(!_2fa){
_2fa=node;
}
if(!_2f8&&_2f9){
cv.util.show(_2f9);
_2f8=true;
}
}
}else{
if(!cv.util.isHidden(node)){
cv.util.hide(node);
}
}
}
if(re){
dojo.byId("fieldListCount").innerHTML=dojo.string.substituteParams(cvCatalog.fieldListCount,this.fieldCount);
}else{
dojo.byId("fieldListCount").innerHTML=cvCatalog["fieldListAll"];
}
if(this.fieldCount==1){
if(this.selectedField){
dojo.html.setStyle(this.selectedField,"background-color","#ffffff");
}
this.selectedField=_2fa;
dojo.html.setStyle(this.selectedField,"background-color","#dfdfdf");
}
},showDlg:function(_2fb){
this.manager.report.rptDlg.show("show","fieldHelp",_2fb);
},sortFields:function(key){
if(this.currentView){
cv.util.setMenuItem(this.currentView,"none");
}
this.currentView=key;
cv.util.setMenuItem(this.currentView,"checked");
var _2fc,_2fd=true;
var _2fe=this;
key=this.viewOptions[key];
switch(key){
case "displayLabel":
_2fd=false;
_2fc=function(a,b){
return _2fe._sortByName(a,b);
};
break;
case "schema":
_2fc=null;
this.fieldListItems=this._getFieldListItems();
key="businessGroup";
break;
case "type":
_2fc=function(a,b){
if(_2fe.isTimeAttribute(a,true)&&_2fe.isTimeAttribute(b,true)){
return _2fe._sortByName(a,b);
}
var aa=_2fe.get(a,"type");
var bb=_2fe.get(b,"type");
if(aa==bb){
return _2fe._sortByName(a,b);
}
if(aa=="NUMBER"){
return -1;
}
if(bb=="NUMBER"){
return 1;
}
return (aa=="ATTRIBUTE")?-1:1;
};
break;
case "businessGroup":
_2fc=function(a,b){
var aa=_2fe.get(a,"businessGroup");
var bb=_2fe.get(b,"businessGroup");
if(!aa&&!bb){
return _2fe._sortByHierarchy(a,b);
}
if(!aa){
return 1;
}
if(!bb){
return -1;
}
if(aa>bb){
return 1;
}
if(aa<bb){
return -1;
}
return _2fe._sortByHierarchy(a,b);
};
break;
default:
return;
}
if(_2fc){
this.fieldListItems.sort(_2fc);
}
if(this.fieldListNodes){
for(var x=0,len=this.fieldListNodes.length;x<len;++x){
if(this.fieldListNodes[x].dndObj){
this.fieldListNodes[x].dndObj=null;
}
}
}
this.fieldListNodes=[];
this.fieldListTreeContent.innerHTML="";
var _2ff=cv.util.getDojoWidget("theTooltip");
var len=this.fieldListItems.length;
var _300="!@#$",_301=null,_302=null,_303=false,_304=0;
for(var x=0;x<len;++x){
var item=this.fieldListItems[x];
if(_2fd){
var gp;
if(key=="type"&&this.isTimeAttribute(item,true)){
gp="TIME";
}else{
gp=this.get(item,key);
}
if(gp!=_300){
_300=gp;
var _305;
switch(key){
case "schema":
_305=_300?_300:cvCatalog.fieldGroupNoValue;
break;
case "type":
_305=cvCatalog["fieldTypeLabels_"+(_300?_300:"NUMBER")];
break;
case "businessGroup":
_305=_300?_300:cvCatalog.fieldGroupNoValue;
break;
default:
_305=cvCatalog.fieldGroupNoValue;
break;
}
_301=document.createElement("DIV");
_301.innerHTML=dojo.string.escape("html",_305);
_301.id="GROUP"+_304;
dojo.html.addClass(_301,"folder hidden uncommon");
_303=false;
this.fieldListTreeContent.appendChild(_301);
_302=document.createElement("DIV");
_302.id="GROUP"+_304+"DIV";
dojo.html.addClass(_302,"folderContent uncommon");
this.fieldListTreeContent.appendChild(_302);
new cv.Collapsible(_301,_302,true);
++_304;
}
}
var node=document.createElement("DIV");
var _306=item.getAttribute("formula");
var _307=this.get(item,"displayLabel",true);
var _308=this.getProperties(_306);
if(_308&&_308.length>0){
_307+=" ("+_308.length+")";
}
node.innerHTML=_307?_307:"&nbsp;";
node.setAttribute("formula",_306);
node.groupHeader=_301;
dojo.html.addClass(node,this.get(item,"type")=="NUMBER"?"field measure":"field attribute");
if(this.get(item,"isDefaultFavorite")!="true"){
dojo.html.addClass(node,"uncommon");
}else{
if(_301&&dojo.html.hasClass(_301,"uncommon")){
dojo.html.removeClass(_301,"uncommon");
dojo.html.removeClass(_302,"uncommon");
}
}
this.fieldListNodes.push(node);
if(_302){
_302.appendChild(node);
}else{
this.fieldListTreeContent.appendChild(node);
}
if(_301&&!_303&&((cv.isMobile()&&node.style.display!="none")||dojo.html.isDisplayed(node))){
cv.util.show(_301);
_303=true;
}
if(!cv.isMobile()){
_2ff.addConnectNode(node);
}
var _306=node.getAttribute("formula");
var _309=this.get(_306);
if(_309){
node.dndObj=new dojo.dnd.HtmlDragSource(node,this.getDndType(_309));
dojo.html.disableSelection(node);
}
}
if(this.searchField.value){
this.searchFields();
}
},_sortByName:function(a,b){
var aa=this.get(a,"displayLabel");
var bb=this.get(b,"displayLabel");
if(aa>bb){
return 1;
}
if(aa<bb){
return -1;
}
return 0;
},_sortByHierarchy:function(a,b){
var aa=this.get(a,"hierarchy");
var bb=this.get(b,"hierarchy");
if(!aa&&!bb){
return this._sortByName(a,b);
}
if(!aa){
return -1;
}
if(!bb){
return 1;
}
if(aa!=bb){
return (aa<bb?-1:1);
}
var _30a=this.doc.documentElement.selectNodes("cv:hierarchyInfo[@formula=\""+aa+"\"]/cv:levelInfo");
aa=this.get(a,"formula");
bb=this.get(b,"formula");
for(var i=0;i<_30a.length;++i){
var _30b=_30a[i].getAttribute("formula");
if(_30b==aa){
return -1;
}
if(_30b==bb){
return 1;
}
}
return this._sortByName(a,b);
},updateFieldCount:function(){
},onClearSearch:function(){
if(this.searchField.value){
this.searchField.value="";
this.searchFields();
this.searchField.focus();
}
cv.util.hide(this.clearSearchField);
},onMouseOver:function(e){
var node=e.target;
if(!node||!dojo.html.hasClass(node,"field")||this.selectedField==node){
return;
}
if(this.selectedField){
dojo.html.removeClass(this.selectedField,"fieldListItem-selected");
}
this.selectedField=node;
dojo.html.addClass(this.selectedField,"fieldListItem-selected");
},onMouseDown:function(e){
var node=e.target;
if(!node||!dojo.html.hasClass(node,"field")){
return;
}
var _30c=node.getAttribute("formula");
var _30d=this.get(_30c);
if(!_30d){
return;
}
},onDblClick:function(e){
if(e.target==this.selectedField){
this.manager.report.appendGem(this.selectedField.getAttribute("formula"));
}
},onContextMenu:function(e){
var node=cv.util.getAncestorByClass(e.target,"field");
if(!node){
return;
}
cv.util.getDojoWidget("theTooltip").cancelShowing=true;
var menu=cv.util.getDojoWidget("fieldListMenu");
menu.open(e.clientX,e.clientY,this);
e.preventDefault();
e.stopPropagation();
},onFieldAdd:function(){
if(this.selectedField){
this.manager.report.appendGem(this.selectedField.getAttribute("formula"));
}
},onFieldFilter:function(){
if(this.selectedField){
this.manager.report.rptDlg.showFilterList(this.selectedField.getAttribute("formula"));
}
},onFieldHelp:function(){
if(this.selectedField){
this.showDlg(this.selectedField.getAttribute("formula"));
}
},onViewCategory:function(){
this.sortFields("cmdViewCategory");
},onViewName:function(){
this.sortFields("cmdViewName");
},onViewSchema:function(){
this.sortFields("cmdViewSchema");
},onViewType:function(){
this.sortFields("cmdViewType");
},onViewFieldOptions:function(e){
var menu=cv.util.getDojoWidget("fieldViewMenu");
if(!menu){
return;
}
menu.open(e.pageX,e.pageY,this);
}});
cv.ReportResizer=function(_30e){
this.report=_30e;
this.previousPageX=-1;
this.resizeObj=null;
this.resizeData=null;
this.page=null;
};
cv.ReportResizer.prototype={destroy:function(){
this.page=null;
this.resizeData=null;
this.resizeobj=null;
},gainedFocus:function(e){
var obj=e.target;
if(!obj){
return;
}
this._updateCursorLook(e);
while(obj.tagName!="DIV"){
obj=obj.childNodes[0];
}
dojo.event.connect(obj,"onmousemove",this,"_updateCursorLook");
dojo.event.connect(obj,"onclick",this,"_showMenu");
dojo.event.connect(obj,"onmousedown",this,"_beginResize");
dojo.event.kwConnect({srcObj:obj,srcFunc:"onmouseout",targetObj:this,targetFunc:"_lostFocus",once:true});
},_lostFocus:function(e){
var obj=e.target;
while(obj.tagName!="DIV"){
obj=obj.childNodes[0];
}
dojo.event.disconnect(obj,"onmousemove",this,"_updateCursorLook");
dojo.event.disconnect(obj,"onclick",this,"_showMenu");
dojo.event.disconnect(obj,"onmousedown",this,"_beginResize");
},_beginResize:function(e){
if(!this._isInResizeZone(e)){
return;
}
this.previousPageX=e.pageX;
var obj=e.target;
while(obj.tagName!="DIV"){
obj=obj.childNodes[0];
}
this.resizeObj=obj;
this.resizeData=this.report.reportHeaders.getDataColumn(this.resizeObj.offsetParent);
this.page=this.resizeObj;
while(this.page.offsetParent){
this.page=this.page.offsetParent;
}
dojo.event.connect(this.page,"onmousemove",this,"_resize");
dojo.event.kwConnect({srcObj:this.page,srcFunc:"onmouseup",targetObj:this,targetFunc:"_endResize",once:true});
},_endResize:function(e){
this.report.reportHeaders.updateLayout();
dojo.event.disconnect(this.page,"onmousemove",this,"_resize");
var _30f=this._getWidth(this.resizeObj);
for(var i=0;i<this.resizeData.length;i++){
this.resizeData[i].childNodes[0].style.width=(_30f+1)+"px";
}
},_resize:function(e){
var _310=this._getParentHeaders(this.resizeObj);
for(var i=0;i<_310.length;i++){
this._resizeObj(_310[i],e);
}
this.previousPageX=e.pageX;
},_resizeObj:function(obj,e){
var _311=this._getWidth(obj);
_311=_311+(e.pageX-this.previousPageX);
var _312=obj.offsetParent.getAttribute("colspan")*1;
if(_311<10*_312){
_311=10*_312;
}
obj.style.width=_311+"px";
},_getParentHeaders:function(obj){
var cell=obj.parentNode;
var row=cell.parentNode;
var _313=row.parentNode;
var rows=_313.getElementsByTagName("TR");
var _314=cell.getAttribute("colindex")*1;
return this.getParentHeaders(rows,_314);
},getParentHeaders:function(rows,_315){
var _316=new Array();
for(var i=0;i<rows.length;i++){
var _317=rows[i].childNodes;
for(var j=0;j<_317.length;j++){
var _318=_317[j];
var _319=_318.getAttribute("colspan")*1;
var _31a=_318.getAttribute("rowspan")*1;
var _31b=_318.getAttribute("colindex")*1;
if(_31b<=_315&&_31b+_319>_315){
_316.push(_318.childNodes[0]);
i+=_31a-1;
break;
}
}
}
return _316;
},_updateCursorLook:function(e){
var obj=e.target;
while(obj.tagName!="DIV"){
obj=obj.childNodes[0];
}
if(e.target.style&&e.target.style.cursor){
if(this._isInResizeZone(e)){
obj.offsetParent.style.cursor="e-resize";
}else{
obj.offsetParent.style.cursor="";
}
}
},_showMenu:function(e){
if(!this._isInResizeZone(e)){
this.report.toggleInReportPopupMenu(e);
}
},_isInResizeZone:function(e){
var obj=e.target;
while(obj.tagName!="DIV"){
obj=obj.childNodes[0];
}
var _31c=e.pageX;
var objX=this._findLeft(obj);
var _31d=obj.offsetWidth;
var _31e=objX+_31d;
if(_31c>(_31e-10)&&_31c<_31e){
return true;
}else{
return false;
}
},_findLeft:function(obj){
var _31f=0;
if(obj.offsetParent){
while(obj.offsetParent){
_31f+=obj.offsetLeft-obj.scrollLeft;
obj=obj.offsetParent;
}
}else{
if(obj.x){
_31f+=obj.x;
}
}
if(!dojo.render.html.ie){
_31f-=this.report.reportHeaders.getHorzScrollAmount();
}
return _31f;
},_getWidth:function(obj){
var _320=1*obj.style.width.substring(0,obj.style.width.length-2);
return _320;
}};
cv.ReportHeaders=function(_321,obj){
this.report=_321;
this.tableArea=_321.nodeReportArea;
this.pivotTable=dojo.dom.firstElement(_321.nodeReportArea,"DIV");
this.rowLabelHeaderSection=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableRowLabelHeaderSection");
this.rowLabelHeaderContainer=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableRowLabelHeaderContainer");
this.rowLabelSection=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableRowLabelSection");
this.rowLabelContainer=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableRowLabelContainer");
this.columnHeaderSection=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableColumnHeaderSection");
this.columnHeaderContainer=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableColumnHeaderContainer");
this.columnHeaderTable=cv.util.getFirstChildByClass(this.columnHeaderContainer,"ZONE_columnAttributes");
this.dataSection=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableDataSection");
this.dataContainer=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableDataContainer");
this.content=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableContent");
this.scrollbarArea=cv.util.getFirstChildByClass(this.pivotTable,"pivotTableScrollbars");
this.scrollbarAreaDiv=dojo.dom.firstElement(this.scrollbarArea,"DIV");
this.truncateType=this.pivotTable.truncateType;
this.dragNodes=[];
var _322=this.rowLabelContainer.firstChild;
while(_322.tagName!="TABLE"){
_322=_322.nextSibling;
}
this.rowLabelTable=_322;
var _322=this.dataContainer.firstChild;
while(_322.tagName!="TABLE"){
_322=_322.nextSibling;
}
this.colLabelTable=_322;
var _322=this.content.firstChild;
while(_322.tagName!="TABLE"){
_322=_322.nextSibling;
}
this.contentTable=_322;
if(this.truncateType=="ROW"||this.truncateType=="BOTH"){
_321.byId("RowTruncateMsg").innerHTML=this.pivotTable.rowMsg;
}
if(this.truncateType=="COL"||this.truncateType=="BOTH"){
_321.byId("ColTruncateMsg").innerHTML=this.pivotTable.colMsg;
}
cv.util.hide(this.report.nodeColTruncate,this.report.nodeRowTruncate);
this.rowLabelHeaders=this.rowLabelHeaderContainer.getElementsByTagName("TD");
var _323=this.rowLabelSection.getElementsByTagName("TR");
var _324=null;
this.rowLabels=null;
if(_323.length>0){
_324=_323[0].childNodes;
this.rowLabels=this.rowLabelSection.getElementsByTagName("COLGROUP")[0].childNodes;
}
var _325=this.columnHeaderSection.getElementsByTagName("TR");
this.columnHeaders=_325.length?_325[_325.length-1].childNodes:null;
if(this.columnHeaders!=null&&dojo.render.html.ie&&_325.length==1){
var _326=this.columnHeaderSection.getElementsByTagName("COLGROUP")[0].childNodes;
for(var i=0;i<_326.length;i++){
_326[i].width=(_326[i].width*1)-1;
}
}
this.dataColumns=this.dataSection.getElementsByTagName("TR");
dojo.event.connect(this.scrollbarArea,"onscroll",this,"_scroll");
this.previousPageX=-1;
this.previousPageY=-1;
this._setUpDrag();
if(dojo.render.html.ie){
dojo.event.connect(this.pivotTable,"onmousewheel",this,"_mouseScroll");
dojo.event.connect(this.pivotTable,"onmousemove",this,"_clearSelection");
}else{
if(this.pivotTable.addEventListener){
this.pivotTable.addEventListener("DOMMouseScroll",dojo.lang.hitch(this,"_mouseScroll"),false);
}
}
dojo.event.connect(this.rowLabelHeaderContainer,"onmousemove",this,"resize");
dojo.event.connect(this.pivotTable,"onmousedown",this,"_mouseDown");
dojo.event.connect(this.columnHeaderContainer,"ondblclick",this,"showEditDialogOnHeader");
dojo.event.connect(this.rowLabelHeaderContainer,"ondblclick",this,"showEditDialogOnHeader");
this.widths=new Array();
this.initialWidths=new Array();
this.columnWidths=new Array();
this.initialColumnWidths=new Array();
this.DEFAULT_COLUMN_WIDTH=120;
this.MINIMAL_WIDTH=10;
this.resizeLabels=new Array();
this.resizeColumns=new Array();
for(var i=0;i<this.rowLabelHeaders.length;i++){
var _327=0;
if(this.rowLabels!=null){
_327=dojo.html.getMarginBox(_324[i]).width;
}
var _328=dojo.html.getMarginBox(this.rowLabelHeaders[i]).width;
if(this.isTooLongOrHasSpace(this.rowLabelHeaders[i].title)){
_328=_328*1.1/2;
}
this.widths[i]=Math.min(_327,210);
this.widths[i]=Math.max(this.widths[i],80);
this.widths[i]=Math.max(this.widths[i],_328);
this.initialWidths[i]=this.widths[i];
}
if(dojo.render.html.ie){
var cols=this.dataContainer.childNodes[0].childNodes[0].childNodes;
if(this.columnHeaders!=null&&this.columnHeaders.length>0&&cols.length>0){
var _329=cols[0];
_329.width=(_329.width*1)+1;
_329=cols[cols.length-1];
_329.width=(_329.width*1)-(_325.length==1?2:1);
}
}
};
cv.ReportHeaders.prototype={disconnect:function(){
this._tearDownDrag();
for(var i=0;i<this.dragNodes.length;++i){
this.dragNodes[i].dndObj=null;
}
if(dojo.render.html.ie){
dojo.event.disconnect(this.pivotTable,"onmousewheel",this,"_mouseScroll");
dojo.event.disconnect(this.pivotTable,"onmousemove",this,"_clearSelection");
}
dojo.event.disconnect(this.pivotTable,"onmousedown",this,"_mouseDown");
dojo.event.disconnect(this.scrollbarArea,"onscroll",this,"_scroll");
this.pivotTable=null;
this.rowLabelHeaderSection=null;
this.rowLabelHeaderContainer=null;
this.rowLabelSection=null;
this.rowLabelContainer=null;
this.columnHeaderSection=null;
this.columnHeaderContainer=null;
this.dataSection=null;
this.dataContainer=null;
this.tableArea=null;
this.content=null;
this.scrollbarArea=null;
this.rowLabelHeaders=null;
this.rowLabels=null;
this.columnHeaders=null;
this.dataColumns=null;
this.dragNodes=null;
},showEditDialogOnHeader:function(e){
this.report.showEditDialogOnColumnHeader(e);
},isTooLongOrHasSpace:function(_32a){
return _32a.length>30||_32a.indexOf(" ")>-1;
},attachResizeNode:function(_32b,_32c,_32d,_32e){
if(_32b==null){
return;
}
var node=document.createElement("div");
node.id=_32e;
node.setAttribute("id",_32e);
if("after"==_32d){
_32b.appendChild(node);
node.setAttribute("dojoType","CVResizeHandle");
}else{
node.setAttribute("dojoType","CVBeforeResizeHandle");
_32b.insertBefore(node,_32b.firstChild);
}
var _32f=new dojo.xml.Parse();
var frag=_32f.parseElement(node,null,true);
var _330=dojo.widget.getParser().createComponents(frag);
_330[0].reportHeader=this;
_330[0].targetType=_32c;
_330[0].targetDomNode=_32b;
_330[0].nodeId=_32e;
},_sumOf:function(_331){
var sum=0;
for(var i=0;i<_331.length;i++){
sum+=_331[i];
}
return sum;
},_computeRowLabelWidths:function(){
var _332=new Array();
for(var i=0;i<this.widths.length;i++){
_332[i]=this.widths[i];
}
var _333=this._sumOf(_332);
var _334=0.67*this.pivotTableWidth;
while(_333>_334){
var _335=new Array();
var _336=0;
var _337=0;
for(var i=0;i<_332.length;i++){
if(_332[i]==_336){
_335[_335.length]=i;
}else{
if(_332[i]>_336){
_335=new Array();
_335[0]=i;
_336=_332[i];
}
}
}
for(var i=0;i<_332.length;i++){
if(_332[i]>_337&&_332[i]<_336){
_337=_332[i];
}
}
var _338=Math.max(1,Math.min(Math.ceil((_333-_334)/_335.length),_336-_337));
for(var i=0;i<_335.length;i++){
_332[_335[i]]-=_338;
}
_333=this._sumOf(_332);
}
return _332;
},_adjustRowLabelWidths:function(_339,_33a,dx){
var _33b=Math.max(dojo.html.getPadding(this.rowLabelContainer).width,dojo.html.getPadding(this.rowLabelHeaderContainer).width);
var _33c=_33b;
this.rowLabelContainer.childNodes[0].style.tableLayout="fixed";
this.rowLabelContainer.childNodes[0].style.width="0px";
var cols=this.rowLabelHeaderContainer.getElementsByTagName("COL");
this.rowLabelHeaderContainer.childNodes[0].style.tableLayout="fixed";
this.rowLabelHeaderContainer.childNodes[0].style.width="0px";
for(var i=0;i<_339.length;i++){
var _33d=this.widths[i];
if(this.report.rowFieldWidths[i]!=null){
_33d-=this.report.rowFieldWidths[i];
}
if(_33d<this.MINIMAL_WIDTH){
_33d=this.MINIMAL_WIDTH;
}
if(typeof _33a!="undefined"&&i==_33a){
this.report.isReportPropsDirty=true;
_33d-=dx;
if(typeof this.report.rowFieldWidths[i]=="undefined"){
this.report.rowFieldWidths[i]=dx;
}else{
this.report.rowFieldWidths[i]+=dx;
}
}
this.rowLabelHeaders[i].childNodes[0].style.whiteSpace="normal";
cols[i].width=_33d+"px";
if(this.rowLabels!=null){
this.rowLabels[i].width=_33d+"px";
}
_33b+=_33d;
}
_33b-=_33c;
this.rowLabelHeaderSection.setAttribute("width",_33b);
this.rowLabelSection.setAttribute("width",_33b);
if(_33b>0){
this.rowLabelHeaderContainer.style.width=_33b+"px";
this.rowLabelContainer.style.width=_33b+(dojo.render.html.ie?-1:0)+(dojo.render.html.safari?0:1)+"px";
}
return _33b;
},_adjustColumnWidths:function(_33e,dx,_33f){
var _340=new Array();
var _341=this.columnHeaderContainer.getElementsByTagName("COL");
for(var i=0;i<_341.length;i++){
if(typeof this.report.columnDataFieldWidths[i]!="undefined"){
_340[i]=this.DEFAULT_COLUMN_WIDTH-this.report.columnDataFieldWidths[i];
}else{
_340[i]=this.DEFAULT_COLUMN_WIDTH;
}
}
for(var i=0;i<_340.length;i++){
if(typeof _33e!="undefined"&&typeof _33f!="undefined"&&i>=_33e&&i<_33e+_33f){
this.report.isReportPropsDirty=true;
_340[i]-=dx/_33f;
}
}
var _342=0;
for(var i=0;i<_340.length;++i){
_342+=_340[i];
}
if(dojo.render.html.ie){
_342+=1;
}
this.columnHeaderSection.style.width=_342+"px";
this.columnHeaderContainer.style.width=_342+"px";
this.columnHeaderSection.setAttribute("width",_342);
this.columnHeaderContainer.setAttribute("width",_342);
var _343=this.dataContainer.getElementsByTagName("COL");
for(var i=0;i<_340.length;i++){
_343[i].width=_340[i]<this.MINIMAL_WIDTH?this.MINIMAL_WIDTH:_340[i];
_341[i].width=_340[i]<this.MINIMAL_WIDTH?this.MINIMAL_WIDTH:_340[i];
}
for(var i=0;i<_340.length;i++){
this.report.columnDataFieldWidths[i]=this.DEFAULT_COLUMN_WIDTH-_340[i];
}
cv.util.getFirstChildByClass(this.columnHeaderContainer,"ZONE_columnAttributes").style.width=_342+"px";
this.dataContainer.setAttribute("width",_342);
this.dataContainer.style.width=_342+"px";
var _344=this.dataContainer.getElementsByTagName("table");
_344[0].setAttribute("width",_342);
},_adjustHeadersHeight:function(){
if(this.rowLabelHeaders!=null&&this.rowLabelHeaders.length>0&&this.columnHeaders!=null&&this.columnHeaders.length>0){
var _345=4;
var _346=Math.max(dojo.html.getMarginBox(this.columnHeaders[0]).height,dojo.html.getMarginBox(this.rowLabelHeaders[0]).height)-_345;
for(var i=0;i<this.rowLabelHeaders.length;i++){
this.rowLabelHeaders[i].style.height=(_346-1)+"px";
}
for(var i=0;i<this.columnHeaders.length;i++){
this.columnHeaders[i].style.height=(_346-(dojo.render.html.ie?1:1))+"px";
}
}
},_adjustContainer:function(_347){
var _348=Math.max(dojo.html.getBorderBox(this.columnHeaderContainer.childNodes[0]).height,dojo.html.getBorderBox(this.rowLabelHeaderContainer.childNodes[0]).height);
this.rowLabelHeaderSection.setAttribute("height",_348);
this.rowLabelHeaderContainer.style.height=_348+"px";
this.columnHeaderSection.setAttribute("height",_348);
this.dataAreaWidth=this.scrollbarArea.clientWidth-_347-2;
var _349=this.scrollbarArea.clientHeight-_348;
this.content.style.width=this.scrollbarArea.clientWidth+"px";
this.content.style.height=this.scrollbarArea.clientHeight+"px";
this.dataContainer.scrollLeft=0;
this.dataContainer.scrollTop=0;
var _34a=this.rowLabelContainer.childNodes[0].offsetHeight*this.scrollbarArea.clientHeight/_349;
var _34b=this.columnHeaderSection.getAttribute("width")-0;
var _34c=_347+_34b;
this.scrollbarAreaDiv.style.height=Math.max(_349,_34a)+"px";
this.scrollbarAreaDiv.style.width=Math.max(this.dataAreaWidth,_34c)+"px";
},_clearHeaderHeightStyle:function(){
if(this.rowLabelHeaders!=null){
for(var i=0;i<this.rowLabelHeaders.length;i++){
this.rowLabelHeaders[i].style.height="";
}
}
if(this.columnHeaders!=null){
for(var i=0;i<this.columnHeaders.length;i++){
this.columnHeaders[i].style.height="";
}
}
},updateLayout:function(_34d,dx,_34e){
this.pivotTableHeight=this.report.reportHeight-10;
this.pivotTableWidth=this.report.reportWidth-10;
this.scrollbarArea.style.height=this.pivotTableHeight+"px";
this.scrollbarArea.style.width=this.pivotTableWidth+"px";
this.pivotTable.style.height=this.pivotTableHeight+"px";
this.pivotTable.style.width=this.pivotTableWidth+"px";
this.content.style.marginTop="-"+this.pivotTableHeight+"px";
var _34f=this._computeRowLabelWidths();
this._clearHeaderHeightStyle();
var _350=0;
if(typeof _34e!="undefined"){
_350=this._adjustRowLabelWidths(_34f);
}else{
_350=this._adjustRowLabelWidths(_34f,_34d,dx);
}
this._adjustColumnWidths(_34d,dx,_34e);
this._adjustHeadersHeight();
this._adjustContainer(_350);
if(dojo.render.html.ie){
var _351=dojo.html.getElementsByClass("resize",this.columnHeaderContainer);
for(var x=0;x<_351.length;++x){
dojo.html.setStyle(_351[x],"top","0px");
dojo.html.setStyle(_351[x],"position","static");
dojo.html.setStyle(_351[x],"position","relative");
}
for(var x=0;x<this.resizeLabels.length;++x){
dojo.html.setStyle(this.resizeLabels[x],"top","0px");
dojo.html.setStyle(this.resizeLabels[x],"position","static");
dojo.html.setStyle(this.resizeLabels[x],"position","relative");
}
}
this._scroll(null);
},getDataColumn:function(o){
for(var i=0;i<this.columnHeaders.length;i++){
if(this.columnHeaders[i]==o){
var _352=new Array();
for(var j=0;j<this.dataColumns.length;j++){
_352[j]=this.dataColumns[j].childNodes[i];
}
return _352;
}
}
return null;
},_scroll:function(e){
var _353=cv.getActiveReport().reportDoc;
var _354;
if(_353.getReportOption("freezeColumns")=="true"&&_353.getReportOption("freezeRows")=="true"){
_354=this.XYLockedScrollStrategy;
}else{
if(_353.getReportOption("freezeColumns")=="true"){
_354=this.YLockedScrollStrategy;
}else{
if(_353.getReportOption("freezeRows")=="true"){
_354=this.XLockedScrollStrategy;
}else{
_354=this.UnlockedScrollStrategy;
}
}
}
try{
var pctX=-this.scrollbarArea.scrollLeft/(this.scrollbarArea.clientWidth-this.scrollbarAreaDiv.clientWidth);
var pctY=-this.scrollbarArea.scrollTop/(this.scrollbarArea.clientHeight-this.scrollbarAreaDiv.clientHeight);
var _355=Math.round(_354.getMaxXOffset(this)*pctX);
var _356=Math.round(_354.getMaxYOffset(this)*pctY);
_354.scroll(this,_355,_356);
this._checkTruncate(pctX,pctY);
}
catch(e){
alert(e);
}
},_clearSelection:function(e){
dojo.html.clearSelection(this.pivotTable);
},_mouseScroll:function(e){
dojo.event.disconnect(this.pivotTable,"onmousewheel",this,"_mouseScroll");
var _357=0;
if(typeof e.wheelDelta=="number"){
_357=e.wheelDelta;
}else{
if(typeof e.detail=="number"){
_357=-e.detail*40;
}
}
this._scrollByAmount(0,_357);
dojo.event.connect(this.pivotTable,"onmousewheel",this,"_mouseScroll");
},_mouseDown:function(e){
var node=dojo.dom.getAncestorsByTag(e.target,"td",true);
if(!node){
return;
}
var type=node.getAttribute("type");
if(type!="measure"&&type!="attribute"){
return;
}
if(!node.dndObj){
if(type=="measure"){
type="VM";
}else{
var gem=this.report.getGem(node.getAttribute("formula"));
if(!gem){
return;
}
type=gem.dndType+this.report.dropTargets[gem.getZoneId()].dndSuffix;
}
node.dndObj=new dojo.dnd.HtmlDragSource(node,type);
this.dragNodes.push(node);
}
},keyPress:function(_358){
if(_358==33){
this._scrollByAmount(0,250);
}else{
if(_358==34){
this._scrollByAmount(0,-250);
}else{
if(_358==38){
this._scrollByAmount(0,10);
}else{
if(_358==40){
this._scrollByAmount(0,-10);
}else{
if(_358==37){
this._scrollByAmount(10,0);
}else{
if(_358==39){
this._scrollByAmount(-10,0);
}
}
}
}
}
}
},_setUpDrag:function(){
dojo.event.connect(this.dataContainer,"onmousedown",this,"_startDrag");
},_tearDownDrag:function(){
dojo.event.disconnect(this.dataContainer,"onmousedown",this,"_startDrag");
},_startDrag:function(e){
dojo.event.disconnect(this.scrollbarArea,"onscroll",this,"_scroll");
this.previousPageX=e.pageX;
this.previousPageY=e.pageY;
this.changeIndex=0;
this.previousXChanges=new Array();
this.previousYChanges=new Array();
for(var i=0;i<9;i++){
this.previousXChanges[i]=0;
this.previousYChanges[i]=0;
}
var _359=e.target;
while(_359.offsetParent){
_359=_359.offsetParent;
}
dojo.event.kwConnect({srcObj:_359,srcFunc:"onmouseup",targetObj:this,targetFunc:"_stopDrag",once:true});
dojo.event.connect(document,"onmouseup",this,"_stopDrag");
dojo.event.connect(_359,"onmousemove",this,"_drag");
dojo.event.connect(document,"onmousemove",this,"_drag");
},_stopDrag:function(e){
var _35a=e.target;
while(_35a.offsetParent){
_35a=_35a.offsetParent;
}
if(this.scrollbarArea){
dojo.event.connect(this.scrollbarArea,"onscroll",this,"_scroll");
}
dojo.event.disconnect(document,"onmouseup",this,"_stopDrag");
dojo.event.disconnect(_35a,"onmousemove",this,"_drag");
dojo.event.disconnect(document,"onmousemove",this,"_drag");
},_drag:function(e){
if(e.button<0||e.button>2){
this._stopDrag();
return;
}
var _35b=true;
var _35c=true;
var _35d=e.pageX-this.previousPageX;
var _35e=e.pageY-this.previousPageY;
this.previousXChanges[this.changeIndex]=_35d;
this.previousYChanges[this.changeIndex]=_35e;
var _35f=0;
var _360=0;
for(var i=0;i<9;i++){
_35f+=this.previousXChanges[i];
_360+=this.previousYChanges[i];
}
if(Math.abs(_35f)*2<Math.abs(_360)){
}
if(Math.abs(_360)*2<Math.abs(_35f)){
}
this.changeIndex=(this.changeIndex+1)%9;
this.previousPageY=e.pageY;
this.previousPageX=e.pageX;
if(!_35b){
_35d=0;
}
if(!_35c){
_35e=0;
}
this._scrollByAmount(_35d,_35e);
},_scrollByAmount:function(_361,_362){
if(_361==0&&_362==0){
return;
}
var _363=cv.getActiveReport().reportDoc;
var _364;
if(_363.getReportOption("freezeColumns")=="true"&&_363.getReportOption("freezeRows")=="true"){
_364=this.XYLockedScrollStrategy;
}else{
if(_363.getReportOption("freezeColumns")=="true"){
_364=this.YLockedScrollStrategy;
}else{
if(_363.getReportOption("freezeRows")=="true"){
_364=this.XLockedScrollStrategy;
}else{
_364=this.UnlockedScrollStrategy;
}
}
}
var _365=_364.getXOffset(this,_361);
var _366=_364.getYOffset(this,_362);
var _367=_364.getMaxXOffset(this);
var _368=_364.getMaxYOffset(this);
_364.scroll(this,_365,_366);
this.updateScrollbars(Math.min(1,_365/_367),Math.min(1,_366/_368));
this._checkTruncate(_365/_367,_366/_368);
},updateScrollbars:function(_369,_36a){
this.scrollbarArea.scrollLeft=-Math.round((this.scrollbarArea.clientWidth-this.scrollbarAreaDiv.clientWidth)*_369);
this.scrollbarArea.scrollTop=-Math.round((this.scrollbarArea.clientHeight-this.scrollbarAreaDiv.clientHeight)*_36a);
},UnlockedScrollStrategy:{getXOffset:function(_36b,_36c){
return (_36b.contentTable.style.marginLeft)?parseInt(_36b.contentTable.style.marginLeft)+_36c:_36c;
},getMaxXOffset:function(_36d){
return _36d.content.clientWidth-_36d.contentTable.scrollWidth;
},getYOffset:function(_36e,_36f){
return (_36e.contentTable.style.marginTop)?parseInt(_36e.contentTable.style.marginTop)+_36f:_36f;
},getMaxYOffset:function(_370){
return _370.content.clientHeight-_370.contentTable.scrollHeight;
},scroll:function(_371,_372,_373){
var _374=Math.min(Math.max(_372,this.getMaxXOffset(_371)),0);
var _375=Math.min(Math.max(_373,this.getMaxYOffset(_371)),0);
_371.contentTable.style.marginLeft=_374+"px";
_371.contentTable.style.marginTop=_375+"px";
}},XLockedScrollStrategy:{getXOffset:function(_376,_377){
return (_376.columnHeaderTable.style.left)?parseInt(_376.columnHeaderTable.style.left)+_377:_377;
},getMaxXOffset:function(_378){
return _378.content.clientWidth-_378.contentTable.scrollWidth;
},getYOffset:function(_379,_37a){
return (_379.contentTable.style.marginTop)?parseInt(_379.contentTable.style.marginTop)+_37a:_37a;
},getMaxYOffset:function(_37b){
return _37b.content.clientHeight-_37b.contentTable.scrollHeight;
},scroll:function(_37c,_37d,_37e){
var _37f=Math.min(Math.max(_37d,this.getMaxXOffset(_37c)),0);
var _380=Math.min(Math.max(_37e,this.getMaxYOffset(_37c)),0);
_37c.colLabelTable.style.left=_37f+"px";
_37c.columnHeaderTable.style.left=_37f+"px";
_37c.contentTable.style.marginTop=_380+"px";
}},YLockedScrollStrategy:{getXOffset:function(_381,_382){
return (_381.contentTable.style.marginLeft)?parseInt(_381.contentTable.style.marginLeft)+_382:_382;
},getMaxXOffset:function(_383){
return _383.content.clientWidth-_383.contentTable.scrollWidth;
},getYOffset:function(_384,_385){
return (_384.rowLabelTable.style.top)?parseInt(_384.rowLabelTable.style.top)+_385:_385;
},getMaxYOffset:function(_386){
return _386.content.clientHeight-_386.contentTable.scrollHeight;
},scroll:function(_387,_388,_389){
var _38a=Math.min(Math.max(_388,this.getMaxXOffset(_387)),0);
var _38b=Math.min(Math.max(_389,this.getMaxYOffset(_387)),0);
_387.contentTable.style.marginLeft=_38a+"px";
_387.colLabelTable.style.top=_38b+"px";
_387.rowLabelTable.style.top=_38b+"px";
}},XYLockedScrollStrategy:{getXOffset:function(_38c,_38d){
return (_38c.columnHeaderTable.style.left)?parseInt(_38c.columnHeaderTable.style.left)+_38d:_38d;
},getMaxXOffset:function(_38e){
return _38e.content.clientWidth-_38e.contentTable.scrollWidth;
},getYOffset:function(_38f,_390){
return (_38f.rowLabelTable.style.top)?parseInt(_38f.rowLabelTable.style.top)+_390:_390;
},getMaxYOffset:function(_391){
return _391.content.clientHeight-_391.contentTable.scrollHeight;
},scroll:function(_392,_393,_394){
var _395=Math.min(Math.max(_393,this.getMaxXOffset(_392)),0);
var _396=Math.min(Math.max(_394,this.getMaxYOffset(_392)),0);
_392.colLabelTable.style.left=_395+"px";
_392.columnHeaderTable.style.left=_395+"px";
_392.rowLabelTable.style.top=_396+"px";
_392.colLabelTable.style.top=_396+"px";
}},_checkTruncate:function(pctX,pctY){
if(this.report.closeTruncateStatus=="BothClose"){
return;
}
if((this.truncateType=="COL"||this.truncateType=="BOTH")&&this.report.closeTruncateStatus!="ColClose"){
if(pctX>=1||this.scrollbarArea.clientWidth>=this.scrollbarAreaDiv.clientWidth){
cv.util.show(this.report.nodeColTruncate);
this.report.nodeColTruncate.style.left=(this.tableArea.clientWidth-dojo.html.getMarginBox(this.report.nodeColTruncate).width-35)+"px";
this.report.nodeColTruncate.style.top=(this.tableArea.offsetTop+10)+"px";
}else{
cv.util.hide(this.report.nodeColTruncate);
}
}
if(this.truncateType=="ROW"||this.truncateType=="BOTH"&&this.report.closeTruncateStatus!="RowClose"){
if(pctY>=1||this.scrollbarArea.clientHeight>=this.scrollbarAreaDiv.clientHeight){
cv.util.show(this.report.nodeRowTruncate);
this.report.nodeRowTruncate.style.top=(this.tableArea.offsetTop+this.tableArea.clientHeight-dojo.html.getMarginBox(this.report.nodeRowTruncate).height-28)+"px";
}else{
cv.util.hide(this.report.nodeRowTruncate);
}
}
}};
dojo.provide("clearview.widget.CVRptInfoTooltip");
dojo.widget.defineWidget("clearview.widget.CVRptInfoTooltip",clearview.widget.CVTooltip,{loadStatus:null,cacheTooltip:null,hideDelay_2:3000,showDelay:100,isEditDescHidden:true,isRenamingHidden:true,fillInTemplate:function(args,frag){
dojo.widget.Tooltip.superclass.fillInTemplate.call(this,args,frag);
this.addOnLoad(this,"_loadedContent");
dojo.html.addClass(this.domNode,"cvRptInfoTooltip");
var _397=this.getFragNodeRef(frag);
dojo.html.copyStyle(this.domNode,_397);
this.applyPopupBasicStyle();
},_onMouseOver:function(e){
this._mouse={x:e.pageX,y:e.pageY};
var node=e.target;
this._connectNode=node;
this._loadedContent();
if(cv.formatRptInfoTooltip){
cv.formatRptInfoTooltip();
this.cancelShowing=false;
}else{
this.domNode.innerHTML="Report information dialog has not been initialized for this element";
}
if(!this._tracking){
dojo.event.connect(document.documentElement,"onmousemove",this,"_onMouseMove");
this._tracking=true;
}
this._onHover(e);
},open:function(){
if(this.isShowingNow||this.cancelShowing){
return;
}
dojo.widget.PopupContainerBase.prototype.open.call(this,this._mouse.x,this._mouse.y,null,[this._mouse.x,this._mouse.y],"TL,TR,BL,BR",[-20,-10]);
},_position:function(){
this.move(this._mouse.x,this._mouse.y,[-20,-10],"TL,TR,BL,BR");
},loadRptProps:function(){
if(!this.cacheTooltip){
var _398=this;
dojo.io.bind({url:cv.contextPath+"templates/reportPropsDlg_2.html",handle:function(type,data,evt){
if(type=="load"){
if(cv.util.parseAjaxMsg(data)){
this.loadStatus="errorRptTooltipLoad";
return;
}
_398.cacheTooltip=data;
}else{
_398.loadStatus="errorRptTooltipLoad";
}
},mimetype:"text/plain",method:"POST",sync:true});
}
if(this.loadStatus!=null){
return false;
}
var str=this.loadRptProps.arguments.length>0?dojo.string.substituteParams(this.cacheTooltip,this.loadRptProps.arguments):this.cacheTooltip;
if(dojo.lang.isUndefined(cv.rptDlgWidget)){
cv.rptDlgWidget=cv.util.getDojoWidget("theRptInfoTooltip");
}
cv.rptDlgWidget.setContent("<form id=\"theRptTooltipForm\" action=\"\" onsubmit=\"return false\">"+str+"</form>");
if(!cv.getActiveReport().createPAA||!cv.getActiveReport().manager.isReportWritable){
dojo.html.addClass(dojo.byId("editNameButton"),"hidden");
dojo.html.setStyle(dojo.byId("closeButton"),"padding-left","23px");
}
this.theRptTooltipForm=dojo.byId("theRptTooltipForm");
var _399=dojo.byId("editDescButton");
if(_399){
dojo.event.connect(_399,"onclick",this,"showEditDesc");
}
var _39a=dojo.byId("editNameButton");
if(_39a){
dojo.event.connect(_39a,"onclick",this,"showRenameRpt");
}
if(dojo.byId("descBtnCancel")){
dojo.event.connect(dojo.byId("descBtnCancel"),"onclick",this,"hideEditDesc");
}
if(dojo.byId("descBtnSave")){
dojo.event.connect(dojo.byId("descBtnSave"),"onclick",this,"saveRptDesc");
}
if(dojo.byId("nameBtnCancel")){
dojo.event.connect(dojo.byId("nameBtnCancel"),"onclick",this,"hideRenameRpt");
}
if(dojo.byId("nameBtnSave")){
dojo.event.connect(dojo.byId("nameBtnSave"),"onclick",this,"renameReport");
}
if(dojo.byId("closeButton")){
dojo.event.connect(dojo.byId("closeButton"),"onclick",this,"closeTooltip");
}
return true;
},showRenameRpt:function(){
var node=dojo.byId("nameDiv");
node.innerHTML="<input id=\"hiddenRptName\" type=\"hidden\" value=\""+dojo.byId("name").innerHTML.replace(/(["])/gm,"////")+"\"><input id=\"name\" style=\"width:400px;\" value=\""+dojo.byId("name").innerHTML.replace(/(["])/gm,"////")+"\">";
dojo.html.setStyle(node,"padding-top","11px");
var _39b=dojo.byId("name").value.replace(/\/\/\/\//g,"\"");
dojo.byId("hiddenRptName").value=dojo.byId("name").value=_39b;
dojo.byId("name").focus();
dojo.html.removeClass(dojo.byId("nameBtn"),"hidden");
dojo.html.addClass(dojo.byId("editNameButton"),"hidden");
dojo.html.addClass(dojo.byId("closeButton"),"hidden");
this.isRenamingHidden=false;
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},hideRenameRpt:function(){
var node=dojo.byId("nameDiv");
node.innerHTML="<div id='name' style='font-weight: bold;width:360px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'>"+dojo.string.escape("html",dojo.byId("hiddenRptName").value)+"</div>";
dojo.html.setStyle(node,"padding-top","14px");
dojo.html.addClass(dojo.byId("nameBtn"),"hidden");
dojo.html.removeClass(dojo.byId("editNameButton"),"hidden");
dojo.html.removeClass(dojo.byId("closeButton"),"hidden");
this.isRenamingHidden=true;
if(!this._tracking){
dojo.event.connect(document.documentElement,"onmousemove",this,"_onMouseMove");
this._tracking=true;
}
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},showEditDesc:function(){
var node=dojo.byId("editDescTextArea");
dojo.html.removeClass(dojo.byId("editDescTextAreaTR"),"hidden");
dojo.html.addClass(dojo.byId("descDivTR"),"hidden");
if(cv.getActiveReport().reportDoc.getReportProperty("description")==""){
node.innerHTML="<input id=\"hiddenDesc\" type=\"hidden\" value=\""+dojo.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"\"><textarea id=\"description\" style=\"width:430px;\" rows=3></textarea>";
}else{
node.innerHTML="<input id=\"hiddenDesc\" type=\"hidden\" value=\""+dojo.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"\"><textarea id=\"description\" style=\"width:430px;\" rows=3>"+dojo.byId("description").innerHTML.replace(/(["])/gm,"&quot;")+"</textarea>";
}
dojo.html.removeClass(dojo.byId("descBtn"),"hidden");
dojo.byId("editDescDiv").innerHTML="";
dojo.byId("description").focus();
this.isEditDescHidden=false;
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},hideEditDesc:function(){
var node=dojo.byId("editDescDiv");
dojo.html.addClass(dojo.byId("editDescTextAreaTR"),"hidden");
dojo.html.removeClass(dojo.byId("descDivTR"),"hidden");
var _39c=dojo.byId("hiddenDesc").value;
node.innerHTML="<div id='description' style='word-break:break-all;overflow:auto;padding-left:10px;'>"+dojo.byId("hiddenDesc").value+"</div>";
dojo.html.addClass(dojo.byId("descBtn"),"hidden");
dojo.byId("editDescTextArea").innerHTML="";
this.isEditDescHidden=true;
this.isShowingNow=this.isEditDescHidden&&this.isRenamingHidden;
},saveRptDesc:function(){
var desc=dojo.byId("description").value;
cv.getActiveReport().setReportProperties({description:desc});
dojo.byId("description").innerHTML=desc;
dojo.byId("hiddenDesc").value=desc;
this.hideEditDesc();
},renameReport:function(){
var name=dojo.string.trim(dojo.byId("name").value);
if(dojo.string.trim(dojo.byId("hiddenRptName").value)!=dojo.string.trim(dojo.byId("name").value)){
if(!name){
return cv.flex.showMessage("error",cvCatalog.dlgErrEmptyReportName);
}
cv.getActiveReport().byId("ReportName").innerHTML=dojo.string.escape("html",name);
document.title=name;
cv.getActiveReport().reportDoc.setReportProperty("name",name);
dojo.byId("hiddenRptName").value=name;
}
this.hideRenameRpt();
},showTooltip:function(){
if(!this._tracking){
dojo.event.connect(document.documentElement,"onmousemove",this,"_onMouseMove");
this._tracking=true;
}
this.isShowingNow=true;
},closeTooltip:function(){
dojo.widget.PopupContainerBase.prototype.close.call(this);
this._tracking=false;
dojo.event.disconnect(document.documentElement,"onmousemove",this,"_MouseMove");
this.isShowingNow=false;
}});
var console_enabled=false;
function pentahoLoad(){
console_enabled=window.parent!=null&&window.parent.mantle_initialized==true;
if(cv.getActiveReport().manager.isReportWritable){
enableSaveButtons();
}
};
function enableEditButton(){
if(console_enabled&&window.parent.enableContentEdit){
window.parent.enableContentEdit(true);
}
};
function disableEditButton(){
if(console_enabled&&window.parent.enableContentEdit){
window.parent.enableContentEdit(false);
}
};
function lowerEditButton(){
if(console_enabled&&window.parent.setContentEditSelected){
window.parent.setContentEditSelected(true);
}
};
function resetEditButton(){
if(console_enabled&&window.parent.setContentEditSelected){
window.parent.setContentEditSelected(false);
}
};
function enableSaveButtons(){
if(console_enabled&&window.parent.enableAdhocSave){
window.parent.enableAdhocSave(true);
}
};
function disableSaveButtons(){
if(console_enabled&&window.parent.enableAdhocSave){
window.parent.enableAdhocSave(false);
}
};
function refreshBrowsePanel(){
if(console_enabled&&window.parent.mantle_refreshRepository){
window.parent.mantle_refreshRepository();
}
};
var gCtrlr=new WaqrProxy();
function WaqrProxy(){
this.wiz=new Wiz();
this.repositoryBrowserController=new RepositoryBrowserControllerProxy();
};
function Wiz(){
currPgNum=0;
};
function savePg0(){
};
function RepositoryBrowserControllerProxy(){
this.getPossibleFileExtensions=function(){
return [".xanalyzer"];
},this.remoteSave=function(_39d,_39e,_39f,_3a0,_3a1){
if(_39d.indexOf(".xanalyzer")!=-1&&_39d.indexOf(".xanalyzer")==(_39d.length-10)){
_39d=_39d.substr(0,_39d.length-10);
}
cv.getActiveReport().reportDoc.setReportProperty("name",unescape(_39d.replace("+","%20")));
var _3a2=cv.getActiveReport().manager.saveReport("saveAs",_39d,_39e+_39f);
if(_3a2==true){
refreshBrowsePanel();
}
};
};
function drill(col,row){
var _3a3=new Date();
var _3a4="drillpopup"+_3a3.getTime();
window.open("",_3a4,"scrollbars=no,menubar=no,height=550,width=800,resizable=yes,toolbar=no,status=no");
var form=dojo.byId("drillForm");
form.setAttribute("action",cv.contextPath+"drill");
form.setAttribute("target",_3a4);
var _3a5=dojo.byId("drillForm_reportXML");
_3a5.setAttribute("value",cv.getActiveReport().getReportXml());
_3a5=dojo.byId("drillForm_colIndex");
_3a5.setAttribute("value",col);
_3a5=dojo.byId("drillForm_rowIndex");
_3a5.setAttribute("value",row);
form.submit();
};
function linkPivot(src){
var node=src.parentNode.parentNode;
var ctx={formula:node.getAttribute("formula"),member:node.getAttribute("member"),clickLevel:true};
cv.getActiveReport().linkDlg.performAction(new Array(ctx));
};
function linkChart(json){
var _3a6=eval("("+json+")");
cv.getActiveReport().linkDlg.performAction(_3a6);
};
function keepAndShow(json){
var _3a7=eval("("+json+")");
cv.getActiveReport().clickChart(_3a7);
};

