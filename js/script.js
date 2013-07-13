
$('#page-home').live("pageinit", function() {

    var datetime = $('#mydate2');
    var title = $('#title');
    var desc = $('#desc');
      
    var splitdatetime = null;
    var date = null;
    var time = null;
      
    var start_date='2013-01-01';
    var end_date='2013-12-30';
      
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
        }
        if(mm<10){
        mm='0'+mm
        }
        var today = yyyy+'-'+mm+'-'+dd;
    // alert(today);
      
      
    var db = window.openDatabase("reminder", "1.0", "reminder db", 1024*1024);
      
      
    db.transaction(function(tx) {
        tx.executeSql('create table if not exists events (date date, time text, title text, desc text)');
    }, errorCB, successCB);
       
    db.transaction(function(tx) {
        tx.executeSql('select * from events where date="'+today+'";', [], displayEvents);
    }, errorCB, successCB); 
       
    db.transaction(function(tx) {
        tx.executeSql('select * from events where date >= "'+start_date+'" and date <= "'+end_date+'" order by date;', [], otherEvents);
    }, errorCB, successCB); 
      
    $('#create_new_btn').click( function() { 
        $.mobile.changePage($('#page-new-event'), {
            transition:"slide"
        });
    });
    
    $('#aboutApp').click( function() { 
        $.mobile.changePage($('#about-app'), {
            transition:"slide"
        });
    });
    
    $('#aboutApp_new').click( function() { 
        $.mobile.changePage($('#about-app'), {
            transition:"slide"
        });
    });
    
    $('#aboutApp_other').click( function() { 
        $.mobile.changePage($('#about-app'), {
            transition:"slide"
        });
    });
    
    $('#back-to-home').click( function() { 
        $.mobile.changePage($('#page-home'), {
            transition:"slide"
        });
    });
    
    $('#save_btn').click( function() { 
      
        if (datetime.val()=="" || datetime.val()==null){
            alert("Please select a date and time!");
            return false;
        }
      	
        if (title.val()=="" || title.val()==null ){
            alert("Please enter a title!");
            return false;
        }
      
        splitdatetime = (datetime.val()).split("T");
        date = splitdatetime[0]; 
        time = splitdatetime[1]; 
		
        db.transaction(function(tx) {
            tx.executeSql('insert into events (date, time, title, desc) VALUES (?, ?, ?, ?)', [date, time, title.val(), desc.val()]);
        }, errorCB, successCB_event);
	
    });
      
      
    $(document).delegate('.event', 'click', function() {
        var event_title = this.id;
 			
        db.transaction(function(tx) {
            tx.executeSql("select * from events where title='"+event_title+"'", [], function (tx, results) {
                for(var i=0; i < results.rows.length; i++) {
                    msg = results.rows.item(i);		
                    $('<div>').simpledialog2({
                        mode: 'blank',
                        headerText: event_title,
                        headerClose: true,
                        blankContent : 
                        "<p> <span class='event_time'>"+msg['date']+'<br>'+msg['time']+"</span><br>"+msg['desc']+"</p>"+
                        "<a rel='close' data-role='button' href='#'>Close</a>"
                    })
                }
            },null);
        });
  
    })
		
		
    $('#other_events_btn').click( function() { 
        $.mobile.changePage($('#page-other'), {
            transition:"slide"
        });
    });
      
      
    $(document).delegate('.delete', 'click', function() {
        var event_title = this.id;
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: 'Delete Event',
            headerClose: true,
            buttonPrompt: 'Are you sure you want to delete?',
            buttons : {
                'Yes': {
                    click: function () { 
                        db.transaction(function(tx) {
                            tx.executeSql('delete from events where title="'+event_title+'";');
                        }); 
                    //alert (event_title);
                    }
                },
                'No': {
                    click: function () { 
                    },
                    icon: "delete",
                    theme: "c"
                }
            }
        })
    })
		
    
});


function errorCB(tx, err) {
    console.log("Error: "+err);
}


function successCB() {
    console.log("success!");
}

function successCB_event() {
    alert("Your Event has been saved!");
}


function displayEvents(tx, rs) {
    e = $('#eventList');
    if(rs.rows.length==0)
        e.append('<li>No events today!<li>');
    $('#eventList').listview('refresh');
    for(var i=0; i < rs.rows.length; i++) {
        r = rs.rows.item(i);
        e.append('<li data-icon="delete"><a class="event" id="'+r['title']+'" href="#"><h3>'+ r['title'] +'</h3><p>'+r['time']+'</p></a><a id="'+r['title']+'" class="delete" href="#"></a></li>'); 
        $('#eventList').listview('refresh');
    }
}



function otherEvents(tx, rse) {
    e = $('#otherEventList');
    for(var i=0; i < rse.rows.length; i++) {
        re = rse.rows.item(i);
        e.append('<li data-icon="delete"><a class="event" id="'+re['title']+'" href="#"><h3>'+ re['title'] +'</h3><p>'+re['date']+'<br>'+re['time']+'</p></a><a id="'+re['title']+'" class="delete" href="#"></a></li>'); 
    //$('#otherEventList').listview('refresh');
    }
}
