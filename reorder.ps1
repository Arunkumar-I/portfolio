$htmlPath = 'index.html'
$content = Get-Content $htmlPath -Raw

$startMarker = '<div class="carousel-track" id="carousel-track">'
$endMarker = '                    </div>
                </div>
                <button class="carousel-arrow carousel-arrow-right"'

$parts = $content -split [regex]::Escape($startMarker)
$postParts = $parts[1] -split [regex]::Escape($endMarker)

$pre = $parts[0] + $startMarker + "
"

$pages = ""
for ($p = 0; $p -lt 3; $p++) {
    $pages += "                        <!-- Page $($p+1) -->
"
    $pages += "                        <div class=""carousel-page"">
"
    $pages += "                            <div class=""gallery-grid"">
"
    
    for ($i = 1; $i -le 9; $i++) {
        $cardNum = $p * 9 + $i
        $delay = ($i - 1) * 50
        $pages += "                                <div class=""gallery-item"" data-delay=""$delay"">
"
        $pages += "                                    <div class=""gallery-card"">
"
        $pages += "                                        <img src=""photos/$cardNum.jpg"" alt=""Poster Design $cardNum"" loading=""lazy"">
"
        $pages += "                                        <div class=""gallery-overlay"">
"
        $pages += "                                            <h3 class=""gallery-title"">Poster Design</h3>
"
        $pages += "                                            <button class=""gallery-zoom"" aria-label=""View full size""><i class=""fas fa-expand""></i></button>
"
        $pages += "                                        </div>
"
        $pages += "                                        <div class=""gallery-shine""></div>
"
        $pages += "                                    </div>
"
        $pages += "                                </div>
"
    }
    $pages += "                            </div>
"
    $pages += "                        </div>
"
}

$post = $endMarker + $postParts[1]

$finalContent = $pre + $pages + $post

$dotsRegex = '(?s)<div class="carousel-dots" id="carousel-dots">.*?</div>'
$dotsReplacement = '<div class="carousel-dots" id="carousel-dots">
                <button class="carousel-dot active" data-page="0" aria-label="Go to page 1"></button>
                <button class="carousel-dot" data-page="1" aria-label="Go to page 2"></button>
                <button class="carousel-dot" data-page="2" aria-label="Go to page 3"></button>
            </div>'
$finalContent = [regex]::Replace($finalContent, $dotsRegex, $dotsReplacement)

$counterRegex = '<span id="carousel-total-pages">\d+</span>'
$counterReplacement = '<span id="carousel-total-pages">3</span>'
$finalContent = [regex]::Replace($finalContent, $counterRegex, $counterReplacement)

Set-Content $htmlPath -Value $finalContent -NoNewline
Write-Output "Done restructuring index.html"
