'use strict';

angular.module('attero')
    .directive('dock', function () {
        return {
            scope: true,
            link: function (scope, element, attrs) {
                var peekAmount = attrs.peek || 20;

                element.addClass('dock');
                element.addClass(attrs.dock);

                // Break execution stack frame to gain access to element dimensions
                setTimeout(function() {
                    var referenceDimension;

                    switch (attrs.dock) {
                        case 'bottom':
                        case 'top':
                            referenceDimension = element.outerHeight();
                            break;
                        case 'left':
                        case 'right':
                            referenceDimension = element.outerWidth();
                            console.log('dock top', attrs.top)
                            element.css('top', attrs.top + 'px');
                            break;
                    }

                    element.css('position', 'absolute');
                    element.css(attrs.dock, peekAmount - referenceDimension);

                    element.on('mouseover', function() {
                        element.css(attrs.dock, '0px');
                    });
                    element.on('mouseout', function() {
                        element.css(attrs.dock, peekAmount - referenceDimension);
                    });

                    // Only enable animations on the dock once this stack frame
                    // execution has finished to prevent it from "jumping" around
                    // the viewport.
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 1);
                }, 1);
            }
        };
    });
