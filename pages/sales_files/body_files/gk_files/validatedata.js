/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:
* [--Change history--]
*[24Jan19:ESC] Logic added to enconde the & in the field value using encodeURIComponent

*/
function getServerData(sURL,sData)	{
	var returnData="";
	var responsedata=$.ajax({
		url : sURL,
		type: "POST", 
		processData: false,
		data: sData,				
		success : function (data) {			
		},
		async:false 
	}).responseXML;

	var nodelist=responsedata.getElementsByTagName("param");
	if (nodelist.length==3){
		returnData=nodelist[0].getAttribute("value");
		returnData+=g_ch255+nodelist[1].getAttribute("value");
		returnData+=g_ch255+nodelist[2].getAttribute("value").replace(String.fromCharCode(10), "---");
	}else{
		returnData="1"+g_ch255+"Server Returned Invalid Data";
	}
	return returnData;
}
function AfterPrompt(c, uvSubr,firstParam,secondParam,thirdParam){
	resetSessionTimer();//For reseting the session timer	
	if (uvSubr){
		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {		   
			 //  firstParam=escapeStr(firstParam);		   
		}
		//firstParam = replaceChar(firstParam,"+",String.fromCharCode(31));		
		firstParam = firstParam.replace(/\n\r?/g, '%0D%0A');
//24Jan19 Logic added to enconde the & in the field value using encodeURIComponent by ESC
		firstParam=encodeURIComponent(firstParam);
		var qrystr="funcName=" + uvSubr + "&fldValues=" +(firstParam) + "&linkName=" + secondParam + "&thirdParam=" +thirdParam+ "&ESC=10"
		var url = g_gkURL + qrystr;
		
	    call_err(c, "Server is validating the data....  Please wait !!!!!","W");
		var retrn_val;
		retrn_val=getServerData(g_gkURL,qrystr);
		hideLayer(document.all.err_msg); //layer is shown in "AfterPrompt"
		return retrn_val;
	}
	
	//After prompt function send the specified element values to the server and gets back 
	//the default values
	var targetStr = "";
	if (c.getAttribute("OI1") && c.getAttribute("OI1")!=""){  //check if OI1 attribute is available or not.
		var indexArr = c.getAttribute("OI1").split(",")			//SPLIT THE NAMES/OAPC ATTRIBUTE 		
		if(indexArr.length>0) {
			for (var i=0; i<indexArr.length; i++ ) {
				var obj=GetObjectByTabIndex(indexArr[i],c.document)
				if (obj) targetStr=targetStr + obj.value + 	g_ch254
			}//end of for loop
			targetStr = targetStr.substring(0,targetStr.length-1)
		}//end of IF
		
		if (trimString(targetStr).length != 0 ){			
			var UVSRName ="",vLinkName="",vThirdParam="";
			if (c.getAttribute("UVSUBR") && c.getAttribute("OI2") && c.getAttribute("OI3"))  {
				UVSRName = c.getAttribute("UVSUBR");
				vLinkName= c.getAttribute("OI2");
				vThirdParam = c.getAttribute("OI3");
				var qrystr="funcName=" + UVSRName + "&fldValues=" + encodeURIComponent(targetStr) + "&linkName=" + vLinkName + "&thirdParam=" + vThirdParam + "&ESC=10"
				var url = g_gkURL + qrystr;
				call_err(c, "Server is validating the data....  just wait!!!!!!!!","W");
				//var retrn_val = window.showModalDialog(url,"","dialogWidth=50px;dialogHeight=50px;center=0;help=0;resizable=1;border=thin;status=0;title=0;dialogLeft=635px;dialogTop=0px")
				var	retrn_val=getServerData(g_gkURL,qrystr);				

				hideErrLayer();//code added for "please wait" message 16aug03
				hideLayer(document.all.err_msg); //layer is shown in "AfterPrompt"
				// ParseAfterPromptData(c,retrn_val);
				retrn_val=afterPromptPopUp(retrn_val);
				return retrn_val;
				
			}
		}
	}//end of check for OI1 		
} //end of the function  "after prompt"   

