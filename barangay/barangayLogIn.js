// Get the login form element
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page from reloading

        const healthIDInput = document.getElementById('baranggayHealthID');
        const loginBtn = document.getElementById('loginBtn');

        // Format ID to upper case
        healthIDInput.value = healthIDInput.value.toUpperCase();

        // Uncomment for javascript validation
        // const regex = /^[Bb][Rr][Gg][Yy]\d{3}-\d{6}$/;

        // if (!regex.test(healthIDInput.value) || healthIDInput.value.trim() === "") {
        //     alert("Please enter a valid Health ID: BRGYXXX-XXXXXX.");
        //     return;
		// } else {
        //     // Update button before redirect
        //     if (loginBtn) {
        //         loginBtn.innerHTML = "Authenticating...";
        //         loginBtn.style.opacity = "0.8";
        //         loginBtn.style.transform = "scale(0.98)";
        //     }

        //     setTimeout(() => {
        //         window.location.href = 'healthmonitoringsurvey.html';
        //     }, 600);
        // }

        if (loginBtn) {
            loginBtn.innerHTML = "Authenticating...";
            loginBtn.style.opacity = "0.8";
            loginBtn.style.transform = "scale(0.98)";
        }
        // Redirect to survey page after 8.6 seconds
        setTimeout(() => {
            window.location.href = 'healthmonitoringsurvey.html';
            // Reset Button Styling
            loginBtn.innerHTML = "Proceed to Health Portal";
            loginBtn.style.transform = "scale(1)";
        }, 600);
    });
}