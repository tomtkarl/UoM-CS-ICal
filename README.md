UoM-CS-ICal
===========

A Chrome extension for adding ICal export functionality to semester timetables on the cs.manchester.ac.uk site.

By way of an intro:

 *`addical.js` is the main body which includes scraping all the data together, instantiating `icalendar` and `downloadify`
 *`jquery.icalendar.js` is the [iCalendar plugin](http://keith-wood.name/icalendar.html) which inserts the export buttons.
 *`jquery.icalendar.css` is the iCalendar plugin's associated CSS
 *`icalendar.png` is a combined image for all the icalendar export options in the plugin
 *`download.png` is a combined image of the four button states used by Downloadify.