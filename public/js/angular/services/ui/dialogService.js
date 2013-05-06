'use strict';

angular.module('attero')
    .factory('dialogService', function() {
        var stopEvent = function(event) {
            event.stopPropagation();
        }

        return {
            show: function(element, options) {
                var dialog = $('.dialog', element);

                dialog.click(stopEvent);
                dialog.css('width', options.width + 'px');
                dialog.css('height', options.height + 'px');
                dialog.css('margin-top', -options.height/2 + 'px');
                dialog.css('margin-left', -options.width/2 + 'px');

                element.show();
            },
            hide: function(element) {
                element.hide();
            }
        };
    });
