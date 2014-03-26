//window.strDate;
//window.strFrom;
//window.strBody;
//window.strSubject;
window.pNo;

function Reply() {
    try {
        console.log('reply');
        GotoLink("ComposeMessage.html?reply=true");
    } catch (e) {
        msgError(e);
    }
}

function viewMessage(msgUrl, messageType) {

      GotoLink("messagebox.html"); 
    // $.mobile.changePage("messagebox.html");
    // $.mobile.changePage("messagebox.html",{transition:"slide", showLoadMsg: true});  
    var list = "";
    console.log('viewmessage function=' + msgUrl);
    var request_url = msgUrl;
    $.ajax({
        beforeSend: function() {
            ShowLoader();
        },
        xhrFields: {
            withCredentials: true
        },
        url: request_url,
        success: function(result) {
            console.log("success result=" + JSON.stringify(result));

            try {
                console.log('function success');
                console.log('page redirect');
                if (messageType == 'inbox') {
                    $('#btnReply').show();
                } else if (messageType == 'sent') {
                    $('#btnReply').hide();
                } else {
                    $('#btnReply').show();
                }
            } catch (e) {
                msgError(e);
            }

        }
    })
        .done(function(data, status) {
            try {

                if (status === 'success') {
                    console.log('request was ' + status);
                    console.log('done function data===' + JSON.stringify(data));
                    console.log('messageType==' + messageType);

                    sessionStorage.setItem('msgUrl', msgUrl);
                    sessionStorage.setItem('json_Messagebox', JSON.stringify(data));
                    sessionStorage.setItem('msg_link', msgUrl);
                    $.parseHTML(data.body);
                    if (messageType == 'inbox') {
                        console.log('message type is inbox');
                        UPdateMessageReadStatus(msgUrl);
                    }

                } else {
                    FailStatus(data, status);
                }
            } catch (e) {
                console.log('try catch error=' + e);
            }
        })
        .fail(function(data, status) {
            FailStatus(data, status);
        })
        .always(function() {
            console.log("first always: finished");
            HideLoader();
        });

}

function ShowConfirmModDelete(lnkArray, indx) {
    try {
        console.log('lnkArray=' + lnkArray);
        console.log('indx=' + indx);
        var buttonIndex = confirm("Are you sure you want to delete message?");
        if (buttonIndex == true) {
            for (var prop in lnkArray) {
                console.log('lnkArray:  ' + lnkArray[prop]);
                deleteMessage(lnkArray[prop], indx);
                RemoveSelectedRows();
            }
        }
    } catch (e) {
        alert(e);
    }

}

function showConfirmDelete(msgUrl, indx) {

    try {
        console.log('msgUrl=' + msgUrl);
        console.log('indx=' + indx);

        var buttonIndex = confirm("Are you sure you want to delete message?");
        if (buttonIndex == true) {
            deleteMessage(msgUrl, indx);
        }
    } catch (e) {
        alert(e);
    }
}
////////////////////////////////////////////      email message delete      start             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

window.deleteMessage = function(msgUrl, indx) {
    try {

        console.log('delete message function=li' + indx);
        var request_url = msgUrl;
        var message_key = "";
        var list;
        var X_CSRFToken = sessionStorage.getItem("X_CSRFToken");
        console.log('X_CSRFToken###' + X_CSRFToken);
        console.log('request_url###' + request_url);

        $.ajax({
            type: 'Delete',
            url: request_url,
            dataType: "json",
            contentType: "application/vnd.jalf.mail.message+json",
            headers: {
                'X-CSRFToken': X_CSRFToken
            },
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(data) {
                if (status === 'success') {
                    console.log('function delete success');
                } else {
                    console.log('function delete fail');

                }
            },
            error: function(request, error) {
                console.log("error in viewing message..");
                alert('request##' + JSON.stringify(request));
            },

        })
            .done(function(data) {
                try {

                    // $("#li" + indx).hide();
                } catch (e) {
                    msgAlert(e);
                }
            })
            .fail(function(data, status) {
                FailStatus(data, status);
                if (data.status == 201 || data.status == "201") {
                    console.log("error request=" + JSON.stringify(xhr));
                    console.log("Message has been sent successfully");
                    GotoLink("mailbox.html");
                }
            })
            .always(function() {
                console.log("first always: finished");
                HideLoader();
            });

    } catch (e) {
        msgError(e);
    }
}

function ShowConfirmModArchive(lnkArray, indx) {
    try {
        var buttonIndex = confirm("Are you sure you want to archive message/s ?");
        if (buttonIndex == true) {
            for (var prop in lnkArray) {
                console.log(lnkArray[prop]);
                ArchiveMessage(lnkArray[prop], indx);
                RemoveSelectedRows();
            }
        }
    } catch (e) {
        alert(e);
    }
}

function ShowConfirmArchive(msgUrl, indx) {
    try {
        var buttonIndex = confirm("Are you sure you want to archive message?");
        if (buttonIndex == true) {
            ArchiveMessage(msgUrl, indx);
        }
    } catch (e) {
        alert(e);
    }

}

