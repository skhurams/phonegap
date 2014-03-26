

////////////////////////////  photo save functionlity start \\\\\\\\\\\\\\\\\\\ 



//window.SavePhoto= function() { 
//    try{ 
//        var txtComment = $('#txtComment').val();
//        var cameraImage = $('#cameraImage').attr('src');  
//        var request_url = sessionStorage.getItem('CategoryLink');
//        var X_CSRFToken=sessionStorage.getItem("X_CSRFToken");
//        
//        console.log('Suid token=' + X_CSRFToken);
//        console.log('cameraImage==' + cameraImage);        
//        console.log("request_url==" + request_url);  
//        console.log('txtComment==' + txtComment);
//        
//        if(!cameraImage){
//            msgAlert('Cannot save without select imag','Image Required', 'Ok');            
//            return;
//        }
//        $.ajax({
//            
//            url: request_url ,
//            type: 'POST',
//            contentType: 'multipart/form-data', 
//            //modified data proprty
//            //data:{"show_public_album":1,"comment":txtComment,"photo_file":cameraImage},
//            data:{"photo_file": cameraImage,"comment": txtComment},
//            headers: {Cookie:cookie_saved},
//            X-CSRFToken: X_CSRFToken;
//            
//            success: function (data,status) {
//            if (status.success == false) { 
//            
//        }
//               else { 
//               
//               }
//               alert ('message=' + JSON.stringify(data));
//    },
//        error: function (data, textStatus, jqXHR)
//    {
//        // msgAlert(JSON.stringify(textStatus));
//    }
//});
//
//}
//
//catch(e)
//{
//    msgAlert(e);
//}
//}



////////////////////////////  photo save functionlity  end\\\\\\\\\\\\\\\\\\\