$htmlPath = 'index.html'
$content = Get-Content $htmlPath -Raw

# 1. Add Category Filters
$filterHtml = @"
            <!-- Category Filters -->
            <div class="gallery-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="branding">Branding</button>
                <button class="filter-btn" data-filter="social">Social Media</button>
                <button class="filter-btn" data-filter="posters">Posters</button>
                <button class="filter-btn" data-filter="ads">Ad Campaigns</button>
                <div class="view-more-btn">View More <i class="fas fa-arrow-right"></i></div>
            </div>
"@

$content = $content -replace '<p class="section-subtitle">A showcase of my creative designs, posters, and marketing materials</p>', "`$0`n`n$filterHtml"

# 2. Assign categories to slides
for ($i = 1; $i -le 27; $i++) {
    $cat = "posters"
    if ($i -le 6) { $cat = "posters" }
    elseif ($i -le 12) { $cat = "social" }
    elseif ($i -le 18) { $cat = "branding" }
    elseif ($i -le 24) { $cat = "ads" }
    else { $cat = "branding" }
    
    $oldTag = "swiper-slide gallery-item`" data-delay=`"(\d+)`">"
    $newTag = "swiper-slide gallery-item`" data-category=`"$cat`" data-delay=`"`$1`">"
    $content = [regex]::Replace($content, [regex]::Escape("<div class=`"swiper-slide gallery-item`" data-delay=`"") + "(\d+)" + [regex]::Escape("`">"), "`$0") # Just a sanity check
    # Actually simpler:
    $content = $content -replace "src=`"photos/$i.jpg`"", "src=`"photos/$i.jpg`" data-cat-check=`"$cat`""
}

# Fix the slides in a loop (using regex carefully)
$content = [regex]::Replace($content, '(?s)<div class="swiper-slide gallery-item" data-delay="(\d+)">\s+<div class="gallery-card">\s+<img src="photos/(\d+)\.jpg"', {
    param($m)
    $num = [int]$m.Groups[2].Value
    $cat = "posters"
    if ($num -le 6) { $cat = "posters" }
    elseif ($num -le 12) { $cat = "social" }
    elseif ($num -le 18) { $cat = "branding" }
    elseif ($num -le 24) { $cat = "ads" }
    else { $cat = "branding" }
    return "<div class=`"swiper-slide gallery-item`" data-category=`"$cat`" data-delay=`"$($m.Groups[1].Value)`">`n                        <div class=`"gallery-card`">`n                            <img src=`"photos/$num.jpg`""
})

# 3. Move navigation and pagination to the bottom cluster
$navOld = @"
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-pagination"></div>
            </div>
"@

$navNew = @"
                </div>
                
                <!-- Clustered Controls -->
                <div class="gallery-controls">
                    <button class="gallery-nav-btn prev-btn"><i class="fas fa-arrow-left"></i></button>
                    <div class="swiper-pagination"></div>
                    <button class="gallery-nav-btn next-btn"><i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
"@

$content = $content -replace [regex]::Escape($navOld), $navNew

Set-Content $htmlPath -Value $content -NoNewline
Write-Output "Done updating index.html for Premium Recreation"
