$(document).ready(function() {
    console.log('compose message document ready');
    domain = sessionStorage.getItem("domain");

    // $('#chkCopytoSent').slider();
    // $('#chkCanReply').slider(); 

    $('#aSend').click(function() {
        try {

            console.log('btnsend click');

            var reply_link = sessionStorage.getItem('msgUrl');
            var txtTo = $('#txtTo');
            var txtsubject = $('#txtsubject');
            var txtBody = $('#txtComposeBody');
            var X_CSRFToken = sessionStorage.getItem("X_CSRFToken");
            var IsSaveCopy = 1;
            var canReply = 1;
            var request_url = domain + "mail";

            if (txtTo.val() == '') {
                msgAlert('Please fill TO: field');
                return;
            }
            if (txtsubject.val() == '') {
                msgAlert('Please fill Subject: field');
                return;
            }
            if (txtBody.val() == '') {
                msgAlert('Please fill Body: field');
                return;
            }

            //            IsSaveCopy=parseInt($('#chkCopytoSent').val());
            //            canReply=parseInt($('#chkCanReply').val()) ; 
            console.log('request_url=' + request_url);

            console.log("to=" + txtTo.val());
            console.log("subject=" + txtsubject.val());
            console.log("body=" + txtBody.val());
            console.log("keep_copy_sent=" + IsSaveCopy);
            console.log("can_reply=" + canReply);
            
            var jsonObj = new Object();
            jsonObj.to = txtTo.val();
            jsonObj.subject = txtsubject.val();
            jsonObj.body = txtBody.val();
            if (reply_link) {
                jsonObj.reply_message_link = reply_link;
            }
            jsonObj.keep_copy_sent = IsSaveCopy;            
            jsonObj.can_reply = canReply;
            console.log('jsonObj==' + JSON.stringify(jsonObj).replace(':', ': '));

            $.ajax({
                beforeSend: function() {
                    ShowLoader();
                },
                type: 'POST',
                url: request_url,
                dataType: "json",
                contentType: "application/vnd.jalf.mail.newmessage+json",
                headers: {
                    'X-CSRFToken': X_CSRFToken
                },
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(jsonObj).replace(':', ': '),
                success: function(response, status) {
                    alert("Message has been sent successfully");
                    console.log( "Success in sending message ");

                }
            })
                .done(function(data, status) {
                    try {
                        console.log('function archive success');
                        console.log('status=' + status);
                        console.log('data=' + JSON.stringify(data));

                        if (status === 'success') {
                            txtTo.val('');
                            txtsubject.val('');
                            txtBody.val('');

                            $('#chkCopytoSent').val('0');
                            $('#chkCanReply').val('0');

                            FailStatus(data, status);
                            if (data.status == 201 || data.status == "201") {
                                console.log("error request=" + JSON.stringify(data));
                                console.log("Message has been sent successfully");
                                GotoLink("mailbox.html");
                                sessionStorage.removeItem('from_username');
                                sessionStorage.removeItem('msgUrl');
                            }  
                            HideLoader();
                        } else {
                            FailStatus(data, status);
                        }
                    } catch (e) {
                        msgAlert(e);
                    }
                })
                .fail(function(data, status) {
                    FailStatus(data, status);
                    if (data.status == 201 || data.status == "201") {
                        console.log("error request=" + JSON.stringify(data));
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
    });

});
