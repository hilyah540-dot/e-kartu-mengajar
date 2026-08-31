const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

const target = `if (val.length > 30) {
                     Swal.fire({
                       icon: 'warning',
                       title: 'Karakter terlalu panjang',
                       text: 'Maksimal 30 huruf',`;

const replacement = `if (val.length > 35) {
                     Swal.fire({
                       icon: 'warning',
                       title: 'Karakter terlalu panjang',
                       text: 'Maksimal 35 huruf',`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/FormView.tsx', code);
    console.log("Replaced successfully to 35");
} else {
    console.log("Target not found!");
}
