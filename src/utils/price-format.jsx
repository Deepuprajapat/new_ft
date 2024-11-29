export function formatPrice(price){
    if(price>=10000000){
        return `${(price/10000000).toFixed(2)}Cr`
    }
    else if(price>=100000){
        return `${(price/100000).toFixed(2)}Lakh`;
    }
    return price;
}