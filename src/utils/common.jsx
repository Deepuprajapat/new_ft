import { Navigation, Autoplay } from "swiper/modules";  
export const sliderSettings = {
    modules: [Navigation,Autoplay],
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000, // Adjust the delay as needed
        disableOnInteraction: false, // Keeps autoplay running after user interaction
    },
    loop: true,
    slidesPerView: 1,
    spaceBetween: 50,
    breakpoints: {
        480: {
            slidesPerView: 1,
        },
        600: {
            slidesPerView: 2,
        },
        700: {
            slidesPerView: 2,
        },
        1100: {
            slidesPerView: 3,
        },
    },
};
export const carouselOptions={
    modules:[Autoplay],
    autoplay: {
        delay: 6000, // Adjust the delay as needed
        disableOnInteraction: false, // Keeps autoplay running after user interaction
    },
    navigation:false,
    loop:true,
    slidesPerView:1,
    spaceBetween:50,
    breakpoints:{
        380:{
            slidesPerView:2
        },
        600:{
            slidesPerView:3
        },
        700:{
            slidesPerView:6
        },
        1100:{
            slidesPerView:6
        }
    }
}