function validateBusinessRules(ele){
	var ruleIndexes=(ele.getAttribute("OBE")).split(",");
	for(var k=0;k<ruleIndexes.length;k++){
		for(var i=0;i<BusinessRules.length;i++)
			if(BusinessRules[i][0]==ruleIndexes[k]){
				break;
		}
		switch(BusinessRules[i][1]){
			case "A":	promptTags(ele,BusinessRules[i]);	break;
			case "F":	compute(BusinessRules[i][2],ele);	break;
					break;
		}
	}
}

function validateText(obj){
	var tobj=obj.nextSibling;
	while(tobj  && tobj.nodeName.toLowerCase()!="input")
	tobj=tobj.nextSibling;

	var rtnval=getOTABINDEXValues(tobj,false);//false since no escape character check is required
	var returnData=AfterPrompt(obj,tobj.getAttribute("UVSUBR"),rtnval,tobj.getAttribute("OI2"),"SINGLE" + tobj.getAttribute("OI3").slice(6));
	var parsedMessage = returnData.split(g_ch255);

	if(parsedMessage[0]=="1"){
		obj.setAttribute("OSV",parsedMessage[1]);
		call_err(obj,  parsedMessage[1]);
		return 1;
	}else if(parsedMessage[0]=="3"){
		obj.setAttribute("OSV",true);			
		return -1;
	}else{
		obj.value=parsedMessage[1];
		obj.setAttribute("OSV",true);
		fillDefaults(parsedMessage[2]); //added for collateral information
		afterPromptPopUp(returnData);
		return 0;
	}
}
function ParseAfterPromptData(obj,message){
	var status,data;
	var parsedMessage = message.split(g_ch255);
	status =  parsedMessage[0]; 
	data =  parsedMessage[1];   
	obj.setAttribute("OSV",parsedMessage[1]);
	if(status=="1"){
		call_err(obj,  parsedMessage[1]);
		return false;
	}else{
		//hideLayer(document.all.err_msg);
		return true;
	}
}

/*
*	Note: code added to fill values in html elements of type radio,checkbox,select(one & multiple)
*/
function fillDefaults(data) {	
	if (trimString(data)=="") return;
	var pairs = data.split(g_ch254);
	var names,values;
	for (var i=0; i<pairs.length ; i++ ){
		var temp = pairs[i].split("ý");
		var ele=getObjectReference(temp[0]);
		if(ele || ele!=null){
			//Note: Radio buttons to be handled
			if(ele.type.toLowerCase() == "radio"){
				//eval(ele[temp[1]]+".checked");			
				setRadioValue(ele,temp[1]);			
			}else if(ele.type.toLowerCase() == "checkbox"){
				//eval(ele[temp[1]]+".checked");
				var values=temp[1].split(g_ch252);
				setCheckboxValue(ele,values);
			}else if(ele.type.toLowerCase() == "select-one" || ele.type.toLowerCase() == "select-multiple"){
				//eval(ele[temp[1]]+".checked");
				var values=temp[1].split(g_ch252);
				for(var k=0;k<ele.options.length;k++){
					for(var m=0;m<values.length;m++){
						if(ele.options[k].value.toLowerCase()==values[m].toLowerCase()){
							ele.options[k].selected=true;
						}
					}
				}
			}else{
				ele.value=temp[1];
			}
		}
	}
}	
function afterPromptPopUp(sValue){
	var data=sValue.split(g_ch255);
	var stemp,sline;
	var url=g_modalURL;
	var ESC;
	var UVSRName="";
	var vFirstParam="";
	var vSecondParam="";
	var vThirdParam="";
	var modalTitle	= "";
	var modalType	= "";
	var qrystr = ""
	var modalSize= 'M';

	if (data[0]!=10) return;
	
	sline=data[2].split(g_ch254);		
	vSecondParam=sline[1];
	vThirdParam=sline[2]

//Assign the values form the header line
	stemp=sline[0].split(g_ch253);
	UVSRName=stemp[0];
	modalType=stemp[1];
	modalSize=stemp[2];
	modalTitle=stemp[3];
//Assign the Input param 1 value

	for (i=3;i<sline.length;i++){
		vFirstParam=vFirstParam+sline[i]+g_ch254;
	}
	if (vFirstParam.length>1){
		vFirstParam=vFirstParam.substring(0,vFirstParam.length-1)
	}	

	//sTemp="<A href='#' name='"+vSecondParam+"' UVSUBR='"+UVSRName+"' OI1='"+vFirstParam+"' OI2='"+vSecondParam+"'";
	//sTemp=sTemp+" OTITLE='"+modalTitle+"' OMSIZE='"+modalSize+"' OMODALTYPE='"+modalType+"'>";
	
	g_ancrObject=document.createElement("a");
		
	g_ancrObject.setAttribute("name",vSecondParam);
	g_ancrObject.setAttribute("UVSUBR",UVSRName);
	g_ancrObject.setAttribute("OI1",vFirstParam);
	g_ancrObject.setAttribute("OI2",vSecondParam);
	g_ancrObject.setAttribute("OTITLE",modalTitle);
	g_ancrObject.setAttribute("OMSIZE",modalSize);
	g_ancrObject.setAttribute("OMODALTYPE",modalType);
	
	show_Dialog(g_ancrObject);
	return;
}
//--------------------------------------------------------------
//Before Prompt
//Author : Bhanu Modali & Jogi
//--------------------------------------------------------------

