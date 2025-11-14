const API_URL = 'http://localhost:3000/api';
let allMenuItems = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'menu.html' || currentPage === '') {
        loadMenu();
        setupMenuFilters();
    }

    if (currentPage === 'testimonials.html') {
        loadTestimonials();
        setupStarRating();
    }

    if (currentPage === 'about.html') {
        loadHistory();
    }

    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }

    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    }
});

function setupMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            displayMenuItems();
        });
    });
}

function getCategoryIcon(category) {
    const icons = {
        pizza: '🍕',
        appetizer: '🥗',
        salad: '🥙',
        dessert: '🍰',
        beverage: '🥤'
    };
    return icons[category] || '🍽️';
}

function getCategoryImage(category, itemName) {
    const images = {
        pizza: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400',
        appetizer: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
        salad: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
        dessert: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
        beverage: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    return images[category] || images.pizza;
}

async function loadMenu() {
    const loadingDiv = document.getElementById('menu-loading');
    const errorDiv = document.getElementById('menu-error');
    const menuContainer = document.getElementById('menu-items');

    if (!menuContainer) return;

    try {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        menuContainer.innerHTML = '';

        const response = await fetch(`${API_URL}/menu`);

        if (!response.ok) {
            throw new Error('Failed to load menu');
        }

        allMenuItems = await response.json();
        loadingDiv.style.display = 'none';
        displayMenuItems();
    } catch (error) {
        console.error('Error loading menu:', error);
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Unable to load menu items. Please try again later.';
    }
}

function displayMenuItems() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const filteredItems = currentCategory === 'all'
        ? allMenuItems
        : allMenuItems.filter(item => item.category === currentCategory);

    if (filteredItems.length === 0) {
        menuContainer.innerHTML = '<p class="no-items">No items found in this category.</p>';
        return;
    }

    menuContainer.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image" style="background-image: url('${getCategoryImage(item.category, item.name)}');">
                <div class="menu-item-badge">${getCategoryIcon(item.category)}</div>
            </div>
            <div class="menu-item-content">
                <span class="menu-item-category">${item.category}</span>
                <h3>${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <p class="menu-item-price">AED ${(item.price * 3.67).toFixed(2)}</p>
                    <button class="menu-item-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadTestimonials() {
    const loadingDiv = document.getElementById('testimonials-loading');
    const errorDiv = document.getElementById('testimonials-error');
    const testimonialsContainer = document.getElementById('testimonials-list');

    if (!testimonialsContainer) return;

    try {
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (errorDiv) errorDiv.style.display = 'none';
        testimonialsContainer.innerHTML = '';

        const response = await fetch(`${API_URL}/testimonials`);

        if (!response.ok) {
            throw new Error('Failed to load testimonials');
        }

        const testimonials = await response.json();
        if (loadingDiv) loadingDiv.style.display = 'none';

        if (testimonials.length === 0) {
            testimonialsContainer.innerHTML = '<p class="no-items">No reviews yet. Be the first to leave a review!</p>';
            return;
        }

        testimonialsContainer.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">${testimonial.customer_name.charAt(0).toUpperCase()}</div>
                    <div>
                        <p class="testimonial-author">${testimonial.customer_name}</p>
                        <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                    </div>
                </div>
                <p class="testimonial-text">"${testimonial.comment}"</p>
                <p class="testimonial-date">${new Date(testimonial.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Unable to load reviews. Please try again later.';
        }
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            if (ratingInput) ratingInput.value = selectedRating;
            updateStars(selectedRating);
        });

        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            updateStars(hoverRating);
        });
    });

    const starRatingContainer = document.getElementById('star-rating');
    if (starRatingContainer) {
        starRatingContainer.addEventListener('mouseleave', function() {
            updateStars(selectedRating);
        });
    }

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
}

function validateTestimonialName(name) {
    if (!name || name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
}

function validateRating(rating) {
    const ratingNum = parseInt(rating);
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return 'Please select a rating between 1 and 5 stars';
    }
    return '';
}

function validateComment(comment) {
    if (!comment || comment.trim().length < 10) {
        return 'Comment must be at least 10 characters long';
    }
    if (comment.trim().length > 500) {
        return 'Comment must be less than 500 characters';
    }
    return '';
}

function validateTestimonialForm() {
    clearErrors();
    let isValid = true;

    const name = document.getElementById('customer-name').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    const nameError = validateTestimonialName(name);
    if (nameError) {
        showError('customer-name', nameError);
        isValid = false;
    }

    const ratingError = validateRating(rating);
    if (ratingError) {
        showError('rating', ratingError);
        isValid = false;
    }

    const commentError = validateComment(comment);
    if (commentError) {
        showError('comment', commentError);
        isValid = false;
    }

    return isValid;
}

