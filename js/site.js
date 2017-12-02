class GalleryGrid {

	constructor() {
		if ($('.gallery').length != 1)
			throw new Error("There can only be one gallery per page.");

		// Create safe list of ids and define default grid size as 3x3
		this.ids = [...arguments].map(id => (id != null && typeof(id) == "number") ? id : "&nbsp;");
		this.setGrid();

		// Clean up gallery
		this.grid = $('.gallery').empty();
	}

	// Defines grid size, defaults to 3x3
	setGrid(gridX, gridY) {
		if (gridX > 0 && gridX < 5 && gridY > 0)
			this.size = { x: gridX, y: gridY, col: 12/gridX };

		else
			this.size = { x: 3, y: 3, col: 4 };

		this.pages = Math.ceil(this.ids.length / (this.size.x * this.size.y));

		return this;
	}

	// create gallery
	make() {
		this.grid.append(`<div class="gallery-page-header">Page 1 of ${this.pages}</div>`)
				 .append('<div class="gallery-container"></div>');
		let container = $('.gallery-container'),
			size = this.size;

		Array.from(Array(size.y), (a,b) => b).forEach(row => {
			let rowDiv = $(`<div class="row"></div>`);

			Array.from(Array(size.x), (a,b) => b).forEach(col => {
				let pos = (row*size.x) + col, imgContainer;

				if (this.ids.length > pos)
					imgContainer = $(
						`<div class="medium-${size.col} columns gallery-image-container">
							<a href="img/${this.ids[pos]}.png" class="gallery-image-link" data-lightbox="gallery-set">
								<img class="gallery-image" src="img/${this.ids[pos]}.png">
							</a>
						</div>`);

				rowDiv.append(imgContainer);
			});

			container.append(rowDiv);
		});

		this.grid.append(`<div class="gallery-page-footer"></div>`);
		Array.from(Array(this.pages), (a,b) => b+1).forEach(pageLink => {
			let link = `<a href="#" class="gallery-page-footer-link" onclick="GalleryGrid.update(${pageLink})">${pageLink}</a>`;
			
			$(`.gallery-page-footer`).append(link);
		})
		
		return this;
	}

	// Handles paging
	update(page) {
		let gridSize = this.size.x * this.size.y;

		if (page < 1 || (page * gridSize) - gridSize > this.ids.length)
			page = 1;

		$(`.gallery-page-header`).text(`Page ${page} of ${this.pages}`);

		for(let i = 0; i < gridSize; i++) {
			let img = this.ids[((page-1) * gridSize) + i];

			if (img != null) {
				$($(`.gallery-image-link`)[i]).attr("href", `img/${img}.png`).attr("data-lightbox", "gallery-image");
				$($(`.gallery-image`)[i]).attr("src", `img/${img}.png`).css("visibility", "visible");
			} else {
				$($(`.gallery-image-link`)[i]).attr("href", "#").attr("data-lightbox", "null");
				$($(`.gallery-image`)[i]).attr("src", `img/${img}.png`).css("visibility", "hidden");
			}
		}

		return this;
	}

}

// String formatting prototype extension (not implemented yet)
if (!String.prototype.format) {
	String.prototype.format = function() {
		return this.replace(/{(\d+)}/g, (m, n) => typeof arguments[n] != 'undefined' ? arguments[n] : m);
	};
}