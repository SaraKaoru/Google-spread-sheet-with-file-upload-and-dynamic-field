function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Template.html');
}

function uploadFiles(form) {
  try {
    
    var folderName = "Template";
    var sheetName = "Template";
    var folder;
    var folders = DriveApp.getFoldersByName(folderName);
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    //handling uploading file
    var blob = form.myFile;    
    var file = folder.createFile(blob);    
    file.setDescription("Uploaded by "+ form.nickname+" - " + form.name  + "("+ form.email +")" );    
    
    var fileUrl = file.getUrl();
    
    //Find drive has this file or not
    var FileIterator = DriveApp.getFilesByName(sheetName);
    var sheetApp = "";
    while (FileIterator.hasNext())
    {
      var sheetFile = FileIterator.next();
      if (sheetFile.getName() == sheetName)
      {
        // Open sheet if exist
        sheetApp = SpreadsheetApp.open(sheetFile);
      }    
    }


    if(sheetApp == "")
    {
      sheetApp = SpreadsheetApp.create(sheetName);
    }
    var sheet = sheetApp.getSheets()[0];
    var lastRow = sheet.getLastRow()+1;
    if(lastRow==1){
      sheet.getRange(1, 1, 1, 10).
        setValues([["Nickname","Name","email","Tel","Addr","item","size","color","URL","Picture"]]);
        lastRow=2;
    }
    Logger.log("form.itemname.length:"+form.itemname.length);
    Logger.log("form.itemname:"+form.itemname);
    Logger.log("form.itemname:"+typeof(form.itemname));
    Logger.log("form.itemname:"+JSON.stringify(form.itemname));
    var data = [];
    if(typeof(form.itemname)=="string"){
       data.push([form.nickname,form.name,form.email,form.tel,form.addr,
                 form.itemname,form.itemsize,form.itemcolor,form.itemurl,fileUrl])
    }
    else{
       for(var i=0;i<form.itemname.length;i++){
         Logger.log(i+"form.itemname[i]:"+form.itemname[i]);
         data.push([form.nickname,form.name,form.email,form.tel,form.addr,
                 form.itemname[i],form.itemsize[i],form.itemcolor[i],form.itemurl[i],fileUrl])
       }
    }
    
    Logger.log(JSON.stringify(data))
    Logger.log("data set completed,lastRow="+lastRow);
    var targetRange = sheet.getRange(lastRow, 1, data.length, 10).
        setValues(data);
    return "Your response has been record. Thank you."
    
  } catch (error) {
    
    return "Exception occured："+error.toString();
  }
  
}