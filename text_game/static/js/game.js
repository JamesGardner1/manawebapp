let questionElement = document.querySelector('#question')
let button1 = document.querySelector('#choice-1')
let button2 = document.querySelector('#choice-2')
let button3 = document.querySelector('#choice-3')
let button4 = document.querySelector('#choice-4')

let hp = document.querySelector('#health-bar')
let xp = document.querySelector('#xp-bar')
let message = document.querySelector('#message')


button1.addEventListener('click', selectChoice)
button2.addEventListener('click', selectChoice)
button3.addEventListener('click', selectChoice)
button4.addEventListener('click', selectChoice)


// On page load, make request to server for inital data 
loadGame()


function loadGame() {

    fetch(loadGameUrl)
        .then( response => 
             response.json() )
        .then( data => {
            loadQuestion(data)
        })
        .catch( err => console.error(err) )
}


function userAction(data) {

    // https://docs.djangoproject.com/en/3.0/ref/csrf/#setting-the-token-on-the-ajax-request

    let token = Cookies.get('csrftoken')   
 
    console.log(data)
    fetch(actionURL, 
        {   
            method: 'POST', 
            body: JSON.stringify(data),
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                 'X-CSRFToken': token
            }
        })
        .then( response => response.json() )
        .then ( data => {
            loadQuestion(data)
        })
        .catch( err => console.error(err) )
    }




function selectChoice(event) {
    let button = event.srcElement
    let next_text = button.dataset.next_text 
    console.log(button, button.dataset)
    let data = { next_text: next_text } 
    userAction(data)
}


function loadQuestion(data) {

    console.log('loading this data from server: ', data)
    
    message.innerHTML = data.message || ''   // show data if present, empty string if not 

    questionElement.innerHTML = data.text || ''

    if (data.choices && data.choices.length > 0) {
        // Set the text of both buttons, and use html data attributes to store data within each button element
        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        button1.innerHTML = data.choices[0].text
        button1.dataset.next_text = data.choices[0].next_text   // Save next_text value as an attribute on the button element
        if (data.choices[1] != null) {
            button2.style.visibility="visible";
            button2.innerHTML = data.choices[1].text 
            button2.dataset.next_text = data.choices[1].next_text
        } else {
            button2.style.visibility="hidden";
        }
        if (data.choices[2] != null) {
            button3.style.visibility="visible";
            button3.innerHTML = data.choices[2].text
            button3.dataset.next_text = data.choices[2].next_text
        } else {
            button3.style.visibility="hidden";
        }
        if (data.choices[3] != null) {
            button4.style.visibility="visible";
            button4.innerHTML = data.choices[3].text 
            button4.dataset.next_text = data.choices[3].next_text
        } else {
            button4.style.visibility="hidden";
        }
        
 
    } 

    else {
        // Disable both buttons. TODO replace with whatever other end-of-game behavior you want. 
        button1.innerHTML = 'Not a choice'
        button1.disabled = true 
        button2.innerHTML = 'Also not a choice'
        button2.disabled = true
    }
}