 function loadFavorites() {
     try {
         window.fav_arr = [];
         var fav_link = sessionStorage.getItem('favorites_link');
         if (fav_link.trim() == "" || fav_link == "null" || fav_link == "undefined") {
             alert('Access denied.');
             GotoLink('mailbox.html');
             return true;
             // var request_url="http://jdev104.jalf.com" + sessionStorage.getItem('favorites_link');  
         } else {
             var request_url = "https://www.jalf.com" + fav_link;
             console.log("loadFavorites functions");
             console.log("request_url=" + request_url);
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
                     $('#mtMessage').html('');
                     console.log("success=" + JSON.stringify(result));
                     console.log('getmail success=');
                 }
             })
                 .done(function(data, status) {

                     if (status == 'success') {
                         console.log('request was successfull');
                         try {
                             var list = "";
                             //////////
                             console.log('loadFavorites data.total_items_count==' + data.total_items_count);
                             if (parseInt(data.total_items_count) > 0) {
                                 $.each(data.items, function(index, item) {
                                     //var orient=item.sexual_orientation_link.slice(-1);  
                                     GetUserGenderImage(item.user_link, item.description);
                                 });
                             } else
                                 $('#mtMessage').html('NO RESULTS FOUND');

                             //////// 
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
         }
     } catch (e) {
         alert(e);
     }
 }

 function GetUserGenderImage(userLink, description) {
     try {
         var request_url = "https://www.jalf.com" + userLink;
         console.log('GetUserGenderImage request_url=' + request_url);
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
                 console.log("data  GetUserGenderImage=" + JSON.stringify(data));
                 var orient = data.sexual_orientation_link.slice(-1);
                 console.log('orient==' + orient);

                 if (status === 'success') {

                     list += ' <tr onclick="ViewFavProfile(&quot;' + request_url + ' &quot;)"><td> ';

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
                     }

                     list += '</td> <td>  ';
                     list += '<span class="larrow">  <img class="imgArrow" src="img/arrow_list_go.png">   </span>  ';
                     list += '<span> ';
                     list += '<div class="clsName">' + description + '</div> ';
                     list += ' <div class="clsAge">' + data.age + ',' + data.sex + ' ' + data.sexual_orientation + '</div> ';
                     list += '</span>  ';
                     list += '</td> ';
                     list += '</tr>';
                     list += '<tr>';
                     list += '<td colspan="2" >';
                     list += ' <span class="clsbutton">';
                     list += '<a class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-up-a" data-theme="a" data-wrapperels="span" data-iconshadow="true" data-shadow="true" data-corners="true" data-role="button" style="font-size:8px;" href="#" data-inline="true"><span class="ui-btn-inner"><span class="ui-btn-text">envoyer un message</span></span></a>';
                     list += '</span>';
                     list += '</td> ';
                     list += '</tr>';
                     $('#tblFavorites > tbody').append(list);
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
     } catch (e) {
         alert(e);
     }

 }
 ////////////////////////////////////////////     GetUserGenderImage     end             \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



 function ViewFavProfile(userLink) {
     try {
         console.log('User Profile function');

         var request_Profile_url = userLink;
         console.log('request_Profile_url=' + request_Profile_url);
         var list = "";

         $.ajax({
             type: "Get",
             url: request_Profile_url,
             dataType: "json",
             xhrFields: {
                 withCredentials: true
             },
             beforeSend: function() {
                 ShowLoader();
             },
             success: function(data) {


                 console.log("success=" + JSON.stringify(data)); //this line of code should work after login successfull 
             },
             error: function(xhr, status, error) {
                 alert("error=" + JSON.stringify(xhr));
             }
         })
             .done(function(data, status) {
                 try {
                     console.log('profile success: data=', JSON.stringify(data));
                     console.log('photo_link=======' + data.photo_link);
                     if (status == 'success') {
                         // window.location.href="profile.html?prev=fav";
                         GotoLink("profile.html?prev=fav");
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
         msgError(e);
     }
 }

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
