/*!
 * simplyMap
 * author: Radoslaw Malysa
 * displays the google map and one marker in a container
 * Licensed under the MIT license
 */
;(function($, window, document, undefined) {

	"use strict";

    var pluginName = "simplyMap",
        defaults = {
            zoom: 10,
            Lat: '51.402196',
            Lng: '21.145046',
            title: null,
            markerIco: 'images/marker.svg'
        };
        

    function Plugin (element, options) {
        this.element = element;
        
        //optional config in html tag
        var htmlOptions = {
            zoom: ($(this.element)[0].hasAttribute('data-zoom')) ? parseInt($(this.element).attr('data-zoom')) : null,
            Lat: ($(this.element)[0].hasAttribute('data-Lat')) ? $(this.element).attr('data-Lat') : null,
            Lng: ($(this.element)[0].hasAttribute('data-Lng')) ? $(this.element).attr('data-Lng') : null,
            title: ($(this.element)[0].hasAttribute('data-title')) ? $(this.element).attr('data-title') : null
        };
        
        this.settings = $.extend( {}, defaults, htmlOptions, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend( Plugin.prototype, {
        init: function() {
            this.initializeMap();
        },
        initializeMap: function () {
            var map;
            var gmarkers = [];
            
            var infowindow = new google.maps.InfoWindow(),
            bounds = new google.maps.LatLngBounds(),
            marker, i,
            myLatLng = new google.maps.LatLng(this.settings.Lat, this.settings.Lng),
            title = this.settings.title;
            
            var styles = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];
        
            var mapOptions = {
                zoom: this.settings.zoom,
                center: myLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: styles,
                scrollwheel: false
            };
            
            map = new google.maps.Map($(this.element).get(0), mapOptions);
        
            google.maps.event.addListener(map, 'click', function() {
                infowindow.close();
            });
            //center after resize
            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
            //activate map on click
            google.maps.event.addListener(map, 'click', function(){
                this.setOptions({scrollwheel:true});
            });
            //marker
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: this.settings.markerIco,
                animation: google.maps.Animation.BOUNCE
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    if (title) {
                        infowindow.setContent(title); 
                        infowindow.open(map, marker);
                    }
                };
            })(marker, i));
            
            bounds.extend(myLatLng);
            gmarkers.push(marker);
            
            //log
            google.maps.event.addListener(map, 'idle', function() {
                console.log('Map initialised');
            });
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };
    
    // start
	$(function() {
		$(".simplymap").simplyMap();
	});

} )(jQuery, window, document);