import { Navigation } from "swiper/modules";
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
// modules={[Navigation]}
// navigation
// loop={true}
// spaceBetween={20}
// slidesPerView={1}
// breakpoints={{
//   640: { slidesPerView: 1 },
//   768: { slidesPerView: 2 },
//   1024: { slidesPerView: 3 },
// }}