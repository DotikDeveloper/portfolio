"use strict";

document.addEventListener("DOMContentLoaded", () =>{

  function validateForm() {
    let isDataValid = true;
    let statusMessage = '';

    const name = document.getElementById('name').value;
    if (name == "") {
      statusMessage += `<p class="note note-danger">Поле <strong>Имя </strong> не может быть пустым</p>`;
      isDataValid = false;
    };

    const tel = document.getElementById('tel').value;
    if (tel == "") {
      statusMessage += `<p class="note note-danger">Поле <strong>Телефон </strong> не может быть пустым</p>`;
      isDataValid = false;
    };

    const email = document.getElementById('email').value;
    if (email == "") {
      statusMessage += `<p class="note note-danger">Поле <strong>Email</strong> не может быть пустым</p>`;
      isDataValid = false;
    } else {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<p>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(email)) {
        statusMessage += `<p class="note note-danger">Не верный формат<strong>Email</strong></p>`;
        isDataValid = false;
      }
    }

    const subject = document.getElementById('subject').value;
    if (subject == "") {
      statusMessage += `<p class="note note-danger">Поле <strong>Тема </strong> не может быть пустым</p>`;
      isDataValid = false;
    }
    const message = document.getElementById('message').value;
    if (message == "") {
      statusMessage += `<p class="note note-danger">Поле <strong>Сообщение </strong> не может быть пустым</p>`;
      isDataValid = false;
    }

    return {
      isDataValid,
      statusMessage
    };
  }

  const ajaxSend = (formData) => {
    fetch('../mail.php', { // файл обработчик
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' // отправляем данные
      }, 
      body: JSON.stringify(formData)
    })
    .then(() => {
        document.getElementById('status').innerHTML = `<p class="note note-light">Сообщение отправлено...</p>`;
        setTimeout(() => {
        document.getElementById('status').innerHTML = '';
        form.reset();
        }, 5000)
      
    })
    .catch((err) => {
      console.log(err.message);
    });
  } 

  const forms = document.getElementsByTagName('form');
    for (let i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function (e) {
            e.preventDefault();

            let formData = new FormData(this);
            formData = Object.fromEntries(formData);

            ajaxSend(formData);
        });
    };

  


});


  
  
    