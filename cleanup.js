(() => {

    window.hlc_element_observer?.disconnect();
    window.hlc_element_observer = null;
    
    document.querySelector("#hide-related-button")?.remove();

})();
