$(document).on("pagebeforecreate", function() {


    window.opts = {
        lng: 'fr',
        getAsync: true,
        // fallbackLng: 'en',
        ns: {
            namespaces: ['ns.controls'],
            defaultNs: 'ns.controls'
        },
        useLocalStorage: false,
        debug: true
    };
});

$(document).ready(function() {

    ////////////////////////////////////////////     global variables start             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\    
    window.FilterEmail;
    window.networkState;
    window.pageSize = 10;
    window.mailPageSize = 10;
    window.pageOffSet = 0;
    window.searchPageSize = 10;
    window.message_type = "";
    window.message_key = "";
});
////////////////////////////////////////////     Ger unread messages start             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
window.FailStatus = function(data, status) {
    try {
        var sPath = window.location.pathname;
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        console.log('FailStatus=' + data.status);

        switch (parseInt(data.status)) {
            case 0:
                msgAlert("Please relogin. Session timeout or server did not returned anything", "Session timeout");
                window.location.href = "index.html";
                console.log('Please relogin. Server did not returned anything:' + data.status);
                break;
            case 201:
                console.log('success status 201');
                break;
            case 400:
                if (sPage == "index.html") {
                    msgAlert("Bad request.", data.statusText);
                }
                console.log('Bad request:' + data.status);
                break;
            case 401:
                if (sPage == "index.html") {
                    msgAlert("Invalid username or password.", data.statusText);
                }
                console.log('Invalid username or password:' + data.status);
                break;
            case 402:
                msgAlert('Payment Required. Please upgrade your account');
                window.history.back();
                console.log('Payment Required. Please upgrade your account:' + data.status);
                break;
            case 403:
                msgAlert('Please relogin. Session timeout or access denied.');
                window.location.href = "index.html";
                console.log('Please relogin. Session timeout or access denied.' + data.status);
                break;
            case 404:
                msgAlert('Invalid argument', "Data not found");
                console.log('Invalid argument Data not found:' + data.status);
                break;
            case 415:
                msgAlert('parsing error of JSON data');
                console.log('parsing error of JSON data:' + data.status);
                break;
            default:
                console.log("Status out of bound=" + data.status);
        }
    } catch (e) {
        alert(e);
    }

}
window.getunreadmessage = function() {

    try {
        //var cookies='SUID=' +  sessionStorage.getItem("X_CSRFToken");
        console.log('get unread messages');

        if (parseInt(sessionStorage.length) <= 1) {
            msgAlert('Please relogin. Session timeout or access denied.');
            window.location.href = "index.html";
            return;
        }
        var message_count = 0;
        var list = "";
        var request_url = window.sessionStorage.getItem('mail_link')
        //console.log('cookies=' + cookies);
        console.log('request_url=' + request_url);
        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));
                console.log('mail success=');
            }
        })
            .done(function(data, status) {
                if (status == 'success') {
                    console.log('request was successfull');
                    try {
                        console.log('unread message data=' + JSON.stringify(data));
                        message_count = data.inbox.total_unread_messages_count;

                        if (message_count == 'undefined' || message_count == '' || message_count == 'null') {
                            message_count = 0;
                        }
                        console.log('unread count=' + message_count);

                        list += '<li data-theme="a" data-icon="liarrow" > <a href="javascript:void(0);" id="liInbox" onclick="SetParamEmail(0)"> ' + $.t('mailbox.Inbox');
                        list += '<span class="ui-li-count"  style="color: #FFFFFF; background: #fa0808;">' + message_count + '</span>  </a> </li>';
                        list += '<li data-theme="a" data-icon="liarrow" >  <a  href="javascript:void(0);"  id="liSent" onclick="SetParamEmail(1)"> ' + $.t('mailbox.Sent') + '</a>  </li>';
                        list += ' <li data-theme="a" data-icon="liarrow" >  <a   href="javascript:void(0);"  id="liArchive" onclick="SetParamEmail(2)"> ' + $.t('mailbox.Archive') + '   </a>  </li>';
                        console.log("list mailbox=" + list);
                        $('[data-role="listview"]').html(list);
                        $('[data-role="listview"]').listview('refresh');
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    FailStatus(data, status);
                }
            })
            .fail(function(data, status) {
                FailStatus(data, status);
            })
            .always(function() {
                console.log("first always: finished");
                HideLoader();
            });

    } catch (e) {
        msgError(e);
    }
}

