// Retrigger CSS Animation helper function
function triggerAnimation(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.remove('page-view');
        void el.offsetWidth; // Force reflow
        el.classList.add('page-view');
    }
}

// Turns cards GREEN when all required fields are filled
function setupLiveCardValidation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const inputs = card.querySelectorAll('input, select, textarea');
        const evaluateCard = () => {
            const requiredInputs = card.querySelectorAll('[required]');
            if (requiredInputs.length === 0) return; // Skip cards without required fields
            let isComplete = true;
            const radioGroups = {};
            requiredInputs.forEach(req => {
                if (req.type === 'radio') {
                    if (!radioGroups[req.name]) radioGroups[req.name] = false;
                    if (req.checked) radioGroups[req.name] = true;
                } else if (req.type === 'checkbox') {
                    if (!req.checked) isComplete = false;
                } else {
                    if (!req.value.trim()) isComplete = false;
                }
            });
            // Check if every required radio group has a selection
            for (const group in radioGroups) {
                if (!radioGroups[group]) {
                    isComplete = false;
                }
            }
            // Add or remove the green glow class
            if (isComplete) {
                card.classList.add('card-completed');
            } else {
                card.classList.remove('card-completed');
            }
        };
        // Listen to every input inside the card
        inputs.forEach(input => {
            input.addEventListener('input', evaluateCard);
            input.addEventListener('change', evaluateCard);
        });
        // Initial check on load
        evaluateCard();
    });
}
// Navigate from Page 1 (Immunization) to Page 2 (Prenetal)
function goToPage2() {
    // Validate required fields on Page 1 
    const childName = document.getElementById('childname').value.trim();
    const motherName = document.getElementById('mothername').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const newbornScreening = document.querySelector('input[name="screening"]:checked');
    const vaccineDates = document.querySelectorAll('.vaccine-date');
    let atLeastOneVaccine = false;
    for (let i = 0; i < vaccineDates.length; i++) {
        if (vaccineDates[i].value !== "") {
            atLeastOneVaccine = true;
            break;
        }
    }
    let errorMsg = '';
    if (!childName)         errorMsg += '• Child Name is required.\n';
    if (!motherName)        errorMsg += '• Mother Name is required.\n';
    if (!dob)               errorMsg += '• Date of Birth is required.\n';
    if (!gender)            errorMsg += '• Gender is required.\n';
    if (!newbornScreening)  errorMsg += '• New Born Screening (Yes/No) is required.\n';
    if (!atLeastOneVaccine) errorMsg += '• At least one vaccine must have a "Date Administered".\n';
    if (errorMsg) {
        alert('Please complete the required fields before proceeding:\n' + errorMsg);
        return false;
    }
    // Switch to Page 2
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    document.getElementById('page3').style.display = 'none';
    triggerAnimation('page2');
    // Update active navigation tab
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
    const targetLink = document.querySelector('.nav-link[data-page="page2"]');
    if (targetLink) targetLink.classList.add('active-nav');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    return true;
}
// Go back to Page 1
function goToPage1() {
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page3').style.display = 'none';
    triggerAnimation('page1');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
    const targetLink = document.querySelector('.nav-link[data-page="page1"]');
    if (targetLink) targetLink.classList.add('active-nav');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// Validate Page 2 and submit
function validateAndSubmit() {
    // Get all required values from page 2
    const maternalName = document.getElementById('maternalName').value.trim();
    const motherAge = document.getElementById('motherAge').value.trim();
    const motherAddress = document.getElementById('motherAddress').value.trim();
    const lastMens = document.getElementById('lastMens').value;
    const edc = document.getElementById('edc').value;
    const outcome = document.getElementById('outcome').value.trim();
    const deliveryDate = document.getElementById('delivery_date').value;
    const deliveryTime = document.getElementById('delivery_time').value;
    const deliveryType = document.querySelector('input[name="delivery_type"]:checked');
    const deliveryPlace = document.getElementById('delivery_place').value.trim();
    const breastfed = document.querySelector('input[name="breastfed"]:checked');
    let errors = [];
    if (!maternalName) errors.push('Maternal Name is required');
    if (!motherAge) errors.push('Mother Age is required');
    if (!motherAddress) errors.push('Address is required');
    if (!lastMens) errors.push('Last Menstrual Period (L.M.P.) is required');
    if (!edc) errors.push('Estimated Date of Confinement (E.D.C.) is required');
    if (!outcome) errors.push('Postpartum Outcome is required');
    if (!deliveryDate) errors.push('Date of Delivery is required');
    if (!deliveryTime) errors.push('Time of Delivery is required');
    if (!deliveryType) errors.push('Type of Delivery is required');
    if (!deliveryPlace) errors.push('Place of Delivery is required');
    if (!breastfed) errors.push('Breastfed status is required');
    if (errors.length > 0) {
        alert('Please fix the following errors on Page 2 before submission:\n\n' + errors.join('\n• '));
        return false;
    }
    if (confirm('Are you sure you want to submit this health record? All required fields are complete.')) {
        // Thank You Page
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'none';
        document.getElementById('page3').style.display = 'block';
        triggerAnimation('page3');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    return false;
}
// Return to Login page
function resetAndStartOver() {
    window.location.href = 'barangayLogIn.html';
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupLiveCardValidation();
    // Handle navigation tab clicks
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        if (link.getAttribute('data-page')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var pageId = this.getAttribute('data-page');
                if (document.getElementById('page1')) document.getElementById('page1').style.display = 'none';
                if (document.getElementById('page2')) document.getElementById('page2').style.display = 'none';
                if (document.getElementById('page3')) document.getElementById('page3').style.display = 'none';
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.style.display = 'block';
                    triggerAnimation(pageId);
                }
                navLinks.forEach(function(l) {
                    l.classList.remove('active-nav');
                });
                this.classList.add('active-nav');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    });
    // Enable "Other" text field for Type of Delivery (Page 1)
    const deliveryRadios = document.querySelectorAll('input[name="typeOfDelivery"]');
    const otherTextInput = document.getElementById('deliveryOtherText');
    if (otherTextInput) {
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (document.getElementById('deliveryOther').checked) {
                    otherTextInput.disabled = false; // Make it clickable
                    otherTextInput.focus(); // Automatically place cursor inside
                } else {
                    otherTextInput.disabled = true; // Make it unclickable
                    otherTextInput.value = ''; // Clear text if they change their mind
                }
                // Optional: trigger your green card validation update
                otherTextInput.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
            });
        });
    }
    // Enable "Other" text field for Type of Delivery (Page2)
    const typeDeliveryRadios = document.querySelectorAll('input[name="delivery_type"]');
    const typeDeliveryOtherTextInput = document.getElementById('typeDeliveryOtherText');
    // 2. Fixed the typo here (removed 'xtInput' from the end)
    if (typeDeliveryOtherTextInput) {
        typeDeliveryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // 3. This matches the id="deliveryOther" we added to the HTML
                if (document.getElementById('deliveryOther').checked) {
                    typeDeliveryOtherTextInput.disabled = false; // Make it clickable
                    typeDeliveryOtherTextInput.focus(); // Automatically place cursor inside
                } else {
                    typeDeliveryOtherTextInput.disabled = true; // Make it unclickable
                    typeDeliveryOtherTextInput.value = ''; // Clear text if they change their mind
                }
                // Optional: trigger your green card validation update
                typeDeliveryOtherTextInput.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
            });
        });
    }
    // Enable "Other" text field for Attended By
    const otherCheckbox = document.getElementById('AttendedByOther');
    const attendedByOtherText = document.getElementById('AttendedByOtherText');
    if (otherCheckbox && attendedByOtherText) {
        otherCheckbox.addEventListener('change', function() {
            if (this.checked) {
                attendedByOtherText.disabled = false; // Make it clickable
                attendedByOtherText.focus();
            } else {
                attendedByOtherText.disabled = true; // Make it unclickable
                attendedByOtherText.value = '';
            }
            attendedByOtherText.dispatchEvent(new Event('input', {
                bubbles: true
            }));
        });
    }
});
// Save & Update functions remain unchanged
function saveImmunizationData() {
    var childNameElement = document.getElementById('childname');
    if (!childNameElement || !childNameElement.value.trim()) {
        alert('Please fill in the Child Name before saving.');
        return;
    }
    var data = {
        childname: document.getElementById('childname').value,
        mothername: document.getElementById('mothername').value,
        birthweight: document.getElementById('birthweight').value,
        dob: document.getElementById('dob').value,
        tob: document.getElementById('tob').value,
        placeOfDelivery: document.getElementById('placeOfDelivery').value,
        ttStatus: document.getElementById('ttStatus').value,
        typeOffeeding: document.getElementById('typeOffeeding').value,
        address: document.getElementById('address').value,
        savedAt: new Date().toLocaleString()
    };
    localStorage.setItem('immunizationRecord', JSON.stringify(data));
    alert('✅ Immunization Record Saved Successfully!');
}
// Load saved Immunization data
function updateImmunizationData() {
    var saved = localStorage.getItem('immunizationRecord');
    if (saved) {
        var data = JSON.parse(saved);
        if (confirm('Load saved record?')) {
            if (document.getElementById('childname')) document.getElementById('childname').value = data.childname || '';
            if (document.getElementById('mothername')) document.getElementById('mothername').value = data.mothername || '';
            if (document.getElementById('birthweight')) document.getElementById('birthweight').value = data.birthweight || '';
            if (document.getElementById('dob')) document.getElementById('dob').value = data.dob || '';
            if (document.getElementById('tob')) document.getElementById('tob').value = data.tob || '';
            if (document.getElementById('placeOfDelivery')) document.getElementById('placeOfDelivery').value = data.placeOfDelivery || '';
            if (document.getElementById('ttStatus')) document.getElementById('ttStatus').value = data.ttStatus || '';
            if (document.getElementById('typeOffeeding')) document.getElementById('typeOffeeding').value = data.typeOffeeding || '';
            if (document.getElementById('address')) document.getElementById('address').value = data.address || '';
        }
    } else {
        alert('No saved record found');
    }
}
// Save Prenatal data to localStorage
function savePrenatalData() {
    var maternalName = document.getElementById('maternalName');
    if (!maternalName || !maternalName.value.trim()) {
        alert('Please fill in the Maternal Name before saving.');
        return;
    }
    var data = {
        maternalName: document.getElementById('maternalName').value,
        motherAge: document.getElementById('motherAge').value,
        motherAddress: document.getElementById('motherAddress').value,
        lastMens: document.getElementById('lastMens').value,
        edc: document.getElementById('edc').value,
        outcome: document.getElementById('outcome').value,
        delivery_date: document.getElementById('delivery_date').value,
        delivery_time: document.getElementById('delivery_time').value,
        delivery_place: document.getElementById('delivery_place').value,
        savedAt: new Date().toLocaleString()
    };
    localStorage.setItem('prenatalRecord', JSON.stringify(data));
    alert('✅ Prenatal Record Saved Successfully!');
}
// Load saved Prenatal data
function updatePrenatalData() {
    var saved = localStorage.getItem('prenatalRecord');
    if (saved) {
        var data = JSON.parse(saved);
        if (confirm('Load saved record?')) {
            if (document.getElementById('maternalName'))   document.getElementById('maternalName').value   = data.maternalName   || '';
            if (document.getElementById('motherAge'))      document.getElementById('motherAge').value      = data.motherAge      || '';
            if (document.getElementById('motherAddress'))  document.getElementById('motherAddress').value  = data.motherAddress  || '';
            if (document.getElementById('lastMens'))       document.getElementById('lastMens').value       = data.lastMens       || '';
            if (document.getElementById('edc'))            document.getElementById('edc').value            = data.edc            || '';
            if (document.getElementById('outcome'))        document.getElementById('outcome').value        = data.outcome        || '';
            if (document.getElementById('delivery_date'))  document.getElementById('delivery_date').value  = data.delivery_date  || '';
            if (document.getElementById('delivery_time'))  document.getElementById('delivery_time').value  = data.delivery_time  || '';
            if (document.getElementById('delivery_place')) document.getElementById('delivery_place').value = data.delivery_place || '';
        }
    } else {
        alert('No saved record found');
    }
}
// Header shrink pn scroll
let isScrolled = false;

document.addEventListener('scroll', function () {
    const header = document.querySelector('.header-container');
    if (!header) return;

    const y = window.scrollY;

    // Enter "scrolled" state
    if (!isScrolled && y > 75) {
        isScrolled = true;
        header.classList.add('scrolled');
    }

    // Exit "scrolled" state (add buffer to prevent flicker)
    else if (isScrolled && y < 36) {
        isScrolled = false;
        header.classList.remove('scrolled');
    }
});

// Date validation - prevent future dates
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const formattedToday = `${yyyy}-${mm}-${dd}`;
const restrictedDates = document.querySelectorAll('.past-date-only');

restrictedDates.forEach(input => {
    input.removeAttribute('min');
    input.max = formattedToday;
});