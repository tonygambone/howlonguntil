'use strict';

(function() {
    document.addEventListener("DOMContentLoaded", function(e) {
        // update duration displays
        window.setInterval(function() {
            var elements = document.querySelectorAll('.until[data-target]');
            elements.forEach(function(el) {
                var target = el.getAttribute('data-target');
                el.innerHTML = timeRemaining(target);
            });
        }, 1000);

        // initial setup
        refresh();
    });

    // pull the data and rebuild the UI
    function refresh() {
        fetch('events.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(events) {
                // calculate next instance and sort events
                events = events.sort(function(a, b) {
                    a._nextInstance = a._nextInstance || getNextInstance(a);
                    b._nextInstance = b._nextInstance || getNextInstance(b);
                    return a._nextInstance.valueOf() - b._nextInstance.valueOf();
                });

                var container = document.getElementById('container');
                container.innerHTML = "";
                events.forEach(function (evt) {
                    // default display format
                    evt.displayFormat = evt.displayFormat || "dddd, MMMM Do, YYYY";

                    // hide past events after a certain time
                    evt.hideAfter = evt.hideAfter || [1, 'day'];
                    if (evt._nextInstance.diff(moment(), evt.hideAfter[1]) <= -evt.hideAfter[0]) return;

                    // build dom elements
                    var el = document.createElement('div');
                    el.setAttribute('class', 'event');

                    var title = document.createElement('h3');
                    title.innerHTML = evt.name;
                    el.appendChild(title);

                    var ts = document.createElement('div');
                    ts.setAttribute('class', 'timestamp');
                    ts.innerHTML = evt._nextInstance.format(evt.displayFormat);
                    el.appendChild(ts);

                    var until = document.createElement('div');
                    until.setAttribute('class', 'until');
                    until.setAttribute('data-target', evt._nextInstance.toISOString());
                    until.innerHTML = timeRemaining(evt._nextInstance);
                    el.appendChild(until);

                    container.appendChild(el);
                });
            });
    }

    // calculate the next instance of an event
    function getNextInstance(evt) {
        var startTime = moment(evt.startTime);
        switch (evt.repeat) {
            case "once":
                break;
            case "year":
            case "month":
            case "week":
            case "day":
            case "hour":
            case "minute":
            case "second":
                while (startTime.diff() < 0) {
                    startTime.add(1, evt.repeat);
                }
        }
        return startTime;
    }

    // get a string that shows the remaining time (or time since)
    function timeRemaining(target) {
        var diff = moment(target).diff(moment(), 'ms', true);
        if (diff <= 0 && diff >= -2000) {
            refresh();
        }
        var str = moment.duration(diff).format('d [days], h [hours], m [minutes], s [seconds]');
        str = str.replace(/(^| )(1 )(.+?)s/g, '$1$2$3'); // singular
        if (diff < 0) {
            str = str.replace(/^-?(.*)$/, '$1 ago');
        }
        return str;
    }
})();