const PDF_BASE = "./";

const library = document.getElementById("library");
const searchInput = document.getElementById("searchInput");
const resourceCount = document.getElementById("resourceCount");
const categoryCount = document.getElementById("categoryCount");
const expandAll = document.getElementById("expandAll");
const collapseAll = document.getElementById("collapseAll");

let resources = [];
let categories = new Map();

function displayName(value){
    return value
        .replace(/^\d+_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

function cleanTitle(title){
    return title
        .replace(/\.pdf$/i, "")
        .replace(/_/g, " ");
}

function createPDFPath(relativePath){
    return PDF_BASE + relativePath
        .replace(/\\/g, "/")
        .split("/")
        .map(encodeURIComponent)
        .join("/");
}

function buildCategories(data){

    categories = new Map();

    data.forEach(resource => {

        if(!categories.has(resource.Category)){
            categories.set(resource.Category, new Map());
        }

        const subcategories = categories.get(resource.Category);

        if(!subcategories.has(resource.Subcategory)){
            subcategories.set(resource.Subcategory, []);
        }

        subcategories.get(resource.Subcategory).push(resource);
    });
}

function render(data){

    if(!data.length){
        library.innerHTML = `
            <div class="no-results">
                NO RESOURCES FOUND
            </div>
        `;
        return;
    }

    buildCategories(data);

    let html = "";

    categories.forEach((subcategories, category) => {

        let categoryTotal = 0;

        subcategories.forEach(items => {
            categoryTotal += items.length;
        });

        html += `
            <article class="category">

                <div class="category-header">
                    <div class="category-title">
                        <span class="category-arrow">▶</span>
                        <span class="category-name">
                            ${displayName(category)}
                        </span>
                    </div>

                    <span class="category-count">
                        ${categoryTotal} PDF${categoryTotal !== 1 ? "S" : ""}
                    </span>
                </div>

                <div class="category-body">
        `;

        subcategories.forEach((items, subcategory) => {

            html += `
                <div class="subcategory">

                    <div class="subcategory-header">

                        <span class="subcategory-name">
                            ${displayName(subcategory)}
                        </span>

                        <span class="subcategory-count">
                            ${items.length} PDF${items.length !== 1 ? "S" : ""}
                        </span>

                    </div>

                    <div class="resource-list">
            `;

            items.forEach(resource => {

                const pdfPath = createPDFPath(resource.RelativePath);

                html += `
                    <div class="resource">

                        <div class="resource-info">

                            <div class="resource-title"
                                 title="${escapeHTML(resource.Title)}">
                                ${escapeHTML(cleanTitle(resource.Title))}
                            </div>

                            <div class="resource-meta">
                                ${resource.ResourceID}
                                • ${resource.SizeMB} MB
                                • PDF
                            </div>

                        </div>

                        <div class="resource-actions">

                            <a
                                class="resource-button primary"
                                href="${pdfPath}"
                                target="_blank"
                                rel="noopener">
                                OPEN
                            </a>

                            <a
                                class="resource-button"
                                href="${pdfPath}"
                                download>
                                DOWNLOAD
                            </a>

                        </div>

                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </article>
        `;
    });

    library.innerHTML = html;

    attachAccordionEvents();

    resourceCount.textContent = data.length;
    categoryCount.textContent = categories.size;
}

function escapeHTML(value){

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function attachAccordionEvents(){

    document.querySelectorAll(".category-header").forEach(header => {

        header.addEventListener("click", () => {

            header.parentElement.classList.toggle("open");

        });

    });

    document.querySelectorAll(".subcategory-header").forEach(header => {

        header.addEventListener("click", () => {

            header.parentElement.classList.toggle("open");

        });

    });
}

function filterResources(){

    const query = searchInput.value
        .trim()
        .toLowerCase();

    if(!query){

        render(resources);
        return;
    }

    const filtered = resources.filter(resource => {

        return [
            resource.ResourceID,
            resource.Title,
            resource.FileName,
            resource.Category,
            resource.Subcategory,
            resource.RelativePath
        ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    });

    render(filtered);

    document.querySelectorAll(".category").forEach(category => {
        category.classList.add("open");
    });

    document.querySelectorAll(".subcategory").forEach(subcategory => {
        subcategory.classList.add("open");
    });
}

expandAll.addEventListener("click", () => {

    document.querySelectorAll(".category").forEach(category => {
        category.classList.add("open");
    });

    document.querySelectorAll(".subcategory").forEach(subcategory => {
        subcategory.classList.add("open");
    });

});

collapseAll.addEventListener("click", () => {

    document.querySelectorAll(".category").forEach(category => {
        category.classList.remove("open");
    });

    document.querySelectorAll(".subcategory").forEach(subcategory => {
        subcategory.classList.remove("open");
    });

});

searchInput.addEventListener("input", filterResources);

fetch("resources.json")
    .then(response => {

        if(!response.ok){
            throw new Error("Unable to load resources.json");
        }

        return response.json();

    })
    .then(data => {

        resources = Array.isArray(data)
            ? data
            : data.resources || [];

        render(resources);

    })
    .catch(error => {

        console.error(error);

        library.innerHTML = `
            <div class="no-results">
                RESOURCE DATABASE COULD NOT BE LOADED.
                <br><br>
                Check that resources.json exists beside this page.
            </div>
        `;

    });
