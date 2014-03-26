
window.pictureSource;   // picture source
window.destinationType; // sets the format of returned value


function onPhotoDataSuccess(imageURI) { 
    console.log("* * * onPhotoDataSuccess");
    var cameraImage = document.getElementById('cameraImage'); 
    var lblpath = document.getElementById('lblpath');
    var fileNamePath;     
    try{         
        /////////////////
        fileNamePath= imageURI; 
        cameraImage.style.visibility = 'visible';
        cameraImage.width = '250';
        cameraImage.height = '250';  
        console.log("datapath=" +  fileNamePath);  
        cameraImage.src = fileNamePath; 
        lblpath.innerHTML= fileNamePath;
        // Close popup after selecting image
        $( "#dlgPic" ).popup( "close" );
    }
    catch(e)
    {
        msgAlert(e);
    }
}
function onPhotoURISuccess(imgURI) {
    try{
        console.log('onPhotoURISuccess');
         $("#cameraImage").show();
        var cameraImage = document.getElementById('cameraImage');
        var lblpath = document.getElementById('lblpath');
        cameraImage.style.visibility = 'visible';
        cameraImage.width = '250';
        cameraImage.height = '250';        
        console.log('imagepath:' + imgURI);
        cameraImage.src = imgURI; 
        lblpath.innerHTML=imgURI;
        // Close popup after selecting image
        $( "#dlgPic" ).popup( "close" );
        //getImageURI(imageURI);
    }
    catch(e){
        console.log(e);
    }
}

function take_pic() {
    try{
        console.log('in function take_pic'); 
        var CamOptions={
            quality : 30, 
            destinationType: navigator.camera.DestinationType.FILE_URI, 
            saveToPhotoAlbum: true 
        }; 
        console.log('CamOptions=' + JSON.stringify(CamOptions));
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, CamOptions);
        
    }
    catch(e)
    {
        alert(e);
    }  
}

function album_pic() {
    try{
        console.log('album_pic function');
        var albumOptions= {
            quality : 30
            ,destinationType: navigator.camera.DestinationType.FILE_URI        
            //,sourceType : Camera.PictureSourceType.PHOTOLIBRARY
            ,sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM
            ,saveToPhotoAlbum: false
            ,allowEdit: true
            ,correctOrientation: true
        }; 
        
        navigator.camera.getPicture(onPhotoURISuccess, onFail,albumOptions);
    }
    catch(e){alert(e);}
}
var onFail=function(ex) {
    msgAlert(ex,"Camera Error");
}
function getImageURI(imageURI) {
    try{
        var Fdata;
        console.log('getImageUri function');
        var gotFileEntry = function(fileEntry) {            
            var gotFileSystem = function(fileSystem) {                
                fileSystem.root.getDirectory("JalfTemp", {
                    create : true
                }, function(dataDir) {                    
                    // copy the file
                    fileEntry.moveTo(dataDir, "1.jpg", null, fsFail);  
                    Fdata=dataDir;                    
                }, dirFail); 
                console.log('fileEntry=' + fileEntry);
            };
            // get file system to copy or move image file to
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFileSystem,fsFail);
        };
        // resolve file system for image
        window.resolveLocalFileSystemURI(imageURI, gotFileEntry, fsFail);
        console.log('FE:' + gotFileEntry); 
        console.log('Fdata=' + Fdata);
        // file system fail
        var fsFail = function(error) {
            msgAlert("File transfer failed reason: " + error.message,error);            
        };
        
        var dirFail = function(error) {
            alert("Directory error code: " + error.code);            
        };
    }
    catch(e){
        alert(e);
    }
}
