'use strict';


chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      css: ["input[type='password']"], 
    })],
    actions: [
      new chrome.declarativeContent.ShowPageAction(),
      //new chrome.declarativeContent.RequestContentScript( {js: ["foreground.js",]})
    ]
  }]);
});


// background.js
let db = null;
let roster = [
  {
    "domain":"https://www.royalmail.com/business/user/login",
     "data":"encrypted string"
    //   "username": "mimi",
    //   "textual":"afgdf",
    //   "colors":[["#12345", "#1234"],["1243","12345"]],
    //   "questions":[["q1", "a1"],["q2", "a2"]],
    //   "actual": "dsoprj1eq2jposwjo1j1joe134",
    
  }   
]
function create_database() {
    const request = window.indexedDB.open('MyTestDB');
    request.onerror = function (event) {
        console.log("Problem opening DB.");
    }
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        let objectStore = db.createObjectStore('roster', {
            keyPath: 'domain'
        });
        objectStore.transaction.oncomplete = function (event) {
            console.log("ObjectStore Created.");
        }
    }
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("DB OPENED.");
        insert_record(roster);
        db.onerror = function (event) {
            console.log("FAILED TO OPEN DB.")
        }
    }
}

function insert_record(records) {
  if (db) {
    const insert_transaction = db.transaction("roster", 
                                 "readwrite");
    const objectStore = insert_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
       insert_transaction.oncomplete = function () {
           console.log("ALL INSERT TRANSACTIONS COMPLETE.");
           resolve(true);
       }
       insert_transaction.onerror = function () {
           console.log("PROBLEM INSERTING RECORDS.")
           resolve(false);
       }
       records.forEach(person => {
         let request = objectStore.add(person);
         request.onsuccess = function () {
           console.log("Added: ", person);
         }
       });
    });
  }
}
function get_record(domain) {
  if (db) {
    const get_transaction = db.transaction("roster", "readonly");
    const objectStore = get_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      get_transaction.oncomplete = function () {
        console.log("ALL GET TRANSACTIONS COMPLETE.");
      }
      get_transaction.onerror = function () {
        console.log("PROBLEM GETTING RECORDS.")
      }
      let request = objectStore.get(domain);
      request.onsuccess = function (event) {
        resolve(event.target.result);
      }
    });
  }
}
function update_record(record) {
  if (db) {
    const put_transaction = db.transaction("roster", "readwrite");
    const objectStore = put_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      put_transaction.oncomplete = function () {
        console.log("ALL PUT TRANSACTIONS COMPLETE.");
        resolve(true);
      }
      put_transaction.onerror = function () {
        console.log("PROBLEM UPDATING RECORDS.")
        resolve(false);
      }
      objectStore.put(record);
    });
  }
}
function delete_record(email) {
  if (db) {
    const delete_transaction = db.transaction("roster", 
                                             "readwrite");
    const objectStore = delete_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      delete_transaction.oncomplete = function () {
        console.log("ALL DELETE TRANSACTIONS COMPLETE.");
        resolve(true);
      }
      delete_transaction.onerror = function () {
        console.log("PROBLEM DELETE RECORDS.")
        resolve(false);
      }
      objectStore.delete(email);
    });
  }
}

create_database()

//encryption functions
function encrypt(message = '', key = ''){
  var message = CryptoJS.AES.encrypt(message, key);
  return message.toString();
}
function decrypt(message = '', key = ''){
  var code = CryptoJS.AES.decrypt(message, key);
  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

  return decryptedMessage;
}
var key = 'daoejij1j3jw0sdjw1>>PKEOJ@JOJ90j(S(PJSQ:jdpa'


