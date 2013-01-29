$(document).ready(function() {
  //hidden text area to echo ical defs to
  var ical_echo = $("<textarea></textarea>");
  ical_echo.attr("id", "ical_echo");
  ical_echo.hide();
  $("div#footer").before(ical_echo);
  //placeholder <p> for the save button
  var ical_save = $("<p></p>");
  ical_save.attr("id", "ical_save");
  $("div#timetabletable table").after(ical_save);
  //instantiate the download button
  download_options = {swf: 'http://thoughtress.com/jquery/downloadify.swf',
                       downloadImage: 'http://thoughtress.com/jquery/download.png',
                       filename: "cs_timetable.ics",
                       data: function(){
                        return merge_icals(); 
                       },
                       width: 100,
                       height: 30,
                       transparent: true,
                      onError: function(){ 
                        alert('Error: Cannot save an empty file'); 
                      },};
  $('#ical_save').downloadify(download_options);
  
  var added_icals = [];
  function copy_ical(ical){
    for (ev in added_icals){
      if (ical == added_icals[ev]){
        return false;
      }
    }
    if (ical != ""){
      added_icals.push(ical);
    }
  }
  //copying ical defs echoed to field
  setInterval(function(){
    copy_ical($('#ical_echo').val()); 
  }, 100);
  
  //merging iCal events from added_icals
  //to a single iCal VCALENDAR definition
  function merge_icals(){
    if (added_icals.length == 1){
      return added_icals[0]; 
    }
    cont_icals = [];
    header_regex = /(.*\n){4}/; //remove first 4 lines
    trailer_regex = /END:VCALENDAR/; //remove block end
    for (ev in added_icals){
      if (ev == 0){ //only remove trailer
        cont_icals[ev] = added_icals[ev].replace(trailer_regex, "");
      } else if (ev == (added_icals.length-1)){ //only remove header
        cont_icals[ev] = added_icals[ev].replace(header_regex, "");
      } else { //remove header and trailer
        cont_icals[ev] = added_icals[ev].replace(trailer_regex, "").replace(header_regex, "");
      }
    }
    return cont_icals.join("\n");
  }
  
  function make_icalendar(listing, event){
    event.start = new Date(event.active_dates.splice(0,1));
    event.start.setHours(event.hour);
    event.end = new Date(event.start);
    //assume all events are 1 hour :|
    event.end.setHours(event.hour+1);
    //common icalendar options
    icalendar_options = {sites: ['icalendar'],
                  compact: true,
                  icons: 'http://thoughtress.com/jquery/icalendar.png',
                  copyFlash: 'http://thoughtress.com/jquery/clipboard.swf',
                  iconSize: 10,
                  echoField: '#ical_echo',
                  };
    //event-specific options
    $.extend(icalendar_options, {
                  start: event.start, 
                  end: event.end,
                  recurrence: {times: event.active_dates} ,
                  title: event.module + " " + event.module_name,
                  summary: event.module + " " + event.module_name, 
                  //description: 'A lecture', 
                  location: event.room,
    });
    //create icalendar button placeholder
    var ical_spot = $("<div></div>");
    ical_spot.css("float", "right");
    $("span", listing).before(ical_spot);
    
    ical_spot.icalendar(icalendar_options);
  }
  
  $('#timetabletable table tbody tr').each(function() {
    row_index = $(this).index();
    //ignore header/footer rows
    if (row_index < 2 || row_index > 12){
      return true;
    }
    hour_slot = $("td", this).first().html();
    var cols = $('td', this);
    cols.each(function() {
      col_index = $(this).index();
      var cell = $(this)
      if (col_index != 0){
        $("div", this).each(function() {
          var listing = $(this);
          var details = $("span a", listing);
          if (details.length == 0){
            return true;
          };
          title = details.first().attr("title");
          //extract module name from title if present
          var name_regex = /<h3>([^>]*)<\/h3>/;
          name_regex.compile(name_regex);
          module_name = "";
          if (name_regex.test(title)){
            module_name = title.match(/<h3>([^>]*)<\/h3>/)[1];
          };
          event = {
            module: details.first().html(),
            room: details.last().html(),
            module_name: module_name,
            hour: parseInt(hour_slot.split(":")[0], 10),
          };
          //seperate and clean active dates
          title = title.replace(/.*<\/b><br \/>/g,""); //remove preceding markup
          title = title.replace(/<br \/>/g, "|");//seperate active dates with |
          title = title.replace(/(\d{1,2})(st|th|rd|nd)/g,"$1");//normalise date numbers
          title_dates = title.split("|");
          //parse date strings to Dates
          date_fmt = "DD d MM yy";
          event.active_dates = [];
          for (dt in title_dates){
            event.active_dates.push($.datepicker.parseDate(date_fmt, title_dates[dt]));
            event.active_dates[dt].setHours(event.hour);
          }
          make_icalendar(listing, event);
        });
      }
    });
  });
});