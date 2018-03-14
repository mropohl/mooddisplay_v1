const sliderControlSetup = () => {
    const slider = document.getElementById("slider_1");
    console.log(slider);
    slider.setAttribute("min", 0);
    slider.setAttribute("max", maxDist);
    slider.oninput = function() {
        console.log(this.value);
        maxDist = this.value;
    };
};