chrome.runtime.onMessage.addListener((request,sender,senderResponse)=>
{
  if(request.message ==="insert"){
    let re= insert_record(request.payload)
    re.then(res=>{
      chrome.runtime.sendMessage({
        message: "insert_success",
        payload:  res
      })
    })
  }else if(request.message ==="get"){
    let re= Promise.resolve(get_record(request.payload))
    console.log("records retrieved")
   
    re.then(res=>{
      if(typeof res === "undefined") {

      console.log("no entries")
    
      }else{

        function decrypt(message = '', key = ''){
          var code = CryptoJS.AES.decrypt(message, key);
          var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
        
          return decryptedMessage;
        }
        var key = 'daoejij1j3jw0sdjw1>>PKEOJ@JOJ90j(S(PJSQ:jdpa'
        
         var decrypted =decrypt(res.data, key)
         console.log(typeof res.data)
         console.log( decrypted.toString(), "decrytpted data from json")

         res = {  "domain":res.domain,
                  "data": decrypted,}

      }
      
        chrome.runtime.sendMessage({
          message: "get_success",
          payload:  res,
        },
        console.log(res, "decrytpted data from json"),

        )
      })
    console.log("records sent")

}else if (request.message ==="delete"){
  let re= delete_record(request.payload)
  re.then(res=>{
    chrome.runtime.sendMessage({
      message: "delete_success",
      payload:  res
    })
  })
}else if (request.message ==="update"){
  let re= update_record(request.payload)
  re.then(res=>{
    chrome.runtime.sendMessage({
      message: "update_success",
      payload:  res
    })
  })

}else if(request.message ==="create_password"){
    //generate pass
    //encrypt full pass
    //save in db


  //encryption functions
    function encrypt(message = '', key = ''){
      var message = CryptoJS.AES.encrypt(message, key);
      return message.toString();
  }
  function decrypt(message = '', key = ''){
      var code = CryptoJS.AES.decrypt(message, key);
      var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
  
      return decryptedMessage;
  }
  var key = 'daoejij1j3jw0sdjw1>>PKEOJ@JOJ90j(S(PJSQ:jdpa'
  console.log(encrypt('Hello World', key));
  console.log(decrypt('U2FsdGVkX1/0oPpnJ5S5XTELUonupdtYCdO91v+/SMs=', key))
  

    console.log(request.payload)
    let info = request.payload

    var generatePassword = (
      length = 20,
      wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
    ) => Array(length)
          .fill('')
          .map(() => wishlist[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * wishlist.length)])
          .join('');
    
    info[0].data.actual = generatePassword();
    console.log(info)
    var encrypteddata = encrypt(JSON.stringify(info[0].data), key)
    console.log(encrypteddata, "this is encrypted data")
    //reconstruct the values
    chrome.tabs.getSelected(null, function(tab) {
      var myURL = tab.url;
    console.log(myURL)
    var record = [
      {
        "domain":myURL,
        "data":encrypteddata,
      }   
    ]
  

    let re= insert_record(record)
    re.then(res=>{
      console.log("insert completed")
      chrome.runtime.sendMessage({
        message: "insert_success",
        payload:  res
      })
    })
  });




}else if (request.message === "check_info"){
  let info = request.payload
  console.log("checking info")
  console.log(info)
  let login = true
  chrome.storage.local.get("record", function(data) {
    console.log(data)
    console.log(data.record.textual, info[0].password)
      if( data.record.textual === info[0].password ){
        
      for(let i=0; i<data.record.questions.length; i++){
        if (data.record.questions[i][1] != info[0].questions[i]){
          login = false
          console.log(data.record.questions[i][1], info[0].questions[i])
        }
      }
      for(let i=0; i<data.record.colors.length; i++){
        if (data.record.colors[i] != info[0].colors[i]){
          console.log(data.record.colors[i], info[0].colors[i])
          login = false
        }
      }

      }else{
        login =false
      }
      
      let pass ="failed authentication"
      if(login){
      pass = data.record.actual
    }
    chrome.runtime.sendMessage({
      message: "login",
      payload: pass
    }  
    )
  })
  
  
}

})