function BeforePrompt(obj)
{
/*check whether the control has attribute <OBPC> set to "Y"
	Check for all the elements in the html doc for elements with attribute <OBP>
	for each element of OBP, extract the OBP value and compare with OBPC control value.
	if OBP element Value matches make the OBPC element value, then make it visible else invisible*/


	g_obpcFlag=obj;
	tempEl = obj.offsetParent;
	while (tempEl.tagName  != 'DIV') {
  		tempEl = tempEl.offsetParent
	}

	layerid=  tempEl.id
	layerFlag = eval('document.all.'+layerid+'.style.visibility')

	for(var i=0;i<obj.document.forms.length;i++){
		for(var j=0;j<obj.document.forms[i].elements.length;j++){
			var ele=obj.document.forms[i].elements[j];
			 if (ele.getAttribute("OBP") )	 {
				var arr=ele.getAttribute("OBP").split("=")
				if (arr[0].toUpperCase()==obj.name.toUpperCase()){
					var arrval=arr[1].split(",")
					for(var k=0;k<arrval.length;k++){
						//code added for enabling or disabling
						if (arrval[k].toUpperCase()==obj.value.toUpperCase()) {
							ele.disabled=false
						}else{							
							ele.value=""
							ele.disabled=true
						}						
					}
				}
			}
		}
	}
}


