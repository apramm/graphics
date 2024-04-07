    //get toggle button and add click event listener
    const bulb = document.getElementById('bulb');

    bulb.onclick = function() {
        document.body.classList.toggle('dark-theme');
    }
