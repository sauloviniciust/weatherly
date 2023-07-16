/**
 * EVENT 001 - All
 * change navbar style on scroll
 */

window.addEventListener('scroll', function() {
	const navbar = document.getElementById('navbar');
	if (window.scrollY > 0) {
	  navbar.classList.remove('bg-transparent');
	  navbar.classList.add('bg-black');
	} else {
	  navbar.classList.remove('bg-black');
	  navbar.classList.add('bg-transparent');
	}
  });
/**
 * EVENT 002 - All
 * change navbar display on responsive state, and toggle .nav-menu on button click
 */

// show responsive menu function
// function openMenu() {
// 	document.getElementById('openBtn').style.display = 'none';
// 	document.getElementById('closeBtn').style.display = 'inline-block';
// 	document.querySelector('.nav-menu').style.display = 'flex';

// 	// displays the overlay only on <= 440 screens
// 	if (window.innerWidth <= 440) {
// 		document.querySelector('.overlay').style.display = 'block';
// 	}
// }

// close responsive menu function
// function closeMenu() {
// 	document.getElementById('openBtn').style.display = 'inline-block';
// 	document.getElementById('closeBtn').style.display = 'none';
// 	document.querySelector('.nav-menu').style.display = 'none';
// 	document.querySelector('.overlay').style.display = 'none';
// }

// // verify the size of the screen and change nav state based in it
// function checkScreenWidth() {
// 	if (window.innerWidth <= 1024) {
// 		// responsive state
// 		document.getElementById('openBtn').style.display = 'inline-block';
// 		document.getElementById('closeBtn').style.display = 'none';
// 		document.querySelector('.nav-menu').style.display = 'none';
// 		if (window.innerWidth <= 440) {
// 			document.querySelector('.overlay').style.display = 'none';
// 		}
// 	} else {
// 		// original state
// 		document.getElementById('openBtn').style.display = 'none';
// 		document.getElementById('closeBtn').style.display = 'none';
// 		document.querySelector('.nav-menu').style.display = 'flex';
// 		document.querySelector('.overlay').style.display = 'none';
// 	}
// }

// // add event listener to openBtn
// document.getElementById('openBtn').addEventListener('click', openMenu);

// // add event listener to closeBtn
// document.getElementById('closeBtn').addEventListener('click', closeMenu);

// // add event listener to verify the size of the screen on window resize
// window.addEventListener('resize', checkScreenWidth);

// // runs the verification on page load
// checkScreenWidth();
