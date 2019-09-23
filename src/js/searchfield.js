function setSearchfieldEvents() {
    $("#main-search").on("keydown", function (event) {
        if (event.which == 13) {
            $('#main-search').blur();
        }
    });
}

export {setSearchfieldEvents}
