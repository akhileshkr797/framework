/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:This script file contain common variables used in the system.
* [--Change history--]
*/
var comment_obj;
var error_obj;

var PN ="";
var	oapcFlag=false;
var g_focusFlag=false;//26Feb
var g_formElement;
var g_obpcFlag;//Madhavi Feb19th//for before prompt

var g_sepWindow;//Handle for the normal window while opening
var g_fir,g_sec; // getNCalendarDays

var g_listSep = ',';// used in RangeCheck
var g_hand;

//Error Message Variables
var g_logo;
var g_xOff = 7;
var g_yOff = 5;

//THIS BOOLEAN VARIABLE IS USED FOR OVALIDATE FUNCTION
 var g_isTabKey=false;
 var g_isF4Key=false;

//anchor link submission
var g_ancrLinkName="";
var g_ancrObject ="";
var g_owait=""; //added by madhavi on 12aug02 for please wait message

var windowcount=1;

var g_div; //for scroll fields "L" type and ShowLayer
var g_objTab; //for YUI tab control


//modal window sizing
var g_xp = 30;
var g_yp= 30;

var g_AVarray;//allowed values
var g_RAarray; //range values

//var tempobject; //used to store object references in various functions - madhavi

var doc; // Value is set in the function setFocus()
var g_VFlag=false //for validations in lostFocus() and gFocus()
//var g_oldValue="" //To catch the intial value at the time of gotfocus

var g_gkURL =	applURL + "/jsp/app/gk.jsp?"
var g_modalURL =	applURL + "/jsp/app/modal.jsp?"
var g_graphURL =	applURL + "/jsp/app/graph.jsp?"
var g_xmlgraphURL =	applURL + "/jsp/app/xmlgraph.jsp?"
/*
var g_htmlgraphURL =	applURL + "/jsp/app/htmlgraph.jsp?"
var g_htmlgraphvURL =	applURL + "/jsp/app/htmlgraphV.jsp?"
var g_htmlgraphhURL =	applURL + "/jsp/app/htmlgraphH.jsp?"
*/
var g_escUrlStr =  g_gkURL + "ESC=1"

var g_ancrLinkName=""
var g_ancrObject =""
var g_ch255 = '\u00FF'; //for afterprompt return seperator value 
var g_ch254 = '\u00FE';
var g_ch253 = '\u00FD';
var g_ch252 = '\u00FC';
var g_ch251 = '\u00FB'; //added for field level validation by ESC

/// constants.js
var g_homePath = applURL + "/jsp/home"

var g_lastMenu = null;
if (document.all)    {n=0;ie=1;fShow="visible";fHide="hidden";}
if (document.layers) { n=1;ie=0;fShow="show";   fHide="hide";}

//Browser 
var g_ie4=false 
var g_ns4=false  

if(document.all)
	g_ie4=true ;  //If browser is IE
else  
	g_ns4=true ;//If Browser is Netscape
var g_HitCount=1;//For blocking double submit
//To keep focus on right menu.
var	contextFlag=false;

// ieKey event.keyCode for ie
//nKey e.which for ns
var ieKey,nKey;
