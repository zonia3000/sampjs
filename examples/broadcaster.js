// Script to allow broadcast of links.
// To make a link which acquires a "broadcast" button, give a <a> element
// the class "broadcaster" and an appropriate "mtype" attribute, e.g.:
//   <a href="table.vot" class="broadcaster" mtype="table.load.votable"/>

(function() {
   var baseUrl = window.location.href.toString().
                        replace(new RegExp("[^/]*$"), "");

   var loadAction = function(mtype, url) {
      return function() {
         var message = new samp.Message(mtype, {"url": url});
         connector.connection.notifyAll([message]);
      }
   };

   var sendClass = "sampBroadcastButton";

   var hasClass = function(node, className) {
      var classAtt = node.className;
      if (!classAtt) {
         return false;
      }
      var classes = classAtt.split(/\s+/);
      var i;
      for (i = 0; i < classes.length; i++) {
         if (classes[i] == className) {
            return true;
         }
      }
      return false;
   };

   var getClassElements = function(tagName, className) {
      var classEls = [];
      var els = document.getElementsByTagName(tagName);
      var ie;
      for (ie = 0; ie < els.length; ie++) {
         if (hasClass(els[ie], className)) {
            classEls.push(els[ie]);
         }
      }
      return classEls;
   }

   var toUrl = function(href) {
      if (href.match(/^http:\/\/.*/) || href.match(/^ftp:\/\/.*/)) {
         return href;
      }
      if (href.match(/^\/.*/)) {
         var loc = window.location;
         var origin = loc.protocol + "://" + loc.hostname;
         if (loc.port) {
             origin = origin + ":" + loc.port;
         }
         return origin + href;
      }
      return baseUrl + href;
   };

   var addBroadcastLinks = function() {
      var aEls = getClassElements("a", "broadcaster");
      for (var ia = 0; ia < aEls.length; ia++) {
         var aEl = aEls[ia];
         var mtype = aEl.getAttribute("mtype");
         var url = toUrl(aEl.href);
         sendButt = document.createElement("button");
         sendButt.setAttribute("type", "button");
         sendButt.className = sendClass;
         sendButt.appendChild(document.createTextNode("Broadcast"));
         sendButt.onclick = loadAction(mtype, url);
         aEl.parentNode.insertBefore(sendButt, aEl.nextSibling);
      }
   };

   var setBroadcastLinksActive = function(isActive) {
      var buttEls = getClassElements("button", sendClass);
      for (var ib = 0; ib < buttEls.length; ib++) {
         buttEls[ib].disabled = !isActive;
      }
   };

   var meta = {
      "samp.name": "WebSender",
      "samp.description": "Web page that broadcasts tables to SAMP clients",
      "samp.icon.url": baseUrl + "clientIcon.gif"
   };
   var connector = new samp.Connector("Web Sender", meta, null, null);

   connector.onreg = function() {
      setBroadcastLinksActive(true);
   };
   connector.onunreg = function() {
      setBroadcastLinksActive(false);
   };

   onload = function() {
      document.getElementById("regPanel").
               appendChild(connector.createRegButtons());
      addBroadcastLinks();
      setBroadcastLinksActive(false);
   };
   onunload = function() {
      connector.unregister();
   };
})();
