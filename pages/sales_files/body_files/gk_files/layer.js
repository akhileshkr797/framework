/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description	
* @version history	:
*/
//--------------------------------------------------------------
//Layer scripts
//Author : Downloaded by Madhavi
//--------------------------------------------------------------
//BA Change var g_isMinNS4 = (navigator.appName.indexOf("Netscape") >= 0 && parseFloat(navigator.appVersion) >= 4) ? 1 : 0;
//BA Change var g_isMinIE4 = (document.all) ? 1 : 0;
//BA Change var g_isMinIE5 = (g_isMinIE4 && navigator.appVersion.indexOf("5.")) >= 0 ? 1 : 0;

var g_isMinNS4 =(document.layers)?true:false;
var g_isMinIE5=(document.all)?true:false;
var g_isMinIE4=false;
//****************************************************************************************
//errlayer.js
//****************************************************************************************
function hideLayer(layer) {
	layer.style.visibility = "hidden";
	clearInterval(g_hand);
}

function showLayer(layer) {
	layer.style.visibility = "visible";
}

function isVisible(layer) {
  if (layer.style.visibility == "visible")   return(true);
  return(false);
}

//****************************************************************************************
// Layer positioning.
//****************************************************************************************

function moveLayerTo(layer, x, y) {
    layer.style.left = x;
    layer.style.top  = y;
}

function moveLayerBy(layer, dx, dy) {
    layer.style.pixelLeft += dx;
    layer.style.pixelTop  += dy;
}

function getLeft(layer) {
	if (!(layer))	 return;
    return(layer.style.pixelLeft);

}

function getTop(layer) {
    return(layer.style.pixelTop);
}

function getRight(layer) {
    return(layer.style.pixelLeft + getWidth(layer));
}

function getBottom(layer) {
    return(layer.style.pixelTop + getHeight(layer));
}

function getPageLeft(layer) {
    return(layer.offsetLeft);
}

function getPageTop(layer) {
    return(layer.offsetTop);
}

function getWidth(layer) {
  if (g_isMinNS4) {
    if (layer.document.width)
      return(layer.document.width);
    else
      return(layer.clip.right - layer.clip.left);
  }
  if (g_isMinIE4) {
    if (layer.style.pixelWidth){
      return(eval("layer.style.pixelWidth"));
	  }
    else{
		  return(layer.clientWidth);
	  }
  }
  return(-1);
}

function getHeight(layer) {
  if (g_isMinNS4) {
    if (layer.document.height)
      return(layer.document.height);
    else
      return(layer.clip.bottom - layer.clip.top);
  }
  if (g_isMinIE4) {
    if (false && layer.style.pixelHeight)
      return(layer.style.pixelHeight);
    else
      return(layer.clientHeight);
  }
  return(-1);
}

function getzIndex(layer) {
  if (g_isMinNS4)
    return(layer.zIndex);
  if (g_isMinIE4)
    return(layer.style.zIndex);
  return(-1);
}

function setzIndex(layer, z) {
  if (g_isMinNS4)
    layer.zIndex = z;
  if (g_isMinIE4)
    layer.style.zIndex = z;
}


//-----------------------------------------------------------------------------
// Layer background.
//-----------------------------------------------------------------------------

function setBgColor(layer, color) {
  if (g_isMinNS4)
    layer.bgColor = color;
  if (g_isMinIE4)
    layer.style.backgroundColor = color;
}

function setBgImage(layer, src) {
  if (g_isMinNS4)
    layer.background.src = src;
  if (g_isMinIE4)
    layer.style.backgroundImage = "url(" + src + ")";
}

//-----------------------------------------------------------------------------
// Layer utilities.
//-----------------------------------------------------------------------------

function getLayer(name,doc) {
	return	doc.getElementById(name);
	/*BA Change
  if (g_isMinNS4)
    return findLayer(name, document);
  if (g_isMinIE4){ 
     //alert(eval('doc.all.' + name))
	  return eval('doc.all.' + name);//changed on Dec12th Madhavi.N
    }  
  return null;
  */
}

function findLayer(name, doc) {
  var i, layer;
  for (i = 0; i < doc.layers.length; i++) {
    layer = doc.layers[i];
    if (layer.name == name)
      return layer;
    if (layer.document.layers.length > 0) {
      layer = findLayer(name, layer.document);
      if (layer != null)
        return layer;
    }
  }
  return null;
}

//-----------------------------------------------------------------------------
// Window and page properties.
//-----------------------------------------------------------------------------

function getWindowWidth() {
  if (g_isMinNS4)
    return(window.innerWidth);
  if (g_isMinIE4) {
	return(doc.body.clientWidth);
	}
  return(-1);
}

function getWindowHeight() {
  if (g_isMinNS4)
    return(window.innerHeight);
  if (g_isMinIE4)
    return(doc.body.clientHeight);
  return(-1);
}

function getPageWidth() {
  if (g_isMinNS4)
    return(document.width);
  if (g_isMinIE4)
    return(doc.body.scrollWidth);
  return(-1);
}

function getPageHeight() {
  if (g_isMinNS4)
    return(eval('doc.height'));
  if (g_isMinIE4)
    return(eval('doc.body.scrollHeight'));
  return(-1);
}

function getPageScrollX() {
  if (g_isMinNS4)
    return(window.pageXOffset);
  if (g_isMinIE4)  {
		return(eval('doc.body.scrollLeft'));
  }
  return(-1);
}

function getPageScrollY() {
  if (g_isMinNS4)
    return(window.pageYOffset);
  if (g_isMinIE4)	 {
    return(eval('doc.body.scrollTop'));	 }
  return(-1);
}
