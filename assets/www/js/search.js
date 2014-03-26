$(document).keypress(function(e) {
    //console.log('keypress=' + e.which);
    if (e.which == 13) {
        SearchUser();
    }
});

window.SearchUser = function() {
    try {
        domain = sessionStorage.getItem("domain");
        var searchname = $("#txtsearch").val();

        var ItemsCount = 0;
        console.log('starting search function');


        console.log('getting domain');
        //var request_url= domain  + 'users?username=' +  $.trim(searchname) + "*&order_by=username&offset=" + offset + "&count=10";
        var request_url = domain + 'users?username=' + $.trim(searchname) + "*&order_by=username&offset=" + pageOffSet + "&count=" + searchPageSize;
        console.log('request_url=' + request_url);
        $.ajax({
            type: "Get",
            url: request_url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(data) {
                console.log('main: data=', JSON.stringify(data));
                ItemsCount = data.items.length;
                console.log('ItemsCount=' + ItemsCount);
                if ((parseInt(ItemsCount) <= 0 || parseInt(ItemsCount) == '' || parseInt(ItemsCount) == 'undefined' || parseInt(ItemsCount) == 'null' || parseInt(ItemsCount) == null) && (data.total_items_count == 0 || data.total_items_count == '')) {
                    $('#mtMessage').html('NO RESULTS FOUND');
                    
                    return;
                } else if (parseInt(pageOffSet) >= parseInt(data.total_items_count)) {
                    $('.mtMessage').html('NO FURTHER RESULTS FOUND');
                    console.log('NO FURTHER RESULTS FOUND');
                } else {
                    $('#mtMessage').html('');
                    pageOffSet = parseInt(pageOffSet) + parseInt(searchPageSize);
                }
                console.log('starting loop');
                $.each(data.items, function(index, item) {
                    // list += "<li id='li" + index + "' ><a  onclick='ViewSearchProfile(&#34;" + item.user_link + "&#34;)'  href='javascript:void(0);' ><h4>" + item.description +"</h4>";
                    // list += '</a></li>'; 

                    GetUserDetail(item.user_link);
                });

                // $('[data-role="listview"]').append( list );
                // $('[data-role="listview"]').listview('refresh'); 
            }
        })
            .done(function(data, status) {
                if (status === 'success') {
                    console.log('request was successfull');
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

window.GetUserDetail = function(request_url) {

    var list = "";

    $.ajax({
        type: "Get",
        url: request_url,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function() {
            ShowLoader();
        },
        success: function(data) {

        }
    })
        .done(function(data, status) {
            if (status === 'success') {
                var orient = data.sexual_orientation_link.slice(-1);

                console.log('request was successfull');
                list += "<tr   onclick='ViewSearchProfile(&#34;" + request_url + "&#34;)' >";
                list += ' <td> ';
                if (parseInt(orient) == 1) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Femme.png">  ';
                } else if (parseInt(orient) == 2) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Couples.png">  ';
                } else if (parseInt(orient) == 3) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Homme.png">  ';
                } else if (parseInt(orient) == 4) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Couple-Hommes.png">  ';
                } else if (parseInt(orient) == 5) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Couple-Femmes.png">  ';
                } else if (parseInt(orient) == 6) {
                    list += '<img id="imgGender" class="imgGender"  src="img/Travesti.png">  ';
                } else {

                    console.log('orient==' + orient);
                }
                list += '</td>  ';
                list += '<td> ';
                list += ' <span class="larrow"> ';
                list += ' <img class="imgArrow" src="img/arrow_list_go.png">  ';
                list += ' </span> ';
                list += ' <span> ';
                list += ' <div class="clsName">' + data.name + '</div> ';
                list += ' <div class="clsAge">' + data.age + ',' + data.sexual_orientation + '</div> ';
                list += ' </span> ';
                list += ' </td>   ';
                list += ' </tr>  ';
                $('#tblSearch > tbody').append(list);
                console.log('list tr=' + list);
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
}
//************************************* view profile function  ************************************
window.ViewSearchProfile = function(userLink) {
    try {

        console.log('User Profile function');
        console.log('userLink=' + userLink);
        var request_url = userLink;
        var list = "";

        $.ajax({
            type: "Get",
            url: request_url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                ShowLoader();
            },
            success: function(data) {
                console.log("ViewSearchProfile success=" + JSON.stringify(data)); //this line of code should work after login successfull

            }
        })
            .done(function(data, status) {
                try {
                    console.log('search profile: data=', JSON.stringify(data));
                    console.log('photo_link=======' + data.photo_link);
                    if (status === 'success') {
                        // window.location.href="profile.html?prev=search";
                        GotoLink("profile.html?prev=search");
                        GetPhoto(data.photo_link);
                        sessionStorage.setItem('json_profile', JSON.stringify(data));

                    } else {
                        FailStatus(data, status);
                    }
                } catch (e) {
                    alert(e);
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
        msgError('ViewSearchProfile =' + e);
    }
}

window.viewMyEmails = function(mailLink) {
    try {
        console.log('mailLink=' + mailLink);
        window.sessionStorage.setItem('searched_mail_link', mailLink);
        indexEmail = 0;
        GotoLink("mailboxList.html");
        //         loadMailbox('0','date','0','asc');
    } catch (e) {
        msgError(e);
    }
}
window.viewMyPhotos = function(photoLink) {
    try {
        console.log('photoLink=' + photoLink);
        msgAlert('View my photos under construction');
    } catch (e) {
        msgError(e);
    }
}
///////////**************************************************///////////////////

//////**************************************************///////////////////
$(document).on('pageinit', function(e) {
    $('#ulSearch').html('');
    $('#ulSearch').listview('refresh');
    $('#txtsearch').val('');
});
//******************************************end profile function  ************************************
$(document).ready(function() {
    ////////////////////////////////////////////    Search function start             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    
    ////////////////////////////////////////////    search       end             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

});



function GetPhoto(photolink) {
    try {
        if (photolink != "null" && photolink != null) {
            console.log('GetPhoto function');
            console.log('photolink=' + photolink);
            var request_url = "https://www.jalf.com" + photolink;
            console.log('request_url=====' + request_url);
            $.ajax({
                type: "Get",
                url: request_url,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function() {

                },
                success: function(data) {
                    console.log("GetPhoto success=" + JSON.stringify(data)); //this line of code should work after login successfull 
                }
            })
                .done(function(data, status) {
                    try {
                        if (status == 'success') {
                            console.log('data.thumbnail_link' + data.thumbnail_link);
                            console.log('data.image_link' + data.image_link);
                            sessionStorage.setItem('data_photo_link', data.image_link);
                        } else {
                            FailStatus(data, status);
                        }
                    } catch (e) {
                        alert(e);
                    }
                })
                .fail(function(data, status) {
                    FailStatus(data, status);
                })
                .always(function() {
                    console.log("first always: finished");

                });
        } else {
            sessionStorage.setItem('data_photo_link', 'http://placehold.it/350x150');
        }
    } catch (e) {
        alert(e);
    }

}
