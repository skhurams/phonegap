////////////////////////////  photo save functionlity  end\\\\\\\\\\\\\\\\\\\

$(document).ready(function() {
    window.CategoryLink;
    window.photoLink;
    window.photolink_arr = [];
    window.aGallery;
    window.bGallery;
    window.files;


});

//*********************************************************************************************************************************************************************
//window.prepareUpload=   function (event)
//{
//    files = event.target.files;
//    console.log('files=' + files);
//}

function loadAlbumsCategory() {
    try {
        console.log('loading funcÏion loadAlbumsCategory');

        var request_url = sessionStorage.getItem('albums_link');

        console.log('starting ajax');

        $.ajax({
            beforeSend: function() {
                ShowLoader();
            },
            type: 'Get',
            url: request_url,
            dataType: "json",
            contentType: "application/vnd.jalf.collection+json; charset=utf8",
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                console.log('success funcÏion loadAlbumsCategory');
            },
            error: function(jqxhr, textStatus, err) {
                console.log("Error data=" + JSON.stringify(err));

            }
        })
            .done(function(data, status) {
                var list = "";
                var ItemsCount = 0;
                ItemsCount = data.items.length;
                console.log("stringify==" + JSON.stringify(data));

                console.log('data.items.user_photos_album_link=' + data.items[0].user_photos_album_link);

                console.log('ItemsCount=' + ItemsCount);
                if (status == 'success') {

                    list = ' <li data-role="list-divider" role="heading">Album Categories</li>';
                    if (ItemsCount <= 0 || ItemsCount == '' || ItemsCount == 'undefined' || ItemsCount == 'null' || ItemsCount == null) {
                        $('#mtMessage').html('NO RESULTS FOUND');
                    } else {
                        $('#mtMessage').html('');
                    }
                    for (var i = 0; i < ItemsCount; i++) {
                        var link = "&#39;" + data.items[i].user_photos_album_link + "&#39;";
                        list += "  <li data-theme='a' class='liList'>  <a href='javascript:void(0);' id='btnOpenAlbu' onclick='OpenAlbums(" + link + ")' data-transition='slide'  class='aList'>" + data.items[i].description + "</a> </li>";
                    }
                    $('#ulCategory').html(list);
                    $('#ulCategory').listview('refresh');
                } else {
                    FailStatus(data, status);
                }
                console.log('div Category=' + $('#ulCategory').html());
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function OpenAlbums(lnk) {
    try {

        CategoryLink = lnk;
        sessionStorage.setItem("CategoryLink", lnk);
        console.log('CategoryLink=' + CategoryLink);
        GotoLink("photosView.html");
    } catch (e) {
        alert('openPhoto error=' + e);
    }
}
/////////////// 

function LoadphotosView() {
    try {

        //        var CSRFToken=sessionStorage.getItem("X_CSRFToken");
        var pageSize = 10;

        console.log('LoadphotosView function');
        console.log('Collection Data new function');
        ShowLoader();
        // var request_url = sessionStorage.getItem('CategoryLink') + '?offset=' + offset + '&count=' + pageSize;
        var request_url = sessionStorage.getItem('CategoryLink') + '?offset=' + pageOffSet + '&count=' + pageSize;
        console.log('request_url=' + request_url);
        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                console.log('main: success data=', JSON.stringify(data));
                var ItemsCount = data.items.length;
                console.log('ItemsCount==' + ItemsCount);
                console.log('Total ItemsCount==' + data.total_items_count);

                if ((parseInt(ItemsCount) <= 0 || ItemsCount == "0" || ItemsCount == 'null' || ItemsCount == '' || ItemsCount == 'undefined') && (parseInt(data.total_items_count) <= 0)) {
                    $('.mtMessage').html('NO RESULTS FOUND');
                    console.log('itemcount when 0');
                    return;
                } else if (parseInt(pageOffSet) >= parseInt(data.total_items_count)) {
                    $('.mtMessage').html('NO FURTHER RESULTS FOUND');
                    console.log('NO FURTHER RESULTS FOUND');
                } else {
                    $('.mtMessage').html('');
                    console.log('RESULTS FOUND');
                    pageOffSet = parseInt(pageOffSet) + parseInt(pageSize);
                }
                console.log('photoLink before loop=');
                for (var i = 0; i < ItemsCount; i++) {
                    photoLink = data.items[i].photo_link;
                    console.log('photoLink loop=' + photoLink);
                    LoadPhotoDetail(photoLink, data.items[i].rank);
                }
            }
        })
            .done(function(data, status) {
                if (status === 'success') {
                    console.log('request was successfull');
                    console.log('main: data=', JSON.stringify(data));
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



function LoadPhotoDetail(lnk, rank) {
    var aGallery = "";
    var bGallery = "";
    try {
        ShowLoader();
        var request_url = lnk;
        console.log('LoadPhotoDetail function');
        $.ajax({
            type: "GET",
            url: request_url,
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                console.log("success=" + JSON.stringify(result));
            },
            error: function(xhr, status, error) {
                alert("error=" + JSON.stringify(xhr));
            }
        })
            .done(function(data, status) {
                if (status === 'success') {
                    console.log('request was successfull');
                    // console.log('main: LoadPhotoDetail data=',JSON.stringify(data));
                    var photo = data.image_link;
                    var thumbphoto = data.thumbnail_link;
                    console.log('photo==' + photo);
                    console.log('thumbphoto==' + thumbphoto);

                    aGallery += ' <a href="#popupPhoto' + rank + '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + thumbphoto + '" alt="Thumb Photos" style="width:100px;height:100px;padding:5px;" /></a>';
                    bGallery += '<div data-role="popup" id="popupPhoto' + rank + '" data-overlay-theme="a" data-theme="a" data-position-to="window" data-corners="false"> <a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><img class="popphoto" src="' + photo + '" style="max-height:512px;" alt="Photos" /> </div>';
                    $('#Gallery').append(aGallery + bGallery).trigger('create');
                    $("#popupPhoto").popup();
                    //console.log('aGallery=' + aGallery + bGallery);  
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
        msgAlert(e);
    }
}
////////////////////////////  photo save functionlity start \\\\\\\\\\\\\\\\\\\  

function SavePhoto() {
    var txtComment = document.getElementById('txtComments');
    //var photo_file=$("#photo_file").val();
    var photo_file = $("#photo_file").get(0);
    var request_url = sessionStorage.getItem('CategoryLink');
    var IsPublic = $("#flip").val();
    var X_CSRFToken = sessionStorage.getItem("X_CSRFToken");
    try {
        ShowLoader();
        console.log('save photo request_url==' + request_url);
        console.log('txtComment==' + txtComment.value);
        console.log('save photo IsPublic=' + IsPublic);
        console.log('photo_file=' + photo_file.files[0]);
        var data = new FormData();
        data.append("photo_file", photo_file.files[0]);
        data.append("show_public_album", IsPublic);
        data.append("comment", txtComment.value);

        $.ajax({
            url: request_url,
            type: 'POST',
            data: data,
            contentType: 'multipart/form-data',
            cache: false,
            processData: false,
            headers: {
                'X-CSRFToken': X_CSRFToken
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data, textStatus, jqXHR) {
                alert(photo_file.files[0] + ' file uploaded successfully.');
                console.log('success data=' + JSON.stringify(data));

            } 
        })
            .done(function(data, status) {
                if (status === 'success') {} else {
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