async function handleTestimonialSubmit(e) {
    e.preventDefault();

    if (!validateTestimonialForm()) {
        return;
    }

    const submitBtn = document.getElementById('testimonial-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = {
        customer_name: document.getElementById('customer-name').value.trim(),
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('comment').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/testimonials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('testimonial-message');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Thank you for your review! It has been submitted successfully.';
            document.getElementById('testimonial-form').reset();
            document.getElementById('rating').value = '0';
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                star.textContent = '☆';
                star.classList.remove('active');
            });
            clearErrors();

            setTimeout(() => {
                messageDiv.style.display = 'none';
                loadTestimonials();
            }, 2000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message || 'Error submitting review. Please try again.';
        }
    } catch (error) {
        console.error('Error submitting testimonial:', error);
        const messageDiv = document.getElementById('testimonial-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Unable to submit review. Please check your connection and try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function validateName(name) {
    if (!name || name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
}

function validateEmail(email) {
    if (!email) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePhone(phone) {
    if (!phone) {
        return 'Phone number is required';
    }
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
        return 'Please enter a valid phone number';
    }
    return '';
}

function validateDate(date) {
    if (!date) {
        return 'Date is required';
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return 'Please select a future date';
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (selectedDate > maxDate) {
        return 'Reservations can only be made up to 3 months in advance';
    }

    return '';
}

function validateTime(time) {
    if (!time) {
        return 'Time is required';
    }
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const openTime = 11 * 60;
    const closeTime = 24 * 60;

    if (timeInMinutes < openTime || timeInMinutes > closeTime) {
        return 'Please select a time between 11:00 AM and 12:00 AM';
    }

    return '';
}

function validateGuests(guests) {
    const numGuests = parseInt(guests);
    if (!guests || isNaN(numGuests)) {
        return 'Number of guests is required';
    }
    if (numGuests < 1) {
        return 'At least 1 guest is required';
    }
    if (numGuests > 20) {
        return 'Maximum 20 guests allowed';
    }
    return '';
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    const nameError = validateName(name);
    if (nameError) {
        showError('name', nameError);
        isValid = false;
    }

    const emailError = validateEmail(email);
    if (emailError) {
        showError('email', emailError);
        isValid = false;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
        showError('phone', phoneError);
        isValid = false;
    }

    const dateError = validateDate(date);
    if (dateError) {
        showError('date', dateError);
        isValid = false;
    }

    const timeError = validateTime(time);
    if (timeError) {
        showError('time', timeError);
        isValid = false;
    }

    const guestsError = validateGuests(guests);
    if (guestsError) {
        showError('guests', guestsError);
        isValid = false;
    }

    return isValid;
}

async function handleReservation(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: parseInt(document.getElementById('guests').value),
        notes: document.getElementById('notes').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('reservation-message');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Reservation submitted successfully! We will contact you shortly to confirm your booking.';
            document.getElementById('reservation-form').reset();
            clearErrors();

            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message || 'Error submitting reservation. Please try again.';
        }
    } catch (error) {
        console.error('Error submitting reservation:', error);
        const messageDiv = document.getElementById('reservation-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Unable to submit reservation. Please check your connection and try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function handleContact(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('contact-message');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Message sent successfully! We will get back to you soon.';
            document.getElementById('contact-form').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Error sending message. Please try again.';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        const messageDiv = document.getElementById('contact-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error sending message. Please try again.';
    }
}

async function loadHistory() {
    const loadingDiv = document.getElementById('history-loading');
    const errorDiv = document.getElementById('history-error');
    const timelineContainer = document.getElementById('history-timeline');

    if (!timelineContainer) return;

    try {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        timelineContainer.innerHTML = '';

        const response = await fetch(`${API_URL}/history`);

        if (!response.ok) {
            throw new Error('Failed to load history');
        }

        const historyItems = await response.json();
        loadingDiv.style.display = 'none';

        if (historyItems.length === 0) {
            timelineContainer.innerHTML = '<p class="no-items">No history items available.</p>';
            return;
        }

        historyItems.sort((a, b) => a.year - b.year);

        timelineContainer.innerHTML = historyItems.map((item, index) => `
            <div class="timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}">
                <div class="timeline-marker">
                    <div class="timeline-year">${item.year}</div>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading history:', error);
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Unable to load history. Please try again later.';
    }
}