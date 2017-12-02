class GalleryGrid {

    constructor() {
        if ($('.gallery').length != 1)
            throw new Error("There can only be one gallery per page.");

        // Create safe list of ids and define default grid size as 3x3
        this.ids = [...arguments].map(id => (typeof(id) == "number") ? id : null);
        this.setGrid();

        // remove any children inside grid
        this.grid = $('.gallery').empty();
    }

    // Defines grid size, defaults to 3x3
    setGrid(gridX, gridY) {
    	// Grid can only be 1-4 columns wide
    	this.size = (gridX > 0 && gridX < 5 && gridY > 0) 
    		? { x: gridX, y: gridY, col: 12/gridX } : { x: 3, y: 3, col: 4 };

    	// Number of pages needed
        this.pages = Math.ceil(this.ids.length / (this.size.x * this.size.y));

        return this;
    }

    // create gallery
    make() {
    	// Add gallery page header and main container
        this.grid.append(`<div class="gallery-page-header">Page 1 of ${this.pages}</div>`)
                 .append('<div class="gallery-container"></div>');

        // store container for later, define local copy of size
        let container = $('.gallery-container'),
            size = this.size;

        // Iterate rows
        Array.from(Array(size.y), (a,b) => b).forEach(row => {
            let rowDiv = $(`<div class="row"></div>`);

            // Iterate columns
            Array.from(Array(size.x), (a,b) => b).forEach(col => {
            	// Current position in grid
                let pos = (row*size.x) + col, imgContainer;

                // Insert into grid only if the position is valid
                if (this.ids.length > pos)
                    imgContainer = $(
                        `<div class="medium-${size.col} small-${size.col} columns gallery-image-container">
                            <a href="img/${this.ids[pos]}.png" class="gallery-image-link" data-lightbox="gallery-set">
                                <img class="gallery-image" src="img/${this.ids[pos]}.png">
                            </a>
                        </div>`);

                rowDiv.append(imgContainer);
            });

            container.append(rowDiv);
        });

        // Add page footer
        this.grid.append(`<div class="gallery-page-footer"></div>`);

        Array.from(Array(this.pages), (a,b) => b+1).forEach(pageLink => {            
            $(`.gallery-page-footer`).append(`<a href="#" class="gallery-page-footer-link" onclick="GalleryGrid.update(${pageLink})">${pageLink}</a>`);
        })
        
        return this;
    }

    // Handles paging
    update(page) {
        let gridSize = this.size.x * this.size.y;

        // If page is invalid, default to 1
        if (page < 1 || (page * gridSize) - gridSize > this.ids.length)
            page = 1;

        // Update page header
        $(`.gallery-page-header`).text(`Page ${page} of ${this.pages}`);

        // Update images in gallery, if null make image container invisible
        for(let i = 0; i < gridSize; i++) {
            let img = this.ids[((page-1) * gridSize) + i];

            if (img != null) {
            	// Display img
                $($(`.gallery-image-link`)[i]).attr("href", `img/${img}.png`).attr("data-lightbox", "gallery-image");
                $($(`.gallery-image`)[i]).attr("src", `img/${img}.png`).css("visibility", "visible");
            } else {
            	// Hide img and replace data-lightbox attribute with null so lightbox doesn't show it in slideshow group
                $($(`.gallery-image-link`)[i]).attr("href", "#").attr("data-lightbox", "null");
                $($(`.gallery-image`)[i]).attr("src", `img/${img}.png`).css("visibility", "hidden");
            }
        }

        return this;
    }

}