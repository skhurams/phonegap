$(document).ready(function() {
    window.loginid = "";
    window.pword = "";
    window.SUID;
    window.cookies;
    window.CSRFToken;
    sessionStorage.setItem("domain", "https://www.jalf.com/rest/");
    // sessionStorage.setItem("domain","http://jdev104p.jalf.com/rest/");
    window.domain;

    $("#btnlogin").bind('click', function() {
        try {
            console.log('login function');

            window.cookie_saved;
            domain = sessionStorage.getItem("domain");

            loginid = $("#txtid").val();
            pword = $("#txtpwd").val();
            window.sessionStorage.setItem('loginid', loginid);
            window.sessionStorage.setItem('password', pword);
            var request_url = domain + "login";
            console.log('request_url=' + request_url);
            if (!$.trim(loginid) || !$.trim(pword)) {
                alert("Please enter your login credentials");
                return;
            }
            $.ajax({
                type: "POST",
                url: request_url,
                dataType: "json",
                data: {
                    "user_name": loginid,
                    "password": pword
                },
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function() {
                    ShowLoader();
                },
                success: function(jqXHR) {
                    console.log("success=" + JSON.stringify(jqXHR)); //this line of code should work after login successfull
                },
                error: function(xhr, status, error) {

                }
            })
                .done(function(response, textStatus, jqXHR) {
                    var header = jqXHR.getResponseHeader("X-CSRFToken");
                    console.log('header=' + header);
                    console.log('jqXHR.status===' + jqXHR.status);
                    var token = header;
                    if (jqXHR.status == 200 || jqXHR.status == 0 || jqXHR.status == "200" || jqXHR.status == "0") {
                        alert(domain + " is not reachable. Please contact your administrator.");
                    } else if (jqXHR.status == 201 || jqXHR.status == "201") {
                        if (token) {
                            window.sessionStorage.setItem("X_CSRFToken", token);
                            AuthenticateUser();
                        } else {
                            alert('Status=' + jqXHR.status);
                        }
                    } else if (jqXHR.status == 401 || jqXHR.status == "401") {
                        alert('Invalid user name or password. Please try again.');
                    } else if (jqXHR.status == 404 || jqXHR.status == "404") {
                        alert('Invalid user name or password. Please try again.');
                    } else {
                        alert('Error unknown please contact your administrator.');
                        console.log("error=" + JSON.stringify(jqXHR));
                    }
                })
                .fail(function(jqXHR, textStatus, err) {
                    var header = jqXHR.getResponseHeader("X-CSRFToken");
                    console.log('header=' + header);
                    console.log('jqXHR.status===' + jqXHR.status);
                    var token = header;
                    if (jqXHR.status == 200 || jqXHR.status == 0 || jqXHR.status == "200" || jqXHR.status == "0") {
                        alert(domain + " is not reachable. Please contact your administrator.");
                    } else if (jqXHR.status == 201) {
                        if (token) {
                            window.sessionStorage.setItem("X_CSRFToken", token);
                            AuthenticateUser();
                        } else {
                            alert('token=' + token);
                        }
                    } else if (jqXHR.status == 401 || jqXHR.status == "401") {
                        alert('Invalid user name or password. Please try again.');
                    } else if (jqXHR.status == 404 || jqXHR.status == "404") {
                        alert('Invalid user name or password. Please try again.');
                    } else {
                        alert('Error unknown please contact your administrator.');
                        console.log("error=" + JSON.stringify(jqXHR));
                    }

                })
                .always(function() {
                    console.log("complete");
                    HideLoader();
                });
        } catch (e) {
            alert(e);
        }
    });
});




function GetAction(me) {
    try {
        me.action = domain + "login";
    } catch (e) {
        alert(e);
    }
}
window.AuthenticateUser = function() {
    try {
        console.log('user authenticated function');
        var request_url = domain + "authenticated-user";
        $.ajax({
            type: "GET",
            url: request_url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(data) {
                console.log("authenticate success=" + JSON.stringify(data));
                window.sessionStorage.setItem('mail_link', data.user_mail_link);
                window.sessionStorage.setItem('devices_link', data.user_mobile_devices_link);
                window.sessionStorage.setItem('albums_link', data.user_photos_albums_link);
                window.sessionStorage.setItem('UserId', data.id);
                window.sessionStorage.setItem('UserName', data.name);
                window.sessionStorage.setItem('favorites_link', data.user_favorites_link);
            },
            error: function(xhr, status, error) {


                alert("error=" + JSON.stringify(xhr));

            }
        })
            .done(function(data, status) {
                if (status === 'success') {
                    console.log('request was successfull');
                    $('#txtid').val('');
                    $('#txtpwd').val('');
                    window.location.href= "mailbox.html";
                } else {
                    alert("Our server returned an error\n" + data.error +
                        "\n" + data.status + "\n" +
                        "Please try again later.");
                }

            })
            .fail(function(xhr, status, error) {
                alert("Fail: Our server returned an error\n" + err +
                    "\n" + textStatus + "\n" +
                    "Please try again later." + "\n jqxhr:" + JSON.stringify(jqxhr));


            })
            .always(function(data) {
                console.log("first always: finished");
                HideLoader();
            });

    } catch (e) {
        alert(e);
    }
}