window.FailCB = function(jqxhr, textStatus, err) {
    console.log('fail callback function');
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

    if (parseInt(jqxhr.status) == 401 || jqxhr.status == "401") {
        if (sPage == "index.html") {
            msgAlert("Invalid username or password.", jqxhr.statusText);
        } else if (parseInt(jqxhr.status) == 403 || jqxhr.status == "403") {
            msgAlert("Please relogin.", "Session timeout");
            GotoLink("index.html");
        } else if (parseInt(jqxhr.status) == 0 || jqxhr.status == "0") {
            msgAlert("Please relogin.", "Session timeout");
            GotoLink("index.html");
        }

    } else if (parseInt(jqxhr.status) == 403) {
        msgAlert("Please become a VIP or Gold member to view this page.", "Access denied");
        window.sessionStorage.setItem('searched_mail_link', '');
        window.history.back();
    }
    console.log("Fail: Our server returned an error\n" + err +
        "\n" + textStatus + "\n" +
        "Please try again later." + "\n jqxhr:" + JSON.stringify(jqxhr));
}

////////////////////////////////////////////         Ger unread messages  end             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////   email message list   start             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

window.loadMailbox = function(Type, filter, orderby) {
    try {

        var cookies = 'SUID=' + sessionStorage.getItem("X_CSRFToken");
        console.log("loadmailbox function");
        // alert("loadmailbox function");
        FilterEmail = filter;
        //mailPageSize;
        console.log('Type=' + Type + '\n filter=' + FilterEmail + '\n mailPageSize' + mailPageSize + '\n orderby' + orderby);
        var MailLink = "";
        MailLink = window.sessionStorage.getItem('searched_mail_link');

        if (Type == 0) {
            message_key = "inbox";
        } else if (Type == 1) {
            message_key = "sent";
        } else {
            message_key = "archive";
        }
        console.log('message_key=' + message_key);
        //var request_url="https://jalf.com/ws/messages/inbox?uname=123&pwd=123&orderby=date&order=desc&limit="1,10";
        //var request_url=   window.sessionStorage.getItem('mail_link') + "/" + message_key + "?orderby=" + filter + "&order=desc&limit=" + mailPageSize + ",10";
        var request_url;
        console.log('MailLink=' + MailLink);
        if (MailLink == '' || MailLink == 'undefined' || MailLink == 'null' || MailLink == null) {
            request_url = window.sessionStorage.getItem('mail_link') + "/" + message_key + "?order_by=" + filter + "&order=" + orderby + "&offset=" + parseInt(pageOffSet) + "&count=" + mailPageSize;
            console.log('In my email link');
        } else {
            request_url = MailLink + "/" + message_key + "?order_by=" + filter + "&order=" + orderby + "&offset=" + parseInt(pageOffSet) + "&count=" + mailPageSize;
            console.log('In search user email link');
        }
        console.log('request_url mailbox is=' + request_url);
        sessionStorage.setItem('modifier_link', request_url);
        ///////////
        console.log('pageOffSet==' + pageOffSet);
        console.log('mailPageSize==' + mailPageSize);


        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));

                console.log('mail success=');
            }
        })
            .done(function(data, status) {
                var itemsCount = 0;
                var list = "";
                var messages_arr = [];
                if (status === 'success') {
                    try {
                        console.log('mail data=' + JSON.stringify(data));
                        console.log('pageOffSet==' + pageOffSet);
                        $('#dvCount').html(data.total_items_count)
                        itemsCount = parseInt(data.items.length);

                        console.log('RowCount=' + itemsCount);
                        console.log('item count=' + data.total_items_count);
                        console.log('message_key=' + message_key);


                        messages_arr = data.items;

                        if ((parseInt(itemsCount) <= 0 || itemsCount == 'null' || itemsCount == '' || itemsCount == 'undefined' || itemsCount == 'null' || itemsCount == null) && (parseInt(pageOffSet) <= 0)) {
                            $('#mtMessage').html('NO RESULTS FOUND');
                            $('#tblMail tr').remove();

                            console.log('NO RESULTS FOUND');
                            console.log('mtMessage=' + $('#mtMessage').html());

                            return;
                        } else if (parseInt(pageOffSet) >= parseInt(data.total_items_count)) {
                            $('.mtMessage').html('NO FURTHER RESULTS FOUND');
                            console.log('NO FURTHER RESULTS FOUND');

                        } else {
                            $('.mtMessage').html('');
                            // pageOffSet= parseInt(pageOffSet) + parseInt(mailPageSize);
                        }
                        $.each(messages_arr, function(i, messages_arr) {
                            var link = "&#39;" + messages_arr.mail_message_link + "&#39;";
                            GetMail(messages_arr.mail_message_link, message_key);

                        });
                    } catch (e) {
                        msgError(e);
                    }
                } else {
                    FailStatus(data, status);
                }
            })
            .fail(function(data, status) {
                FailStatus(data, status);
            })
            .always(function() {
                console.log("first always: finished");
                window.sessionStorage.setItem('searched_mail_link', '');
                HideLoader();
            });

    } catch (e) {
        alert(e);
    }

}

