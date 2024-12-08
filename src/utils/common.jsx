import { Navigation,Autoplay } from "swiper/modules";
export const sliderSettings={
    modules:[Navigation],
    navigation:true,
    loop:true,
    slidesPerView:1,
    spaceBetween:50,
    breakpoints:{
        480:{
            slidesPerView:1
        },
        600:{
            slidesPerView:2
        },
        700:{
            slidesPerView:3
        },
        1100:{
            slidesPerView:3
        }
    }
}

export const carouselOptions={
    modules:[Autoplay],
    autoplay: {
        delay: 3000, // Adjust the delay as needed
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