//--------------------------------------------------------------
//After Prompt
//Author : Jogi & Bhanu Modali
//--------------------------------------------------------------
//replaced in common.js on 5-1-02
function promptTags(ele,rule){   //version 2 syntax: flag,name-value pair, message
	var uvSubr=rule[3];
	objArr = rule[2].split(",");
	var firstParam="";
	var objelem;
	var elemvalue="",elemname="";
	var pos;
	for(i=0;i<objArr.length;i++){
		elemvalue="";
		//bmm 16/jun/05
		//check if the field/element name has *
		pos=objArr[i].indexOf("@");
		if(pos>-1){ //if grid field			
			var xrule=objArr[i].substring(pos+1,objArr[i].length);
			objArr[i]=objArr[i].substring(0,pos);
			xrule=xrule.toUpperCase();
			elemvalue=getOGridFldValue(objArr[i],xrule);
			firstParam +=elemvalue + g_ch254;			
			//
		}else{
			objelem=getObjectReference(objArr[i]);
			if(objelem){ //code added by madhavi 15dec01						
				if(objelem.type.toLowerCase()=="radio"){			
					var	frm=objelem.form;
					for(var j=0;j<frm.elements.length;j++){
						if(frm.elements[j].name==objelem.name && frm.elements[j].checked){
							elemvalue=frm.elements[j].value;
							break;
						}
					}
				}else if(objelem.type.toLowerCase()=="checkbox"){			
					var	frm=objelem.form;
					for(var j=0;j<frm.elements.length;j++){
						if(frm.elements[j].name==objelem.name && frm.elements[j].checked){						
							elemvalue+=frm.elements[j].value+g_ch252;
						}
					}
					if(elemvalue.length>0){
						elemvalue=elemvalue.substring(0,elemvalue.length-1);
					}
				}else if(objelem.type.toLowerCase() == "select-multiple"){			
					for(var k=0;k<objelem.options.length;k++){
						if(objelem.options[k].selected){
							elemvalue+=objelem.options[k].value+g_ch252;
						}
					}
					if(elemvalue.length>0){
						elemvalue=elemvalue.substring(0,elemvalue.length-1);
					}
				}else{
					elemvalue=objelem.value;
				}
				firstParam +=elemvalue + g_ch254;
			}//end of if(objelem)
		}//end of if grid field
	}//end of for
	firstParam=firstParam.substring(0,firstParam.length-1);
//Code added to add the row index if the field is an scroll field along with field name by ESN on 19Apr06
	elemname=ele.name;
	if(getParentObjByTag(ele,"FORM").OSCROLLTYPE){
		//if(!g_sf_selRow) //Modified by ESC on 07March2013
		init_sf(ele);
		elemname=elemname+","+g_sf_selRow.rowIndex;
	}
	var returnValue=AfterPrompt(ele, uvSubr,firstParam,elemname,rule[1]);
	hideLayer(document.all.err_msg); //layer is shown in "AfterPrompt"
	var data=returnValue.split(g_ch255);
	if (rule[1]=="B"){
		if (data[0]!="0"){
			ele.disabled=true;			
			}
		else{
			ele.disabled=false;			
		}
	}
	if (data[0]=="3"){
		if(confirm(data[2])){
			data[0]=="0";
		}else{
			data[0]=="1";
		}
	}
	if(trimString(data[2])!="" && data[0]!=10) {		
		ele.setAttribute("OFLAG","F");
        if (data[0]=="1"){
			//sweetAlert("",data[2],"error");			
			alert(data[2]);
			}
		else
		    call_err(ele,data[2]);
     }
	 //Code added by ESC on 13Oct06 to move the focus to PASS/FAIL fields if defined by the programmer
	if (data[0]=="1" || data[0]=="99"){
		ele.setAttribute("OFLAG","F");
		if (ele.getAttribute("OFAIL")){
			getObjectReference(ele.getAttribute("OFAIL")).focus();
		}
	}else{
		ele.setAttribute("OFLAG","P");
		if (ele.getAttribute("OPASS")){
			getObjectReference(ele.getAttribute("OPASS")).focus();
		}
	}
	switch (data[0]){
		case "10":	afterPromptPopUp(returnValue);
					break;
		case "20":	fillXMLValues(data[1]);
					if(trimString(data[2])!="") {
						//sweetAlert("",data[2],"error");
						alert(data[2]);
					}
					break;
		default: fillDefaults(data[1]);
					break;	
	}

}

