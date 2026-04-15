const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

let pages = '';
for(let p=0; p<3; p++) {
    pages += '                        <!-- Page ' + (p+1) + ' -->\n';
    pages += '                        <div class="carousel-page">\n';
    pages += '                            <div class="gallery-grid">\n';
    
    for(let i=1; i<=9; i++) {
        let cardNum = p*9 + i;
        pages += '                                <div class="gallery-item" data-delay="' + ((i-1)*50) + '">\n';
        pages += '                                    <div class="gallery-card">\n';
        pages += '                                        <img src="photos/' + cardNum + '.jpg" alt="Poster Design ' + cardNum + '" loading="lazy">\n';
        pages += '                                        <div class="gallery-overlay">\n';
        pages += '                                            <h3 class="gallery-title">Poster Design</h3>\n';
        pages += '                                            <button class="gallery-zoom" aria-label="View full size"><i class="fas fa-expand"></i></button>\n';
        pages += '                                        </div>\n';
        pages += '                                        <div class="gallery-shine"></div>\n';
        pages += '                                    </div>\n';
        pages += '                                </div>\n';
    }
    
    pages += '                            </div>\n';
    pages += '                        </div>\n';
}

let parts = html.split('<div class="carousel-track" id="carousel-track">');
let pre = parts[0] + '<div class="carousel-track" id="carousel-track">\n';
let postParts = parts[1].split('                    </div>\n                </div>\n                <button class="carousel-arrow carousel-arrow-right"');
let post = '                    </div>\n                </div>\n                <button class="carousel-arrow carousel-arrow-right"' + postParts[1];

let updatedHtml = pre + pages + post;

updatedHtml = updatedHtml.replace(/<div class="carousel-dots" id="carousel-dots">[\s\S]*?<\/div>/, 
    '<div class="carousel-dots" id="carousel-dots">\n                <button class="carousel-dot active" data-page="0" aria-label="Go to page 1"></button>\n                <button class="carousel-dot" data-page="1" aria-label="Go to page 2"></button>\n                <button class="carousel-dot" data-page="2" aria-label="Go to page 3"></button>\n            </div>');

updatedHtml = updatedHtml.replace(/<span id="carousel-total-pages">\d+<\/span>/, '<span id="carousel-total-pages">3</span>');

fs.writeFileSync('index.html', updatedHtml);
console.log('done restructuring html');
