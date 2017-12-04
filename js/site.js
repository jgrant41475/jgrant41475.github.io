class GalleryGrid {

    constructor() {
    	this.gallery = $('.gallery');

        if (this.gallery.length != 1)
            throw new Error('There can only be one gallery per page.');

        // Create safe list of ids and set default grid size
        this.ids = [...arguments].map(id => typeof(id) == 'number' ? id : null);
        this.setGrid();
    }

    // Defines grid size, can only be 1-4 columns wide, defaults to 3x3
    setGrid(gridX, gridY) {
    	this.size = gridX > 0 && gridX < 5 && gridY > 0
    					? { x: gridX, y: gridY, col: 12/gridX }
    					: { x: 3, y: 3, col: 4 };

        this.gridSize = this.size.x * this.size.y;
        this.pages = Math.ceil(this.ids.length / this.gridSize);

        return this;
    }

    // insert gallery container
    make() {
    	// Add page header if there is more than one page
    	if (this.pages > 1)
    		this.gallery.append(`<div class="gallery-page-header">Page 1 of ${this.pages}</div>`);

    	// Add gallery
        this.gallery.append(this._getGallery(this.size));

        // Add page footer if more than one page
        if (this.pages > 1)
	        this.gallery.append(
	        	`<div class="gallery-page-footer">${red(iterLinks(this.pages, pageLink => 
		        		`<a href="javascript:void(0);" class="gallery-page-footer-link" onclick="GalleryGrid.update(${pageLink})">${pageLink}</a>`))}
	        	</div>`);
   
        return this;
    }

    // Handles paging
    update(page) {
        // If page is invalid, default to 1
        if (page < 1 || page > this.pages)
            page = 1;

        // Update page header
        $('.gallery-page-header').text(`Page ${page} of ${this.pages}`);

        // Update gallery images
        iter(this.gridSize).forEach(i => {
        	let img = this.ids[( (page-1) * this.gridSize) + i];

        	if (img != null) {
            	// Display img
                $($(`.gallery-image-link`)[i])
                	.attr({'href': `img/${img}.png`, 'data-lightbox': 'gallery-image', 'style': 'visibility: visible'})
                	.removeClass("hide-for-small");
                $($(`.gallery-image`)[i]).attr('src', `img/${img}.png`).css('visibility', 'visible');
            } else {
            	// Hide img and replace data-lightbox attribute with null so lightbox doesn't list it in slideshow group
            	$($('.gallery-image-link')[i])
            		.attr({'href': 'javascript:void(0);', 'data-lightbox': 'null', 'style': 'visibility: hidden'})
            		.addClass('hide-for-small');
                $($('.gallery-image')[i]).attr('src', '').css('visibility', 'hidden');
            }
        });
    }

    _getGallery(size) {
        return `<div class="gallery-container">${red(iterMap(size.y, row => {
			return `<div class="row">${red(iterMap(size.x, col => {
				// Current position in grid
                let pos = (row*size.x) + col;

                return `<div class="medium-${size.col} columns gallery-image-container">${ this.ids[pos] != null ?
                			// Display image
                			`<a href="img/${this.ids[pos]}.png" class="gallery-image-link" data-lightbox="gallery-set">
								<img class="gallery-image" src="img/${this.ids[pos]}.png">
                        	</a>` :
                        	// Hide image if null
                        	`<a href="javascript:void(0);" style="visibility: hidden;" class="gallery-image-link hide-for-small" data-lightbox="null">
                            	<img class="gallery-image" src="" style="visibility: hidden;">
                        	</a>`
                		}</div>`;
      		}))}</div>`;
    	}))}</div>`;
    }
}

// Helper functions
function iter(n) { return Array.from(Array(n), (a,b) => b); }
function iterMap(n, callBack) { return iter(n).map(it => callBack(it)); }
function iterLinks(n, callBack) { return Array.from(Array(n), (a,b) => b + 1).map(it => callBack(it)); }
function red(arr) {	return arr.reduce((a,b) => String(a) + String(b)) }
