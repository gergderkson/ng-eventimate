angular.module('ngEventimate', []).directive('ngEventimate', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            /**
            *   Parses the key value events and animation names
            */
            var settings = $parse(attrs.ngEventimate)(scope);

            /**
            *   Storage for registered listeners
            */
            var listeners = [];

            /**
            *   Sets up a listener and adds it to the listeners array so 
            *   they can be degristered later. Triggers animation on event.
            *   Check if the trigger was passed as an array and if a postClass was 
            *   defined. The post classs is attached to the element after the animation completes
            */
            var setupListener = function(trigger, animation){
                var triggerName = (angular.isArray(trigger) ? trigger[0] : trigger);
                var postClass = (angular.isArray(trigger) ? trigger[1] || null : null);

                var listener = scope.$on(triggerName, function(){
                    animate(animation, postClass);
                });
                listeners.push(listener);
            }

            /**
            *   Triggers the CSS animation by applying classname and then 
            *   removing once the animation is complete. If a postClass is defined
            *   it is added to the element once the animation is complete.
            */
            var animate = function(animationName, postClass){
                angular.element(element).addClass('animated ' + animationName).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    angular.element(element).removeClass('animated ' + animationName);
                    if(angular.isDefined(postClass)){
                        element.addClass(postClass);
                    }
                });
            };

            /**
            *   Self-invoking init function.
            */
            var init = function(){
                /**
                *   Validates inputs
                */
                if(angular.isObject(settings) === false){
                    console.warn('ngEventimate expects object, given ' + typeof settings);
                    return false;
                }
                /**
                *   Loops each setting and sets up listeners
                */
                angular.forEach(settings, function(trigger, animation){
                    setupListener(trigger, animation);
                });

                /**
                *   Deregisters all listeners when element is destroyed.
                */
                element.on('$destroy', function() {
                    angular.forEach(listeners, function(eventDestroy){
                        if (angular.isFunction(eventDestroy)) {
                            eventDestroy();
                        };
                    });
                });
            }();
        }
    };
}]);