(function () {
    window.$sb = function () {
        var artists, nodes, recordFromPath
        artists = {};
        a2z_titles = [];
        songs = {};
        nodes = {
            a2z : {
                artists : document.getElementById("SB_a2z_artists"),
                titles : document.getElementById("SB_a2z_titles"),
                show_artists : document.getElementById("SB_showArtists"),
                show_titles : document.getElementById("SB_showTitles")
            },
            details : {
                artists : document.getElementById("SB_a2z_details_artists"),
                titles : document.getElementById("SB_a2z_details_titles")
            },
            image : document.getElementById("SB_image"),
            image2 : document.getElementById("SB_image2")
        };

        // helper method to return path, artist, song and first letters from path
        recordFromPath = function (path) {
            var arr, title;
            arr = path.split("/");
            title = arr[4].replace(/.chopro.ps-[0-9].png/, "").replace(/([A-Z])/g," $1").replace(/^ /, "");
            return {
                path : path,
                artist : arr[3].replace(/\./g, " "),
                title : title,
                a2z : {
                    artist : arr[2].toUpperCase(),
                    title : title.charAt(0).search(/[0-9]/) !== -1 ? '1-9' : title.charAt(0)
                }
            };
        };

        // build navigation and activate user interface
        this.init = function () {
            var a2z, i, rec, buttons;

            for (i = 0; i < window.SONGS.length -1; i += 1) {
                // skip multipages
                if (window.SONGS[i].search("-0.png") === -1) {
                    continue;
                }
                rec = recordFromPath(window.SONGS[i]);

                // remember paths to songs by artist
                if (!songs[rec.artist]) {
                    songs[rec.artist] = [];
                }
                songs[rec.artist].push(rec.path);

                // remember artists by a2z
                if (!artists[rec.a2z.artist]) {
                    artists[rec.a2z.artist] = {};
                }
                artists[rec.a2z.artist][rec.artist] = 1;


                // remember titles by a2z
                if (a2z_titles.indexOf(rec.a2z.title) === -1) {
                    a2z_titles.push(rec.a2z.title);
                }
            }

            // build a2z index for artists
            a2z = [];
            arr = Object.keys(songs);
            for (i = 0; i < arr.length; i += 1) {
                for (j = 0; j < songs[arr[i]].length; j += 1) {
                    rec = recordFromPath(songs[arr[i]][j]);
                    if (a2z.indexOf(rec.a2z.artist) === -1) {
                        if (a2z.indexOf(rec.a2z.artist) === -1) {
                            a2z.push(rec.a2z.artist);
                        }
                    }
                }
            }
            buttons = [];
            a2z.sort();
            for (i = 0; i < a2z.length; i += 1) {
                buttons.push("<input type='button' value='" + a2z[i] + "'/>");
            }
            nodes.a2z.artists.innerHTML = buttons.join("");

            // build a2z index for titles
            buttons = [];
            a2z_titles.sort();
            for (i = 0; i < a2z_titles.length; i += 1) {
                buttons.push("<input type='button' value='" + a2z_titles[i] + "'/>");
            }
            nodes.a2z.titles.innerHTML = buttons.join("");
        };

        clearContent = function () {
            // helper function to hide details and images whenever a2z index is toggled from artist to title or vice versa
            nodes.details.titles.innerHTML = "";
            nodes.details.artists.innerHTML = "";
            nodes.image.src = "./icons/blank.png";
            nodes.image2.src = "./icons/blank.png";
        };
        // handle a2z index by artist/title
        nodes.a2z.show_artists.onclick = function (evt) {
            nodes.a2z.show_artists.setAttribute("class","active");
            nodes.a2z.show_titles.setAttribute("class","inactive");
            nodes.a2z.artists.style.display = "inline";
            nodes.a2z.titles.style.display = "none";
            clearContent();
        }
        nodes.a2z.show_titles.onclick = function (evt) {
            nodes.a2z.show_artists.setAttribute("class","inactive");
            nodes.a2z.show_titles.setAttribute("class","active");
            nodes.a2z.artists.style.display = "none";
            nodes.a2z.titles.style.display = "inline";
            clearContent();
        }

        // handle clicks on a2z indexes, artists and titles
        nodes.a2z.artists.onclick = function (evt) {
            var arr, i, buttons;
            arr = Object.keys(artists[evt.target.value]);
            arr.sort();
            buttons = [];
            for (i = 0; i < arr.length; i += 1) {
                buttons.push("<input type='button' value='" + arr[i] + "'/>");
            }
            nodes.details.titles.innerHTML = "";
            nodes.details.artists.innerHTML = buttons.join("");
            nodes.image.src = "./icons/blank.png";
            nodes.image2.src = "./icons/blank.png";
        };
        nodes.a2z.titles.onclick = function (evt) {
            var arts, i, buttons;
            buttons = [];
            for (artist in songs) {
                for (i = 0; i < songs[artist].length; i += 1) {
                    rec = recordFromPath(songs[artist][i]);
                    if (rec.a2z.title === evt.target.value) {
                        buttons.push("<input type='button' value='" + rec.title + "' data-path='" + rec.path +"'/>");
                    }
                }
            }
            nodes.details.titles.innerHTML = buttons.join("");
            nodes.image.src = "./icons/blank.png";
            nodes.image2.src = "./icons/blank.png";
        };
        nodes.details.artists.onclick = function (evt) {
            var i, buttons;
            buttons = [];
            songs[evt.target.value].sort();
            for (i = 0; i < songs[evt.target.value].length; i += 1) {
                rec = recordFromPath(songs[evt.target.value][i]);
                buttons.push("<input type='button' value='" + rec.title + "' data-path='" + rec.path +"'/>");
            }
            nodes.details.titles.innerHTML = buttons.join("");
            nodes.image.src = "./icons/blank.png";
            nodes.image2.src = "./icons/blank.png";
            nodes.details.titles.scrollIntoView(true);
        };
        nodes.details.titles.onclick = function (evt) {
            if (evt.target.nodeName !== "INPUT") {
                // do not remove sheet when clicking nav area outside of buttons
                return;
            }
            var path = evt.target.getAttribute("data-path");
            nodes.image.src = path;
            nodes.image.onload = function () {
                nodes.image.scrollIntoView(true);
            };
            // is there a second page?  // TODO: what about third pages? - see Songs.js: Red.Hot.Chili.Peppers/UnderTheBridge.2.chopro.ps-2.png and a few more
            nodes.image2.src = "./icons/blank.png";
            path2 = path.replace("-0.png","-1.png");
            for (i = 0; i < window.SONGS.length -1; i += 1) {
                if (window.SONGS[i] === path2) {
                    nodes.image2.src = path2;
                    break;
                }
            }
        };
        // activate navigation
        elems = document.querySelectorAll('#navigation>input');
        for (j = 0; j < elems.length; j += 1) {
            elems[j].onclick = function (evt) {
                cls = evt.target.getAttribute("data-target");
                if (cls === 'Top') {
                    window.scroll(0,0);
                } else if (cls === 'Artists') {
                    nodes.details.artists.scrollIntoView(true);
                } else if (cls === 'Titles') {
                    nodes.details.titles.scrollIntoView(true);
                } else if (cls === 'Image') {
                    nodes.image.scrollIntoView(true);
                } else {
                    // nothing else for now;
                }
            };
        }
    };
}());
