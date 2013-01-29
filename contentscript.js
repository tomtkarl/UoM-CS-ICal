function loadNextPlugin(plugins) {
  // "pop" the next script off the front of the queue
  var nextPlugin = plugins.shift();

  // load it, and recursively invoke loadNextPlugin on the remaining queue
  var tag = document.createElement('script');
  tag.src = chrome.extension.getURL(nextPlugin);
  tag.onload = function() {
    if (plugins.length)
      loadNextPlugin(plugins);
  };
  (document.head||document.documentElement).appendChild(tag);
}

loadNextPlugin(["jquery.min.js", "downloadify.min.js", "jquery.icalendar.js", "swfobject.js", "jquery-ui.js", "addical.js"]);