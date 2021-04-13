chrome.tabs.getSelected(null, function(tab) {
  var myURL = tab.url;
  chrome.runtime.sendMessage({
    message: 'get',
   payload: myURL,
    });

})


// chrome.storage.local.get("record", function(data) {
//     console.log(data)
//     if( data.record != 0) {

  function create_saved_color(list, elementid){
    var container =  document.getElementById(elementid)
    var tags = document.createElement("div")
    tags.setAttribute("class", "tags")
    for(var i=0; i<list.length; i++){
      var span = document.createElement("span")
      span.setAttribute("class", "tag")
      span.setAttribute("style","background-color:" +list[i]+";")
      tags.appendChild(span)
    }
    container.appendChild(tags)
  }

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.message =="get_success"){
    console.log(request.payload, "this is from listener")
    if(typeof request.payload != "undefined"){


      //IF THERE IS RECORD


      document.getElementById('availability').innerText = request.payload.domain ;

        let website = true; 
        document.getElementById('create_pass').style.display = 'none'; 
        console.log(JSON.parse(request.payload.data))
        let data = JSON.parse(request.payload.data)
        let question_fields = []
        let all_colors=[]
        if(data.questions.length!=0){
        for (i=0;i<data.questions.length;i++){
                var container = document.getElementById("container1");

                container.appendChild(document.createTextNode(data.questions[i][0]));
                // Create an <input> element, set its type and name attributes
                container.appendChild(document.createElement("br"));
                var input = document.createElement("input");
                input.type = "text";
                input.name = "q" + i;
                input.className ="input is-primary is-rounded is-small"
                container.appendChild(input);
                // Append a line break 
                container.appendChild(document.createElement("br")); 
                question_fields.push(input)
        }
      }
      
      if(data.colors.length!=0){
        for (i=0;i<data.colors.length;i++){
        
          var container = document.getElementById("color_input");
          

            container.setAttribute("style","display:block;")
                let color_names = ["#ce0707",
                                    "#e7890d",
                                    "#e8f531",
                                    "#4CAF50",
                                    "#008CBA",
                                    "#190ae9",
                                    "#8e0be6",
                                    "#f71bd9", 
                                    "#e9dede",
                                    "#000000"]
              let color_buttons=[]

              for(var i=0;i<color_names.length; i++){
                color_buttons.push(document.getElementById(color_names[i]))
              }
             
              let color_selection = []

                for(var i=0;i<color_buttons.length; i++){
                      color_buttons[i].addEventListener("click", function() {
                          if(color_selection.length<6){
                            console.log(color_buttons)
                            console.log(this.value)
                            let color = this.value
                            let position = color_selection.length
                            document.getElementById('s'+position).setAttribute("class", "colorbutton button"+color)
                            color_selection.push(color_names[color])
                            console.log(color,color_selection)}
                    })
                  }
              //do the color selection loop

              //check if only 1 color comb if not display button for next
              if(data.colors.length>0){
                var nextbutton = document.getElementById("next_color")
                nextbutton.setAttribute("style","display:block;")
                nextbutton.onclick = function(p){
                  //check if  there is input if not do nothing
                  
                      if(color_selection.length==0){
                        //warning
                        console.log("please add colors")

                      }else{
                        all_colors.push(color_selection)
                        create_saved_color(color_selection,"saved_entries")

                        color_selection=[]
                        for(var i=0; i<6; i++){
                          var button = document.getElementById("s"+i)
                          button.setAttribute("class","colorbutton")
                      }
                        if(all_colors.length==data.colors.length){
                       
                        nextbutton.setAttribute("style","display:none;")
                        container.setAttribute("style","display:none;")
                    
              
                
                      }
                    }
                }

              }
            
            }}
            
            //then on submit check if there is data and if there is data send to background
            document.getElementById('submitform').addEventListener('click', event => {
             console.log("submit ex")
             let q_answers=[]
            console.log("Input values:",q_answers, all_colors)
             // const form_data = new FormData(document.getElementById('add_form'));
              let password = document.getElementById("password").value
             
              for(let i = 0; i<question_fields.length; i++){
                 q_answers.push([data.questions[i][0], question_fields[i].value.toLowerCase()])
                
             }
            

            //check if they are correct 
            let display_pass_and_name = false 
            console.log(data.textual)
            var warning_box = document.getElementById("warningInput")
            //check values
            






            if(data.textual ==password && 
              JSON.stringify(data.questions)==JSON.stringify(q_answers) && 
              JSON.stringify(data.colors)== JSON.stringify(all_colors)){
             console.log("correct pass")
             //warning_box.innerText = "wrong textual password"
            // warning_box.innerText = "wrong color combinations"
            
              display_pass_and_name = true
              if(display_pass_and_name){
                var location = document.getElementById("result");
              var result = document.createElement("button")
              result.class= "button is-primary"
              result.innerText = data.username + " "+data.actual
              location.appendChild(result)
              location.appendChild(document.createElement("br"));
              }
            }else{
              console.log("incorrect stuff")
              console.log("pass",data.textual,password)
              console.log("qs",data.questions,q_answers)
              console.log("colors",data.colors,all_colors)
             
              
            }


            //   chrome.runtime.sendMessage({
            //       message: 'check_info',
            //      payload: [{
            //           "password": form_data.get('password'),
            //           "questions": q_answers,
            //           "colors": all_colors}]
            //   });
            //   console.log("message sent")
             })
          
    
    

} else {




    //IF THERE IS A RECORD



          document.getElementById( "displayifrecord").setAttribute("style", "display:none;")



            let username =""
            let userelement =  document.getElementById("username")
            userelement.onchange = function(p){
              username = p.target.value
            }
            document.getElementById('availability').innerText = "website unavailable"; 
            let website = false;
            //create password option
            document.getElementById('create_pass').style.display = 'block'; 
            let procList = [0,20,40,80,100]
            let score = 0
            let real_score = 0
            let acc_score = 0
            let currentpass=""
            let currentpass_score =0
            let input = document.getElementById("sample_pass")
            const strength = document.getElementById('strength');
            let displaymultilayer = false
            document.getElementById("multilayer").setAttribute("style","display:none;")
            input.onchange = function(p){
              let check = zxcvbn(p.target.value)
              currentpass = p.target.value
              currentpass_score = check.score
              console.log(check.password, check.score, check.feedback.suggestions)
              strength.innerText = check.feedback.suggestions
              if(score!=0){
                
                real_score= real_score-score
              }
              score = procList[check.score]
              acc_score = acc_score+score
              real_score= real_score+score

              if(real_score<100){
                acc_score= real_score
              }
              if(acc_score>100){
                acc_score=100
              }
              var bar = document.getElementById("progressbar")
              bar.setAttribute("value", acc_score)
              bar.innerText = acc_score + "%" 
              if(acc_score==100){
                document.getElementById("submit_all").setAttribute("style","display:block;")
              }else if(acc_score<100){
                document.getElementById("submit_all").setAttribute("style","display:none;")
              }

              
              if (p.target.value=='' || check.score==4){
                displaymultilayer = false
                document.getElementById("multilayer").setAttribute("style","display:none;")
              }else{
                displaymultilayer= true
                document.getElementById("multilayer").setAttribute("style","display:block;")
              }
            }
            answers = []
            answerids=[]
            //question section 
            questions = [
              "What’s the name of your first employer?",
              "What subject were you good at in school?",
              "What is the make and model of your favorite car?",
              "What was the name of your first teacher?",
              "What’s your maternal grandmother’s maiden name?",
              "In what city or town did your mother and father meet?",
              "What is your oldest sibling’s birthday month and year?",
              "What street did you live on in third grade?"]

            var container = document.getElementById("container2");
            function create_select(){
            var select = document.createElement("select")
            select.id = "select1"
            for (i=0; i<questions.length;i++){
              var option = document.createElement("option")
              option.value = i
              option.className = "options"
              option.innerText = questions[i]
              select.appendChild(option)
            }
            var input = document.createElement("input")
            input.placeholder = "Answer"
            input.id = "inputq"
            var addq= document.createElement("button")
            addq.innerText = "Add"
            addq.id = "addq"
            container.appendChild(select)
            container.appendChild(input)
            container.appendChild(addq)
            
          }
          create_select();
          var addq = document.getElementById("addq")
            addq.onclick = function(p){
              var qselect = document.getElementById("select1").value
              var qanswer = document.getElementById("inputq").value
              console.log("answer to q ",questions[qselect], qanswer)
              if(qanswer=="" || qanswer==null|| qanswer.length<3 || answerids.includes(qselect)){
                console.log("please enter value")
                var warning = document.getElementById("warning")
                warning.innerText = "Please enter a valid answer of at least 3 letters."
              }else{
                //add to answer list
                qanswer = qanswer.toLowerCase();
                answers.push([questions[qselect], qanswer])
                answerids.push(qselect)
                //calculate strength
                if(3<qanswer.length<5){
                  acc_score+=10
                  real_score+=10
                }else if(qanswer.length>=5){
                  acc_score+=20
                  real_score+=20
                }
                if(real_score<100){
                  acc_score= real_score
                }
                if(acc_score>100){
                  acc_score=100
                }
                //update progress bar 
                console.log(acc_score)
                var bar = document.getElementById("progressbar")
                bar.setAttribute("value", acc_score)
                bar.innerText = acc_score + "%"
                if(acc_score==100){
                  document.getElementById("submit_all").setAttribute("style","display:block;")
                }else if(acc_score<100){
                  document.getElementById("submit_all").setAttribute("style","display:none;")
                }

                //display as locked choice
                var div = document.getElementById("lockedin_answers")
                var locked = document.createElement("p")
                locked.innerText = questions[qselect] + ": "+ qanswer
                div.appendChild(locked)
                //clear selection
                var op = document.getElementsByClassName("options")
               for (i=0; i<op.length;i++){
                 if( op[i].value == qselect) {
                   op[i].setAttribute("hidden", "true")
                  }
               }
                //clear text
                var input = document.getElementById("inputq")
                input.value = ''


              }
    }

    //color section
    
    colorpasslist = []
    color_selection = []

    color_values = ["#ce0707",
                    "#e7890d",
                    "#e8f531",
                    "#4CAF50",
                    "#008CBA",
                    "#190ae9",
                    "#8e0be6",
                    "#f71bd9", 
                    "#e9dede",
                    "#000000"]
    var color_names = ["red","orange","yellow","green", "lblue","dblue","purple","pink","white","black"]
    
  
    let color_buttons=[]

    for(var i=0;i<color_names.length; i++){
      color_buttons.push(document.getElementById(color_names[i]))
    }


      for(var i=0;i<color_buttons.length; i++){
            color_buttons[i].addEventListener("click", function() {
                if(color_selection.length<6){
                  console.log(color_buttons)
                  console.log(this.value)
                  let color = this.value
                  let position = color_selection.length
                  document.getElementById('b'+position).setAttribute("class", "colorbutton button"+color)
                  color_selection.push(color_values[color])
                  console.log(color,color_selection)}
          })
        }

        // function create_saved_color(list, elementid){
        //   var container =  document.getElementById("lockedcolors")
        //   var tags = document.createElement("div")
        //   tags.setAttribute("class", "tags")
        //   for(var i=0; i<list.length; i++){
        //     var span = document.createElement("span")
        //     span.setAttribute("class", "tag")
        //     span.setAttribute("style","background-color:" +list[i]+";")
        //     tags.appendChild(span)
        //   }
        //   container.appendChild(tags)
        // }



          //check if list a is contained in list b
          function removeElements(A, B){
            for(var i =0; i<(B.length-A.length+1); i++){
              for(var j=0; j<A.length;i++){
                if (B[i + j] != A[j]){
                  break
                }else{
                  return -5;
                               }
              }
            }
            return 0;} 

        
        function calculate_strength_color(colorlist){
          var pass_len = colorlist.length
          var set  = new Set(colorlist)
          var number_of_colors = set.size
          //for each unique color add 5%
          //for length of pass : 3 = 3%, 4= 6%, 5=9%, 6 = 12%
          var len_perc =[0,0,4,8,12,16]
          //check if sequence exists if list is of length at least 3
          var sequence = 0;
          if (pass_len>=3){
            console.log("sequence res:",removeElements(colorlist,color_values))
            sequence = removeElements(colorlist,color_values)
          }
          console.log(" length proc addition",len_perc[pass_len-1])
          console.log("number of colors",number_of_colors, set)
          return number_of_colors*5 + len_perc[pass_len-1] + sequence

        }
       
        
        //add the color password to the form and reset the entry
          var addcolor = document.getElementById("add_color")
          addcolor.onclick = function(p){
            if (color_selection.length!=0){
              colorpasslist.push(color_selection)
              create_saved_color(color_selection, "lockedcolors")
               //calculate strength of pass and add to accumulative
               var strength = calculate_strength_color(color_selection)
               acc_score+=strength
               real_score+=strength
               //update percentage bar
               console.log("strength",strength)
               if(real_score<100){
                 acc_score=real_score
               }
               if (acc_score>100){acc_score=100}
               console.log(acc_score)
               var bar = document.getElementById("progressbar")
               bar.setAttribute("value", acc_score)
               bar.innerText = acc_score + "%"
               if(acc_score==100){
                document.getElementById("submit_all").setAttribute("style","display:block;")
              }else if(acc_score<100){
                document.getElementById("submit_all").setAttribute("style","display:none;")
              }

              

              //reset the selection boxes
              color_selection=[]
              for(var i=0; i<6; i++){
                var button = document.getElementById("b"+i)
                button.setAttribute("class","colorbutton")
                
              }
           

            }


          }

  
  var submitall = document.getElementById("submit_all")
  //check if pass is lvl 4 submit only pass
  submitall.onclick = function(){
    console.log(acc_score,"acc score from submit all")
  if(acc_score!=100 || username==""){
    //warning
    console.log("Please add username or more layers to the password. Password strength at ", acc_score,"%.")
  }else{
  if(currentpass_score ==4){

    //send to background and still have to generate the pass
    chrome.runtime.sendMessage({
      message: 'create_password',
     payload: [{
         // "domain": data.record.domain,
          "data":{
            "username":username,
            "textual": currentpass,
            "colors": [],
            "questions": [],
            "actual":"",
          }
         
        }]
  });
  }else{
  //check if pass is multilayer submit multilayer
    //create a long hash for a password( in the background using window.crypto.getRandomValues(array);)
   
    chrome.runtime.sendMessage({
      message: 'create_password',
     payload: [{
         // "domain": data.record.domain,
          "data":{
            "username":username,
            "textual": currentpass,
            "colors":colorpasslist,
            "questions": answers,
            "actual":"",
          }
          }]
  })
}
  }}

 }
}
}
);



 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.message =="get_success"){
    console.log(request.payload, "this is from listener")
  }

  if(request.message =="insert_success"){
    window.alert("Data saved successfully!")

  }

   if (request.message === 'login') {
       if (request.payload) {
        var location = document.getElementById("result");
           var result = document.createElement("button")
           result.class= "button is-primary"
           result.innerText = request.payload
           location.appendChild(result)
           location.appendChild(document.createElement("br"));
       }}})






// ADD A RECORD

