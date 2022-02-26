import { RGBTuple } from "@discordjs/builders";

const rgbToHex = (r, g, b) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// const hexToRgb=(hex)=> {
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   if(result){
//       var r= parseInt(result[1], 16);
//       var g= parseInt(result[2], 16);
//       var b= parseInt(result[3], 16);
//       return r+","+g+","+b;//return 23,14,45 -> reformat if needed
//   }
//   return null;
// }

const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] as RGBTuple : null;
};

export { hexToRgb, rgbToHex };
