const sliderControlSetup = () => {
    const btnSliderMenu = document.getElementById("btn-slider-menu");

    let slideMenuHidden = true;
    btnSliderMenu.addEventListener("click", () => {
        if (slideMenuHidden) {
            document.getElementById("slider-menu").style.display = "block";
            slideMenuHidden = false;
        } else {
            document.getElementById("slider-menu").style.display = "none";
            slideMenuHidden = true;
        }
    });

    const slider1 = document.getElementById("slider_1");
    slider1.setAttribute("min", 0);
    slider1.setAttribute("max", maxDist);
    slider1.setAttribute("value", maxDist);
    slider1.oninput = function() {
        maxDist = this.value;
    };

    const slider2 = document.getElementById("slider_2");
    slider2.oninput = function() {
        movementFactor = this.value;
    };

    const slider3 = document.getElementById("slider_3");
    slider3.oninput = function() {
        particleMovementSpeed = this.value;
    };
};
