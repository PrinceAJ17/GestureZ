//To allow for buttons to redirect to other pages
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".card-button").forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = this.getAttribute("data-url");
        });
    });
});