/////////////////////////////////////end ////////////////////////////////

function GetMail(request_url, key) {
    var ToUser = "";
    var list = "";
    console.log('GetMail link==' + request_url);
    // var cookies='SUID=' +  sessionStorage.getItem("X_CSRFToken");

    try {

        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));
                console.log('getmail success=');
            }
        })
            .done(function(data, status) {
                var dt = data.datetime_sent;
                var sub = data.subject;

                if (key == 'inbox') {
                    ToUser = data.from_username;
                } else if (key == 'sent') {

                    ToUser = data.to_username;
                } else if (key == 'archive') {

                    ToUser = data.from_username;

                }
                list += '<tr style="cursor: pointer;" >';
                if (data.is_read == 1) {
                    list += '  <td><img class="imgEnvelope" id="envelope1" src="img/mailstatus_2.png"/> </td>';
                } else {
                    list += '  <td><img class="imgEnvelope"  id="envelope1" src="img/mailstatus_1.png"/> </td>';
                }

                list += '<td><a rel="external" onclick="viewMessage(&#39;' + request_url + '&#39;,&#39;' + key.toLowerCase() + '&#39; );"><div class=" ">de:</div><div class=" ">suject:</div><div class=" ">date:</div></a></td>';
                list += '<td><a rel="external" onclick="viewMessage(&#39;' + request_url + '&#39;,&#39;' + key.toLowerCase() + '&#39; );"><span class="larrow">';
                list += '<img class="imgArrow"  src="img/arrow_list_go.png"/> ';
                list += ' </span><span><div class=" ">' + ToUser + ' </div><div class=" ">' + sub + '</div><div class="coldate">' + dt + '</div></span></a></td> ';
                list += ' </tr> ';
                $('#tblMail > tbody').append(list);
                console.log('list tr=' + list);

            })
            .fail(function(data, status) {
                FailStatus(data, status);
            })
            .always(function() {
                console.log("first always: finished");
            });
    } catch (e) {
        alert(e);
    }

}
////////////////////// mailboxmod///////////////////////////
window.loadMailboxMod = function() {
    try {

        var cookies = 'SUID=' + sessionStorage.getItem("X_CSRFToken");
        console.log("loadmailboxMod function");
        var request_url = sessionStorage.getItem('modifier_link');
        console.log('request_url mailbox is=' + request_url);
        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));

                console.log('mail success=');
            }
        })
            .done(function(data, status) {

                var list = "";
                var messages_arr = [];
                if (status === 'success') {
                    try {
                        console.log('mail data=' + JSON.stringify(data));
                        console.log('item count=' + data.total_items_count);
                        messages_arr = data.items;
                        $.each(messages_arr, function(i, messages_arr) {
                            var link = "&#39;" + messages_arr.mail_message_link + "&#39;";
                            GetMailMod(messages_arr.mail_message_link);

                        });
                    } catch (e) {
                        msgError(e);
                    }
                } else {
                    FailStatus(data, status);
                }
            })
            .fail(function(data, status) {
                FailStatus(data, status);
            })
            .always(function() {
                console.log("first always: finished");
                HideLoader();
            });

    } catch (e) {
        alert(e);
    }

}
/////////////////////////////////////////////////////////GetMailMod////////////////////////////

