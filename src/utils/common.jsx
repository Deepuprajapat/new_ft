import { Navigation, Autoplay } from "swiper/modules";  
import { uploadImage } from '../app/apis/api';

export const sliderSettings = {
    modules: [Navigation,Autoplay],
    // navigation: true, 
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


export async function imgUplod(file, { alt_keywords = '', file_path = '' } = {}) {
  if (!file) throw new Error('No file provided');
  const file_name = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  // 1. Get presigned URL from API
  const response = await uploadImage({ file_name, alt_keywords, file_path });
  const presignedUrl = response?.data?.presigned_url || response?.presigned_url;
  if (!presignedUrl) throw new Error('No presigned URL returned from API');
  // 2. Upload file to S3
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  // 3. Return the S3 image URL (without query params)
  const s3ImageUrl = presignedUrl.split('?')[0];
  return s3ImageUrl;
}