function fillXMLValues(xmlData){
	var temp=xmlData;

	var xmlDoc = $.parseXML(xmlData)		
    $xml = $(xmlDoc);
	var tempNode=$($xml).find("afterprompt>wdelement");	
	

	for (var iCounter=0;iCounter<tempNode.length ;iCounter++ ){
		sObjName=tempNode[iCounter].getAttribute("name");
		sObjValue=tempNode[iCounter].getAttribute("value");
		sObjRule=tempNode[iCounter].getAttribute("rule");
		sObjChord=tempNode[iCounter].getAttribute("chord");
		
		if(!sObjRule){
			sObjRule="set";
		}
		if(!sObjChord){
			sObjChord="";  
		}

		if (getObjectReference(sObjName)){ 			
			var objElem=getObjectReference(sObjName);
			if (objElem.disabled){
				objElem.disabled=false;
			}
			if (sObjRule=="set"){				
				if (objElem.type.toLowerCase()== "radio"){
					setRadioValue(objElem,sObjValue);
				}else if (objElem.type.toLowerCase() == "select-one" || objElem.type.toLowerCase() == "select-multiple"){
					for(i=0; i<objElem.options.length;i++){
						if ($.trim(objElem.options[i].value)==sObjValue){
							objElem.options[i].selected=true;
						}
					}
				}else if (objElem.type.toLowerCase() == "checkbox"){
					//chkvalues=split(sObjValue,g_ch252);	[27Oct17:ESC] changed the Syntax by ESC
					chkvalues=sObjValue.split(g_ch252);
					setCheckboxValue(objElem,chkvalues);
				}else{
					objElem.value=sObjValue;
				}
			}
			if (sObjRule=="refill"){
				objElem.length=1;
				for (iCounter1=1; iCounter1<tempNode[iCounter].childNodes.length;){
					var optionNode=tempNode[iCounter].childNodes[iCounter1];	
					sName=optionNode.getAttribute("label");
					sValue=optionNode.getAttribute("value");
					if (!sName){
						sName=sValue;
					}
					objElem.length=objElem.length+1;
					objElem.options[objElem.length-1].text=sName;
					objElem.options[objElem.length-1].value=sValue;
					if ($.trim(sObjValue)== $.trim(sValue)){
						objElem.options[objElem.length-1].selected=true;
					}
					 iCounter1=iCounter1+2;
				}
			}
			if (sObjChord==""){
				if (objElem.getAttribute("CHORD") ){ 
					if (objElem.CHORD=="HIDE"){ 
						objElem.disabled=true;
					}
				}			
				else if (objElem.getAttribute("REQ")){ 
					if (sObjChord=="R"){
						objElem.REQ="Y";
					}else if (sObjChord=="O"){
						objElem.REQ="N";
					}
				}
			}
			if (sObjChord=="H"){
				objElem.disabled=true;
			}
		}//End of get object refernce check	

	}//End of For Loop

//----------------------Code for handling  refilling default values in Grid controls-------------
var iRowCount,elemNode,iTotalRow,iCellPos,cpos;
var sTemp,newrow,newcell;
var sObjName,objElem,optionNode


	var xmlDoc = $.parseXML(temp)		
    $xml = $(xmlDoc);
	var gridNodeList=$($xml).find("afterprompt>wdgrid");	

	for (iCounter=0; iCounter<gridNodeList.length;iCounter++){
		iTotalRow=gridNodeList[iCounter].getAttribute("count");		
		if (gridNodeList[iCounter].childNodes[1]){			
			 sObjName=gridNodeList[iCounter].childNodes[1].getAttribute("name");
			 if (getObjectReference(sObjName)){
				objElem=getObjectReference(sObjName);
				init_sf(objElem);
				var iRow=g_sf_table.rows.length-2;	
				for (var i=1;i<iRow;i++){
					g_sf_table.deleteRow(1);
				}				
				clearRow(g_sf_form);
			 }//End of get Object Reference 			 
		}//End of first element check to initialize and clear the scroll fields	
//-------------------Process the Grid Data-----------------
		for (i=0; i<iTotalRow;i++){
			for(j=0;j<gridNodeList[iCounter].childNodes.length-1;j++){
				if (gridNodeList[iCounter].childNodes[j].nodeType==1){
				    sObjName=gridNodeList[iCounter].childNodes[j].getAttribute("name");		
					optionNode=gridNodeList[iCounter].childNodes[j].childNodes[i*2+1];
					objElem=getObjectReference(sObjName);
					sValue=optionNode.getAttribute("value");
					sValue=replaceString(sValue,"<","&lt;");
					sValue=replaceString(sValue,">","&gt;");					
					objElem.value=sValue;
				}				
			}
			newRec(objElem,"A");
		}//End of Row record loop

//----------------End of Processing the Grid Data----------
	}//End of Grid Loop
}