window.ArchiveMessage = function(msgUrl, indx) {
    try {
        //msgAlert('message archive function msgUrl=' + msgUrl + "Id=" + indx);
        console.log('Archive message function=li' + indx);
        var archive_link = window.sessionStorage.getItem('mail_link') + '/archive';
        var request_url = msgUrl;
        var message_key = "";
        var ajax_data = {};
        var strdata;
        var list;
        var X_CSRFToken = sessionStorage.getItem("X_CSRFToken");


        console.log('request_ur****' + request_url);
        console.log('archive_link****' + archive_link);
        ajax_data["mail_folder_link"] = archive_link;
        strdata = JSON.stringify(ajax_data);
        strdata = strdata.replace(':', ': ');
        strdata = strdata.replace('{"', '{ "');
        strdata = strdata.replace('"}', '" }');
        console.log('strdata=' + strdata);
        //        console.log(JSON.parse(strdata));
        //console.log('ajax_data=' + JSON.stringify(ajax_data.replace('":"','":  "')));
        $.ajax({
            type: 'Patch',
            url: request_url,
            dataType: "json",
            contentType: "application/vnd.jalf.mail.message+json",
            headers: {
                'X-CSRFToken': X_CSRFToken
            },
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            data: strdata,
            success: function(data, status) {
                console.log('function archive success');
            },
            error: function(request, error) {
                msgAlert('error in archiving message##' + JSON.stringify(request));
            }
        })
            .done(function(data, status) {
                try {
                    if (status === 'success') {
                        console.log('function archive success');
                        console.log('status=' + status);
                        console.log('data=' + JSON.stringify(data));
                    } else {
                        console.log('function archive fail');
                    }

                } catch (e) {
                    msgAlert(e);
                }
            })
            .fail(function(data, status) {
                FailStatus(data, status);
                if (data.status == 201 || data.status == "201") {
                    console.log("error request=" + JSON.stringify(xhr));
                    console.log("Message has been sent successfully");
                    GotoLink("mailbox.html");
                }
            })
            .always(function() {
                console.log("first always: finished");
                HideLoader();
            });
    } catch (e) {
        msgError(e);
    }

}
////////////////////////////////////////////      email message delete      end             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


window.UPdateMessageReadStatus = function(InboxUrl) {
    try {
        console.log('UPdateMessageReadStatus function');
        var X_CSRFToken = sessionStorage.getItem("X_CSRFToken");
        console.log('X_CSRFToken=' + X_CSRFToken);
        var request_url = InboxUrl;
        console.log('request_url=' + request_url);

        $.ajax({
            beforeSend: function() {
                ShowLoader();
            },
            type: 'PATCH',
            url: request_url,
            contentType: "application/vnd.jalf.mail.message+json",
            dataType: "json",
            processData: false,
            data: '{"is_read": true}',
            headers: {
                'X-CSRFToken': X_CSRFToken
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data, status) {


                console.log('function update message read status success');
                console.log('status=' + status);
                console.log('UPdateMessageReadStatus success data=' + JSON.stringify(data));
            }
        })
            .done(function(data, status) {
                try {

                    console.log('function update message');
                    console.log('status=' + status);
                    console.log('UPdateMessageReadStatus done data=' + JSON.stringify(data));

                } catch (e) {
                    msgAlert(e);
                }
            })
            .fail(function(data, status) {
                //            FailStatus(data, status);
                console.log("error request=" + JSON.stringify(data));
            })
            .always(function() {
                console.log("first always: finished");
                HideLoader();
            });
    } catch (e) {
        msgError(e);
    }
}

function PreviousPage() {
    try {
        ShowLoader();
        var message_key = sessionStorage.getItem('message_type');
        var pager = $('#aPager .ui-btn-text');
        pNo = parseInt(pager.text()) - 1;
        if (parseInt(pNo * 10) < 0) {
            pager.text(0);
            pNo = 0;
            console.log('pNo=' + pNo);
        } else {
            pager.text(pNo);
            pageOffSet = (parseInt(pNo) * 10);
            $('#tblMail tr').remove();
            loadMailbox(message_key, FilterEmail, 'desc');
        }
        // // $("#filterdate").data('icon', 'arrow-d'); 
        // // $("#filterdate .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u"); 
        // // $("#filtermember").data('icon', 'arrow-d'); 
        // // $("#filtermember .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u"); 
        // // $("#filtersubject").data('icon', 'arrow-d'); 
        // // $("#filtersubject .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u"); 
        HideLoader();
    } catch (e) {
        alert(e);
        HideLoader();
    }
}

function NextPage() {
    try {
        ShowLoader();
        var message_key = sessionStorage.getItem('message_type');
        var totalRows = parseInt($('#dvCount').html());
        console.log('totalRows=' + totalRows);
        var rowCount = parseInt($('#tblMail >tbody >tr').length);

        console.log('rowCount=' + rowCount);

        var pager = $('#aPager .ui-btn-text');
        pNo = parseInt(pager.text()) + 1;

        if (parseInt(rowCount) < 10) {
            pNo = pager.text();
            console.log('rowCount pNo=' + parseInt(pNo));
        } else {
            if (parseInt(pNo * 10) == parseInt(totalRows)) {
                pNo = pager.text();
                console.log('totalrows=pNo=' + parseInt(pNo));
            } else {
                pager.text(pNo);
                console.log('else pNo=' + parseInt(pNo));
                pageOffSet = (parseInt(pNo) * 10);
                $('#tblMail tr').remove();
                loadMailbox(message_key, FilterEmail, 'desc');
            }
        }

        // // $("#filterdate").data('icon', 'arrow-d'); 
        // // $("#filterdate .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u"); 
        // // $("#filtermember").data('icon', 'arrow-d'); 
        // // $("#filtermember .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u"); 
        // // $("#filtersubject").data('icon', 'arrow-d'); 
        // // $("#filtersubject .ui-icon").addClass("ui-icon-arrow-d").removeClass("ui-icon-arrow-u");

        HideLoader();
    } catch (e) {
        alert(e);
        HideLoader();
    }
}
