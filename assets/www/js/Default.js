$(document).ready(function(){
    
    
    console.log('default ready');
    //    msgAlert('default ready');
    
});


$(".btnlogout").click(function (){
    showConfirm(); 
    
    
});
 
function showConfirm() {
    
    var buttonIndex=confirm("Do you want to disconnect?");
    if (buttonIndex==true)
    {
        GotoLink("index.html");
    }
} 
