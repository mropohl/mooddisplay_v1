const sliderControlSetup = () => {
    const slider1 = document.getElementById("slider_1");
    slider1.setAttribute("min", 0);
    slider1.setAttribute("max", maxDist);
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