function GetMailMod(request_url) {
    var list = "";
    console.log('GetMail link==' + request_url);
    try {
        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));
                console.log('getmail success=');
            }
        })
            .done(function(data, status) {
                var dt = data.datetime_sent;
                var sub = data.subject;
                var ToUser = data.from_username;
                list += ' <tr>';
                list += ' <td> <span class="clsLink">' + request_url + '</span> <div class="dvOk"></div> </td>';
                list += ' <td> <a>';
                list += ' <div class=" ">de:</div><div class="">suject:</div><div  >date:</div></a>';
                list += ' </td>';
                list += ' <td> <a><span class="larrow">';
                list += ' <img class="imgArrow" src="img/arrow_list_go.png"/>  </span>';
                list += ' <span>';
                list += ' <div class="user">' + ToUser + ' </div>';
                list += ' <div class="sub"> ' + sub + '</div>';
                list += ' <div class="coldate">' + dt + '</div>';
                list += ' </span>';
                list += ' </a>';
                list += ' </td>';
                list += ' </tr>';
                $('#tblMailMod > tbody').append(list);
                console.log('list tr=' + list);
            })
            .fail(function(data, status) {
                FailStatus(data, status);
            })
            .always(function() {
                console.log("first always: finished");
            });
    } catch (e) {
        alert(e);
    }

}


////////////////////////////////////////////      email message list      end   


/////////////////////////////////////////////////////////////////////////////////

function isAtBottom() {
    try {
        var totalHeight, currentScroll, visibleHeight;

        if (document.documentElement.scrollTop) {
            currentScroll = document.documentElement.scrollTop;
        } else {
            currentScroll = document.body.scrollTop;
        }

        totalHeight = document.body.offsetHeight;
        visibleHeight = document.documentElement.clientHeight;
        var IsBottom = (totalHeight <= currentScroll + visibleHeight);
        console.log(
            'total height: ' + totalHeight + ' ' +
            'visibleHeight : ' + visibleHeight + ' ' +
            'isAtBottom : ' + IsBottom + ' ' +
            'currentScroll:' + currentScroll);
        console.log('IsBottom' + IsBottom);
    } catch (e) {
        alert(e);
    }
    return (totalHeight <= currentScroll + visibleHeight) && (currentScroll > 0);
}

//////////////////////////////////////////////////////////////////////////////////////

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


window.getLang = function() {
    var lingua;
    navigator.globalization.getPreferredLanguage(
        function(language) {
            try {
                var language_complete = language.value.split("-");
                lingua = language_complete[0];
            } catch (e) {
                alert(e);
            }
        },
        function() {
            alert('Error getting language\n');
            lingua = 'en';
        }
    );
    return lingua;
}
///////////////////////////////////

function msgError(msg, title) {
    try {
        alert(msg);
        //        navigator.notification.alert(
        //            msg,  // message
        //            null,         // callback
        //            title,            // title
        //            'Okay'                  // buttonName
        //        );
    } catch (e) {
        alert(e);
    }
}

function msgError(msg) {
    try {
        alert(msg);
        //        navigator.notification.alert(
        //            msg,  // message
        //            null,         // callback
        //            'Warning',            // title
        //            'Okay'                  // buttonName
        //        );
    } catch (e) {
        alert(e);
    }
}

