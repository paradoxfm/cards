cardApp.controller('CardEditController', function ($scope, $location, $http, $state) {

    $scope.newCard = {
        fields: []
    };

    $scope.activeField = null;

    $('#cardBodyId').html5imageupload();

    $('#selectedFieldColorId').colorpicker({
        customClass: 'colorpicker-2x',
        sliders: {
            saturation: { maxLeft: 200, maxTop: 200 },
            hue: { maxTop: 200 },
            alpha: { maxTop: 200 }
        }
    }).on('hidePicker', function(event){
        $(event.target).find('input').change();
    });

    $('#ex1').slider().on("slide", function(event) {
        $scope.activeField.fontSize = $(event.target).val() + 'px';
        $scope.$apply();
    });

    $scope.addNewField = function () {
        $scope.newCard.fields.push({
            posTop: 0,
            posLeft: 0,
            title: 'title',
            value: 'value',
            color: '#000000',
            fontSize: '14px'
        });
        refreshDraggable();
    };

    $scope.removeField = function () {
        var ind = $scope.newCard.fields.indexOf($scope.activeField);
        if (ind > -1) {
            $scope.newCard.fields.splice(ind, 1);
            $scope.activeField = null;
        }
    };

    $scope.selectField = function (field) {
        $scope.activeField = field;
        $('#ex1').slider('setValue', parseInt(field.fontSize.replace('px', '')));
        //$('#ex1').slider('refresh');
    };

    $scope.saveNewCard = function () {
        $http({
            method: 'POST',
            url: '/api/cards/saveNew',
            data: $.param($scope.newCard),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (data) {
            $state.go('');
        });
    };

    function refreshDraggable() {
        interact('#cardWrapId .draggable')/*.resizable({
            preserveAspectRatio: true,
            edges: {left: false, right: true, bottom: false, top: false}
        })*/.draggable({
            // enable inertial throwing
            inertia: true,
            snap: {
                targets: [
                    interact.createSnapGrid({x: 5, y: 5})
                ],
                range: Infinity,
                relativePoints: [{x: 0, y: 0}]
            },
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: false,
                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
            },
            // enable autoScroll
            // autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {
            }
        });
    }

    function dragMoveListener(event) {
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
            x = Math.round((parseFloat(target.getAttribute('data-left')) || 0) + event.dx),
            y = Math.round((parseFloat(target.getAttribute('data-top')) || 0) + event.dy);

        // translate the element
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        $scope.activeField.posTop = y;
        $scope.activeField.posLeft = x;
        target.setAttribute('data-left', x);
        target.setAttribute('data-top', y);
    }

});