function msgAlert(msg) {
    try {
        alert(msg);
        //        navigator.notification.alert(
        //            msg,  // message
        //            null,         // callback
        //            'Infromation',            // title
        //            'Continue'                  // buttonName
        //        );
    } catch (e) {
        alert(e);
    }
}

function msgAlert(msg, title) {
    try {
        alert(msg);
        //        navigator.notification.alert(
        //            msg,  // message
        //            null,         // callback
        //            title,            // title
        //            'Continue'                  // buttonName
        //        ); 
    } catch (e) {
        alert(e);
    }
}

function msgAlert(msg, title, buttonText) {
    try {
        alert(msg);
    } catch (e) {
        alert(e);
    }
}

function checkConnection() {
    try {
        networkState = navigator.network.connection.type
        if (networkState == Connection.NONE) {
            alert(networkState, 'networkState');
        } else {
            alert(navigator.network.connection.type, 'networkState');
        }
    } catch (e) {
        alert(e);
    }
}
window.ShowLoader = function() {
    $.mobile.loading('show', {
        theme: "a",
        text: "Loading...",
        textVisible: true
    });
}

window.ShowLoader = function(_visisble) {
    if (_visisble) {
        $.mobile.loading('show', {
            theme: "a",
            text: "Loading...",
            textonly: true,
            textVisible: true
        });
    } else {
        HideLoader();
    }
}
window.ShowLoader = function(msg) {
    //    $.mobile.showPageLoadingMsg( "a", msg, true );
    $.mobile.loading('show', {
        theme: "a",
        text: msg,
        textonly: true,
        textVisible: true
    });
}

window.ShowLoader = function(theme, msg) {
    //$.mobile.showPageLoadingMsg( theme, msg, hideloader );
    $.mobile.loading('show', {
        theme: theme,
        text: msg,
        textonly: false,
        textVisible: true
    });
}
window.HideLoader = function() {
    //    $.mobile.hidePageLoadingMsg();  
    $.mobile.loading('hide');

}

window.getUtcLocalDateString = function(utc) {
    var milli = new Date(utc * 1000);
    return milli.toLocaleDateString();
}


function GotoLink(link) {
    try {
        console.log('GotoLink(link)=' + link);
        // $.mobile.loadpage( link );
        // window.location.href=link;

        $.mobile.changePage(link, {showLoadMsg: true });
    } catch (e) {
        alert(e);
    }
}
// function GotoLink(link,Isreverse){
//     try{
//         console.log('GotoLink(link,Isreverse)');
//         // $.mobile.changePage(link,{transition:"slide", showLoadMsg: true,reverse: Isreverse, changeHash: false});
//          // window.location.href=link;  
//          $.mobile.changePage(link,{transition:"slide", showLoadMsg: true});  
//     }
//     catch(e)
//     {
//         alert(e);
//     } 
// }

// function GotoLink(link,Isreverse,IsreloadPage){
//     try{
//         console.log('GotoLink(link,Isreverse,IsreloadPage)');
//         // $.mobile.changePage(link,{transition:"slide",dataUrl:link, showLoadMsg: true,reverse: Isreverse, changeHash: false,reloadPage:IsreloadPage}); 
//          // window.location.href=link; 
//          $.mobile.changePage(link,{transition:"slide", showLoadMsg: true});  
//     }
//     catch(e)
//     {
//         alert(e);
//     } 
// } 

function ExtractQueryString() {
    var oResult = {};
    try {
        var aQueryString = (window.location.search.substr(1)).split("&");

        for (var i = 0; i < parseInt(aQueryString.length); i++) {
            var aTemp = aQueryString[i].split("=");
            if (parseInt(aTemp[1].length) > 0) {
                oResult[aTemp[0]] = unescape(aTemp[1]);
            }
        }
    } catch (e) {
        alert(e);
    }
    return oResult;
}

function refreshPage(page) {
    page.trigger('pagecreate');
}
